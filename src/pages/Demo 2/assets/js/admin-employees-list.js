"use strict";
$(function () {
    let t, a, n;
    n = (isDarkStyle ? ((t = config.colors_dark.borderColor), (a = config.colors_dark.bodyBg), config.colors_dark) : ((t = config.colors.borderColor), (a = config.colors.bodyBg), config.colors)).headingColor;
    var e,
        s = $(".datatables-employees"),
        r = "admin-employees-view.php",
        l = { 1: { title: "Pending", class: "bg-label-warning" }, 2: { title: "Active", class: "bg-label-success" }, 3: { title: "Inactive", class: "bg-label-secondary" } };

    s.length &&
        (e = s.DataTable({
            ajax: assetsPath + "json/employees-list.json",
            columns: [{ data: "" }, { data: "names" }, { data: "nid" }, { data: "position" }, { data: "status" }, { data: "hp" }, { data: "action" }],
            columnDefs: [
                {
                    className: "control",
                    searchable: !1,
                    orderable: !1,
                    responsivePriority: 2,
                    targets: 0,
                    render: function (e, t, a, n) {
                        return "";
                    },
                },
                {
                    targets: 1,
                    responsivePriority: 4,
                    render: function (e, t, a, n) {
                        var s = a.names,
                            o = a.email,
                            l = a.avatar;
                        return (
                            `<div class="d-flex justify-content-start align-items-center user-name">
                                <div class="avatar-wrapper">
                                    <div class="avatar avatar-sm me-3">
                                        ${(l ? `<img src="${assetsPath}img/avatars/${l}" alt="Avatar" class="rounded-circle">` : `<span class="avatar-initial rounded-circle bg-label-${["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())]}"> ${(l = (((l = (s = a.names).match(/\b\w/g) || []).shift() || "") + (l.pop() || "")).toUpperCase())} </span>`)}
                                    </div>
                                </div>
                                <div class="d-flex flex-column">
                                    <a href="#" data-bs-target="#viewEmployee" data-bs-toggle="modal" class="text-body text-truncate">
                                    <span class="fw-semibold">${s}</span></a>
                                    <small class="text-muted">${o}</small>
                                </div>
                            </div>`
                        );
                    },
                },
                {
                    targets: 2,
                    render: function (e, t, a, n) {
                        return '<span class="fw-semibold">' + a.nid + "</span>";
                    },
                },
                {
                    targets: 3,
                    render: function (e, t, a, n) {
                        a = a.position;
                        return (
                            "<span class='text-truncate d-flex align-items-center'>" +
                            {
                                Doctor: '<span class="badge badge-center rounded-pill bg-label-warning w-px-30 h-px-30 me-2"><i class="bx bx-user bx-xs"></i></span>',
                                Dirctor: '<span class="badge badge-center rounded-pill bg-label-success w-px-30 h-px-30 me-2"><i class="bx bx-cog bx-xs"></i></span>',
                                Manager: '<span class="badge badge-center rounded-pill bg-label-primary w-px-30 h-px-30 me-2"><i class="bx bx-pie-chart-alt bx-xs"></i></span>',
                                Provider: '<span class="badge badge-center rounded-pill bg-label-info w-px-30 h-px-30 me-2"><i class="bx bx-edit bx-xs"></i></span>',
                                Receptionist: '<span class="badge badge-center rounded-pill bg-label-secondary w-px-30 h-px-30 me-2"><i class="bx bx-mobile-alt bx-xs"></i></span>',
                            }[a] +
                            a +
                            "</span>"
                        );
                    },
                },
                {
                    targets: 4,
                    render: function (e, t, a, n) {
                        a = a.status;
                        return '<span class="badge ' + l[a].class + '">' + l[a].title + "</span>";
                    },
                },
                {
                    targets: 5,
                    render: function (e, t, a, n) {
                        return '<span>' + a.hp + "</span>";
                    },
                },
                {
                    targets: -1,
                    title: "Actions",
                    searchable: !1,
                    orderable: !1,
                    render: function (e, t, a, n) {
                        return (
                            `<div class="d-inline-block text-nowrap">
                                <button class="btn btn-sm btn-icon" data-bs-target="#editEmployee" data-bs-toggle="modal"><i class="bx bx-edit"></i></button>
                                <button class="btn btn-sm btn-icon delete-record"><i class="bx bx-trash"></i></button>
                            </div>`
                        );
                    },
                },
            ],
            order: [[1, "desc"]],
            dom:
                '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
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
                            exportOptions: {
                                columns: [1, 2, 3, 4, 5],
                                format: {
                                    body: function (e, t, a) {
                                        var n;
                                        return e.length <= 0
                                            ? e
                                            : ((e = $.parseHTML(e)),
                                                (n = ""),
                                                $.each(e, function (e, t) {
                                                    void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                                                }),
                                                n);
                                    },
                                },
                            },
                            customize: function (e) {
                                $(e.document.body).css("color", n).css("border-color", t).css("background-color", a),
                                    $(e.document.body).find("table").addClass("compact").css("color", "inherit").css("border-color", "inherit").css("background-color", "inherit");
                            },
                        },
                        {
                            extend: "csv",
                            text: '<i class="bx bx-file me-2" ></i>Csv',
                            className: "dropdown-item",
                            exportOptions: {
                                columns: [1, 2, 3, 4, 5],
                                format: {
                                    body: function (e, t, a) {
                                        var n;
                                        return e.length <= 0
                                            ? e
                                            : ((e = $.parseHTML(e)),
                                                (n = ""),
                                                $.each(e, function (e, t) {
                                                    void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                                                }),
                                                n);
                                    },
                                },
                            },
                        },
                        {
                            extend: "excel",
                            text: '<i class="bx bxs-file-export me-2"></i>Excel',
                            className: "dropdown-item",
                            exportOptions: {
                                columns: [1, 2, 3, 4, 5],
                                format: {
                                    body: function (e, t, a) {
                                        var n;
                                        return e.length <= 0
                                            ? e
                                            : ((e = $.parseHTML(e)),
                                                (n = ""),
                                                $.each(e, function (e, t) {
                                                    void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                                                }),
                                                n);
                                    },
                                },
                            },
                        },
                        {
                            extend: "pdf",
                            text: '<i class="bx bxs-file-pdf me-2"></i>Pdf',
                            className: "dropdown-item",
                            exportOptions: {
                                columns: [1, 2, 3, 4, 5],
                                format: {
                                    body: function (e, t, a) {
                                        var n;
                                        return e.length <= 0
                                            ? e
                                            : ((e = $.parseHTML(e)),
                                                (n = ""),
                                                $.each(e, function (e, t) {
                                                    void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                                                }),
                                                n);
                                    },
                                },
                            },
                        },
                        {
                            extend: "copy",
                            text: '<i class="bx bx-copy me-2" ></i>Copy',
                            className: "dropdown-item",
                            exportOptions: {
                                columns: [1, 2, 3, 4, 5],
                                format: {
                                    body: function (e, t, a) {
                                        var n;
                                        return e.length <= 0
                                            ? e
                                            : ((e = $.parseHTML(e)),
                                                (n = ""),
                                                $.each(e, function (e, t) {
                                                    void 0 !== t.classList && t.classList.contains("employee-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                                                }),
                                                n);
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    text: '<i class="bx bx-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New Employee</span>',
                    className: "add-new btn btn-primary",
                    attr: { "data-bs-toggle": "offcanvas", "data-bs-target": "#offcanvasAddEmployee" },
                },
            ],
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
            initComplete: function () {
                this.api()
                    .columns(3)
                    .every(function () {
                        var t = this,
                            a = $('<select id="EmployeePosition" class="form-select text-capitalize"><option value=""> Select Position </option></select>')
                                .appendTo(".employee_position")
                                .on("change", function () {
                                    var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                    t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                                });
                        t.data()
                            .unique()
                            .sort()
                            .each(function (e, t) {
                                a.append('<option value="' + e + '">' + e + "</option>");
                            });
                    }),
                    this.api()
                        .columns(5)
                        .every(function () {
                            var t = this,
                                a = $('<select id="EmployeeHP" class="form-select text-capitalize"><option value=""> Select Health Post </option></select>')
                                    .appendTo(".employee_hp")
                                    .on("change", function () {
                                        var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                        t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                                    });
                            t.data()
                                .unique()
                                .sort()
                                .each(function (e, t) {
                                    a.append('<option value="' + e + '">' + e + "</option>");
                                });
                        }),
                    this.api()
                        .columns(4)
                        .every(function () {
                            var t = this,
                                a = $('<select id="FilterEmployees" class="form-select text-capitalize"><option value=""> Select Status </option></select>')
                                    .appendTo(".employee_status")
                                    .on("change", function () {
                                        var e = $.fn.dataTable.util.escapeRegex($(this).val());
                                        t.search(e ? "^" + e + "$" : "", !0, !1).draw();
                                    });
                            t.data()
                                .unique()
                                .sort()
                                .each(function (e, t) {
                                    a.append('<option value="' + l[e].title + '" class="text-capitalize">' + l[e].title + "</option>");
                                });
                        });
            },
        })),
        $(".datatables-employees tbody").on("click", ".delete-record", function () {
            e.row($(this).parents("tr")).remove().draw();
        }),
        setTimeout(() => {
            $(".dataTables_filter .form-control").removeClass("form-control-sm"), $(".dataTables_length .form-select").removeClass("form-select-sm");
        }, 300);
}),
    (function () {
        var t = document.getElementById("addNewEmployeeForm");
        FormValidation.formValidation(t, {
            fields: {
                employeeNames: { validators: { notEmpty: { message: "Please enter fullname " } } },
                employeeEmail: { validators: { notEmpty: { message: "Please enter email address" }, emailAddress: { message: "The value is not a valid email address" } } },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: "",
                    rowSelector: function (e, t) {
                        return ".mb-3";
                    },
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus(),
            },
        });
    })();
