async function requireAdmin(req, res, next) {
    try {
        // Check role from JWT token directly (faster and more reliable)
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin check failed - User:', req.user);
            return res.status(403).json({
                message: "Access denied. Admin privileges required."
            });
        }

        next();
    } catch (err) {
        console.error('Admin middleware error:', err);
        return res.status(500).json({
            message: "Error verifying admin privileges"
        });
    }
}

module.exports = { requireAdmin };
