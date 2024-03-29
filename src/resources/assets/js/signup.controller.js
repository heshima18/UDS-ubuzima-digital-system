import { alertMessage, getdata, getschema, postschema, request, checkEmpty, initializeCleave,showRecs, getchips } from "../../../utils/functions.controller.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
(async function () {
    m = await request('get-map',getschema)
    q = await request('get-assurances',getschema)
    try {
        if (m.success && q.success) {
            m = m.message
            f = document.querySelector('form#formAuthentication')
            s = Array.from(f.querySelectorAll('select.address-field'));
            g = Array.from(f.querySelectorAll('select.form-select'));
            i = Array.from(f.querySelectorAll('input'))
            let show = f.querySelector('i.bx');
            show.addEventListener('click', e=>{
                show.classList.toggle('bx-hide')
                show.classList.toggle('bx-show')
                let password = i.find((inp) => {return inp.name == 'password'})
            if (password.type == 'password') {
                password.type = 'text'
            }else{
                password.type = 'password'
            }
            })
            let hhnid  = i.find(function (inp) {
                return inp.name == 'householder';
            })
    
            let radios = i.filter(function (radio) {
                return radio.type == 'radio'
            })
            for (const radio of radios) {
                radio.addEventListener('mousedown',e=>{
                    if (radio.value == 'patient') {
                       hhnid.parentElement.classList.replace('hidden', 'block')
                       hhnid.classList.toggle('optional')
                    }else{
                       hhnid.parentElement.classList.replace('block', 'hidden')
                       hhnid.value = null
                       hhnid.classList.toggle('optional')
                    }
                })
            }
            initializeCleave(
                f.querySelector('input.phone-number-mask'),
                f.querySelector('input.national-id-no-mask')
            );
            initializeCleave(null, hhnid)
            for (const sele of s) {
                i.push(sele)
            }
            for (const Gender of g) {
                i.push(Gender)
            }
            b = f.querySelector('button[type="submit"]')
            for (let province of m) {
                province = province.provinces[0]
                o = document.createElement('option');
                s[0].appendChild(o)
                o.innerText = province.name
                o.value = province.id
                o.setAttribute('data-id',province.id)
            }
            let assurance = f.querySelector('input#assurances')
            assurance.addEventListener('focus', function (e) {
                showRecs(this,q.message,'assurances')
            })
            for (const select of s) {
                select.addEventListener('change',e=>{
                    e.preventDefault();
                    if (select.name == 'province') {
                        for (let province of m) {
                            province = province.provinces[0]
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
                        for (let province of m) {
                            province = province.provinces[0]
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
                        for (let province of m) {
                            province = province.provinces[0]
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
                v = 1
                e.preventDefault();
                for (const input of i) {
                   a =  checkEmpty(input);
                   if(!a){ 
                    v = 0
                   }
                   if (input.name == 'phone' || input.name == 'nid' || input.name == 'householder') {
                     Object.assign(b,{[input.name]:  (input.name == 'phone' && input.value == '+250')? null : input.value.replace(/ /g, "")})   
                   }else if (input.name == 'firstname') {
                      u+= `${input.value + Math.floor(Math.random() * 999).toString().padStart(3, '0')}.`
                      n+= `${input.value} `
                   }else if(input.name == 'lastname'){
                      u+= `${input.value + Math.floor(Math.random() * 999).toString().padStart(3, '0')}`
                      n+= `${input.value}`
                   }else if(input.classList.contains('chips-check')){
                      z = checkEmpty(input)
                      if (z) {
                          if (input.name == 'assurances') {
                            q = []
                            for (const assurance of getchips(input.parentNode.querySelector('div.chipsholder'),['id','number'])) {
                                Object.assign(assurance,{status : 'eligible'})
                                q.push(assurance)
                            } 
                            Object.assign(b,{[input.name]: q})
                          }else{
                              Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'))})
                          }
                      }   
                   }else{
                      Object.assign(b,{[input.name]: input.value})
                   }
                }
                for (const radio of radios) {
                    if (radio.checked) {
                        Object.assign(b,{ role: radio.value})
                    }
                }
                if (v) {
                    Object.assign(b,{ Full_name: n})
                    Object.assign(b,{ username: u})
                    postschema.body = JSON.stringify(b)
                    console.log(b)
                    r = await request('api/signup',postschema);
                    alertMessage(r.message)
                    if (r.success) {
                        localStorage.setItem('userid',b.username)
                        window.location.href = '../auth'
                    }
                }
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
    
})()
