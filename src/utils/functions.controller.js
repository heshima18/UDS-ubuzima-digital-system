var q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
export async function request(url,options){
    try {
      let z = await fetch(geturl() +url,options);
      let y = await z.json();
      return y;
    } catch (error) {
      return {success:false, message:'an error occured while connecting to the server'}
    }
}
export const postschema = {
    mode: 'cors',
    method: "POST",
    body: null,
    headers: {
      "content-type": "application/json",
      'accept': '*/*'

    }
}
export const getschema =  {
    mode: 'cors',
    method: "GET",
    headers: {
      "content-type": "application/json",
      'accept': '*/*'

    }
}
export function geturl() {
  let i = new URL(window.location.href)
  return i.origin+'/'
}
export function addshade(){
  let body = document.querySelector('div#body');
  let thebody = document.querySelector('div.cont'); 
  var shaddow = document.createElement('div');
  thebody.appendChild(shaddow);
  shaddow.className = "w-100 h-100 ovh p-f bsbb bc-tblack t-0 zi-10000 blur";	
  var close = document.createElement('div');
  close.className = "p-a t-0 r-0 w-50p h-50p m-20p center ovh";
  close.innerHTML = `<span class='w-100 h-100 white p-10p bsbb center '><font class='fs-50p white w-100 p-r hover-2'><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g><g><line fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g></svg></font></span>`;
  shaddow.appendChild(close)
  close.addEventListener('click',e=>{
	  e.preventDefault();
   body.classList.remove('blur')
		closetab(shaddow,thebody);
	});
  document.body.classList.add('ovh');
  return shaddow;
}
export function closetab(element,parent){
  try {
    parent.removeChild(element); 
    document.body.classList.remove('ovh')
  } catch (error) {
    
  }
}
export function alertMessage(message){
  q =  addshade();
  a = document.createElement('div')
  q.removeChild(q.firstChild)
  q.appendChild(a)
  a.className = "w-300p h-a p-20p bsbb bc-white cntr zi-10000 br-10p card-5" 
  a.innerHTML = `<div class="head w-100 h-40p p-5p bsbb bb-1-s-dg"><span class="fs-18p black capitalize igrid center h-100 verdana">message</span></div><div class="body w-100 h-a p-5p grid center mt-10p"><span class="fs-15p dgray capitalize left verdana">${message}</span></div><div class="mssg-footer w-100 h-30p mt-10p  bsbb center-2"><span class="w-60p br-2p hover-2 h-a bc-theme p-5p white capitalize verdana center accept">ok</span></div>`;
  let accept = a.querySelector('span.accept')
  let body = document.querySelector('div#body'); 
  let thebody = document.querySelector('div.cont'); 
  accept.addEventListener('click',e=>{
    body.classList.remove('blur')
		closetab(q,thebody);
	});
}
export function getdata(item){
  let v
  try {
    v = JSON.parse(localStorage.getItem(item));
    return v
  } catch (error) {
    v = localStorage.getItem(item);
    if (v) {
      return v
    }
    return null 
  }
}
export function setErrorFor(input,message) {
  try{
    const rep = input.parentElement;
    const small = rep.querySelector('small');
    small.classList.remove('hidden');
    small.innerText = message;
    s = rep.querySelector('span')
    rep.classList.remove('success');
    rep.classList.add('error');
  }catch(error){
    console.log(error)
  }
  
}
export function setSuccessFor(input) {
  const rep = input.parentElement;
  rep.classList.remove('error');
  rep.classList.add('success');
  const small = rep.querySelector('small');
  small.classList.add('hidden');
  small.textContent = null
}
export function checkEmpty(input){
  try {
    if (input.classList.contains('chips-check')) {
      let chipshol = input.parentElement.querySelector('div.chipsholder');
      if (!chipshol) {
        setErrorFor(input,`please ${(input.tagName == "SELECT")? 'select' : 'enter'} the ${input.name}`)
        return 0
      }
      let chips = Array.from(chipshol.querySelectorAll('span.chip'))
      if (chips.length == 0) {
       setErrorFor(input,`please ${(input.tagName == "SELECT")? 'select' : 'enter'} the ${input.name}`)
        return 0
      }else{
          setSuccessFor(input)
        return 1
      }
    }else{
      if (input.value == '' || input.value == '+250') {
          setErrorFor(input,`please ${(input.tagName == "SELECT")? 'select' : 'enter'} the ${input.name}`)
        return 0
      }else{
          setSuccessFor(input)
        return 1
      }
    }
  } catch (error) {
    
  }
}
export async function initializeCleave(phoneElement, idElement) {
  const phoneNumber = new Cleave(phoneElement, { phone: true, phoneRegionCode: "RW", prefix: '+250' });
  if (idElement) {
    const nationalID = new Cleave(idElement, {
        numericOnly: true,
        blocks: [1, 4, 1, 7, 1, 2],
        delimiter: ' ',
        delimiterLazyShow: true,
        onValueChanged: function (e) {
            const formattedValue = e.target.rawValue;
            if (formattedValue.length > 16) {
                nationalID.setRawValue(formattedValue.substring(0, 16));
            }
        }
    });
  }
}
export function showRecs(input, data,type) {
  try {
    
    let div =  document.createElement('div');
    let parent = input.parentNode
    let chipsHolder = parent.querySelector('div.chipsholder')
    if (!chipsHolder) {
      chipsHolder = document.createElement('div');
      chipsHolder.className = 'chipsholder p-5p bsbb w-100'
      chipsHolder.title = type
      parent.insertAdjacentElement('beforeEnd',chipsHolder)
    }
    parent.appendChild(div)
    div.className = `p-a w-300p h-250p bsbb card-2 zi-1000 bc-white scroll-2 ovys t-0 mt-70p br-5p`
    div.innerHTML = `<div class="w-100 h-100 p-5p bsbb"><ul class="ls-none p-0 m-0"></ul></div>`
    for(const info of data){
      let item = document.createElement('li');
      item.className = 'hover p-10p bsbb w-100 item'
      item.textContent = info.name
      item.setAttribute('data-id',info.id)
      div.querySelector('ul').appendChild(item)
    }
    let items = div.querySelectorAll('li.item')
    items.forEach(item =>{
     item.addEventListener('click', (e)=>{
      if (input.classList.contains('chips-check')) {
        addChip({name:item.textContent, id: item.getAttribute('data-id')},chipsHolder)
      }else if (input.classList.contains('bevalue')) {
        input.value = item.textContent
        input.setAttribute('data-id',item.getAttribute('data-id'))
      }
     })
    })
    input.onblur = function () {
      setTimeout(e=>{parent.removeChild(div)},200)
    }
    input.onkeyup = function () {
     let value = this.value.trim();
     items.forEach(item =>{
      if (item.textContent.indexOf(value) == -1) {
        item.classList.add('hidden')
      }else{
        item.classList.remove('hidden')
        if (input.classList.contains('bevalue') && input.value == item.textContent) {
          input.value = item.textContent
          input.setAttribute('data-id',item.getAttribute('data-id'))
        }
  
      }
     })
    }
  } catch (error) {
    
  }

}
export function addChip(info,parent) {
  c = document.createElement('span')
  c.className = 'w-a h-a b-1-s-gray br-2p pr-20p pt-5p pb-5p pl-5p m-5p fs-13p iblock chip p-r verdana dgray consolas  ';
  r = document.createElement('div');
  r.className = "w-20p h-20p p-a right bc-white remove m-5p  b-1-s-gray center br-50 hover t-0 r-0"
  r.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#000" stroke-width="1" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"></line></g><g><line fill="none" stroke="#000" stroke-width="1" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"></line></g></svg>`
  c.innerHTML = `<span class="p-5p bsbb consolas dgray fs-12p" data-id= "${info.id}">${info.name}</span></span> `
  c.appendChild(r)
  let found = 0
  for(const chip of parent.childNodes){
      if (chip) {
          t = chip.childNodes[0]
          if (t && t.textContent == info.name) {
           found = 1  
          }
      }
  }
  (!found)? parent.appendChild(c): null
  r = Array.from(document.querySelectorAll('div.remove'));
  r.forEach(remove=>{
      remove.addEventListener('click',e=>{
          e.preventDefault();
          try {
          deletechild(remove.parentNode,parent)
          l = Array.from(parent.querySelectorAll('span.chip'))
          if(l.length == 0){
              deletechild(parent.parentNode,parent)
          }
          } catch (error) {
              console.log(error)
          }
          
      })
  })
}
export function getchips(parent) {
  c = Array.from(parent.querySelectorAll('span.chip'))
  let d
  d = []
  for (const chip of c) {
      d.push(chip.querySelector('span').getAttribute('data-id'))
  }
  return d
}
export function deletechild(element,parent) {
  try {
    parent.removeChild(element);
  } catch (error) {
    
  }
}
export function cdcts(entries,field,type) {
  field.innerHTML = `<option value="">Select ${type}</option>`
  for (const entry of entries) {
      o = document.createElement('option')
      o.innerText = entry.name
      o.value = entry.id
      o.setAttribute('data-id',entry.id)
      field.appendChild(o)    
  }
}
export function getParam(param) {
  let i = new URL(window.location.href)
  console.log(i)
  let val = i.searchParams.get(param)
  return val
  
}
export function getPath(index) {
  let i = new URL(window.location.href)
  i = i.pathname
  i = i.split('/')
  // i.pop()
  i.shift()
  console.log(i)
  return i[index]
  
}
export function addUprofile(data){
  e = addshade();
  a = document.createElement('div')
  e.appendChild(a)
  b = ``
  for (const assurance of data.assurances) {
    b+= `
      <li class="ls-none flex p-5p bsbb">
        <span class="fw-semibold mx-2">Name:</span> <span>${assurance.name}</span>
      </li>
      <li class="ls-none flex p-5p bsbb">
        <span class="fw-semibold mx-2">Number:</span> <span>${assurance.number}</span>
      </li>
      <li class="ls-none flex p-5p bsbb">
        <span class="fw-semibold mx-2">Status:</span> <span class="${(assurance.eligibility == 'eligible') ?  'btn btn-sm btn-label-success' : 'btn btn-sm btn-label-danger' }">${assurance.eligibility}</span>
      </li>
    `
  }
  console.log(new Date(data.dob).getFullYear() ,new Date(data.dob).getMonth(), new Date(data.dob).getDay())
  data.dob = ` ${new Date(data.dob).getDay()}/${new Date(data.dob).getMonth()}/${new Date(data.dob).getFullYear()}`
  if (!b) b = ` <li class="ls-none flex p-5p bsbb"><span class="btn btn-sm btn-label-danger">N/A</span></li>`
  a.className = "w-80 h-80 p-20p bsbb ovh bc-white cntr zi-10000 br-10p card-5 b-mgc-resp"
  a.innerHTML = `
    <div class="p-5p bsbb ovys w-100 h-100">
      <div class="row">
        <div class="col-xl-4 col-lg-5 col-md-5">
            <!-- About User -->
            <div class=" mb-4">
                <div class="card-body">
                    <small class="text-muted text-uppercase">About</small>
                    <ul class="list-unstyled mb-4 mt-3">
                        <li class="d-flex align-items-center mb-3">
                          <i class="bx bx-user"></i><span class="fw-semibold mx-2">Full Name:</span> <span>${data.Full_name}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3">
                          <i class="bx bx-detail"></i><span class="fw-semibold mx-2">Gender:</span> <span>${data.gender}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3">
                          <i class="bx bx-detail"></i><span class="fw-semibold mx-2">DOB:</span> <span>${data.dob}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3">
                          <i class="bx bx-check"></i><span class="fw-semibold mx-2">NID:</span> <span>${data.nid}</span>
                        </li>
                        <li class="align-items-center mb-3">
                          <i class="bx bx-detail"></i><span class="fw-semibold mx-2">Assurances:</span> <span class="block">
                            <ul>
                              ${b}
                            </ul>
                             </span>
                        </li>
                        <li class="d-flex align-items-center mb-3">
                            <i class="bx bx-check"></i><span class="fw-semibold mx-2">Province:</span> <span>${data.province}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="bx bx-check"></i><span class="fw-semibold mx-2">District:</span> <span>${data.district}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="bx bx-check"></i><span class="fw-semibold mx-2">Sector:</span> <span>${data.sector}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="bx bx-check"></i><span class="fw-semibold mx-2">Cell:</span> <span>${data.cell}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="bx bx-check"></i><span class="fw-semibold mx-2">Status:</span> <span>${data.status}</span>
                        </li><li class="d-flex align-items-center mb-3">
                          <i class="bx bx-star"></i><span class="fw-semibold mx-2">Title:</span> <span>patient</span>
                        </li>
                    </ul>
                    <small class="text-muted text-uppercase">Contacts</small>
                    <ul class="list-unstyled mb-4 mt-3">
                        <li class="d-flex align-items-center mb-3"><i class="bx bx-phone"></i><span class="fw-semibold mx-2">Phone number:</span> <span>${data.phone}</span>
                        </li>
                        <li class="d-flex align-items-center mb-3"><i class="bx bx-envelope"></i><span class="fw-semibold mx-2">Email:</span>
                            <span>${data.email}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!--/ About User -->
        </div>
        <div class="col-xl-8 col-lg-7 col-md-7">
            <!-- Activity Timeline -->
            <div class="card card-action mb-4">
                <div class="card-header align-items-center">
                    <h5 class="card-action-title mb-0"><i class="bx bx-list-ul me-2"></i>Activity
                        Timeline</h5>
                </div>
                <div class="card-body">
                    <ul class="timeline ms-2">
                        <li class="timeline-item timeline-item-transparent">
                            <span class="timeline-point timeline-point-warning"></span>
                            <div class="timeline-event">
                                <div class="timeline-header mb-1">
                                    <h6 class="mb-0">Client Meeting</h6>
                                    <small class="text-muted">Today</small>
                                </div>
                                <p class="mb-2">Project meeting with john @10:15am</p>
                                <div class="d-flex flex-wrap">
                                    <div class="avatar me-3">
                                        <img src="../assets/img/avatars/3.png" alt="Avatar" class="rounded-circle">
                                    </div>
                                    <div>
                                        <h6 class="mb-0">Lester McCarthy (Client)</h6>
                                        <span>CEO of Infibeam</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="timeline-item timeline-item-transparent">
                            <span class="timeline-point timeline-point-info"></span>
                            <div class="timeline-event">
                                <div class="timeline-header mb-1">
                                    <h6 class="mb-0">Create a new project for client</h6>
                                    <small class="text-muted">2 Day Ago</small>
                                </div>
                                <p class="mb-0">Add files to new design folder</p>
                            </div>
                        </li>
                        <li class="timeline-item timeline-item-transparent">
                            <span class="timeline-point timeline-point-primary"></span>
                            <div class="timeline-event">
                                <div class="timeline-header mb-1">
                                    <h6 class="mb-0">Shared 2 New Project Files</h6>
                                    <small class="text-muted">6 Day Ago</small>
                                </div>
                                <p class="mb-2">Sent by Mollie Dixon <img src="../assets/img/avatars/4.png" class="rounded-circle ms-3" alt="avatar" height="20" width="20"></p>
                                <div class="d-flex flex-wrap gap-2">
                                    <a href="javascript:void(0)" class="me-3">
                                        <img src="../assets/img/icons/misc/pdf.png" alt="Document image" width="20" class="me-2">
                                        <span class="h6">App Guidelines</span>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <img src="../assets/img/icons/misc/doc.png" alt="Excel image" width="20" class="me-2">
                                        <span class="h6">Testing Results</span>
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li class="timeline-item timeline-item-transparent">
                            <span class="timeline-point timeline-point-success"></span>
                            <div class="timeline-event pb-0">
                                <div class="timeline-header mb-1">
                                    <h6 class="mb-0">Project status updated</h6>
                                    <small class="text-muted">10 Day Ago</small>
                                </div>
                                <p class="mb-0">Woocommerce iOS App Completed</p>
                            </div>
                        </li>
                        <li class="timeline-end-indicator">
                            <i class="bx bx-check-circle"></i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
     </div>
    </div>`
}