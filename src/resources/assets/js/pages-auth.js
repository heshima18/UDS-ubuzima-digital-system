"use strict";

import { alertMessage, postschema, request } from "../../../utils/functions.controller.js";

const formAuthentication = document.querySelector("#formAuthentication");
const submitButton = formAuthentication.querySelector('button[type="submit"]')
console.log(submitButton)
document.addEventListener("DOMContentLoaded", function (e) {
    var t;

        FormValidation.formValidation(formAuthentication, {
            fields: {
                username: { validators: { notEmpty: { message: "Please enter username" }, stringLength: { min: 6, message: "Username must be more than 6 characters" } } },
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
                    submitButton.setAttribute('disabled',true)
                    submitButton.innerText = 'signing in...'
                    let inputs = f.formValidation.form.querySelectorAll('input')
                    let o = {}
                    for (const input of inputs) {
                        Object.assign(o,{[input.getAttribute('data-field-name')]: input.value})
                    }
                    postschema.body = JSON.stringify(o)

                    let res = await request('user-login',postschema)
                    submitButton.removeAttribute('disabled')
                    submitButton.innerText = 'signin'
                    if (res.success) {
                        
                    }else{
                        alertMessage(res.message)
                    }
                });
            },
            
        }),
        (t = document.querySelectorAll(".numeral-mask")).length &&
        t.forEach((e) => {
            new Cleave(e, { numeral: !0 });
        });
});
