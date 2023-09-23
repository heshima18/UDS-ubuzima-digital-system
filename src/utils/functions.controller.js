var q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
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
  parent.classList.add('ovh')
  var shaddow = document.createElement('div');
  parent.insertBefore(shaddow,parent.firstChild);
  shaddow.className = "w-100 h-100 ovh p-a bsbb bc-white t-0 blur shaddow zi-20";
  shaddow.setAttribute('data-role','shade')	
  var loading = document.createElement('div');
  loading.className = "p-a cntr w-70p h-70p ovh";
  loading.innerHTML = `<div class="sk-grid sk-primary">
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                        <div class="sk-grid-cube"></div>
                      </div>`;
  shaddow.appendChild(loading)
}
export function removeLoadingTab(parent) {
  try {
    var shaddow = parent.querySelector('.shaddow')
    parent.classList.remove('ovh')
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
export function showRecs(input, data,type) {
  try {
    let div =  document.createElement('div');
    let parent = input.parentNode
    div.className = `p-a w-300p h-250p bsbb card-2 zi-1000 bc-white scroll-2 ovys t-0 mt-70p br-5p`
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
  a.className = "w-400p h-a p-10p bsbb bc-white cntr zi-10000 br-5p" 
  a.innerHTML = `<div class="head w-100 h-50p py-10p px-15p bsbb">
                                  <span class="fs-17p dgray capitalize igrid h-100 verdana">enter the quantity of ${info.name}</span>
                              </div>
                              <div class="body w-100 h-a p-5p grid">
                                  <form method="post" id="rec-quantity-form" name="rec-quantity-form">
                                    <div class="col-md-12 p-10p">
                                      <label for="quantity" class="form-label">quantity</label>
                                      <div class="input-group">
                                          <input type="number" class="form-control" placeholder="quantity" name="quantity" id="quantity">
                                          <span class="input-group-text hover-2 us-none">${info.unit}</span>
                                          <small class="w-100 red pl-3p verdana capitalize"></small>
                                      </div>
                                        ${(getPath()[0] == 'hc_provider') ? `
                                        <div class="w-100 h-a my-20p px-0 flex">
                                          <div class="fv-plugins-icon-container fv-plugins-bootstrap5-row-valid">
                                            <div class="form-check custom-option custom-option-icon mx-5p">
                                                <label class="form-check-label custom-option-content" for="status1">
                                                    <span class="custom-option-body">
                                                        <i class="bx bx-rocket"></i>
                                                        <span class="custom-option-title"> served </span>
                                                        <small class="capitalize"> served drugs will not require further confirmation</small>
                                                    </span>
                                                    <input name="status" class="form-check-input" type="radio" value="served" id="status1">
                                                </label>
                                            </div>
                                          </div>
                                          <div class="fv-plugins-icon-container fv-plugins-bootstrap5-row-valid">
                                            <div class="form-check custom-option custom-option-icon checked mx-5p">
                                                <label class="form-check-label custom-option-content" for="status">
                                                    <span class="custom-option-body">
                                                        <i class="bx bx-rocket"></i>
                                                        <span class="custom-option-title"> not yet served </span>
                                                        <small class="capitalize"> 'not yet served' drugs will require further confirmation</small>
                                                    </span>
                                                    <input name="status" class="form-check-input" type="radio" value="null" id="status" checked="">
                                                </label>
                                            </div>
                                          </div>
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
    if (v.value.trim() != '') {
      if (stats.length) {
        let cs = stats.find(function (status) {return status.checked == true})
        addChip({name:info.name, id: info.id ,unit: info.unit , quantity: v.value, status: cs.value},chipsHolder,['id','name','quantity','status','unit'])
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
export function addUprofile(data){
  e = addshade();
  a = document.createElement('div')
  e.appendChild(a)
  b = ``;
  q = ``
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
  for (const beneficiary of data.beneficiaries) {
    q+= `
      <li class="ls-none flex p-5p bsbb benef hover-6" data-id="${beneficiary.id}">
        <span class="px-5p"><i class="bx bx-user"></i></span><span class="capitalize fw-semibold">${beneficiary.name}</span>
      </li>
    `
  }
  data.dob = ` ${new Date(data.dob).getDay()}/${new Date(data.dob).getMonth()}/${new Date(data.dob).getFullYear()}`
  if (!b) b = ` <li class="ls-none flex p-5p bsbb"><span class="btn btn-sm btn-label-danger">N/A</span></li>`
  if (!q) q = ` <li class="ls-none flex p-5p bsbb"><span class="btn btn-sm btn-label-secondary">N/A</span></li>`

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
                        <li class="align-items-center mb-3">
                          <i class="bx bx-detail"></i><span class="fw-semibold mx-2">Beneficiaries:</span> <span class="block">
                            <ul class="px-3p">
                              ${q}
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
  return a
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
    a.className = "w-40 h-55 p-10p bsbb ovh bc-white cntr zi-10000 br-10p card b-mgc-resp"
    a.innerHTML = `<div class="card-header d-flex align-items-center justify-content-between p-10p mb-10p bsbb">
                      <h5 class="card-title m-0 me-2 capitalize">select the receiver</h5>
                  </div>
                  <div class="ovys w-100 h-85 scroll-2 menu-vertical">
                    <ul class="menu-inner py-1 the-cont">
                    </ul>
                  </div>
                  `
    c = a.querySelector('ul')
    for (const department of Object.keys(group)) {
      d = document.createElement('li')
      d.className = 'w-100 menu-item'
      d.innerHTML = `<a href="javascript:void(0);" class="menu-link dgray fs-18 capitalize hover-2">
                        <div class="dep" data-id="${(extra)? (key == 'department') ?group[department][0].department.id : group[department][0][key] :group[department][0].department.id}">${department}</div>
                        <div class="p-a drop-buttons p-10p bsbb hover-2 center r-0"><div class="right-arrow p-r tr-0-3"></div></div>
                    </a>`
      let ul = document.createElement('ul')
      ul.className = 'hidden trigger-show'
      d.appendChild(ul)
      for (const employee of group[department]) {
        let subm = document.createElement('li')
        subm.className = 'menu-item my-8p px-6p bsbb'
        subm.innerHTML = `
                        <div class="d-flex">
                              <div class="flex-shrink-0 me-3">
                                <div class="avatar ${(employee.online)? 'avatar-online':'avatar-offline'} ">
                                  <span class="w-40p h-40p br-50 center bc-tr-theme capitalize">${employee.Full_name.substring(0,1)}</span>
                                </div>
                              </div>
                              <div class="flex-grow-1 hover-2 emp" data-id="${employee.id}">
                                  <h6 class="mb-1 capitalize">${employee.Full_name}</h6>
                                  <p class="mb-0 capitalize">${employee.title}</p>
                                  <!-- <small class="text-muted">last seen 1h ago</small> -->
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
   return u
}
export async function showAvaiAssurances(assurances){
  u = addshade();
  a = document.createElement('div')
  u.appendChild(a)
  a.className = "w-40 h-55 p-10p bsbb ovh bc-white cntr zi-10000 br-10p card-5 b-mgc-resp"
  a.innerHTML = `<div class="card-header d-flex align-items-center justify-content-between p-10p mb-10p bsbb">
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
                              <h6 class="mb-1 capitalize">${assurance.name}</h6>
                              <p class="mb-0 capitalize"><span class ="btn btn-sm ${(assurance.eligibility == 'eligible')?'btn btn-label-success':'btn-label-danger'}">${assurance.eligibility}</span></p>
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
                            <h6 class="mb-1 capitalize">Private</h6>
                            <p class="mb-0 capitalize"><span class ="btn btn-sm btn-label-secondary">no assurance used</span></p>
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
export function calcTime(targetTime) {
  targetTime = new Date(targetTime)
  let currentTime = new Date();
  currentTime.setHours(currentTime.getHours() - 1)
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
  defaultLi.innerHTML = `<span class="capitalize dgray flex fs-16p bold-2">no entries available</span>`
}
export function getLocs(map,required) {
  let cache = []
  if (required == "province") {
      for (const provinces of map) {
          cache.push({id: provinces.provinces[0].id, name: provinces.provinces[0].name})
      }
      return cache
  }else if (required == "district") {
      for (const provinces of map) {
          for (const district of  provinces.provinces[0].districts) {
              cache.push({id: district.id, name: district.name})
          }
      }
      return cache
  }else if (required == "sector") {
      for (const provinces of map) {
          for (const district of  provinces.provinces[0].districts) {
              for (const sector of district.sectors) {
                  cache.push({id: sector.id, name: sector.name})
              }
          }
      }
      return cache
  }else if (required == "cell") {
      for (const provinces of map) {
          for (const district of  provinces.provinces[0].districts) {
              for (const sector of district.sectors) {
                  for (const cell of sector.cells) {
                      cache.push({id: cell.id, name: cell.name})
                  }
              }
          }
      }
      return cache
  }
}
