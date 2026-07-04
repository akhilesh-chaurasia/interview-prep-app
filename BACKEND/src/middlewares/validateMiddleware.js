const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Validation Error",
            errors: err.errors?.map(e => ({
                field: e.path.join("."),
                message: e.message
            })) || [{ message: err.message }]
        });
    }
};

module.exports = validate;