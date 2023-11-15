import { geturl } from "../../../utils/functions.controller.js";

let footerHTML = ` <div class="body w-100 h-100 p-10p bsbb">
                    <div class=" bsbb w-100 igrid">
                        <div class="w-100 h-a">
                            <p class="ls-none center p-0 w-100 m-0">
                                <span class="left capitalize verdana fs-10p dgray p-10p bsbb center">
                                    <span class="nowrap dgray fs-11p">
                                        <span class="center-2">
                                        &copy; ${new Date().getFullYear()}
                                                UDS All Rights Reserved <span class="fs-18p p-5p bsbb center mt--10p">
                                                    .
                                                    </span>
                                                    <a href="https://ingogatechnologies.com/" class="td-none ls-n"><span class="nowrap hover-6 dgray">ingoga technologies</span></a>
                                            </span>
                                        </span>
                                    <span class="center-2">
                                        <a href="https://ingogatechnologies.com/#about" class="td-none ls-n"><span class="nowrap hover-6 dgray">About us</span></a>
                                        <span class="fs-18p p-5p bsbb center mt--10p">
                                        .
                                        </span>
                                        <a href="${geturl()}terms" class="td-none ls-n"><span class="nowrap hover-6 dgray">Terms and conditions</span></a>
                                    </span>
                                </span>
                            </p>
                        </div>
                    </div>
                    </div>`
document.querySelector('footer').innerHTML = footerHTML