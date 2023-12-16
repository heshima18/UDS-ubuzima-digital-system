import { postschema, request,alertMessage, getdata,getschema, animskel, deletechild,getPath,cpgcntn, sessiondata, calcTime,DateTime,geturl, adcm, removeLoadingTab, initializeSpecialCleave, aDePh, checkEmpty, addSpinner, removeSpinner, showRecs, getLocs} from "../../../utils/functions.controller.js"
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m,extra,comparison,Resthingtoclone
import userinfo from "./nav.js"
import {config} from "./config.js"
import { shedtpopup } from "../../../utils/profile.editor.controller.js";
const map = await request('get-map',getschema);

(async function () {
    if (!map.success) {
        return alertMessage(map.message)
    }
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
            const socket = io(geturl(),{ query : { id: z.id} });
            socket.on('connect', () => {
            console.log('Connected to the server');
            });
            
            socket.on('message', (message) => {
                pushNotifs(message);
                addsCard(message.title,true)

            });
            socket.on('changetoken',(token)=>{
                alertMessage('token changed')
                localStorage.setItem('token',token)
                window.location.href = window.location.href
            })
            socket.on('expiratemssg', (message) => {
                expirateMssg(message);
            });
            socket.emit('messageToId',{recipientId: z.id, message: 'wassup'})
            if (typeof(z.hospital) != 'string' && typeof(z.hospital) == 'object' && z.hospital.length > 0) {
                socket.emit('getpsforselection',z.hospital)
            }
        } catch (error) {
            console.log(error)
        }
    }
    postschema.body = JSON.stringify({
        token: getdata('token'),
        range: {
            start:'',
            stop:'',
        },
        groupBy: 'hospitals'
    })
    const insights = await request('insights',postschema)

    if (!insights.success) {
        return alertMessage(insights.message)
    }
   
    extra = insights.message
    a = getPath(1)
    c = Array.from(document.querySelectorAll('span.cpcards'))
    p = Array.from(document.querySelectorAll('div.pagecontentsection'))
    if(a){
        p.forEach(target=>{
            if (a == target.id) {
                t = p.indexOf(target)
                c.forEach((cp)=>{
                    cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
                })
                c[t].classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
                cpgcntn(t,p,extra)
                gsd(target,extra)
                return 0
            }
        })
    }else{
        window.history.pushState('','','./home')
        cpgcntn(0,p,extra)

    }
    window.onpopstate = function () {
        a = getPath(1)
        if(a){
            p.forEach(target=>{
                if (a == target.id) {
                    t = p.indexOf(target)
                    c.forEach((cp)=>{
                        cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
                    })
                    c[t].classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
                    cpgcntn(t,p)
                    gsd(target,extra)
                    return 0
                }
            })
        }else{
            window.history.pushState('','','./home')
            cpgcntn(0,p)
            gsd(p[0])
    
        }
    }
    c.forEach((cudstp)=>{
        cudstp.addEventListener('click',()=>{
            c.forEach((cp)=>{
                cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
            })
            cudstp.classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
            let url = new URL(window.location.href);
            url.pathname = `/mohs/${cudstp.getAttribute('data-item-type')}`;
            window.history.pushState({},'',url.toString())
            cpgcntn(c.indexOf(cudstp),p,extra)
            let page = p.find(function (elem) {
                return elem.id == cudstp.getAttribute('data-item-type')
            })
            if (page) {
                gsd(page,extra)
            }
        })
    })
    async function gsd(page) {
        try {
            x = page.id
            if (x == 'my-account') {
                n = page.querySelector('span.name')
                z = getdata('userinfo')
                n.textContent = z.Full_name
                i = page.querySelector('span.n-img');
                i.textContent = z.Full_name.substring(0,1)
                let dataHolders = Array.from(page.querySelectorAll('span[data-holder="true"]')),
                info = userinfo.message,editPform = page.querySelector('form#change-password')
                dataHolders.forEach(holder=>{
                    let id = holder.id
                    holder.innerText = info[id]
                })
                let editbuts = Array.from(page.querySelectorAll('span.edit-p-info'))
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
            }else if (x == 'home') {
                let customBttns = Array.from(page.querySelectorAll(`[data-role="custom-buttns"]`)),BttnsHol = Array.from(page.querySelectorAll('div.BttnsHol')),shades = Array.from(page.querySelectorAll('div[data-role="shade"]')),parents= [],compSearchButton = page.querySelector('button#compareSearch'),locRange = page.querySelector(`form.loc-range`)
                let {avaiGroupings} = extra
                compSearchButton.onclick = function (event) {
                    event.preventDefault();
                    computeComp(page)
                }
                BttnsHol.forEach(container=>{
                    if (container.id == 'groupByBttnsHol') {
                        removeLoadingTab(container)
                        for (const group of avaiGroupings) {
                            let but = document.createElement('button');
                            but.setAttribute('data-target','groupBy');
                            but.setAttribute('type','button');
                            but.setAttribute('data-role','custom-buttns');
                            but.className = `capitalize theme bc-tr-theme btn btn-sm my-4p mx-2p`
                            but.innerText = group
                            but.id = (group == 'provinces')? 'groupByProvinces': (group == 'districts')? 'groupByDistricts': (group == 'sectors')? 'groupBySectors': (group == 'cells')? 'groupByCells': (group == 'health facilities')? 'groupByHps':  (group == 'tests')? 'groupByTests': (group == 'medications')? 'groupByMeds':'';
                            container.appendChild(but);
                            (group == 'health facilities')? but.classList.add('b-1-s-theme'): '';
                            
                        }
                        customBttns = Array.from(page.querySelectorAll(`[data-role="custom-buttns"]`))  
                        addCustomBttnsFunc(customBttns)
                    }else if (container.id == 'viewByBttnsHol') {
                        aDePh(container)
                    }
                })
                shades.forEach(shade=>{
                    parents.push(shade.parentNode)
                    removeLoadingTab(shade.parentNode)
                })
                function addCustomBttnsFunc(buttons) {
                    buttons.forEach(button => {
                        button.onclick = function (event) {
                            event.preventDefault();
                            let target = button.getAttribute('data-target'),cont
                            if (target == 'comparisonType') {
                                cont = page.querySelector('.typesHolCont')
                                revolveStffs(button,cont)
                            }else if (target == 'groupBy') {
                                let id = button.id
                                let viewByCont = BttnsHol.find(function (container) {
                                    return container.id == 'viewByBttnsHol'
                                })
                                if (id == 'groupByTests') {
                                    drawMainChart(extra.groupByTests,comparison)
                                    generateViewBy('groupByTests',extra.groupByTests,viewByCont)
                                }else{
                                    drawMainChart(extra[id],comparison)
                                    generateViewBy(null,null,viewByCont)
                                }
                            }
                            changeBtnBrdrClr(this)
                        }
                    });
                }
                drawPatientsChart(extra.groupByDates)
                drawMainChart(extra.groupByHps)
                Resthingtoclone = document.querySelector('div.resCard')
                makeDiagsInsights(extra.groupByResults,Resthingtoclone)
                addLocFunc(locRange)
                let rankingsDivs = Array.from(document.querySelectorAll('div.ranks'))
                rankingsDivs.forEach(div=>{
                    prepT(div,div.id,extra[div.getAttribute('data-to-hold')])
                })

                let cleaveRequires = Array.from(page.querySelectorAll('.require-cleave'))
                cleaveRequires.forEach(input=>{
                   let type = input.getAttribute('data-id') 
                   if( type == 'year'){
                    initializeSpecialCleave(input,[4],4)
                   }
                })
            }

        } catch (error) {
            console.log(error)
        }
    }
})()
// function drawChartForRes(container) {
//     container.classList.add('w-100','w-h-100');
//     let options = {
//         chart: { height: 80, type: "area", toolbar: { show: !1 }, sparkline: { enabled: !0 } },
//         markers: {
//             size: 6,
//             colors: "transparent",
//             strokeColors: "transparent",
//             strokeWidth: 4,
//             discrete: [{ fillColor: config.colors.white, seriesIndex: 0, dataPointIndex: 6, strokeColor: config.colors.success, strokeWidth: 2, size: 6, radius: 8 }],
//             hover: { size: 7 },
//         },
//         grid: { show: !1, padding: { right: 8 } },
//         colors: [config.colors.success],
//         fill: { type: "gradient", gradient: { shade: s, shadeIntensity: 0.8, opacityFrom: 0.8, opacityTo: 0.25, stops: [0, 85, 100] } },
//         dataLabels: { enabled: !1 },
//         series: [{ data: [180, 175, 275, 140, 205, 190, 295] }],
//         xaxis: { show: !1, lines: { show: !1 }, labels: { show: !1 }, stroke: { width: 0 }, axisBorder: { show: !1 } },
//         yaxis: { stroke: { width: 0 }, show: !1 },
//     }
//     container.classList.remove('bc-tr-theme')
//     new ApexCharts(container, options).render();

// }
async function addLocFunc(form) {
    let button = form.querySelector('button'),inputs = Array.from(form.querySelectorAll('input.address-field')),dates = Array.from(form.querySelectorAll('input[type="date"]')) 

    button.onclick = async function (event) {
        event.preventDefault();
        let a
        addSpinner(button)
        for(const input  of inputs) {
            v = input.getAttribute('data-id')
            if (!v) {
                a = inputs.indexOf(input) - 1
                break
            }
        }
        if (!a && a != 0) {
            a = 3
        }else if (a == -1) {
            removeSpinner(button)
            return
        }
        let target = inputs[a],obj = {[target.name]: target.getAttribute('data-id')}
        postschema.body = JSON.stringify({
            token: getdata('token'),
            range: {
                start: null,
                stop: null,
            },
            entity: Object.keys(obj)[0],
            needle: obj[Object.keys(obj)[0]],
            
        })
        const insights = await request('insights',postschema);
        removeSpinner(button)
        if (insights.success) {
            extra = insights.message
            drawMainChart(extra.groupByHps)
            drawPatientsChart(extra.groupByDates)
            makeDiagsInsights(extra.groupByResults,Resthingtoclone)
            let rankingsDivs = Array.from(document.querySelectorAll('div.ranks'))
                rankingsDivs.forEach(div=>{
                    prepT(div,div.id,extra[div.getAttribute('data-to-hold')])
                })
        }else{
            alertMessage(insights.message)
        }
        
    }
    inputs.map(input =>{
        input.onfocus = function (event) {
            event.preventDefault();
            if (input.name == 'province') {
                let provinces = getLocs(map.message,'province')
                showRecs(input,provinces,'provinces')
            }else if (input.name == 'district') {
                let province = inputs.find(function (inp) {
                    return inp.name == 'province'
                })
                province = province.getAttribute('data-id')
                if (province) {
                    let districts = getLocs(map.message,'district',province)
                    showRecs(input,districts,'districts')
                }
            }else if (input.name == 'sector') {
                let district = inputs.find(function (inp) {
                    return inp.name == 'district'
                })
                district = district.getAttribute('data-id')
                if (district) {
                    let sectors = getLocs(map.message,'sector',district)
                    showRecs(input,sectors,'sectors')
                }
            }else if (input.name == 'cell') {
                let sector = inputs.find(function (inp) {
                    return inp.name == 'sector'
                })
                sector = sector.getAttribute('data-id')
                if (sector) {
                    let cells = getLocs(map.message,'cell',sector)
                    showRecs(input,cells,'cells')
                }
            }
            
        }
    })

}
function prepT(container,id,Obj,title) {
    if (id == 'rankByHps') {
      let total = Object.keys(Obj).map(function (key) {
          return Obj[key].total
      })
      let ranksHol = container.querySelector('#ranks-cont'),
      thingtoclone = ranksHol.querySelector('li'),thecont,data,mainTotal = container.querySelector('#mainTotal')
      ranksHol.innerHTML = null
      mainTotal.innerHTML = `${adcm(total.reduce((a,c)=> a+c))}`
      for (const record of Object.keys(Obj)) {
        data = Obj[record]
        thecont = thingtoclone.cloneNode(true)
        let hpname = thecont.querySelector('#name'),
        location = thecont.querySelector('#loc'),
        total = thecont.querySelector('#total')
        hpname.innerText = data.info.name
        location.innerText = data.info.loc
        total.innerText = adcm(data.total)
        ranksHol.appendChild(thecont)
        
      }
      if(Object.keys(Obj).length == 0){
        aDePh(thingtoclone.parentElement)
        }
      deletechild(thingtoclone,thingtoclone.parentElement)

    }else if(id == 'rankByDiags'){
        let total = Object.keys(Obj).length
        let ranksHol = container.querySelector('#ranks-cont'),
        thingtoclone = ranksHol.querySelector('li'),thecont,data,mainTotal = container.querySelector('#mainTotal')
        ranksHol.innerHTML = null
        mainTotal.innerHTML = `${adcm(total)}`
        for (const record of Object.keys(Obj)) {
          data = Obj[record]
          thecont = thingtoclone.cloneNode(true)
          let diagname = thecont.querySelector('#name'),
          hp = thecont.querySelector('#hosp'),
          hpcount = thecont.querySelector('#hospcount'),
          total = thecont.querySelector('#total')
          diagname.innerText = record
          hp.innerText = data.mostAppearance.hospital
          hpcount.innerText = data.mostAppearance.count
          total.innerText = adcm(Obj[record].total)
          ranksHol.appendChild(thecont)
          
        }
        if(Object.keys(Obj).length == 0){
            aDePh(thingtoclone.parentElement)
        }
        deletechild(thingtoclone,thingtoclone.parentElement)
    }else if(id == 'groupByEmptyDiags'){
        let total = Object.keys(Obj).length
        let ranksHol = container.querySelector('#ranks-cont'),
        thingtoclone = ranksHol.querySelector('li'),thecont,data,mainTotal = container.querySelector('#mainTotal')
        mainTotal.innerHTML = `${adcm(total)}`
        for (const record of Object.keys(Obj)) {
          data = Obj[record]
          thecont = thingtoclone.cloneNode(true)
          let diagname = thecont.querySelector('#name'),
          hp = thecont.querySelector('#hosp'),
          hpcount = thecont.querySelector('#hospcount'),
          total = thecont.querySelector('#total')
          diagname.innerText = record
          hp.innerText = data.mostAppearance.hospital
          hpcount.innerText = data.mostAppearance.count
          total.innerText = adcm(Obj[record].total)
          ranksHol.appendChild(thecont)
          
        }
        if(Object.keys(Obj).length == 0){
            aDePh(thingtoclone.parentElement)
        }
        deletechild(thingtoclone,thingtoclone.parentElement)
    }else if(id == 'groupByMedSuccessRate'){
        let total = Object.keys(Obj).length
        let ranksHol = container.querySelector('#ranks-cont'),
        thingtoclone = ranksHol.querySelector('li'),thecont,data,mainTotal = container.querySelector('#mainTotal')
        mainTotal.innerHTML = `${adcm(total)}`
        for (const record of Object.keys(Obj)) {
          data = Obj[record]
          thecont = thingtoclone.cloneNode(true)
          let diagname = thecont.querySelector('#name'),
          hp = thecont.querySelector('#hosp'),
          hpcount = thecont.querySelector('#hospcount'),
          total = thecont.querySelector('#total')
          diagname.innerText = record
          hp.innerText = data.mostAppearance.hospital
          hpcount.innerText = data.mostAppearance.count
          total.innerText = adcm(Obj[record].total)
          ranksHol.appendChild(thecont)
          
        }
        if(Object.keys(Obj).length == 0){
            aDePh(thingtoclone.parentElement)
        }
        deletechild(thingtoclone,thingtoclone.parentElement)
    }else if(id == 'groupByMedsSideEffect'){
        let total = Object.keys(Obj).length
        let ranksHol = container.querySelector('#ranks-cont'),
        thingtoclone = ranksHol.querySelector('li'),thecont,data,mainTotal = container.querySelector('#mainTotal')
        mainTotal.innerHTML = `${adcm(total)}`
        for (const record of Object.keys(Obj)) {
          data = Obj[record]
          thecont = thingtoclone.cloneNode(true)
          let diagname = thecont.querySelector('#name'),
          hp = thecont.querySelector('#hosp'),
          hpcount = thecont.querySelector('#hospcount'),
          total = thecont.querySelector('#total')
          diagname.innerText = record
          hp.innerText = data.mostAppearance.hospital
          hpcount.innerText = data.mostAppearance.count
          total.innerText = adcm(Obj[record].total)
          ranksHol.appendChild(thecont)
          
        }
        if(Object.keys(Obj).length == 0){
            aDePh(thingtoclone.parentElement)
        }
        deletechild(thingtoclone,thingtoclone.parentElement)
    }
}
function changeBtnBrdrClr(button) {
    button.classList.toggle('b-1-s-theme')
    let otherBtns = Array.from(button.parentNode.querySelectorAll(`[data-role="custom-buttns"]`))
    otherBtns.map(function (b) {
        if (b!= button) {
            b.classList.remove('b-1-s-theme')
        }
    })
}
function revolveStffs(button,cont) {
   let subConts = Array.from(cont.querySelectorAll('.typesHol')),
   target = subConts.find(function (elem) {
    return elem.getAttribute('data-id') == button.id
   })
   subConts.forEach(elem=>{
    if (subConts.indexOf(elem) > subConts.indexOf(target)) {
        elem.classList.remove('active')
        elem.classList.remove('mt-60p','mt--60p','mt-0')
        elem.classList.add('mt-60p')

    }else if (subConts.indexOf(elem) < subConts.indexOf(target)) {
        elem.classList.remove('active')
        elem.classList.remove('mt-60p','mt--60p','mt-0')
        elem.classList.add('mt--60p')
    }
   })
   target.classList.remove('mt-60p')
   target.classList.remove('mt--60p')
   target.classList.add('active')
   target.classList.remove('mt-0')



}
function drawMainChart(grp, compType) {
    let total1,total2,mainChartOptions,series1,series2,total
    var mainChart = document.querySelector("#mainChart")
    mainChart.innerHTML = null
    if (compType) {
        series1 = Object.keys(grp[Object.keys(grp)[0]].total)[0]
        series2 = Object.keys(grp[Object.keys(grp)[0]].total)[1]
        total1 = Object.keys(grp).map(function (key) {
            return grp[key].total[Object.keys(grp[key].total)[0]]
        })
        total2 = Object.keys(grp).map(function (key) {
            return grp[key].total[Object.keys(grp[key].total)[1]]
        })
        mainChartOptions = {
            series: [
                { name: series1, data:  total1},
                { name: series2, data:  total2},
            ],
            chart: { height: 500, stacked: !0, type: "bar", toolbar: { show: !1 } },
            plotOptions: { bar: { horizontal: !1, columnWidth: "33px", borderRadius: 5} },
            colors: [config.colors.primary,config.colors.success],
            dataLabels: { enabled: !1 },
            legend: { show: !0, horizontalAlign: "left", position: "top", markers: { height: 8, width: 8, radius: 12, offsetX: -3 }, labels: { colors: e }, itemMargin: { horizontal: 10 } },
            xaxis: { categories: Object.keys(grp), labels: { style: { fontSize: "13px", colors: t } }, axisTicks: { show: !1 }, axisBorder: { show: !1 } },
            states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
        }
    }else{
        total = Object.keys(grp).map(function (key) {
            return grp[key].total
        })
        mainChartOptions = {
            series: [
                { name: "Patients", data:  total},
            ],
            chart: { height: 500, stacked: !0, type: "bar", toolbar: { show: !1 } },
            plotOptions: { bar: { horizontal: !1, columnWidth: "33px", borderRadius: 5} },
            colors: [config.colors.primary],
            dataLabels: { enabled: !1 },
            legend: { show: !0, horizontalAlign: "left", position: "top", markers: { height: 8, width: 8, radius: 12, offsetX: -3 }, labels: { colors: e }, itemMargin: { horizontal: 10 } },
            xaxis: { categories: Object.keys(grp), labels: { style: { fontSize: "13px", colors: t } }, axisTicks: { show: !1 }, axisBorder: { show: !1 } },
            states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
        }

    }
    mainChart = new ApexCharts(mainChart, mainChartOptions);
    mainChart.render(); 
}
function drawPatientsChart(grp) {
    let patientsDiv = document.querySelector('div.patientsDiv'),patientNholder = patientsDiv.querySelector('.pn-holder'),percentageHolder = patientsDiv.querySelector('.percentage'),percentage
    let Ttl = Object.keys(grp).map(function (key) {
        return grp[key].total
    })
    let first = grp[Object.keys(grp)[0]].total,last = grp[Object.keys(grp)[Object.keys(grp).length - 1]].total; 
    percentage = Math.round((((last - first) / first) * 100),2)
    if (first > last) {
        percentageHolder.classList.add('text-danger')
        percentageHolder.innerHTML = `<span class="center">
                <i class='bx bx-chevron-down'></i>
            </span> <span class="center">${percentage}%</span></small>`
    }else if (first < last) {
        percentageHolder.classList.add('text-success')
        percentageHolder.innerHTML = `<span class="center">
                <i class='bx bx-chevron-up'></i>
            </span> <span class="center">${percentage}%</span></small>`

    }else{
        percentageHolder.classList.add('text-success')
        percentageHolder.innerHTML = `<span class="center">
                <i class='bx bx-chevron-up'></i>
            </span> <span class="center">${percentage}%</span></small>`
    }
    patientNholder.classList.remove('block')
    patientNholder.classList.add('flex')
    patientNholder.innerHTML = `<h3 class="mb-0 pn-holder">${adcm(Ttl.reduce((a,c)=> a+c))}</h3><span class="dgray px-5p">Patients</span>`
    let patientsChartOptions =  {
        chart: { height: 200, type: "area", toolbar: { show: !1 }, sparkline: { enabled: !0 } },
        dataLabels: { enabled: !1 },
        stroke: { width: 2},
        legend: { show: !1 },
        markers: {
            size: 6,
            colors: "transparent",
            strokeColors: "transparent",
            strokeWidth: 4,
            discrete: [{ fillColor: config.colors.white, seriesIndex: 0, dataPointIndex: 7, strokeColor: config.colors.primary, strokeWidth: 2, size: 6, radius: 8 }],
            hover: { size: 7 },
        },
        grid: { show: !1, padding: { right: 8 } },
        colors: [config.colors.primary],
        fill: { type: "gradient", gradient: { shade: s, shadeIntensity: 0.8, opacityFrom: 0.8, opacityTo: 0.25, stops: [0, 85, 100] } },
        dataLabels: { enabled: !1 },
        stroke: { width: 2 },
        series: [{ name:'patients', data: Ttl }],
        xaxis: { categories: Object.keys(grp), show: !1, lines: { show: !1 }, labels: { show: !1 }, stroke: { width: 0 }, axisBorder: { show: !1 } },
        yaxis: { stroke: { width: 0 }, show: !1 },
    }
    var patientsChart = patientsDiv.querySelector("#patientsChart")
    removeLoadingTab(patientsChart)
    patientsChart.innerHTML = null
    var patientsChart = new ApexCharts(patientsChart, patientsChartOptions);
    patientsChart.render();
}
async function computeComp(page){
    let Conts = Array.from(page.querySelectorAll('.typesHol')),target = Conts.find(function (elem) {
        return elem.classList.contains('active')
    }),inputs,start,stop
    if (!target) return 0;
    inputs = Array.from(target.querySelectorAll('input')) 
    for (const input of inputs) {
        if (!input.value.trim()) {
            return 0
        }else if (inputs[0].value > inputs[1].value) {
            return 0
        }
    }
    start = inputs[0].value,stop = inputs[1].value
    if (target.getAttribute('data-id') == 'year') {
        start = `${start}-01-01 00:00:00`
        stop = `${stop}-12-31 00:00:00`
    }else if (target.getAttribute('data-id') == 'month') {
        start = `${start}-01 00:00:00`
        stop = `${stop}-31 00:00:00`
        
    }
    if (target.getAttribute('data-id') == 'date') {
        start = `${start} 00:00:00`
        stop = `${stop} 00:00:00`
    }
    let  leTime = DateTime.now();
    leTime = leTime.setZone('Africa/Kigali');
    leTime = leTime.toString();
    
    if (start > leTime) {
        return 0
    }
    postschema.body = JSON.stringify({
        token: getdata('token'),
        range: {
            start,
            stop,
        },
        compType: target.getAttribute('data-id')
        
    })
    const insights = await request('insights',postschema);
    extra = insights.message
    if (!insights.success) {
        return alertMessage(insights.message)
    }
    comparison = target.getAttribute('data-id')
    drawPatientsChart(extra.groupByDates)
    drawMainChart(extra.groupByHps,comparison)
}
function generateViewBy(type,data,container) {

    if (type == 'groupByTests') {
        let Tests = Object.keys(data)
        container.innerHTML = null
        Tests.forEach((test)=>{
            let button = document.createElement('button');
            button.className = 'capitalize theme bc-tr-theme btn btn-sm my-4p mx-2p'
            button.innerText = `${test}'s results`
            button.setAttribute('data-role',"custom-buttns")
            button.id = `${test}`
            container.appendChild(button)
            
        })
        let buttons = Array.from(container.querySelectorAll('button'))
        buttons.map(function (b) {
            b.onclick = function (event) {
                event.preventDefault()
                let test = this.id
                let testData = data[test].resultsCounts,grp = {}
                testData.map(function (data) {
                    Object.assign(grp,{[data.name]: {total: data.total}})
                })
                drawMainChart(grp,null)
                changeBtnBrdrClr(this)
            }
        })
    }else{
        container.innerHTML = null
        aDePh(container)
    }
}
function makeDiagsInsights(results,thingtoclone) {
    let parent = document.querySelector('div#resInsights')
    parent.innerHTML = null
    for (const result of Object.keys(results)) {
        let resCard = thingtoclone.cloneNode(true)
        // drawChartForRes(chartArea)
        resCard.querySelector('.name').innerText = result
        resCard.querySelector('.total').innerText = adcm(results[result].total)
        parent.appendChild(resCard)
    }
    if(Object.keys(results).length == 0){
        aDePh(thingtoclone.parentElement)
    }
    deletechild(thingtoclone,thingtoclone.parentElement)
}
