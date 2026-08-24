require('dotenv').config();
const express = require('express');
const app = express();
const mipuerto = process.env.MIPUERTO || 3003;

app.get("/",(_,res)=>{
    res.send('API Rest Full con express');
});

app.listen(mipuerto, () => {
    console.log(`Servidor ejecutándose en el puerto ${mipuerto}`);
});