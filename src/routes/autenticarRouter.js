const {Router} = require("express")

const enrutadorAuth = Router();

//importación del controladores
const {iniciarSesion, registrarse} = require("../controllers/autenticarController")
//const registrarse = require("../controllers/autenticarController")


//ruta de registro en el sistema
enrutadorAuth.post("/registro", registrarse) 


//ruta de inicio de sesion 

enrutadorAuth.post("/login", iniciarSesion)

//se realiza todas las rutas, con (POST, PUT, DELETE)
module.exports = enrutadorAuth;