import { alertMessage, getdata, getschema, postschema, request,initializeCleave, checkEmpty, showRecs, getchips } from "../../../utils/functions.controller.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
t = getdata('token');
if (!t) {
    alertMessage('an error occured on your browser try clearing cookies')
}
postschema.body = JSON.stringify({token : getdata('token')})
m = await request('get-tests',postschema)
try {
    
    f = document.querySelector('form#add-test-form')
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
         b.textContent = `Recording test info...`

         a = await request('addtest',postschema);
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
                                <button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#view-health-post" data-id="${a.id}"><i class="bx bx-show-alt"></i></button>
                                <button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#update-health-post" data-id="${a.id}"><i class="bx bx-edit"></i></button>
                                <button class="btn btn-sm btn-icon delete-health-post" data-id="${a.id}"><i class="bx bx-trash"></i></button>
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
                    attr: { "data-bs-toggle": "modal", "data-bs-target": "#add-test" },
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

    table.find("tbody").on("click", ".delete-health-post", function () {
        if (confirm("Are you sure you want to delete this health post?")) {
            e.row($(this).parents("tr")).remove().draw();
        }
    })
    $('#add-test').on('shown.bs.modal', function () {

    });
});