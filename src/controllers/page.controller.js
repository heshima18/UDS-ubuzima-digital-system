import fs from "fs";
// import  render  from "./page.scraper.controller";
import  path  from "path";
export function page (req,res,page){
	const { filename,user } = req.params;
    let file
    if (user == 'admin' || user == 'Admin') {
        switch (filename) {
            case '':
                file = path.join(__dirname,'..','pages', 'admin-index.html')
                break;
            case 'home/':
                file = path.join(__dirname,'..','pages', 'admin-index.html')
                break;
            case 'home':
                file = path.join(__dirname,'..','pages', 'admin-index.html')
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
            case 'provinces/':
                file = path.join(__dirname,'..','pages', 'admin-provinces.html') 
                break;
            case 'provinces':
                file = path.join(__dirname,'..','pages', 'admin-provinces.html') 
                break;
            case 'districts/':
                file = path.join(__dirname,'..','pages', 'admin-districts.html') 
                break;
            case 'districts':
                file = path.join(__dirname,'..','pages', 'admin-districts.html') 
                break;
            case 'sectors/':
                file = path.join(__dirname,'..','pages', 'admin-sectors.html') 
                break;
            case 'sectors':
                file = path.join(__dirname,'..','pages', 'admin-sectors.html') 
                break;
            case 'cells/':
                file = path.join(__dirname,'..','pages', 'admin-cells.html') 
                break;
            case 'cells':
                file = path.join(__dirname,'..','pages', 'admin-cells.html') 
                break;
            case 'profile/':
                file = path.join(__dirname,'..','pages', 'admin-profile.html') 
                break;
            case 'profile':
                file = path.join(__dirname,'..','pages', 'admin-profile.html') 
                break;
            case 'tests/':
                file = path.join(__dirname,'..','pages', 'admin-tests.html') 
                break;
            case 'tests':
                file = path.join(__dirname,'..','pages', 'admin-tests.html') 
                break;
            case 'assurances/':
                file = path.join(__dirname,'..','pages', 'admin-assurances.html') 
                break;
            case 'assurances':
                file = path.join(__dirname,'..','pages', 'admin-assurances.html') 
                break;
            case 'departments/':
                file = path.join(__dirname,'..','pages', 'admin-departments.html') 
                break;
            case 'departments':
                file = path.join(__dirname,'..','pages', 'admin-departments.html') 
                break;
            case 'operations/':
                file = path.join(__dirname,'..','pages', 'admin-operations.html') 
                break;
            case 'operations':
                file = path.join(__dirname,'..','pages', 'admin-operations.html') 
                break;
            case 'services/':
                file = path.join(__dirname,'..','pages', 'admin-services.html') 
                break;
            case 'services':
                file = path.join(__dirname,'..','pages', 'admin-services.html') 
                break;
            case 'equipments/':
                file = path.join(__dirname,'..','pages', 'admin-equipments.html') 
                break;
            case 'equipments':
                file = path.join(__dirname,'..','pages', 'admin-equipments.html') 
                break;
            default:
                    file = 'N/A'
                break;
        } 
    }else if (user == 'receptionist') {
        switch (filename) {
            case '':
                file = path.join(__dirname,'..','pages', 'receptionist-index.html')
                break;
            case 'home/':
                file = path.join(__dirname,'..','pages', 'receptionist-index.html')
                break;
            case 'home':
                file = path.join(__dirname,'..','pages', 'receptionist-index.html')
                break;
            case 'search-patient/':
                file = path.join(__dirname,'..','pages', 'receptionist-search-patient.html')
                break;
            case 'search-patient':
                file = path.join(__dirname,'..','pages', 'receptionist-search-patient.html')
                break;
            case 'register-patient/':
                file = path.join(__dirname,'..','pages', 'receptionist-register-patient.html')
                break;
            case 'register-patient':
                file = path.join(__dirname,'..','pages', 'receptionist-register-patient.html')
                break;
            case 'my-account/':
                file = path.join(__dirname,'..','pages', 'receptionist-my-account.html')
                break;
            case 'my-account':
                file = path.join(__dirname,'..','pages', 'receptionist-my-account.html')
                break;
            default:
                    file = 'N/A'
                break;
        } 
    }else if (user == 'hc_provider') {
        switch (filename) {
            case '':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'home/':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'home':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'search-patient/':
                file = path.join(__dirname,'..','pages', 'hcp-search-patient.html')
                break;
            case 'search-patient':
                file = path.join(__dirname,'..','pages', 'hcp-search-patient.html')
                break;
            case 'create-session/':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'create-session':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'my-account/':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'my-account':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'view-session/':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            case 'view-session':
                file = path.join(__dirname,'..','pages', 'hcp-index.html')
                break;
            default:
                    file = 'N/A'
                break;
        } 
    }else if (user == 'laboratory_scientist') {
        switch (filename) {
            case '':
                file = path.join(__dirname,'..','pages', 'laboratory-index.html')
                break;
            case 'home/':
                file = path.join(__dirname,'..','pages', 'laboratory-index.html')
                break;
            case 'home':
                file = path.join(__dirname,'..','pages', 'laboratory-index.html')
                break;
            case 'record-tests/':
                file = path.join(__dirname,'..','pages', 'laboratory-index.html')
                break;
            case 'record-tests':
                file = path.join(__dirname,'..','pages', 'laboratory-index.html')
                break;
            case 'my-account/':
                file = path.join(__dirname,'..','pages', 'laboratory-index.html')
                break;
            case 'my-account':
                file = path.join(__dirname,'..','pages', 'laboratory-index.html')
                break;
            default:
                    file = 'N/A'
                break;
        } 
    }else{
        switch (filename) {
            case '':
                file = path.join(__dirname,'..','pages', 'auth-login.html')
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
            default:
                    file = 'N/A'
                break;
        }
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
