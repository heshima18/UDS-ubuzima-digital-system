import { alertMessage, getdata, getschema, postschema, request,initializeCleave,sessiondata,addLoadingTab,removeLoadingTab, checkEmpty, showRecs, getchips,getPath,addsCard,cpgcntn, geturl, adcm, addshade, deletechild, extractTime, getDate, triggerRecs, removeRec, viewEmployeeProfile, aDePh, setErrorFor } from "../../../utils/functions.controller.js";
import { shedtpopup } from "../../../utils/profile.editor.controller.js";
import {pushNotifs, userinfo,expirateMssg, getNfPanelLinks,m as messages, DateTime} from "./nav.js";
import { viewTransfer } from "./transfer.js";


let q,w,e,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z,notificationlinks,addMedic,socket
(async function () {
    z = userinfo
    let token = getdata('token')
    if (!token) {
        window.location.href = '../../login/'
    }
    if (!z.success) {
        localStorage.removeItem('token')
        return alertMessage(z.message)
    }
    if (z.success) {
        z = z.message
        try {
            socket = io(geturl(),{ query : { id: z.id} });
            socket.on('connect', () => {
            console.log('Connected to the server');
            });
            
            socket.on('message', (message) => {
                pushNotifs(message);
                messages.push(message)
                notificationlinks = getNfPanelLinks()
                genClicks(notificationlinks)
                addsCard(message.title,true)

            });
            socket.on('messagefromserver', (message) => {
                alertMessage(message)

            });;
            socket.on('accessAuth', (message) => {
                addAuthDiv(socket,message);

            });
            socket.on('expiratemssg', (message) => {
                expirateMssg(message);
            });
            socket.on('selecthp', (message)=>{
                var div = document.createElement('div')
                document.body.appendChild(div)
                for (const hp of message) {
                    div.innerHTML += `<div id="${hp.id}" class="verdana hover p-5p">${hp.name}</div>`
                }
                let dvs = div.querySelectorAll('div')
                dvs.forEach(button=>{
                    button.addEventListener('click',e=>{
                        e.preventDefault()
                        socket.emit('hpchoosen',{hp: button.id, token: localStorage.getItem('token')})
                    })
                })
            })
            socket.on('changetoken',(token)=>{
                alertMessage('token changed')
                localStorage.setItem('token',token)
                window.location.href = window.location.href
            })
            socket.emit('messageToId',{recipientId: z.id, message: 'wassup'})
            if (typeof(z.hospital) != 'string' && typeof(z.hospital) == 'object' && z.hospital.length > 0) {
                socket.emit('getpsforselection',z.hospital)
            }
        } catch (error) {
            console.log(error)
        }
    }
    try {
        n = document.querySelector('span.name')
        z = getdata('userinfo')
        n.textContent = z.Full_name
        i = document.querySelector('span.n-img');
        i.textContent = z.Full_name.substring(0,1)
        let dataHolders = Array.from(document.querySelectorAll('span[data-holder="true"]')),
        info = userinfo.message,editPform = document.querySelector('form#change-password')
        dataHolders.forEach(holder=>{
            let id = holder.id
            holder.innerText = info[id]
        })
        let editbuts = Array.from(document.querySelectorAll('span.edit-p-info'))
        for (const button of editbuts) {
            button.addEventListener('click',()=>{
                let id = button.id
                shedtpopup(id,info)
            })
        }
        let ins = Array.from(editPform.querySelectorAll('input')),shbuts = Array.from(editPform.querySelectorAll('span.showP'))
        shbuts.forEach(button=>{
            button.onclick = function (event) {
                event.preventDefault();
                if (ins[shbuts.indexOf(this)].type == 'password') {
                    this.querySelector('i').classList.replace('fa-eye','fa-eye-slash')
                    ins[shbuts.indexOf(this)].type = 'text'
                }else{
                    this.querySelector('i').classList.replace('fa-eye-slash','fa-eye')
                    ins[shbuts.indexOf(this)].type = 'password'
                }
            }
        })
        editPform.onsubmit = async function (event) {
            event.preventDefault();
            let v = 1,s = 1
            let password = ins.find(function (input) {return input.name == 'password'}),confirm = ins.find(function (input) {return input.name == 'confirm'})
            
            v = checkEmpty(password)
            s = checkEmpty(confirm)
            if(!v || !s) return 0
        
            if (password.value.length < 6) {
                return setErrorFor(password, 'this password does not meet minimum requirements')
            }else if (password.value != confirm.value) {
                return setErrorFor(password, 'passwords do not match')
            }else{
                postschema.body = JSON.stringify({
                    token: getdata('token'),
                    type : 'password',
                    value : password.value
                })
                let response = await request('edit-profile',postschema)
                alertMessage(response.message)
            }
    }
  } catch (error) {
    console.log(error)
  }
})();

 

