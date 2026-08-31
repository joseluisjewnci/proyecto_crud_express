require('dotenv').config();
const express = require('express');
const app = express();
const mipuerto = process.env.MIPUERTO || 3003; //middleware body-parse
app.use(express.json())

app.get("/",(_,res)=>{
    res.send('API Rest Full con express');
});

app.get("/api/aprendices",(_,res)=>{
    res.status(200).json({mesagge: 'lista aprendices'});
});

app.post("/api/aprendices",(req ,res) => {
     const datosAprendiz = req.body
     const edad= req.body.edad 
     if (edad >= 18){
     res.status(201).json({datos : datosAprendiz, message: 'eres mayor de edad' })
     }
    else 
     res.status(400).json({datos : datosAprendiz, message: 'eres menor de edad'})
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