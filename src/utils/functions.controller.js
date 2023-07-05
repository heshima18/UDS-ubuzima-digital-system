export async function request(url,options){
    try {
      let z = await fetch('http://127.0.0.1:7000/'+url,options);
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