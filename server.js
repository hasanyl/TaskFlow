const db = require("./src/config/db");
const app = require("./src/app");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try{
        app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda hazır!`);
        });
    }catch(error){
        console.error('Sunucu başlatılamadı:', error);
    }
}

startServer();