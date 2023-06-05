import fs from "fs";
import path from "path";
import  render  from "./page.scraper.controller";
let page = (req,res)=>{
    let file = path.join(__dirname,'..','pages', 'index.html')
    fs.readFile(file, (err, data) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        data = render(data)
        res.end(data);
    });
}
export default page
