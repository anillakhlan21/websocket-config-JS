let url;
let webSS;
document.getElementById('connectBtn').innerText = "Connect";
function connectToWebsocket(){
    url = "ws://"+document.getElementById('routerIp').value+":8080";
    webSS = new WebSocket(url);
    if(document.getElementById('connectBtn').innerText === "Connect"){
        webSS.onopen = ()=>{
            console.log("connected to websocket server");
            document.getElementById('connectBtn').innerText = "Disconnect"
        }
    }else{
        webSS.close();
        document.getElementById('connectBtn').innerText = "Connect";
    }
    webSS.close = ()=>{
        console.log("connection to websocket server is closed");
    }
    webSS.onerror = (ev)=>{
        console.log(ev);
    }
}





function sendData(){
    let inputElements = document.getElementsByClassName('configData');
    let outputData = '{'
    let length = inputElements.length;
    for(let i=0; i< length; i++){
        let key = inputElements[i].name;
        let value = inputElements[i].value;
        if(key=== "IPAddress" || key==="Parity" || key=== "Com_Port"){
            outputData+= `"${key}"`+":"+`"${value}"`;
        }else{
            outputData+= `"${key}"`+":"+value;
        }
        if(i===inputElements.length-1){
            outputData+="}";
        }else{
            outputData+=",";
        }
    }
    console.log(outputData);
    webSS.send(outputData);
}
function retrieveData(){
    webSS.send("send");
    webSS.onmessage = (msgEvent)=>{
    // console.log(msgEvent.data);
    if(msgEvent.data == 'OK'){
        alert("data saved in config file");
    }else{
        let jsonFiledata= JSON.parse(msgEvent.data);
        console.log( jsonFiledata);
        let inputElements = document.getElementsByTagName('input');
        let length = inputElements.length;
        for(let i=0; i< length;i++){
            let key = inputElements[i].name;
            if(new Object(jsonFiledata).hasOwnProperty(key)){
                inputElements[i].value = new Object(jsonFiledata)[key]
                // console.log(key);
            }
        }
    }
}
}