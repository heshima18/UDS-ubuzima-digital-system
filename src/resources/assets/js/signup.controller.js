import { alertMessage, getdata, getschema, postschema, request, checkEmpty } from "../../../utils/functions.controller.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
m = await request('get-map',getschema)

try {
    if (m.success) {
        [m] = m.message
        f = document.querySelector('form#formAuthentication')
        s = Array.from(f.querySelectorAll('select.address-field'));
        i = Array.from(f.querySelectorAll('.form-control'))
        b = f.querySelector('button[type="submit"]')
        for (const province of m.provinces) {
            o = document.createElement('option');
            s[0].appendChild(o)
            o.innerText = province.name
            o.value = province.id
            o.setAttribute('data-id',province.id)
        }
        for (const select of s) {
            select.addEventListener('change',e=>{
                e.preventDefault();
                if (select.name == 'province') {
                    for (const province of m.provinces) {
                        if (province.id == select.value) {
                            s[2].innerHTML =  '<option value="">Choose...</option>'
                            s[3].innerHTML =  '<option value="">Choose...</option>'
                            cdcts(province.districts,s[1],'district')
                        }else if(select.value == ''){
                            s[1].innerHTML =  '<option value="">Choose...</option>'
                            s[2].innerHTML =  '<option value="">Choose...</option>'
                            s[3].innerHTML =  '<option value="">Choose...</option>'
                        }
                    }
                }
                if (select.name == 'district') {
                    for (const province of m.provinces) {
                        for (const district of province.districts) {
                            if (district.id == select.value) {
                                s[3].innerHTML =  '<option value="">Choose...</option>'
                                cdcts(district.sectors,s[2],'sector')
                            }else if(select.value == ''){
                                s[2].innerHTML =  '<option value="">Choose...</option>'
                                s[3].innerHTML =  '<option value="">Choose...</option>'
                            }
                        }
                    }
                }
                if (select.name == 'sector') {
                    for (const province of m.provinces) {
                        for (const district of province.districts) {
                            for (const sector of district.sectors) {
                                if (sector.id == select.value) {
                                    cdcts(sector.cells,s[3],'cell')
                                }else if(select.value == ''){
                                    s[3].innerHTML =  '<option value="">Choose...</option>'
                                }
                            }
                        }
                    }
                }
            })
        } 
        f.addEventListener('submit', async e =>{
            let a,b,n,u,r;
            n = '';
            u = '';
            b = {}
            e.preventDefault();
            for (const input of i) {
               a =  checkEmpty(input);
               if(a == 0){ 
                return 0
               }
               if (input.name == 'firstname') {
                  u+= `${input.value + Math.floor(Math.random() * 999).toString().padStart(3, '0')}.`
                  n+= `${input.value} `
               }else if(input.name == 'lastname'){
                  u+= `${input.value + Math.floor(Math.random() * 999).toString().padStart(3, '0')}`
                  n+= `${input.value}`
               }else{
                   Object.assign(b,{[input.name]: input.value})
               }
            }
            b.assurances = [b.assurances]
            Object.assign(b,{ Full_name: n})
            Object.assign(b,{ username: u})
            console.log(a,b)
            postschema.body = JSON.stringify(b)
            r = await request('api/signup',postschema);
            alertMessage(r.message)
        }) 
    }else{
        alertMessage(m.message)
    }
} catch (error) {
  console.log(error)  
}

function cdcts(entries,field,type) {
    field.innerHTML = '<option value="">Choose...</option>'
    for (const entry of entries) {
        o = document.createElement('option')
        o.innerText = entry.name
        o.value = entry.id
        o.setAttribute('data-id',entry.id)
        field.appendChild(o)    
    }
}