import express from 'express';
export let app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 7000;
export const server = app.listen(port,()=>{
    console.log(`connected to port ${port}`)
})
