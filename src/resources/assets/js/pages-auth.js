"use strict";


const formAuthentication = document.querySelector("#formAuthentication");
const submitButton = formAuthentication.querySelector('button[type="submit"]')
document.addEventListener("DOMContentLoaded", function (e) {
    var t;

        FormValidation.formValidation(formAuthentication, {
            fields: {
                username: { validators: { notEmpty: { message: "Please enter username" }, stringLength: { min: 6, message: "Username must be more than 6 characters" } } },
                firstname: { validators: { notEmpty: { message: "Please enter name" }, stringLength: { min:4, message: "name must be more than 4 characters" } } },
                lastname: { validators: { notEmpty: { message: "Please enter name" }, stringLength: { min:4, message: "name must be more than 4 characters" } } },
                DOB: { validators: { notEmpty: { message: "Please enter age" } } },
                email: { validators: { notEmpty: { message: "Please enter your email" }, emailAddress: { message: "Please enter valid email address" } } },
                "email-username": { validators: { notEmpty: { message: "Please enter email / username" }, stringLength: { min: 6, message: "Username must be more than 6 characters" } } },
                password: { validators: { notEmpty: { message: "Please enter your password" }, stringLength: { min: 6, message: "Password must be more than 6 characters" } } },
                "confirm-password": {
                    validators: {
                        notEmpty: { message: "Please confirm password" },
                        identical: {
                            compare: function () {
                                return formAuthentication.querySelector('[name="password"]').value;
                            },
                            message: "The password and its confirm are not the same",
                        },
                        stringLength: { min: 6, message: "Password must be more than 6 characters" },
                    },
                },
                terms: { validators: { notEmpty: { message: "Please agree terms & conditions" } } },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({ eleValidClass: "", rowSelector: ".mb-3" }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus(),
            },
            init: (e) => {
                e.on("plugins.message.placed", function (e) {
                    e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
                });
                e.on("core.form.valid",  async (f)=>{
                  
                });
            },
            
        }),
        (t = document.querySelectorAll(".numeral-mask")).length &&
        t.forEach((e) => {
            new Cleave(e, { numeral: !0 });
        });
});
