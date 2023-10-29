var ws;
export function ConnectDevice() {

    if ("WebSocket" in window) {
       let status =  connectFP("ws://127.0.0.1:21187/fps",callback =>{

       });
    return status
    } else {
       return {success: false, message: "Error: Browser not supported!"}
    };
}

export function connectFP(host,callback) {
    host = "ws://127.0.0.1:21187/fps";
    try {
        ws = new WebSocket(host);

    } catch (err) {
        return callback({success: false, message: "Error: there was an error while connecting to the fingerprint SDK!"})
    }

    ws.onopen = function () {
        callback({success: true, message: "connected to SDK!", socket: ws})
    };
    ws.onmessage = function (evt) {

        var obj = eval("(" + evt.data + ")");
        switch (obj.workmsg) {
            case 1:
                callback({success: false, message: "Please turn on or connect your device"})
                break;
            case 2:
                callback({success: 'awaiting', message: "Please press your finger..."})
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
                    callback({success: false, message: "Failed to collect fingerprint template"})
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
                    callback({success: 'awaiting', message: "Processing, place your finger again...", type: 'fp-image', data: "data:image/png;base64," + obj.image})
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
                // callback({success: true, message: "Comparison score:",type: 'comparison', data: obj.retmsg})
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
    };

    ws.onclose = function () {
        callback({success: false, message: "connection to the fingerprint SDK was closed"})
    };
};

export function Relink() {
    ws.close();
    connect("ws://127.0.0.1:21187/fps");
}


export function EnrollTemplate() {
    try {
        console.log('enrolling')
        var v1 = "0";       //Fingerprint color   0 red,1 red,2 green,3 blue
        var v2 = "0";       //background color    1 transparent,0 White
        var cmd = "{\"cmd\":\"enrol\",\"data1\":\"" + v1 + "\",\"data2\":\"" + v2 + "\"}";
        ws.send(cmd);
    } catch (err) {
    }
    return {success: 'awaiting', message : 'place your finger'}

}

export function GetTemplate() {
    try {
        var v1 = "0";   //Fingerprint color   0 red,1 red,2 green,3 blue
        var v2 = "0";   //background color    1 transparent,0 White
        var cmd = "{\"cmd\":\"capture\",\"data1\":\"" + v1 + "\",\"data2\":\"" + v2 + "\"}";
        ws.send(cmd);
    } catch (err) {
    }
    return {success: 'awaiting', message : 'place your finger'}
}

function MatchTemplate() {
    var v1 = document.getElementById("enroldata").value;
    var v2 = document.getElementById("matchdata").value;
    if ((v1.length > 256) && (v2.length > 256)) {                                
        var cmd = "{\"cmd\":\"match\",\"data1\":\"" + v1 + "\",\"data2\":\"" + v2 + "\"}";
        try {
            ws.send(cmd);
        } catch (err) {
        }
    } else {
        document.getElementById("state").value = "Please enter receipt first";
    }            
}


function RelinkDevice() {
    try {
        var cmd = "{\"cmd\":\"opendevice\",\"data1\":\"\",\"data2\":\"\"}";
        ws.send(cmd);
    } catch (err) {
    }
}

function GetDeviceSN() {
    try {
        var cmd = "{\"cmd\":\"getsn\",\"data1\":\"\",\"data2\":\"\"}";
        ws.send(cmd);
    } catch (err) {
    }
}

function AboutImage() {
    try {
        var cmd = "{\"cmd\":\"aboutimage\",\"data1\":\"\",\"data2\":\"\"}";
        ws.send(cmd);
    } catch (err) {
    }
}