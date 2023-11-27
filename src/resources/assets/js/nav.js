import { postschema, request,alertMessage, getdata,getschema, animskel, deletechild,getPath,cpgcntn, sessiondata, calcTime,DateTime, removeLoadingTab} from "../../../utils/functions.controller.js"
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n
const token = getdata('token');
export const userinfo = await request(`authenticateToken/${token}`,getschema);
if (userinfo.message.role != getPath()[0]) {
    let url = new URL(window.location.href);
    url.pathname = `/`
    window.location.href = url.toString() 
}
postschema.body = JSON.stringify({token})
export let m = await request('get-messages',postschema)
let nfPanel = document.querySelector('ul.nf-panel');
nfPanel.parentNode.classList.add('h-75');
(async function () {
    if (!m.success) return alertMessage(m.message)
    m = m.message
    
    sessionStorage.setItem('messages',JSON.stringify(m))
    try {
        if (!userinfo.success){ 
            return alertMessage(userinfo.message)
        }
        y = userinfo.message
        localStorage.setItem('userinfo',JSON.stringify({Full_name: y.Full_name, title: y.title,id: y.id}))
        animskel()
        let dropdown_button = Array.from(document.querySelectorAll('a#dropdown-toggle'))
        removeLoadingTab(dropdown_button[0])
        q = Array.from(document.querySelectorAll('.data-role'));
        n = q.find(function (element) {return element.getAttribute('data-role') == 'profile-name'})
        t = q.find(function (element) {return element.getAttribute('data-role') == 'profile-title'})
        if (!userinfo.success) return alertMessage(userinfo.message)
        z = userinfo.message
        dropdown_button[0].innerHTML  = ` <i class='bx bxs-user dgray bx-sm'></i><span class="w-100 h-a capitalize wrap fs-15p mt--3p dgray flex px-5p">${z.Full_name}</span>`
        if (n && t) {
            n.innerHTML = `<div class="w-100 h-a capitalize wrap fs-14p bold-2 flex px-5p dgray"><span class="center"><i class='bx bxs-user dgray bx-sm'></i></span><span class="px-5p bsbb grid"> ${z.Full_name}</span></div>`
            if (z.role != 'patient' && z.role != 'householder' && z.role != 'admin' && z.role != 'insurance_manager') {
                t.innerHTML = `<div class="w-100 h-a capitalize wrap fs-12p flex px-5p my-5p"><i class='bx bxs-buildings bx-sm dgray' ></i><span class="center-2 px-10p"><span class="mx-3p center h-100">${z.hp_name}</span><span class="w-5p h-5p br-50 bc-dgray iblock"></span> <span class="center  mx-3p iblock h-100">${z.title}</span></span></div>`
            }else{
                t.innerHTML = null
            }
        }
        let logoutLink = document.querySelector('a[href="logout"]')
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userinfo');

            let url = new URL(window.location.href);
            url.pathname = `/`;
            window.location.href = url.toString()
        })
        for (const button of dropdown_button) {
            button.addEventListener('click',function () {
                let target = this.getAttribute('data-bs-toggle')
                let target_cont = document.querySelector(`.${target}`) || document.querySelector(`#${target}`) || document.querySelector(`[name="${target}"]`)
                if (target_cont) {
                    target_cont.classList.toggle('hidden')
                }
            })
        }
        x = document.querySelector('div.thebody')
        x.onclick = ()=>{
            Array.from(document.querySelectorAll('[data-role="dropdowns"]')).forEach(elem=>{
                elem.classList.add('hidden')
            })
        }
        b = q.find(function (element) {return element.getAttribute('data-role') == 'notification-count-badge'})
        if (b) {
            j =  m.filter(function (elem) {  return elem.status == 'new'})
            if (j.length > 0) {
                b.classList.replace('hidden','center')
                b.innerText =(j.length > 10)? `9+` : j.length        
                
            }
        }
        nfPanel.innerHTML = null
        for (const message of m) {
          let li = document.createElement('li');
          li.className = `py-10p bb-1-s-g px-15p bsbb dropdown-notifications-item hover-2 ${(message.status == 'new')? 'bc-tr-theme' : 'bc-white'}` 

          let vb = 'title="message"'
          if (message.type == 'p_message') {
              vb = 'data-href-target = "create-session"'
          }else if(message.type == 'req_test_message'){
              vb = 'data-href-target = "record-tests"'
          }else if (message.type == 'test_res_message') {
            vb = 'data-href-target = "view-session"'
          }else if (message.type == 'session_message') {
            vb = 'data-href-target = "view-session"'
          }else if (message.type == '__APPNTMNT_MSSG_') {
            vb = 'data-href-target = "appointments"'
          }
          li.innerHTML = `<div class="d-flex capitalize left w-100">
                            <div class="flex-shrink-0 me-3 ${(message.status == 'expired')? 'op-0-3': ''}">
                                <div class="avatar">
                                    <span class="w-40p h-40p rounded-circle bc-tr-theme center bold-2 dgray">${message.sender.name.substring(0,1)}</span>
                                </div>
                            </div>
                            <div class="flex-grow-1 ${(message.status != 'expired')? 'list-link': ''}" data-id='${message.id}' data-message-type = "${message.type}" ${vb}>
                                <h6 class="mb-1 ttls dblue ${(message.status == 'expired')? 'op-0-3': ''}">${message.title}</h6>
                                <p class="mb-0 ttls ${(message.status == 'expired')? 'op-0-3': ''}">${message.content}</p>
                                <p class="mb-0 fs-11p ttls ${(message.status == 'expired')? 'op-0-3': ''}">from <b>${message.sender.name}</b></p>
                                <small class="text-muted fs-11p">${calcTime(message.dateadded)}</small>
                                ${(message.status == 'expired')? '<small class="text-muted fs-11p">(expired)</small>': ''}
                            </div>
                            <div class="flex-shrink-0 dropdown-notifications-actions">
                                ${(message.status == 'new')? '<a href="javascript:void(0)" class="dropdown-notifications-read"><span class="badge badge-dot"></span></a>' : '' }
                                <a href="javascript:void(0)" class="dropdown-notifications-archive delete-m" data-id='${message.id}'><span class="bx bx-x"></span></a>
                            </div>
                        </div>`
            nfPanel.appendChild(li)
        }
        l = Array.from(nfPanel.querySelectorAll('div.list-link'))
        let Dp = document.querySelector('div.dropdown-header')
        let options = document.createElement('div')
        options.innerHTML =`<span class="center p-7p bsbb tr-0-2 br-50 w-30p h-30p hover-2 p-r i"><i class="fas fa-ellipsis-v fs-16p"></i></span>`
        options.className = "options"
        Dp.appendChild(options)
        options.onclick = function (event) {
            event.preventDefault()
            let message_type = m.map(function (message) {
                return message.title
            })
            message_type = [...new Set(message_type)];
            if (!options.querySelector('div.flpp')) {
                let filterPopUp = document.createElement('div')
                options.querySelector('span.i').classList.add('b-1-s-gray')
                filterPopUp.className = `br-5p px-10p py-5p bsbb bc-white p-a ml--25p card-1 mt-5p hover-2 p-r flpp`
                filterPopUp.innerHTML = `<span class="center-2 text-muted us-none"><i class="fas fa-filter"></i> Filter</span>`
                options.appendChild(filterPopUp)
                filterPopUp.onclick = function (event) {
                    if (!this.querySelector('div.fpp')) {
                        event.preventDefault();
                        let div = document.createElement('div')
                        div.className = `br-5p py-5p bsbb bc-white cntr card-1 mt-5p zi-20 ml--60p h-165p fpp`
                        div.innerHTML = `<div class="w-100 h-100"><span class="text muted bold-2 bb-1-s-g px-10p bsbb py-5p w-100 block capitalize">filter by title</span><div class="body h-125p ovys scroll-3"></div></div>`
                        let bo = div.querySelector('div.body')
                        message_type.map(function (elem) {
                            bo.innerHTML+= `<span class="capitalize filtype block px-10p py-10p bsbb hover-7" data-id="${elem}">${elem}</span>`
                        })
                         bo.innerHTML+= `<span class="capitalize filtype block px-10p py-10p bsbb hover-7" data-id="remove">remove filter</span>`
                        filterPopUp.firstChild.appendChild(div)
                        let filtyps = Array.from(bo.querySelectorAll('span.filtype'))
                        filtyps.forEach(function (button) {
                            button.addEventListener('click', function (event) {
                                event.preventDefault();
                                let tp = this.getAttribute('data-id')
                                addFilter(tp)

                            })
                        })
                    }
                }
            }else{
                options.querySelector('span.i').classList.remove('b-1-s-gray')
            }
        }

        clicks(l,b,m)

    } catch (error) {
        console.log(error)
    }
})()
export function openmenu() {
    document.querySelector('ul#notification-dropdown').classList.toggle('hidden')
}
export function addFilter(title) {
    l = Array.from(document.querySelectorAll('div.list-link'))
    o = document.querySelector('div.options')
    if (o) {
        o.firstChild.classList.remove('b-1-s-gray')
        // deletechild(o.lastChild,o)
        setTimeout(()=>{
            if (o.childNodes.length > 1) {
                deletechild(o.lastChild,o)
                o.firstChild.classList.remove('b-1-s-gray')
            }
    
        },10)
    }

    l.forEach(v=>{
        v.parentNode.parentElement.classList.remove('hidden') 
    })
    if (title != 'remove') {
        l.forEach(v=>{
            let text = v.querySelector('h6').innerText.toLowerCase()
            title = title.toLowerCase()
            if (text != title) { 
                v.parentNode.parentElement.classList.add('hidden')   
            }else{
               
            }
        })
    }else{
        l.forEach(v=>{
            v.parentNode.parentElement.classList.remove('hidden') 
        })
    }
}
export function pushNotifs(message) {
    let messages = sessiondata('messages')
    messages.push(message);
    sessionStorage.setItem('messages',JSON.stringify(messages))
    q = Array.from(document.querySelectorAll('.data-role'));
    b = q.find(function (element) {return element.getAttribute('data-role') == 'notification-count-badge'})
    if (b) {
        b.classList.replace('hidden','center')
        l = parseInt(b.innerText)
            b.innerText =(j.length > 10)? `9+` : l+1  
            
    }
    let nfPanel = document.querySelector('ul.nf-panel');
    let li = document.createElement('li');
    li.className = `list-group-item list-group-item-action dropdown-notifications-item hover-2 bc-tr-theme` 
    let vb = 'title="message"'
    if (message.type == 'p_message') {
        vb = 'data-href-target = "create-session"'
    }else if(message.type == 'req_test_message'){
        vb = 'data-href-target = "record-tests"'
    }else if (message.type == 'test_res_message') {
        vb = 'data-href-target = "view-session"'
    }else if (message.type == 'session_message') {
        vb = 'data-href-target = "view-session"'
    }else if (message.type == '__APPNTMNT_MSSG_') {
        vb = 'data-href-target = "appointments"'
    }
    li.innerHTML = `<div class="d-flex capitalize left w-100">
                      <div class="flex-shrink-0 me-3">
                          <div class="avatar">
                              <span class="w-40p h-40p rounded-circle bc-tr-theme center bold-2">${message.sender.name.substring(0,1)}</span>
                          </div>
                      </div>
                      <div class="flex-grow-1 list-link" data-id='${message.id}'  data-message-type = "${message.type}" ${vb} >
                          <h6 class="mb-1 ttls">${message.title}</h6>
                          <p class="mb-0 ttls">${message.content}</p>
                          <p class="mb-0 ttls fs-11p">from <b>${message.sender.name}</b></p>
                          <small class="text-muted fs-11p capitalize">just now</small>
                      </div>
                      <div class="flex-shrink-0 dropdown-notifications-actions">
                          <a href="javascript:void(0)" class="dropdown-notifications-read"><span class="badge badge-dot"></span></a>
                          <a href="javascript:void(0)" class="dropdown-notifications-archive delete-m" data-id='${message.id}'><span class="bx bx-x"></span></a>
                      </div>
                  </div>`
    nfPanel.insertBefore(li,nfPanel.childNodes[0])
    l = Array.from(nfPanel.querySelectorAll('div.list-link'))
    clicks(l,b,m)
}
function clicks(l,b,m) {
    let messages = sessiondata('messages')
    let menu = document.querySelector('[name="notification-dropdown"]');
    l.map(function (element) {
        let del  = Array.from(element.parentElement.querySelectorAll('a.delete-m'))
        del.map(function (button) {
            button.onclick =  event2 =>{
                deletechild(button.parentElement.parentElement.parentElement,button.parentElement.parentElement.parentElement.parentElement)
            }
        })
        element.onclick = async e=>{
            if (!element.classList.contains('list-link')) {
                return 0
            }
            try {
                v = document.querySelector(`div#${element.getAttribute('data-href-target')}`)
                menu.classList.toggle('hidden')
                if (element.parentElement.parentNode.classList.contains('bc-tr-theme')) {
                    element.parentElement.parentNode.classList.remove('bc-tr-theme');
                    a = element.parentElement.querySelector('a.dropdown-notifications-read')
                    if (a) {
                        a.classList.add('hidden')
                        postschema.body = JSON.stringify({token: getdata('token'), message: element.getAttribute('data-id')})
                        if (b) {
                            b.classList.remove('hidden')
                            l = parseInt(b.innerText)
                            if (l > 0) {
                                b.innerText =(j.length > 10)? `9+` : l-1
                                
                                if (l-1 == 0) {
                                    b.classList.replace('center','hidden')
                                }
                            }else{
                                b.classList.replace('center','hidden')
                            }
                        }
                        await request('mark-as-seen',postschema)

                    }
                }
                if (v) {
                    p = Array.from(v.parentElement.querySelectorAll('.pagecontentsection'))
                    h = messages.find(function (message) {
                        return message.id == element.getAttribute('data-id')
                    })
                    if (h.addins) { 
                        Object.assign(h.addins, {sender: h.sender})
                        if (element.getAttribute('data-message-type') == 'p_message' || element.getAttribute('data-message-type') == 'req_test_message') {
                            sessionStorage.setItem('pinfo',JSON.stringify(h.addins));
                        }
                    }else{
                        Object.assign(h.extra, {sender: h.sender})
                        if (element.getAttribute('data-message-type') == 'p_message' || element.getAttribute('data-message-type') == 'req_test_message') {
                            sessionStorage.setItem('pinfo',JSON.stringify(h.extra));
                        }
                    }
                    // if (v) {
                    //     s = p.indexOf(v)
                    //     let url = new URL(window.location.href);
                    //     if (element.getAttribute('data-message-type') == 'test_res_message' || element.getAttribute('data-message-type') == 'session_message') {
                    //         url.pathname = `/${getPath()[0]}/${element.getAttribute('data-href-target')}/${sessiondata('minfo').session}`;
                    //     }else{
                    //         url.pathname = `/${getPath()[0]}/${element.getAttribute('data-href-target')}`;
                    //     }
                    //     window.location.href = url.toString()
                    // }
                }
            } catch (error) {
              console.log(error)  
            }
            
        }
    }) 
}
export function expirateMssg(mssg_id) {
    l = Array.from(nfPanel.querySelectorAll('div.list-link'))
    l.map(function (linkmssg) {
        if (linkmssg.getAttribute('data-id') == mssg_id) {
            linkmssg.classList.remove('list-link');
            linkmssg.classList.add('list-link');
            v = Array.from(linkmssg.querySelectorAll('.ttls'))
            v.forEach(el=>{
                el.classList.add('op-0-3')
            })
            s = document.createElement('small');
            linkmssg.appendChild(s)
            s.className = `text-muted fs-11p`
            s.textContent = `(expired)`
            linkmssg.parentNode.parentElement.classList.toggle('bc-gray')
            linkmssg.parentNode.parentElement.classList.remove('bc-tr-theme')
            q = Array.from(document.querySelectorAll('.data-role'));
            b = q.find(function (element) {return element.getAttribute('data-role') == 'notification-count-badge'})
            if (b) {
                b.classList.remove('hidden')
                l = parseInt(b.innerText)
                if (l > 0) {
                    b.innerText =(j.length > 10)? `9+` : l-1
                    
                    if (l-1 == 0) {
                        b.classList.replace('center','hidden')
                    }
                }else{
                    b.classList.replace('center','hidden')
                }
            }
        }
    })

}
export function getNfPanelLinks() {
    l = Array.from(nfPanel.querySelectorAll('div.list-link'))
    return l
}
export {DateTime}
export default userinfo