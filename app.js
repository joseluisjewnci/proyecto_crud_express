require('dotenv').config();
const express = require('express');
const app = express();
const mipuerto = process.env.MIPUERTO || 3003; //middleware body-parse

//importar mis middleware
const registroMiddleware = require("./src/middleware/registroMiddleware")

const manejadorErroresMiddleware = require("./src/middleware/manejadorErroresMiddleware");

const autenticacionMiddleware = require  ("./src/middleware/autenticacionMiddleware");
const jwtoken = require("jsonwebtoken")

const sistemaArchivo = require("fs");
const ruta = require("path");
const rutaMiArchivo = ruta.join (__dirname, "datos.json");
const {
    validarNombre,
    validarCorreo
} = require("./src/validaciones/validaciones");

//importar multer
const multer = require("multer");
const { error } = require('console');

//almacenamiento
const almacen = multer.diskStorage({
    destination: (req, file, cb)=>{cb (null, "misImagenes/")},
    filename: (req,file, cb)=>{
        const extension = ruta.extname(file.originalname)
        cb (null, `${Date.now()}${extension}`)}  //callback

});

const subir = multer ({storage: almacen})



app.use(express.json())

app.use(express.urlencoded({extended: true}))

//usar nuestro middleware
app.use(registroMiddleware)




app.get("/",(_,res)=>{
    res.send('API Rest Full con express');
});

app.get("/api/aprendices",(req , res)=>{
    
    // res.status(200).json({mesagge: 'lista aprendices'});
    sistemaArchivo.readFile(rutaMiArchivo , "utf-8", (error , datos )=>{
        if (error) res.status(500).json({error : "no se puede leer el archivo"});
        const listaAprendices = JSON.parse(datos)
        res.status(200).json({Listado: listaAprendices})}
    )
});

//validar lo de la tarea, nombre y correo 
app.post("/api/aprendices", subir.single("imagen"),(req,res)=>{

    if (!validarNombre(req.body.nombre)) {
        return res.status(400).json({
            error: "El nombre debe tener mínimo 3 letras"
        });
    }

    if (!validarCorreo(req.body.correo)) {
        return res.status(400).json({
            error: "El correo debe ser un Gmail válido"
        });
    }

    const datosAprendiz = req.body
    datosAprendiz.id = Date.now()//id 
    datosAprendiz.imagen= req.file? `/misImagenes/${req.file.filename}` : "sin Imagen" 
    sistemaArchivo.readFile(rutaMiArchivo , "utf-8", (error , datos )=>{
        if (error) res.status(500).json({error : "no se puede leer el archivo"});
        const listaAprendices = JSON.parse(datos)
        listaAprendices.push(datosAprendiz)
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error)=>{
        if (error) res.status(500).json({Error: "no se puede escribir en le file"});
        res.status(201).json({mensaje: "creado", Datos: datosAprendiz})}
        
    )})
});
    

app.put("/api/aprendices/:id", subir.single("imagen"), (req, res) => {

    const id = Number(req.params.id);

    sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos) => {

        if (error) {
            return res.status(500).json({
                error: "No se puede leer el archivo"
            });
        }

        const listaAprendices = JSON.parse(datos);

        const indice = listaAprendices.findIndex(
            aprendiz => Number(aprendiz.id) === id
        );

        if (indice === -1) {
            return res.status(404).json({
                error: "Aprendiz no encontrado"
            });
        }

        listaAprendices[indice] = {
            ...listaAprendices[indice],
            ...req.body,
            id: id
        };

        // Si se envió una nueva imagen, actualizarla
        if (req.file) {
            listaAprendices[indice].imagen =
                `/misImagenes/${req.file.filename}`;
        }

        sistemaArchivo.writeFile(
            rutaMiArchivo,
            JSON.stringify(listaAprendices, null, 2),
            (error) => {

                if (error) {
                    return res.status(500).json({
                        error: "No se puede escribir en el archivo"
                    });
                }

                res.status(200).json({
                    mensaje: "Aprendiz actualizado correctamente",
                    Datos: listaAprendices[indice]
                });
            }
        );
    });
});

app.delete("/api/aprendices/:id",(req,res)=>{
    const id = Number(req.params.id);

    sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos)=>{
        if (error) {
            return res.status(500).json({
                error: "no se puede leer el archivo"
            });
        }

        const listaAprendices = JSON.parse(datos);

        const nuevaLista = listaAprendices.filter(
            aprendiz => aprendiz.id !== id
        );

        if (nuevaLista.length === listaAprendices.length) {
            return res.status(404).json({
                error: "Aprendiz no encontrado"
            });
        }

        sistemaArchivo.writeFile(
            rutaMiArchivo,
            JSON.stringify(nuevaLista, null, 2),
            (error)=>{
                if (error) {
                    return res.status(500).json({
                        error: "no se puede escribir en el archivo"
                    });
                }

                res.status(200).json({
                    mensaje: "Aprendiz eliminado correctamente"
                });
            }
        );
    });
});


//provocar error
app.get("/api/error",(req ,res, next)=>{
    next(new Error("este es un error provocado"))
});



//ruta,protegida para acceder con token 
app.get("/api/rutaprotegida", autenticacionMiddleware ,(req ,res)=>{
    res.json({mensaje: "Ruta protegida, acceso con token"})
});

//endpoint o ruta de inicio de sesion para generar un token  
app.post("/api/iniciarSesion", (req, res) => {
    const {usuario, clave} =  req.body; 
    const bdUsuario = {"usuario": "Jose", "clave": "tulunsahur"} 
    //validar datos 
    if (usuario !== bdUsuario.usuario || clave !== bdUsuario.clave){
        res.json({mensaje: "Usuario o clave incorrecta"});
    }
        
    //VERIFICACION Y GENERACION DEL TOKEN
    
    const token = jwtoken.sign(
        {"user": req.usuario },
        process.env.JWT_SECRETO, {expiresIn: "1h"   
    });
    res.json ({token});
    });  

app.use(manejadorErroresMiddleware)

app.listen(mipuerto, () => {
    console.log(`Servidor ejecutándose en el puerto ${mipuerto}`);
});