const iniciarSesion = (req, res) => {
    
    try {
        //simular bd de un usuario registrado
        const userBd = { usuario: "Jose Luis", clave: "123" }
        const {usuario, clave} = req.body
        //comparar con userBD
        if(userBd.usuario !== usuario || userBd.clave !== clave){
            res.json({mensaje: "Credenciales incorrectas"})
        }

        res.json({mensaje: "Usuario Bienvenido"})


    } catch (error) {
        res.json({error: error})
    }
}
const registrarse = async (req, res) => {
    try {
        const datos = req.body
        res.json({datosRegistro: datos})
    } catch (error) {
        res.json({error: error})
    }
}

module.exports = { iniciarSesion, registrarse };