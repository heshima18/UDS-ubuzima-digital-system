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
      body.classList.add('blur')
  let thebody = document.querySelector('div.cont'); 
  var shaddow = document.createElement('div');
  thebody.appendChild(shaddow);
  shaddow.className = "w-100 h-100 ovh p-f bsbb bc-tblack t-0 zi-10000 blur-bc";	
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
export function showRecs(input, data) {
  let div =  document.createElement('div');
  let parent = input.parentNode
  let chipsHolder = parent.querySelector('div.chipsholder')
  if (!chipsHolder) {
    chipsHolder = document.createElement('div');
    chipsHolder.className = 'chipsholder p-5p bsbb w-100'
    chipsHolder.title = 'departments'
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
    addChip({name:item.textContent, id: item.getAttribute('data-id')},chipsHolder)
   })
  })
  input.onblur = function () {
    setTimeout(e=>{parent.removeChild(div)},200)
  }
  input.onkeyup = function () {
   let value = this.value.trim();
   items.forEach(item =>{
    console.log(item.textContent.indexOf(value))
    if (item.textContent.indexOf(value) == -1) {
      item.classList.add('hidden')
    }else{
      item.classList.remove('hidden')

    }
    console.log(item)
   })
  }

}
export function addChip(info,parent) {
  c = document.createElement('span')
  c.className = 'w-a h-a b-1-s-gray br-2p p-5p m-5p fs-13p iblock chip verdana dgray consolas ';
  r = document.createElement('div');
  r.className = "w-20p h-20p p-r right bc-white remove ml-5p  b-1-s-gray center br-50 hover"
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
    if (parent.title == 'departments') {
      d.push(chip.querySelector('span').getAttribute('data-id'))
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