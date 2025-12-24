const AuthService = require("../services/authService");

const AuthController = {
    /**
     * Kayıt olma isteğini karşılama
     */
    register : async (req, res) => {
        try{
            const {fullname, email, password, role} = req.body;
            const newUser = await AuthService.register(fullname, email, password, role);

            res.status(201).json({
                message : 'Kullanıcı başarılı bir şekilde oluşturuldu!',
                user : newUser
            });
        }catch(error){
            res.status(400).json({error : error.message});
        }
    },
    /**
     * Login isteğini karşılama
     */
    login : async (req, res) => {
        try {
            const {email, password} = req.body;
            const result = await AuthService.login(email,password);
            res.status(200).json({
                message : "Giriş başarılı.",
                token : result.token,
                user : result.user
            });
        }catch(error){
            res.status(401).json({error : error.message});
        }
    }
};

module.exports = AuthController;