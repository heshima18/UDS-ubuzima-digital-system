var q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
export async function request(url,options){
    try {
      let z = await fetch(geturl() +url,options);
      let y = await z.json();
      return y;
    } catch (error) {
      console.log(error)
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