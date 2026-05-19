# Quick Start Guide

## 🚀 Start the Application

### Simple Way (Recommended):

**Terminal 1 - Backend API:**
```bash
node server.js
```
Expected output:
```
🚀 Support Ticket API Server running on http://localhost:5001
📝 CORS enabled for http://localhost:5175
📦 Using mock users (configure .env to use Microsoft Graph)
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Expected output:
```
VITE ready on http://localhost:5175
```

Then open **http://localhost:5175** in your browser! ✅

---

## ✨ What Works Out of the Box

### Mock Users (Already Configured)
When you open the app and click "+ Create" or edit a task, you can now:

1. ✅ **Assign tasks to company employees**
   - Assignee dropdown shows 5 pre-loaded users
   - Kunguma Balaji (KB)
   - John Smith (JS)
   - Sarah Johnson (SJ)
   - Mike Chen (MC)
   - Emily Davis (ED)

2. ✅ **Search by name or email**
   - Type in the assignee field to filter users

3. ✅ **Task modal with full user management**
   - Click any task ID to open the detailed modal
   - Change assignee from the right sidebar
   - All changes persist in localStorage

---

## 🔗 Microsoft Graph API (Optional - Enterprise Only)

### To Enable Real Company Users:

1. **Set up Azure AD App** (see SETUP.md for detailed steps)

2. **Update `.env`:**
   ```env
   USE_GRAPH_API=true
   AZURE_CLIENT_ID=your-app-id
   AZURE_CLIENT_SECRET=your-secret
   AZURE_TENANT_ID=your-tenant-id
   ```

3. **Restart backend and app** - users will now load from your company's Azure AD

---

## 📍 Current Setup

| Component | URL | Status |
|-----------|-----|--------|
| Frontend (Vite) | http://localhost:5175 | ✅ Running |
| Backend API | http://localhost:5001 | ✅ Running |
| Mock Users | /api/users | ✅ Ready |
| Microsoft Graph | Optional | ⚙️ Configure in .env |

---

## 🎯 Try These Features Now

### 1. Create a Task with Assignment
- Click **"+ Create"** button
- Enter title: "Test task"
- Select **Priority**: Medium
- Select **Assignee**: "Kunguma Balaji"
- Click "Create"

### 2. Edit a Task
- Click on any task card or task ID (KAN-1, KAN-2, KAN-3)
- Scroll to **Assignee** section in the right panel
- Change assignee
- Click "Save"

### 3. Search Users
- Click "+ Create"
- In Assignee field, type: "john" or "smith"
- Results filter in real-time

### 4. Board View
- Click the grid icon (top right) to switch to board view
- Each column shows all tasks for that status
- Drag cards between columns to change status

---

## 🆘 Troubleshooting

**Q: "Failed to fetch users" error?**
- Verify backend is running: `node server.js`
- Check port 5001 is accessible
- Check console for detailed error

**Q: Assignee dropdown is empty?**
- Reload the page
- Check browser console (F12)
- Verify backend API is responding

**Q: Tasks not saving?**
- Tasks are saved to localStorage (browser storage)
- Check: DevTools → Application → Local Storage
- Clear cache and reload if needed

**Q: Want to use Microsoft Graph?**
- See **SETUP.md** for complete Azure AD setup instructions
- Takes about 10-15 minutes to configure

---

## 📝 API Documentation

### Get Mock Users
```bash
curl http://localhost:5001/api/users
```

Response:
```json
[
  {
    "id": "1",
    "name": "Kunguma Balaji",
    "email": "kunguma.balaji@company.com",
    "initials": "KB",
    "avatar": "#6554C0"
  }
  // ... more users
]
```

### Search Users
```bash
curl http://localhost:5001/api/users/search/john
```

### Health Check
```bash
curl http://localhost:5001/api/health
```

---

## 🎨 UI Features Included

✅ **List View**
- Search, sort, filter tasks
- Checkbox selection
- Edit/Delete per task

✅ **Board View (Kanban)**
- Drag & drop between columns
- Task cards with priority
- Create issue per column

✅ **Task Details Modal**
- Full task editing
- User assignment from company directory
- Comments & activity tracking
- Description editor

✅ **User Selection**
- Dropdown with all company users
- Search functionality
- Real-time filtering
- Email display

---

## 🚀 Next: Production Deployment

When ready, check SETUP.md for:
- Building for production
- Connecting to a real database
- Deploying to cloud (Azure, AWS, etc.)
- Setting up CI/CD pipeline

---

**You're all set!** 🎉 Start with mock users, and upgrade to Microsoft Graph when you're ready!
