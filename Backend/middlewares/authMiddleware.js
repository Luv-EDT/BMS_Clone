//  create an authmiddleware which checks, 

// 1st check: if the jwt token is matching with the key in authKey in teh .env file.
// 2nd check: If the JWT is not expired. 
// if true 
// then destructure teh JWT, extract the user id, and then put the user information (-password) in the req.body
// then use the next()

// and if not authorised, then the response will be res.status().json({status:false, message: "not authorise/jwt expired"} ), 

const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const authMiddleware = async (req, res, next) => {
    try {

        // Authorization: Bearer xxxxxxxxxxxxx
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success:false,
                message: "Token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(token, process.env.AUTH_KEY);

        // Get latest user from DB
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Make user available to next middleware/route
        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            error        });

    }
};

module.exports = authMiddleware;