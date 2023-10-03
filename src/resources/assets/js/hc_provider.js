
import { alertMessage, getdata, getschema, postschema, request,deletechild, checkEmpty, showRecs, getchips,getPath,calcTime, addUprofile,addsCard,cpgcntn, geturl,sessiondata,addChip, showAvaiAssurances, adcm, addshade, addLoadingTab, removeLoadingTab, showAvaiEmps, fT, promptHpsToChoose } from "../../../utils/functions.controller.js";
import {pushNotifs, userinfo,expirateMssg, getNfPanelLinks,m as messages, DateTime} from "./nav.js";
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,z,notificationlinks
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
            }
        } catch (error) {
            console.log(error)
        }
    }
    postschema.body = JSON.stringify({token})
    let users = await request('get-hp-employees',postschema)
    q = await request('getmeds',postschema)
    f = await request('get-tests',postschema)
    l = await request('get-equipments',postschema)
    k = await request('get-services',postschema)
    j = await request('get-operations',postschema)
    let appointment = await request('hcp-appointments',postschema)
    if (!appointment.success) {
        return alertMessage(appointment.message)
    }
    const appointments = appointment.message
    if (!q.success || !f.success || !l.success || !k.success || !j.success || !users.success) {
        return 0
    }
    let extra = {users: users.message, tests: f.message, medicines : q.message, equipments: l.message, services : k.message, operations : j.message}
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
                addUprofile(r.message);
          
            })
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
                    i = Array.from(f.querySelectorAll('.form-control'))
                    let asb = f.querySelector('span#add-symptom');
                    let arb = f.querySelector('span#add-decisions');
                    let extras_input = Array.from(f.querySelectorAll('input.extras'));
                    let op_input = f.querySelector('input[name="operations"]');
                    extras_input.map(function (input) {
                      input.addEventListener('focus', event=>{
                        showRecs(input,extra[input.id],input.id)
                      })
                    })
                    op_input.addEventListener('focus', event=>{
                      showRecs(op_input,extra[op_input.id],op_input.id)
                    
                    })
                    asb.addEventListener('click',e=>{
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
                    })
                    arb.addEventListener('click',e=>{
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
                    })
                    n = i.find(function (e) {return e.id == 'patient'})
                    if (sessiondata('pinfo')) {
                      n.value = sessiondata('pinfo').name
                      n.setAttribute('data-id',sessiondata('pinfo').patient)
                    }
                    let val
                    n.addEventListener('focus',()=>{
                        if (sessiondata('pinfo')) {
                            if (sessiondata('pinfo').nid) {
                                n.value = sessiondata('pinfo').nid
                            }else{
                                n.value = sessiondata('pinfo').patient
                            }
                            n.setAttribute('data-id',sessiondata('pinfo').patient)
                        }
                        val = n.value
                    })
                    n.addEventListener('blur',async ()=>{
                        if (n.value != val) {
                         v = await upPatInfo(n)
                        }
                        if (sessiondata('pinfo')) {
                            n.value = sessiondata('pinfo').name
                            n.setAttribute('data-id',sessiondata('pinfo').patient)
                        }
                    })
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
                                  sessionStorage.setItem('pinfo',JSON.stringify({patient:p.message.id,name:p.message.Full_name,assurance,nid:p.message.nid}))
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
                            Object.assign(b,{ assurance: sessiondata('pinfo').assurance})
                            Object.assign(b,{ token: getdata('token')})
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
                if (addin) {
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
                    session_s_button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
                    session_s_button.setAttribute('disabled',true)
                    let sessiondata =  await request(`session/${session}`,postschema)
                    if (sessiondata.success) {
                        theb.innerHTML = raw
                        sessionStorage.removeItem('minfo')
                    }
                    session_s_button.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                    session_s_button.removeAttribute('disabled')
                    if (!sessiondata.success) return alertMessage(sessiondata.message)
                    session_input.value = session
                    let url = new URL(window.location.href);
                    url.pathname = `/hc_provider/view-session/${session}`;
                    window.history.pushState({},'',url.toString())
                    sessiondata = sessiondata.message
                    showSession(sessiondata);
                }
              }
              if (session) {
                postschema.body = JSON.stringify({token: getdata('token')})
                let sessiondata =  await request(`session/${session}`,postschema)
                if (!sessiondata.success){
                    sessionStorage.removeItem('minfo')
                    return alertMessage(sessiondata.message)
                }
                session_input.value = session
                sessiondata = sessiondata.message
                showSession(sessiondata);
                

              }
            }else if (x == 'appointments') {
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
                        li.innerHTML = `<div class="w-100 h-70p p-5p my-10p ovh">
                                            <div class="w-100 h-100 bc-tr-white">
                                                <div class="header w-100 h-60p card br-5p bc-white p-r block hover-2">
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
                                                            <span class="btn  btn-sm ${(appointment.status == 'declined')? 'btn-label-danger' : (appointment.status == 'approved') ? 'btn-label-success' : (appointment.status == 'finished') ? 'btn-label-secondary' : 'btn-label-secondary' }" data-role="button">${appointment.status}</span>  
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
            }
            function showSession(sessiondata) {
                removeLoadingTab(page.querySelector('div.theb'))
                Object.assign(sessiondata.payment_info,{total_amount: Number(sessiondata.payment_info.a_amount) + Number(sessiondata.payment_info.p_amount)})
                const dataHolders = Array.from(document.querySelectorAll('span[name="info-hol"]'))
                const loopingDataHolders = Array.from(document.querySelectorAll('ul[name="looping-info"]'))
                for (const element of loopingDataHolders) {
                    let dataToHold = element.getAttribute('data-hold');
                    let dataToShow = sessiondata[dataToHold]
                    for (const data of dataToShow) {
                        Object.assign(data,{total_amount: (Number(data.price) * Number(data.quantity)).toFixed(2)})
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
                        }
                       for (const dataHolder of dataHolders) {
                        if (dataHolder.getAttribute('data-hold').indexOf('quantity') != -1 || dataHolder.getAttribute('data-hold').indexOf('amount') != -1) {
                            dataHolder.innerText = adcm(data[dataHolder.getAttribute('data-hold')])
                        }else if (dataHolder.getAttribute('data-hold').indexOf('result') != -1) {
                            if (data[dataHolder.getAttribute('data-hold')] == "positive" || data[dataHolder.getAttribute('data-hold')] == "positif") {
                                dataHolder.classList.add('green')
                            }else{
                                dataHolder.classList.add('red')
                            }
                            dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]
                        }else if (dataToHold == 'decisions' && !dataHolder.getAttribute('data-hold')) {
                            dataHolder.innerText = data
                        }else{
                            dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]
                        }
                       }
                       element.parentNode.appendChild(clonedNode)
                    }
                    element.parentNode.removeChild(element)

                }
                for (const holder of dataHolders) {
                        let objectId = holder.getAttribute('data-hold')
                        if (objectId.indexOf('.') != -1) {
                            objectId = objectId.split('.')
                            if (objectId[1].indexOf('amount') != -1) {
                                holder.innerText = adcm(sessiondata[objectId[0]][objectId[1]])
                            }else{
                                holder.innerText = sessiondata[objectId[0]][objectId[1]]
                            }
                        }else{
                            if (holder.getAttribute('data-hold').indexOf('status') != -1) {
                                if (sessiondata[holder.getAttribute('data-hold')] == "open") {
                                    holder.classList.replace('btn-label-secondary','btn-label-success')
                                }
                            }
                            holder.innerText = sessiondata[objectId]
                        }
                }
                let Modals = new popups(sessiondata,extra.users)
                const dataButtons = Array.from(page.querySelectorAll('span.data-buttons'))
                dataButtons.map(function (button) {
                    if (button.getAttribute(`data-role`) == 'close') {
                        if (sessiondata.status == `closed`) {
                            deletechild(button,button.parentNode)
                            button.classList.add('loading')
                            button.classList.replace('btn-label-primary','btn-label-secondary')
                        }
                    }
                    button.addEventListener('click', async  e=>{
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
                        }
                        else if (role == 'decision') {
                            Modals.decision()
                        }else if (role == 'close') {
                            postschema.body = JSON.stringify({
                                session: sessiondata.session_id,
                                token: getdata('token')
                            })
                            button.classList.add('loading')
                            let result = await request('close-session',postschema)
                            alertMessage(result.message)
                            if (result.success) {
                                button.classList.replace('btn-label-primary','btn-label-secondary')
                                button.innerText = 'closed'
                                sessiondata.status = `closed`
                            }else{
                                button.classList.remove('loading')
                            }
                        }
                    })
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
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                    <div class="sk-grid-cube"></div>
                                </div>
                            </div>
                        </span>
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
        let estDateHol = cont.querySelector(`[data-holder="date"]`)
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
                    button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
                    let addApp = await request('add-appointment',postschema)
                    button.innerHTML = `approve`
                    button.classList.remove('loading')
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
                    console.log(message)
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
                                button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
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
                v = document.querySelector(`div#${link.getAttribute('data-href-target')}`)
                let message = messages.find(function (mess) {
                    return mess.id == link.getAttribute('data-id')
                })
                if (v && message) {
                p = Array.from(v.parentElement.querySelectorAll('.pagecontentsection'))
                
                s = p.indexOf(v)
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
                }else{
                    url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}`;
                }
                window.history.pushState({},'',url.toString())
                cpgcntn(p.indexOf(v),p)
                gsd(v,null)
               }
            })
        })
    }
})();
class popups{
    constructor(sessionData,users){
        this.session = sessionData
        this.users = users
    }
    test(data){
        const session = this.session
        let testsP = addshade();
        a = document.createElement('div');
        testsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a test to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">test taken</label>
                                    <input type="text" class="form-control bevalue" id="test" placeholder="Demo test" name="test">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="sample" class="form-label">sample taken</label>
                                    <input type="text" class="form-control" id="sample" placeholder="Demo sample" name="sample">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb mb-5p p-r">
                                    <label for="result" class="form-label">results found</label>
                                    <input type="text" class="form-control" id="result" placeholder="Demo results" name="result">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp mr-10p bm-a-resp bmy-10p-resp">Proceed</button>
                                    <button type="button" class="btn btn-label-primary ml-10p capitalize bfull-resp bm-a-resp bmy-10p-resp">Request for tesing</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
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
            p = await showAvaiEmps(this.users,{department: testinfo.department});
            let emps = Array.from(p.querySelectorAll('.emp'))
            let deps = Array.from(p.querySelectorAll('.dep'))
              for (const lis of emps) {
                lis.addEventListener('click',async function(event){
                    event.preventDefault();
                    let employee = this.getAttribute('data-id')
                    j = JSON.parse(postschema.body)
                    Object.assign(j,
                        {
                            title:'incoming test request',
                            token: getdata('token'),
                            receiver: employee,
                            type: 'req_test_message', 
                            content: `there is an incoming test request called ${testinfo.name} for  ${session.p_info.name}`,
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
                        notify_button.setAttribute('disabled',true)
                        notify_button.innerText = 'notifying the receiver...'
                        r =  await request('send-message',postschema)
                        if (!r.success) {
                            return alertMessage(r.message)
                        }
                        notify_button.removeAttribute('disabled')
                        notify_button.innerText = 'receiver notified !'
                        notify_button.classList.replace('btn-label-primary','btn-label-success')
                        addsCard('receiver notified !',true)
                    } catch (error) {
                        console.log(error)
                    }
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
                            title:'incoming test request',
                            token: getdata('token'),
                            receiver: [emps],
                            type: 'req_test_message', 
                            content: `there is an incoming test request called ${testinfo.name} for  ${session.p_info.name}`,
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
                        deletechild(p,p.parentElement)
                        deletechild(testsP,testsP.parentNode)
                        notify_button.removeAttribute('disabled')
                        notify_button.innerText = 'receivers notified !'
                        notify_button.classList.replace('btn-label-primary','btn-label-success')
                        addsCard('receivers notified !',true)
                    } catch (error) {
                        console.log(error)
                    }
                });
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
            button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                }
                Object.assign(values,{test: {id:values.test,sample: values.sample, result: values.result}})
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                delete values.sample
                delete values.result
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
        let medicinesP = addshade();
        a = document.createElement('div');
        medicinesP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a medication to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="add-medicine-form" name="add-medicine-form">
                                <div class="col-md-12 p-10p bsbb mb-5p p-r">
                                    <label for="medicines" class="form-label">medicines</label>
                                    <input type="text" class="form-control extras chips-check" id="medicines" placeholder="Demo medicine" name="medicines">
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
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
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
            button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','quantity','status']) })
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
    operation(data){
        const session = this.session
        let operationsP = addshade();
        a = document.createElement('div');
        operationsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add an operation to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">operation name</label>
                                    <input type="text" class="form-control bevalue" id="operation" placeholder="Demo operation" name="operation">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp mr-10p  bm-a-resp bmy-10p-resp">Proceed</button>
                                    <button type="button" class="btn btn-label-primary ml-10p  capitalize bfull-resp bm-a-resp bmy-10p-resp">Request for tesing</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))

        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
        
        let notify_button = form.querySelector('button[type="button"]')
         notify_button.addEventListener('click',async event=>{
            event.preventDefault()
            p = await showAvaiEmps(users);
            l = Array.from(p.querySelectorAll('li.emp'))
              for (const lis of l) {
                lis.addEventListener('click',async function(event){
                    event.preventDefault();
                    this.classList.add('selected')
                    let employee = this.getAttribute('data-id')
                    j = JSON.parse(postschema.body)
                    Object.assign(j,{title:'incoming patient',receiver: employee,type: 'p_message', content: `there is an incoming patient called ${r.message.Full_name}`,extra: {name: r.message.Full_name,patient: r.message.id,nid:r.message.nid,assurance: r.message.assurances},controller: {looping: false,recipients: []}})
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
            button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                Object.assign(values,{operation: {id: values.operation, quantity: values.quantity}})
                delete values.quantity
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
        let servicesP = addshade();
        a = document.createElement('div');
        servicesP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a service to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="add-service-info-form" name="add-service-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="service" class="form-label">service name</label>
                                    <input type="text" class="form-control bevalue" id="service" placeholder="Demo service" name="service">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="quantity" class="form-label">quantity</label>
                                    <input type="number" class="form-control" id="quantity" placeholder="Demo quantity" name="quantity">
                                    <span class="p-a t-0 t-0 mx-20p r-0 mt-42p capitalize" name="unit-hol"></span>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
       extra_input.addEventListener('blur',async ()=>{
        let unit = form.querySelector('span[name="unit-hol"]')
        let val =  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                    resolve(extra_input.getAttribute('data-id'));
                    }, 200);
                });
        let datauint = data.find(function (obj) {
            return obj.id == val
        })
        unit.innerText = datauint.unit
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
            button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
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
        let equipmentsP = addshade();
        a = document.createElement('div');
        equipmentsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add an equipment to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="equipment-info-form" name="equipment-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="equipment" class="form-label">equipment name</label>
                                    <input type="text" class="form-control bevalue" id="equipment" placeholder="Demo equipment" name="equipment">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="quantity" class="form-label">quantity</label>
                                    <input type="number" class="form-control" id="quantity" placeholder="Demo quantity" name="quantity">
                                    <span class="p-a t-0 t-0 mx-20p r-0 mt-42p capitalize" name="unit-hol"></span>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
       extra_input.addEventListener('blur',async ()=>{
        let unit = form.querySelector('span[name="unit-hol"]')
        let val =  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                    resolve(extra_input.getAttribute('data-id'));
                    }, 200);
                });
        let datauint = data.find(function (obj) {
            return obj.id == val
        })
        unit.innerText = datauint.unit
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
            button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
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
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add an operation to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">comment</label>
                                    <textarea class="form-control" id="comment" placeholder="Demo comment" name="comment">${data}</textarea>
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
            button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
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
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-10p bsbb">
                            <span class="fs-20p bold-2 dgray capitalize igrid h-100 card-title">add an operation to session</span>
                        </div>
                        <span class="dgray px-5p fs-14p my-10p  bsbb capitalize">the diagnosis decisions after all diagonis operations caried out in the  session's process</span>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-decision-info-form" name="req-decision-info-form">
                                <div class="input-group my-10p">
                                    <input type="text" class="form-control chips-check" placeholder="demo decision" name="decisions" id="decision">
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
            button.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
            button.setAttribute('disabled',true)
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]:  getchips(input.parentNode.querySelector('div.chipsholder'),['id']) })
                } 
                Object.assign(values,{session: session.session_id,token: getdata('token')})
                console.log(values)
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
 

