const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const AuthService = {
    /**
     * Kullanıcı kayıt işlemi 
     */
    register : async (fullname, email, password, role) => {
        //Şifreyi hashleyelim.
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create(fullname, email, hashedPassword, role);
        return {id : userId, email, fullname, role};
    },
    /**
     * Kullanıcı giriş işlemi
     */
    login : async (email, password) => {
        const user = await User.findByEmail(email);
        if(!user) throw new Error('Kullanıcı bulunamadı!');

        //Kullanıcının haslenmiş şifresi ile girilen şifrenin (hash) karşılaştırılması
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw new Error('Hatalı şifre!');

        //Kullanıcıya özel bir token oluşturalım
        const token = jwt.sign(
            {id : user.id , role : user.role},
            process.env.JWT_SECRET,
            {expiresIn : process.env.JWT_EXPIRES_IN}
        );

        return {
            token,
            user : {id : user.id, fullname : user.fullname, email : user.email, role : user.role}
        };
    },
}

module.exports = AuthService;