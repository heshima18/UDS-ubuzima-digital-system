// Import the Employees from 'constants.js'
import { Employees } from './constants.js';
import { alertMessage, getdata, getschema, postschema, request, initializeCleave } from "../../../utils/functions.controller.js";



// Wait for the document to be ready
$(document).ready(async function () {
    let t, a, n, u, z, v, d;
    u = getdata('token')
    postschema.body = JSON.stringify({
        token: u
    })
    v = await request('get-employees',postschema)
    if (!v.success) return alertMessage(v.message)
    for (const employee of v.message) {
        Object.assign( v.message[v.message.indexOf(employee)],{image: ""})
        // if (employee.status == 'active') {
        //     v.message[v.message.indexOf(employee)].status = 2
            
        // }else if (employee.status == 'Unverified') {
        //     v.message[v.message.indexOf(employee)].status = 1            
        // }
    }
    console.log(v.message,Employees)
    // Initialize DataTable
    var table = $('.datatables-employees'),
        e = table.DataTable({
            // Define the structure of the table
            dom: '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
            columns: [
                { data: "" }, // Responsive Control column
                { data: "names", title: "Names" },
                { data: "nid", title: "NID" },
                { data: "position", title: "Position" },
                { data: "hp", title: "Health Post" },
                { data: "department", title: "Department" },
                { data: "status", title: "Status" },
                { data: "action", title: "Action", }
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
                            <button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#view-employee"><i class="bx bx-show-alt"></i></button>
                            <button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#update-employee"><i class="bx bx-edit"></i></button>
                            <button class="btn btn-sm btn-icon delete-employee"><i class="bx bx-trash"></i></button>
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
                    attr: { "data-bs-toggle": "modal", "data-bs-target": "#add-employee" },
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
            }
        });
    // Delete employee when delete icon clicked
    table.find("tbody").on("click", ".delete-employee", function () {
        if (confirm("Are you sure you want to delete this employee?")) {
            console.log(e.row($(this)))
            e.row($(this).parents("tr")).remove().draw();
        }
    }), setTimeout(() => {
        $(".dataTables_filter .form-control").removeClass("form-control-sm");
        $(".dataTables_length .form-select").removeClass("form-select-sm");
    }, 0), $('#update-employee, #add-employee').on('shown.bs.modal', function () {
        const $modal = $(this);
        initializeCleave(
            $modal.find('.phone-number-mask'),
            $modal.find('.national-id-no-musk')
        );
    });
});