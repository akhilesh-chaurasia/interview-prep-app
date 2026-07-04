import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAllUsers, updateUserRole, deleteUser } from '../../../api/admin.api';
import toast from 'react-hot-toast';
import './AdminDashboard.scss';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchDashboardStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            toast.error('Failed to fetch dashboard stats');
        }
    };

    const fetchUsers = async (pageNum) => {
        try {
            setLoading(true);
            const data = await getAllUsers(pageNum, 10);
            setUsers(data.users);
            setTotalPages(data.pagination.pages);
        } catch (err) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            toast.success('User role updated successfully');
            fetchUsers(page);
        } catch (err) {
            toast.error('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await deleteUser(userId);
            toast.success('User deleted successfully');
            fetchUsers(page);
            fetchDashboardStats();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (!stats) {
        return <div className="admin-dashboard__loading">Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1 className="admin-dashboard__title">Admin Dashboard</h1>
            
            <div className="admin-dashboard__stats">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Users</h3>
                    <p className="stat-value">{stats.stats.activeUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Interviews</h3>
                    <p className="stat-value">{stats.stats.totalInterviews}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Sessions</h3>
                    <p className="stat-value">{stats.stats.totalSessions}</p>
                </div>
                <div className="stat-card">
                    <h3>Admin Users</h3>
                    <p className="stat-value">{stats.stats.adminUsers}</p>
                </div>
            </div>

            <div className="admin-dashboard__users">
                <h2>User Management</h2>
                {loading ? (
                    <div className="admin-dashboard__loading">Loading users...</div>
                ) : (
                    <>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Verified</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="role-select"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>{user.isVerified ? '✓' : '✗'}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="pagination-btn"
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="pagination-btn"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="admin-dashboard__recent">
                <h2>Recent Users</h2>
                <ul className="recent-users-list">
                    {stats.recentUsers.map((user) => (
                        <li key={user._id} className="recent-user-item">
                            <span className="recent-user-name">{user.username}</span>
                            <span className="recent-user-email">{user.email}</span>
                            <span className={`recent-user-role role-${user.role}`}>{user.role}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
