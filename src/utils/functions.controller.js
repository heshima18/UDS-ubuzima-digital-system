var q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
import { ConnectDevice, EnrollTemplate, GetTemplate, connectFP } from "./fingerprint.controller.js";
import { DateTime } from "/getLuxon/luxon.js";
export {DateTime}
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
		closetab(shaddow,thebody);
	});
  return shaddow;
}
export function addLoadingTab(parent) {
  try {
    parent.classList.remove('ovys')
    parent.classList.add('ovh')
    var shaddow = document.createElement('div');
    parent.insertBefore(shaddow,parent.firstChild);
    shaddow.className = "w-100 h-100 ovh p-a bsbb bc-white t-0 blur shaddow zi-20";
    shaddow.setAttribute('data-role','shade')	
    var loading = document.createElement('div');
    loading.className = "p-a cntr w-70p h-70p ovh";
    loading.innerHTML = `<div class="sk-grid sk-primary">
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                        </div>`;
    shaddow.appendChild(loading)
    
  } catch (error) {
    console.log(error)
  }
}
export function addInpLoadingTab(input) {
  try {
    var shaddow = document.createElement('div');
    input.parentElement.insertBefore(shaddow,parent.firstChild);
    shaddow.className = "w-100 h-100 ovh p-a bsbb bc-white t-0 blur shaddow zi-20";
    shaddow.setAttribute('data-role','shade')	
    var loading = document.createElement('div');
    loading.className = "p-a cntr w-70p h-70p ovh";
    loading.innerHTML = `<div class="sk-grid sk-primary">
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                          <div class="sk-grid-cube bc-theme"></div>
                        </div>`;
    shaddow.appendChild(loading)
    
  } catch (error) {
    console.log(error)
  }
}
export function removeLoadingTab(parent) {
  try {
    var shaddow = parent.querySelector('.shaddow')
    parent.classList.remove('ovh')
    parent.classList.add('ovys')

    deletechild(shaddow,parent)
  } catch (error) {
  }
}
export function closetab(element,parent){
  try {
    parent.removeChild(element); 
    document.body.classList.remove('ovh')
  } catch (error) {
    
  }
}
export function addSpinner(element) {
  element.setAttribute(`data-innertext`,element.innerHTML)
  element.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
  element.setAttribute('disabled',true)
}
export function removeSpinner(element) {
  element.innerHTML = element.getAttribute(`data-innertext`)
  element.removeAttribute('disabled')

}
export function alertMessage(message){
  let q =  addshade();
  a = document.createElement('div')
  q.removeChild(q.firstChild)
  q.appendChild(a)
  a.className = "w-300p h-a p-20p bsbb bc-white cntr zi-10000 br-10p card-5" 
  a.innerHTML = `<div class="head w-100 h-40p p-5p bsbb bb-1-s-dg"><span class="fs-18p black capitalize igrid center h-100 verdana">message</span></div><div class="body w-100 h-a p-5p grid center mt-10p"><span class="fs-15p dgray capitalize left verdana">${message}</span></div><div class="mssg-footer w-100 h-30p mt-10p  bsbb center-2"><span class="w-60p br-2p hover-2 h-a bc-theme p-5p white capitalize verdana center accept">ok</span></div>`;
  let accept = a.querySelector('span.accept')
  accept.addEventListener('click',e=>{
		deletechild(q,q.parentNode)
	});
  document.onkeyup = function (event) {
    if (event.key == " ") {
      deletechild(q,q.parentNode)
    }
  }
  return 0
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
export function sessiondata(item){
  let v
  try {
    v = JSON.parse(sessionStorage.getItem(item));
    return v
  } catch (error) {
    v = sessionStorage.getItem(item);
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
    if (input.type == 'radio' || input.type == 'checkbox') {
      return 1
    }
    if (input.classList.contains('optional')) {
      setSuccessFor(input)
      return 1
    }
    if (input.classList.contains('chips-check')) {
      let chipshol = input.parentElement.querySelector('div.chipsholder');
      if (!chipshol) {
        if (input.getAttribute('data-optional')) {
          setSuccessFor(input)
          return 1
        }
        setErrorFor(input,`please ${(input.tagName == "SELECT")? 'select' : 'enter'} the ${input.name}`)
        return 0
      }
      let chips = Array.from(chipshol.querySelectorAll('span.chip'))
      if (chips.length == 0) {
        if (input.getAttribute('data-optional')) {
          return 1
        }
        setErrorFor(input,`please ${(input.tagName == "SELECT")? 'select' : 'enter'} the ${input.name}`)
        return 0
      }else{
          setSuccessFor(input)
        return 1
      }
    }else if (input.classList.contains('bevalue')) {
      if (input.getAttribute('data-id')) {
        setSuccessFor(input)
        return 1
      }else{
        setErrorFor(input,`please ${(input.tagName == "SELECT")? 'select' : 'enter'} the ${input.name}`)
        return 0
      }
    }else if (input.type == 'number') {
      if (input.value <= 0) {
        setErrorFor(input,`please enter the proper value`)
        return 0
      }else{
        setSuccessFor(input)
        return 1
      }
    }else{
      if (input.value == '' || input.value == '+250') {
        if (input.getAttribute('data-optional')) {
          return 1
        }
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
  if (phoneElement) {
    const phoneNumber = new Cleave(phoneElement, { phone: true, phoneRegionCode: "RW", prefix: '+250' });
  }
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
export function initializeSpecialCleave(element,blocks,length,delimitator) {
  const nationalID = new Cleave(element, {
    numericOnly: true,
    blocks,
    delimiter: delimitator || ' ',
    delimiterLazyShow: true,
    onValueChanged: function (e) {
        const formattedValue = e.target.rawValue;
        if (formattedValue.length > length) {
            nationalID.setRawValue(formattedValue.substring(0, length));
        }
    }
  });
}
export function removeRec(input) {
  try {
    let parent = input.parentNode
    let recDivs = Array.from(parent.querySelectorAll('div.rec'))
    recDivs.forEach(div=>{
      deletechild(div,parent)
    })
  } catch (error) {
  }
  
}
export async function triggerRecs(input,datatofetch,socket) {
  let val = input.value.trim();
  val = val.replace(/[^A-Za-z0-9\s]/g, '');
  let payload = {
      needle: val,
      type: 'search',
      entity: input.id,
      datatofetch,
      coltosearch: 'name'

  }
  removeRec(input)
  if (val) {
    socket.emit('searchForRecs',payload)
  }
  let data = await new Promise((resolve, reject) => {
    socket.on('RecsRes', (data)=>{
      resolve(data)
    })
    
  })
  if (data.length) {
    showRecs(input,data,input.id,'noinptAction')
    
  }else{
    removeRec(input)

  }
  return data
}

export function showRecs(input, data,type,noInpAction) {
  try {
    let div =  document.createElement('div');
    let parent = input.parentNode
    div.style.marginTop = parent.offsetHeight + 'px'
    div.className = `p-a w-300p h-250p bsbb card-2 zi-1000 bc-white scroll-2 ovys t-0 br-5p rec`
    div.innerHTML = `<div class="w-100 h-100 p-5p bsbb"><ul class="ls-none p-0 m-0"></ul></div>`
    for(const info of data){
      let item = document.createElement('li');
      item.className = 'hover p-10p bsbb w-100 item capitalize left'
      item.textContent = info.name
      item.setAttribute('data-id',info.id)
      if (type == 'medicines' || type == 'equipments' || type == 'services'|| type == 'tests' || type == 'operations') {
        item.setAttribute('data-price',info.price)
      }
      div.querySelector('ul').appendChild(item)
    }
    let chipsHolder = parent.querySelector('div.chipsholder')
    if (!chipsHolder) {
      chipsHolder = document.createElement('div');
      chipsHolder.className = 'chipsholder p-5p bsbb w-100'
      chipsHolder.title = type
      if (input.classList.contains('chips-check')) {
        parent.insertAdjacentElement('beforeEnd',chipsHolder)
      }
    }
    parent.appendChild(div)
    const items = div.querySelectorAll('li.item')
    items.forEach(item =>{
     item.addEventListener('mousedown', (e)=>{
      if (input.classList.contains('chips-check')) {
        if (type == 'medicines' || type == 'equipments' || type == 'services') {
          if (input.classList.contains('no-quantity-addin')) {
            if (input.classList.contains('price-addin')) {
              let ion =  data.filter(function (ite) {
                return ite.id == item.getAttribute('data-id')
              })
              if (ion) {
               promptPrice(ion,chipsHolder,type)
              }
            }else{
              addChip({name:item.textContent, id: item.getAttribute('data-id'), price: item.getAttribute('data-price')},chipsHolder,['id','name','price'])
            }
          }else{
            let ion =  data.filter(function (ite) {
              return ite.id == item.getAttribute('data-id')
            })
            if (ion) {
             promptin(ion,chipsHolder,type)
            }
          }
        }else if (type == 'tests') {
          if (input.classList.contains('no-extra-info-addin')) {
            if (input.classList.contains('price-addin')) {
              let ion =  data.filter(function (ite) {
                return ite.id == item.getAttribute('data-id')
              })
              if (ion) {
                promptPrice(ion,chipsHolder)
              }  
            }else{
              addChip({name:item.textContent, id: item.getAttribute('data-id'), price: item.getAttribute('data-price')},chipsHolder,['id','name','price'])
            }
          }else{
            let ion =  data.filter(function (ite) {
              return ite.id == item.getAttribute('data-id')
            })
            if (ion) {
              promptTestsPopup(ion,chipsHolder)
            }
          }
        }else if (type == 'operations') {
          if (input.classList.contains('no-extra-info-addin')) {
            if (input.classList.contains('price-addin')) {
              let ion =  data.filter(function (ite) {
                return ite.id == item.getAttribute('data-id')
              })
              if (ion) {
                promptPrice(ion,chipsHolder)
              }            
            }else{
              addChip({name:item.textContent, id: item.getAttribute('data-id'), price: item.getAttribute('data-price')},chipsHolder,['id','name','price'])
            }
          }else{
            let ion =  data.filter(function (ite) {
              return ite.id == item.getAttribute('data-id')
            })
            if (ion) {
              promptOperationPopup(ion,chipsHolder)
            }
          }
        }else if (type == 'assurances') {
          let ion =  data.filter(function (ite) {
            return ite.id == item.getAttribute('data-id')
          })
          if (ion) {
           promptan(ion,chipsHolder)
          }
        }else{
          addChip({name:item.textContent, id: item.getAttribute('data-id')},chipsHolder,['id'])
        }
      }else if (input.classList.contains('bevalue')) {
        input.value = item.textContent
        input.setAttribute('data-id',item.getAttribute('data-id'))
      }
     })
    })
    input.addEventListener('blur', function () {
      try {
        setTimeout(e=>{deletechild(div,parent)},200)
      } catch (error) {
        
      }
    })
    if (!noInpAction) {
      input.onkeyup = function () {
       let value = this.value.trim(),pattern = new RegExp(`.*${value.split('').join('.*')}.*`, "i"),match = 0
       if (!value) input.removeAttribute('data-id')
       items.forEach(item =>{
        if (!pattern.test(item.textContent)) {
          item.classList.add('hidden')
          if (match == 0) {
            input.removeAttribute('data-id')
          }
        }else{
          item.classList.remove('hidden')
          match = 1
          if ((input.value.toLowerCase() === item.textContent.toLowerCase())) {
            input.setAttribute('data-id',item.getAttribute('data-id'))
          }
    
        }
       })
      }
    }
  } catch (error) {
    console.log(error)
  }

}
export function addChip(info,parent,datatoadd) {
  c = document.createElement('span')
  c.className = 'w-a h-a b-1-s-gray br-2p pr-20p pt-5p pb-5p pl-5p m-5p fs-13p iblock chip p-r verdana dgray consolas  ';
  r = document.createElement('div');
  r.className = "w-20p h-20p p-a right bc-white remove m-5p  b-1-s-gray center br-50 hover t-0 r-0"
  r.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#000" stroke-width="1" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"></line></g><g><line fill="none" stroke="#000" stroke-width="1" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"></line></g></svg>`
  d = document.createElement('span')
  d.className = `p-5p bsbb consolas dgray fs-12p`
  d.innerText = info.name
  for (const item of datatoadd) {
    d.setAttribute(`data-${item}`,info[item])
  }
  c.appendChild(d)
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
export function getchips(parent,datatoget) {
  if (!parent) {
    return []
  }
  c = Array.from(parent.querySelectorAll('span.chip'))
  let d
  d = []
  for (const chip of c) {
    if (!datatoget) {
      d.push(chip.querySelector('span').getAttribute(`data-id`))
    }else if (datatoget.length == 1) {
      d.push(chip.querySelector('span').getAttribute(`data-${datatoget[0]}`))
    }else if (datatoget.length > 1) {
      v = {}
      for (const data of datatoget) {
        Object.assign(v,{[data]: chip.querySelector('span').getAttribute(`data-${data}`)})
      }
      d.push(v)
    }
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
  if (!index) {
    return i
  }
  return i[index]
  
}
function promptin(info,chipsHolder,type) {
  b = addshade();
  a = document.createElement('div');
  b.appendChild(a)
  info = info[0]
  a.className = "w-400p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp" 
  a.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                  <span class="fs-17p dgray capitalize igrid h-100 verdana">enter the quantity of ${info.name}</span>
                              </div>
                              <div class="body w-100 h-a p-5p grid">
                                  <form method="post" id="rec-quantity-form" name="rec-quantity-form">
                                    <div class="col-md-12 p-10p">
                                      <label for="quantity" class="form-label text-muted capitalize"><i class="fas fa-balance-scale-left pr-5p"></i> quantity</label>
                                      <div class="input-group">
                                          <input type="number" class="form-control" placeholder="quantity" name="quantity" id="quantity">
                                          <span class="input-group-text hover-2 us-none">${info.unit}</span>
                                          <small class="w-100 red pl-3p verdana capitalize"></small>
                                      </div>
                                        ${(getPath()[0] == 'hc_provider' && type == 'medicines') ? `
                                        <div class="w-100 h-a my-20p px-0 flex">
                                          <div class="p-5p bsbb b-1-s-gray br-5p mr-5p">
                                            <div class="mx-5p">
                                                <label class="form-check-label custom-option-content" for="status1">
                                                    <span class="custom-option-body center-2 py-4p bsbb text-muted">
                                                      <i class="fas fa-hand-holding-medical pr-10p bsbb"></i>
                                                      <span class="custom-option-title"> served </span>
                                                    </span>
                                                    <small class="capitalize"> served drugs will not require further confirmation</small>
                                                    <span class="w-100 h-a center">
                                                      <input name="status" class="form-check-input" type="radio" value="served" id="status1">
                                                    </span>
                                                </label>
                                            </div>
                                          </div>
                                          <div class="p-5p bsbb b-1-s-gray br-5p ml-5p">
                                            <div class="mx-5p">
                                                <label class="form-check-label custom-option-content" for="status">
                                                    <span class="custom-option-body center-2 py-4p bsbb text-muted">
                                                      <i class="fas fa-tablets pr-10p bsbb"></i>
                                                      <span class="custom-option-title"> not yet served </span>
                                                    </span>
                                                      <small class="capitalize"> 'not yet served' drugs will require further confirmation</small>
                                                      <span class="w-100 h-a center">
                                                        <input name="status" class="form-check-input" type="radio" value="null" id="status" checked="">
                                                      </span>
                                                </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="col-md-12 bsbb p-r">
                                          <label for="test" class="form-label text-muted capitalize"><i class="fas fa-comment-medical"></i> comment</label>
                                          <textarea class="form-control" id="comment" placeholder="medical dosage" name="comment"></textarea>
                                          <small class="w-100 red pl-3p verdana"></small>
                                        </div>
                                        ` : '' }
                                    </div>
                                    <div class="center-2 my-10p px-10p bsbb">
                                      <button type="submit" class="btn btn-primary">Proceed</button>
                                    </div>
                                  </form>
                              </div>`
  m = a.querySelector('form#rec-quantity-form')
  v = a.querySelector('input#quantity');
  c  = a.querySelector('#comment');
  let stats = Array.from(a.querySelectorAll('input[type="radio"]'));
  if (stats.length) {
    for (const status of stats) {
      status.parentElement.addEventListener('mousedown',e=>{
        stats.map(function (status) {
         status.parentElement.parentElement.classList.toggle('checked') 
        })
      })
    }
    
  }
  v.focus()
  m.addEventListener('submit', (event)=>{
    event.preventDefault()
    if (v.value.trim() != '' && Number(v.value.trim()) > 0 ) {
      if (stats.length) {

        let cs = stats.find(function (status) {return status.checked == true})

        addChip({name:info.name, id: info.id ,unit: info.unit , quantity: v.value, status: cs.value, comment: c.value},chipsHolder,['id','name','quantity','status','unit','comment'])
      }else{
        addChip({name:info.name, id: info.id ,unit: info.unit ,price: info.price , quantity: v.value},chipsHolder,['id','name','quantity','price','unit'])
      }
      deletechild(b,b.parentNode)
    }else{
      setErrorFor(v,'enter the quantity')
    }
  })
}
function promptPrice(info,chipsHolder) {
  b = addshade();
  a = document.createElement('div');
  b.appendChild(a)
  info = info[0]
  a.className = "w-400p h-a p-10p bsbb bc-white cntr zi-10000 br-5p" 
  a.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                  <span class="fs-17p dgray capitalize igrid h-100 verdana">enter the price of ${info.name}</span>
                              </div>
                              <div class="body w-100 h-a p-5p grid">
                                  <form method="post" id="rec-price-form" name="rec-price-form">
                                    <div class="col-md-12 p-10p">
                                      <label for="price" class="form-label">price</label>
                                      <div class="input-group">
                                          <input type="number" class="form-control" placeholder="price" name="price" id="price">
                                          <span class="input-group-text hover-2 us-none">RWF</span>
                                          <small class="w-100 red pl-3p verdana capitalize"></small>
                                      </div>
                                    </div>
                                    <div class="center-2 my-10p px-10p bsbb">
                                      <button type="submit" class="btn btn-primary">Proceed</button>
                                    </div>
                                  </form>
                              </div>`
  m = a.querySelector('form#rec-price-form')
  v = a.querySelector('input#price');
  v.focus()
  m.addEventListener('submit', (event)=>{
    event.preventDefault()
    if (v.value.trim() != '') {
        addChip({name:info.name, id: info.id , price: v.value},chipsHolder,['id','name','price'])
      deletechild(b,b.parentNode)
    }else{
      setErrorFor(v,'enter the price')
    }
  })
}
function promptan(info,chipsHolder) {
  b = addshade();
  a = document.createElement('div');
  b.appendChild(a)
  info = info[0]
  a.className = "w-330p h-230p p-10p bsbb bc-white cntr zi-10000 br-5p" 
  a.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                  <span class="fs-17p dgray capitalize igrid h-100 verdana">enter ${info.name}'s insurance number</span>
                              </div>
                              <div class="body w-100 h-a p-5p grid">
                                  <form method="post" id="rec-number-form" name="rec-number-form">
                                    <div class="col-md-12 p-10p">
                                      <label for="number" class="form-label">Insurance number</label>
                                        <div class="input-group">
                                            <input type="number" class="form-control" placeholder="number" name="number" id="number">
                                            <small class="w-100 red pl-3p verdana"></small>
                                        </div>
                                    </div>
                                    <div class="center-2 my-10p px-10p bsbb">
                                        <button type="submit" class="btn btn-primary">Proceed</button>
                                      </div>
                                  </form>
                              </div>`
  m = a.querySelector('form#rec-number-form')
  v = a.querySelector('input')
  m.addEventListener('submit', (event)=>{
    event.preventDefault()
    if (v.value.trim() != '') {
      addChip({name:info.name, id: info.id , number: v.value},chipsHolder,['id','number'])
      deletechild(b,b.parentNode)
    }else{
      setErrorFor(v,'enter the number')
    }
  })
}
function promptTestsPopup(info,chipsHolder) {
  b = addshade();
  a = document.createElement('div');
  b.appendChild(a)
  info = info[0]
  a.className = "w-350p h-350p p-10p bsbb bc-white cntr zi-10000 br-5p" 
  a.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                  <span class="fs-17p dgray capitalize igrid h-100 verdana">${info.name}'s required information</span>
                              </div>
                              <div class="body w-100 h-a p-5p grid">
                                  <form method="post" id="req-test-info-form" name="req-test-info-form">
                                  <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="sample" class="form-label">sample taken</label>
                                    <input type="text" class="form-control" id="sample" placeholder="Demo sample" name="sample">
                                    <small class="w-100 red pl-3p verdana"></small>
                                  </div>
                                  <div class="col-md-12 px-10p py-6p bsbb mb-5p p-r">
                                    <label for="result" class="form-label">results found</label>
                                    <input type="text" class="form-control" id="result" placeholder="Demo results" name="result">
                                    <small class="w-100 red pl-3p verdana"></small>
                                  </div>
                                  <div class="center-2 my-15p px-10p bsbb">
                                      <button type="submit" class="btn btn-primary mx-10p">Proceed</button>
                                      <button type="button" class="btn btn-label-primary mx-10p capitalize">Send for tesing</button>
                                    </div>
                                  </form>
                              </div>`
  m = a.querySelector('form#req-test-info-form')
  v = Array.from(a.querySelectorAll('input'))
  m.addEventListener('submit', (event)=>{
    event.preventDefault();
    l = 1
    i = []
    s = {}
    for (const input of v) {
      k = checkEmpty(input);
      if (!k) {
        l = 0
      }
      if (k) {
        Object.assign(s,{[input.name]: input.value})
        i.push(input.name)
      }
    }
    if (l) {
      Object.assign(s,{id: info.id,name:info.name})
      i.push('id')
      addChip(s,chipsHolder,i)
      deletechild(b,b.parentNode)
    }
  })
}
function promptOperationPopup(info,chipsHolder) {
  b = addshade();
  a = document.createElement('div');
  b.appendChild(a)
  info = info[0]
  a.className = "w-350p h-290p p-10p bsbb bc-white cntr zi-10000 br-5p" 
  a.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                  <span class="fs-17p dgray capitalize igrid h-100 verdana">${info.name}'s required information</span>
                              </div>
                              <div class="body w-100 h-a p-5p grid">
                                  <form method="post" id="req-operation-info-form" name="req-operation-info-form">
                                    <div class="col-md-12 px-10p py-6p bsbb mb-5p p-r">
                                      <label for="operator" class="form-label">operator</label>
                                      <input type="text" class="form-control bc-gray" id="operator" placeholder="Demo operator" value="${getdata('userinfo').Full_name}" name="operator" readonly>
                                      <small class="w-100 red pl-3p verdana"></small>
                                    </div>
                                    <div class="center-2 my-15p px-10p bsbb">
                                      <button type="submit" class="btn btn-primary mx-10p">Proceed</button>
                                      <button type="button" class="btn btn-label-primary mx-10p capitalize">request for operation</button>
                                    </div>
                                  </form>
                              </div>`
  m = a.querySelector('form#req-operation-info-form')
  v = Array.from(a.querySelectorAll('input'))
  m.addEventListener('submit', (event)=>{
    event.preventDefault();
    l = 1
    i = []
    s = {}
    for (const input of v) {
      k = checkEmpty(input);
      if (!k) {
        l = 0
      }
      if (k) {
        Object.assign(s,{[input.name]: input.value})
        i.push(input.name)
      }
    }
    if (l) {
      Object.assign(s,{id: info.id,name:info.name})
      i.push('id')
      addChip(s,chipsHolder,i)
      deletechild(b,b.parentNode)
    }
  })
}
export function promptMessage(){
  let notifyP = addshade();
  a = document.createElement('div');
  notifyP.appendChild(a)
  a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
  a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                      <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">enter message template for this action</span>
                  </div>
                  <div class="body w-100 h-a p-5p grid">
                      <form method="post" id="notify" name="notify">
                          <div class="col-md-12 px-10p py-6p bsbb p-r">
                              <label for="test" class="form-label uppercase dgray"><i class="far fa-comment"></i> message</label>
                              <textarea class="form-control" id="message" placeholder="Text message" name="message"></textarea>
                              <small class="w-100 red pl-3p verdana"></small>
                          </div>
                          <div class="wrap p-r px-10p bsbb bblock-resp">
                              <button type="submit" class="btn btn-primary btn-block cntr">Proceed</button>
                          </div>
                      </form>
                  </div>`
  let form = a.querySelector("form");
  let input = form.querySelector('.form-control')
  return new Promise((resolve,reject)=>{
    form.addEventListener('submit', async event=>{
        
        event.preventDefault();
        l = 1
        v = checkEmpty(input);
        if (v) {
            resolve(input.value.trim())
            deletechild(notifyP,notifyP.parentNode)
        }
      })
    
  })
  }
export async function chSession(){
  let token = getdata('token')
  if (token) {
    z = await request(`authenticateToken/${token}`,getschema)
    if (z.success) {
      z = z.message
      if (z.role == 'patient' || z.role == 'householder') {
        window.location.href = `../patient/home`
      }
      window.location.href = `../${z.role}/home`
    }
  }
}
export async function showAvaiEmps(emps,extra){
    u = addshade();
    a = document.createElement('div')
    u.appendChild(a)
    let group = {}
    var key;
    if (extra) {
      key = Object.keys(extra)[0]
      let suba
      if (key == 'department') {
        suba = emps.filter(function (obj) {
          return obj.department.id == extra[key] 
        })
        if (!suba.length) {
          deletechild(u,u.parentNode)
          return alertMessage('no available employee to perform this task in your facility')
        }
        Object.assign(group,{ [suba[0].department.name]: suba})
      }else{
        suba = emps.filter(function (obj) {
          return obj[key] == extra[key]  
        })
        if (suba) {
          Object.assign(group,{ [suba[0][key]]: suba})
        }
      }
    }else{
      for (const employee of emps) {
        let keys = Object.keys(group)
        let f = keys.find(function (key) {
          return key == employee.department.name  
        })
        if (f) {
          group[employee.department.name].push(employee)
        }else{
          Object.assign(group,{[employee.department.name]: [employee]})
        }
      }
    }
    a.className = "w-40 h-55 p-10p bsbb ovh bc-white cntr zi-10000 br-10p card-1 b-mgc-resp"
    a.innerHTML = `<div class=" d-flex align-items-center justify-content-between p-10p mb-10p bsbb">
                      <h5 class="card-title m-0 me-2 capitalize">select the receiver</h5>
                  </div>
                  <div class="ovys w-100 h-85 scroll-2 menu-vertical">
                    <ul class="menu-inner py-1 the-cont td-none ls-none pl-5p">
                    </ul>
                  </div>
                  `
    c = a.querySelector('ul')
    for (const department of Object.keys(group)) {
      d = document.createElement('li')
      d.className = 'w-100 px-5p py-10p'
      d.innerHTML = `<a href="javascript:void(0);" class="menu-link dgray fs-18 capitalize hover-2 td-none flex p-r">
                        <div class="dep" data-id="${(extra)? (key == 'department') ?group[department][0].department.id : group[department][0][key] :group[department][0].department.id}">${department}</div>
                        <div class="p-a drop-buttons p-10p bsbb hover-2 center r-0"><div class="right-arrow p-r tr-0-3"></div></div>
                    </a>`
      let ul = document.createElement('ul')
      ul.className = 'hidden trigger-show ls-none px-4p'
      d.appendChild(ul)
      for (const employee of group[department]) {
        let subm = document.createElement('li')
        subm.className = 'menu-item my-8p px-6p bsbb'
        subm.innerHTML = `
                        <div class="d-flex">
                              <div class="flex-shrink-0 me-3">
                                <div class="avatar">
                                  <span class="w-40p h-40p br-50 center bc-tr-theme capitalize dgray bold-2">${employee.Full_name.substring(0,1)}</span>
                                </div>
                              </div>
                              <div class="flex-grow-1 hover-2 emp" data-id="${employee.id}">
                                  <h6 class="mb-1 capitalize dgray">${employee.Full_name}</h6>
                                  <p class="mb-0 flex">
                                    <span class=" capitalize dgray">${employee.title}</span>
                                    <small class=" ml-5p px-5p pb-3p br-5p ${(employee.online)? 'green bc-tr-green':'text-muted bc-gray'}">${(employee.online)? 'online':'offline'}</small>
                                  </p>
                              </div>
                              
                          </div>`
        ul.appendChild(subm)
      }
      c.appendChild(d)
    }
    let dbuttons = Array.from(c.querySelectorAll('div.drop-buttons'))
    dbuttons.map(function (button) {
      button.addEventListener('mousedown', ()=>{
        button.children[0].classList.toggle('down-arrow');
        button.children[0].classList.toggle('left-arrow');
        let show = button.parentElement.parentElement.querySelector('.trigger-show');
        show.classList.toggle('hidden')

      })
    })
    let employees = Array.from(a.querySelectorAll('.emp'))
    let deps = Array.from(a.querySelectorAll('.dep'))
    return new Promise((resolve) =>{
      for (const lis of employees) {
        lis.addEventListener('click',async function(event){
          event.preventDefault();
          this.classList.add('selected')
          let employee = this.getAttribute('data-id')
          resolve(employee)
          deletechild(u,u.parentElement)
        })
      }
      for (const dep of deps) {
        dep.addEventListener('click',async function(event){
          let emps = Array.from(dep.parentNode.parentElement.querySelectorAll('.emp'))
          emps = emps.map(function (employee) {
              return employee.getAttribute('data-id')
          })
          resolve(emps)
          deletechild(u,u.parentElement)

        })
      }

    })
   return u
}
export async function showAvaiAssurances(assurances){
  u = addshade();
  a = document.createElement('div')
  u.appendChild(a)
  a.className = "w-40 h-55 p-10p bsbb ovh bc-white cntr zi-10000 br-10p card-5 b-mgc-resp"
  a.innerHTML = `<div class="d-flex align-items-center justify-content-between p-10p mb-10p bsbb">
                    <h5 class="card-title m-0 me-2 capitalize">select the applying assurance</h5>
                </div>
                <div class="ovys w-100 h-85 scroll-2">
                  <ul class="list-group list-group-flush the-cont">
                  </ul>
                </div>
                `
  c = a.querySelector('ul')
  for (const assurance of assurances) {
    d = document.createElement('li')
    d.className = 'list-group-item list-group-item-action dropdown-notifications-item hover-2 us-none assurance'
    d.setAttribute('data-id',assurance.id)
    d.innerHTML = `
                     <div class="d-flex">
                          <div class="flex-grow-1">
                              <h6 class="mb-1 capitalize dgray">${assurance.name}</h6>
                              <p class="mb-0 capitalize"><span class ="btn btn-sm ${(assurance.eligibility == 'eligible')?'bc-tr-green green':'bc-tr-red red'}">${assurance.eligibility}</span></p>
                          </div>
                          
                      </div>`
    c.appendChild(d)
  }
  d = document.createElement('li')
  d.className = 'list-group-item list-group-item-action dropdown-notifications-item hover-2 us-none assurance'
  d.setAttribute('data-id',null)
  d.innerHTML = `
                   <div class="d-flex">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 capitalize dgray">Private</h6>
                            <p class="mb-0 capitalize"><span class ="btn btn-sm bc-gray dgray">no assurance used</span></p>
                        </div>
                        
                    </div>`
  c.appendChild(d)
 return u
}
export function animskel() {
  let skel = Array.from(document.getElementsByClassName('skel'));
  skel = shuffleArray(skel)
  let i=0
  skel.forEach(ele=>{
      setTimeout(()=>{
          ele.classList.add('anim')
      },i)
      i+=100;
  })
}
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export function addsCard(message,dec) {
  let div = document.createElement('div')
  div.className = `w-100 h-60p center p-f t-0 zi-100`
  let sCard = document.createElement('div');
  let thenav
     thenav = document.querySelector('div#cont');
     thenav.appendChild(div);
     div.appendChild(sCard);
	sCard.className = "popup-card p-a nwecard";
	c = Array.from(document.querySelectorAll('div.popup-card'));
	if (c.length <= 1) {
		sCard.className = "card popup-card w-a h-a bc-white br-20p p-4p zi-0 tr-0-3 bsbb ovh";
		var scard_hol = document.createElement('div');
		sCard.appendChild(scard_hol);
    scard_hol.className = `w-a h-a flex`
    if (dec) {
      d=`<svg version="1.1" class="w-20p h-20p" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="fill: var(--green);" xml:space="preserve"><g><g id="check_x5F_alt"><path style="fill: var(--green);"d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M13.52,23.383 L6.158,16.02l2.828-2.828l4.533,4.535l9.617-9.617l2.828,2.828L13.52,23.383z"/></g></g></svg>`
    }else{
      d=`<svg version="1.1" fill="#ff0000" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30" height="30" viewBox="0 0 64 64" fill="#ff0000" enable-background="new 0 0 64 64" xml:space="preserve"><g><line fill="none" stroke="#ff0000" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"></line></g><g><line fill="none" stroke="#ff0000" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"></line></g></svg>`
    }
		scard_hol.innerHTML = `<span class='left center w-30p l-0 h-25p bc-white green igrid t-0  '>${d}</span><span class=' horizontal fs-14p igrid w-a  h-25p p-r black verdana mr-5p ovh'>${message}</span>`;
		setTimeout(removecard,2000,sCard);	
	}else{
    c = document.querySelectorAll('div.nwecard')
    c.forEach(card=>{
      card.parentNode.removeChild(card)
    })
	}
	
}
function removecard(sCard) {
	sCard.classList.replace('popup-card','popup-card-fadding');
	setTimeout(deleteCard,1000,sCard); 
}
function deleteCard(sCard) {
  let navbar = document.querySelector('div#cont')
	navbar.removeChild(sCard.parentElement);
}
export async  function cpgcntn(step,pages) {
  try {
    pages.map(function (page) {
      if(pages.indexOf(page) == step){
        page.classList.replace('hidden','block')
        }else {
            page.classList.replace('block','hidden')
        }
    })
  } catch (error) {
    console.log(error)
  }
}
export function adcm(n) {
  try {
    if (!Number(n)) {
      return n
    }
    d = n.toString().split('.')
    n= Array.from(n.toString().split('.')[0]).reverse()
    let s = "";
    let i = 0;
    for(const t of n ){
      if(i % 3 == 0 && i!= 0){
        s+=`p${t}`
      }else{
        s+=t
      }
      i++
    }
    s= Array.from(s).reverse().toString().replace(/,/gi,"")
    s=s.replace(/p/gi,",")
    if (d[1]) {
      s+=`.${d[1]}`
    }
    return (s)
    
  } catch (error) {
    return n
  }
}
export function getDate(type) {
  const leTime = DateTime.now();
  let now = leTime.setZone('Africa/Kigali');
  if (type == 'full') {
    now = now.toFormat('yyyy-MM-dd HH:mm:ss')
  }else if (type == 'time') {
    now = now.toFormat('HH:mm:ss')
  }else if (type == 'date') {
    now = now.toFormat('yyyy-MM-dd')
  }else{
    now = now.toFormat('yyyy-MM-dd HH:mm:ss')
  }
  return now
}
export function extractTime(date,type) {
  date = DateTime.fromISO(date.replace(' ', 'T'))
  if (type == 'full') {
    return date.toFormat('yyyy-MM-dd HH:mm:ss')
  }else if (type == 'time') {
    date = date.toFormat('HH:mm:ss')
  }else if (type == 'date') {
    date = date.toFormat('yyyy-MM-dd')
  }else{
    date = date.toFormat('yyyy-MM-dd HH:mm:ss')
  }
  return date
}
export function calcTime(targetTime) {
  targetTime = new Date(targetTime)
  const leTime = DateTime.now();
  let now = leTime.setZone('Africa/Kigali');
  now = now.toFormat('yyyy-MM-dd HH:mm:ss')
  let currentTime = new Date(now)
  const timeDifference = currentTime - targetTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
      return `${years} year${years !== 1 ? 's' : ''} ago`;
  } else if (months > 0) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
}
export function fT(time) {
  try {
    let formatedTime = new Date(time)
    return  new Intl.DateTimeFormat('en-US',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(formatedTime)
    
  } catch (error) {
    return time
  }
}
export function aDePh(parent) {
  let defaultLi = document.createElement('li')
  defaultLi.className = `ovh center-2`
  parent.appendChild(defaultLi)
  defaultLi.innerHTML = `<span class="capitalize dgray center fs-16p text muted"><span class="w-100 h-a center"><img class="w-60p h-60p contain" src="/assets/svg/box.svg"></span><span class="capitalize">no entries to available</span></span>`
}
export function getLocs(map,required,extra) {
  let cache = []
  if (required == "province") {
      for (const provinces of map) {
          cache.push({id: provinces.provinces[0].id, name: provinces.provinces[0].name})
      }
      return cache
  }else if (required == "district") {
    if (!extra) {
      for (const provinces of map) {
          for (const district of  provinces.provinces[0].districts) {
              cache.push({id: district.id, name: district.name})
          }
      }
    }else{
      for (const provinces of map) {
        if (provinces.provinces[0].id == extra) {
          for (const district of  provinces.provinces[0].districts) {
              cache.push({id: district.id, name: district.name})
          }
          
        }
    }
    }
      return cache
  }else if (required == "sector") {
    if (!extra) {
      for (const provinces of map) {
          for (const district of  provinces.provinces[0].districts) {
              for (const sector of district.sectors) {
                  cache.push({id: sector.id, name: sector.name})
              }
          }
      }
    }else{
      for (const provinces of map) {
        for (const district of  provinces.provinces[0].districts) {
          if (district.id == extra) {
            for (const sector of district.sectors) {
                cache.push({id: sector.id, name: sector.name})
            }
          }
        }
      }
    }
      return cache
  }else if (required == "cell") {
    if (!extra) {
      for (const provinces of map) {
          for (const district of  provinces.provinces[0].districts) {
              for (const sector of district.sectors) {
                  for (const cell of sector.cells) {
                      cache.push({id: cell.id, name: cell.name})
                  }
              }
          }
      }
    }else{
      for (const provinces of map) {
        for (const district of  provinces.provinces[0].districts) {
            for (const sector of district.sectors) {
              if (sector.id == extra) {
                for (const cell of sector.cells) {
                    cache.push({id: cell.id, name: cell.name})
                }
              }
            }
        }
      }
    }
      return cache
  }
}
export function promptHpsToChoose(hps) {
  u = addshade();
  a = document.createElement('div')
  u.appendChild(a)
  a.className = "w-350p h-30 p-10p bsbb ovh bc-white cntr zi-10000 br-10p card-5 b-mgc-resp"
  a.innerHTML = `<div class=" d-flex align-items-center justify-content-between py-10p bsbb">
                    <h4 class="card-title m-0 px-10p capitalize">select a health facility</h4>
                </div>
                <div class="ovys w-100 h-85 scroll-2 menu-vertical">
                  <ul class="menu-inner py-1 the-cont ls-none">
                  </ul>
                </div>
                `
  c = a.querySelector('ul')
  for (const hospital of hps) {
    d = document.createElement('li')
    d.className = 'w-100 menu-item'
    d.innerHTML = `   <div class="dep px-15p bsbb my-5p hover-7 py-10p" data-id="${hospital.id}" data-name="${hospital.name}">
                        <h5 class="m-0">${hospital.name}</h5>
                        <span class="dgray fs-14p px-5p capitalize">${hospital.location}</span>
                      </div>
                      `
    c.appendChild(d)
  }
  let lis = Array.from(c.querySelectorAll('div.dep'))
  lis.forEach(button=>{
    button.addEventListener('click',e=>{
        e.preventDefault()
        deletechild(u,u.parentElement)
    })
  })
  return lis
}

export function addAuthDiv(socket,user){
  let q =  addshade();
  a = document.createElement('div')
  q.appendChild(a)
  a.className = "w-360p h-a p-20p bsbb bc-white cntr zi-10000 br-10p card-5 authDiv b-mgc-resp" 
  a.innerHTML = `<div class="head w-100 h-60p p-5p bsbb bb-1-s-dg">
                  <span class="fs-18p black capitalize igrid center h-100 verdana">access authentication</span>
                </div>
                <div class="body w-100 h-a p-5p mt-10p">
                  <form method="post">
                  <div>
                    <span class="dgray capitalize">enter the 6 digit code we sent the information's owner</span>
                  </div>
                  <div class="block">
                  <label for="code" class="form-label">code</label>
                  <input type="text" class="form-control fs-18p big-placeholder" id="code" placeholder="*** ***" name="code" data-optional="true">
                  <small class="hidden w-100 red pl-3p verdana"></small>
                  </div>
                  <div class="block my-10p">
                  <button type="submit" class="btn btn-primary d-grid" name="submit">
                    proceed
                  </button>
                  </div>
                  </form>
                </div>
                <div class="mssg-footer w-100 h-60p mt-10p  bsbb ">
                <div class="block">
                <span class="dgray capitalize block">other methods</span>
                </div>
                  <div class="flex">
                  <span class="p-5p w-40p h-40p b-1-s-theme br-5p hover-2" id="fingerprint"><svg class="w-30p h-30p" fill="var(--main-color)" viewBox="0 0 463 463" xml:space="preserve">
                  <g>
                    <path d="M259.476,280.364V247.5c0-12.958-10.542-23.5-23.5-23.5s-23.5,10.542-23.5,23.5v29.672   c0,35.757-13.173,70.087-37.094,96.665l-32.981,36.646c-2.771,3.079-2.521,7.821,0.558,10.593c3.078,2.771,7.82,2.521,10.592-0.558   l32.981-36.646c26.403-29.338,40.944-67.231,40.944-106.7V247.5c0-4.687,3.813-8.5,8.5-8.5s8.5,3.813,8.5,8.5v32.864   c0,44.003-16.301,86.167-45.901,118.727l-32.149,35.364c-2.786,3.064-2.56,7.809,0.505,10.595c1.437,1.307,3.242,1.95,5.042,1.95   c2.04,0,4.072-0.827,5.552-2.455l32.148-35.364C241.789,373.854,259.476,328.106,259.476,280.364z"/>
                    <path d="M291.476,247.5c0-30.603-24.897-55.5-55.5-55.5s-55.5,24.897-55.5,55.5v29.672c0,27.839-10.256,54.566-28.879,75.258   l-23.447,26.053c-2.771,3.079-2.521,7.821,0.558,10.593c3.079,2.771,7.82,2.519,10.592-0.558l23.447-26.053   c21.106-23.451,32.73-53.742,32.73-85.293V247.5c0-22.332,18.168-40.5,40.5-40.5c22.332,0,40.5,18.168,40.5,40.5v32.864   c0,51.979-19.256,101.789-54.223,140.252l-27.125,29.839c-2.787,3.064-2.561,7.809,0.504,10.595c1.437,1.307,3.242,1.95,5.042,1.95   c2.04,0,4.072-0.827,5.552-2.455l27.126-29.839c37.481-41.23,58.123-94.622,58.123-150.342V247.5z"/>
                    <path d="M323.476,247.5c0-48.248-39.252-87.5-87.5-87.5s-87.5,39.252-87.5,87.5v29.672c0,19.92-7.339,39.045-20.665,53.851   l-21.112,23.458c-2.771,3.079-2.521,7.821,0.558,10.593c3.078,2.771,7.821,2.519,10.592-0.558l21.112-23.458   c15.809-17.565,24.515-40.254,24.515-63.886V247.5c0-39.977,32.523-72.5,72.5-72.5s72.5,32.523,72.5,72.5v32.864   c0,59.958-22.212,117.412-62.545,161.777l-7.507,8.258c-2.786,3.065-2.56,7.809,0.505,10.595c1.437,1.306,3.243,1.95,5.042,1.95   c2.04,0,4.072-0.827,5.552-2.455l7.506-8.258c42.848-47.133,66.446-108.169,66.446-171.867V247.5z"/>
                    <path d="M116.476,247.5c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5c0-25.255,9.169-49.651,25.819-68.695   c16.495-18.867,39.134-31.205,63.746-34.741c4.1-0.589,6.946-4.391,6.357-8.49c-0.589-4.1-4.394-6.942-8.49-6.357   c-28.16,4.046-54.052,18.15-72.906,39.716C126.962,190.71,116.476,218.613,116.476,247.5z"/>
                    <path d="M131.476,277.172c0-4.143-3.358-7.5-7.5-7.5s-7.5,3.357-7.5,7.5c0,12.002-4.421,23.523-12.449,32.443l-18.779,20.867   c-2.771,3.078-2.521,7.82,0.558,10.592c1.434,1.29,3.227,1.925,5.015,1.925c2.052,0,4.097-0.838,5.577-2.483l18.779-20.866   C125.687,307.971,131.476,292.886,131.476,277.172z"/>
                    <path d="M340.755,344.123c-4.009-1.044-8.105,1.351-9.155,5.357c-2.769,10.579-6.213,21.096-10.24,31.258   c-1.526,3.851,0.359,8.21,4.21,9.735c0.907,0.359,1.841,0.529,2.761,0.529c2.985,0,5.808-1.795,6.975-4.739   c4.249-10.725,7.884-21.822,10.806-32.986C347.16,349.271,344.761,345.172,340.755,344.123z"/>
                    <path d="M315.791,158.632c-3.081-2.771-7.823-2.517-10.592,0.563s-2.517,7.822,0.563,10.591   c22.061,19.832,34.713,48.157,34.713,77.714v32.864c0,12.473-0.86,25.042-2.557,37.359c-0.565,4.104,2.303,7.888,6.406,8.453   c0.347,0.048,0.692,0.071,1.033,0.071c3.688,0,6.903-2.722,7.42-6.478c1.79-12.993,2.698-26.251,2.698-39.406V247.5   C355.476,213.695,341.011,181.304,315.791,158.632z"/>
                    <path d="M280.729,153.076c1.041,0.496,2.138,0.73,3.219,0.73c2.803,0,5.492-1.579,6.777-4.278c1.781-3.739,0.192-8.215-3.547-9.995   c-10.806-5.145-22.291-8.616-34.136-10.317c-4.106-0.585-7.901,2.258-8.49,6.357s2.257,7.901,6.357,8.49   C261.257,145.55,271.289,148.582,280.729,153.076z"/>
                    <path d="M235.976,96c-2.806,0-5.644,0.078-8.437,0.232c-4.136,0.228-7.304,3.766-7.076,7.901c0.229,4.136,3.763,7.321,7.902,7.075   c2.519-0.139,5.079-0.209,7.61-0.209c75.266,0,136.5,61.233,136.5,136.5v32.864c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5V247.5   C387.476,163.963,319.513,96,235.976,96z"/>
                    <path d="M153.972,136.693c1.477,0,2.97-0.436,4.275-1.343c12.478-8.677,26.182-15.155,40.733-19.258   c3.987-1.124,6.308-5.268,5.184-9.254s-5.269-6.304-9.254-5.184c-16.16,4.556-31.376,11.749-45.226,21.379   c-3.401,2.365-4.241,7.039-1.876,10.439C149.265,135.57,151.599,136.693,153.972,136.693z"/>
                    <path d="M99.476,277.172V247.5c0-34.89,13.213-68.118,37.205-93.565c2.841-3.014,2.702-7.76-0.312-10.602   s-7.761-2.701-10.602,0.312C99.14,171.886,84.476,208.77,84.476,247.5v29.672c0,4.083-1.504,8.002-4.234,11.035l-9.248,10.275   c-2.771,3.079-2.521,7.821,0.558,10.592c1.433,1.291,3.227,1.926,5.015,1.926c2.052,0,4.096-0.837,5.577-2.482l9.248-10.275   C96.605,292.449,99.476,284.966,99.476,277.172z"/>
                    <path d="M409.951,189.104c-8.226-24.446-21.299-46.531-38.856-65.642c-2.803-3.05-7.547-3.252-10.597-0.449   c-3.05,2.803-3.251,7.547-0.449,10.598c16.127,17.554,28.134,37.834,35.686,60.276c1.054,3.133,3.976,5.11,7.107,5.11   c0.793,0,1.6-0.127,2.393-0.394C409.16,197.282,411.272,193.029,409.951,189.104z"/>
                    <path d="M295.247,73.822c-3.917-1.341-8.183,0.748-9.524,4.668c-1.341,3.919,0.749,8.183,4.668,9.523   c16.538,5.659,32.065,13.857,46.15,24.369c1.347,1.005,2.92,1.489,4.48,1.489c2.286,0,4.544-1.041,6.017-3.015   c2.478-3.319,1.794-8.019-1.525-10.496C330.176,88.916,313.264,79.986,295.247,73.822z"/>
                    <path d="M119.442,125.908C150.991,95.659,192.377,79,235.976,79c8.096,0,16.237,0.583,24.196,1.731   c4.103,0.598,7.903-2.252,8.495-6.352c0.592-4.1-2.251-7.902-6.351-8.494C253.648,64.635,244.786,64,235.976,64   c-47.487,0-92.56,18.141-126.915,51.081c-34.248,32.838-54.277,76.905-56.397,124.084c-0.186,4.138,3.018,7.644,7.155,7.829   c0.115,0.006,0.229,0.008,0.343,0.008c3.987,0,7.306-3.14,7.487-7.163C69.594,196.527,87.988,156.066,119.442,125.908z"/>
                    <path d="M235.976,32c-16.772,0-33.485,1.944-49.674,5.778c-4.031,0.954-6.524,4.996-5.57,9.026c0.955,4.03,4.997,6.524,9.027,5.569   C204.817,48.809,220.366,47,235.976,47c54.996,0,106.332,21.911,144.55,61.695c1.473,1.533,3.439,2.305,5.41,2.305   c1.869,0,3.741-0.694,5.195-2.091c2.987-2.87,3.083-7.618,0.213-10.604c-19.913-20.729-43.304-37.036-69.522-48.465   C294.666,38.002,265.783,32,235.976,32z"/>
                    <path d="M67.507,125.404c1.372,1.074,3.001,1.595,4.619,1.595c2.227,0,4.431-0.987,5.91-2.876   c21.375-27.302,49.515-48.717,81.377-61.932c3.826-1.587,5.642-5.975,4.055-9.801s-5.977-5.644-9.801-4.055   c-34.241,14.201-64.478,37.21-87.441,66.539C63.672,118.137,64.246,122.851,67.507,125.404z"/>
                    <path d="M131.983,38.725c1.094,0,2.205-0.24,3.255-0.748C166.816,22.73,200.709,15,235.976,15c18.378,0,36.682,2.162,54.401,6.426   c4.025,0.966,8.077-1.51,9.046-5.537c0.969-4.027-1.51-8.078-5.538-9.047C275.019,2.302,255.535,0,235.976,0   c-37.544,0-73.631,8.232-107.259,24.469c-3.73,1.801-5.294,6.285-3.493,10.015C126.517,37.163,129.195,38.725,131.983,38.725z"/>
                    <path d="M321.724,31.383c7.732,3.079,15.385,6.619,22.746,10.52c1.119,0.594,2.321,0.875,3.505,0.875   c2.688,0,5.287-1.449,6.633-3.99c1.939-3.66,0.545-8.199-3.115-10.139c-7.837-4.153-15.986-7.922-24.22-11.201   c-3.849-1.533-8.21,0.345-9.743,4.192C315.998,25.488,317.876,29.851,321.724,31.383z"/>
                  </g>
                  </svg></span>
                  </div>
                </div>`;
  f = a.querySelector('form')
  i = f.querySelector('input')
  let fingerprint = a.querySelector('span#fingerprint')
  fingerprint.onclick = function () {
    showFingerprintDiv('compare',socket,user);
  }
  i.focus()
  initializeSpecialCleave(i,[3,3],6,' - ')
  f.onsubmit = function (event) {
    if (!i.value) {
      return
    }
    event.preventDefault();
    v = i.value.replace(/ - /g, "")
    socket.emit('authCode',{type: 'code',v,user})
    deletechild(q,q.parentElement)
  }

}
export async function showFingerprintDiv(action,socket,user) {
  
  let q =  addshade();
  a = document.createElement('div')
  q.appendChild(a)
  a.className = "w-460p h-470p p-20p bsbb bc-white cntr zi-10000 br-10p card-5 authDiv b-mgc-resp" 
  a.innerHTML = `<div class="head w-100 h-60p p-5p bsbb bb-1-s-dg">
                  <span class="fs-18p black capitalize igrid center h-100 verdana">fingerprint recognition</span>
                </div>
                <div class="body w-100 h-350p p-5p mt-10p">
                  <div class="w-100 h-65 p-10p bsbb">
                   <div class="br-5p b-1-s-g w-100 h-100">
                     <img class="contain w-100 h-100 p-r" id="fp-preview"> </img>
                   </div>
                  </div>
                  <div class="status my-5p p-5p">
                   <span class="capitalize h-30p fs-13p my-5p p-5p block w-100" id="status"></span>
                   <span class=" block w-100 center">
                   </span>
                   </div>
                   <div class="controlls w-100 h-a center-2">
                    <button class="btn btn-success white d-grid w-100" id="start">start</button>
                    <button class="btn btn-primary d-grid mx-10p w-100" id="proceed">proceed</button>
                    <button class="btn btn-warning d-grid mx-10p w-100" id="proceed">reconnect</button>

                  </div>
                </div>`;
  let preview = a.querySelector('img'),status = a.querySelector('span#status'),start = a.querySelector('button#start'),proceed = a.querySelector('button#proceed')
  let fp_data;
  connectFP('', callback=>{
    let st = callback.success,{type} = callback
    if(!st){
      status.classList.remove('red','dgray','green')
      status.classList.add('red')
      status.innerText = callback.message
    }else if (st == `awaiting`) {
      status.classList.remove('red','dgray','green')
      status.classList.add('dgray')
      status.innerText = callback.message
    }else if (st){
      status.classList.remove('red','dgray','green')
      status.classList.add('green')
      status.innerText = callback.message
    }
    if (type) {
      if (type == 'fp-image') {
        preview.src = callback.data
      }
      if (type == 'fp-data') {
        fp_data = callback.data
      }
    }
  })
  start.onclick = function (event) {
    event.preventDefault();
    if (action == 'search' || action == 'compare') {
      GetTemplate();
    }else if (action == 'register') {
      EnrollTemplate()
    }
  }
  return new Promise((resolve, reject) => {
    proceed.onclick = function (event) {
      event.preventDefault();
      if (fp_data) {
        if (action == 'compare') {
          socket.emit('authCode',{type: 'fp',fp_data,user})
        }else{
          resolve(fp_data)
        }
      }
    }
  })
}
export function RemoveAuthDivs() {
  let authDivs = Array.from(document.querySelectorAll('div.authDiv'))
  authDivs.forEach(authdiv=>{
    deletechild(authdiv.parentNode,authdiv.parentNode.parentNode)
  })
}