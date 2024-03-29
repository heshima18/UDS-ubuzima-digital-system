import { addLoadingTab, addSpinner, addshade, alertMessage, calcTime, deletechild, getPath, getdata, postschema, removeLoadingTab, removeSpinner, request } from "../../../utils/functions.controller.js";

export async function viewTransfer(trId) {
    let div = document.createElement('div')
    addLoadingTab(div)
    postschema.body = JSON.stringify({
        token : getdata('token'),
        transfer : trId
    }) 
    let transfer  = await request('getTrNsfr',postschema)
    if (transfer.success) {
        removeLoadingTab(div)
    }
    if (!transfer.success) {
        return alertMessage(transfer.message)
    }
    let u = addshade();
    window.addEventListener('urlchange', function() {
        deletechild(u,u.parentElement)
    })
    transfer = transfer.message
    div.className = `br-10p cntr card-1 bc-white p-10p bsbb w-60 h-80 b-mgc-resp` 
    u.appendChild(div)
    div.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
            <div class="head w-100 px-5p py-10p bsbb">
                <span class="capitalize bold-2 fs-20p">Transfer Details for ${transfer.p_info.name}</span>
            </div>
            <div class="body p-5p bsbb w-100 h-91 ovys scroll-2">
                <div class="w-100 h-a ovys scroll-2 flex js-sb bblock-resp">
                    <div class="w-100 h-a my-10p card mx-5p bm-y-10p-resp bm-x-0-resp ">
                        <span class="dgray capitalize block card-header">transferor info </span>
                        <span class="card-body">
                            <ul class="w-100 px-2p bsbb m-0 ls-none">
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Name:</span>
                                    <span class="fs-15p bold-2">${transfer.hcp_info.name}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Title:</span>
                                    <span class="fs-15p bold-2">${transfer.hcp_info.title}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">license Number:</span>
                                    <span class="fs-15p bold-2">${transfer.hcp_info.license}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Phone:</span>
                                    <span class="fs-15p bold-2">${transfer.hcp_info.phone}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">transferred session:</span>
                                    <span class="fs-15p bold-2 hover-6 links" data-id="${transfer.session}" id="view-session">#${transfer.session} <i class="fas fa-external-link-alt px-5p"></i></span>
                                </li>
                            </ul>
                        </span>
                    </div>
                    <div class="w-100 h-a my-10p card mx-5p bm-y-10p-resp bm-x-0-resp">
                        <span class="dgray capitalize block card-header">patient info</span>
                        <span class="card-body">
                            <ul class="w-100 px-2p bsbb m-0 ls-none">
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Name:</span>
                                    <span class="fs-15p bold-2 hover-6 links" data-id="${transfer.p_info.id}" id="search-patient">${transfer.p_info.name} <i class="fas fa-external-link-alt px-5p"></i></span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">DOB:</span>
                                    <span class="fs-15p bold-2">${transfer.p_info.dob}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">NID:</span>
                                    <span class="fs-15p bold-2">${transfer.p_info.nid}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Location:</span>
                                    <span class="fs-15p bold-2">${transfer.p_info.location}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Phone:</span>
                                    <span class="fs-15p bold-2">${transfer.p_info.phone}</span>
                                </li>
                            </ul>
                        </span> 
                    </div>
                </div>
                <div class="w-100 h-a ovys scroll-2 flex js-sb bblock-resp">
                    <div class="w-100 h-a my-10p card mx-5p bm-y-10p-resp bm-x-0-resp ">
                        <span class="dgray capitalize block card-header">transferring facility info </span>
                        <span class="card-body">
                            <ul class="w-100 px-2p bsbb m-0 ls-none">
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Name:</span>
                                    <span class="fs-15p bold-2">${transfer.hp_info.name}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Location:</span>
                                    <span class="fs-15p bold-2">${transfer.hp_info.location}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Phone:</span>
                                    <span class="fs-15p bold-2">${transfer.hp_info.phone}</span>
                                </li>
                            </ul>
                        </span>
                    </div>
                    <div class="w-100 h-a my-10p card mx-5p bm-y-10p-resp bm-x-0-resp">
                        <span class="dgray capitalize block card-header">receiving facility info </span>
                        <span class="card-body">
                            <ul class="w-100 px-2p bsbb m-0 ls-none">
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Name:</span>
                                    <span class="fs-15p bold-2">${transfer.hp_receiving_info.name}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Location:</span>
                                    <span class="fs-15p bold-2">${transfer.hp_receiving_info.location}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Phone:</span>
                                    <span class="fs-15p bold-2">${transfer.hp_receiving_info.phone}</span>
                                </li>
                            </ul>
                        </span> 
                    </div>
                </div>
                <div class="w-100 h-a my-10p card bm-y-10p-resp bm-x-0-resp ">
                    <span class="dgray capitalize block card-header">reason for transfer </span>
                    <span class="card-body">
                        <ul class="w-100 px-2p bsbb m-0 ls-none">
                            <li class="dgray capitalize py-10p bsbb">
                                <span class="fs-15p bold-2">${transfer.reason}</span>
                            </li>
                        </ul>
                    </span>
                </div>
                <div class="w-100 h-a my-10p card bm-y-10p-resp bm-x-0-resp ">
                    <span class="dgray capitalize block card-header">other transfer info</span>
                    <span class="card-body">
                        <ul class="w-100 px-2p bsbb m-0 ls-none">
                            <li class="dgray capitalize py-10p bsbb">
                                <span class="fs-15p bold-2">${transfer.date}(${calcTime(transfer.date)})</span>
                            </li>
                        </ul>
                    </span>
                </div>
                    <div class="w-100 h-a py-10p mt-20p flex">
                        
                    </div>
            </div>
        </div>`
        let links = Array.from(div.querySelectorAll('.links'))
        links.forEach(link=>{
            link.onclick = function (event) {
                event.preventDefault();
                let id = this.getAttribute('data-id'),type= this.id
                if (document.querySelector(`div#${type}`)) {
                    let url = new URL(window.location.href);
                    url.pathname = `/${getPath()[0]}/${type}/${id}`;
                    window.history.pushState({},'',url.toString())
                    const evnt = new Event('urlchange', { bubbles: true });
                    window.dispatchEvent(evnt);
                }

            }
        })
   
}
export async function viewTInternalTransfer(session,content) {
    let div = document.createElement('div')
    addLoadingTab(div)
    postschema.body = JSON.stringify({
        token : getdata('token'),
    }) 
    session  = await request(`session/${session}`,postschema)
    if (session.success) {
        removeLoadingTab(div)
    }
    if (!session.success) {
        return alertMessage(session.message)
    }
    let u = addshade();
    window.addEventListener('urlchange', function() {
        deletechild(u,u.parentElement)
    })
    session = session.message
    div.className = `br-10p cntr card-1 bc-white p-10p bsbb w-60 h-80 b-mgc-resp` 
    u.appendChild(div)
    div.innerHTML = `<div class="w-100 h-100 p-5p bp-0-resp">
            <div class="head w-100 px-5p py-10p bsbb">
                <span class="capitalize bold-2 fs-20p">Transfer Details for ${session.p_info.name}</span>
            </div>
            <div class="body p-5p bsbb w-100 h-91 ovys scroll-2">
                <div class="w-100 h-a ovys scroll-2 flex js-sb bblock-resp">
                    <div class="w-100 h-a my-10p card mx-5p bm-y-10p-resp bm-x-0-resp ">
                        <span class="dgray capitalize block card-header">transferor info </span>
                        <span class="card-body">
                            <ul class="w-100 px-2p bsbb m-0 ls-none">
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Name:</span>
                                    <span class="fs-15p bold-2">${session.hcp_info.name}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Title:</span>
                                    <span class="fs-15p bold-2">${session.hcp_info.title}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">license Number:</span>
                                    <span class="fs-15p bold-2">${session.hcp_info.license}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Phone:</span>
                                    <span class="fs-15p bold-2">${session.hcp_info.phone}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">transferred session:</span>
                                    <span class="fs-15p bold-2 hover-6 links" data-id="${session.session_id}" id="view-session">#${session.session_id} <i class="fas fa-external-link-alt px-5p"></i></span>
                                </li>
                            </ul>
                        </span>
                    </div>
                    <div class="w-100 h-a my-10p card mx-5p bm-y-10p-resp bm-x-0-resp">
                        <span class="dgray capitalize block card-header">patient info</span>
                        <span class="card-body">
                            <ul class="w-100 px-2p bsbb m-0 ls-none">
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Name:</span>
                                    <span class="fs-15p bold-2 hover-6 links" data-id="${session.p_info.id}" id="search-patient">${session.p_info.name} <i class="fas fa-external-link-alt px-5p"></i></span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">DOB:</span>
                                    <span class="fs-15p bold-2">${session.p_info.dob}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">NID:</span>
                                    <span class="fs-15p bold-2">${session.p_info.nid}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Location:</span>
                                    <span class="fs-15p bold-2">${session.p_info.location}</span>
                                </li>
                                <li class="dgray capitalize py-10p bsbb">
                                    <span class="fs-15p bold-2 dgray">Phone:</span>
                                    <span class="fs-15p bold-2">${session.p_info.phone}</span>
                                </li>
                            </ul>
                        </span> 
                    </div>
                </div>
                <div class="w-100 h-a my-10p card bm-y-10p-resp bm-x-0-resp ">
                    <span class="dgray capitalize block card-header">reason for transfer </span>
                    <span class="card-body">
                        <ul class="w-100 px-2p bsbb m-0 ls-none">
                            <li class="dgray capitalize py-10p bsbb">
                                <span class="fs-15p bold-2">${content}</span>
                            </li>
                        </ul>
                    </span>
                </div>
                <div class="w-100 h-a my-10p card bm-y-10p-resp bm-x-0-resp ">
                    <span class="dgray capitalize block card-header">actions</span>
                    <span class="card-body">
                        <ul class="w-100 flex px-2p bsbb m-0 ls-none">
                            <li class="dgray capitalize py-10p bsbb">
                                <button class="btn btn-primary" id="accept">accept</button>
                            </li>
                        </ul>
                    </span>
                </div>
            </div>
        </div>`
        let links = Array.from(div.querySelectorAll('.links')),accept = div.querySelector('button#accept')
        accept.onclick = async function (event) {
           event.preventDefault();
           postschema.body = JSON.stringify({
             token : getdata('token'),
             session: session.session_id
            }) 
            addSpinner(this)
            session  = await request(`tsfOnsp`,postschema)
            removeSpinner(this)
            if (session.success) {
                removeLoadingTab(div)
            }
            if (session.success) {
                deletechild(u,u.parentElement)
            }
            alertMessage(session.message)
        }
        links.forEach(link=>{
            link.onclick = function (event) {
                event.preventDefault();
                let id = this.getAttribute('data-id'),type= this.id
                if (document.querySelector(`div#${type}`)) {
                    let url = new URL(window.location.href);
                    url.pathname = `/${getPath()[0]}/${type}/${id}`;
                    window.history.pushState({},'',url.toString())
                    const evnt = new Event('urlchange', { bubbles: true });
                    window.dispatchEvent(evnt);
                }

            }
        })
   
}