let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
import { alertMessage, getdata, getschema, postschema, request,initializeCleave, checkEmpty,cpgcntn, showRecs, getchips,getPath, addUprofile,showAvaiEmps, deletechild, geturl, addsCard,showAvaiAssurances, addLoadingTab } from "../../../utils/functions.controller.js";
import { expirateMssg } from "./nav.js";
(async function () {
    let token = getdata('token')
z = await request(`authenticateToken/${token}`,getschema)
m = await request('get-map',getschema)
q = await request('get-assurances',getschema)
if (z.success) {
    z = z.message
    m = m.message
    try {
        const socket = io(geturl(),{ query : { id: z.id} });
        socket.on('connect', () => {
        console.log('Connected to the server');
        });
        
        socket.on('message', (message) => {
            pushNotifs(message);
            addsCard(message.title,true)

        });
        socket.on('expiratemssg', (message) => {
            expirateMssg(message);
        });
        socket.on('selecthp', (message)=>{
            var div = document.createElement('div')
            document.body.appendChild(div)
            for (const hp of message) {
                div.innerHTML += `<div id="${hp.id}" class="verdana hover p-5p">${hp.name}</div>`
            }
            let dvs = div.querySelectorAll('div')
            dvs.forEach(button=>{
                button.addEventListener('click',e=>{
                    e.preventDefault()
                    socket.emit('hpchoosen',{hp: button.id, token: localStorage.getItem('token')})
                })
            })
        })
        socket.on('changetoken',(token)=>{
            window.alert('token changed')
            localStorage.setItem('token',token)
            window.location.href = window.location.href
        })
        socket.emit('messageToId',{recipientId: z.id, message: 'wassup'})
        if (typeof(z.hospital) != 'string' && typeof(z.hospital) == 'object' && z.hospital.length > 0) {
            socket.emit('getpsforselection',z.hospital)
        }
    } catch (error) {
        console.log(error)
    }
}
postschema.body = JSON.stringify({token: localStorage.getItem('token')})
let users = await request('get-hp-employees',postschema)
if (!users) return alertMessage(users.message)
users = users.message
a = getPath(1)
c = Array.from(document.querySelectorAll('span.cpcards'))
p = Array.from(document.querySelectorAll('div.pagecontentsection'))
if(a){
	p.forEach(target=>{
        if (a == target.id) {
            t = p.indexOf(target)
            c.forEach((cp)=>{
                cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
            })
            c[t].classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
            cpgcntn(t,p)
            gsd(target)
            return 0
        }
    })
}else{
	window.history.pushState('','','./home')
    cpgcntn(0)

}
    window.onpopstate = function () {
        a = getPath(1)
        if(a){
            p.forEach(target=>{
                if (a == target.id) {
                    t = p.indexOf(target)
                    c.forEach((cp)=>{
                        cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
                    })
                    c[t].classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
                    cpgcntn(t,p)
                    return 0
                }
            })
        }else{
            window.history.pushState('','','./home')
            cpgcntn(0,p)

        }
    }
c.forEach((cudstp)=>{
    cudstp.addEventListener('click',()=>{
        c.forEach((cp)=>{
            cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
        })
        cudstp.classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
        let url = new URL(window.location.href);
        url.pathname = `/receptionist/${cudstp.getAttribute('data-item-type')}`;
        window.history.pushState({},'',url.toString())
        cpgcntn(c.indexOf(cudstp),p)
        gsd(p.find(function (elem) {
            return elem.id == cudstp.getAttribute('data-item-type')
        }))
    })
})
  async function gsd(page) {
    x = page.id
    if (x == 'search-patient') {
      f = page.querySelector('form[name="sp-form"]');
      s = f.querySelector('input[type="text"]')
      setTimeout(e=>{s.focus()},200)
      b = f.querySelector('button[type="submit"]')
      f.addEventListener('submit',async e=>{
        e.preventDefault();
        if (!s.value) return 0
        b.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
        b.setAttribute('disabled',true)
        r = await request(`patient/${s.value}`,postschema)
        b.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
        b.removeAttribute('disabled')
        if (!r.success) return alertMessage(r.message)
        uprofileStf(r)
        async function uprofileStf(r) {
            d = addUprofile(r.message);
            x = document.createElement('div')
            d.appendChild(x)
            x.className = `p-f b-0 p-20p bsbb zi-1000 center w-100 l-0`
            x.innerHTML = `<button type="button" class="btn rounded-pill btn-primary capitalize">notify consultant</button>` 
            x = x.querySelector('button');
            let a = await showAvaiAssurances(r.message.assurances)
            l = Array.from(a.querySelectorAll('li.assurance'))
            let beneficiaries = Array.from(d.querySelectorAll('li.benef'))
            for (const benef of beneficiaries) {
                benef.addEventListener('click',async function(event){
                    event.preventDefault();
                    this.classList.add('selected')
                    let beneficiary = this.getAttribute('data-id');
                    addLoadingTab(d)
                    r = await request(`patient/${beneficiary}`,postschema)
                    if (!r.success) return alertMessage(r.message)
                    deletechild(d.parentNode,d.parentNode.parentNode)
                    uprofileStf(r)
                  });
              }
            for (const lis of l) {
              lis.addEventListener('click',async function(event){
                  event.preventDefault();
                  this.classList.add('selected')
                  let assurance = this.getAttribute('data-id');
                  if (assurance == "null") {
                    assurance = null
                  }
                  r.message.assurances = assurance
                  deletechild(a,a.parentNode)
                  addsCard('Assurance Selected',true)
                });
            }
            x.addEventListener('click',async event=>{
                event.preventDefault()
                p = await showAvaiEmps(users);
                let emps = Array.from(p.querySelectorAll('.emp'))
                let deps = Array.from(p.querySelectorAll('.dep'))
                  for (const lis of emps) {
                    lis.addEventListener('click',async function(event){
                        event.preventDefault();
                        this.classList.add('selected')
                        let employee = this.getAttribute('data-id')
                        j = JSON.parse(postschema.body)
                        Object.assign(j,
                            {
                                title:'incoming patient',
                                receiver: employee,
                                type: 'p_message', 
                                content: `there is an incoming patient called ${r.message.Full_name}`,
                                extra: {
                                    name: r.message.Full_name,
                                    patient: r.message.id,nid:r.message.nid,
                                    assurance: r.message.assurances
                                },
                                controller: {
                                    looping: false,
                                    recipients: []
                                }
                            }
                        )
                        postschema.body = JSON.stringify(j)
                        deletechild(p,p.parentNode)
                        x.setAttribute('disabled',true)
                        x.innerText = 'notifying the receiver...'
                        r =  await request('send-message',postschema)
                        x.removeAttribute('disabled')
                        x.innerText = 'consultant notified !'
                        x.classList.replace('btn-primary','btn-success')
                        deletechild(d.parentNode,d.parentNode.parentNode)
                        addsCard('consultant notified !',true)
                      });
                  }
                  for (const dep of deps) {
                    dep.addEventListener('click',async function(event){
                        let emps = Array.from(dep.parentNode.parentElement.querySelectorAll('.emp'))
                        emps = emps.map(function (employee) {
                            return employee.getAttribute('data-id')
                        })
                        j = JSON.parse(postschema.body)
                        Object.assign(j,
                            {
                                title:'incoming patient',
                                receiver: emps,
                                type: 'p_message', 
                                content: `there is an incoming patient called ${r.message.Full_name}`,
                                extra: {
                                    name: r.message.Full_name,
                                    patient: r.message.id,
                                    nid:r.message.nid,
                                    assurance: r.message.assurances
                                },
                                controller: {
                                    looping: true,
                                    recipients: emps
                                }
                            }
                        )
                        postschema.body = JSON.stringify(j)
                        deletechild(p,p.parentNode)
                        x.setAttribute('disabled',true)
                        x.innerText = 'notifying the receiver...'
                        r =  await request('send-message',postschema)
                        x.removeAttribute('disabled')
                        x.innerText = 'consultant notified !'
                        x.classList.replace('btn-primary','btn-success')
                        deletechild(d.parentNode,d.parentNode.parentNode)
                        addsCard('consultant notified !',true)
                    });
                  }
            })
            
        }

      })
    }else if (x == 'my-account') {
        
        n = document.querySelector('span.name')
        n.textContent = z.Full_name
        i = document.querySelector('span.n-img');
        i.textContent = z.Full_name.substring(0,1)
        let editbuts = Array.from(page.querySelectorAll('span.icon-edit-icon'))
        for (const button of editbuts) {
            button.addEventListener('click',()=>{
                l = button.getAttribute('data-target')
                shedtpopup(l,r);
            })
        }

    }else if (x == 'register-patient') {
        try {
                
                f = document.querySelector('form#add-patient-form')
                s = Array.from(f.querySelectorAll('select.address-field'));
                g = Array.from(f.querySelectorAll('select.form-select'));
                i = Array.from(f.querySelectorAll('input'))
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
                            console.log('household',hhnid.parentElement)
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
      } else{
        // initiatewishlist()
    }
  }
})()
