import express from 'express';
export let app = express();
import dotenv from "dotenv";
import {exec,spawn} from 'child_process';
import  path  from "path";
dotenv.config();
const port = process.env.PORT || 7000;
export const server = app.listen(port,()=>{
    console.log(`connected to port ${port}`)
})

const applicationPath = path.join(__dirname,'fingerprint-sdk','fp-browser-service.exe')

// const childProcess = spawn(applicationPath, [], {
//     detached: false, // Child process is not detached from the parent
//     stdio: 'inherit' // Inherit standard input, output, and error
// });
  
//   // You can choose to listen for 'exit' events or perform other tasks as needed
//   childProcess.on('exit', (code) => {
//     console.log(`Child process exited with code ${code}`);
//   });
//   childProcess.on('error', (err) => {
//     console.error('Child process error:', err);
//     const chmodProcess = spawn('chmod', ['+x', applicationPath]);
//     chmodProcess.on('error', (err) => {
//       console.error('Child process error:', err);
//     });
//       // Listen for the chmod process exit event
//     chmodProcess.on('exit', (code) => {
//       console.log(`chmod process exited with code ${code}`);
//       // process.exit(); // Exit the Node.js app
//     });
//   });
//   // Handle SIGINT (Ctrl+C) to gracefully exit the child process when your Node.js app is closed
//   process.on('SIGINT', () => {
//     childProcess.kill(); // Terminate the child process
//     process.exit(); // Exit the Node.js app
//   });





