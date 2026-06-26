// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "POLINELA_SECRET_KEY_SUPER_SECURE"; // Sebaiknya simpan di .env

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ status: 'error', message: 'No token provided.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized! Token expired or invalid.' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userName = decoded.nama;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.userRole === 'superadmin' || req.userRole === 'admin_gedung') {
            next();
        } else {
            res.status(403).json({ status: 'error', message: 'Require Admin Role!' });
        }
    });
};

module.exports = {
    verifyToken,
    verifyAdmin,
    SECRET_KEY
};
