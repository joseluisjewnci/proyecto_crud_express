require('dotenv').config();
const express = require('express');
const app = express();
const mipuerto = process.env.MIPUERTO || 3003; //middleware body-parse
const sistemaArchivo = require("fs");
const ruta = require("path");
const rutaMiArchivo = ruta.join (__dirname, "datos.json");
const {
    validarNombre,
    validarCorreo
} = require("./validaciones/validaciones");

//importar multer
const multer = require("multer");

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

app.get("/",(_,res)=>{
    res.send('API Rest Full con express');
});

app.get("/api/aprendices/:id",(req,res)=>{
    
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
    

app.put("/api/aprendices/:id",(req ,res)=>{
    res.status(200).json({message: 'Actualizar aprendiz'})
});

app.delete("/api/aprendices/:id",(_,res)=>{
    res.status(200).json({message: 'Eliminado'})
});

app.listen(mipuerto, () => {
    console.log(`Servidor ejecutándose en el puerto ${mipuerto}`);
});