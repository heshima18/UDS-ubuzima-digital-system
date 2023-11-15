let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m,notificationlinks
import { alertMessage, getdata, getschema, postschema, request,initializeCleave, checkEmpty,cpgcntn, showRecs, getchips,getPath,showAvaiEmps, deletechild, geturl, addsCard,showAvaiAssurances, addLoadingTab, RemoveAuthDivs, showFingerprintDiv, sessiondata,addAuthDiv, calcTime, extractTime, getDate } from "../../../utils/functions.controller.js";
import {pushNotifs, userinfo,expirateMssg, getNfPanelLinks,m as messages} from "./nav.js";
import { addUprofile, uprofileStf } from "../../../utils/user.profile.controller.js";
import { viewTransfer } from "./transfer.js";

(async function () {
    z = userinfo
    m = await request('get-map',getschema)
    q = await request('get-assurances',getschema)
    let token = getdata('token')
    if (!token) {
        window.location.href = '../../login/'
    }
    if (!z.success) {
        localStorage.removeItem('token')
        return alertMessage(z.message)
    }
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
                messages.push(message)
                notificationlinks = getNfPanelLinks()
                genClicks(notificationlinks)
                addsCard(message.title,true)

            });
            socket.on('messagefromserver', (message) => {
                alertMessage(message)

            });;
            socket.on('accessAuth', (message) => {
                addAuthDiv(socket,message);

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
 u = await request('get-hp-employees',postschema)
if (!u.success) return alertMessage(users.message)
notificationlinks = getNfPanelLinks()
genClicks(notificationlinks)
const users = u.message
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
window.addEventListener('popstate',  function () {
    const evnt = new Event('urlchange', { bubbles: true });
    window.dispatchEvent(evnt);
})
window.addEventListener('urlchange', function() {
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
                if (getPath(2)) {
                    gsd(target,getPath(2))
                }else{
                    gsd(target)
                }
                return 0
            }
        })
    }else{
        window.history.pushState('','','./home')
        cpgcntn(0,p)

    }    
}); 
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
    if (x == 'home') {
        let num_hols = Array.from(page.querySelectorAll('[data-role="num_hol"]'))
        
      let sentmessages = await request('get-sent-messages',postschema)
      if (!sentmessages.success) {
        return alertMessage(sentmessages.message)
      }
      sentmessages = sentmessages.message
      let nmbrs = {tot_pati: 0,p_pati : 0,pati_seen: 0, transfers: 0}
        sentmessages.map(function (me) {
            if (me.type == 'p_message') {
                if (extractTime(me.dateadded,'date') == getDate('date')) {
                   nmbrs.tot_pati +=1
                   if (me.status == 'new') {
                        nmbrs.p_pati +=1
                   }else{
                        nmbrs.pati_seen +=1
                   }
                }
            
            }
      })
      num_hols.forEach(holder=>{
        let id = holder.id
        let keys = Object.keys(nmbrs)
        keys.map(number =>{
            if (number == id) {
                holder.innerHTML = nmbrs[number]
            }
        })
    })
    }else if (x == 'search-patient') {
        f = page.querySelector('form[name="sp-form"]');
        s = f.querySelector('input[type="text"]')
        setTimeout(e=>{s.focus()},200)
        b = f.querySelector('button[type="submit"]')
        if (getPath(2)) {
            b.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            b.setAttribute('disabled',true)
            r = await request(`patient/${getPath(2)}`,postschema)
            s.value = getPath(2)
            b.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
            b.removeAttribute('disabled')
            if (!r.success) return alertMessage(r.message)
            uprofileStf(r,users)
            
        }
        let fingerprint = page.querySelector('span#fingerprint')
        fingerprint.onclick = async function () {
          let fp_data = await showFingerprintDiv('search');
          if (fp_data) {
            postschema.body = JSON.stringify({
                token: getdata('token'),
                fp_data,
                type: 'fp'
            })
            r = await request(`patient/`,postschema)
            RemoveAuthDivs();
            if (!r.success) return alertMessage(r.message)
            uprofileStf(r,users);
            let url = new URL(window.location.href);
            url.pathname = `/receptionist/search-patient/${r.message.id}`;
            window.history.pushState({},'',url.toString())
          }
        }   
        f.onsubmit = async e=>{
            e.preventDefault();
            if (!s.value) return 0
            b.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            b.setAttribute('disabled',true)
            r = await request(`patient/${s.value}`,postschema)
            b.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
            b.removeAttribute('disabled')
            if (!r.success) return alertMessage(r.message)
            let url = new URL(window.location.href);
            url.pathname = `/${getPath()[0]}/search-patient/${s.value}`;
            window.history.pushState({},'',url.toString())
            uprofileStf(r,users)
        }
    }else if (x == 'my-account') {
        n = document.querySelector('span.name')
        n.textContent = userinfo.message.Full_name
        i = document.querySelector('span.n-img');
        i.textContent = userinfo.message.Full_name.substring(0,1)
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
                let fp = f.querySelector('button#add-fp'),fp_data,fp_ind = f.querySelector('span#fp_ind')
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
                fp.onclick = async function (event) {
                    event.preventDefault()
                    fp_data = await showFingerprintDiv('register');
                    if (fp_data) {
                        RemoveAuthDivs()
                        console.log(fp_data)
                       fp_ind.classList.replace('bc-gray','bc-tr-green')
                       fp_ind.classList.replace('dgray','green')
                       fp_ind.classList.remove('mt--2p')
                       fp_ind.innerHTML = `<i class="fas fa-check"></i>`
                    }
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
                        Object.assign(b,{ Full_name: n,username: u,fp_data})
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
function genClicks(notificationlinks) {
    let messages = sessiondata('messages')
    notificationlinks.map((link)=>{
        link.addEventListener(`click`, ()=>{
            if (!link.classList.contains('list-link')) {
                return 0
            }
            v = document.querySelector(`div#${link.getAttribute('data-href-target')}`)
            let message = messages.find(function (mess) {
                return mess.id == link.getAttribute('data-id')
            })
            if (message) {
                if (link.getAttribute('data-message-type') == 'transfer_message' ) {
                    if ('extra' in message) {
                        viewTransfer(message.extra.transfer)
                    }else if ('addins' in message) {
                        viewTransfer(message.addins.transfer)
                    }
                }
           }
        })
    })
}
