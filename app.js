import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import  mysql from "mysql";
import router from "./src/routes/index.route"
import {app} from "./handler"
import { DateTime } from 'luxon';

export let connection =  mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
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


// const resultDateTime = kigaliTime
//   .plus({ hours: 1 })
//   .plus({ minutes: 1 })
//   .plus({ seconds: 1 })
//   .plus({ years: 1 })
//   .plus({ months: 1 })
//   .plus({ days: 1 });
const dateTime = DateTime.now();
let kigaliTime = dateTime.setZone('Africa/Kigali');
kigaliTime = kigaliTime.toFormat('yyyy-MM-dd HH:mm:ss');

console.log(kigaliTime);
kigaliTime = DateTime.fromFormat(kigaliTime, 'yyyy-MM-dd HH:mm:ss');
console.log(kigaliTime.toString())

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(router)
app.use(bodyParser.json())

