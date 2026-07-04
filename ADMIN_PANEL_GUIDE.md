# Admin Panel Implementation Guide

## Overview
The Admin Panel feature has been successfully implemented in the YT-GENAI project. This feature allows administrators to manage users, view platform statistics, and perform administrative tasks.

## Implementation Details

### Backend Changes

1. **User Model Updated** (`BACKEND/src/models/user.model.js`)
   - Added `role` field with enum values: `['user', 'admin']`
   - Default role is set to `'user'`

2. **Admin Middleware Created** (`BACKEND/src/middlewares/admin.middleware.js`)
   - `requireAdmin` middleware to protect admin-only routes
   - Verifies user has admin role before allowing access

3. **Admin Controller Created** (`BACKEND/src/controllers/admin.controller.js`)
   - `getDashboardStats`: Fetch platform statistics (users, interviews, sessions)
   - `getAllUsers`: Get paginated list of all users
   - `updateUserRole`: Change user role between 'user' and 'admin'
   - `deleteUser`: Delete a user and their associated data

4. **Admin Routes Created** (`BACKEND/src/routes/admin.routes.js`)
   - `GET /api/admin/dashboard` - Get dashboard stats
   - `GET /api/admin/users` - Get all users with pagination
   - `PATCH /api/admin/users/:userId/role` - Update user role
   - `DELETE /api/admin/users/:userId` - Delete user

5. **App Updated** (`BACKEND/src/app.js`)
   - Admin routes registered at `/api/admin`

6. **Auth Controller Updated** (`BACKEND/src/controllers/auth.controller.js`)
   - JWT tokens now include `role` field
   - API responses (register, login, get-me) now include `role` field

### Frontend Changes

1. **Admin API Service Created** (`FRONTEND/src/api/admin.api.js`)
   - Functions to call admin backend endpoints
   - Handles dashboard stats, user management, role updates, and user deletion

2. **Admin Dashboard Component Created** (`FRONTEND/src/features/admin/pages/AdminDashboard.jsx`)
   - Displays platform statistics
   - User management table with pagination
   - Role change functionality
   - User deletion functionality
   - Recent users list

3. **Admin Dashboard Styles Created** (`FRONTEND/src/features/admin/pages/AdminDashboard.scss`)
   - Responsive design
   - Stat cards
   - User table with role selector
   - Pagination controls

4. **Router Updated** (`FRONTEND/src/app.route.jsx`)
   - Added `/admin` route protected by authentication

5. **Navbar Updated** (`FRONTEND/src/components/Navbar.jsx`)
   - Added "Admin Panel" link visible only to users with `role: 'admin'`

## How to Use the Admin Panel

### Step 1: Set Up an Admin User

Since the default role for new users is `'user'`, you need to manually set a user as admin in the database:

#### Option A: Using MongoDB Shell
```bash
# Connect to your MongoDB database
mongosh

# Switch to your database
use yt-genai

# Update a user to admin role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

#### Option B: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find the user you want to make admin
5. Edit the document and set `role` field to `"admin"`

### Step 2: Access the Admin Panel

1. Start the backend server:
   ```bash
   cd BACKEND
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd FRONTEND
   npm run dev
   ```

3. Login with the admin user account

4. You will see an "Admin Panel" link in the navigation bar (only visible to admins)

5. Click on "Admin Panel" to access the dashboard

### Step 3: Admin Panel Features

#### Dashboard Statistics
- **Total Users**: Count of all registered users
- **Active Users**: Count of verified users
- **Total Interviews**: Count of interview reports generated
- **Total Sessions**: Count of interview sessions completed
- **Admin Users**: Count of users with admin role

#### User Management
- View all users in a paginated table
- See user details: username, email, role, verification status, creation date
- Change user role using the dropdown selector
- Delete users (admin users cannot be deleted)
- Navigate through pages using pagination controls

#### Recent Users
- Quick view of the 5 most recently registered users

### Step 4: Managing Users

#### Promote a User to Admin
1. Go to the Admin Panel
2. Find the user in the user table
3. Use the role dropdown to change from "user" to "admin"
4. The change is saved automatically

#### Demote an Admin to User
1. Go to the Admin Panel
2. Find the admin user in the user table
3. Use the role dropdown to change from "admin" to "user"
4. The change is saved automatically

#### Delete a User
1. Go to the Admin Panel
2. Find the user in the user table
3. Click the "Delete" button
4. Confirm the deletion
5. The user and all their associated data (interviews, sessions) will be deleted

**Note**: Admin users cannot be deleted through the admin panel.

## Security Considerations

- All admin routes are protected by both authentication (`authUser` middleware) and authorization (`requireAdmin` middleware)
- Only users with `role: 'admin'` can access admin features
- The admin panel link is only visible in the navbar for admin users
- JWT tokens include the role field for client-side role checks
- Admin users cannot be deleted through the admin panel to prevent lockout scenarios

## API Endpoints

### GET /api/admin/dashboard
- **Access**: Admin only
- **Response**: Platform statistics and recent users

### GET /api/admin/users?page=1&limit=10
- **Access**: Admin only
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Users per page (default: 10)
- **Response**: Paginated list of users

### PATCH /api/admin/users/:userId/role
- **Access**: Admin only
- **Body**: `{ "role": "admin" }` or `{ "role": "user" }`
- **Response**: Updated user object

### DELETE /api/admin/users/:userId
- **Access**: Admin only
- **Response**: Success message

## File Structure

```
BACKEND/src/
├── controllers/
│   └── admin.controller.js (NEW)
├── middlewares/
│   └── admin.middleware.js (NEW)
├── models/
│   └── user.model.js (UPDATED - added role field)
├── routes/
│   └── admin.routes.js (NEW)
└── controllers/
    └── auth.controller.js (UPDATED - include role in JWT and responses)

FRONTEND/src/
├── api/
│   └── admin.api.js (NEW)
├── features/
│   └── admin/
│       └── pages/
│           ├── AdminDashboard.jsx (NEW)
│           └── AdminDashboard.scss (NEW)
├── app.route.jsx (UPDATED - added admin route)
└── components/
    └── Navbar.jsx (UPDATED - added admin link)
```

## Testing the Implementation

1. Create a test user account
2. Set the user's role to 'admin' in the database
3. Login with the admin account
4. Verify the "Admin Panel" link appears in the navbar
5. Navigate to the admin panel
6. Verify dashboard statistics are displayed
7. Test role changes on other users
8. Test user deletion (on non-admin users)
9. Logout and login with a regular user
10. Verify the "Admin Panel" link is not visible

## Troubleshooting

**Admin Panel link not showing:**
- Verify the user's role is set to 'admin' in the database
- Clear browser cookies and login again
- Check browser console for errors

**Access denied errors:**
- Verify the JWT token includes the role field
- Check that the admin middleware is properly configured
- Ensure the user is authenticated

**User role not updating:**
- Check browser console for API errors
- Verify the backend is running
- Check MongoDB connection

## Future Enhancements

Potential improvements for the admin panel:
- User search and filtering
- Bulk user operations
- User activity logs
- Interview report management
- Session management
- Analytics and reporting
- Email management
- System configuration
- Audit logs
