import { alertMessage, getdata, getschema, postschema, request,deletechild, checkEmpty, showRecs, getchips,getPath,addsCard,cpgcntn, geturl,sessiondata,addChip, showAvaiAssurances, adcm, addshade, addLoadingTab, removeLoadingTab, showAvaiEmps, fT, calcTime, aDePh, extractTime, getDate, triggerRecs, removeRec } from "../../../utils/functions.controller.js";
import {expirateMssg, getNfPanelLinks, pushNotifs, userinfo,m as messages, openmenu, addFilter} from "./nav.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z,socket,notificationlinks
postschema.body = JSON.stringify({token: getdata('token')});
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
                addsCard(message.title,true)
                messages.push(message)
                notificationlinks = getNfPanelLinks()
                genClicks(notificationlinks)
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
    postschema.body = JSON.stringify({token})
    let session = await request('get-user-medical-history',postschema)
    let appointment = await request('my-appointments',postschema)
    if (!session.success) {
        return alertMessage(session.message)
    }
    const sessions = session.message
    const appointments = appointment.message
    
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
        cpgcntn(0,p)

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
            url.pathname = `/${getPath()[0]}/${cudstp.getAttribute('data-item-type')}`;
            window.history.pushState({},'',url.toString())
            cpgcntn(c.indexOf(cudstp),p)
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
              let nmbrs = {tot_sess: 0,pss : 0,appa: 0, pp: 0}
                messages.map(function (me) {
                if (me.status == 'new') {
                    if (me.type == '__APPNTMNT_MSSG_') {
                        nmbrs.appa +=1
                    }
                }
              })
               sessions.map(function (session) {
                    nmbrs.tot_sess +=1
                    if (session.status == 'open') {
                        nmbrs.pss +=1
                       }
                    if (session.payment_info.status == "awaiting payment") {
                       nmbrs.pp +=1
                    }
                })
              
              num_hols.forEach(holder=>{
                let holderlink = holder.parentElement.parentElement.querySelector('a')
                holderlink.onclick = function (event) {
                    event.preventDefault()
                    let link = this.getAttribute('data-redirect')
                    if (link.indexOf('#') == -1) {
                        console.log(link)
                        let url = new URL(window.location.href);
                        url.pathname = `/${getPath()[0]}/${link}`;
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
            }else  if (x == 'medical-history') {
                let sessionSholder = document.querySelector('ul[data-role="sessions-holder"]')
                sessionSholder.innerHTML = null

                // Create a map to store users grouped by year and month
                const groupedSessions = new Map();

                // Iterate through each user
                sessions.forEach(session => {
                    const registrationDate = new Date(session.dateadded);
                    const year = registrationDate.getFullYear();
                    registrationDate.setMonth(registrationDate.getMonth())
                    const month = new Intl.DateTimeFormat('en-US',{month: 'long',}).format(registrationDate); // Month is zero-based

                    // Create the year container if it doesn't exist
                    if (!groupedSessions.has(year)) {
                        groupedSessions.set(year, new Map());
                    }

                    // Create the month container if it doesn't exist inside the year container
                    if (!groupedSessions.get(year).has(month)) {
                        groupedSessions.get(year).set(month, []);
                    }

                    // Add the session to the appropriate month container inside the year container
                    groupedSessions.get(year).get(month).push(session);
                });

                // Convert the map to an array for a structured result
                const structuredArray = Array.from(groupedSessions, ([year, months]) => ({
                    year: year,
                    months: Array.from(months, ([month, sessions]) => ({
                        month: month,
                        sessions: sessions
                    }))
                }));
                for (const year of structuredArray) {
                    for (const month of year.months) {
                        let li = document.createElement('li')
                        li.className = `ovh`
                        sessionSholder.appendChild(li)
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
                                                <div class="w-100 h-a p-10p bsbb session-holder"></div>
                                            </div>
                                        </div>`
                        const sessionHol = li.querySelector(`div.session-holder`)
                        for (const session of month.sessions) {
                            let ss = document.createElement('div')
                            sessionHol.appendChild(ss)
                            ss.className = `w-275p h-a bfull-resp p-5p bsbb iblock`
                            ss.innerHTML = `<div class="card">
                                                    <div class="p-15p capitalize dgray flex jc-sb">
                                                        <div class="flex">
                                                            <span class="black fs-20p px-5p">#</span><span class="center">${session.session_id}</span>
                                                        </div>
                                                        <div class="center-2">
                                                        <span class="btn ${(session.status == 'open')? 'bc-tr-theme' : 'bc-gray' } btn-sm mx-5p">${session.status}</span>
                                                        <span class="btn btn-primary btn-sm view-session-butt" data-id="${session.session_id}">View</span>
                                                        </div>
                                                    </div>
                                                    <div class="p-15p">
                                                        <h5 class="card-title capitalize">${session.hp_info.name}</h5>
                                                        <p class="px-5p">
                                                        <span class="capitalize fs-15p">session at ${session.hp_info.name} on ${fT(session.dateadded)}</span>
                                                        </p>
                                                        <span class="capitalize fs-14p block">${session.hp_info.location}<span>
                                                    </div>
                                                </div>`
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
                let viewButts = Array.from(page.querySelectorAll('span.view-session-butt'))
                viewButts.forEach(button=>{
                    button.onclick = function (event) {
                        event.preventDefault()
                        let sessionid = button.getAttribute('data-id')
                        showSession(sessionid)
                    }
                })
                async function showSession(session) {
                    q = addshade();
                    d = document.createElement('div')
                    d.className = `br-10p cntr card p-20p bsbb w-80 h-85 b-mgc-resp ovh`
                    q.appendChild(d)
                    b = document.getElementById('view-session')
                    b = b.cloneNode(true)
                    b.classList.remove('hidden')
                    d.appendChild(b)
                    addLoadingTab(d)
                    postschema.body = JSON.stringify({token: getdata('token')})
                    let sessiondata =  await request(`session/${session}`,postschema)
                    if (!sessiondata.success) {
                        return alertMessage(sessiondata.message)
                    }
                    removeLoadingTab(d)
                    sessiondata = sessiondata.message
                    Object.assign(sessiondata.payment_info,{total_amount: Number(sessiondata.payment_info.a_amount) + Number(sessiondata.payment_info.p_amount)})
                    const dataHolders = Array.from(d.querySelectorAll('span[name="info-hol"]'))
                    const loopingDataHolders = Array.from(d.querySelectorAll('ul[name="looping-info"]'))
                    for (const element of loopingDataHolders) {
                        let dataToHold = element.getAttribute('data-hold');
                        let dataToShow = sessiondata[dataToHold]
                        if (!dataToShow.length) {
                          aDePh(element.parentElement)
                          element.parentNode.removeChild(element)
                          continue  
                        }
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
                                }else if (objectId[0].indexOf('p_info') != -1 && objectId[1].indexOf('name') != -1) {
                                    holder.innerText = sessiondata[objectId[0]][objectId[1]]
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
                                if (!objectId in sessiondata || !sessiondata[objectId]) {
                                    holder.innerText = `no entries available`
                                    continue  
                                }
                                holder.innerText = sessiondata[objectId]
                            }
                    }
                }
            }else if (x == 'payments-history') {
                let paymentsHolder = document.querySelector('ul[data-role="payments-holder"]')
                paymentsHolder.innerHTML = null
                // Create a map to store users grouped by year and month
                const groupedSessions = new Map();

                // Iterate through each user
                sessions.forEach(session => {
                    const registrationDate = new Date(session.dateadded);
                    const year = registrationDate.getFullYear();
                    registrationDate.setMonth(registrationDate.getMonth())
                    const month = new Intl.DateTimeFormat('en-US',{month: 'long',}).format(registrationDate); // Month is zero-based

                    // Create the year container if it doesn't exist
                    if (!groupedSessions.has(year)) {
                        groupedSessions.set(year, new Map());
                    }

                    // Create the month container if it doesn't exist inside the year container
                    if (!groupedSessions.get(year).has(month)) {
                        groupedSessions.get(year).set(month, []);
                    }

                    // Add the session to the appropriate month container inside the year container
                    groupedSessions.get(year).get(month).push(session);
                });

                // Convert the map to an array for a structured result
                const structuredArray = Array.from(groupedSessions, ([year, months]) => ({
                    year: year,
                    months: Array.from(months, ([month, sessions]) => ({
                        month: month,
                        sessions: sessions
                    }))
                }));
                for (const year of structuredArray) {
                    for (const month of year.months) {
                        let li = document.createElement('li')
                        li.className = `ovh`
                        paymentsHolder.appendChild(li)
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
                                                <div class="w-100 h-a p-10p bsbb session-holder"></div>
                                            </div>
                                        </div>`
                        const sessionHol = li.querySelector(`div.session-holder`)
                        for (const session of month.sessions) {
                            if (session.status) {
                                let ss = document.createElement('div')
                                sessionHol.appendChild(ss)
                                ss.className = `w-250p h-a bfull-resp p-5p bsbb iblock`
                                ss.innerHTML = `<div class="card">
                                                        <div class="p-15p capitalize dgray flex jc-sb">
                                                            <div class="flex">
                                                                <span class="black fs-20p px-5p">#</span><span class="center">${session.payment_info.id}</span>
                                                            </div>
                                                            ${(session.payment_info.status == 'paid')? '<span class="btn bc-tr-theme btn-sm">paid</span>' : '<span class="btn bc-tr-theme btn-sm">pay</span>'}
                                                            
                                                        </div>
                                                        <div class="p-15p">
                                                            <h5 class="card-title capitalize">${session.hp_info.name}</h5>
                                                            <p class="px-5p">
                                                            <span class="capitalize fs-14p">payment of session at ${session.hp_info.name} on ${new Intl.DateTimeFormat('en-US',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(session.dateadded))}</span>
                                                            </p>
                                                            <p class="flex">
                                                                <span class="capitalize fs-15p block bold-2">${adcm(session.payment_info.p_amount)}</span>
                                                                <span class="dgray fs-15p px-5p">RWF</span>
                                                            </p>
                                                        </div>
                                                    </div>`
                            }
                        }
                        if (!sessionHol.innerHTML) {
                            let div = document.createElement('div')
                            div.className = `ovh center-2`
                            sessionHol.appendChild(div)
                            aDePh(div)
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
            }else if (x == 'appointments') {
                let appointmentsHolder = document.querySelector('ul[data-role="appointments-holder"]')
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
                                                            <span class="btn  btn-sm ${(appointment.status == 'declined')? 'btn-label-danger' : (appointment.status == 'approved') ? 'bc-tr-theme' : (appointment.status == 'finished') ? 'bc-gray' : 'bc-gray' }" data-role="button">${appointment.status}</span>  
                                                        </div>
                                                        <div class="p-15p hover-2" data-role="button" data-id="${appointment.id}" id ="view-appointment">
                                                            <h5 class="card-title capitalize">${appointment.subject}</h5>
                                                            <p class="px-5p">
                                                            <span class="capitalize fs-14p">appointment at ${appointment.hospital}</span>
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
                                addAppointmentDiv(socket)
                                
                            }else if (button.id == 'view-appointment') {
                                let appointment = button.getAttribute('data-id');
                                viewAppointmentDiv(appointment)
                            }
                        }
                    })
            } else if (x == 'my-account') {
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
          
            }
          } catch (error) {
            console.log(error)
          }
    }
    function genClicks(notificationlinks) {
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
                if (link.getAttribute('data-message-type') == '__APPNTMNT_MSSG_') {
                    appApprovalCont(message)
                    url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}`;
                }else{
                    url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}`;
                }
                v = document.querySelector(`div#${link.getAttribute('data-href-target')}`)
                if (v) {
                    
                    p = Array.from(v.parentElement.querySelectorAll('.pagecontentsection'))
                    window.history.pushState({},'',url.toString())
                    cpgcntn(p.indexOf(v),p)
                    gsd(v,null)
                }
               }
            })
        })
    }
})();
function addAppointmentDiv(socket) {
    let bgDiv = addshade();
    let cont = document.createElement('div')
    bgDiv.appendChild(cont)
    cont.className = `br-10p cntr card p-10p bsbb w-70 h-70 b-mgc-resp`
    cont.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
        <div class="head w-100 px-5p py-10p bsbb">
            <span class="capitalize bold-2 fs-20p">book an appointment</span>
        </div>
        <div class="body p-5p bsbb w-100 h-91 ovh">
            <div class="w-100 h-100 ovys scroll-2">
                <form action="" method="post" name="add-appointment">
                    <div class="w-100 h-100 ovys w-100 h-100">
                        <div class="col-md-12 p-10p bsbb mb-5p p-r">
                            <label for="hospital" class="form-label">hospital</label>
                            <input type="text" class="form-control bevalue" id="hospitals" placeholder="Hospital name" name="hospital">
                            <small class="hidden w-100 red pl-3p verdana"></small>
                        </div>
                        <div class="col-md-12 p-10p bsbb mb-5p p-r">
                            <label for="department" class="form-label">department</label>
                            <input type="text" class="form-control bevalue" id="department" placeholder="Department name" name="department">
                            <small class="hidden w-100 red pl-3p verdana"></small>
                        </div>
                        <div class="col-md-12 p-10p bsbb mb-5p p-r">
                            <label for="subject" class="form-label">reason for appointment</label>
                            <input type="text" class="form-control" id="subject" placeholder="main cause" name="content">
                            <small class="hidden w-100 red pl-3p verdana"></small>
                        </div>
                        <div class="col-md-12 p-10p bsbb mb-5p p-r">
                            <label for="message" class="form-label">Message</label>
                            <textarea class="form-control" id="message" rows="3" name="message" placeholder="description of the appointment"></textarea>
                            <small class="hidden w-100 red pl-3p verdana"></small>
                        </div>
                        <div class="col-md-12 p-10p bsbb mb-5p p-r">
                           <button type="submit" class="btn btn-primary">proceed</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`
    let form = cont.querySelector('form');
    let inputs = Array.from(form.querySelectorAll('.form-control'))
    let hospitalinput = inputs.find(function (element) {
        return element.id == 'hospitals' 
    })
    let departmentinput = inputs.find(function (element) {
        return element.id == 'department' 
    })
    hospitalinput.addEventListener('keyup', function (event) {
        if (hospitalinput.value) {
            triggerRecs(hospitalinput,['id','name'],socket)
        }else{
            removeRec(hospitalinput)
            
        }
        h = hospitalinput.getAttribute('data-id')
    })
    let hospitalinfo
    hospitalinput.addEventListener('blur', async ()=>{
        setTimeout(function () {
            if (h != hospitalinput.getAttribute('data-id')) {
                departmentinput.value = ``
                departmentinput.removeAttribute('data-id')
            }
        },200)
        h = hospitalinput.getAttribute('data-id')
        if (h) {
            hospitalinfo = await request(`hpDeps/${h}`,postschema)
            if (hospitalinfo.success) {
                hospitalinfo = hospitalinfo.message
            }
        }
    })
    let receivers
    departmentinput.addEventListener('focus', function (event) {
        let hospital = hospitalinput.getAttribute('data-id')
        if (!hospital) {
            checkEmpty(hospitalinput)
            hospitalinput.focus();
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
    form.addEventListener(`submit`, async function (event) {
        event.preventDefault();
        if (this.classList.contains('loading')) {
            return 0
        }
        v = 1
        s = {}
        inputs.forEach((input) => {
            d = checkEmpty(input)
            if (!d) {
                v = 0
            }
            Object.assign(s,{[input.name]: (input.classList.contains('bevalue')? input.getAttribute('data-id') : input.value)})
        });
        if(v){
            receivers = receivers.map(function (rec) {
                return rec.id
            })
            Object.assign(s,{
                token: getdata(`token`),
                type : '__APPNTMNT_MSSG_',
                extra: {
                    content: s.message
                },
                controller : {
                    looping: true,
                    recipients : receivers
                }

            })
            s.title = `incoming appointment request`
            this.classList.add('loading')
            form.querySelector(`button`).innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            postschema.body = JSON.stringify(s)
            let result = await request('send-message',postschema)
            form.querySelector(`button`).innerHTML = `proceed`
            if (result.success) {
                alertMessage('appointment message sent successfully wait for an approval message')
                deletechild(bgDiv, bgDiv.parentNode)
            }
        }
    })
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
                                    <span class="capitalize pr-5p">with</span><span class="black capitalize" data-holder="true" data-hold="hc_provider"></span>
                                    <span class="capitalize px-5p">at</span><span class="black capitalize" data-holder="true" data-hold="hospital"></span>
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

 

