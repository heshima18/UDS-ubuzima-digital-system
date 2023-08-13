import fs from "fs";
// import  render  from "./page.scraper.controller";
import  path  from "path";
export function page (req,res,user){
	const { filename } = req.params;
    let file
    switch (filename) {
        case '':
            file = path.join(__dirname,'..','pages', 'index.html')
            break;
        case '404/':
            file = path.join(__dirname,'..','pages', '404.html') 
            break;
        case 'app/':
            file = path.join(__dirname,'..','pages', 'dashboard.html') 
            break;
        case 'login/':
            file = path.join(__dirname,'..','pages', 'auth-login.html') 
            break;
        case 'login':
            file = path.join(__dirname,'..','pages', 'auth-login.html') 
            break;
        case 'signup/':
            file = path.join(__dirname,'..','pages', 'auth-register.html') 
            break;
        case 'signup':
            file = path.join(__dirname,'..','pages', 'auth-register.html') 
            break;
        case 'auth/':
            file = path.join(__dirname,'..','pages', 'auth-two-steps.html') 
            break;
        case 'auth':
            file = path.join(__dirname,'..','pages', 'auth-two-steps.html') 
            break;
           
        case 'forgot-password/':
            file = path.join(__dirname,'..','pages', 'auth-forgot-password.html') 
            break;
        case 'forgot-password':
            file = path.join(__dirname,'..','pages', 'auth-forgot-password.html') 
            break;
        case 'reset-password/':
            file = path.join(__dirname,'..','pages', 'auth-reset-password.html') 
            break;
        case 'reset-password':
            file = path.join(__dirname,'..','pages', 'auth-reset-password.html') 
            break;
        case 'employees/':
            file = path.join(__dirname,'..','pages', 'admin-employees.html') 
            break;
        case 'employees':
            file = path.join(__dirname,'..','pages', 'admin-employees.html') 
            break;
        case 'health-posts/':
            file = path.join(__dirname,'..','pages', 'admin-health-posts.html') 
            break;
        case 'health-posts':
            file = path.join(__dirname,'..','pages', 'admin-health-posts.html') 
            break;
        case 'medicines/':
            file = path.join(__dirname,'..','pages', 'admin-medicines.html') 
            break;
        case 'medicines':
            file = path.join(__dirname,'..','pages', 'admin-medicines.html') 
            break;
        default:
                file = 'N/A'
            break;
    }
    fs.readFile(file, (err, data) => {
        if (err) {
            file = path.join(__dirname,'..','pages', '404.html') 
            fs.readFile(file, (err, errorPageData) => {
                if (err) {
                  res.status(500).send('Internal Server Error');
                  return;
                }
        
                res.writeHead(404, {
                  'Content-Type': 'text/html',
                  'Content-Length': errorPageData.length
                });
                res.end(errorPageData);
            })
            return 0;
        }
        res.writeHead(200, {
            'Content-Type': "text/html",
            'Content-Length': data.length
        });
        // data = render(data)
        res.end(data);
    });
}

export default page
