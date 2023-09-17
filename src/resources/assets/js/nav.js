import { postschema, request,alertMessage, getdata,getschema, animskel, deletechild,getPath,cpgcntn, sessiondata, calcTime} from "../../../utils/functions.controller.js"
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n
// const now = luxon.DateTime.now();
// let kigaliTime = now.setZone('Africa/Kigali');
// kigaliTime = kigaliTime.toFormat('yyyy/MM/dd HH:mm:ss');
// console.log(kigaliTime);
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
(async function () {
    if (!m.success) return alertMessage(m.message)
    m = m.message
    sessionStorage.setItem('messages',JSON.stringify(m))
    try {
        if (!userinfo.success){ 
            return alertMessage(userinfo.message)
        }
        y = userinfo.message
        localStorage.setItem('userinfo',JSON.stringify({Full_name: y.Full_name, title: y.title}))
        animskel()
        let dropdown_button = Array.from(document.querySelectorAll('a.dropdown-toggle'))
        q = Array.from(document.querySelectorAll('.data-role'));
        n = q.find(function (element) {return element.getAttribute('data-role') == 'profile-name'})
        t = q.find(function (element) {return element.getAttribute('data-role') == 'profile-title'})
        if (!userinfo.success) return alertMessage(userinfo.message)
        z = userinfo.message
        if (n && t) {
            n.innerHTML = `<span class="w-100 h-70 capitalize wrap fs-13p flex px-5p">${z.Full_name}</span>`
            if (z.role != 'patient' && z.role != 'householder' && z.role != 'admin' && z.role != 'insurance_manager') {
                t.innerHTML = `<span class="w-100 h-70 capitalize wrap fs-12p flex px-5p"><span>${z.hp_name}</span> <span class="bold-2 center mx-3p"><span class="w-5p h-5p br-50 bc-dgray"></span></span>${z.title}</span>`
            }else{
                t.innerHTML = null
            }
        }
        let logoutLink = document.querySelector('a[href="auth-login.html"]')
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
        b = q.find(function (element) {return element.getAttribute('data-role') == 'notification-count-badge'})
        if (b) {
            j =  m.filter(function (elem) {  return elem.status == 'new'})
            if (j.length > 0) {
                b.classList.replace('hidden','center')
                b.innerText = j.length        
            }
        }
        nfPanel.innerHTML = null
        for (const message of m) {
          let li = document.createElement('li');
          li.className = `list-group-item list-group-item-action dropdown-notifications-item hover-2 ${(message.status == 'new')? 'bc-tr-theme' : ''}` 

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
                                    <span class="w-40p h-40p rounded-circle bc-tr-theme center bold-2">${message.sender.name.substring(0,1)}</span>
                                </div>
                            </div>
                            <div class="flex-grow-1 list-link" data-id='${message.id}' data-message-type = "${message.type}" ${vb}>
                                <h6 class="mb-1 ttls ${(message.status == 'expired')? 'op-0-3': ''}">${message.title}</h6>
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
        clicks(l,b,m) 
    } catch (error) {
        console.log(error)
    }
})()
export function pushNotifs(message) {
    let messages = sessiondata('messages')
    messages.push(message);
    sessionStorage.setItem('messages',JSON.stringify(messages))
    q = Array.from(document.querySelectorAll('.data-role'));
    b = q.find(function (element) {return element.getAttribute('data-role') == 'notification-count-badge'})
    if (b) {
        b.classList.replace('hidden','center')
        l = parseInt(b.innerText)
            b.innerText = l+1  
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
                                b.innerText = l-1
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
                    b.innerText = l-1
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
export default userinfo