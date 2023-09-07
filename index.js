import { setSocket, mapPort, addPort, removePort, getAllPortMappings } from './controllers/tmole.js';
import { io } from "socket.io-client";
import * as db from "./controllers/dbcontroller.js"
/* Server
import http from 'http'
import {Server} from 'socket.io'

const server = http.createServer();
const io = new Server(server);

io.on('connection', client => {
  client.on('event', data => { 
    
  });
  client.on('disconnect', () => { 
  
  });
});

server.listen(4000);
*/

// 2.
/*
const router  = express.Router(); 
router.post('/addPort', addPort)
router.get('/getAll',getAllPortMappings)
router.delete('/deletePort',removePort);

const app = express();

app.use(express.json());

app.use('/', router); //to use the routes
// 4. 
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
*/

const socket = io("ws://127.0.0.1:101");
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    setSocket(socket);
});
socket.on("addPort", (data) => {
    console.log("addPort ", data.port);
    addPort(data.port);
});

socket.on("removePort", (data) => {
    console.log("RemovedPort", data.port);
    removePort(data.port);
})

socket.on("ping",(empty)=>{
    socket.emit("pong","");
})

socket.on("getAllPorts", (data) => {
    db.getAllPorts((ports) => {
        let portUrls = [];
        for(let i =0; i< ports.length;i++){
            let port = ports[i];
            mapPort(port, (tunnelUrl) => {
                portUrls.push({...tunnelUrl});
            })
        }
        let interval = setInterval(()=>{
            if(portUrls.length == ports.length){
                clearInterval(interval);
                socket.emit("allPorts", { "ports": portUrls });
            }
        },200)
        
    });

})
socket.on("disconnect", (data) => {
    console.log("reasonf disconnect", data);
    console.log(socket.id); // undefined
});