import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let graphAccessToken = null;

function getEnvValue(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }
  return '';
}

const mockUsers = [
  {
    id: '1',
    name: 'Kunguma Balaji',
    email: 'kunguma.balaji@company.com',
    initials: 'KB',
    avatar: '#6554C0',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@company.com',
    initials: 'JS',
    avatar: '#6554C0',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    initials: 'SJ',
    avatar: '#6554C0',
  },
  {
    id: '4',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    initials: 'MC',
    avatar: '#6554C0',
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    initials: 'ED',
    avatar: '#6554C0',
  },
];

function isGraphEnabled() {
  return process.env.USE_GRAPH_API === 'true';
}

function getMissingGraphConfig() {
  const missing = [];
  if (!getEnvValue('AZURE_TENANT_ID', 'MICROSOFT_TENANT_ID')) missing.push('AZURE_TENANT_ID');
  if (!getEnvValue('AZURE_CLIENT_ID', 'MICROSOFT_CLIENT_ID')) missing.push('AZURE_CLIENT_ID');
  if (!getEnvValue('AZURE_CLIENT_SECRET', 'MICROSOFT_CLIENT_SECRET')) missing.push('AZURE_CLIENT_SECRET');
  return missing;
}

function getMissingSmtpConfig() {
  return ['NOTIFY_FROM_EMAIL', 'SMTP_USER', 'SMTP_PASS']
    .filter((key) => !process.env[key]);
}

function getGraphTenantId() {
  return getEnvValue('AZURE_TENANT_ID', 'MICROSOFT_TENANT_ID') || 'common';
}

function buildInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

function normalizeGraphUser(user) {
  const email = user.mail || user.userPrincipalName || '';
  return {
    id: user.id,
    name: user.displayName,
    email,
    initials: buildInitials(user.displayName),
    avatar: '#6554C0',
  };
}

async function getGraphAccessToken() {
  const missingGraphConfig = getMissingGraphConfig();

  if (missingGraphConfig.length > 0) {
    throw new Error(`Missing Microsoft Graph config: ${missingGraphConfig.join(', ')}`);
  }

  try {
    const tokenUrl = `https://login.microsoftonline.com/${getGraphTenantId()}/oauth2/v2.0/token`;
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: getEnvValue('AZURE_CLIENT_ID', 'MICROSOFT_CLIENT_ID'),
        client_secret: getEnvValue('AZURE_CLIENT_SECRET', 'MICROSOFT_CLIENT_SECRET'),
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!response.ok) {
      let details = '';
      try {
        const errorBody = await response.json();
        details = errorBody.error_description || errorBody.error || JSON.stringify(errorBody);
      } catch {
        details = await response.text();
      }
      throw new Error(`Failed to get token (${response.status}): ${details}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error('Token response did not include access_token');
    }
    return data.access_token;
  } catch (error) {
    console.error('Error getting Graph token:', error.message);
    throw error;
  }
}

async function getDirectoryUsers(query = '') {
  if (isGraphEnabled()) {
    if (!graphAccessToken) {
      graphAccessToken = await getGraphAccessToken();
    }

    if (graphAccessToken) {
      const baseUrl = 'https://graph.microsoft.com/v1.0/users?$select=id,displayName,mail,userPrincipalName&$top=100';
      const url = query
        ? `${baseUrl}&$search="${encodeURIComponent(query)}"`
        : baseUrl;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${graphAccessToken}`,
          ConsistencyLevel: 'eventual',
        },
      });

      if (!response.ok) {
        let details = '';
        try {
          const errorBody = await response.json();
          details =
            errorBody?.error?.message ||
            errorBody?.error_description ||
            errorBody?.error ||
            JSON.stringify(errorBody);
        } catch {
          details = await response.text();
        }
        throw new Error(`Graph API error (${response.status}): ${details}`);
      }

      const data = await response.json();
      return (data.value || [])
        .filter((user) => user.displayName)
        .map(normalizeGraphUser)
        .filter((user) => user.email);
    }

    throw new Error('Microsoft Graph is enabled but no access token was returned.');
  }

  const normalizedQuery = query.trim().toLowerCase();
  return normalizedQuery
    ? mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(normalizedQuery) ||
          user.email.toLowerCase().includes(normalizedQuery)
      )
    : mockUsers;
}

async function sendAssignmentEmail({ task, previousAssigneeEmail }) {
  const assignee = task?.assignee;

  if (!assignee?.email) {
    return { skipped: true, reason: 'missing-assignee-email' };
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const senderEmail = process.env.NOTIFY_FROM_EMAIL || smtpUser;
  const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';

  const missingSmtpConfig = [
    !smtpHost ? 'SMTP_HOST' : null,
    ...getMissingSmtpConfig(),
  ].filter(Boolean);

  if (missingSmtpConfig.length > 0) {
    return {
      skipped: true,
      reason: 'smtp-not-configured',
      message: `Assignment saved, but SMTP settings are missing: ${missingSmtpConfig.join(', ')}.`,
    };
  }

  const { default: nodemailer } = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-GB')
    : 'Not set';
  const descriptionHtml = task.description
    ? `<p><strong>Description:</strong><br/>${String(task.description).replace(/\n/g, '<br/>')}</p>`
    : '';

  await transporter.sendMail({
    from: senderEmail,
    to: assignee.email,
    subject: `Assigned: ${task.id} - ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #172b4d;">
        <h2>You have been assigned a support task</h2>
        <p>Hello ${assignee.name},</p>
        <p>You have been assigned to <strong>${task.id}</strong>.</p>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due date:</strong> ${dueDate}</p>
        ${descriptionHtml}
        <p><a href="${appBaseUrl}">Open Support Dashboard</a></p>
        ${previousAssigneeEmail ? `<p style="font-size: 12px; color: #5e6c84;">Previous assignee: ${previousAssigneeEmail}</p>` : ''}
      </div>
    `,
  });

  return { skipped: false, recipientEmail: assignee.email };
}

app.get('/api/users', async (req, res) => {
  try {
    const users = await getDirectoryUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch users',
      users: isGraphEnabled() ? [] : mockUsers,
    });
  }
});

app.get('/api/users/search/:query', async (req, res) => {
  try {
    const results = await getDirectoryUsers(req.params.query);
    res.json(results);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users', users: [] });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await getDirectoryUsers();
    const user = users.find((item) => item.id === req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/assignments/notify', async (req, res) => {
  try {
    const result = await sendAssignmentEmail(req.body);
    res.json({ ok: true, ...result });
  } catch (error) {
    console.error('Error sending assignment email:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to send assignment email',
      details: error.message,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    graphApiEnabled: isGraphEnabled(),
    missingGraphConfig: isGraphEnabled() ? getMissingGraphConfig() : [],
    smtpConfigured: Boolean(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.NOTIFY_FROM_EMAIL
    ),
    missingSmtpConfig: getMissingSmtpConfig(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`\nSupport Ticket API Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for http://localhost:5173\n');
  if (isGraphEnabled()) {
    console.log('Microsoft Graph API enabled');
  } else {
    console.log('Using mock users (configure .env to use Microsoft Graph)');
  }
  if (process.env.SMTP_HOST) {
    console.log('Assignment email notifications enabled');
  }
});
