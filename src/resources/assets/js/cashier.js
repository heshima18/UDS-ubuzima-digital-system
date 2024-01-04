import { alertMessage, getdata, getschema, postschema, request,addSpinner,removeSpinner,sessiondata,addLoadingTab,removeLoadingTab, checkEmpty, showRecs, getchips,getPath,addsCard,cpgcntn, geturl, adcm, addshade, deletechild, RemoveAuthDivs, showFingerprintDiv, addAuthDiv, aDePh } from "../../../utils/functions.controller.js";
import { showPaymentPopup } from "../../../utils/payments.popup.controller.js";
import { shedtpopup } from "../../../utils/profile.editor.controller.js";
import { addUprofile } from "../../../utils/user.profile.controller.js";
import {pushNotifs, userinfo,expirateMssg, getNfPanelLinks,m as messages, DateTime} from "./nav.js";


let q,w,e,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z,r,session_input,session_s_button,eventadded,notificationlinks,socket
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
                notificationlinks = pushNotifs(message);
                messages.push(message)
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
            url.pathname = `/cashier/${cudstp.getAttribute('data-item-type')}`;
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
            if (x == 'home') {
                let num_hols = Array.from(page.querySelectorAll('[data-role="num_hol"]'))
                
              let sessions = await request('get-hp-daily-sessions',postschema)
              if (!sessions.success) {
                return alertMessage(sessions.message)
              }
              sessions = sessions.message
              num_hols.forEach(holder=>{
                let id = holder.id
                Object.keys(sessions).map(number =>{
                    if (number == id) {
                        holder.innerHTML = adcm(sessions[number])
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
                    if (!r.success) return alertMessage(r.message)
                    addUprofile(r.message);
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
                    addUprofile(r.message);
                    let url = new URL(window.location.href);
                    url.pathname = `/cashier/search-patient/${r.message.id}`;
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
                    addUprofile(r.message);
                    let url = new URL(window.location.href);
                    url.pathname = `/hc_provider/search-patient/${s.value}`;
                    window.history.pushState({},'',url.toString())
            
                }
            
            }else if (x == 'my-account') {
                n = page.querySelector('span.name')
                z = getdata('userinfo')
                n.textContent = z.Full_name
                i = page.querySelector('span.n-img');
                i.textContent = z.Full_name.substring(0,1)
                let dataHolders = Array.from(page.querySelectorAll('span[data-holder="true"]')),
                info = userinfo.message,editPform = page.querySelector('form#change-password')
                dataHolders.forEach(holder=>{
                    let id = holder.id
                    holder.innerText = info[id]
                })
                let editbuts = Array.from(page.querySelectorAll('span.edit-p-info'))
                for (const button of editbuts) {
                    button.addEventListener('click',()=>{
                        let id = button.id
                        shedtpopup(id,info)
                    })
                }
                let ins = Array.from(editPform.querySelectorAll('input')),shbuts = Array.from(editPform.querySelectorAll('span.showP'))
                shbuts.forEach(button=>{
                    button.onclick = function (event) {
                        event.preventDefault();
                        if (ins[shbuts.indexOf(this)].type == 'password') {
                            this.querySelector('i').classList.replace('fa-eye','fa-eye-slash')
                            ins[shbuts.indexOf(this)].type = 'text'
                        }else{
                            this.querySelector('i').classList.replace('fa-eye-slash','fa-eye')
                            ins[shbuts.indexOf(this)].type = 'password'
                        }
                    }
                })
                editPform.onsubmit = async function (event) {
                    event.preventDefault();
                    let v = 1,s = 1
                    let password = ins.find(function (input) {return input.name == 'password'}),confirm = ins.find(function (input) {return input.name == 'confirm'})
                    
                    v = checkEmpty(password)
                    s = checkEmpty(confirm)
                    if(!v || !s) return 0
                
                    if (password.value.length < 6) {
                        return setErrorFor(password, 'this password does not meet minimum requirements')
                    }else if (password.value != confirm.value) {
                        return setErrorFor(password, 'passwords do not match')
                    }else{
                        postschema.body = JSON.stringify({
                            token: getdata('token'),
                            type : 'password',
                            value : password.value
                        })
                        let response = await request('edit-profile',postschema)
                        alertMessage(response.message)
                    }
                }
            }else if (x == 'view-session') {
                theb.innerHTML = raw
                if (extra) {
                    let url = new URL(window.location.href);
                    url.pathname = `/cashier/view-session/${extra}`;
                    window.history.pushState({},'',url.toString())
                }
                let session = getPath(2)
                addLoadingTab(page.querySelector('div.theb'));
                session_input = page.querySelector('input#session-id');
                session_s_button = page.querySelector('button[name="session-search"]');
                if (!eventadded) {
                    session_s_button.addEventListener('click', async event=>{
                    event.preventDefault();
                    if (session_input.value) {
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
                        }
                        session_s_button.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                        session_s_button.removeAttribute('disabled')
                        if (!sessiondata.success) return alertMessage(sessiondata.message)
                        session_input.value = session
                        let url = new URL(window.location.href);
                        url.pathname = `/cashier/view-session/${session}`;
                        window.history.pushState({},'',url.toString())
                        sessiondata = sessiondata.message
                        showSession(sessiondata);
                    }
                    })
                    eventadded = 1
                }
              if (session) {
                postschema.body = JSON.stringify({token: getdata('token')})
                let sessiondata =  await request(`session/${session}`,postschema)
                if (!sessiondata.success) return alertMessage(sessiondata.message)
                session_input.value = session
                sessiondata = sessiondata.message
                showSession(sessiondata);     
              }
            }else if (x == 'medical-prescriptions') {
                let fileredData
                 let t = page.querySelector('table')
                 if (!t.classList.contains('loaded')) {
                     addLoadingTab(page.querySelector('div.theb'));
                 }
                 let dateRangeForm = page.querySelector('form[name="date-range"]')
                 let inputs = Array.from(dateRangeForm.querySelectorAll('input'))
                 dateRangeForm.onsubmit = async function (event) {
                     event.preventDefault();
                     let values = {}
                     for (const input of inputs) {
                         if (!input.value) {
                             return 0
                         }
                         Object.assign(values,{[input.id]: new Date(input.value).toISOString().split('T')[0]})
                     }
                     postschema.body = JSON.stringify({
                         token: getdata('token'),
                         values
                     })
                     let session_s_button = dateRangeForm.querySelector('button');
                     addSpinner(session_s_button)
                     let mh = await request('get-hospital-medical-history',postschema)
                     removeSpinner(session_s_button)
                     if (!mh.success) {
                         return alertMessage( mh.message)
                     }
                     if (page.querySelector('.status').querySelector('select')) {
                         page.querySelector('.status').removeChild(page.querySelector('.status').querySelector('select'));
                         page.querySelector('.insurance').removeChild(page.querySelector('.insurance').querySelector('select'));
                         page.querySelector('.hcp').removeChild(page.querySelector('.hcp').querySelector('select'));
                         page.querySelector('.dptmnt').removeChild(page.querySelector('.dptmnt').querySelector('select'));
 
 
                     }
                     initTable(mh.message)
                 }
                 function initTable(data) {
                     removeLoadingTab(page.querySelector('div.theb'))
                     fileredData = undefined
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
                             { data: "p_info.name", title: "patient" },
                             { data: "in_info.name", title: "Insurance" },
                             { data: "p_info.insurance.number", title: "insurance number" },
                             { data: "hcp.name", title: "healthcare provider" },
                             { data: "dptmnt.name", title: "department" },
                             { data: "payment_info.p_amount", title: "amount (RWF)" },
                             { data: "payment_info.status2", title: "status" },
                             { data: "dateclosed", title: "date" },
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
                                         `<span class="capitalize">${e}</span>`
                                     );
                                 },
                             },
                             {
                                 targets: 2,
                                 searchable: 1,
                                 orderable: 1,
                                 render: function (e, t, a, n) {
                                     return (
                                         `<span class="">${e}</span>`
                                     );
                                 },
                             },
                             {
                                 targets: 3,
                                 searchable: 1,
                                 orderable: !1,
                                 render: function (e, t, a, n) {
                                     return (
                                         `<span class="">${e}</span>`
                                     );
                                 },
                             },
                             {
                                 targets: 4,
                                 searchable: 1,
                                 orderable: 1,
                                 render: function (e, t, a, n) {
                                     return (
                                         `<span class="">${e}</span>`
                                     );
                                 },
                             },
                             {
                                 targets: 5,
                                 searchable: 1,
                                 orderable: 1,
                                 render: function (e, t, a, n) {
                                     return (
                                         `<span class="">${e}</span>`
                                     );
                                 },
                             },
                             {
                                 targets: 6,
                                 searchable: !1,
                                 orderable: 1,
                                 render: function (e, t, a, n) {
                                     return (
                                         `<span class="">${adcm(e)}</span>`
                                     );
                                 },
                             },
                             {
                                 targets: 7,
                                 searchable: 1,
                                 orderable: 1,
                                 render: function (e, t, a, n) {
                                     return (
                                         `<span class="btn btn-sm ${(e == 'paid') ? 'bc-tr-green green' : 'bc-gray dgray'}">${e}</span>`
                                     );
                                 },
                             },
                             {
                                 targets: 8,
                                 searchable: 1,
                                 orderable: 1,
                                 render: function (e, t, a, n) {
                                     return (
                                         `<span class="">${e}</span>`
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
                                         <button class="btn btn-sm btn-icon view-button border border-3" data-id="${e}"><i class="bx bx-show"></i></button>
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
                             this.api().columns(7).every(function () {
                                 var t = this,
                                     a = $('<select class="form-select text-capitalize"><option value=""> Select Status </option></select>')
                                         .appendTo(".status")
                                         .on("change", function () {
                                             var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                             t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                                         });
                                 t.data().unique().sort().each(function (e, t) {
                                     a.append('<option value="' + e + '">' + e + "</option>");
                                 });
                             });
                             this.api().columns(2).every(function () {
                                 var t = this,
                                     a = $('<select class="form-select text-capitalize"><option value=""> Select insurance </option></select>')
                                         .appendTo(".insurance")
                                         .on("change", function () {
                                             var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                             t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                                         });
                                 t.data().unique().sort().each(function (e, t) {
                                     a.append('<option value="' + e + '">' + e + "</option>");
                                 });
                             });
                             this.api().columns(4).every(function () {
                                 var t = this,
                                     a = $('<select class="form-select text-capitalize"><option value=""> Select hcp </option></select>')
                                         .appendTo(".hcp")
                                         .on("change", function () {
                                             var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                             t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                                         });
                                 t.data().unique().sort().each(function (e, t) {
                                     a.append('<option value="' + e + '">' + e + "</option>");
                                 });
                             });
                             this.api().columns(5).every(function () {
                                 var t = this,
                                     a = $('<select class="form-select text-capitalize"><option value=""> Select Department </option></select>')
                                         .appendTo(".dptmnt")
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
                     checkButtons()
                     let tabl = page.querySelector('.dataTables_paginate');
                     tabl.addEventListener('click', e=>{
                         setTimeout(checkButtons,10)
 
                     })
                     if (e) {     
                         $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                             setTimeout(checkButtons,10)
                             if (settings.nTable.classList.contains('datatables-prescriptions')) {
                                 fileredData = e.rows({ search: 'applied'}).data().toArray();
                             }      
                             return true
                         })
                     }
                 }
                 function checkButtons() {
                     let viewbuts = Array.from(page.querySelectorAll('button.view-button'))
                     viewbuts.forEach(button => {
                         button.onclick = async function (event) {
                             event.preventDefault();
                             let url = new URL(window.location.href);
                             url.pathname = `/cashier/view-session/${this.getAttribute('data-id')}`;
                             window.history.pushState({},'',url.toString())
                             const evnt = new Event('urlchange', { bubbles: true });
                             window.dispatchEvent(evnt);
                         }
                     });
                 }
                 let actButton  = page.querySelector('.act-button');
                 let actDiv = page.querySelector('#act-div');
                 actButton.onclick = function (event) {
                     event.preventDefault();
                     actDiv.classList.toggle('hidden')  
                 }
                 let actButtons = Array.from(actDiv.querySelectorAll('.act-buttons'));
                 actButtons.forEach(button=>{
                     button.onclick = async function (event) {
                         actDiv.classList.toggle('hidden')
                         event.preventDefault();
                         if (!fileredData) {
                             alertMessage('please filter data first')
                             return 0
                         }
                         let amounts = fileredData.map(function (data) {
                             return data.payment_info.a_amount
                         })
                         if (button.id == 'calculate-total-price') {
                             let sum = 0
                             amounts.map(function (value) {
                                 return sum+=value
                             })
                             alertMessage(`the sum of the selected entries is <b>${adcm(sum)} RWF</b>`)
                         }else if (button.id == 'mark-as-paid') {
                             let min = inputs[0].value
                             let max = inputs[1].value
                             if (min,max) {
                                 let dates_interval = {min,max}
                                 let assurance = hp_in.getAttribute('data-id')
                                 postschema.body = JSON.stringify({
                                     token: getdata('token'),
                                     range: dates_interval,
                                     assurance
                                 })
                                 let update = await request('approve-assurance-payment',postschema)
                                 alertMessage(update.message)
                             }
                         }
 
                     }
                 })
                     
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
                        if (dataHolder.getAttribute('data-hold').indexOf('quantity') != -1 || dataHolder.getAttribute('data-hold').indexOf('amount') != -1 || dataHolder.getAttribute('data-hold').indexOf('price') != -1) {
                            dataHolder.innerText = adcm(data[dataHolder.getAttribute('data-hold')])
                        }else if (dataHolder.getAttribute('data-hold').indexOf('status') != -1) {
                            if (data[dataHolder.getAttribute('data-hold')] != 'served') {
                                dataHolder.innerText = `mark as served`
                                dataHolder.classList.replace('bc-gray','btn-label-primary')
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
                    if(dataToShow.length == 0){
                        aDePh(element.parentElement)
                    }
                    element.parentNode.removeChild(element)
    
                }
                for (const holder of dataHolders) {
                        let objectId = holder.getAttribute('data-hold')
                        if (objectId.indexOf('.') != -1) {
                            objectId = objectId.split('.')
                            if (objectId[1].indexOf('amount') != -1 || objectId[1] == 'price') {
                                holder.innerText = adcm(sessiondata[objectId[0]][objectId[1]])
                            }else if (objectId[1].indexOf('status') != -1 && objectId[0].indexOf('payment_info') != -1) {
                                if (sessiondata[objectId[0]][objectId[1]] == 'paid') {
                                    holder.classList.replace('bc-gray','bc-tr-green')
                                }
                                holder.innerText = sessiondata[objectId[0]][objectId[1]]
                                
                            }else{
                                holder.innerText = sessiondata[objectId[0]][objectId[1]]
                            }
                        }else{
                            if (holder.getAttribute('data-hold').indexOf('status') != -1) {
                                if (sessiondata[holder.getAttribute('data-hold')] == "open") {
                                    holder.classList.replace('bc-gray','bc-tr-green')
                                }
                            }
                            holder.innerText = sessiondata[objectId]
                        }
                }
                let mark_buttons = Array.from(page.querySelectorAll('span.mark-button'))
                let bigbuttons = Array.from(page.querySelectorAll('span.data-buttons'))
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
                    button.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`
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
                    if (sessiondata.payment_info.status != 'awaiting payment' && button.getAttribute('data-role') == 'approve-payment') {
                       button.classList.add('loading')
                       button.classList.replace('btn-label-success','btn-label-secondary')
                       button.innerHTML = `this session is already paid`
                    }else if (sessiondata.payment_info.status != 'awaiting payment' && button.getAttribute('data-role') == 'request-payment') {
                      deletechild(button, button.parentElement)
                    }
                   button.onclick =  async function (event) {
                        let role = this.getAttribute('data-role')
                        if (role == 'approve-payment' && !button.classList.contains('loading')) {
                            if (sessiondata.payment_info.status == 'paid') {
                                return alertMessage('this session is already paid')
                            }
                            postschema.body = JSON.stringify({
                                session: sessiondata.session_id,
                                token: getdata('token')
                            })
                            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                            button.setAttribute('disabled',true)
                            let result = await request('approve-payment',postschema)
                            if (result.success) {
                                button.innerHTML = `this session is already paid`
                                button.classList.replace('btn-label-success','btn-label-secondary')
                                button.classList.add('loading')
                                document.querySelector('span.status-holder').classList.replace('btn-label-secondary','btn-label-success')
                                document.querySelector('span.status-holder').innerText = `paid`
                                sessiondata.payment_info.status = 'paid'
                            }else{
                                button.innerHTML = `approve payment`
                            }
                            alertMessage(result.message)

                            
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
                        comment(sessiondata.comment)
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
                }else if (link.getAttribute('data-message-type') == 'transfer_message' ) {
                    if ('extra' in message) {
                        viewTransfer(message.extra.transfer)
                    }else if ('addins' in message) {
                        viewTransfer(message.addins.transfer)
                    }
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

 

