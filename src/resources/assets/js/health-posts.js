import { HealthPosts, cellsBySector, districtsByProvince, sectorsByDistrict } from "./constants.js";

$(document).ready(function () {
    var table = $('.datatables-health-posts'),
        e = table.DataTable({
            // Define the structure of the table
            dom: '<"row mx-2"<"col-md-2"<"me-3"l>><"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>>t<"row mx-2"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: { sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Search..." },
            columns: [
                { data: "" }, // Responsive Control column
                { data: "name", title: "Health post name" },
                { data: "type", title: "Type" },
                { data: "location", title: "Location" },
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
                            `<span class='d-block fw-semibold'>${e}</span>`
                        );
                    },
                },
                {
                    targets: 3,
                    searchable: 1,
                    orderable: !1,
                    render: function (e, t, a, n) {
                        return (
                            `<span>${e.district} District</span>`
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
                                <button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#view-health-post"><i class="bx bx-show-alt"></i></button>
                                <button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#update-health-post"><i class="bx bx-edit"></i></button>
                                <button class="btn btn-sm btn-icon delete-health-post"><i class="bx bx-trash"></i></button>
                            </div>`
                        );
                    },
                },
            ],
            order: [[1, "asc"]], // Initial sorting

            // Provide the data from the imported Employees
            data: HealthPosts,

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
                    attr: { "data-bs-toggle": "modal", "data-bs-target": "#add-health-post" },
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
            }
        });
    table.find("tbody").on("click", ".delete-health-post", function () {
        if (confirm("Are you sure you want to delete this health post?")) {
            e.row($(this).parents("tr")).remove().draw();
        }
    }), setTimeout(() => {
        $(".dataTables_filter .form-control").removeClass("form-control-sm");
        $(".dataTables_length .form-select").removeClass("form-select-sm");
    }), $('#add-health-post').on('shown.bs.modal', () => {
        $('#ahp-location-province').on('change', function () {
            const selectedProvince = $(this).val();
            const districts = districtsByProvince[selectedProvince];

            $('#ahp-location-district').empty().append('<option value="">Select District</option>');
            $('#ahp-location-sector').empty().append('<option value="">Select Sector</option>');
            $('#ahp-location-cell').empty().append('<option value="">Select Cell</option>');

            $.each(districts, function (index, district) {
                $('#ahp-location-district').append($('<option>', {
                    value: district.toLowerCase(),
                    text: district
                }));
            });
        }), $('#ahp-location-district').on('change', function () {
            const selectedDistrict = $(this).val();
            const sectors = sectorsByDistrict[selectedDistrict];

            $('#ahp-location-sector').empty().append('<option value="">Select Sector</option>');
            $('#ahp-location-cell').empty().append('<option value="">Select Cell</option>');

            $.each(sectors, function (index, sector) {
                $('#ahp-location-sector').append($('<option>', {
                    value: sector.toLowerCase(),
                    text: sector
                }));
            });
        }), $('#ahp-location-sector').on('change', function () {
            const selectedSector = $(this).val();
            const cells = cellsBySector[selectedSector];

            $('#ahp-location-cell').empty().append('<option value="">Select Cell</option>');

            $.each(cells, function (index, cell) {
                $('#ahp-location-cell').append($('<option>', {
                    value: cell.toLowerCase(),
                    text: cell
                }));
            });
        });
    });
});