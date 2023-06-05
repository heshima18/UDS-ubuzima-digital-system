import express from 'express';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cors from 'cors'
import  mysql from "mysql";
import router from "./src/routes/index.route"
dotenv.config();
const app = express()
const port = process.env.PORT || 7000;
let connection =  mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : 'uds'
});
try {
    connection.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.stack);
            return;
        }
    
        console.log('Successfully connected to database with threadId:', connection.threadId);
    });
} catch (error) {
    console.log('error while connecting to database error:',error)
}
app.listen(port,()=>{
    console.log(`connected to port ${port}`)
})
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(router)
app.use(bodyParser.json())
export default connection 