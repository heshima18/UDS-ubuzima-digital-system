function generate2FAcode() {
    const now = new Date();
    const timestamp = now.getTime();
    const randomComponent = generateRandomComponent(); 
    const combinedValue = `${timestamp}${randomComponent}`;
    const hashedValue = hashCode(combinedValue);
    const userID = String(hashedValue).slice(0, 6);
  
    // return userID;
    return 123456;

  }
  function generateRandomComponent() {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }
  
  function hashCode(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash >>> 0;
      hash |= 0;
    }
    let hashString = hash.toString();
    hashString = hashString.replace(/-/g, "");
    return parseInt(hashString);
  }
  

 export default generate2FAcode