import { RemoveAuthDivs, addLoadingTab, addsCard, addshade, alertMessage, calcTime, deletechild, getPath, getdata, postschema, request, showAvaiAssurances, showAvaiEmps } from "./functions.controller.js";
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
export function addUprofile(data){
  e = addshade();
  a = document.createElement('div')
  e.appendChild(a)
  b = ``;
  q = ``
  window.addEventListener('urlchange', function() {
      deletechild(e,e.parentElement)
  })
  for (const assurance of data.assurances) {
    b+= `
      <li class="ls-none flex p-5p bsbb">
        <span class="fw-semibold mx-2">Name:</span> <span>${assurance.name}</span>
      </li>
      <li class="ls-none flex p-5p bsbb">
        <span class="fw-semibold mx-2">Number:</span> <span>${assurance.number || 'N/A'}</span>
      </li>
      <li class="ls-none flex p-5p bsbb">
        <span class="fw-semibold mx-2">Status:</span> <span class="br-5p py-2p px-10p bsbb ${(assurance.eligibility == 'eligible') ?  'bc-tr-green green' : 'bc-tr-red red' }">${assurance.eligibility}</span>
      </li>
    `
  }
  for (const beneficiary of data.beneficiaries) {
    q+= `
      <li class="ls-none flex p-5p bsbb benef hover-6" data-id="${beneficiary.id}">
        <span class="px-5p"><i class="dgray bx bx-user"></i></span><span class="capitalize fw-semibold">${beneficiary.name}</span>
      </li>
    `
  }
  if (data.householder) {
    q = `
    <li class="ls-none flex p-5p bsbb benef hover-6" data-id="${data.householder.id}">
      <span class="px-5p"><i class="dgray bx bx-user"></i></span><span class="capitalize fw-semibold">${data.householder.name}</span>
    </li>
  `
  }
  data.dob = ` ${new Date(data.dob).getDay()}/${new Date(data.dob).getMonth()}/${new Date(data.dob).getFullYear()}`
  if (!b) b = ` <li class="ls-none flex p-5p bsbb"><span class="btn btn-sm btn-label-danger">N/A</span></li>`
  if (!q) q = ` <li class="ls-none flex p-5p bsbb"><span class="btn btn-sm btn-label-secondary">N/A</span></li>`

  a.className = "w-80 h-80 p-20p bsbb ovh bc-white cntr zi-10000 br-10p card-5 b-mgc-resp"
  a.innerHTML = `
    <div class="p-5p bsbb ovys w-100 h-100">
      <div class="row h-100 w-100">
        <div class="col-xl-4 col-lg-5 h-100 ovh col-md-5 ovh">
            <!-- About User -->
            <div class=" mb-4 ovh h-100">
                <div class="card-body h-100 ovys scroll-2">
                    <small class="text-muted text-uppercase">About</small>
                    <ul class="list-unstyled mb-4 mt-3">
                        <li class="d-flex align-items-center mb-3">
                          <i class="dgray bx bx-user"></i><span class="fw-semibold dgray mx-2">Full Name:</span> <span class="capitalize">${data.Full_name}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3">
                          <i class="dgray fas fa-venus-mars"></i><span class="fw-semibold dgray mx-2">Gender:</span> <span class="capitalize">${data.gender}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3">
                          <i class="dgray bx bx-calendar"></i><span class="fw-semibold dgray mx-2">DOB:</span> <span>${data.dob}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3">
                          <i class="dgray far fa-id-card"></i><span class="fw-semibold dgray mx-2">NID:</span> <span>${data.nid}</span>
                        </li>
                        <li class="align-items-center mb-3">
                          <i class="dgray fas fa-hand-holding-medical"></i><span class="fw-semibold dgray mx-2">Insurance(s):</span> <span class="block">
                            <ul>
                              ${b}
                            </ul>
                              </span>
                        </li>
                        <li class="align-items-center mb-3">
                        <i class="dgray fas fa-users"></i><span class="fw-semibold dgray mx-2">${(data.role == 'householder')? 'Beneficiaries:': 'Parent' }</span> <span class="block">
                            <ul class="px-3p">
                              ${q}
                            </ul>
                            </span>
                        </li>
                        <small class="text-muted text-uppercase"><i class="dgray fas fa-map-marker-alt pr-10p"></i> <span class="iblock mt--5p">Location</span></small>
                        <li class="d-flex align-items-center mb-3 mt-5p">
                            <i class="dgray bx bx-check"></i><span class="fw-semibold dgray mx-2">Province:</span> <span>${data.province}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="dgray bx bx-check"></i><span class="fw-semibold dgray mx-2">District:</span> <span>${data.district}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="dgray bx bx-check"></i><span class="fw-semibold dgray mx-2">Sector:</span> <span>${data.sector}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="dgray bx bx-check"></i><span class="fw-semibold dgray mx-2">Cell:</span> <span>${data.cell}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="dgray bx bx-check"></i><span class="fw-semibold dgray mx-2">Status:</span> <span>${data.status}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="dgray fas fa-user-tag"></i><span class="fw-semibold dgray mx-2">Title:</span> <span>patient</span>
                        </li>
                    </ul>
                    <small class="text-muted text-uppercase">Contacts</small>
                    <ul class="list-unstyled mb-4 mt-3">
                        <li class="d-flex align-items-center mb-3"><i class="dgray bx bx-phone"></i><span class="fw-semibold dgray mx-2">Phone number:</span> <span>${data.phone}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3"><i class="dgray bx bx-envelope"></i><span class="fw-semibold dgray mx-2">Email:</span>
                            <span>${data.email}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!--/ About User -->
        </div>
        <div class="col-xl-8 col-lg-7 h-100 ovh col-md-7">
            <!-- Activity Timeline -->
            <div class="br-5p h-100 ovh">
                <div class="py-20p h-70p">
                    <h5 class="card-action-title mb-0 left dgray"><span class="center-2"><span class="center"><i class="dgray fas fa-file-medical pr-10p"></i></span><span class="capitalize">medical history</span></span></h5>
                </div>
                <div class="p-10p p-r w-100 h-90 ovys scroll-2" id="mh-body">
                    
                </div>
            </div>
        </div>
      </div>
    </div>`
    let beneficiaries = Array.from(a.querySelectorAll('li.benef'))
    for (const benef of beneficiaries) {
        benef.addEventListener('click',async function(event){
            event.preventDefault();
            this.classList.add('selected')
            let beneficiary = this.getAttribute('data-id');
            addLoadingTab(a)
            r = await request(`patient/${beneficiary}`,postschema)
            if (!r.success) return alertMessage(r.message)
            deletechild(a.parentNode,a.parentNode.parentNode)
            let url = new URL(window.location.href);
            url.pathname = `/${getPath()[0]}/search-patient/${beneficiary}`;
            window.history.pushState({},'',url.toString())
          if (getPath()[0] == 'receptionist') {
            uprofileStf(r)
          }else{
            addUprofile(r.message)
          }
          });
      }
  let mhBody = a.querySelector('div#mh-body')
  addLoadingTab(mhBody)
  let loadMH = document.createElement(`div`);
  loadMH.classList = `p-a zi-100 cntr mt-50p`
  loadMH.innerHTML = `<button class="btn btn-primary">Load medical history</button>`
  let loadMHButton = loadMH.querySelector('button')
  loadMHButton.onclick = async function (event) {
    event.preventDefault();
    
      postschema.body = JSON.stringify({
        token: getdata('token')
      })
      loadMHButton.innerText == `Loading...`
      loadMHButton.setAttribute('disabled',true)
      r = await request(`get-user-medical-history/${data.id}`,postschema)
      if (!r.success) {
        loadMHButton.innerText == `load medical history`
        loadMHButton.removeAttribute('disabled')
        return alertMessage(r.message)
      }
      RemoveAuthDivs()
      mhBody.innerHTML  = null
      let mhHol = document.createElement('ul')
      mhHol.className = `timeline w-100 ls-none px-5p bsbb`
      mhBody.appendChild(mhHol);
      for (const mh of r.message) {
        let li = document.createElement('li')
        li.className = `timeline-item hover-2 hover-7 px-10p py-5p bsbb my-10p br-5p`
        li.setAttribute('data-id',mh.session_id)
        li.innerHTML = ` <span class="timeline-point timeline-point-info"></span>
        <div class="p-2p bsbb">
            <div class="timeline-header mb-1">
                <h6 class="mb-0 dgray">#${mh.session_id} <i class="fas fa-external-link-alt px-5p"></i></h6>
                <small class="text-muted">${calcTime(mh.dateadded)}</small>
            </div>
            <p class="mb-0 text-muted">session at ${mh.hp_info.name}</p>
        </div>`
        mhHol.appendChild(li)
      }
      let lis  = Array.from(mhHol.querySelectorAll('li'))
      lis.forEach(li=>{
        li.addEventListener('click', event=>{
          event.preventDefault();
          let url = new URL(window.location.href);
          url.pathname = `/${getPath()[0]}/view-session/${li.getAttribute('data-id')}`;
          window.history.pushState({},'',url.toString())
          deletechild(e,e.parentNode)
          const evnt = new Event('urlchange', { bubbles: true });
          window.dispatchEvent(evnt);
        })
      })
  }
  mhBody.appendChild(loadMH)
  return a
}
export async function uprofileStf(r,users) {
  d = addUprofile(r.message);
  x = document.createElement('div')
  d.appendChild(x)
  x.className = `p-f b-0 p-20p bsbb zi-1000 center w-100 l-0`
  x.innerHTML = `<button type="button" class="btn rounded-pill btn-primary capitalize">notify consultant</button>` 
  x = x.querySelector('button');
  let a = await showAvaiAssurances(r.message.assurances)
  l = Array.from(a.querySelectorAll('li.assurance'))
  for (const lis of l) {
    lis.addEventListener('click',async function(event){
        event.preventDefault();
        this.classList.add('selected')
        let assurance = this.getAttribute('data-id');
        if (assurance == "null") {
          assurance = null
        }
        r.message.assurances = assurance
        deletechild(a,a.parentNode)
        addsCard('Assurance Selected',true)
      });
  }
  x.addEventListener('click',async event=>{
      event.preventDefault()
      let emps = await showAvaiEmps(users);
     if ('object' == typeof emps) {
      j = JSON.parse(postschema.body)
      Object.assign(j,
          {
              title:'incoming patient',
              receiver: emps,
              type: 'p_message', 
              content: `there is an incoming patient called ${r.message.Full_name}`,
              extra: {
                  name: r.message.Full_name,
                  patient: r.message.id,
                  nid:r.message.nid,
                  assurance: r.message.assurances
              },
              controller: {
                  looping: true,
                  recipients: emps
              }
          }
      )
      postschema.body = JSON.stringify(j)
      x.setAttribute('disabled',true)
      x.innerText = 'notifying the receiver...'
      r =  await request('send-message',postschema)
      x.removeAttribute('disabled')
      x.innerText = 'consultant notified !'
      x.classList.replace('btn-primary','btn-success')
      deletechild(d.parentNode,d.parentNode.parentNode)
      addsCard('consultant notified !',true)
     }else{
      j = JSON.parse(postschema.body)
      Object.assign(j,
          {
              title:'incoming patient',
              receiver: emps,
              type: 'p_message', 
              content: `there is an incoming patient called ${r.message.Full_name}`,
              extra: {
                  name: r.message.Full_name,
                  patient: r.message.id,nid:r.message.nid,
                  assurance: r.message.assurances
              },
              controller: {
                  looping: false,
                  recipients: []
              }
          }
      )
      postschema.body = JSON.stringify(j)
      x.setAttribute('disabled',true)
      x.innerText = 'notifying the receiver...'
      r =  await request('send-message',postschema)
      x.removeAttribute('disabled')
      x.innerText = 'consultant notified !'
      x.classList.replace('btn-primary','btn-success')
      deletechild(d.parentNode,d.parentNode.parentNode)
      addsCard('consultant notified !',true)
     }
  }) 
}
