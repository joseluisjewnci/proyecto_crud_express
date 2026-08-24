import 'dotenv/config';
import express from 'express';
const app = express();

const mipuerto = process.env.MIPUERTO || 3003;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

app.listen(mipuerto, () => {
    console.log(`Servidor ejecutándose en el puerto ${mipuerto}`);
});