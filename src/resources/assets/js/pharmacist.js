import { alertMessage, getdata, getschema, postschema, request,initializeCleave,sessiondata,addLoadingTab,removeLoadingTab, checkEmpty, showRecs, getchips,getPath,addsCard,cpgcntn, geturl, adcm, addshade, deletechild } from "../../../utils/functions.controller.js";
import {pushNotifs, userinfo,expirateMssg, getNfPanelLinks,m as messages, DateTime} from "./nav.js";


let q,w,e,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z,notificationlinks
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
    let users = await request('get-hp-employees',postschema)
    f = await request('get-inventory',postschema)
    m = await request('getmeds',postschema)
    if (!f.success) {
        return alertMessage(f.message)
    }
    let extra = {users: users.message, tests: f.message}
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
                    gsd(target)
                    return 0
                }
            })
        }else{
            window.history.pushState('','','./home')
            cpgcntn(0,p)
            gsd(p[0])
    
        }
    }
    c.forEach((cudstp)=>{
        cudstp.addEventListener('click',()=>{
            c.forEach((cp)=>{
                cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
            })
            cudstp.classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
            let url = new URL(window.location.href);
            url.pathname = `/pharmacist/${cudstp.getAttribute('data-item-type')}`;
            window.history.pushState({},'',url.toString())
            cpgcntn(c.indexOf(cudstp),p,extra)
            gsd(p.find(function (elem) {
                return elem.id == cudstp.getAttribute('data-item-type')
            }))
        })
    })
    notificationlinks = getNfPanelLinks()
    genClicks(notificationlinks)
    async function gsd(page,extra) {
        try {
            x = page.id
            if (x == 'search-session') {
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
        (r.message);
          
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
          
            }else if (x == 'manage-inventory') {
                var table = $('.datatables-employees');
                let t = document.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    e = table.DataTable({
                        // Define the structure of the table
                        dom: '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                        columns: [
                            { data: "" }, // Responsive Control column
                            { data: "name", title: "Name" },
                            { data: "quantity", title: "amount available" },
                            { data: "unit", title: "measuring unit" },
                            { data: "id", title: "Action", }
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
                                searchable: !1,
                                orderable: 1,
                                render: function (e, t, a, n) {
                                    return (
                                        `<span class="capitalize">${e}</span>`
                                    );
                                },
                            },
                            {
                                targets: 2,
                                searchable: !1,
                                orderable: 1,
                                render: function (e, t, a, n) {
                                    return (
                                        `<span class="">${adcm(e)}</span>`
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
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="medicines" data-role="edit" data-id="${e}" data-bs-target = "#edit-medicine"><i class="bx bx-edit"></i></button>
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="medicines" data-role="delete" data-id="${e}"><i class="bx bx-trash"></i></button>
                                    </div>`
                                    );
                                },
                            },
                        ],
                        order: [[1, "asc"]], // Initial sorting
            
                        // Provide the data from the imported inventory
                        data: f.message.medicines,
            
                        // Define buttons for exporting and adding new inventory
                        buttons: [
                            {
                                extend: "collection",
                                className: "btn btn-outline-secondary dropdown-toggle mx-3",
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
                            {
                                text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New</span>',
                                className: "add-new btn btn-primary",
                                attr: { "id": "add-medic", "data-bs-target": "#add-medicine" },
                            },
                        ],
            
                        // Initialize filters for position, health post, and status
                        initComplete: function () {
                            // Filter by Position
                            this.api().columns(3).every(function () {
                                var t = this,
                                    a = $('<select class="form-select text-capitalize"><option value=""> Select Measuring Unit </option></select>')
                                        .appendTo(".employee-position")
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
                let addMedic = document.querySelector('#add-medic'),buttons = Array.from(page.querySelectorAll('button.data-buttns'));
                addMedic.onclick =  function(){
                    let target = this.getAttribute('data-bs-target')
                    let cloneD = document.querySelector(`div${target}`)
                    cloneD = cloneD.cloneNode(true);
                    d = addshade();
                    d.appendChild(cloneD);
                    let aMform = cloneD.querySelector("form#add-medicine-form");
                    let input = aMform.querySelector('input[name="medicines"]')
                    input.addEventListener('focus', (event)=>{
                        event.preventDefault()
                            showRecs(input,m.message,input.id)
                    })
                    aMform.addEventListener('submit', async event=>{
                        
                        event.preventDefault();
                            v = checkEmpty(input);
        
                        if (v) {
                        let button = aMform.querySelector('button[type="submit"]')
                        button.innerText = `Recording medication(s)`
                        button.setAttribute('disabled',true)
                            let values = {}
                            Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','quantity']) })
                            Object.assign(values,{token: getdata('token')})
                            postschema.body = JSON.stringify(values)
                            let results = await request('add-inventory',postschema)
                            if (results.success) {
                                deletechild(d,d.parentNode)
                            }
                            alertMessage(results.message)
                            button.removeAttribute('disabled')
                            button.innerText= 'proceed'
            
                        }
                    })
                }
                buttons.forEach(bttn=>{
                    bttn.onclick = async function (event) {
                        event.preventDefault()
                        let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                        if (role == 'delete') {
                            postschema.body = JSON.stringify({
                                token: getdata('token'),
                                type: type,
                                inventory: f.message.id,
                                needle: objId
                            })
                            var row = e.row(event.target.closest('tr'))
                            row.remove().draw();
                            let result = await request('rIFromInv',postschema)
                            if (result.success) {
                                alertMessage(result.message)
                            }else{
                                alertMessage(result.message)
                            }
                        }else if (role == 'edit') {
                            let targetMed = f.message.medicines.find(function (medic) {
                                return medic.id == objId
                            })
                            let target = this.getAttribute('data-bs-target')
                            let cloneD = document.querySelector(`div${target}`)
                            cloneD = cloneD.cloneNode(true);
                            d = addshade();
                            d.appendChild(cloneD);
                            let eMform = cloneD.querySelector("form#edit-medicine-form");
                            let input = eMform.querySelector('input[name="medicine"]');
                            let quantity = eMform.querySelector('input[name="quantity"]');

                            input.value = targetMed.name
                            input.setAttribute('readonly', true)
                            input.setAttribute('disabled', true)
                            input.setAttribute('data-id',targetMed.id)
                            quantity.value = targetMed.quantity
                            eMform.addEventListener('submit', async event=>{
                                event.preventDefault();
                                    v = checkEmpty(quantity);               
                                if (v) {
                                let button = eMform.querySelector('button[type="submit"]')
                                button.innerText = `Editing entry`
                                button.setAttribute('disabled',true)
                                    let values = {}
                                    Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {quantity :quantity.value}, type : 'medicines' ,inventory: f.message.id})
                                    Object.assign(values,{token: getdata('token')})
                                    postschema.body = JSON.stringify(values)
                                    let results = await request('eInvEnt',postschema)
                                    if (results.success) {
                                        deletechild(d,d.parentNode)
                                    }
                                    alertMessage(results.message)
                                    button.removeAttribute('disabled')
                                    button.innerText= 'proceed'
                    
                                }
                            })  
                        }
                    }
                })


                t.classList.add('loaded')
            }else if (x == 'view-session') {
                theb.innerHTML = raw
                if (extra) {
                    let url = new URL(window.location.href);
                    url.pathname = `/pharmacist/view-session/${extra}`;
                    window.history.pushState({},'',url.toString())
                }
              let session = getPath(2)
              addLoadingTab(page.querySelector('div.theb'));
              let session_input = page.querySelector('input#session-id');
              let session_s_button = page.querySelector('button[name="session-search"]');
              session_s_button.addEventListener('click', async event=>{
                event.preventDefault();
                if (session_input.value && session_input.value != session) {
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
                    }
                    session_s_button.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                    session_s_button.removeAttribute('disabled')
                    if (!sessiondata.success) return alertMessage(sessiondata.message)
                    session_input.value = session
                    let url = new URL(window.location.href);
                    url.pathname = `/pharmacist/view-session/${session}`;
                    window.history.pushState({},'',url.toString())
                    sessiondata = sessiondata.message
                    showSession(sessiondata);
                }
              })
              if (session) {
                postschema.body = JSON.stringify({token: getdata('token')})
                let sessiondata =  await request(`session/${session}`,postschema)
                if (!sessiondata.success) return alertMessage(sessiondata.message)
                session_input.value = session
                sessiondata = sessiondata.message
                showSession(sessiondata);     
              }
            }
            function showSession(sessiondata) {
                removeLoadingTab(page.querySelector('div.theb'))
                Object.assign(sessiondata.payment_info,{total_amount: Number(sessiondata.payment_info.a_amount) + Number(sessiondata.payment_info.p_amount)})
                const dataHolders = Array.from(document.querySelectorAll('[name="info-hol"]'))
                const loopingDataHolders = Array.from(document.querySelectorAll('ul[name="looping-info"]'))
                for (const element of loopingDataHolders) {
                    let dataToHold = element.getAttribute('data-hold');
                    let dataToShow = sessiondata[dataToHold]
                    for (const data of dataToShow) {
                        Object.assign(data,{total_amount: (Number(data.price) * Number(data.quantity)).toFixed(2)})
                        let clonedNode = element.cloneNode(true);
                        let dataHolders = Array.from(clonedNode.querySelectorAll('[name="looping-info-hol"]'))
                        if (clonedNode.getAttribute(`data-id-holder`)) {
                            clonedNode.setAttribute('data-id',data.id)
                        }
                        if (dataToHold == 'medicines') {
                            if (data.status == 'served') {
                                clonedNode.classList.add('bc-tr-green')
                                dataHolders.find(function(element) {return element.getAttribute('data-hold') == 'name'}).classList.replace('dgray','green')
                            }else{
                                clonedNode.classList.add('bc-gray')
                            }
                        }
                       for (const dataHolder of dataHolders) {
                        if (dataHolder.getAttribute(`data-id-holder`)) {
                            dataHolder.setAttribute('data-id',data.id)
                        }
                        if (dataHolder.getAttribute('data-hold').indexOf('quantity') != -1 || dataHolder.getAttribute('data-hold').indexOf('amount') != -1) {
                            dataHolder.innerText = adcm(data[dataHolder.getAttribute('data-hold')])
                        }else if (dataHolder.getAttribute('data-hold').indexOf('status') != -1) {
                            if (data[dataHolder.getAttribute('data-hold')] != 'served') {
                                dataHolder.innerText = `mark as served`
                                dataHolder.classList.replace('btn-label-secondary','btn-label-primary')
                                dataHolder.setAttribute('data-active', true)
                            }else{
                                dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]

                            }
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
               let mark_buttons = Array.from(page.querySelectorAll('span.mark-button'))
               let bigbuttons = Array.from(page.querySelectorAll('span.data-buttons'))
               sessiondata.medicines.forEach(function (medic) {
                    if (medic.status != 'served') {
                        d=1
                    }
                })
                if (!d) {
                    bigbuttons[0].classList.add('loading')
                    bigbuttons[0].classList.replace('btn-primary','btn-secondary')
                    bigbuttons[0].innerHTML = `all marked as served`
                }
               mark_buttons = mark_buttons.filter(function (button) {
                return button.getAttribute('data-active') == 'true'
               })
               mark_buttons.map(function(button) {
                button.addEventListener('click', async function() {
                    if (button.classList.contains('loading')) {
                        return 0
                    }
                    let medid = this.getAttribute('data-id')
                    postschema.body = JSON.stringify({
                        token: getdata('token'),
                        medicines : [medid],
                        session: sessiondata.session_id
                    })
                    button.innerHTML = `<span class="spinner-border"></span>`
                    button.setAttribute('disabled',true)
                    let results = await request('mark-as-served',postschema)
                    button.classList.remove('loading')
                    button.removeAttribute('disabled')
                    if (results.success) {
                        button.innerHTML = `served`
                        button.classList.replace('btn-label-primary','btn-label-secondary')
                        let parent = button.parentNode.parentNode.parentNode
                        parent.classList.replace('bc-gray','bc-tr-green')
                        button.removeAttribute(`data-active`)
                        parent.querySelector('span.card-title').classList.replace('dgray','green')
                        mark_buttons = Array.from(page.querySelectorAll('span.mark-button'))
                        mark_buttons = mark_buttons.filter(function (button) {
                            return button.getAttribute('data-active') == 'true'
                        })
                    }else{
                        button.innerHTML = `mark as served`
                    }
                    alertMessage(results.message)
                })
               })
               bigbuttons.map(function (button) {
                   button.addEventListener('click', async function (event) {
                    let role = this.getAttribute('data-role')
                    if (role == 'medication' && !button.classList.contains('loading')) {
                        let medicines = sessiondata.medicines.map(function (medic) {
                            if (!medic.servedOut && medic.status != 'served') {
                                medic = medic.id
                                return medic
                            }
                        })
                        medicines = medicines.filter(function (medic) {
                            return medic != undefined
                        })
                        postschema.body = JSON.stringify({
                            token: getdata('token'),
                            medicines,
                            session: sessiondata.session_id
                        })
                        button.innerHTML = `<span class="spinner-border"></span>`
                        button.setAttribute('disabled',true)
                        button.classList.add('loading')
                        let results = await request('mark-as-served',postschema)
                        button.classList.remove('loading')
                        if (results.success) {
                            button.innerHTML = `all marked as served`
                            button.classList.replace('btn-primary','btn-secondary')
                            let parent = button.parentNode.parentNode.parentNode
                            console.log(parent)
                            let uls = Array.from(parent.querySelectorAll('ul'))
                            uls.map(function(container){
                                container.classList.replace('bc-gray','bc-tr-green')
                                container.querySelector('span.mark-button').removeAttribute(`data-active`)
                                container.querySelector('span.mark-button').setAttribute('disabled',true)
                                container.querySelector('span.mark-button').classList.replace('btn-label-primary','btn-label-secondary')
                                container.querySelector('span.mark-button').textContent = 'served'
                                container.querySelector('span.card-title').classList.replace('dgray','green')
                                mark_buttons = Array.from(page.querySelectorAll('span.mark-button'))
                                mark_buttons = mark_buttons.filter(function (button) {
                                    return button.getAttribute('data-active') == 'true'
                                })
                                if (!mark_buttons.length) {
                                     button.classList.add('loading')
                                }
                            })
                        }else{
                            button.removeAttribute('disabled')
                            button.innerHTML = `mark all as served`
                        }
                        alertMessage(results.message)
                    }else if (role == 'comment') {
                        let comment = async (data) =>{
                            const session = sessiondata
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
                                                    <div class="wrap center-2 my-15p bsbb bblock-resp">
                                                        <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
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
                        comment(sessiondata.comment)
                    }
                    
                })
               })            
            }
            
          } catch (error) {
            console.log(error)
          }
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
                if (link.getAttribute('data-message-type') == 'session_message') {
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

 

