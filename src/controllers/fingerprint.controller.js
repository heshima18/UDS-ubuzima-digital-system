import WebSocket from 'ws';
var ws


export async  function connectFP(host,callback) {
    host = "ws://127.0.0.1:21187/fps";
    return new Promise((resolve,reject)=>{
        ws = new WebSocket(host);
        ws.onopen = function () {
            resolve({success: true, message: "connected to SDK!", type: 'connection', socket: ws})
        };
        ws.onerror = function (error) {
            console.log('there was an error while connecting to fp SDK')
            reject({success: false, message: "Error: there was an error while connecting to the fingerprint SDK!", type: 'connection'})
        };
        ws.onmessage = function (evt) {
            var obj = eval("(" + evt.data + ")");
            switch (obj.workmsg) {
                case 1:
                    callback({success: false, message: "Please turn on or connect your device"})
                    break;
                case 2:
                    callback({success: 'awaiting', message: "Please press your fingers..."})
                    break;
                case 3:
                    callback({success: `awaiting`, message: "Please lift your finger..."})
                    break;
                case 4:
                    
                    break;
                case 5:
                    if (obj.retmsg == 1) {
                        if (obj.data1 == "null") {
                            
                        } else {
                            callback({success: true, message: "Fingerprint template collection successful", type: 'fp-data', data: obj.data1})
                            // var en2 = document.getElementById("matchdata");
                            // en2.value = obj.data1;
                        }
                    } else {
                        callback("Failed to collect fingerprint template")
                    }
                    break;
                case 6:
                    if (obj.retmsg == 1) {
                        if (obj.data1 == "null") {
                            
                        } else {
                            callback({success: true, message: "Registered fingerprint template successfully", type: 'fp-data', data: obj.data1})
                            // var en1 = document.getElementById("enroldata");
                            // en1.value = obj.data1;
                        }
                    } else {
                        callback({success: false, message: "Failed to register fingerprint template"})
                    }
                    break;
                case 7:
                    if (obj.image == "null") {
                    } else {
                        callback({success: true, message: "Registered fingerprint template successfully", type: 'fp-image', data: "data:image/png;base64," + obj.image})
                        // var img = document.getElementById("fpimage");
                        // img.src = "data:image/png;base64," + obj.image;
    
                        // var en3 = document.getElementById("fingerimage");
                        // en3.value = obj.image;
                    }
                    break;
                case 8:
                    callback({success: false, message: "time out"})
                    break;
                case 9:
                    if (obj.retmsg < 80) {
                        callback({success: false, message: "Comparison score:",type: 'comparison', data: obj.retmsg})
                        
                    }else{
                        callback({success: true, message: "Comparison score:",type: 'comparison', data: obj.retmsg})
                    }
                    ws.close();
                    break;
                case 10:
                    if (obj.image == "null") {
                    } else {
                        var en4 = document.getElementById("e4");
                        en4.value = obj.image;
                    }
                    break;
                case 15:
                    if (obj.retmsg == 1) {
                        callback({success: true, message:"Reconnected device successfully"})
                    } else {
                        callback({success: false, message:"Failed to reconnect device"})
                    }
                    break;
                case 18:
                    if (obj.image == "null") {
                    } else {
                        callback({success: true, message: "Registered fingerprint template successfully", type: 'fp-image', data: "data:image/png;base64," + obj.image})
                        // var img = document.getElementById("fpimage");
                        // img.src = "data:image/jpeg;base64," + obj.image;
                    }
                    break;
                case 19:
                    callback({success: true, message: "Registered fingerprint template successfully", type: 'fp-image', data: "data:image/png;base64," + obj.image})
                    break;
            }
            ws.close();
        };
        ws.onclose = function () {
            reject({success: false, message: "connection to the fingerprint SDK was closed"})
        };

    })
};


export function MatchTemplate(data1,data2) {
    if ((data1.length > 256) && (data2.length > 256)) {                                
        var cmd = "{\"cmd\":\"match\",\"data1\":\"" + data1 + "\",\"data2\":\"" + data2 + "\"}";
        try {
            ws.send(cmd);
        } catch (err) {
            console.log(err)
            return 0
        }
    } else {
       return 0
    }            
}
