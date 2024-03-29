// Import the Employees from 'constants.js'
import { alertMessage, getdata, getschema, postschema, request, initializeCleave,checkEmpty,showRecs, addshade, getLocs, deletechild, viewEmployeeProfile } from "../../../utils/functions.controller.js";



// Wait for the document to be ready
$(document).ready(async function () {
    let t, a, n, u, z, v, d, h, f, i, s, b, x, c, info,fileredData;
    u = getdata('token')
    if(!u){
        window.location.href = '../../login'
    }
    postschema.body = JSON.stringify({
        token: u
    })
    v = await request('get-employees',postschema)
    n = await request('get-departments',postschema)
    h =  await request('gethospitals',postschema)
    t = await request('get-titles',postschema)
    const map = await request('get-map',getschema)
    if (!v.success || !n.success || !h.success) return alertMessage(v.message)
    for (const employee of v.message) {
        Object.assign( v.message[v.message.indexOf(employee)],{image: ""})
        // if (employee.status == 'active') {
        //     v.message[v.message.indexOf(employee)].status = 2
            
        // }else if (employee.status == 'Unverified') {
        //     v.message[v.message.indexOf(employee)].status = 1            
        // }
    }
    // Initialize DataTable
    var table = $('.datatables-employees'),
        e = table.DataTable({
            // Define the structure of the table
            dom: '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
            columns: [
                { data: "" }, // Responsive Control column
                { data: "name", title: "Names" },
                { data: "nid", title: "NID" },
                { data: "position", title: "Position" },
                { data: "hp", title: "Health Post" },
                { data: "department", title: "Department" },
                { data: "status", title: "Status" },
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
                    targets: -1,
                    searchable: !1,
                    orderable: !1,
                    render: function (e, t, a, n) {
                        return (
                            `<div class="d-inline-block text-nowrap">
                            <button class="btn btn-sm btn-icon border border-3" name="view" data-role="view-button" data-id="${e}"><i class="bx bx-show-alt"></i></button>
                        </div>`
                        );
                    },
                },
            ],
            order: [[1, "asc"]], // Initial sorting

            // Provide the data from the imported Employees
            data: v.message,

            // Define buttons for exporting and adding new employees
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
                    attr: { "id": "showAddEForm" },
                },
            ],

            // Make the table responsive with additional details
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (e) {
                            return "Details of " + e.data().names;
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
                // Filter by Position
                this.api().columns(3).every(function () {
                    var t = this,
                        a = $('<select class="form-select text-capitalize"><option value=""> Select Position </option></select>')
                            .appendTo(".employee-position")
                            .on("change", function () {
                                var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                            });
                    t.data().unique().sort().each(function (e, t) {
                        a.append('<option value="' + e + '">' + e + "</option>");
                    });
                });

                // Filter by Health Post
                this.api().columns(4).every(function () {
                    var t = this,
                        a = $('<select class="form-select text-capitalize"><option value=""> Select Health Post </option></select>')
                            .appendTo(".employee-hp")
                            .on("change", function () {
                                var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                            });
                    t.data().unique().sort().each(function (e, t) {
                        a.append('<option value="' + e + '">' + e + "</option>");
                    });
                });

                // Filter by Department
                this.api().columns(5).every(function () {
                    var t = this,
                        a = $(`<select class="form-select text-capitalize"><option value=""> Select Department </option></select>`)
                            .appendTo(".employee-department").on("change", function () {
                                var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                            });
                    t.data().unique().sort().each(function (e, t) {
                        a.append('<option value="' + e.toLowerCase() + '" class="text-capitalize">' + e + "</option>");
                    });
                });
                 // Filter by Department
                 this.api().columns(6).every(function () {
                    var t = this,
                        a = $(`<select class="form-select text-capitalize"><option value=""> Select Status </option></select>`)
                            .appendTo(".employee-status").on("change", function () {
                                var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                            });
                    t.data().unique().sort().each(function (e, t) {
                        a.append('<option value="' + e.toLowerCase() + '" class="text-capitalize">' + e + "</option>");
                    });
                });
            }
        });
        checkButtons()
        let tabl = document.querySelector('.dataTables_paginate');
        tabl.addEventListener('click', e=>{
            setTimeout(checkButtons,10)
        })
        if (e) {     
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                setTimeout(checkButtons,10)
                if (settings.nTable.classList.contains('datatables-employees')) {
                    fileredData = e.rows({ search: 'applied'}).data().toArray();
                }      
                return true
            })
        }
        function checkButtons() {
            let viewButtons = Array.from(document.querySelectorAll('[name="view"]'))
            viewButtons.forEach(function (button) {
                button.addEventListener('click', event =>{
                    if (button.classList.contains('loading')) {
                        return 0
                    }
                    event.preventDefault();
                    button.classList.add('loading')
                    let hospitalId = button.getAttribute('data-id');
                    viewEmployeeProfile(hospitalId)
                })
            })
        }
    async function getMOHSLimitInfo() {
        let div = addshade();
        a = document.createElement('div');
        div.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">Staff additional info</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-info-form" name="req-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for=" class="form-label">Limit</label>
                                    <input type="text" class="form-control bevalue" id="limit" placeholder="Demo Limit" name="limit">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="Location" class="form-label">Location</label>
                                    <input type="text" class="form-control bevalue" id="Location" placeholder="Demo Location" name="location">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp my-10p">
                                    <button type="submit" class="btn btn-primary bfull-resp mr-10p bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(a.querySelectorAll('input'))
        let limit = inputs.find(function (ins) {return ins.name == "limit" })
        let location = inputs.find(function (ins) {return ins.name == "location" })
        location.addEventListener('focus', (event)=>{
            showRecs(location,getLocs(map.message,limit.getAttribute('data-id')),location.id)
        })
        limit.addEventListener('focus', (event)=>{
            showRecs(limit,[{id: 'province', name:'province'},{id: 'district', name:'district'},{id: 'sector', name:'sector'}],limit.id)
        })
        form.addEventListener('submit', async event=>{
            event.preventDefault();
            let l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                }
                info = values
                deletechild(div,div.parentElement)
            }
        })
    }
    let showAddEFormButton = document.querySelector('#showAddEForm')
    showAddEFormButton.onclick = function (event) {
      event.preventDefault()
      showAddEForm()  
    } 
    function showAddEForm() {
        let addediv = document.querySelector('#add-employee')
        addediv = addediv.cloneNode(true)
        let div = addshade()
        div.appendChild(addediv)
        
        f = addediv.querySelector('form#add-employee-form')
        s = Array.from(f.querySelectorAll('select.address-field'));
        i = Array.from(f.querySelectorAll('.form-control'))
        z = Array.from(f.querySelectorAll('.form-select'))
        
        for (const sele of z) {
         i.push(sele)
        }
        b = f.querySelector('button[type="submit"]')
        for (const select of s) {
            select.addEventListener('change',e=>{
                e.preventDefault();
                if (select.name == 'province') {
                    for (const province of m.provinces) {
                        if (province.id == select.value) {
                            s[2].innerHTML =  '<option value="">Select Sector</option>'
                            s[3].innerHTML =  '<option value="">Select Cell</option>'
                            cdcts(province.districts,s[1],'District')
                        }else if(select.value == ''){
                            s[1].innerHTML =  '<option value="">Select District</option>'
                            s[2].innerHTML =  '<option value="">Select Sector</option>'
                            s[3].innerHTML =  '<option value="">Select Cell</option>'
                        }
                    }
                }
                if (select.name == 'district') {
                    for (const province of m.provinces) {
                        for (const district of province.districts) {
                            if (district.id == select.value) {
                                s[3].innerHTML =  '<option value="">Select Cell</option>'
                                cdcts(district.sectors,s[2],'Sector')
                            }else if(select.value == ''){
                                s[2].innerHTML =  '<option value="">Select Sector</option>'
                                s[3].innerHTML =  '<option value="">Select Cell</option>'
                            }
                        }
                    }
                }
                if (select.name == 'sector') {
                    for (const province of m.provinces) {
                        for (const district of province.districts) {
                            for (const sector of district.sectors) {
                                if (sector.id == select.value) {
                                    cdcts(sector.cells,s[3],'Cell')
                                }else if(select.value == ''){
                                    s[3].innerHTML =  '<option value="">Choose...</option>'
                                }
                            }
                        }
                    }
                }
            })
        }
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
                    if (!input.classList.contains('chips-check')) {
                        if (input.name == 'phone' || input.name == 'nid') {
                            Object.assign(x,{[input.name]:  input.value.replace(/ /g, "")})   
                        }else if (input.classList.contains('bevalue')) {
                            Object.assign(x,{[input.name]: input.getAttribute('data-id')})
                        }else{
                            Object.assign(x,{[input.name]: input.value})

                        }
                    }else{
                        c = getchips(input.parentNode.querySelector('div.chipsholder'));
                        Object.assign(x,{[input.name]: c})
                    }
                }
                Object.assign(x,{token: getdata('token'), extra: info})
                postschema.body = JSON.stringify(x)
                b.setAttribute('disabled', true)
                b.textContent = `Recording employee...`

                a = await request('addemployee',postschema);
                b.removeAttribute('disabled')
                b.textContent = `Submit`
                if (a.success) {
                    alertMessage(a.message)
                    f.reset()
                }else{
                    alertMessage(a.message)
                }
            }
        })
        let hospital = f.querySelector('input#hospital')
        let department = f.querySelector('input#department')
        let titles = t.message
        titles = titles.map(function (title) {
            return {id: title, name: title}
        }) 
        let title = i.find(function (inputs) {return inputs.name == 'title'});
        hospital.addEventListener('focus', function (e) {
            showRecs(this,h.message,'hospital')
        })
        title.addEventListener('focus', function (e) {
            showRecs(this,titles,'titles')
        })
        
        title.onblur = async function () {
            let titVal = this.getAttribute('data-id')
            if (titVal == 'Ministry of health staff') {
                info = await getMOHSLimitInfo()
            }
        }
        department.addEventListener('focus', function (e) {
            let departments = h.message.find(function (hospp) {
                return hospp.id == hospital.getAttribute('data-id')
            })
            if (departments) {
                departments = departments.departments
                showRecs(this,departments,'department')
            }else{
                showRecs(this,n.message,'department')
            }
        })
        initializeCleave(
            f.querySelector('.phone-number-mask'),
            f.querySelector('.national-id-no-musk')
        );
    }
});
