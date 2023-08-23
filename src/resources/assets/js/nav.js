import { postschema, request,alertMessage, getdata,getschema, animskel, deletechild,getPath,cpgcntn} from "../../../utils/functions.controller.js"
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
const token = getdata('token');
export var userinfo = await request(`authenticateToken/${token}`,getschema);
(async function () {
    try {
        if (!userinfo.success){ 
            return alertMessage(userinfo.message)
        }
        y = userinfo.token
        localStorage.setItem('userinfo',JSON.stringify({Full_name: y.Full_name, title: y.title}))
        animskel()
        let dropdown_button = Array.from(document.querySelectorAll('a.dropdown-toggle'))
        q = Array.from(document.querySelectorAll('.data-role'));
        n = q.find(function (element) {return element.getAttribute('data-role') == 'profile-name'})
        t = q.find(function (element) {return element.getAttribute('data-role') == 'profile-title'})
        if (!userinfo.success) return alertMessage(userinfo.message)
        z = userinfo.token
        if (n && t) {
            n.innerHTML = `<span class="w-100 h-70 capitalize wrap fs-13p flex px-5p">${z.Full_name}</span>`
            t.innerHTML = `<span class="w-100 h-70 capitalize wrap fs-12p flex px-5p">${z.title}</span>`
        }
    
        for (const button of dropdown_button) {
            button.addEventListener('click',function () {
                let target = this.getAttribute('data-bs-toggle')
                let target_cont = document.querySelector(`.${target}`) || document.querySelector(`#${target}`) || document.querySelector(`[name="${target}"]`)
                if (target_cont) {
                    target_cont.classList.toggle('hidden')
                }
            })
        }
        postschema.body = JSON.stringify({token})
        m = await request('get-messages',postschema)
        if (!m.success) return alertMessage(m.message)
        m = m.message
        b = q.find(function (element) {return element.getAttribute('data-role') == 'notification-count-badge'})
        if (b) {
            j =  m.filter(function (elem) {  return elem.status == 'new'})
            if (j.length > 0) {
                b.classList.replace('hidden','center')
                b.innerText = j.length        
            }
        }
        let nfPanel = document.querySelector('ul.nf-panel');
        nfPanel.innerHTML = null
        for (const message of m) {
          let li = document.createElement('li');
          li.className = `list-group-item list-group-item-action dropdown-notifications-item hover-2 ${(message.status == 'new')? 'bc-tr-theme' : '' }` 
          li.setAttribute('data-message-type',message.type)
          li.innerHTML = `<div class="d-flex capitalize left">
                            <div class="flex-shrink-0 me-3">
                                <div class="avatar">
                                    <span class="w-40p h-40p rounded-circle bc-tr-theme center bold-2">${message.sender.name.substring(0,1)}</span>
                                </div>
                            </div>
                            <div class="flex-grow-1 list-link" data-id='${message.id}' data-message-type = "${message.type}" ${(message.type == 'p_message') ? 'data-href-target = "create-session"' : '' } >
                                <h6 class="mb-1">${message.title}</h6>
                                <p class="mb-0">${message.content}</p>
                                <p class="mb-0 fs-11p">from <b>${message.sender.name}</b></p>
                                <small class="text-muted fs-11p">${message.dateadded}</small>
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
    console.log(message)
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
    li.setAttribute('data-message-type',message.type)
    li.innerHTML = `<div class="d-flex capitalize left">
                      <div class="flex-shrink-0 me-3">
                          <div class="avatar">
                              <span class="w-40p h-40p rounded-circle bc-tr-theme center bold-2">${message.sender.name.substring(0,1)}</span>
                          </div>
                      </div>
                      <div class="flex-grow-1 list-link" data-id='${message.id}' data-message-type = "${message.type}" ${(message.type == 'p_message') ? 'data-href-target = "create-session"' : '' } >
                          <h6 class="mb-1">${message.title}</h6>
                          <p class="mb-0">${message.content}</p>
                          <p class="mb-0 fs-11p">from <b>${message.sender.name}</b></p>
                          <small class="text-muted fs-11p capitalize">just now</small>
                      </div>
                      <div class="flex-shrink-0 dropdown-notifications-actions">
                          <a href="javascript:void(0)" class="dropdown-notifications-read"><span class="badge badge-dot"></span></a>
                          <a href="javascript:void(0)" class="dropdown-notifications-archive delete-m" data-id='${message.id}'><span class="bx bx-x"></span></a>
                      </div>
                  </div>`
    nfPanel.insertBefore(li,nfPanel.childNodes[0])
    l = Array.from(nfPanel.querySelectorAll('div.list-link'))
    clicks(l,b,[message])
}
function clicks(l,b,m) {
    let menu = document.querySelector('[name="notification-dropdown"]');
    l.map(function (element) {
        let del  = Array.from(element.parentElement.querySelectorAll('a.delete-m'))
        del.map(function (button) {
            button.addEventListener('click',event2=>{
                deletechild(button.parentElement.parentElement.parentElement,button.parentElement.parentElement.parentElement.parentElement)
            })
        })
        element.addEventListener('click',async e=>{
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
                            }else{
                                b.classList.replace('center','hidden')
                            }
                        }
                        await request('mark-as-seen',postschema)

                    }
                }
                p = Array.from(v.parentElement.querySelectorAll('.pagecontentsection'))
                h = m.find(function (message) {
                    return message.id == element.getAttribute('data-id')
                })
                if (h.addins) {
                    sessionStorage.setItem('pinfo',JSON.stringify(h.addins));
                }else{
                    sessionStorage.setItem('pinfo',JSON.stringify(h.extra));
                }
                if (v) {
                    s = p.indexOf(v)
                    cpgcntn(s,p)
                }
            } catch (error) {
              console.log(error)  
            }
            
        })
    }) 
}
export default userinfo