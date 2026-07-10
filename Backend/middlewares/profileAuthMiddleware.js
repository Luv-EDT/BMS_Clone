
const profileAuthMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.user.isProfile;

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

module.exports = profileAuthMiddleware;