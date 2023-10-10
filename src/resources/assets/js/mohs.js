import { postschema, request,alertMessage, getdata,getschema, animskel, deletechild,getPath,cpgcntn, sessiondata, calcTime,DateTime,geturl, adcm, removeLoadingTab} from "../../../utils/functions.controller.js"
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
import userinfo from "./nav.js"
import {config} from "./config.js"
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
            const socket = io(geturl(),{ query : { id: z.id} });
            socket.on('connect', () => {
            console.log('Connected to the server');
            });
            
            socket.on('message', (message) => {
                pushNotifs(message);
                addsCard(message.title,true)

            });
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
    let extra = insights.message
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
    async function gsd(page,extra) {
        try {
            x = page.id
            if (x == 'my-account') {
                n = page.querySelector('span.name')
                z = getdata('userinfo')
                n.textContent = z.Full_name
                i = page.querySelector('span.n-img');
                i.textContent = z.Full_name.substring(0,1)
                let editbuts = Array.from(page.querySelectorAll('span.icon-edit-icon'))
                for (const button of editbuts) {
                    button.addEventListener('click',()=>{
                        l = button.getAttribute('data-target')
                        shedtpopup(l,r);
                    })
                }
          
            }else if (x == 'home') {
                let patientsDiv = document.querySelector('div.patientsDiv'),patientNholder = patientsDiv.querySelector('h3.pn-holder'),customBttns = Array.from(page.querySelectorAll(`[data-role="custom-buttns"]`)),BttnsHol = Array.from(page.querySelectorAll('div.BttnsHol')),shades = Array.from(page.querySelectorAll('div[data-role="shade"]')),parents= []
                let total = Object.keys(extra.groupByHps).map(function (key) {
                    return extra.groupByHps[key].total
                }),{avaiGroupings} = extra
                BttnsHol.forEach(container=>{
                    if (container.id == 'groupByBttnsHol') {
                        removeLoadingTab(container)
                        for (const group of avaiGroupings) {
                            let but = document.createElement('button');
                            but.setAttribute('data-target','groupBy');
                            but.setAttribute('type','button');
                            but.setAttribute('data-role','custom-buttns');
                            but.className = `capitalize btn-label-primary btn btn-sm my-4p mx-2p`
                            but.innerText = group
                            but.id = (group == 'provinces')? 'groupByProvinces': (group == 'districts')? 'groupByDistricts': (group == 'sectors')? 'groupBySectors': (group == 'cells')? 'groupByCells': (group == 'health facilities')? 'groupByHps': '';
                            container.appendChild(but);
                            (group == 'health facilities')? but.classList.add('b-1-s-theme'): '';
                            
                        }
                        customBttns = Array.from(page.querySelectorAll(`[data-role="custom-buttns"]`))  
                        addCustomBttnsFunc(customBttns)
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
                                drawMainChart(extra[id])
                            }
                            changeBtnBrdrClr(this)
                        }
                    });
                }
                patientNholder.innerText = adcm(total.reduce((a,c)=> a+c))
                drawMainChart(extra.groupByHps)
                    let patientsChartOptions =  {
                        chart: { height: 80, type: "area", toolbar: { show: !1 }, sparkline: { enabled: !0 } },
                        markers: {
                            size: 6,
                            colors: "transparent",
                            strokeColors: "transparent",
                            strokeWidth: 4,
                            discrete: [{ fillColor: config.colors.white, seriesIndex: 0, dataPointIndex: 6, strokeColor: config.colors.success, strokeWidth: 2, size: 6, radius: 8 }],
                            hover: { size: 7 },
                        },
                        grid: { show: !1, padding: { right: 8 } },
                        colors: [config.colors.success],
                        fill: { type: "gradient", gradient: { shade: s, shadeIntensity: 0.8, opacityFrom: 0.8, opacityTo: 0.25, stops: [0, 85, 100] } },
                        dataLabels: { enabled: !1 },
                        stroke: { width: 2 },
                        series: [{ data: [180, 175, 275, 140, 205, 190, 295] }],
                        xaxis: { show: !1, lines: { show: !1 }, labels: { show: !1 }, stroke: { width: 0 }, axisBorder: { show: !1 } },
                        yaxis: { stroke: { width: 0 }, show: !1 },
                    }
                    var patientsChart = new ApexCharts(patientsDiv.querySelector("#patientsChart"), patientsChartOptions);
                    patientsChart.render();
                    let results = extra.groupByResults,thingtoclone = document.querySelector('div.resCard')
                
                    for (const result of Object.keys(results)) {
                        let resCard = thingtoclone.cloneNode(true)
                        // drawChartForRes(chartArea)
                        resCard.querySelector('.name').innerText = result
                        resCard.querySelector('.total').innerText = adcm(results[result].total)
                        thingtoclone.parentNode.appendChild(resCard)
                    }
                    deletechild(thingtoclone,thingtoclone.parentElement)
                    let rankingsDivs = Array.from(document.querySelectorAll('div.ranks'))
                    rankingsDivs.forEach(div=>{
                        prepT(div,div.id,extra[div.getAttribute('data-to-hold')])
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
function prepT(container,id,Obj) {
    if (id == 'rankByHps') {
      let total = Object.keys(Obj).map(function (key) {
          return Obj[key].total
      })
      let ranksHol = container.querySelector('#ranks-cont'),
      thingtoclone = ranksHol.querySelector('li'),thecont,data,mainTotal = container.querySelector('#mainTotal')
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
      deletechild(thingtoclone,thingtoclone.parentElement)

    }else if(id == 'rankByDiags'){
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
   console.log(subConts.indexOf(target))
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
function drawMainChart(grp) {
    let total = Object.keys(grp).map(function (key) {
        return grp[key].total
    })
    var mainChartOptions = {
        series: [
            { name: "Patients", data:  total},
        ],
        chart: { height: 300, stacked: !0, type: "bar", toolbar: { show: !1 } },
        plotOptions: { bar: { horizontal: !1, columnWidth: "33%", borderRadius: 5} },
        colors: [config.colors.primary],
        dataLabels: { enabled: !1 },
        legend: { show: !0, horizontalAlign: "left", position: "top", markers: { height: 8, width: 8, radius: 12, offsetX: -3 }, labels: { colors: e }, itemMargin: { horizontal: 10 } },
        xaxis: { categories: Object.keys(grp), labels: { style: { fontSize: "13px", colors: t } }, axisTicks: { show: !1 }, axisBorder: { show: !1 } },
        states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
    }
var mainChart = document.querySelector("#mainChart")
mainChart.innerHTML = null
mainChart = new ApexCharts(mainChart, mainChartOptions);
mainChart.render(); 
}