import { alertMessage, getdata, getschema, postschema, request,initializeCleave, checkEmpty, showRecs, getchips, addshade, addLoadingTab, removeLoadingTab, aDePh, deletechild } from "../../../utils/functions.controller.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
(async function (){u = getdata('token')
if(!u){
    window.location.href = '../../login'
}
m = await request('get-map',getschema)
postschema.body = JSON.stringify({token : getdata('token')})
h = await request('gethospitals',postschema)
d = await request('get-departments',postschema)
e = await request('get-employees',postschema)
let extra = {map: m.message, employees: e.message, hospitals : h.message, departments: d.message}
try {
    if (!m.success || !d.success) {return alertMessage(m.message)}
    [m] = m.message
    f = document.querySelector('form#add-health-post-form')
    s = Array.from(f.querySelectorAll('select.address-field'));
    i = Array.from(f.querySelectorAll('.form-control'))
    z = Array.from(f.querySelectorAll('.form-select'))
    for (const sele of z) {
       i.push(sele)
    }
    b = f.querySelector('button[type="submit"]')
    for (const province of m.provinces) {
        o = document.createElement('option');
        s[0].appendChild(o)
        o.innerText = province.name
        o.value = province.id
        o.setAttribute('data-id',province.id)
    }
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
} catch (error) {
  console.log(error)  
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
                if (input.name == 'phone') {
                    Object.assign(x,{[input.name]:  input.value.replace(/ /g, "")})   
                }else{
                    Object.assign(x,{[input.name]: input.value})

                }
            }else{
                c = getchips(input.parentNode.querySelector('div.chipsholder'));
                Object.assign(x,{[input.name]: c})
            }
         }
         Object.assign(x,{token: getdata('token')})
         postschema.body = JSON.stringify(x)
         b.setAttribute('disabled', true)
         b.textContent = `Recording health post info...`

         a = await request('addhealthpost',postschema);
         b.removeAttribute('disabled')
         b.textContent = `Submit`


         if (!a.success) {
            alertMessage(a.message)
         }
    }
})
function cdcts(entries,field,type) {
    field.innerHTML = `<option value="">Select ${type}</option>`
    for (const entry of entries) {
        o = document.createElement('option')
        o.innerText = entry.name
        o.value = entry.id
        o.setAttribute('data-id',entry.id)
        field.appendChild(o)    
    }
}

$(document).ready(function () {
    if (!h.success) {
        return alertMessage(h.message);
    }
    var table = $('.datatables-health-posts'),
        e = table.DataTable({
            // Define the structure of the table
            dom: '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
            columns: [
                { data: "" }, // Responsive Control column
                { data: "name", title: "Health post name" },
                { data: "type", title: "Type" },
                { data: "location.province", title: "province" },
                { data: "location.district", title: "district" },
                { data: "location.sector", title: "sector" },
                { data: "location.cell", title: "cell" },
                { data: "Employees", title: "Employees" },
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
                            `<span class='d-block fw-semibold'>${e}</span>`
                        );
                    },
                },
                {
                    targets: 3,
                    searchable: 1,
                    orderable: 1,
                    render: function (e, t, a, n) {
                        return (
                            `<span class='d-block fw-semibold'>${e}</span>`
                        );
                    },
                },
                {
                    targets: 4,
                    searchable: 1,
                    orderable: 1,
                    render: function (e, t, a, n) {
                        return (
                            `<span class="capitalize"> ${e}</span>`
                        );
                    },
                },
                {
                    targets: 5,
                    searchable: 1,
                    orderable: 1,
                    render: function (e, t, a, n) {
                        return (
                            `<span class="capitalize"> ${e}</span>`
                        );
                    },
                },
                {
                    targets: 6,
                    searchable: 1,
                    orderable: 1,
                    render: function (e, t, a, n) {
                        return (
                            `<span class="capitalize"> ${e}</span>`
                        );
                    },
                },
                {
                    targets: 7,
                    searchable: !1,
                    orderable: 1,
                    render: function (e, t, a, n) {
                        return (
                            `<span class="capitalize">${a.employees.length}</span>`
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
                                <button class="btn btn-sm btn-icon border-3 border" data-id="${e}" name="view"><i class="bx bx-show-alt"></i></button>
                            </div>`
                        );
                    },
                },
            ],
            order: [[1, "asc"]], // Initial sorting

            // Provide the data from the imported Health Posts
            data: h.message,

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
                    attr: { "data-bs-toggle": "modal", "data-bs-target": "#add-health-post" },
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
                // Filter by Position
                this.api().columns(2).every(function () {
                    var t = this,
                        a = $('<select class="form-select text-capitalize"><option value=""> Select Type </option></select>')
                            .appendTo(".health-post-type")
                            .on("change", function () {
                                var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                            });
                    t.data().unique().sort().each(function (e, t) {
                    a.append('<option value="' + e + '">' + e + "</option>");
                    });
                });
                this.api().columns(3).every(function () {
                    var t = this,
                        a = $('<select class="form-select text-capitalize"><option value=""> Select Province </option></select>')
                            .appendTo(".health-post-province")
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
                        a = $('<select class="form-select text-capitalize"><option value=""> Select District </option></select>')
                            .appendTo(".health-post-district")
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
                        a = $('<select class="form-select text-capitalize"><option value=""> Select Sector </option></select>')
                            .appendTo(".health-post-sector")
                            .on("change", function () {
                                var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                            });
                    t.data().unique().sort().each(function (e, t) {
                    a.append('<option value="' + e + '">' + e + "</option>");
                    });
                });
                this.api().columns(6).every(function () {
                    var t = this,
                        a = $('<select class="form-select text-capitalize"><option value=""> Select Cell </option></select>')
                            .appendTo(".health-post-cell")
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
        let viewButtons = Array.from(document.querySelectorAll('[name="view"]'))
        viewButtons.forEach(function (button) {
            button.addEventListener('click', event =>{
                if (button.classList.contains('loading')) {
                    return 0
                }
                event.preventDefault();
                button.classList.add('loading')
                let hospitalId = button.getAttribute('data-id');
                showHospital(hospitalId,button)
            })
        })
    $('#add-health-post').on('shown.bs.modal', function () {
        const $modal = $(this);
        let departments = f.querySelector('input#departments')
        departments.addEventListener('focus', function (e) {
            showRecs(this,d.message,'departments')
        })
        
        initializeCleave(
            $modal.find('.phone-number-mask'),
            null
        );
    });
});
async function showHospital(hospital,button) {
    let bgDiv = addshade();
        let cont = document.createElement('div')
        bgDiv.appendChild(cont)
        cont.className = `br-10p cntr card p-20p bsbb w-90 h-90 b-mgc-resp`
        cont.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
                            <div class="p-5p bsbb w-100 h-91 ovh p-r">
                            <div class="head w-100 px-5p py-10p bsbb">
                                <span class="capitalize bold-2"><span class="fs-25p" name="info-hol" data-hold="name">${hospital}</span></span>
                            </div>
                                <div class="w-100 h-100 ovys scroll-2 body">
                                    <div class="head w-100 px-5p py-10p bsbb">
                                        <span class="location dgray bold-2 capitalize">Location:</span>
                                        <div class="flex">
                                            <span class="capitalize px-5p" name="info-hol" data-hold="location.province"></span>,
                                            <span class="capitalize px-5p" name="info-hol" data-hold="location.district"></span>,
                                            <span class="capitalize px-5p" name="info-hol" data-hold="location.sector"></span>,
                                            <span class="capitalize px-5p" name="info-hol" data-hold="location.cell"></span>
                                        </div>
                                        <span class="type dgray bold-2 capitalize">type:</span>
                                        <div class="flex">
                                            <span class="capitalize px-5p" name="info-hol" data-hold="type"></span>
                                        </div>
                                    </div>
                                    <div class="departmentinfo my-5p">
                                        <div class="flex jc-sb my-20p bsbb">
                                            <span class="title bold-2 fs-16p capitalize center">employees</span>
                                            <div class="p-10p my-5p mx-4p bsbb flex jc-sb">
                                                <span class="btn-primary btn capitalize data-buttons btn-sm" data-role="add-employee" id="add-employee">add employee</span>
                                            </div>
                                        </div>
                                        <div class="my-2p px-1p">
                                            <ul class="card  ls-none my-10p iblock p-20p mx-5p my-5p bfull-resp bm-y-10p-resp bm-x-0-resp bblock-resp w-200p bfull-resp" name="looping-info" data-hold="employees">
                                                <div class="x">
                                                    <h5 class="card-title capitalize" name="looping-info-hol" data-hold="name" data-secondary-holder="true">[employee's-name]</h5>
                                                    <p class="card-text" name="looping-info-hol" data-hold="title" data-secondary-holder="true">employee's-title</p>
                                                    <p class="card-text"><small class="btn btn-sm btn-label-danger data-buttons" data-role="remove-employee" id="remove-employee">remove</small></p>
                                                </div>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="departmentinfo my-5p">
                                        <div class="flex jc-sb my-20p bsbb">
                                            <span class="title bold-2 fs-16p capitalize center">Departments</span>
                                            <div class="p-10p my-5p mx-4p bsbb flex jc-sb">
                                                <span class="btn-primary btn capitalize data-buttons btn-sm" data-role="add-department">add a department</span>
                                            </div>
                                        </div>
                                        <div class="my-2p px-1p">
                                            <ul class="card  ls-none my-10p iblock p-20p mx-5p my-5p bfull-resp bm-y-10p-resp bm-x-0-resp bblock-resp w-200p bfull-resp" name="looping-info" data-hold="departments">
                                                <li class="p-2p bsbb flex">
                                                    <span class="bold-2 dgray card-title" name="looping-info-hol" data-hold="name" data-secondary-holder="true">[department's-name]</span>
                                                </li>
                                                <li class="p-2p bsbb ">
                                                    <p class="mt-10p"><small class="btn btn-sm btn-label-danger data-buttons" data-role="remove-department" id="remove-department">remove</small></p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
        let body = cont.querySelector('div.body')
        addLoadingTab(body)
        
        postschema.body = JSON.stringify({
            token : getdata('token'),
        })
        hospital = await request(`hospital/${hospital}`,postschema)
        button.classList.remove('loading')
        if (!hospital.success) {
            return alertMessage(hospital.message)
        }
        hospital = hospital.message
        removeLoadingTab(body)
        const dataHolders = Array.from(cont.querySelectorAll('span[name="info-hol"]'))
        for (const holder of dataHolders) {
            let objectId = holder.getAttribute('data-hold')
            if (objectId.indexOf('.') != -1) {
                objectId = objectId.split('.')
                holder.innerText = hospital[objectId[0]][objectId[1]]
            }else{
                if (holder.getAttribute('data-hold').indexOf('status') != -1) {
                    if (hospital[holder.getAttribute('data-hold')] == "open") {
                        holder.classList.replace('btn-label-secondary','btn-label-success')
                    }
                }
                holder.innerText = hospital[objectId]
            }
        }
        const loopingDataHolders = Array.from(document.querySelectorAll('ul[name="looping-info"]'))
        for (const element of loopingDataHolders) {
            let dataToHold = element.getAttribute('data-hold');
            let dataToShow = hospital[dataToHold]
            if(!dataToShow) continue
            if (!dataToShow.length) {
                aDePh(element.parentElement)
                element.parentNode.removeChild(element)
                continue
            }
            for (const data of dataToShow) {
                let clonedNode = element.cloneNode(true);
                let cloneButton = clonedNode.querySelector('.data-buttons')
                if(cloneButton) cloneButton.setAttribute('data-id', data.id);
                let dataHolders = Array.from(clonedNode.querySelectorAll('[name="looping-info-hol"]'))
                for (const dataHolder of dataHolders) {
                    dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]
                }
               element.parentNode.appendChild(clonedNode)
            }
            element.parentNode.removeChild(element)
    
        }
        let buttons = Array.from(cont.querySelectorAll('.data-buttons'));
        buttons.forEach( async button=>{
            button.addEventListener('click', function (e){
                e.preventDefault();
                if (button.classList.contains('loading')) {
                    return 0
                }
                let role = button.getAttribute('data-role')
                let Magic = new magic(hospital.id);
                switch (role) {
                    case 'add-employee':
                        Magic.addemployee(extra.employees)
                        break;
                    case 'add-department':
                        Magic.adddepartment(extra.departments)
                        break;
                    case 'remove-employee':
                        Magic.removeemployee(this)
                        break;
                    case 'remove-medication':
                        Magic.removeMedicine(this)
                    break;
                    case 'remove-department':
                        Magic.removedepartment(this)
                    break;
                    default:
                    break;
                }
            })
        })
}
})()

class magic{
    constructor(hospital){
        this.hospital = hospital
    }
    async addemployee(data){
        let sbigdiv = addshade();
        let scont = document.createElement('div');
        scont.className = `br-10p cntr card p-10p bsbb w-60 h-80 b-mgc-resp`
        sbigdiv.appendChild(scont)
        scont.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        scont.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add an employee to a health facility</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-department-info-form" name="req-department-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="department" class="form-label">employee's name</label>
                                    <input type="text" class="form-control bevalue" id="employee" placeholder="employee" name="employee">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = scont.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))

        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
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
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                Object.assign(values,{token: getdata('token'), hospital: this.hospital})
                delete values.quantity
                postschema.body = JSON.stringify(values)
                let results = await request('add-employee-to-hp',postschema)
                if (results.success) {
                    deletechild(sbigdiv,sbigdiv.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    adddepartment(data){
        let departmentsP = addshade();
        a = document.createElement('div');
        departmentsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add a department to restricted list</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="add-department-form" name="add-department-form">
                                <div class="col-md-12 p-10p bsbb mb-5p p-r">
                                    <label for="departments" class="form-label">departments</label>
                                    <input type="text" class="form-control extras bevalue no-extra-info-addin" id="department" placeholder="department Name" name="department">
                                    <small class="hidden w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 px-10p bsbb bblock-resp my-15p">
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
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                Object.assign(values,{hospital: this.hospital,token: getdata('token')})
                postschema.body = JSON.stringify(values)
                let results = await request('add-department-to-hp',postschema)
                if (results.success) {
                    deletechild(departmentsP,departmentsP.parentElement)
                }
                alertMessage(results.message)
                button.removeAttribute('disabled')
                button.innerHTML= 'proceed'

            }
        })
    }
    async removeemployee(button){
        button.classList.add('loading')
        button.setAttribute('disabled', true)
        button.innerText = `removing...`
        postschema.body = JSON.stringify({
            token: getdata('token'),
            type: 'employees',
            hospital: this.hospital,
            employee: button.getAttribute('data-id')
        })
        let result = await request('remove-employee-from-hp',postschema)
        button.classList.remove('loading')
        button.removeAttribute('disabled')
        if (result.success) {
            alertMessage(result.message)
            deletechild(button.parentElement.parentElement.parentElement,button.parentElement.parentElement.parentElement.parentElement)
        }else{
            alertMessage(result.message)
        }

    }
    async removedepartment(button){
        button.classList.add('loading')
        button.setAttribute('disabled', true)
        button.innerText = `removing...`
        postschema.body = JSON.stringify({
            token: getdata('token'),
            type: 'departments',
            hospital: this.hospital,
            department: button.getAttribute('data-id')
        })
        let result = await request('remove-department-from-hp',postschema)
        button.classList.remove('loading')
        button.removeAttribute('disabled')
        if (result.success) {
            alertMessage(result.message)
            deletechild(button.parentElement.parentElement.parentElement,button.parentElement.parentElement.parentElement.parentElement)
        }else{
            alertMessage(result.message)
        }
    }
}
