import  { createTransport }  from 'nodemailer';


async function sendmail(email,message,names,type) {
    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${message.subject}</title>
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
        <h1>Hi, ${names}</h1>
        <p style="font-size:16px; text-transform: capitalize;">${(type == 'login-2-fa')? 'a new device tried to signin into your account this is your new verification code':'Welcome to UDS!, this is your verification code'}</p>
        <p style="text-align: center; font-size: 18px; font-weight: bold;">${message.body}</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} UDS. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
		const transporter = createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: "hesh.teo@gmail.com",
				pass: "uwzfszzfuluhdgsk"
			}
		});
		const mailOptions = {
			from: "hesh.teo@gmail.com",
			to: email,
			subject: message.subject,
			html: emailContent
		};
        const info = new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              resolve({ success: false, message: 'Mails were not sent' });
            } else {
              resolve({ success: true, message: 'Mails sent' });
            }
          });
        });
        return info;

}
export default sendmail