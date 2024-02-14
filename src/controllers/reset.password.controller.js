import query from "./query.controller"
import addToken from "./token.signer.controller";
import id from"./randomInt.generator.controller";
import sendmail, { sendCustmail } from "./2FA.sender.controller";
import errorMessage from "./response.message.controller";
import authenticateToken from "./token.verifier.controller";

export const requestResetPassword = async (req,res)=>{
    let {uType,identifier} = req.body,table
    try {
            if (!uType) {
                return res.status(404).send({success: false, message: errorMessage._err_u_404})
            }
            (uType == 'staff') ? table = 'users' : table = 'patients';
            let response = await query(`SELECT id,status,Full_name,email FROM ${table}  WHERE email = ? OR id = ? OR username = ? OR NID = ?`,[identifier,identifier,identifier,identifier])
            if (!response) return res.send({success: false, message: errorMessage.is_error})
				if (response.length > 0) {
                    response = response[0]
					if (response.status == 'banned') return res.status(403).send({success: false, message : "user was banned"});
                    if (!response.email) {
                        return res.status(403).send({success: false, message : "unable to send reset link"});
                    }
					let uid = id(),
					obj = {id: response.id, fa : uid, table}
					await query(`UPDATE ${table} set FA = ? where id = ?`,[uid,response.id])
					let t = addToken(obj);
					let link = `https://ubuzima.digital/reset-password/${t}`
					const emailContent = `
										<!DOCTYPE html>
										<html lang="en">
										<head>
										<meta charset="UTF-8">
										<meta name="viewport" content="width=device-width, initial-scale=1.0">
										<style>
											/* Add your custom CSS styles here */
											body {
											font-family: Arial, sans-serif;
											margin: 0;
											padding: 0;
											background-color: #ffffff;
											}
											.container {
											max-width: 600px;
											margin: 0 auto;
											padding: 20px;
											background-color: #ffffff;
											box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
											}
											h1 {
											color: #333333;
											margin-top: 0;
											}
											p {
											color: #000;
											line-height: 1.5;
											}
											.footer {
											background-color: #f2f2f2;
											padding: 20px;
											box-sizing: border-box;
											width: 100%;
											position: fixed;
											bottom: 0px;
											text-align: center;
											}
										</style>
										</head>
										<body>
										<div class="container">
										<p style="text-align: center"> <img src="https://ubuzima.digital/assets/img/icons/logo/logo.png" style="width: 300px;height: 152px,display:flex;justify-content:center;align-items:center;overflow-wrap:break-word"></p>
											<h1>Hi, ${response.Full_name} </h1>
											<p style="font-size:16px; text-transform: capitalize;">you requested for a password reset on UDS</p>
											<p style="font-size: 18px; font-weight: bold;">click <a href="${link}">here</a> for further instructions</p>
										</div>
										<div class="footer">
											<p>&copy; ${new Date().getFullYear()} UBUZIMA DIGITAL SYSTEM. All rights reserved.</p>
										</div>
										</body>
										</html>
									`
									let emres = await sendCustmail(response.email,{subject: 'UDS Password Reset Request',mailContent: emailContent})
                                    if (emres.success) {
                                        res.status(200).send({success: true, message : `reset password instructions sent to ${response.email} successfully!, check your inbox`})
                                    }
                                } else {
					res.status(404).send({success: false, message : errorMessage._err_u_404})
				}
			
		} catch (error) {
			console.log(error)
            return res.status(500).send({success: false, message: errorMessage.is_error})
		}
}
export  const ResetPassword = async (req,res)=>{
    let {token,password} = req.body
	token = authenticateToken(token);
    
	if (token.success) {
		token = token.token
	}else{
        return res.status(500).send({success: false, message: errorMessage.is_error})
    }
	try {
		let response = await query(`SELECT id,email,status FROM ${token.table}  WHERE id = ?`,[token.id])
		if (!response) return res.status(500).send({success: false, message: errorMessage.is_error})
		if (response.length > 0) {
			await query(`UPDATE ${token.table} set password = ?, FA = ? where id = ? AND FA = ?`,[password,null,token.id,token.fa])
			res.send({success: true, message : "password changed successfully!"})
		} else {
			res.status(404).send({success: false, message : errorMessage._err_u_404})
		}
	} catch (error) {
		res.status(500).send({success: false, message : errorMessage.is_error})
	}
		
}