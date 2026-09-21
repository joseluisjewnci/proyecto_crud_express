const jwtoken = require("jsonwebtoken")
const autenticacion = (req, res, next) => {
    const token = req.header("campoAutentificar")?.split(" ")[1]
    if(
        !token){
        return res.status(401).json({Mensaje: "Acceso denegado, no provee token"})
    }
    jwtoken.verify(token, process.env.JWT_SECRETO, (error , usuario)=>{
    if(error){
        return res.status(403).json({Mensaje: "Token invalido o expirado."})
    }
        req.usuario = usuario
        next()
    })
}

module.exports = autenticacion