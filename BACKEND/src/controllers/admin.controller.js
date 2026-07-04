const userModel = require("../models/user.model");
const interviewReportModel = require("../models/interviewReport.model");
const interviewSessionModel = require("../models/interviewSession.model");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalInterviews = await interviewReportModel.countDocuments();
        const totalSessions = await interviewSessionModel.countDocuments();
        const activeUsers = await userModel.countDocuments({ isVerified: true });
        const adminUsers = await userModel.countDocuments({ role: 'admin' });

        const recentUsers = await userModel
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('username email role isVerified createdAt');

        res.json({
            stats: {
                totalUsers,
                totalInterviews,
                totalSessions,
                activeUsers,
                adminUsers
            },
            recentUsers
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await userModel
            .find()
            .select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await userModel.countDocuments();

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User role updated successfully', user });
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).json({ message: 'Error updating user role' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        await userModel.findByIdAndDelete(userId);
        
        await interviewReportModel.deleteMany({ user: userId });
        await interviewSessionModel.deleteMany({ user: userId });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser
};
