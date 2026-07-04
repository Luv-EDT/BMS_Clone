
const adminAuthMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.user.isAdmin;

        console.log(authHeader)

        if (!authHeader) {
            return res.status(401).json({
                success:false,
                message: "Permission Not Granted for this request"
            });
        }

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            error
        });

    }
};

module.exports = adminAuthMiddleware;