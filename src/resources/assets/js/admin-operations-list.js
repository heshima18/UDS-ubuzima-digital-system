import { alertMessage, getdata, getschema, postschema, request,initializeCleave, checkEmpty, showRecs, getchips, adcm, promptCFQPopup, addshade, addChip } from "../../../utils/functions.controller.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
u = getdata('token')
if(!u){
    window.location.href = '../../login'
}
postschema.body = JSON.stringify({token : u})
d = await request('get-departments',postschema),
(async function () {
    m = await request('get-operations',postschema)
    try {
        
        f = document.querySelector('form#add-operation-form')
        i = Array.from(f.querySelectorAll('.form-control'))
        b = f.querySelector('button[type="submit"]')
        j = f.querySelector('input#department')
        j.addEventListener('focus', function () {
            showRecs(j,d.message,'department')
        })
        f.addEventListener('submit', async e =>{
            e.preventDefault();
            v = 1
            for (const input of i) {
               n =  checkEmpty(input);
                if (!n) {
                   v = 0 
                }
            }
            if(v){
                x = {}
                for (const input of i) {
                    if (!input.classList.contains('bevalue')) {
                        Object.assign(x,{[input.name]: input.value})
                    }else{
                        Object.assign(x,{[input.name]: input.getAttribute('data-id')})
                    }
                 }
                 Object.assign(x,{token: getdata('token')})
                 postschema.body = JSON.stringify(x)
                 b.setAttribute('disabled', true)
                 b.textContent = `Recording operation info...`
        
                 a = await request('add-operation',postschema);
                 b.removeAttribute('disabled')
                 b.textContent = `Submit`
                 if (!a.success) {
                    alertMessage(a.message)
                 }else{
                    alertMessage(a.message)
                    f.reset();
                 }
            }
        })
    } catch (error) {
      console.log(error)  
    }
    $(document).ready(function () {
        if (!m.success) {return alertMessage(m.message)}
        m = m.message
        var table = $('.datatables-health-posts'),
            e = table.DataTable({
                
                // Define the structure of the table
                dom: '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
                columns: [
                    { data: "" }, // Responsive Control column
                    { data: "name", title: "name" },
                    { data: "price", title: "price" },
                    { data: "department_name", title: "department" },
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
                        searchable: 1,
                        orderable: 1,
                        render: function (e, t, a, n) {
                            return (
                                `<span class='d-block fw-semibold capitalize'>${e}</span>`
                            );
                        },
                    },
                    {
                        targets: 2,
                        searchable: 1,
                        orderable: 1,
                        render: function (e, t, a, n) {
                            return (
                                `<span class='d-block fw-semibold capitalize'>${adcm(e)}</span>`
                            );
                        },
                    },
                    {
                        targets: 3,
                        searchable: 1,
                        orderable: 1,
                        render: function (e, t, a, n) {
                            return (
                                `<span class='d-block fw-semibold capitalize'>${e}</span>`
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
                                    <button class="btn btn-sm btn-icon border border-3 edit-operation "data-id="${a.id}"><i class="bx bx-show-alt"></i></button>
                                   
                                </div>`
                            );
                        },
                    },
                ],
                order: [[1, "asc"]], // Initial sorting
    
                // Provide the data from the imported Health Posts
                data: m,
    
                // Define buttons for exporting and adding new  Health Posts
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
                        attr: {"id": "add-operation-button" },
                    },
                ],
    
                // Make the table responsive with additional details
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.modal({
                            header: function (e) {
                                return "Details of " + e.data().name;
                            },
                        }),
                        type: "column",
                        renderer: function (e, t, a) {
                            a = $.map(a, function (e, t) {
                                return "" !== e.title ? '<tr data-dt-row="' + e.rowIndex + '" data-dt-column="' + e.columnIndex + '"><td>' + e.title + ":</td> <td>" + e.data + "</td></tr>" : "";
                            }).join("");
                            return !!a && $('<table class="table"/><tbody />').append(a);
                        },
                    },
                },
    
                // Initialize filters for position, health post, and status
                initComplete: function () {
                    // Filter by District
                    
                }
            });
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                setTimeout(checkButtons,10)
                return true
                })

                let viewbut = Array.from(document.querySelectorAll('button.edit-operation'))
                let tabl = document.querySelector('.dataTables_paginate');
                tabl.addEventListener('click', e=>{
                    setTimeout(checkButtons,10)
                })
                checkButtons();
                function checkButtons() {
                    viewbut = Array.from(document.querySelectorAll('button.edit-operation'))
                    viewbut.forEach(button => {
                        button.onclick = async function (event) {
                            event.preventDefault();
                            let opera = m.find(function (operation) {
                                return operation.id == button.getAttribute('data-id') 
                            })
                            showEditOperation(opera)
                        }
                    }); 
                }
            let aOB = document.querySelector('#add-operation-button')
            aOB.addEventListener('click', e=>{
                e.preventDefault();
                let opDiv = document.querySelector('div#add-operation'),shade = addshade()
                opDiv = opDiv.cloneNode(true)
                shade.appendChild(opDiv)
                try {
        
                    f = shade.querySelector('form#add-operation-form')
                    i = Array.from(f.querySelectorAll('.main-input'))
                    b = f.querySelector('button[type="submit"]')
                    c = f.querySelector('input#questions')
                    j = f.querySelector('input#department')
                    j.addEventListener('focus', function () {
                        showRecs(j,d.message,'department')
                    })
                    c.addEventListener('click', function () {
                        promptCFQPopup(c)
                    })
                    f.addEventListener('submit', async e =>{
                        e.preventDefault();
                        v = 1
                        for (const input of i) {
                           n =  checkEmpty(input);
                            if (!n) {
                               v = 0 
                            }
                        }
                        if(v){
                            x = {}
                            for (const input of i) {
                                if (input.classList.contains('chips-check')) {
                                    Object.assign(x,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['question','answer','required'])})
                                    
                                }else if (!input.classList.contains('bevalue')) {
                                    Object.assign(x,{[input.name]: input.value})
                                }else{
                                    Object.assign(x,{[input.name]: input.getAttribute('data-id')})
                                }
                             }
                             Object.assign(x,{token: getdata('token')})
                             postschema.body = JSON.stringify(x)
                             b.setAttribute('disabled', true)
                             b.textContent = `Recording operation info...`
                    
                             a = await request('add-operation',postschema);
                             b.removeAttribute('disabled')
                             b.textContent = `Submit`
                             if (!a.success) {
                                alertMessage(a.message)
                             }else{
                                alertMessage(a.message)
                                f.reset();
                             }
                        }
                    })
                } catch (error) {
                  console.log(error)  
                }
            })
    });
})()
function showEditOperation(info) {
    q = addshade();
    let div = document.createElement('div')
    div.className = `br-10p cntr card p-20p bsbb w-a h-a b-mgc-resp`
    q.appendChild(div)
    b = document.getElementById('edit-operation')
    b = b.cloneNode(true)
    b.classList.remove('hidden')
    let departments = d.message
    div.appendChild(b)
    let inputs = Array.from(b.querySelectorAll('input')),form = b.querySelector('form'),button = b.querySelector('button[type="submit"]')
    c = form.querySelector('input#questions')
    c.addEventListener('click', function () {
        promptCFQPopup(c)
    })
    let department = form.querySelector('input#department')
    department.addEventListener('focus', function (e) {
        showRecs(this,departments,'unit')
    })
    form.addEventListener('submit', async e =>{
        e.preventDefault();
        v = 1
        for (const input of inputs) {
           n =  checkEmpty(input);
            if (!n) {
               v = 0 
            }
        }
        if(v){
            x = {}
            for (const input of inputs) {
                if (input.classList.contains('chips-check')) {
                    Object.assign(x,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['question','answer','required'])})
                    
                }else if (!input.classList.contains('bevalue')) {
                    Object.assign(x,{[input.name]: input.value})
                }else{
                    Object.assign(x,{[input.name]: input.getAttribute('data-id')})
                }
             }
             Object.assign(x,{token: getdata('token'), id: info.id})
             postschema.body = JSON.stringify(x)
             button.setAttribute('disabled', true)
             button.textContent = `Updating opeation info...`
             a = await request('edit-operation',postschema);
             button.removeAttribute('disabled')
             button.textContent = `Submit`
             if (!a.success) {
                alertMessage(a.message)
             }else{
                alertMessage(a.message)
                form.reset();
             }
        }
    })
    for (const input of inputs) {
      if (input.name == 'questions') {
        let questions = info.questions
        let chipsHolder = input.parentElement.childNodes[7]
        if (!chipsHolder) {
          chipsHolder = document.createElement('div');
          chipsHolder.className = 'chipsholder p-5p bsbb w-100'
          chipsHolder.title = 'CF Questions'
          if (input.classList.contains('chips-check')) {
            input.parentElement.insertAdjacentElement('beforeEnd',chipsHolder)
          }
        }
        for (const question of questions) {
            Object.assign(question,{name: question.question})
            addChip(question,chipsHolder,['question','answer','required','name'])  
        }
        continue
      }
       if (input.classList.contains('bevalue')) {
        if (input.name == 'department') {
            input.value = info['department_name']
        }else if (input.name == 'type') {
            input.value = info[input.name]
        }
        input.setAttribute('data-id', info[input.name])
       }else{
        input.value = info[input.name]
       }
     }
    
}