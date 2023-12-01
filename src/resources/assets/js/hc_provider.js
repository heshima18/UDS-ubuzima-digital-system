
import { alertMessage, getdata, getschema, postschema, request,deletechild, checkEmpty, showRecs, getchips,getPath,calcTime,addsCard,cpgcntn, geturl,sessiondata,addChip, showAvaiAssurances, adcm, addshade, addLoadingTab, removeLoadingTab, showAvaiEmps, fT, promptHpsToChoose, addAuthDiv, RemoveAuthDivs, showFingerprintDiv, removeRec, promptMessage, triggerRecs, extractTime, getDate, aDePh, addSpinner, addCFInps, removeSpinner } from "../../../utils/functions.controller.js";
import { showPaymentPopup } from "../../../utils/payments.popup.controller.js";
import { addUprofile } from "../../../utils/user.profile.controller.js";
import {pushNotifs, userinfo,expirateMssg, getNfPanelLinks,m as messages, DateTime, openmenu, addFilter} from "./nav.js";
import { viewTransfer } from "./transfer.js";
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,z,notificationlinks,socket,mh,m,extra
(async function () {
    z = userinfo
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
        try {
            socket = io(geturl(),{ query : { id: z.id} });
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
               let lis = promptHpsToChoose(message)
               lis.forEach(button=>{
                button.addEventListener('click',e=>{
                    e.preventDefault()
                    socket.emit('hpchoosen',{hp: {id: button.getAttribute('data-id'), name: button.getAttribute('data-name')}, token: localStorage.getItem('token')})
                })
            })
               
            })
            socket.on('changetoken',(token)=>{
                alertMessage('token changed')
                localStorage.setItem('token',token)
                window.location.href = window.location.href
            })
            socket.emit('messageToId',{recipientId: z.id, message: 'wassup'})
            if (typeof(z.hospital) != 'string' && typeof(z.hospital) == 'object' && z.hospital.length > 0) {
                socket.emit('getpsforselection',z.hospital)
                return 0
            }
        } catch (error) {
            console.log(error)
        }
    }
    postschema.body = JSON.stringify({token})
    let users = await request('get-hp-employees',postschema)

    if (!users.success) {
        return alertMessage(users.message)
    }
    let extra = {users: users.message}
    a = getPath(1)
    c = Array.from(document.querySelectorAll('span.cpcards'))
    p = Array.from(document.querySelectorAll('div.pagecontentsection'))
    const vsd = p.find(function (div) {
        return div.id == 'view-session' 
    })
    const theb = vsd.querySelector('div.theb')
    const raw = theb.innerHTML
    if(a){
        p.forEach(target=>{
            if (a == target.id) {
                t = p.indexOf(target)
                c.forEach((cp)=>{
                    cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
                })
                c[t].classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
                cpgcntn(t,p,extra)
                gsd(target)
                return 0
            }
        })
    }else{
        window.history.pushState('','','./home')
        cpgcntn(0,p,extra)

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
            url.pathname = `/hc_provider/${cudstp.getAttribute('data-item-type')}`;
            window.history.pushState({},'',url.toString())
            cpgcntn(c.indexOf(cudstp),p,extra)
            gsd(p.find(function (elem) {
                return elem.id == cudstp.getAttribute('data-item-type')
            }))
        })
    })
    notificationlinks = getNfPanelLinks()
    genClicks(notificationlinks)
    async function gsd(page,addin) {
        try {
            x = page.id
            if (x == 'home') {
                let num_hols = Array.from(page.querySelectorAll('[data-role="num_hol"]'))
                
              let messages = sessiondata('messages')
              let nmbrs = {in_pati: 0,appntmnt_mssg : 0,t_p_sessions: 0, t_s_sessions: 0}
                messages.map(function (me) {
                if (me.status == 'new') {
                    if (me.type == 'p_message') {
                        if (extractTime(me.dateadded,'date') == getDate('date')) {
                           nmbrs.in_pati +=1
                        }
                    }else if (me.type == '__APPNTMNT_MSSG_') {
                        nmbrs.appntmnt_mssg +=1
                    }
                }
              })
              if (mh) {
              }else{
                mh  = await request('get-hcp-sessions',postschema)
              }
              if (mh.success) {
                mh.message.map(function (session) {
                    if (session.status == 'open') {
                        nmbrs.t_p_sessions +=1
                       }
                    if (extractTime(session.date,'date') == getDate('date')) {
                       nmbrs.t_s_sessions +=1
                    }
                })
              }
              num_hols.forEach(holder=>{
                let holderlink = holder.parentElement.parentElement.querySelector('a')
                holderlink.onclick = function (event) {
                    event.preventDefault()
                    let link = this.getAttribute('data-redirect')
                    if (link.indexOf('#') == -1) {
                        let url = new URL(window.location.href);
                        url.pathname = `/hc_provider/${link}`;
                        window.history.pushState({},'',url.toString())
                        const evnt = new Event('urlchange', { bubbles: true });
                        window.dispatchEvent(evnt);
                    }else{
                        link = link.replace(/_/g,' ')
                        link = link.replace(/#/g,'')
                        openmenu();
                        addFilter(link)
                    }
                }
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
            s = f.querySelector('input[type="text"]');
            setTimeout(e=>{s.focus()},200)
            b = f.querySelector('button[type="submit"]')
            if (getPath(2)) {
                b.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                b.setAttribute('disabled',true)
                r = await request(`patient/${getPath(2)}`,postschema)
                s.value = getPath(2)
                b.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                b.removeAttribute('disabled')
                if (!r.success) {
                    alertMessage(r.message)
                }else{
                    addUprofile(r.message);
                }
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
                if (!r.success){
                    alertMessage(r.message)
                }else{
                    addUprofile(r.message);
                    let url = new URL(window.location.href);
                    url.pathname = `/hc_provider/search-patient/${r.message.id}`;
                    window.history.pushState({},'',url.toString())
                }
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
                if (!r.success){ 
                    return alertMessage(r.message)
                }else{
                    addUprofile(r.message);
                    let url = new URL(window.location.href);
                    url.pathname = `/hc_provider/search-patient/${s.value}`;
                    window.history.pushState({},'',url.toString())
                }
          
            }
            }else if (x == 'my-account') {
                n = page.querySelector('span.name')
                z = getdata('userinfo')
                n.textContent = z.Full_name
                i = page.querySelector('span.n-img');
                i.textContent = z.Full_name.substring(0,1)
                let editbuts = Array.from(page.querySelectorAll('span.icon-edit-icon'))
                for (const button of editbuts) {
                    button.addEventListener('click',()=>{
                        l = button.getAttribute('data-target')
                        shedtpopup(l,r);
                    })
                }
          
            }else if (x == 'create-session') {
                try {
                    
                    f = document.querySelector('form#create-session-form')
                    i = Array.from(f.querySelectorAll('.main-input'))
                    let asb = f.querySelector('span#add-symptom');
                    let arb = f.querySelector('span#add-decisions');
                    let vsgns = f.querySelector('input#vs');
                    let extras_input = Array.from(f.querySelectorAll('input.extras'));
                    let op_input = f.querySelector('input[name="operations"]');
                    vsgns.onclick = function (event) {
                        event.preventDefault()
                        promptVSPopup(this)
                    }
                    extras_input.forEach(input => {
                        input.removeEventListener('keyup', input._keyupHandler);
                        input._keyupHandler = function(event) {
                            if (this.value) {
                                triggerRecs(input,['id','name',(input.name == 'tests' || input.name == 'operations')?'department':'unit' ,'price'],socket)
                            }else{
                                removeRec(input)

                            }
                            return;
                        };
                        input.addEventListener('keyup', input._keyupHandler);
                    });
                    op_input.onkeyup =  function(event){
                        if (this.value) {
                            triggerRecs(op_input,['id','name',(op_input.name == 'tests' || op_input.name == 'operations')?'department':'unit' ,'price'],socket)
                        }else{
                            removeRec(op_input)

                        }
                    
                    }
                    asb.onclick = e=>{
                      let parent = asb.parentNode
                      let inp = parent.querySelector('input')
                      if (inp.value.trim()) {
                        let chipsHolder = parent.querySelector('div.chipsholder')
                        if (!chipsHolder) {
                          chipsHolder = document.createElement('div');
                          chipsHolder.className = 'chipsholder p-5p bsbb w-100'
                          chipsHolder.title = 'symptoms'
                          parent.insertAdjacentElement('beforeEnd',chipsHolder)
                        }
                        addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder,['id'])
                        inp.value = null
                      }
                    }
                    arb.onclick = e=>{
                      let parent = arb.parentNode
                      let inp = parent.querySelector('input')
                      if (inp.value.trim()) {
                        let chipsHolder = parent.querySelector('div.chipsholder')
                        if (!chipsHolder) {
                          chipsHolder = document.createElement('div');
                          chipsHolder.className = 'chipsholder p-5p bsbb w-100'
                          chipsHolder.title = 'results'
                          parent.insertAdjacentElement('beforeEnd',chipsHolder)
                        }
                        addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder,['id'])
                        inp.value = null
                      }
                    }
                    n = i.find(function (e) {return e.id == 'patient'})
                    let ass = i.find(function (e) {return e.id == 'assurance'})

                    if (addin) {
                      n.value = addin.name
                      n.setAttribute('data-id',addin.patient)
                      if (typeof addin.assurance == 'object') {
                        ass.value = addin.assurance[0].id
                      }else{
                          ass.value = addin.assurance
                      }
                    }
                    let val
                    n.onfocus = ()=>{
                        if (addin) {
                            if (addin.nid) {
                                n.value = addin.nid
                            }else{
                                n.value = addin.patient
                            }
                            n.setAttribute('data-id',addin.patient)
                        }
                        val = n.value
                    }
                    n.onblur = async ()=>{
                        if (n.value != val) {
                         v = await upPatInfo(n)
                        }
                        if (addin) {
                            n.value = addin.name
                            n.setAttribute('data-id',addin.patient)
                        }
                    }
                    async function upPatInfo(n) {
                        if (n.value) {
                            n.parentNode.querySelector('span').classList.replace('hidden','center-2')
                            postschema.body = JSON.stringify({token: getdata('token')})
                            const p = await request(`patient/${n.value.trim()}`,postschema)
                            if (!p.success) {
                             sessionStorage.removeItem('pinfo');
                             n.removeAttribute('data-id');
                             return n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                            }
                            n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                            n.value = p.message.Full_name
                            n.setAttribute('data-id',p.message.id)
                            let a = await showAvaiAssurances(p.message.assurances)
                            l = Array.from(a.querySelectorAll('li.assurance'))
                            for (const lis of l) {
                              lis.addEventListener('click',async function(event){
                                  event.preventDefault();
                                  this.classList.add('selected')
                                  let assurance = this.getAttribute('data-id');
                                  if (assurance == "null") {
                                    assurance = null
                                  }
                                  addin = {patient:p.message.id,name:p.message.Full_name,assurance,nid:p.message.nid}
                                  ass.value = addin.assurance
                                  deletechild(a,a.parentNode)
                                  addsCard('Assurance Selected',true)
                                });
                            }
                          }else{
                            n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                          }
                    }
                    let button = f.querySelector('button[type="submit"]')
                    f.onsubmit =  async e =>{
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
                        if(input.classList.contains('chips-check')){
                            if (input.name == "tests") {
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','sample','result'])})
                            } if (input.name == "medicines") {
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','status','quantity','price','comment'])})
                            }else if (input.classList.contains('extras')) {
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','quantity'])})     
                            }else if (input.name == "operations") {
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','operator'])})
                            }else{
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'))})
                            }
                        }else if (input.classList.contains('bevalue')) {
                            Object.assign(b,{[input.name]: input.getAttribute('data-id')})
                        }else{
                            Object.assign(b,{[input.name]: input.value})
                        }
                        }
                        if (v) {
                            // Object.assign(b,{ assurance: sessiondata('pinfo').assurance})
                            Object.assign(b,{ token: getdata('token')})
                            if (!b.assurance) {
                                b.assurance = null
                            }
                            postschema.body = JSON.stringify(b)
                            button.setAttribute('disabled',true)
                            button.textContent = 'recording session info...'
                            r = await request('addsession',postschema);
                            button.removeAttribute('disabled',true)
                            button.textContent = 'create session'
                            alertMessage(r.message)
                        }
                    }
                } catch (error) {
                console.log(error)  
                }
            }else if (x == 'view-session') {
                theb.innerHTML = raw
                if (addin && !getPath(2)) {
                    let url = new URL(window.location.href);
                    url.pathname = `/hc_provider/view-session/${addin}`;
                    window.history.pushState({},'',url.toString())
                }
              let session = getPath(2)
              addLoadingTab(page.querySelector('div.theb'));
              let session_input = page.querySelector('input#session-id');
              let session_s_button = page.querySelector('button[name="session-search"]');
              session_s_button.onclick =  async event=>{
                event.preventDefault();
                if (session_input.value != '' && session_input.value != session) {
                    if (!session) {
                        removeLoadingTab(page.querySelector('div.theb'));
                    }
                    session = session_input.value;
                    postschema.body = JSON.stringify({token: getdata('token')})
                    addLoadingTab(page.querySelector('div.theb'));
                    session_s_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                    session_s_button.setAttribute('disabled',true)
                    let sessiondata =  await request(`session/${session}`,postschema)
                    if (sessiondata.success) {
                        theb.innerHTML = raw
                        sessionStorage.removeItem('minfo')
                        session_input.value = session
                        let url = new URL(window.location.href);
                        url.pathname = `/hc_provider/view-session/${session}`;
                        window.history.pushState({},'',url.toString())
                        showSession(sessiondata.message);
                    }
                    session_s_button.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                    session_s_button.removeAttribute('disabled')
                    if (!sessiondata.success) {alertMessage(sessiondata.message)}
                    
                }
              }
              if (session) {
                postschema.body = JSON.stringify({token: getdata('token')})
                let sessiondata =  await request(`session/${session}`,postschema)
                if (!sessiondata.success){
                    return alertMessage(sessiondata.message)
                }else{
                    session_input.value = session
                    sessiondata = sessiondata.message
                    showSession(sessiondata);
                }
              }
            }else if (x == 'appointments') {
                if (!page.classList.contains('loaded')) {
                    let appointments = await request('hcp-appointments',postschema)
                    if (appointments.success) {
                        appointments = appointments.message
                    }else{
                        return alertMessage(appointments.message)
                    }
                    let appointmentsHolder = page.querySelector('ul[data-role="appointments-holder"]')
                    appointmentsHolder.innerHTML = null
                    // Create a map to store users grouped by year and month
                    const groupedAppointments = new Map();
    
                    // Iterate through each user
                    appointments.forEach(appointment => {
                        const registrationDate = new Date(appointment.date_booked);
                        const year = registrationDate.getFullYear();
                        registrationDate.setMonth(registrationDate.getMonth())
                        const month = new Intl.DateTimeFormat('en-US',{month: 'long',}).format(registrationDate); // Month is zero-based
    
                        // Create the year container if it doesn't exist
                        if (!groupedAppointments.has(year)) {
                            groupedAppointments.set(year, new Map());
                        }
    
                        // Create the month container if it doesn't exist inside the year container
                        if (!groupedAppointments.get(year).has(month)) {
                            groupedAppointments.get(year).set(month, []);
                        }
    
                        // Add the appointment to the appropriate month container inside the year container
                        groupedAppointments.get(year).get(month).push(appointment);
                    });
    
                    // Convert the map to an array for a structured result
                    const structuredArray = Array.from(groupedAppointments, ([year, months]) => ({
                        year: year,
                        months: Array.from(months, ([month, appointments]) => ({
                            month: month,
                            appointments: appointments
                        }))
                    }));
                    for (const year of structuredArray) {
                        for (const month of year.months) {
                            let li = document.createElement('li')
                            li.className = `ovh`
                            appointmentsHolder.appendChild(li)
                            li.innerHTML = `<div class="w-100 h-70p p-5p my-10p">
                                                <div class="w-100 h-100 bc-tr-white">
                                                    <div class="header w-100 h-60p card-1 br-5p bc-white p-r block hover-2">
                                                        <div class="w-100 h-100 flex jc-sb p-5p bsbb">
                                                            <span class="dgray center capitalize px-10p fs-16p">${month.month} / ${year.year}</span>
                                                            <span class="px-25p center spanner hover-2" data-role="span">
                                                                <span class="right-arrow tr-0-3"></span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="w-100 h-a p-10p bsbb appointment-holder"></div>
                                                </div>
                                            </div>`
                            const appointmentHol = li.querySelector(`div.appointment-holder`)
                            for (const appointment of month.appointments) {
                                if (appointment.status != 'open') {
                                    let ss = document.createElement('div')
                                    appointmentHol.appendChild(ss)
                                    ss.className = `w-250p h-a bfull-resp p-5p bsbb iblock`
                                    ss.innerHTML = `<div class="card">
                                                            <div class="p-15p capitalize dgray flex jc-sb">
                                                                <div class="flex">
                                                                    <span class="black fs-20p px-5p hover-2">#</span><span class="center hover-2">${appointment.id}</span>
                                                                </div>
                                                                <span class="btn  btn-sm ${(appointment.status == 'declined')? 'bc-tr-red red' : (appointment.status == 'approved') ? 'bc-tr-theme theme' : (appointment.status == 'finished') ? 'bc-gray dgray' : 'bc-gray dgray' }" data-role="button">${appointment.status}</span>  
                                                            </div>
                                                            <div class="p-15p hover-2" data-role="button" data-id="${appointment.id}" id ="view-appointment">
                                                                <h5 class="card-title capitalize">${appointment.subject}</h5>
                                                                <p class="px-5p">
                                                                <span class="capitalize fs-14p">appointment with ${appointment.patient}</span>
                                                                </p>
                                                                <p class="px-5p">
                                                                <span class="capitalize fs-14p">on ${fT(appointment.time)}</span>
                                                                </p>
                                                                <p class="flex">
                                                                    <span class="dgray fs-15p px-5p">${calcTime(appointment.date_booked)}</span>
                                                                </p>
                                                            </div>
                                                        </div>`
                                }
                            }
                            if (!appointmentHol.innerHTML) {
                                let div = document.createElement('div')
                                div.className = `ovh center-2`
                                appointmentHol.appendChild(div)
                                div.innerHTML = `<span class="capitalize dgray flex fs-16p bold-2">no entries available</span>`
                            }
                        }
                    }
                    let spans = Array.from(page.querySelectorAll('[data-role="span"]'))
                    for (const spanner of spans) {
                        spanner.parentNode.parentNode.addEventListener('click', event=>{
                            event.preventDefault()
                            spanner.children[0].classList.toggle('down-arrow');
                            spanner.children[0].classList.toggle('left-arrow');
                            let lep = spanner.parentNode.parentNode.parentNode.parentNode
                            lep.classList.toggle('h-a')
                        })
                    }
                    let buttons = Array.from(page.querySelectorAll('[data-role="button"]'))
                    buttons.map(button=>{
                        button.onclick = function (event) {
                            if (button.classList.contains('loading')) {
                                return 0
                            }
                            event.preventDefault();
                            if (button.id == 'appointment') {
                                    addAppointmentDiv()
                                    
                                }else if (button.id == 'view-appointment') {
                                    let appointment = button.getAttribute('data-id');
                                    viewAppointmentDiv(appointment)
                                }
                            }
                        })
                    page.classList.add('loaded')
                    
                }
            }else if (x == 'my-sessions') {
                let t = page.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    addLoadingTab(page.querySelector('div.theb'));
                    postschema.body = JSON.stringify({
                        token: getdata('token')
                    })
                    if (!mh) {
                        mh  = await request('get-hcp-sessions',postschema)
                    }
                    if (mh.success) {
                        initTable(mh.message)
                    }else{
                        alertMessage(mh.message)
                    }
                }
                // Delete employee when delete icon clicked
                function initTable(data) {
                    removeLoadingTab(page.querySelector('div.theb'))
                    let table = $('.datatables-prescriptions');
                        if (t.classList.contains('loaded')) {
                            e.destroy()
                        }
                        e = table.DataTable({
                            // Define the structure of the table
                            dom: '<"row mx-2"<"col-md-2 p-10p"<"me-3"l>><"col-md-10 p-10p"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                            language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                            columns: [
                                { data: "",title: "" }, // Responsive Control column
                                { data: "patient_name", title: "patient" },
                                { data: "assurance", title: "insurance" },
                                { data: "status", title: "Status" },
                                { data: "date", title: "date" },
                                { title: "Action", data: 'session_id'}
                            ],
                            columnDefs: [
                                // Define column properties and rendering functions
                                {
                                    className: "control",
                                    searchable: !1,
                                    orderable: !1,
                                    responsivePriority: 2,
                                    targets: 0,
                                    render: function () {
                                        return "";
                                    },
                                },
                                {
                                    targets: 1,
                                    searchable: 1,
                                    orderable: 1,
                                    render: function (e, t, a, n) {
                                        return (
                                            `<span class="capitalize text-muted">${e}</span>`
                                        );
                                    },
                                },
                                {
                                    targets: 2,
                                    searchable: 1,
                                    orderable: 1,
                                    render: function (e, t, a, n) {
                                        return (
                                            `<span class="dgray">${e}</span>`
                                        );
                                    },
                                },
                                {
                                    targets: 3,
                                    searchable: 1,
                                    orderable: 1,
                                    render: function (e, t, a, n) {
                                        return (
                                            `<span class=" btn btn-sm ${(e == 'open')? 'bc-tr-green green' : 'bc-gray dgray'}">${e}</span>`
                                        );
                                    },
                                },
                                {
                                    targets: 4,
                                    searchable: 1,
                                    orderable: 1,
                                    render: function (e, t, a, n) {
                                        return (
                                            `<span class="text-muted">${e}</span>`
                                        );
                                    },
                                },
                                {
                                    targets: -1,
                                    searchable: !1,
                                    orderable: !1,
                                    render: function (e, t, a, n) {
                                        return (
                                            `<div class="d-inline-block text-nowrap">
                                            <button class="btn btn-sm btn-icon view border border-3 dgray" data-id="${e}"><i class="bx bx-show"></i></button>
                                        </div>`
                                        );
                                    },
                                },
                            ],
                            order: [[1, "asc"]], // Initial sorting
                
                            // Provide the data from the imported inventory
                            data: data,
                
                            // Define buttons for exporting and adding new inventory
                            buttons: [
                                {
                                    extend: "collection",
                                    className: "btn btn-primary dropdown-toggle mx-3",
                                    text: '<i class="bx bx-export me-1"></i>Export',
                                    buttons: [
                                        {
                                            extend: "print",
                                            text: '<i class="bx bx-printer me-2" ></i>Print',
                                            className: "dropdown-item",
                                        },
                                        {
                                            extend: "excel",
                                            text: '<i class="bx bxs-file-export me-2"></i>Excel',
                                            className: "dropdown-item",
                                        },
                                        {
                                            extend: "pdf",
                                            text: '<i class="bx bxs-file-pdf me-2"></i>Pdf',
                                            className: "dropdown-item",
                                        },
                                    ],
                                },
                                
                            ],
                
                            // Initialize filters for position, health post, and status
                            initComplete: function () {
                                // Filter by Position
                                t.classList.add('loaded')
                                this.api().columns(2).every(function () {
                                    var t = this,
                                        a = $('<select class="form-select text-capitalize"><option value=""> filter by Insurance</option></select>')
                                            .appendTo(".health-facility")
                                            .on("change", function () {
                                                var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                                t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                                            });
                                    t.data().unique().sort().each(function (e, t) {
                                        a.append('<option value="' + e + '">' + e + "</option>");
                                    });
                                });
                            }
                        });
                    }
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                        setTimeout(checkButtons,10)
                        if (settings.nTable.classList.contains('datatables-prescriptions')) {
                            let min = minDate.value;
                            let max = maxDate.value;
                            let date = new Date(data[4]).toISOString().split('T')[0]; // Assuming the date is in a format compatible with JavaScript Date objects
                            if (
                                (min === "" && max === "") ||
                                (min === "" && date <= max) ||
                                (min <= date && max === "") ||
                                (min <= date && date <= max)
                            ) {
                                return true;
                            }
                            return false;
                        }
                        return true
                    })
                    let table = page.querySelector('.dataTables_paginate');
                    table.addEventListener('click', e=>{
                        setTimeout(checkButtons,10)

                    })
                    let viewbut = Array.from(page.querySelectorAll('button.view'))
                    viewbut.forEach(button => {
                        button.onclick = async function (event) {
                            event.preventDefault();
                            let url = new URL(window.location.href);
                            url.pathname = `/hc_provider/view-session/${this.getAttribute('data-id')}`;
                            window.history.pushState({},'',url.toString())
                            const evnt = new Event('urlchange', { bubbles: true });
                            window.dispatchEvent(evnt);
                        }
                    });
                    function checkButtons() {
                        let viewbut = Array.from(page.querySelectorAll('button.view'))
                       
                        viewbut.forEach(button => {
                            button.onclick = async function (event) {
                                event.preventDefault();
                                let url = new URL(window.location.href);
                                url.pathname = `/hc_provider/view-session/${this.getAttribute('data-id')}`;
                                window.history.pushState({},'',url.toString())
                                const evnt = new Event('urlchange', { bubbles: true });
                                window.dispatchEvent(evnt);
                            }
                        }); 
                    }
                    let dateRangeForm = page.querySelector('form[name="date-range"]')
                    let inputs = Array.from(dateRangeForm.querySelectorAll('input'))
                    let minDate = inputs[0]
                    let maxDate = inputs[1]
                    dateRangeForm.onsubmit = function (event) {
                        event.preventDefault();
                        let values = {}
                        e.draw();
                        // let fileredData = e.rows({ search: 'applied'}).data().toArray();
                        // console.log(fileredData)
                        for (const input of inputs) {
                            if (!input.value) {
                                return 0
                            }
                            Object.assign(values,{[input.id]: new Date(input.value).toISOString().split('T')[0]})
                        }
                    }
                   
                    
            }
            function showSession(sessiondata) {
                removeLoadingTab(page.querySelector('div.theb'))
                Object.assign(sessiondata.payment_info,{total_amount: Number(sessiondata.payment_info.a_amount) + Number(sessiondata.payment_info.p_amount)})
                const dataHolders = Array.from(document.querySelectorAll('span[name="info-hol"]'))
                const loopingDataHolders = Array.from(document.querySelectorAll('ul[name="looping-info"]'))
                if (!sessiondata.p_info.bgroup) {
                    let abgparent = document.querySelector('[data-hold="p_info.bgroup"]').parentElement,abgbutton = document.createElement('button')
                    abgparent.appendChild(abgbutton)
                    abgbutton.className = `btn-primary btn capitalize btn-sm mt--2p mx-10p`
                    abgbutton.innerText = `add`
                    abgbutton.onclick = function (event) {
                        event.preventDefault();
                        v = addshade();
                        let cont = document.createElement('div')
                        v.appendChild(cont)
                        cont.className = `br-10p cntr card p-10p bsbb w-450p h-a b-mgc-resp`
                        cont.className = `br-10p cntr card p-10p bsbb w-450p h-a b-mgc-resp`
                        cont.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
                            <div class="head w-100 px-5p py-10p bsbb">
                                <span class="capitalize bold-2 fs-20p">add blood group</span>
                            </div>
                            <div class="body p-5p bsbb w-100 h-91">
                                <div class="w-100 h-100">
                                    <div class="w-100 h-50p my-10p p-r">
                                        <input class="form-control bevalue">
                                        <small class="red capitalize hidden"></small>
                                    </div>
                                    <div class="w-100 h-a py-10p mt-20p flex">
                                        <span class="px-10p bsbb">
                                            <button type="button" class="btn btn-primary capitalize" data-role="button" id="process">proceed</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>`
                        let inp = cont.querySelector('input');
                        b = cont.querySelector('button');
                        inp.onfocus = function (event) {
                            event.preventDefault()
                            let data = [
                                {id: 'A+', name: 'A+'},
                                {id: 'A-', name: 'A-'},
                                {id: 'B+', name: 'B+'},
                                {id: 'B-', name: 'B-'},
                                {id: 'AB+', name: 'AB+'},
                                {id: 'AB-', name: 'AB-'},
                                {id: 'O+', name: 'O+'},
                                {id: 'O-', name: 'O-'},
                            ]
                            showRecs(inp,data,'other')
                        }
                        b.onclick = async  function (event) {
                            event.preventDefault();
                            if (inp.value.trim()) {
                                let val = inp.value
                                postschema.body = JSON.stringify({
                                    b_group: val,
                                    token: getdata('token'),
                                    patient : sessiondata.p_info.id
                                })
                                let response = await request('addPatiBg',postschema)
                                if (response.success) {
                                    alertMessage(response.message)
                                    deletechild(v,v.parentNode)
                                    deletechild(abgbutton,abgparent)
                                }else{
                                    alertMessage(response.message)
                                }
                            }
                        }
                    }
                }
                if (sessiondata.status == 'transferred') {
                    let vtb = document.createElement('li'),bh = page.querySelector('ul.buttons-holder')
                    bh.appendChild(vtb)
                    vtb.innerHTML = `<span class="btn btn-sm btn-primary mx-5p">view transfer info</span>`
                    vtb.className = `p-2p bsbb flex`
                    vtb.setAttribute('data-id', sessiondata.session_id)
                    vtb.onclick = function (Event) {
                        Event.preventDefault();
                        viewTransfer(sessiondata.session_id)
                    }
                }
                for (const element of loopingDataHolders) {
                    let dataToHold = element.getAttribute('data-hold');
                    let dataToShow = sessiondata[dataToHold]
                    for (const data of dataToShow) {
                        if (dataToHold != 'tests') {
                            Object.assign(data,{total_amount: (Number(data.price) * Number(data.quantity)).toFixed(2)})
                        }
                        let clonedNode = element.cloneNode(true);
                        let dataHolders = Array.from(clonedNode.querySelectorAll('[name="looping-info-hol"]'))
                        if (dataToHold == 'medicines') {
                            if (data.status == 'served') {
                                clonedNode.classList.add('bc-tr-green')
                                dataHolders.find(function(element) {return element.getAttribute('data-hold') == 'name'}).classList.replace('dgray','green')
                            }else{
                                clonedNode.classList.add('bc-gray')
                            }
                            if (data.servedOut) {
                                let span = document.createElement('span')
                                span.innerText = '( served out )'
                                span.className = `fs-10p p-a t-0 mt-50p l-0 ml-25p`
                                clonedNode.appendChild(span)
                            }
                        }else if (dataToHold == 'tests') {
                            for (const key of Object.keys(data)) {
                                if ('tester'!= key && 'name'!= key && 'id'!= key) {
                                    let li = document.createElement('li')
                                    li.className = `p-2p bsbb block`
                                    li.innerHTML = `<span class="pname dgray fs-15p pr-5p block">${key}</span>
                                        <span class="pname dgray fs-16p bold-2" name="looping-info-hol" data-hold="${key}" data-secondary-holder="true">${key}</span>`
                                    clonedNode.appendChild(li)
                                }
                            }
                            dataHolders = Array.from(clonedNode.querySelectorAll('[name="looping-info-hol"]'))
                        }
                       for (const dataHolder of dataHolders) {
                        if (dataHolder.getAttribute('data-hold').indexOf('quantity') != -1 || dataHolder.getAttribute('data-hold').indexOf('amount') != -1) {
                            dataHolder.innerText = adcm(data[dataHolder.getAttribute('data-hold')])
                        }else if (dataHolder.getAttribute('data-hold') == 'results') {
                            if (data[dataHolder.getAttribute('data-hold')] == "positive" || data[dataHolder.getAttribute('data-hold')] == "positif") {
                                dataHolder.classList.add('green')
                                dataHolder.classList.remove('dgray')
                            }else{
                                dataHolder.classList.remove('dgray')
                                dataHolder.classList.add('red')
                            }
                            dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]
                        }else if ((dataToHold == 'decisions' && !dataHolder.getAttribute('data-hold')) || dataToHold == 'symptoms' && !dataHolder.getAttribute('data-hold')) {
                            dataHolder.innerText = data
                        }else{
                            dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]
                        }
                       }
                       element.parentNode.appendChild(clonedNode)
                    }
                    if(dataToShow.length == 0){
                        aDePh(element.parentElement)
                    }
                    element.parentNode.removeChild(element)

                }
                for (const holder of dataHolders) {
                        let objectId = holder.getAttribute('data-hold')
                        if (objectId.indexOf('.') != -1) {
                            objectId = objectId.split('.')
                            if (objectId[1].indexOf('amount') != -1) {
                                holder.innerText = adcm(sessiondata[objectId[0]][objectId[1]])
                            }else if (objectId[0] == 'p_info' && objectId[1].indexOf('name') != -1) {
                                holder.innerHTML = sessiondata[objectId[0]][objectId[1]] + '<i class="fas fa-external-link-alt px-5p"></i>'
                                holder.classList.add('hover-6','data-buttons')
                                holder.setAttribute('data-role', 'show-profile')
                                holder.setAttribute('data-id', sessiondata[objectId[0]].id)
                            } else{
                                holder.innerText = sessiondata[objectId[0]][objectId[1]]
                            }
                        }else{
                            if (holder.getAttribute('data-hold').indexOf('status') != -1) {
                                if (sessiondata[holder.getAttribute('data-hold')] == "open") {
                                    holder.classList.replace('bc-gray','bc-tr-theme')
                                }
                            }
                            holder.innerText = sessiondata[objectId]
                        }
                }
                let Modals = new popups(sessiondata,extra.users,socket)
                const dataButtons = Array.from(page.querySelectorAll('span.data-buttons'))
                dataButtons.map(function (button) {
                    if (button.getAttribute(`data-role`) == 'close' || button.getAttribute(`data-role`) == 'transfer') {
                        if (sessiondata.status == `closed` || sessiondata.status == `transferred`) {
                            deletechild(button,button.parentNode)
                            button.classList.add('loading')
                            button.classList.replace('bc-tr-theme','bc-gray')
                        }
                    }else if (sessiondata.payment_info.status != 'awaiting payment' && button.getAttribute('data-role') == 'request-payment') {
                        deletechild(button, button.parentElement)
                    }
                    button.onclick =  async  e=>{
                        e.preventDefault();
                        if (button.classList.contains('loading')) {
                            return 0
                        }
                        let role = button.getAttribute('data-role');
                        if (role == 'test') {
                            Modals.test(extra.tests)
                        }else if (role == 'medication') {
                            Modals.medication(extra.medicines)
                        }else if (role == 'equipment') {
                            Modals.equipment(extra.equipments)
                        }else if (role == 'service') {
                            Modals.service(extra.services)
                        }else if (role == 'operation') {
                            Modals.operation(extra.operations)
                        }else if (role == 'comment') {
                            Modals.comment(sessiondata.comment)
                        }else if (role == 'notify') {
                            Modals.notify()
                        }else if (role == 'decision') {
                            Modals.decision()
                        }else if (role == 'symptoms') {
                            Modals.symptoms()
                        }else if (role == 'transfer') {
                            Modals.transfer(extra.users,socket);
                        }else if (role == 'close') {
                            postschema.body = JSON.stringify({
                                session: sessiondata.session_id,
                                token: getdata('token')
                            })
                            button.classList.add('loading')
                            let result = await request('close-session',postschema)
                            alertMessage(result.message)
                            if (result.success) {
                                page.querySelector('[data-hold="status"]').innerText = 'closed'
                                page.querySelector('[data-hold="status"]').classList.replace('bc-tr-theme',`bc-tr-theme`)
                                button.classList.replace('bc-tr-theme','bc-gray')
                                button.innerText = 'closed'
                                sessiondata.status = `closed`
                            }else{
                                button.classList.remove('loading')
                            }
                        }else if (role == 'show-profile') {
                            let url = new URL(window.location.href);
                            url.pathname = `/${getPath()[0]}/search-patient/${button.getAttribute('data-id')}`;
                            window.history.pushState({},'',url.toString())
                            deletechild(e,e.parentNode)
                            const evnt = new Event('urlchange', { bubbles: true });
                            window.dispatchEvent(evnt);
                        }else if (role == `request-payment`) {
                            if (button.classList.contains('loading')) {
                                return
                            }
                            let data = {session: sessiondata.session_id,patient: sessiondata.p_info.id,paymentType: 'user-payment',socket,facility:sessiondata.hp_info}
                            showPaymentPopup(data)
                        }
                    }
                })
            }
            
        } catch (error) {
            console.log(error)
          }
    }
    async function appApprovalCont(message) {
        let bgDiv = addshade();
        let cont = document.createElement('div')
        bgDiv.appendChild(cont)
        cont.className = `br-10p cntr card p-10p bsbb w-450p h-a b-mgc-resp`
        cont.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
            <div class="head w-100 px-5p py-10p bsbb">
                <span class="capitalize bold-2 fs-20p">Appointment Request from ${message.sender.name}</span>
            </div>
            <div class="body p-5p bsbb w-100 h-91 ovh">
                <div class="w-100 h-100 ovys scroll-2">
                    <div class="w-100 h-a my-10p">
                        <span class="dgray capitalize block">reason for appointment: </span>
                        <span class="black capitalize block">${message.content} </span>
                    </div>
                    <div class="w-100 h-a my-10p">
                        <span class="dgray capitalize block">description: </span>
                        <span class="black capitalize block">${(message.addins)? message.addins.content : message.extra.content} </span>
                    </div>
                    <div class="w-100 h-a my-10p">
                        <span class="dgray capitalize block">estimated time: </span>
                        <span class="black capitalize block" data-holder="date">
                            <div class="w-30p h-30p px-5p bsbb my-5p">
                                <div class="sk-grid sk-primary">
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                    <div class="sk-grid-cube bc-theme"></div>
                                </div>
                            </div>
                        </span>
                    </div>
                    <div class="w-100 h-a my-10p">
                        <span class="dgray capitalize block">custom time: </span>
                        <input type="datetime-local" name="time" class="form-control" id="time">
                    </div>
                    <div class="w-100 h-a py-10p mt-20p flex">
                        <span class="px-10p bsbb">
                            <button type="button" class="btn btn-primary capitalize" data-role="button" id="approve">approve</button>
                        </span>
                        <span class="px-10p bsbb">
                            <button type="button" class="btn btn-danger capitalize" data-role="button" id="decline">decline</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>`
        let estDateHol = cont.querySelector(`[data-holder="date"]`),custTime = cont.querySelector(`input[name="time"]`)
        postschema.body = JSON.stringify({token: getdata('token')})
        let time = await request('getAppointmentETA', postschema)
        if (time.success) {
            estDateHol.innerHTML = fT(time.message)
        }else{
            alertMessage(time.message)
        }
        let bs = Array.from(cont.querySelectorAll('[data-role="button"]'))
        bs.map(function (button) {
            button.addEventListener('click', async()=>{
                if (button.classList.contains('loading')) {
                    return 0
                }
                if (button.id == 'approve') {
                    let custTimef
                    if (custTime.value) {
                        custTimef = DateTime.fromISO(custTime.value)
                        custTimef = custTimef.toFormat('yyyy-MM-dd HH:mm:ss')
                        time.message = custTimef
                    }
                    postschema.body = JSON.stringify({
                        token : getdata('token'),
                        patient : message.sender.id,
                        subject : message.content,
                        message : (message.addins) ? message.addins.content : message.extra.content,
                        time : time.message,
                        status : 'approved',
                        dateadded : message.dateadded
                    })
                    button.classList.add('loading')

                    addSpinner(button)
                    let addApp = await request('add-appointment',postschema)
                    button.innerHTML = `approve`
                    button.classList.remove('loading')
                    removeSpinner(button)
                    if (addApp.success) {
                        deletechild(bgDiv,bgDiv.parentElement)
                    }
                    alertMessage(addApp.message)
                }else if (button.id == `decline`) {
                    let sdiv = addshade();
                    let scont = document.createElement('div')
                    sdiv.appendChild(scont)
                    scont.className = `br-10p cntr card p-10p bsbb w-450p h-a b-mgc-resp`
                    scont.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
                                        <div class="head w-100 px-5p py-10p bsbb">
                                            <span class="capitalize bold-2 fs-20p">reason for declining</span>
                                        </div>
                                        <div class="body p-5p bsbb w-100 h-91 ovh">
                                            <div class="w-100 h-100 ovys scroll-2">
                                                <div class="w-100 h-a my-10p">
                                                    <textarea class="h-100p form-control" placeholder="Reason" name="reason"></textarea>
                                                    <small class="red hiden capitalize"></small>
                                                </div>
                                                <div class="w-100 h-a py-10p mt-20p flex">
                                                    <span class="px-10p bsbb">
                                                        <button type="button" class="btn btn-primary capitalize" data-role="button" id="decline-app">proceed</button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>` 
                    let sbs = Array.from(scont.querySelectorAll('[data-role="button"]'))
                    sbs.map(function (button) {
                        button.addEventListener('click', async()=>{
                            if (button.classList.contains('loading')) {
                                return 0
                            }
                            if (button.id == 'decline-app') {
                                if (!scont.querySelector('.form-control').value.trim()) {
                                    return checkEmpty(scont.querySelector('.form-control'))
                                }
                                postschema.body = JSON.stringify({
                                    token : getdata('token'),
                                    patient : message.sender.id,
                                    subject : message.content,
                                    message : message.addins.content,
                                    time : time.message,
                                    status : 'declined',
                                    extra : {reason : scont.querySelector('.form-control').value.trim()},
                                    dateadded : message.dateadded
                                })
                                button.classList.add('loading')
                                button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                                let addApp = await request('add-appointment',postschema)
                                button.innerHTML = `proceed`
                                button.classList.remove('loading')
                                if (addApp.success) {
                                    deletechild(bgDiv,bgDiv.parentElement)
                                    deletechild(sdiv,sdiv.parentElement)

                                }
                                alertMessage(addApp.message)
                            }
                        })
                    })
                }
            })
        })
    }
    function genClicks(notificationlinks) {
        let messages = sessiondata('messages')
        notificationlinks.map((link)=>{
            link.addEventListener(`click`, ()=>{
                if (!link.classList.contains('list-link')) {
                    return 0
                }
                let message = messages.find(function (mess) {
                    return mess.id == link.getAttribute('data-id')
                })
                if (message) {
                let url = new URL(window.location.href);
                if (link.getAttribute('data-message-type') == 'test_res_message' || link.getAttribute('data-message-type') == 'session_message') {
                    let session 
                    if (message.addins) {
                        session = message.addins.session
                    }else if (message.extra) {
                        session = message.extra.session
                    }
                    if (session) {
                        url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}/${session}`;
                    }
                }else if (link.getAttribute('data-message-type') == '__APPNTMNT_MSSG_') {
                    appApprovalCont(message)
                    url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}`;
                }else if (link.getAttribute('data-message-type') == 'transfer_message' ) {
                    if ('extra' in message) {
                        viewTransfer(message.extra.transfer)
                    }else if ('addins' in message) {
                        viewTransfer(message.addins.transfer)
                    }
                }else if (link.getAttribute('data-message-type') == 'p_message') {
                    if (message.addins) { 
                        Object.assign(message.addins, {sender: message.sender})
                        extra = message.addins
                    }else{
                        Object.assign(message.extra, {sender: message.sender})
                        extra = message.extra
                        
                    }
                }else{
                    url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}`;
                }
                v = document.querySelector(`div#${link.getAttribute('data-href-target')}`)
                if (v) {
                    p = Array.from(v.parentElement.querySelectorAll('.pagecontentsection'))
                    window.history.pushState({},'',url.toString())
                    cpgcntn(p.indexOf(v),p)
                    gsd(v,extra)
                }
               }
            })
        })
    }
})();
function promptVSPopup(inp) {
    b = addshade();
    a = document.createElement('div');
    b.appendChild(a)
    a.className = "w-40 h-a mh-70 card-1 ovys h-a p-10p bsbb bc-white cntr zi-10000 br-5p" 
    a.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                    <span class="fs-17p dgray capitalize igrid h-100 verdana">enter vital signs information</span>
                                </div>
                                <div class="body w-100 h-a p-5p grid">
                                    <form method="post" id="req-VS-info-form" name="req-VS-info-form">
                                    <div class="col-md-12 px-10p py-6p bsbb p-r">
                                      <label for="temperature" class="form-label">temperature</label>
                                      <br>
                                      <span class="dgray">Normal Range: 36.5–37.5 °C</span>
                                      <input type="text" class="form-control" id="temperature" placeholder="Patient's temperature" name="temperature">
                                      <span class="p-a unit r-0 t-0 mt-69p dgray mr-20p">C°</span>
                                      <small class="w-100 red pl-3p verdana hidden"></small>
                                    </div>
                                    <div class="col-md-12 px-10p py-6p bsbb p-r">
                                      <label for="heart rate" class="form-label">Heart Rate (Pulse)</label>
                                      <span class="dgray"><br>Normal Range:
                                        <br>Adults at rest: 60–100 bpm
                                        <br>Children: 70–100 bpm
                                        <br>Infants: 100–160 bpm
                                        </span>
                                      <input type="text" class="form-control" id="heart rate" placeholder="Patient's heart rate" name="heart rate">
                                      <span class="p-a unit r-0 t-22 mt-100p dgray mr-20p">bpm</span>
                                      <small class="w-100 red pl-3p verdana hidden"></small>
                                    </div>
                                    <div class="col-md-12 px-10p py-6p bsbb p-r">
                                      <label for="Respiratory Rate" class="form-label">Respiratory Rate (Pulse)</label>
                                      <span class="dgray"><br>Normal Range:
                                        <br>Adults at rest: 12–20 bpm
                                        <br>Children: 15–30 bpm
                                        <br>Infants: 25–50 bpm
                                        </span>
                                      <input type="text" class="form-control" id="Respiratory Rate" placeholder="Patient's Respiratory Rate" name="Respiratory Rate">
                                      <span class="p-a unit r-0 t-22 mt-100p dgray mr-20p">bpm</span>
                                      <small class="w-100 red pl-3p verdana hidden"></small>
                                    </div>
                                    <div class="col-md-12 px-10p py-6p bsbb p-r">
                                      <label for="Blood Pressure" class="form-label">Blood Pressure</label>
                                      <span class="dgray"><br>Normal Range:
                                      <br>Normal: <120/<80 mm Hg
                                      <br>Elevated: 120–129/<80 mm Hg
                                      <br>Hypertension Stage 1: 130–139/80–89 mm Hg
                                      <br>Hypertension Stage 2: ≥140/≥90 mm Hg
                                      </span>
                                      <input type="text" class="form-control" id="Blood Pressure" placeholder="Patient's Blood Pressure" name="Blood Pressure">
                                      <span class="p-a unit r-0 t-31 mt-100p dgray mr-20p">mm Hg</span>
                                      <small class="w-100 red pl-3p verdana hidden"></small>
                                    </div>
                                    <div class="col-md-12 px-10p py-6p bsbb p-r">
                                      <label for="Oxygen Saturation" class="form-label">Oxygen Saturation (SpO2)</label>
                                      <span class="dgray"><br>Normal Range: 95–100%
                                      </span>
                                      <input type="text" class="form-control" id="Oxygen Saturation" placeholder="Patient's Oxygen Saturation" name="Oxygen Saturation">
                                      <span class="p-a unit r-0 t-0 mt-69p dgray mr-20p">%</span>
                                      <small class="w-100 red pl-3p verdana hidden"></small>
                                    </div>
                                    <div class="col-md-12 px-10p py-6p bsbb mb-5p p-r">
                                      <label for="height" class="form-label">height</label>
                                      <input type="text" class="form-control" id="height" placeholder="Patient's height" name="height">
                                      <span class="p-a unit r-0 t-0 mt-43p dgray mr-20p">cm</span>
                                      <small class="w-100 red pl-3p verdana hidden"></small>
                                    </div>
                                    <div class="col-md-12 px-10p py-6p bsbb mb-5p p-r">
                                      <label for="weight" class="form-label">weight</label>
                                      <input type="text" class="form-control" id="weight" placeholder="patient's weight"  name="weight">
                                      <span class="p-a unit r-0 t-0 mt-43p dgray mr-20p">kg</span>

                                      <small class="w-100 red pl-3p verdana hidden"></small>
                                    </div>
                                    <div class="center-2 my-15p px-10p bsbb">
                                        <button type="submit" class="btn btn-primary mx-10p">Proceed</button>
                                      </div>
                                    </form>
                                </div>`
    m = a.querySelector('form#req-VS-info-form')
    v = Array.from(a.querySelectorAll('input'))
    let chipsHolder = inp.parentElement.childNodes[7]
      if (!chipsHolder) {
        chipsHolder = document.createElement('div');
        chipsHolder.className = 'chipsholder p-5p bsbb w-100'
        chipsHolder.title = 'CF Questions'
        if (inp.classList.contains('chips-check')) {
          inp.parentElement.insertAdjacentElement('beforeEnd',chipsHolder)
        }
      }
    m.addEventListener('submit', (event)=>{
      event.preventDefault();
      l = 1
      s = []
      for (const input of v) {
        k = checkEmpty(input);
        if (!k) {
          l = 0
        }
        if (k) {
          s.push({name : input.name, value: input.value +" "+input.parentElement.querySelector('span.unit').innerText})
        }
      }
      if (l) {
        for (const vs of s) {
            addChip(vs,chipsHolder,['name','value'])
            
        }
        deletechild(b,b.parentNode)
      }
    })
  }
class popups{
    constructor(sessionData,users,socket){
        this.session = sessionData
        this.users = users
        this.socket = socket


    }
    async test(data){
        const socket = this.socket
        const session = this.session
        let testsP = addshade();
        a = document.createElement('div');
        testsP.appendChild(a)
        a.className = "w-40 h-a mh-70 p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1 ovys" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a test to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">test taken</label>
                                    <input type="text" class="form-control bevalue main-input" id="tests" placeholder="applying test" name="test">
                                    <small class="w-100 red pl-3p verdana hidden"></small>
                                </div>
                                <div class="cf-inps p-r  h-220p">
                         
                                  </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp my-10p">
                                    <button type="submit" class="btn btn-primary bfull-resp mr-10p bm-a-resp bmy-10p-resp">Proceed</button>
                                    <button type="button" class="btn bc-tr-theme ml-10p capitalize bfull-resp bm-a-resp bmy-10p-resp">Request for tesing</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let cInp = a.querySelector('div.cf-inps')
        addLoadingTab(cInp)
        let inputs
        let extra_input = a.querySelector('input#tests')
        extra_input.addEventListener('keyup', async (event)=>{
            if (extra_input.value) {
                data = await triggerRecs(extra_input,['id','name','department','price','type'],socket)
            }else{
                removeRec(extra_input)

            }
        })
        extra_input.onblur = async function (event) {
            let test = extra_input.getAttribute('data-id')
            if (test) {
                postschema.body = JSON.stringify({
                    token: getdata('token'),
                    test: test
                })
                let testInfo = await request('get-test',postschema)
                if (!testInfo.success) {
                    return alertMessage(testInfo.message)
                }
                const questions = testInfo.message.questions
                removeLoadingTab(cInp)
                addCFInps(questions,cInp)
                inputs = Array.from(form.querySelectorAll('.main-input'))    
            }
        }
        let notify_button = form.querySelector('button[type="button"]')
         notify_button.addEventListener('click',async event=>{
            event.preventDefault()
            if (!extra_input.getAttribute('data-id')) {
                return alertMessage('please select a test to proceed')
            }
            let testinfo = data.find( function (tests) {
                return tests.id == extra_input.getAttribute('data-id')
            })
            if (!testinfo) {
                return alertMessage('Test not found')
            }
            let emps = await showAvaiEmps(this.users,(testinfo.type == 'quick test')? null : {department: testinfo.department});
            if (!emps) {
                return
            }
            let content = await promptMessage()
            if (('object' == typeof emps)) {
                j = JSON.parse(postschema.body)
                Object.assign(j, 
                    {
                        title:'incoming test request',
                        token: getdata('token'),
                        receiver: [emps],
                        type: 'req_test_message', 
                        content: content,
                        extra: {
                            test: testinfo.id,
                            t_name: testinfo.name,
                            session: session.session_id, 
                            patient: session.p_info.id,
                            nid:session.p_info.nid,
                            patient_name:session.p_info.name,
                            symptoms: session.symptoms
                        },
                        controller: {
                            looping: true,
                            recipients: emps
                        }
                    }
                )
                try {
                    postschema.body = JSON.stringify(j)
                    notify_button.setAttribute('disabled',true)
                    notify_button.innerText = 'notifying the receivers...'
                    r =  await request('send-message',postschema)
                    if (!r.success) {
                        return alertMessage(r.message)
                    }
                    deletechild(testsP,testsP.parentNode)
                    notify_button.removeAttribute('disabled')
                    notify_button.innerText = 'receivers notified !'
                    notify_button.classList.replace('bc-tr-theme','bc-tr-grren')
                    addsCard('receivers notified !',true)

                } catch (error) {
                    console.log(error)
                }
                        
            }else{
                j = JSON.parse(postschema.body)
                Object.assign(j,
                    {
                        title:'incoming test request',
                        token: getdata('token'),
                        receiver: emps,
                        type: 'req_test_message', 
                        content: content,
                        extra: {
                            test: testinfo.id,
                            t_name: testinfo.name,
                            session: session.session_id, 
                            patient: session.p_info.id,
                            nid:session.p_info.nid,
                            patient_name:session.p_info.name,
                            symptoms: session.symptoms
                        },
                        controller: {
                            looping: false,
                            recipients: []
                        }
                    }
                )
                try {
                    postschema.body = JSON.stringify(j)
                    deletechild(p,p.parentNode)
                    deletechild(testsP,testsP.parentNode)
                    notify_button.setAttribute('disabled',true)
                    notify_button.innerText = 'notifying the receiver...'
                    r =  await request('send-message',postschema)
                    if (!r.success) {
                        return alertMessage(r.message)
                    }
                    notify_button.removeAttribute('disabled')
                    notify_button.innerText = 'receiver notified !'
                    notify_button.classList.replace('bc-tr-theme','bc-tr-theme')
                    addsCard('receiver notified !',true)
                } catch (error) {
                    console.log(error)
                }
               
            }
        })
        inputs = Array.from(form.querySelectorAll('.main-input'))
        form.addEventListener('submit', async event=>{
            event.preventDefault();
            l = 1
            let values = {}
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }else{
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                
                Object.assign(values,{test: {id:values.test}})
                let nval = {}
                for (const key of Object.keys(values)) {
                    Object.assign(nval, {[key]: values[key]})
                }
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                Object.assign(nval,{id: values.test.id})
                values.test = nval
                delete values.sample
                delete values.test.test
                delete values.test.price
                delete values.results
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-test',postschema)
                if (results.success) {
                    deletechild(testsP,testsP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    medication(data){
        const session = this.session
        const socket = this.socket
        let medicinesP = addshade();
        a = document.createElement('div');
        medicinesP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a medication to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="add-medicine-form" name="add-medicine-form">
                                <div class="col-md-12 p-10p bsbb mb-5p p-r">
                                    <label for="medicines" class="form-label">Applied Medicines</label>
                                    <input type="text" class="form-control extras chips-check" id="medicines" placeholder="Medication name" name="medicines">
                                    <small class="hidden w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('extras') })
        extra_input.addEventListener('keyup', (event)=>{
            if (extra_input.value) {
                triggerRecs(extra_input,['id','name','unit','price'],socket)
            }else{
                removeRec(extra_input)

            }
        })
        form.addEventListener('submit', async event=>{
            
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','quantity','status','comment']) })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-medicine',postschema)
                if (results.success) {
                    deletechild(medicinesP,medicinesP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    async operation(data){
        const session = this.session
        const socket = this.socket
        let operationsP = addshade();
        a = document.createElement('div');
        operationsP.appendChild(a)
        a.className = "w-60 h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1 mh ovys" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add an operation to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">operation name</label>
                                    <input type="text" class="form-control bevalue main-input" id="operations" placeholder="applying operation" name="operation">
                                    <small class="w-100 red pl-3p verdana hidden"></small>
                                </div>
                                <div class="cf-inps p-r ovh h-220p my-10p">
                         
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp mr-10p  bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let cInp = a.querySelector('div.cf-inps')
        addLoadingTab(cInp)
        let extra_input = form.querySelector('input#operations')
        let inputs
        extra_input.addEventListener('keyup', (event)=>{
            if (extra_input.value) {
                triggerRecs(extra_input,['id','name','department','price'],socket)
            }else{
                removeRec(extra_input)

            }
        })
        extra_input.onblur = async function (event) {
            event.preventDefault();
            let operation = this.getAttribute('data-id')
            if (operation) {
                postschema.body = JSON.stringify({
                    token: getdata('token'),
                    operation: operation
                })
                let opInfo = await request('operation',postschema)
                if (!opInfo.success) {
                    return alertMessage(opInfo.message)
                }
                const questions = opInfo.message.questions
                removeLoadingTab(cInp)
                addCFInps(questions,cInp)
                inputs = Array.from(form.querySelectorAll('.main-input'))
                let opin = inputs.find(function (inp) {
                    return inp.name == 'operator'
                  })
                  opin.value=getdata('userinfo').Full_name
                  opin.setAttribute('data-id',getdata('userinfo').id)
                  opin.classList.add('bevalue')
                  opin.setAttribute('readonly',true)
                  opin.setAttribute('disabled',true)

            }
        }
        form.addEventListener('submit', async event=>{
        inputs = Array.from(form.querySelectorAll('.main-input'))
            
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                }
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                Object.assign(values,{operation: {id: values.operation,operator: values.operator}})
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-operation',postschema)
                if (results.success) {
                    deletechild(operationsP,operationsP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    service(data){
        const session = this.session
        const socket  = this.socket
        let servicesP = addshade();
        a = document.createElement('div');
        servicesP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a service to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="add-service-info-form" name="add-service-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="service" class="form-label">service name</label>
                                    <input type="text" class="form-control bevalue" id="services" placeholder="name of the service" name="service">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="quantity" class="form-label">quantity</label>
                                    <input type="number" class="form-control" id="quantity" placeholder="quantity served" name="quantity">
                                    <span class="p-a t-0 t-0 mx-20p r-0 mt-44p capitalize" name="unit-hol"></span>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap p-r px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp cntr">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('keyup', (event)=>{
            if (extra_input.value) {
                triggerRecs(extra_input,['id','name','unit','price'],socket)
            }else{
                removeRec(extra_input)

            }
        })
       extra_input.addEventListener('blur',async ()=>{
        let unit = form.querySelector('span[name="unit-hol"]')
        let val =  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                    resolve(extra_input.getAttribute('data-unit'));
                    }, 20);
                });

        
        unit.innerText = val
       })
        form.addEventListener('submit', async event=>{
            
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                Object.assign(values,{service: {id: values.service, quantity: values.quantity}})
                delete values.quantity
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-service',postschema)
                if (results.success) {
                    deletechild(servicesP,servicesP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    equipment(data){
        const session = this.session
        const socket = this.socket
        let equipmentsP = addshade();
        a = document.createElement('div');
        equipmentsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a consumable to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="equipment-info-form" name="equipment-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="equipment" class="form-label">Consumable name</label>
                                    <input type="text" class="form-control bevalue" id="equipments" placeholder="name of consumable" name="equipment">
                                    <small class="w-100 red pl-3p verdana hidden"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="quantity" class="form-label">quantity</label>
                                    <input type="number" class="form-control" id="quantity" placeholder="amount of entry" name="quantity">
                                    <span class="p-a t-0 t-0 mx-20p r-0 mt-42p capitalize" name="unit-hol"></span>
                                    <small class="w-100 red pl-3p verdana hidden"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('keyup', (event)=>{
            if (extra_input.value) {
                triggerRecs(extra_input,['id','name','price','unit'],socket)
            }else{
                removeRec(extra_input)

            }
        })
       extra_input.addEventListener('blur',async ()=>{
        let unit = form.querySelector('span[name="unit-hol"]')
        let val =  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                    resolve(extra_input.getAttribute('data-unit'));
                    }, 20);
                });
        unit.innerText = val
       })
        form.addEventListener('submit', async event=>{
            
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                Object.assign(values,{equipment: {id: values.equipment, quantity: values.quantity}})
                delete values.quantity
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-equipment',postschema)
                if (results.success) {
                    deletechild(equipmentsP,equipmentsP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    comment(data){
        const session = this.session
        let commentsP = addshade();
        a = document.createElement('div');
        commentsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add comment to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">comment</label>
                                    <textarea class="form-control" id="comment" placeholder="Concluding comment" name="comment">${data}</textarea>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('.form-control'))
        form.addEventListener('submit', async event=>{
            
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-comment',postschema)
                if (results.success) {
                    deletechild(commentsP,commentsP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    } 
    decision(){
        const session = this.session
        let decisionsP = addshade();
        a = document.createElement('div');
        decisionsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-10p bsbb">
                            <span class="fs-20p bold-2 dgray capitalize igrid h-100 card-title">add result to session</span>
                        </div>
                        <span class="dgray px-5p fs-14p my-10p  bsbb capitalize">the diagnosis decisions after all diagonis operations caried out in the  session's process</span>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-decision-info-form" name="req-decision-info-form">
                                <div class="input-group my-10p">
                                    <input type="text" class="form-control chips-check" placeholder="decision " name="decisions" id="decision">
                                    <span class="input-group-text hover-2 us-none" id="add-decision">add</span>
                                    <small class="hidden w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp mt-15p">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('.chips-check'))
        let adb = form.querySelector('span#add-decision');
        adb.addEventListener('click',e=>{
            let parent = adb.parentNode
            let inp = parent.querySelector('input')
            if (inp.value.trim()) {
                let chipsHolder = parent.querySelector('div.chipsholder')
                if (!chipsHolder) {
                chipsHolder = document.createElement('div');
                chipsHolder.className = 'chipsholder p-5p bsbb w-100'
                chipsHolder.title = 'symptoms'
                parent.insertAdjacentElement('beforeEnd',chipsHolder)
                }
                addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder,['id'])
                inp.value = null
            }
        })
        form.addEventListener('submit', async event=>{
            
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]:  getchips(input.parentNode.querySelector('div.chipsholder'),['id']) })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-decisions',postschema)
                if (results.success) {
                    deletechild(decisionsP,decisionsP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    symptoms(){
        const session = this.session
        let symptomssP = addshade();
        a = document.createElement('div');
        symptomssP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-10p bsbb">
                            <span class="fs-20p bold-2 dgray capitalize igrid h-100 card-title">add symptoms to session</span>
                        </div>
                        <span class="dgray px-5p fs-14p my-10p  bsbb capitalize">the physical symptoms or the overall symptoms the patients is showing during the session's process</span>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-symptom-info-form" name="req-symptom-info-form">
                                <div class="input-group my-10p">
                                    <input type="text" class="form-control chips-check" placeholder="Symptom name" name="symptoms" id="symptom">
                                    <span class="input-group-text hover-2 us-none" id="add-symptom">add</span>
                                    <small class="hidden w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp mt-15p">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('.chips-check'))
        let adb = form.querySelector('span#add-symptom');
        adb.addEventListener('click',e=>{
            let parent = adb.parentNode
            let inp = parent.querySelector('input')
            if (inp.value.trim()) {
                let chipsHolder = parent.querySelector('div.chipsholder')
                if (!chipsHolder) {
                chipsHolder = document.createElement('div');
                chipsHolder.className = 'chipsholder p-5p bsbb w-100'
                chipsHolder.title = 'symptoms'
                parent.insertAdjacentElement('beforeEnd',chipsHolder)
                }
                addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder,['id'])
                inp.value = null
            }
        })
        form.addEventListener('submit', async event=>{
            
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
            let button = form.querySelector('button[type="submit"]')
            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]:  getchips(input.parentNode.querySelector('div.chipsholder'),['id']) })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                console.log(values)
                postschema.body = JSON.stringify(values)
                let results = await request('add-session-symptoms',postschema)
                if (results.success) {
                    deletechild(symptomssP,symptomssP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    notify(){
        const session = this.session
        let notifyP = addshade();
        a = document.createElement('div');
        notifyP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">notify users on this session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="notify" name="notify">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label uppercase dgray">message</label>
                                    <textarea class="form-control" id="message" placeholder="Text message" name="message"></textarea>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let input = form.querySelector('.form-control')
        form.addEventListener('submit', async event=>{
            
            event.preventDefault();
            l = 1
            v = checkEmpty(input);
            if (!v) {
                l = 0
            }
            
            if (l) {
                let button = form.querySelector('button[type="submit"]')
                button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                button.setAttribute('disabled',true)
                let employees = await showAvaiEmps(this.users)
                if (!employees) {
                    return
                }
                j = JSON.parse(postschema.body)
                Object.assign(j, 
                    {
                        title:'session preview request',
                        token: getdata('token'),
                        receiver: ('object' == typeof employees)? employees : employees,
                        type: 'session_message', 
                        content: input.value.trim(),
                        extra: {
                            session: session.session_id, 
                        },
                        controller: {
                            looping: ('object' == typeof employees)? true : false ,
                            recipients: ('object' == typeof employees)? employees : null 
                        }
                    }
                )
                postschema.body = JSON.stringify(j)
                deletechild(notifyP,notifyP.parentNode)
                r =  await request('send-message',postschema)
                if (!r.success) {
                    return alertMessage(r.message)
                }
                addsCard('receiver (s) notified !',true)

         
            

            }
        })
    }
    async transfer(users,socket){
        const session = this.session
        let b = addshade();
        a = document.createElement('div');
        b.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-10p bsbb">
                            <span class="fs-20p bold-2 dgray capitalize igrid h-100 card-title">select transfer type</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <ul class="ls-none px-4p">
                                <li class="menu-item my-8p px-6p bsbb" id="external">
                                    <div class="d-flex">
                                        <div class="flex-grow-1 hover-2 emp">
                                            <h6 class="mb-1 capitalize dgray">external transfer</h6>
                                            <p class="mb-0 flex">
                                            <small class=" capitalize dgray"> For sending patients to another healthcare facility.</small>
                                            </p>
                                        </div>
                                     </div>
                                </li>
                                <li class="menu-item my-8p px-6p bsbb" id="internal">
                                    <div class="d-flex">
                                        <div class="flex-grow-1 hover-2 emp">
                                            <h6 class="mb-1 capitalize dgray">internal transfer</h6>
                                            <p class="mb-0 flex">
                                            <small class=" capitalize dgray">For moving patients within the same facility (different department or health care provider)</small>
                                            </p>
                                        </div>
                                     </div>
                                </li>
                            </ul>
                        </div>`
                        let lis = Array.from(a.querySelectorAll('li'))
                        let type = new Promise((resolve)=>{
                            lis.forEach(li=>{
                                li.onclick = function () {
                                    resolve(this.id)
                                    deletechild(b,b.parentElement)
                                }
                            })
                        })
                        if (await type == 'internal') {
                            let emps = await  showAvaiEmps(users)
                            console.log(emps)
                        }else{
                            let transnFormHol = addshade(),
                            transFormDiv = document.createElement('div')
                            transFormDiv.className = `w-70 h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card-1`
                            transnFormHol.appendChild(transFormDiv)
                            transFormDiv.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">create external transfer</span>
                                                        </div>
                                                        <div class="body w-100 h-a p-5p grid">
                                                            <form method="post" id="transfer-form" name="transfer-form">
                                                                <div class="col-md-12 px-10p bsbb p-r h-94p">
                                                                    <label for="test" class="form-label uppercase dgray">session</label>
                                                                    <input type="text" class="form-control bevalue" id="session" placeholder="Transferring session" name="session" readonly disabled="true" value="${session.session_id}" data-id="${session.session_id}">
                                                                    <small class="w-100 red pl-3p verdana"></small>
                                                                </div>
                                                                <div class="col-md-12 px-10p bsbb p-r h-94p">
                                                                    <label for="test" class="form-label uppercase dgray">patient</label>
                                                                    <input type="text" class="form-control bevalue capitalize" id="patient" placeholder="Patient to be transfered" name="patient" readonly disabled="true" data-id="${session.p_info.id}" value="${session.p_info.name}">
                                                                    <small class="w-100 red pl-3p verdana"></small>
                                                                </div>
                                                                <div class="col-md-12 px-10p bsbb p-r h-94p">
                                                                    <label for="test" class="form-label uppercase dgray">facility</label>
                                                                    <input type="text" class="form-control bevalue" id="hospitals" placeholder="Receiving facility" name="facility">
                                                                    <small class="w-100 red pl-3p verdana"></small>
                                                                </div>
                                                                <div class="col-md-12 px-10p bsbb p-r h-94p">
                                                                    <label for="test" class="form-label uppercase dgray">department</label>
                                                                    <input type="text" class="form-control bevalue" id="department" placeholder="Receiving department" name="department">
                                                                    <small class="w-100 red pl-3p verdana"></small>
                                                                </div>
                                                                <div class="col-md-12 px-10p bsbb p-r h-130p">
                                                                    <label for="test" class="form-label uppercase dgray">reason</label>
                                                                    <textarea type="text" class="form-control h-100p" id="reason" placeholder="Reason For Transfer" name="reason"></textarea>
                                                                    <small class="w-100 red pl-3p verdana"></small>
                                                                </div>
                                                                <div class="wrap bsbb bblock-resp">
                                                                    <button type="submit" class="btn btn-primary bfull-resp mr-10p  bm-a-resp bmy-10p-resp right m-0">Proceed</button>
                                                                </div>
                                                            </form>
                                                        </div>`
                            let hc_inp = transFormDiv.querySelector('input[name="facility"]'),dep_ip = transFormDiv.querySelector('input[name="facility"]'),form = transFormDiv.querySelector('form'),inputs = Array.from(transFormDiv.querySelectorAll('.form-control')),departmentinput = transFormDiv.querySelector('input#department')
                            hc_inp.onkeyup = function (event){
                                if (hc_inp.value) {
                                    triggerRecs(hc_inp,['id','name'],socket)
                                }else{
                                    removeRec(hc_inp)
                                    
                                }
                                h = hc_inp.getAttribute('data-id')
                            }
                            let hospitalinfo
                            hc_inp.addEventListener('blur', async ()=>{
                                setTimeout(function () {
                                    if (h != hc_inp.getAttribute('data-id')) {
                                        departmentinput.value = ``
                                        departmentinput.removeAttribute('data-id')
                                    }
                                },200)
                                h = hc_inp.getAttribute('data-id')
                                if (h) {
                                    hospitalinfo = await request(`hpDeps/${h}`,postschema)
                                    if (hospitalinfo.success) {
                                        hospitalinfo = hospitalinfo.message
                                    }
                                }
                            })
                            let receivers
                            departmentinput.addEventListener('focus', function (event) {
                                let hospital = hc_inp.getAttribute('data-id')
                                if (!hospital) {
                                    checkEmpty(hc_inp)
                                    hc_inp.focus();
                                    return 0
                                }
                                if (!hospitalinfo) {
                                    return 0
                                }
                                departmentinput.addEventListener('blur', function (event) {
                                    setTimeout(function () {
                                        receivers = hospitalinfo.employees.filter(function (employee) {
                                            return employee.department == departmentinput.getAttribute('data-id')
                                        })
                                    },200)
                                })
                                let departments = hospitalinfo.departments
                                showRecs(this, departments,this.id)
                            })
                            form.addEventListener('submit', async event=>{
                                event.preventDefault();
                                let v,t = 1,values = {},button = form.querySelector('button')
                                for (const input of inputs) {
                                  v = checkEmpty(input)
                                  if (!v) {
                                      t = 0
                                    }else{
                                      Object.assign(values,{[input.name]: (input.classList.contains('bevalue')? input.getAttribute('data-id') : input.value.trim())})

                                  }  
                                }
                                if (t) {
                                    
                                    Object.assign(values,{ token: getdata('token'),receivers})
                                    // return console.log(values)
                                    postschema.body = JSON.stringify(values)
                                    button.setAttribute('disabled',true)
                                    button.textContent = 'recording transfer info...'
                                    r = await request('crTrns',postschema);
                                    button.removeAttribute('disabled',true)
                                    deletechild(transnFormHol,transnFormHol.parentElement)
                                    alertMessage(r.message)
                                }
                            })
                        }

    }    
}
async function viewAppointmentDiv(appointment) {
    let bgDiv = addshade();
    let cont = document.createElement('div')
    bgDiv.appendChild(cont)
    cont.className = `br-10p cntr card p-10p bsbb w-450p h-a b-mgc-resp`
    cont.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
                        <div class="head w-100 px-5p py-10p bsbb">
                            <span class="capitalize bold-2 fs-20p">Appointment # <span class="consolas">${appointment}</span></span>
                        </div>
                        <div class="p-5p bsbb w-100 h-91 ovh p-r">
                            <div class="w-100 h-100 ovys scroll-2 body">
                                <div class="w-100 h-a my-10p">
                                    <span class="capitalize pr-5p">with</span><span class="black capitalize" data-holder="true" data-hold="patient"></span>
                                </div>
                                <div class="w-100 h-a my-10p">
                                    <span class="dgray capitalize block">reason for appointment: </span>
                                    <span class="black capitalize block" data-holder="true" data-hold="subject"> </span>
                                </div>
                                <div class="w-100 h-a my-10p">
                                    <span class="dgray capitalize block">description: </span>
                                    <span class="black capitalize block" data-holder="true" data-hold="message"> </span>
                                </div>
                                <div class="w-100 h-a my-10p" id="time-holder">
                                    <span class="dgray capitalize block">estimated time: </span>
                                    <span class="black capitalize block" data-holder="true" data-hold="time">
                                    </span>
                                </div>
                                <div class="w-100 h-a my-10p">
                                    <span class="dgray capitalize block">date booked: </span>
                                    <span class="black capitalize block" data-holder="true" data-hold="date_booked">       
                                </span>
                            </div>
                            </div>
                        </div>
                    </div>`
    let body = cont.querySelector('div.body')
    addLoadingTab(body)
    postschema.body = JSON.stringify({
        token : getdata('token'),
    })
    appointment = await request(`appointment/${appointment}`,postschema)
    if (!appointment.success) {
        return alertMessage(appointment.message)
    }
    appointment = appointment.message
    removeLoadingTab(body)
    let dataHolders = Array.from(cont.querySelectorAll('[data-holder="true"]'))
    dataHolders.forEach( dataHolder =>{
        let dataToHold = dataHolder.getAttribute('data-hold')
        if (dataToHold.indexOf('time') != -1 || dataToHold.indexOf('date') != -1 ) {
            dataHolder.innerText = fT(appointment[dataToHold])
        }else{
            dataHolder.innerText = appointment[dataToHold]
        }
    })
    if (appointment.extra) {
        let timeDiv = body.querySelector('div#time-holder')
        let extraDiv = document.createElement('div')
        extraDiv.className = 'w-100 h-a my-10p'
        extraDiv.innerHTML = `<span class="dgray capitalize block">${Object.keys(appointment.extra)[0]} </span>
                            <span class="black capitalize block" data-holder="true" data-hold="${Object.keys(appointment.extra)[0]}">${appointment.extra[Object.keys(appointment.extra)[0]]}</span>`
        body.insertBefore(extraDiv,timeDiv)
    }

}
 

