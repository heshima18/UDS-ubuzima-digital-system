import { addshade, initializeSpecialCleave } from "./functions.controller.js";
let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
export function showPaymentPopup() {
    let shade = addshade();
    let cont = document.createElement('div')
    shade.appendChild(cont)
    cont.className = `w-45 h-50 p-20p bsbb ovh bc-white cntr zi-10000 br-10p card-5 b-mgc-resp`
    cont.innerHTML = ` <div class="w-100 h-100 1st form-hol ovh p-r t-0 l-0 tr-0-3" name="pay">
    <div class="w-100 h-100 p-r p-5p bsbb">
     <div class="p-5p bsbb">
        <div class="the-h w-80 m-a bfull-resp p-10p bsbb h-40p">
            <ul class="flex ls-none p-0 m-0 jc-sb w-100">
                <li class="p-5p bsbb">
                    <span class="w-100 h-100 p-10p hover-2 cpcards bsbb iblock verdana active bb-1-s-theme bc-tr-theme nowrap capitalize fs-13p theme br-5p">visa & mastercard</span>
                </li>
                <li class="p-5p bsbb">
                    <span class="w-100 h-100 p-10p hover-2 cpcards bsbb iblock verdana nowrap capitalize fs-13p br-5p">airtel & MTN money</span>
                </li>
            </ul>
        </div>
        <div class="p-r w-100 h-a">
            <div class="w-100 h-a pform p-r l-0 tr-0-2">
                <form method="post" name="card-payment-form" class="p-10p bsbb payment-form" id="payment-form">
                    <div class="w-100 h-60p mt-30p mb-10p p-10p bsbb flex ">
                        <div class="w-100 bsbb flex left parent p-r">
                            <div class="w-65 bsbb left parent p-r mr-10p">
                                <label for="expiritydate form-label dgray capitalize">names</label>
                                <input type="text" name="fullname" placeholder="names on the card" class="form-control main-input">
                                <small class="red verdana hidden ml-5p">error mssg</small>
                            </div>
                            <div class="w-35 bsbb block left parent p-r">
                                <label for="expiritydate form-label dgray capitalize">expirity</label>
                                <input type="text" name="expiritydate" placeholder="mm / yyyy" class=" form-control main-inpu require-cleave" id="expiritydate" min="2023" max="2040">
                                <small class="red verdana hidden ml-5p">error mssg</small>
                            </div>
                        </div>
                    </div>
                    <div class="w-100 h-60p mt-30p mb-10p p-10p bsbb flex">
                        <div class="w-30 bsbb igrid mr-10p left parent p-r">
                            <label for="expiritydate form-label dgray capitalize">CVV</label>
                            <input type="text" name="cvv" placeholder="Cvv" class=" form-control main-input require-cleave" id="cvv" >
                            <small class="red verdana hidden ml-5p">error mssg</small>
                        </div>
                        <div class="p-r w-100 bsbb igrid parent">
                            <label for="expiritydate form-label dgray capitalize">number</label>
                            <input  type="text" name="cardnumber" placeholder="Card Number" class="form-control main-input require-cleave">
                            <small class="red verdana left hidden ml-5p">error mssg</small>
                        </div>
                    </div>                                 
                    <div class="w-100  h-60p mt-20p p-r right mb-10p p-10p bsbb">
                        <div class="w-100 h-100">
                            <span class="iblock w-100 h-100">
                                <button type="submit" class="bc-theme p-10p b-none w-100 br-20p hover-2">
                                    <span class="verdana white fs-15p capitalize">proceed</span>
                                </button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="w-100 h-a pform p-a l-100 va-t t-0 tr-0-2">
                <form method="post" name="mobile-money-form" class="p-10p bsbb payment-form" id="payment-form">
                    <div class="w-100 h-60p mt-30p mb-10p p-10p bsbb flex ">
                        <div class="w-100 bsbb igrid left parent p-r">
                            <label for="isp"  class="dgray p-a fs-13p label pi-none us-none  ml-30p verdana">choose ISP</label>
                            <select type="multiple" name="isp" placeholder="" class=" form-control main-input">
                                <option></option>
                                <option value="MTN">
                                    <span class="flex">
                                        <span class="img w-60p h-100">
                                            <img alt="logo" src="../icons/mtnmomoicon.jpg" class="w-100 h-100 cover br-5p">
                                        </span>
                                        <span class="fs-13p verdana nowrap capitalize">MTN momo</span>

                                    </span>
                                </option>
                                <option value="airtel">
                                    <span class="flex">
                                        <span class="img w-60p h-100">
                                            <img alt="logo" src="../icons/airtelmoneylogo.png" class="w-100 h-100 cover br-5p">
                                        </span>
                                        <span class="fs-13p verdana nowrap capitalize">Airtel money</span>

                                    </span>
                                </option>
                            </select>
                            <small class="red verdana hidden ml-5p">error mssg</small>
                        </div>
                    </div>
                    <div class="w-100 h-60p mt-30p mb-10p p-10p bsbb flex ">
                        <div class="p-r w-100 bsbb flex parent">
                            <div class="no-outline bsbb b-1-s-dgray bc-gray w-30 pt-15p pb-15p mt--5p iblock">
                                <div class="consolas fs-14p dgray center">+250</div>
                            </div>
                            <input type="number" name="payphonenumber" placeholder="Phone number" class="no-outline bsbb b-1-s-dgray bc-white w-80 p-15p mt--5p main-input iblock require-cleave" id="payphonenumber">
                            <small class="red verdana left hidden ml-5p p-a w-100 mt-40p nowrap">error mssg</small>
                        </div>
                    </div>                               
                    <div class="w-100  h-60p mt-20p p-r right mb-10p p-10p bsbb">
                        <div class="w-100 h-100">
                            <span class="iblock w-100 h-100">
                                <button type="submit" class="bc-theme p-10p b-none w-100 br-20p hover-2">
                                    <span class="verdana white fs-15p capitalize">proceed</span>
                                </button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
     </div>
    </div>
 </div>`
 let container = cont.querySelector('div[name="pay"]')
 let cpcards = Array.from(container.querySelectorAll('span.cpcards'))
    cpcards.forEach((changepaymentmethodcard)=>{
      changepaymentmethodcard.addEventListener('click',()=>{
        cpcards.forEach((cp)=>{
          cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
        })
        changepaymentmethodcard.classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
        chpform(cpcards.indexOf(changepaymentmethodcard))
      })
    })
    function chpform(step) {
      let pform = Array.from(container.querySelectorAll('div.pform'));
      if (step == 1) {
        pform[0].classList.replace('l-0','l--100')
        pform[1].classList.replace('l-100','l-0')

      }else if(step == 0){
        pform[1].classList.replace('l-0','l-100')
        pform[0].classList.replace('l--100','l-0')
      }
    }
 let p = Array.from(document.querySelectorAll('form#payment-form'));
    p.forEach(paymentForm=>{
        t = Array.from(p[1].querySelectorAll('input.main-input'));
        t.forEach(input=>{
            input.addEventListener('keyup',(e)=>{
                e.preventDefault()
            if (input.name == 'payphonenumber') {
                    v=vdtins('phonenumber',input.value)
                    if (v == 0) {
                        setErrorFor(input,'invalid phone number')
                    }else{

                        setSuccessFor(input)
                    }
                }
            })
        })
        paymentForm.addEventListener('submit',(e)=>{
            z = Array.from(p[p.indexOf(paymentForm)].querySelectorAll('.main-input'))
            e.preventDefault()
            if (paymentForm.classList.contains('op-0-3')) return 0
            validateForm(paymentForm,z,null);
        })
    })
    let cleaveRequires = Array.from(cont.querySelectorAll('.require-cleave'))
    cleaveRequires.forEach(input=>{
       let type = input.name
       console.log(type)
       if( type == 'expiritydate'){
        initializeSpecialCleave(input,[2,4],6,'-')
       }
    })
}