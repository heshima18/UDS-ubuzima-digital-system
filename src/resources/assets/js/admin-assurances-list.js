import { alertMessage, getdata, getschema, postschema, request,initializeCleave, checkEmpty, showRecs, getchips, fT, addshade, addLoadingTab, removeLoadingTab } from "../../../utils/functions.controller.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
u = getdata('token')
if(!u){
    window.location.href = '../../login'
}
m = await request('get-assurances',getschema)
postschema.body = JSON.stringify({token : getdata('token')})
try {
    f = document.querySelector('form#add-assurance-form')
    i = Array.from(f.querySelectorAll('.form-control'))
    b = f.querySelector('button[type="submit"]')
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
            if (!input.classList.contains('bevalue')) {
                Object.assign(x,{[input.name]: input.value})
            }else{
                Object.assign(x,{[input.name]: input.getAttribute('data-id')})
            }
         }
         Object.assign(x,{token: getdata('token')})
         postschema.body = JSON.stringify(x)
         b.setAttribute('disabled', true)
         b.textContent = `Recording assurance info...`

         a = await request('add-assurance',postschema);
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

$(document).ready(function () {
    if (!m.success)  { return alertMessage(m.message)}
    m = m.message
    const raw_table = document.querySelector('.datatables-health-posts')
    var table = $('.datatables-health-posts'),
        e = table.DataTable({
            // Define the structure of the table
            dom: '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
            columns: [
                { data: "" }, // Responsive Control column
                { data: "name", title: "name" },
                { data: "managers", title: "managers" },
                { data: "", title: "Action", }
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
                            `<span class='d-block fw-semibold capitalize'>${e.length}</span>`
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
                                <button class="btn btn-sm btn-icon" data-role="button"  data-id="${a.id}" id="view"><i class="bx bx-show-alt"></i></button>
                                <button class="btn btn-sm btn-icon" data-role="button" data-id="${a.id}" id="delete"><i class="bx bx-trash"></i></button>
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
                    attr: { "data-bs-toggle": "modal", "data-bs-target": "#add-assurance" },
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
            }
        });

    table.find("tbody").on("click", ".delete-health-post", function () {
        if (confirm("Are you sure you want to delete this health post?")) {
            e.row($(this).parents("tr")).remove().draw();
        }
    })
    let buttons = Array.from(raw_table.querySelectorAll('[data-role="button"]'))
    for (const button of buttons) {
        button.addEventListener('click', function(e){
            e.preventDefault();
            let assurance = this.getAttribute('data-id')
            showAssurance(assurance)
        })
    }
    $('#add-assurance').on('shown.bs.modal', function () {
        
    });
});
async function showAssurance(assurance) {
    let bgDiv = addshade();
    let cont = document.createElement('div')
    bgDiv.appendChild(cont)
    cont.className = `br-10p cntr card p-10p bsbb w-60 h-80 b-mgc-resp`
    cont.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
                        <div class="head w-100 px-5p py-10p bsbb">
                            <span class="capitalize bold-2 fs-20p">Assurance <span class="consolas" data-holder="true" data-hold="name"># ${assurance}</span></span>
                        </div>
                        <div class="p-5p bsbb w-100 h-91 ovh p-r">
                            <div class="w-100 h-100 ovys scroll-2 body">
                                <div class="testinfo my-5p">
                                    <div class="flex jc-sb my-20p bsbb">
                                        <span class="title bold-2 fs-16p capitalize center">managers</span>
                                        <div class="p-10p my-5p mx-4p bsbb flex jc-sb">
                                            <span class="btn-primary btn capitalize data-buttons btn-sm" data-role="add-manager" id="add-manager">add manager</span>
                                        </div>
                                    </div>
                                    <div class="my-2p px-1p">
                                        <ul class="card  ls-none my-10p iblock p-20p mx-5p my-5p bfull-resp bm-y-10p-resp bm-x-0-resp bblock-resp w-200p bfull-resp" name="looping-info" data-hold="managers">
                                            <div class="x">
                                                <h5 class="card-title">[manager's-name]</h5>
                                                <p class="card-text">manager's-title</p>
                                                <p class="card-text"><small class="btn btn-sm btn-label-danger data-buttons" data-role="remove-manager" id="remove-manager">remove</small></p>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                                <div class="testinfo my-5p">
                                    <div class="flex jc-sb my-20p bsbb">
                                        <span class="title bold-2 fs-16p capitalize center">restricted medications</span>
                                        <div class="p-10p my-5p mx-4p bsbb flex jc-sb">
                                            <span class="btn-primary btn capitalize data-buttons btn-sm" data-role="add-medication">add a medication</span>
                                        </div>
                                    </div>
                                    <div class="my-2p px-1p">
                                        <ul class="card  ls-none my-10p iblock p-20p mx-5p my-5p bfull-resp bm-y-10p-resp bm-x-0-resp bblock-resp w-200p bfull-resp" name="looping-info" data-hold="tests">
                                            <li class="p-2p bsbb flex">
                                                <span class="bold-2 dgray card-title" name="looping-info-hol" data-hold="name" data-secondary-holder="true">[medication's-name]</span>
                                            </li>
                                            <li class="p-2p bsbb ">
                                                <span class="pname dgray fs-14p pr-5p">price : </span>
                                                <span class="flex jc-sb">
                                                    <span class="pdob black fs-14p" name="looping-info-hol" data-hold="price" data-secondary-holder="true">[medication's-price]</span>
                                                    <span class="pname dgray fs-14p px-3p">RWF</span>
                                                </span>
                                                <p class="mt-10p"><small class="btn btn-sm btn-label-danger data-buttons" data-role="remove-medication" id="remove-medication">remove</small></p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="testinfo my-5p">
                                    <div class="flex jc-sb my-20p bsbb">
                                        <span class="title bold-2 fs-16p capitalize center">restricted tests</span>
                                        <div class="p-10p my-5p mx-4p bsbb flex jc-sb">
                                            <span class="btn-primary btn capitalize data-buttons btn-sm" data-role="add-test">add a test</span>
                                        </div>
                                    </div>
                                    <div class="my-2p px-1p">
                                        <ul class="card  ls-none my-10p iblock p-20p mx-5p my-5p bfull-resp bm-y-10p-resp bm-x-0-resp bblock-resp w-200p bfull-resp" name="looping-info" data-hold="tests">
                                            <li class="p-2p bsbb flex">
                                                <span class="bold-2 dgray card-title" name="looping-info-hol" data-hold="name" data-secondary-holder="true">[tet's-name]</span>
                                            </li>
                                            <li class="p-2p bsbb jc-sb">
                                                <span class="pname dgray fs-14p pr-5p">price : </span>
                                                <span class="jc-sb flex">
                                                    <span class="pdob black fs-14p" name="looping-info-hol" data-hold="price" data-secondary-holder="true">[test's-price]</span>
                                                    <span class="pname dgray fs-14p px-3p">RWF</span>
                                                </span>
                                                <p class="mt-10p"><small class="btn btn-sm btn-label-danger data-buttons" data-role="remove-test" id="remove-test">remove</small></p>
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
    assurance = await request(`assurance/${assurance}`,postschema)
    if (!assurance.success) {
        return alertMessage(assurance.message)
    }
    assurance = assurance.message
    removeLoadingTab(body)
    let buttons = Array.from(cont.querySelectorAll('.data-buttons'));
    buttons.forEach( async button=>{
        button.addEventListener('click', function (e){
            e.preventDefault();
            if (button.classList.contains('loading')) {
                return 0
            }
            let role = button.getAttribute('data-role')
            let Magic = new magic();
            switch (role) {
                case 'add-manager':
                    Magic.addManager(this.getAttribute('data-id'))
                    break;
                case 'add-medication':
                    Magic.addMedication(this.getAttribute('data-id'))
                    break;
                case 'add-test':
                    Magic.addTest(this.getAttribute('data-id'))
                    break;
                case 'remove-manager':
                    Magic.removeManager(this.getAttribute('data-id'))
                    break;
                case 'remove-medicine':
                    Magic.removeMedicine(this.getAttribute('data-id'))

                break;
                case 'remove-test':
                    Magic.removeTest(this.getAttribute('data-id'))
                break;
                default:
                    break;
            }
            console.log(role)
        })
    })
    let dataHolders = Array.from(cont.querySelectorAll('[data-holder="true"]'))
    dataHolders.forEach( dataHolder =>{
        let dataToHold = dataHolder.getAttribute('data-hold')
        if (dataToHold.indexOf('time') != -1 || dataToHold.indexOf('date') != -1 ) {
            dataHolder.innerText = fT(assurance[dataToHold])
        }else{
            dataHolder.innerText = assurance[dataToHold]
        }
    })
    
}

class magic{
    constructor(sessionData,users){
        
    }
    async addManager(){
        let sbigdiv = addshade();
        let scont = document.createElement('div');
        scont.className = `br-10p cntr card p-10p bsbb w-60 h-80 b-mgc-resp`
        sbigdiv.appendChild(scont)
        scont.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        scont.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add an operation to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">Manager's name</label>
                                    <input type="text" class="form-control bevalue" id="manager" placeholder="Manager" name="manager">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="px-10p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let assuranceManagers = await request('get-employees-by-role/assurance_manager',postschema)
        if (!assuranceManagers.success) {
            return alertMessage(assuranceManagers.message)
        }
        assuranceManagers = assuranceManagers.message
        let form = scont.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))

        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,assuranceManagers,extra_input.id)
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
    addMedication(){

    }
    addTest(){

    }
    removeManager(){

    }
    removeMedicine(){

    }
    removeTest(){
        
    }
}
