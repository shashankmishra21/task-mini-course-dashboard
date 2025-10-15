const express = require("express");
const app = express();
const cors = require('cors');
import dotenv from "dotenv";
import api from './routes/api';

dotenv.config();
app.use(cors());
app.use(express.json());


app.get('/', (req:any , res:any) => {
    res.json({message: "mini-course Dashboard is running"})
});

app.use('/api', api);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port no ${PORT}`);
});