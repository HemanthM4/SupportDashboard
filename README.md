# Support Dashboard

A React + Vite support ticket dashboard with a Node/Express backend for assignee lookup and assignment notifications.

## Features

- List and board views for support tickets
- Create, edit, assign, and track tasks
- Assignee search from Microsoft Graph or mock users
- Assignment notification endpoint for Outlook/SMTP delivery
- Local task persistence in browser storage

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Express
- Microsoft Graph API

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in your values.

3. Start the backend:

```bash
node server.js
```

4. Start the frontend:

```bash
npm run dev
```

## Environment Notes

- `.env` is ignored and should not be committed.
- Use `USE_GRAPH_API=true` to load real company users from Microsoft Graph.
- Outlook email notifications require valid SMTP settings.

## Useful Commands

```bash
npm run dev
npm run build
node server.js
```

## Additional Docs

- [SETUP.md](./SETUP.md)
- [QUICKSTART.md](./QUICKSTART.md)
