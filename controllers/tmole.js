
import * as db from "./dbcontroller.js"
import { spawn, spawnSync } from "node:child_process"

let portTastkMap = new Map()
let portUrlMap = new Map();
let socket = null;
const setSocket = (pSocket) => {
    socket = pSocket;
}
//new portMap
//portMap all at start
//get all Maps
//future port check if use only then map, socket based
const addPort = (port) => {

    mapPort(port,(tunnelUrl)=>{
        socket?.emit("urlSet", { "port": port, "httpUrl": tunnelUrl.httpUrl });
    })
    db.addPort(port);
    //addall 
};

const removePort = (port) => {
    if (portTastkMap.has(port)) {
        let task = portTastkMap.get(port);
        task.kill("SIGINT");
        portTastkMap.delete(port);
    }
    db.removePort(port);
    console.log("Removed port");
    //addall 
};


const getAllPortMappings = () => {
    //addall 
    let ports = db.getAllPorts();
    console.log("All PORTs ", ports)
};



const mapPort = (port,cb) => {
    const tmoleClientInstance = spawn('node', ['.\\tunnelmole-client\\dist\\src\\index.js', '--port', port]);


    tmoleClientInstance.stdout.on('data', (data) => {
        let stringData = `${data}`;
        console.log(`stdout: ${data}`);
        const urlRegex = /(https?:\/\/\S+)/g;
        const portRegex = /:(\d+)\b/;
        const matches = stringData.match(urlRegex);
        let portNumber = stringData.match(portRegex);
        portNumber = Number(portNumber[1]);
        // Filter out the http:// and https:// parts
        const httpUrls = matches.filter(match => match.startsWith('http://'))[0];
        const httpsUrls = matches.filter(match => match.startsWith('https://'))[0];
        portTastkMap.set(portNumber, tmoleClientInstance);
        portUrlMap.set(portNumber, httpUrls);
        cb({port:portNumber,httpUrl:httpUrls})
       
       
    });

    tmoleClientInstance.stderr.on('data', (data) => {
        let strErrpr = `${data}`;
        if (strErrpr !== 'Debugger attached.\r\n') {
                socket?.emit("urlSetError", {"port":port,"type":"urlFetchFailed","reason":"Tunnel Server Down"});
        }
        console.error(`stderr: ${data}`);
    });



    tmoleClientInstance.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

   // tmoleClientInstance.kill("SIGINT");
    //let datsa = await tunnelmole({port,endPoint})
    // after 10ms: TaskHasBeenCancelledError('Task demoTask has been cancelled')
    //task.cancel(); // true
}

export { addPort, removePort, getAllPortMappings, setSocket,mapPort };
//module.exports = {addPort,removePort,getAllPortMappings};