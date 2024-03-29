import { alertMessage, getdata, getschema, postschema, request,initializeCleave,sessiondata,addLoadingTab,removeLoadingTab, checkEmpty, showRecs, getchips,getPath,addsCard,cpgcntn, geturl, adcm, addshade, deletechild, removeRec, aDePh, addSpinner, removeSpinner, triggerRecs } from "../../../utils/functions.controller.js";
import { shedtpopup } from "../../../utils/profile.editor.controller.js";
import {expirateMssg, pushNotifs, userinfo} from "./nav.js";

let q,w,e,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z,socket,assurances,inventory,fileredData
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
    const hospital = await request('hospital', postschema)
    const medications = await request('getmeds', postschema)
    const services = await request('get-services', postschema)
    const tests = await request('get-tests', postschema)
    const operations = await request('get-operations', postschema)
    const equipments = await request('get-equipments', postschema)
    inventory = await request('get-inventory', postschema)
    
    if (!hospital.success) {
        return alertMessage(hospital.message)
    }else if (!medications.success) {
        return alertMessage(medications.message) 
    }else if (!tests.success) {
        return alertMessage(tests.message) 
    }else if (!operations.success) {
        return alertMessage(operations.message) 
    }else if (!equipments.success) {
        return alertMessage(equipments.message) 
    }else if (!services.success) {
        return alertMessage(services.message) 
    }else if (!inventory.success) {
        return alertMessage(inventory.message) 
    }
    
    let extra = inventory.message
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
                cpgcntn(t,p,extra)
                gsd(target,extra)
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
                        gsd(target,extra)
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
            url.pathname = `/dof/${cudstp.getAttribute('data-item-type')}`;
            window.history.pushState({},'',url.toString())
            cpgcntn(c.indexOf(cudstp),p,extra)
            let page = p.find(function (elem) {
                return elem.id == cudstp.getAttribute('data-item-type')
            })
            if (page) {
                gsd(page,extra)
            }
        })
    })
    async function gsd(page,extra) {
        try {
            x = page.id
            if (x == 'home') {
                let num_hols = Array.from(page.querySelectorAll('[data-role="num_hol"]'))
                
              let messages = sessiondata('messages')
              let nmbrs = {med_inv: 0,equi_inv : 0,serv_inv: 0, tes_inv: 0, op_inv: 0}
              if (inventory) {
              }else{
                inventory = await request('get-inventory',postschema)
              }
              if (inventory.success) {
                inventory.message.medicines.map(function (inv) {
                    nmbrs.med_inv +=1
                })
                inventory.message.tests.map(function (inv) {
                    nmbrs.tes_inv +=1
                })
                inventory.message.equipments.map(function (inv) {
                    nmbrs.equi_inv +=1
                })
                inventory.message.services.map(function (inv) {
                    nmbrs.serv_inv +=1
                })
                inventory.message.operations.map(function (inv) {
                    nmbrs.op_inv +=1
                })
              }
              num_hols.forEach(holder=>{
                let holderlink = holder.parentElement.parentElement.querySelector('a')
                holderlink.onclick = function (event) {
                    event.preventDefault()
                    let link = this.getAttribute('data-redirect')
                    if (link.indexOf('#') == -1) {
                        let url = new URL(window.location.href);
                        url.pathname = `/dof/${link}`;
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
            }else if (x == 'medications-inventory') {
                let table = $('.datatables-medications');
                let t = document.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    e = table.DataTable({
                        // Define the structure of the table
                        dom: '<"row mx-2"<"col-md-2 p-10p"<"me-3"l>><"col-md-10 p-10p"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                        columns: [
                            { data: "",title: "" }, // Responsive Control column
                            { data: "name", title: "Name" },
                            { data: "quantity", title: "Quantity available" },
                            { data: "unit", title: "Measuring unit" },
                            { data: "price", title: "medication's price (RWF)" },
                            { title: "Action", data: 'id'}
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
                                searchable: !1,
                                orderable: 1,
                                render: function (e, t, a, n) {
                                    return (
                                        `<span class="">${adcm(e)}</span>`
                                    );
                                },
                            },
                            {
                                targets: 3,
                                searchable: !1,
                                orderable: 1,
                                render: function (e, t, a, n) {
                                    return (
                                        `<span class="capitalize">${e}</span>`
                                    );
                                },
                            },
                            {
                                targets: 4,
                                searchable: !1,
                                orderable: 1,
                                render: function (e, t, a, n) {
                                    return (
                                        `<span class="capitalize">${adcm(e)}</span>`
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
                        data: extra.medicines,
            
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
                    
                    let addMedic = page.querySelector('#add-medic'),buttons = Array.from(page.querySelectorAll('button.data-buttns')),fileredData;
                    checkButtons()
                    let tabl = page.querySelector('.dataTables_paginate');
                    tabl.addEventListener('click', e=>{
                        setTimeout(checkButtons,10)

                    })
                    if (e) {     
                        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                            setTimeout(checkButtons,10)
                            if (settings.nTable.classList.contains('datatables-medications')) {
                                fileredData = e.rows({ search: 'applied'}).data().toArray();
                            }      
                            return true
                        })
                    }
                
                    function checkButtons() {
                        buttons = Array.from(page.querySelectorAll('button.data-buttns'))
                        buttons.forEach(bttn=>{
                            bttn.onclick = async function (event) {
                                event.preventDefault()
                                let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                                if (role == 'delete') {
                                    postschema.body = JSON.stringify({
                                        token: getdata('token'),
                                        type: type,
                                        inventory: extra.id,
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
                                    let targetMed = extra.medicines.find(function (medic) {
                                        return medic.id == objId
                                    })
                                    let target = this.getAttribute('data-bs-target')
                                    let cloneD = page.querySelector(`div${target}`)
                                    cloneD = cloneD.cloneNode(true);
                                    d = addshade();
                                    d.appendChild(cloneD);
                                    let eMform = cloneD.querySelector("form#edit-medicine-form");
                                    let input = eMform.querySelector('input[name="medicine"]');
                                    let quantity = eMform.querySelector('input[name="quantity"]');
                                    let price = eMform.querySelector('input[name="price"]');
        
                                    input.value = targetMed.name
                                    input.setAttribute('readonly', true)
                                    input.setAttribute('disabled', true)
                                    input.setAttribute('data-id',targetMed.id)
                                    quantity.value = targetMed.quantity
                                    price.value = targetMed.price
                                    eMform.addEventListener('submit', async event=>{
                                        event.preventDefault();
                                            v = checkEmpty(quantity);               
                                        if (v) {
                                        let button = eMform.querySelector('button[type="submit"]')
                                        button.innerText = `Editing entry`
                                        button.setAttribute('disabled',true)
                                            let values = {}
                                            Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {quantity :quantity.value,price: price.value}, type : 'medicines' ,inventory: extra.id})
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
                    }
                    addMedic.onclick =  function(){
                        let target = this.getAttribute('data-bs-target')
                        let cloneD = page.querySelector(`div${target}`)
                        cloneD = cloneD.cloneNode(true);
                        d = addshade();
                        d.appendChild(cloneD);
                        let aMform = cloneD.querySelector("form");
                        let inputs = Array.from(aMform.querySelectorAll('input'))
                        inputs[0].onkeyup =  function(event){
                            if (this.value) {
                                triggerRecs(inputs[0],['id','name','unit','price'],socket)
                            }else{
                                removeRec(inputs[0])
    
                            }
                        
                        }
                        aMform.onsubmit =  async event=>{
    
                           event.preventDefault();
                            l = 1
                            for (const input of inputs) {
                                v = checkEmpty(input);
                                if (!v) {
                                    l = 0
                                }
                            }
                            if (l) {
                            let button = aMform.querySelector('button[type="submit"]')
                            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                            button.setAttribute('disabled',true)
                                let values = {}
                                for (const input of inputs) {
                                    Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','name','price','quantity','unit']) })
                                } 
                                Object.assign(values,{token: getdata('token')})
                                postschema.body = JSON.stringify(values)
                                let results = await request('add-inventory',postschema)
                                values.medicines.forEach(medicine=>{
                                    e.row.add(medicine).draw()
                                })
                                if (results.success) {
                                    deletechild(d,d.parentElement)
                                }
                                alertMessage(results.message)
                                button.removeAttribute('disabled')
                                button.innerHTML= 'proceed'
    
                            }
                        }
                    }
                    t.classList.add('loaded')
                }
            }else if (x == 'tests-inventory') {
                let table = $('.datatables-tests');
                let t = page.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    e = table.DataTable({
                        // Define the structure of the table
                        dom: '<"row mx-2"<"col-md-2 p-10p"<"me-3"l>><"col-md-10 p-10p"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                        columns: [
                            { data: "",title: "" }, // Responsive Control column
                            { data: "name", title: "Name" },
                            { data: "price", title: "Test's price (RWF)" },
                            { title: "Action", data: 'id'}
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
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="tests" data-role="edit" data-id="${e}" data-bs-target = "#edit-test"><i class="bx bx-edit"></i></button>
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="tests" data-role="delete" data-id="${e}"><i class="bx bx-trash"></i></button>
                                    </div>`
                                    );
                                },
                            },
                        ],
                        order: [[1, "asc"]], // Initial sorting
            
                        // Provide the data from the imported inventory
                        data: extra.tests,
            
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
                            {
                                text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New</span>',
                                className: "add-new btn btn-primary",
                                attr: { "id": "add-test", "data-bs-target": "#add-test" },
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
                
                let addTest = page.querySelector('#add-test'),buttons = Array.from(page.querySelectorAll('button.data-buttns'));
                checkButtons()
                let tabl = page.querySelector('.dataTables_paginate');
                tabl.addEventListener('click', e=>{
                    setTimeout(checkButtons,10)
                })
                if (e) {     
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                        setTimeout(checkButtons,10)
                        if (settings.nTable.classList.contains('datatables-tests')) {
                            fileredData = e.rows({ search: 'applied'}).data().toArray();
                        }      
                        return true
                    })
                }
            
                function checkButtons() {
                    buttons = Array.from(page.querySelectorAll('button.data-buttns'))
                    buttons.forEach(bttn=>{
                        bttn.onclick = async function (event) {
                            event.preventDefault()
                            let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                            if (role == 'delete') {
                                postschema.body = JSON.stringify({
                                    token: getdata('token'),
                                    type: type,
                                    inventory: extra.id,
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
                                let targetTest = extra.tests.find(function (test) {
                                    return test.id == objId
                                })
                                let target = this.getAttribute('data-bs-target')
                                let cloneD = page.querySelector(`div${target}`)
                                cloneD = cloneD.cloneNode(true);
                                d = addshade();
                                d.appendChild(cloneD);
                                let eMform = cloneD.querySelector("form#edit-test-form");
                                let input = eMform.querySelector('input[name="test"]');
                                let price = eMform.querySelector('input[name="price"]');
    
                                input.value = targetTest.name
                                input.setAttribute('readonly', true)
                                input.setAttribute('disabled', true)
                                input.setAttribute('data-id',targetTest.id)
                                price.value = targetTest.price
                                eMform.addEventListener('submit', async event=>{
                                    event.preventDefault();
                                        v = checkEmpty(price);               
                                    if (v) {
                                    let button = eMform.querySelector('button[type="submit"]')
                                    button.innerText = `Editing entry`
                                    button.setAttribute('disabled',true)
                                        let values = {}
                                        Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {price :price.value}, type,inventory: extra.id})
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
                }
                addTest.onclick =  function(){
                    let target = this.getAttribute('data-bs-target')
                    let cloneD = document.querySelector(`div${target}`)
                    cloneD = cloneD.cloneNode(true);
                    d = addshade();
                    d.appendChild(cloneD);
                    let aMform = cloneD.querySelector("form");
                    let inputs = Array.from(aMform.querySelectorAll('input'))
                    inputs[0].onfocus = (event)=>{
                        event.preventDefault()
                            showRecs(inputs[0],tests.message,inputs[0].id)
                    }
                    aMform.onsubmit =  async event=>{

                       event.preventDefault();
                        l = 1
                        for (const input of inputs) {
                            v = checkEmpty(input);
                            if (!v) {
                                l = 0
                            }
                        }
                        if (l) {
                        let button = aMform.querySelector('button[type="submit"]')
                        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                        button.setAttribute('disabled',true)
                            let values = {}
                            for (const input of inputs) {
                                Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','name','price']) })
                            } 
                            Object.assign(values,{assurance: this.assurance,token: getdata('token'), assurance: extra.id})
                            postschema.body = JSON.stringify(values)
                            let results = await request('add-inventory-tests',postschema)
                            if (results.success) {
                                values.tests.forEach(test=>{
                                    e.row.add(test).draw()
                                })
                                deletechild(d,d.parentElement)
                            }
                            alertMessage(results.message)
                            button.removeAttribute('disabled')
                            button.innerHTML= 'proceed'

                        }
                    }
                }
                // buttons.forEach(bttn=>{
                //         bttn.onclick = async function (event) {
                //             event.preventDefault()
                //             let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                //             if (role == 'delete') {
                //                 postschema.body = JSON.stringify({
                //                     token: getdata('token'),
                //                     type: type,
                //                     inventory: extra.id,
                //                     needle: objId
                //                 })
                //                 var row = e.row(event.target.closest('tr'))
                //                 row.remove().draw();
                //                 let result = await request('rIFromInv',postschema)
                //                 if (result.success) {
                //                     alertMessage(result.message)
                //                 }else{
                //                     alertMessage(result.message)
                //                 }
                //             }else if (role == 'edit') {
                //                 let targetTest = extra.tests.find(function (test) {
                //                     return test.id == objId
                //                 })
                //                 let target = this.getAttribute('data-bs-target')
                //                 let cloneD = page.querySelector(`div${target}`)
                //                 cloneD = cloneD.cloneNode(true);
                //                 d = addshade();
                //                 d.appendChild(cloneD);
                //                 let eMform = cloneD.querySelector("form#edit-test-form");
                //                 let input = eMform.querySelector('input[name="test"]');
                //                 let price = eMform.querySelector('input[name="price"]');
    
                //                 input.value = targetTest.name
                //                 input.setAttribute('readonly', true)
                //                 input.setAttribute('disabled', true)
                //                 input.setAttribute('data-id',targetTest.id)
                //                 price.value = targetTest.price
                //                 eMform.addEventListener('submit', async event=>{
                //                     event.preventDefault();
                //                         v = checkEmpty(price);               
                //                     if (v) {
                //                     let button = eMform.querySelector('button[type="submit"]')
                //                     button.innerText = `Editing entry`
                //                     button.setAttribute('disabled',true)
                //                         let values = {}
                //                         Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {price :price.value}, type,inventory: extra.id})
                //                         Object.assign(values,{token: getdata('token')})
                //                         postschema.body = JSON.stringify(values)
                //                         let results = await request('eInvEnt',postschema)
                //                         if (results.success) {
                //                             deletechild(d,d.parentNode)
                //                         }
                //                         alertMessage(results.message)
                //                         button.removeAttribute('disabled')
                //                         button.innerText= 'proceed'
                        
                //                     }
                //                 })  
                //             }
                //         }
                //     })
                t.classList.add('loaded')
                // Delete employee when delete icon clicked
            }else if (x == 'operations-inventory') {
                let table = $('.datatables-operations');
                let t = page.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    e = table.DataTable({
                        // Define the structure of the table
                        dom: '<"row mx-2"<"col-md-2 p-10p"<"me-3"l>><"col-md-10 p-10p"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                        columns: [
                            { data: "",title: "" }, // Responsive Control column
                            { data: "name", title: "Name" },
                            { data: "price", title: "Operation's price (RWF)" },
                            { title: "Action", data: 'id'}
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
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="operations" data-role="edit" data-id="${e}" data-bs-target = "#edit-operation"><i class="bx bx-edit"></i></button>
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="operations" data-role="delete" data-id="${e}"><i class="bx bx-trash"></i></button>
                                    </div>`
                                    );
                                },
                            },
                        ],
                        order: [[1, "asc"]], // Initial sorting
            
                        // Provide the data from the imported inventory
                        data: extra.operations,
            
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
                            {
                                text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New</span>',
                                className: "add-new btn btn-primary",
                                attr: { "id": "add-operation", "data-bs-target": "#add-operation-modal" },
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
                let addOper = page.querySelector('#add-operation'),buttons = Array.from(page.querySelectorAll('button.data-buttns'));
                checkButtons()
                let tabl = page.querySelector('.dataTables_paginate');
                tabl.addEventListener('click', e=>{
                    setTimeout(checkButtons,10)
                })
                if (e) {     
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                        setTimeout(checkButtons,10)
                        if (settings.nTable.classList.contains('datatables-operations')) {
                            fileredData = e.rows({ search: 'applied'}).data().toArray();
                        }      
                        return true
                    })
                }
            
                function checkButtons() {
                    buttons = Array.from(page.querySelectorAll('button.data-buttns'))
                    buttons.forEach(bttn=>{
                        bttn.onclick = async function (event) {
                            event.preventDefault()
                            let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                            if (role == 'delete') {
                                postschema.body = JSON.stringify({
                                    token: getdata('token'),
                                    type: type,
                                    inventory: extra.id,
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
                                let targetOperation = extra.operations.find(function (operation) {
                                    return operation.id == objId
                                })
                                let target = this.getAttribute('data-bs-target')
                                let cloneD = page.querySelector(`div${target}`)
                                cloneD = cloneD.cloneNode(true);
                                d = addshade();
                                d.appendChild(cloneD);
                                let eMform = cloneD.querySelector("form#edit-operation-form");
                                let input = eMform.querySelector('input[name="operation"]');
                                let price = eMform.querySelector('input[name="price"]');
    
                                input.value = targetOperation.name
                                input.setAttribute('readonly', true)
                                input.setAttribute('disabled', true)
                                input.setAttribute('data-id',targetOperation.id)
                                price.value = targetOperation.price
                                eMform.addEventListener('submit', async event=>{
                                    event.preventDefault();
                                        v = checkEmpty(price);               
                                    if (v) {
                                    let button = eMform.querySelector('button[type="submit"]')
                                    button.innerText = `Editing entry`
                                    button.setAttribute('disabled',true)
                                        let values = {}
                                        Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {price :price.value}, type,inventory: extra.id})
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
                }
                addOper.onclick =  function(){
                    let target = this.getAttribute('data-bs-target')
                    let cloneD = page.querySelector(`div${target}`)
                    cloneD = cloneD.cloneNode(true);
                    d = addshade();
                    d.appendChild(cloneD);
                    let aMform = cloneD.querySelector("form");
                    let inputs = Array.from(aMform.querySelectorAll('input'))
                    inputs[0].onfocus = (event)=>{
                        event.preventDefault()
                            showRecs(inputs[0],operations.message,inputs[0].id)
                    }
                    aMform.onsubmit =  async event=>{

                       event.preventDefault();
                        l = 1
                        for (const input of inputs) {
                            v = checkEmpty(input);
                            if (!v) {
                                l = 0
                            }
                        }
                        if (l) {
                        let button = aMform.querySelector('button[type="submit"]')
                        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                        button.setAttribute('disabled',true)
                            let values = {}
                            for (const input of inputs) {
                                Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','name','price']) })
                            } 
                            Object.assign(values,{token: getdata('token')})
                            postschema.body = JSON.stringify(values)
                            let results = await request('add-inventory-operations',postschema)
                            if (results.success) {
                                values.operations.forEach(operation=>{
                                   e.row.add(operation).draw()
                                })
                                deletechild(d,d.parentElement)
                            }
                            alertMessage(results.message)
                            button.removeAttribute('disabled')
                            button.innerHTML= 'proceed'

                        }
                    }
                }
                t.classList.add('loaded')
                // Delete employee when delete icon clicked
                table.find("tbody").on("click", ".delete-employee", function () {
                    if (confirm("Are you sure you want to delete this employee?")) {
                        e.row($(this).parents("tr")).remove().draw();
                    }
                })
            }else if (x == 'services-inventory') {
                let table = $('.datatables-services');
                let t = page.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    e = table.DataTable({
                        // Define the structure of the table
                        dom: '<"row mx-2"<"col-md-2 p-10p"<"me-3"l>><"col-md-10 p-10p"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                        columns: [
                            { data: "",title: "" }, // Responsive Control column
                            { data: "name", title: "Name" },
                            { data: "price", title: "service's price (RWF)" },
                            { data: "unit", title: "measurement unit" },
                            { title: "Action", data: 'id'}
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
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="services" data-role="edit" data-id="${e}" data-bs-target = "#edit-service"><i class="bx bx-edit"></i></button>
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="services" data-role="delete" data-id="${e}"><i class="bx bx-trash"></i></button>
                                    </div>`
                                    );
                                },
                            },
                        ],
                        order: [[1, "asc"]], // Initial sorting
            
                        // Provide the data from the imported inventory
                        data: extra.services,
            
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
                            {
                                text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New</span>',
                                className: "add-new btn btn-primary",
                                attr: { "id": "add-service", "data-bs-target": "#add-service-modal" },
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
                let buttons = Array.from(page.querySelectorAll('button.data-buttns'));
                checkButtons()
                let tabl = page.querySelector('.dataTables_paginate');
                tabl.addEventListener('click', e=>{
                    setTimeout(checkButtons,10)
                })
                if (e) {     
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                        setTimeout(checkButtons,10)
                        if (settings.nTable.classList.contains('datatables-services')) {
                            fileredData = e.rows({ search: 'applied'}).data().toArray();
                        }      
                        return true
                    })
                }
                function checkButtons() {
                    buttons = Array.from(page.querySelectorAll('button.data-buttns'))
                    buttons.forEach(bttn=>{
                        bttn.onclick = async function (event) {
                            event.preventDefault()
                            let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                            if (role == 'delete') {
                                postschema.body = JSON.stringify({
                                    token: getdata('token'),
                                    type: type,
                                    inventory: extra.id,
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
                                let targetService = extra.services.find(function (service) {
                                    return service.id == objId
                                })
                                let target = this.getAttribute('data-bs-target')
                                let cloneD = page.querySelector(`div${target}`)
                                cloneD = cloneD.cloneNode(true);
                                d = addshade();
                                d.appendChild(cloneD);
                                let eMform = cloneD.querySelector("form#edit-service-form");
                                let input = eMform.querySelector('input[name="service"]');
                                let price = eMform.querySelector('input[name="price"]');
    
                                input.value = targetService.name
                                input.setAttribute('readonly', true)
                                input.setAttribute('disabled', true)
                                input.setAttribute('data-id',targetService.id)
                                price.value = targetService.price
                                eMform.addEventListener('submit', async event=>{
                                    event.preventDefault();
                                        v = checkEmpty(price);               
                                    if (v) {
                                    let button = eMform.querySelector('button[type="submit"]')
                                    button.innerText = `Editing entry`
                                    button.setAttribute('disabled',true)
                                        let values = {}
                                        Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {price :price.value}, type,inventory: extra.id})
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
                }
                // buttons.forEach(bttn=>{
                //         bttn.onclick = async function (event) {
                //             event.preventDefault()
                //             let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                //             if (role == 'delete') {
                //                 postschema.body = JSON.stringify({
                //                     token: getdata('token'),
                //                     type: type,
                //                     inventory: extra.id,
                //                     needle: objId
                //                 })
                //                 var row = e.row(event.target.closest('tr'))
                //                 row.remove().draw();
                //                 let result = await request('rIFromInv',postschema)
                //                 if (result.success) {
                //                     alertMessage(result.message)
                //                 }else{
                //                     alertMessage(result.message)
                //                 }
                //             }else if (role == 'edit') {
                //                 let targetService = extra.services.find(function (service) {
                //                     return service.id == objId
                //                 })
                //                 let target = this.getAttribute('data-bs-target')
                //                 let cloneD = page.querySelector(`div${target}`)
                //                 cloneD = cloneD.cloneNode(true);
                //                 d = addshade();
                //                 d.appendChild(cloneD);
                //                 let eMform = cloneD.querySelector("form#edit-service-form");
                //                 let input = eMform.querySelector('input[name="service"]');
                //                 let price = eMform.querySelector('input[name="price"]');
    
                //                 input.value = targetService.name
                //                 input.setAttribute('readonly', true)
                //                 input.setAttribute('disabled', true)
                //                 input.setAttribute('data-id',targetService.id)
                //                 price.value = targetService.price
                //                 eMform.addEventListener('submit', async event=>{
                //                     event.preventDefault();
                //                         v = checkEmpty(price);               
                //                     if (v) {
                //                     let button = eMform.querySelector('button[type="submit"]')
                //                     button.innerText = `Editing entry`
                //                     button.setAttribute('disabled',true)
                //                         let values = {}
                //                         Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {price :price.value}, type,inventory: extra.id})
                //                         Object.assign(values,{token: getdata('token')})
                //                         postschema.body = JSON.stringify(values)
                //                         let results = await request('eInvEnt',postschema)
                //                         if (results.success) {
                //                             deletechild(d,d.parentNode)
                //                         }
                //                         alertMessage(results.message)
                //                         button.removeAttribute('disabled')
                //                         button.innerText= 'proceed'
                        
                //                     }
                //                 })  
                //             }
                //         }
                //     })
                let addMedic = page.querySelector('#add-service');
                addMedic.onclick =  function(){
                    let target = this.getAttribute('data-bs-target')
                    let cloneD = page.querySelector(`div${target}`)
                    cloneD = cloneD.cloneNode(true);
                    d = addshade();
                    d.appendChild(cloneD);
                    let aMform = cloneD.querySelector("form");
                    let inputs = Array.from(aMform.querySelectorAll('input'))
                    inputs[0].onfocus = (event)=>{
                        event.preventDefault()
                            showRecs(inputs[0],services.message,inputs[0].id)
                    }
                    aMform.onsubmit =  async event=>{

                       event.preventDefault();
                        l = 1
                        for (const input of inputs) {
                            v = checkEmpty(input);
                            if (!v) {
                                l = 0
                            }
                        }
                        if (l) {
                        let button = aMform.querySelector('button[type="submit"]')
                        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                        button.setAttribute('disabled',true)
                            let values = {}
                            for (const input of inputs) {
                                Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','name','price']) })
                            } 
                            Object.assign(values,{assurance: this.assurance,token: getdata('token'), assurance: extra.id})
                            postschema.body = JSON.stringify(values)
                            let results = await request('add-inventory-services',postschema)
                            if (results.success) {
                                values.services.forEach(service=>{
                                   e.row.add(service).draw()
                               })
                                deletechild(d,d.parentElement)
                            }
                            alertMessage(results.message)
                            button.removeAttribute('disabled')
                            button.innerHTML= 'proceed'

                        }
                    }
                }
                t.classList.add('loaded')
                // Delete employee when delete icon clicked
                table.find("tbody").on("click", ".delete-employee", function () {
                    if (confirm("Are you sure you want to delete this employee?")) {
                        e.row($(this).parents("tr")).remove().draw();
                    }
                })
            }else if (x == 'supported-insurances') {
                let table = $('.datatables-assurances');
                let t = page.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    if (!assurances) {
                        assurances = await request('gHosPiAsSu', postschema)
                    }
                    if (!assurances.success) {
                        return alertMessage(assurances.message) 
                    }
                    e = table.DataTable({
                        // Define the structure of the table
                        dom: '<"row mx-2"<"col-md-2 p-10p"<"me-3"l>><"col-md-10 p-10p"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                        columns: [
                            { data: "",title: "" }, // Responsive Control column
                            { data: "name", title: "Name" },
                            { data: "coverage", title: "coverage (%)" },
                            { title: "Action", data: 'id'}
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
                                searchable: !1,
                                orderable: 1,
                                render: function (e, t, a, n) {
                                    return (
                                        `<span class="">${(e)} %</span>`
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
                                        <button class="btn btn-sm btn-icon data-buttns border border-3" data-type="services" data-role="delete" data-id="${e}"><i class="bx bx-trash"></i></button>
                                    </div>`
                                    );
                                },
                            },
                        ],
                        order: [[1, "asc"]], // Initial sorting
            
                        // Provide the data from the imported inventory
                        data: assurances.message || assurance,
            
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
                            {
                                text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New</span>',
                                className: "add-new btn btn-primary",
                                attr: { "id": "add-service", "data-bs-target": "#add-service-modal" },
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
                let buttons = Array.from(page.querySelectorAll('button.data-buttns'));
                checkButtons()
                let tabl = page.querySelector('.dataTables_paginate');
                tabl.addEventListener('click', e=>{
                    setTimeout(checkButtons,10)
                })
                if (e) {     
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                        setTimeout(checkButtons,10)
                        if (settings.nTable.classList.contains('datatables-assurances')) {
                            fileredData = e.rows({ search: 'applied'}).data().toArray();
                        }      
                        return true
                    })
                }
            
                function checkButtons() {
                    buttons = Array.from(page.querySelectorAll('button.data-buttns'))
                    buttons.forEach(bttn=>{
                        bttn.onclick = async function (event) {
                            event.preventDefault()
                            let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                            if (role == 'delete') {
                                postschema.body = JSON.stringify({
                                    token: getdata('token'),
                                    type: type,
                                    inventory: extra.id,
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
                            }
                        }
                    })
                }
                
                let addMedic = page.querySelector('#add-service');
                addMedic.onclick =  function(){
                    let target = this.getAttribute('data-bs-target')
                    let cloneD = page.querySelector(`div${target}`)
                    cloneD = cloneD.cloneNode(true);
                    d = addshade();
                    d.appendChild(cloneD);
                    let aMform = cloneD.querySelector("form");
                    let inputs = Array.from(aMform.querySelectorAll('input'))
                    inputs[0].onkeyup = (event)=>{
                        event.preventDefault()
                            let val = inputs[0].value.trim();
                            val = val.replace(/[^A-Za-z0-9\s]/g, '');
                            let payload = {
                                needle: val,
                                type: 'search',
                                entity: inputs[0].id,
                                datatofetch: ['id','name'],
                                coltosearch: 'name'

                            }
                            if (val) {
                                removeRec(inputs[0])
                                socket.emit('searchForRecs',payload)
                            }
                        }
                    socket.on('RecsRes', (data)=>{
                        if (data.length) {
                            showRecs(inputs[0],data,inputs[0].id,'noinptAction')
                        }
                    })
                    
                    aMform.onsubmit =  async event=>{

                       event.preventDefault();
                        l = 1
                        for (const input of inputs) {
                            v = checkEmpty(input);
                            if (!v) {
                                l = 0
                            }
                        }
                        if (l) {
                        let button = aMform.querySelector('button[type="submit"]')
                        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                        button.setAttribute('disabled',true)
                            let values = {}
                            for (const input of inputs) {
                                Object.assign(values,{[input.name]:input.getAttribute('data-id') })
                            } 
                            Object.assign(values,{token: getdata('token')})
                            postschema.body = JSON.stringify(values)
                            let results = await request('add-hospi-assu',postschema)
                            alertMessage(results.message)
                            button.removeAttribute('disabled')
                            button.innerHTML= 'proceed'
                            deletechild(d,d.parentElement)

                        }
                    }
                }
                t.classList.add('loaded')
            }else if (x == 'equipments-inventory') {
                let table = $('.datatables-equipments');
                let t = page.querySelector('table')
                if (!t.classList.contains('loaded')) {
                    e = table.DataTable({
                        // Define the structure of the table
                        dom: '<"row mx-2"<"col-md-2 p-10p"<"me-3"l>><"col-md-10 p-10p"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                        columns: [
                            { data: "",title: "" }, // Responsive Control column
                            { data: "name", title: "Name" },
                            { data: "quantity", title: "equipment's quantity" },
                            { data: "unit", title: "measuring unit" },

                            { title: "Action", data: 'id'}
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
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="equipments" data-role="edit" data-id="${e}" data-bs-target = "#edit-equipment"><i class="bx bx-edit"></i></button>
                                        <button class="btn btn-sm btn-icon data-buttns" data-type="equipments" data-role="delete" data-id="${e}"><i class="bx bx-trash"></i></button>
                                    </div>`
                                    );
                                },
                            },
                        ],
                        order: [[1, "asc"]], // Initial sorting
            
                        // Provide the data from the imported inventory
                        data: extra.equipments,
            
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
                            {
                                text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New</span>',
                                className: "add-new btn btn-primary",
                                attr: { "id": "add-equipment", "data-bs-target": "#add-equipment-modal" },
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
                let addEqu = page.querySelector('#add-equipment'),buttons = Array.from(page.querySelectorAll('button.data-buttns'));
                checkButtons()
                let tabl = page.querySelector('.dataTables_paginate');
                tabl.addEventListener('click', e=>{
                    setTimeout(checkButtons,10)
                })
                if (e) {     
                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                        setTimeout(checkButtons,10)
                        if (settings.nTable.classList.contains('datatables-equipments')) {
                            fileredData = e.rows({ search: 'applied'}).data().toArray();
                        }      
                        return true
                    })
                }
            
                function checkButtons() {
                    buttons = Array.from(page.querySelectorAll('button.data-buttns'))
                    buttons.forEach(bttn=>{
                        bttn.onclick = async function (event) {
                            event.preventDefault()
                            let role = this.getAttribute('data-role'),objId = this.getAttribute('data-id'),type = this.getAttribute('data-type')
                            if (role == 'delete') {
                                postschema.body = JSON.stringify({
                                    token: getdata('token'),
                                    type: type,
                                    inventory: extra.id,
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
                                let targetMed = extra.equipments.find(function (medic) {
                                    return medic.id == objId
                                })
                                let target = this.getAttribute('data-bs-target')
                                let cloneD = page.querySelector(`div${target}`)
                                cloneD = cloneD.cloneNode(true);
                                d = addshade();
                                d.appendChild(cloneD);
                                let eMform = cloneD.querySelector("form#edit-equipment-form");
                                let input = eMform.querySelector('input[name="equipment"]');
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
                                        Object.assign(values,{needle : input.getAttribute('data-id'),upinfo: {quantity :quantity.value}, type,inventory: extra.id})
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
                }
                
                addEqu.onclick =  function(){
                    let target = this.getAttribute('data-bs-target')
                    let cloneD = page.querySelector(`div${target}`)
                    cloneD = cloneD.cloneNode(true);
                    d = addshade();
                    d.appendChild(cloneD);
                    let aMform = cloneD.querySelector("form#add-equipment-form");
                    let inputs = Array.from(aMform.querySelectorAll('input'))
                    inputs[0].onfocus = (event)=>{
                        event.preventDefault()
                            showRecs(inputs[0],equipments.message,inputs[0].id)
                    }
                    aMform.onsubmit =  async event=>{

                       event.preventDefault();
                        l = 1
                        for (const input of inputs) {
                            v = checkEmpty(input);
                            if (!v) {
                                l = 0
                            }
                        }
                        if (l) {
                        let button = aMform.querySelector('button[type="submit"]')
                        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                        button.setAttribute('disabled',true)
                            let values = {}
                            for (const input of inputs) {
                                Object.assign(values,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','name','quantity','unit']) })
                            } 
                            Object.assign(values,{assurance: this.assurance,token: getdata('token'), assurance: extra.id})
                            postschema.body = JSON.stringify(values)
                            let results = await request('add-inventory-equipments',postschema)
                            if (results.success) {
                                values.equipments.forEach(equipment=>{
                                   e.row.add(equipment).draw()
                               })
                                deletechild(d,d.parentElement)
                            }
                            alertMessage(results.message)
                            button.removeAttribute('disabled')
                            button.innerHTML= 'proceed'

                        }
                    }
                }
                t.classList.add('loaded')

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
                            { data: "payment_info.a_amount", title: "amount (RWF)" },
                            { data: "payment_info.status", title: "status" },
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
                                        `<span class="btn btn-sm ${(e == 'pending') ? 'bc-gray dgray' : 'bc-tr-green green'}">${e}</span>`
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
                            showSession(this.getAttribute('data-id'))
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
                    
            }
            
          } catch (error) {
            console.log(error)
          }
    }
})();

 

