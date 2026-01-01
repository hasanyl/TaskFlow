const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }catch(error){
            res.status(401).json({error : "Yetkisiz erişim, geçersiz token!"});
        }
    }
    if(!token){
        res.status(401).json({error : "Yetkisiz erisim, token bulunamadı!"});
    }
}

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                error : 'Bu işlemi yapmak için yeterli yetkiniz yok!'
            });
        }
        next();
    };
};

module.exports = {protect, restrictTo};