import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        console.error("auth error:", error);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;