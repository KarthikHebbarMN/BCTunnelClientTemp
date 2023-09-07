import tunnelmole from "./tunnelmole.js";
import minimist from "minimist"



const args = minimist(process.argv.slice(2), {
    alias: {
      port: 'p',
      endPoint: 'e'
    }
  });
  
  // Get values for --port and --endPoint
  const port = args.port;
  const endPoint = args.endPoint;
  
  console.log(`Port: ${port}`);
  console.log(`End Point: ${endPoint}`);

tunnelmole({port,endPoint});


  //export {tunnelmole}
/* tunnelmole({port:3000,endPoint:"ws://35.154.22.99:8080"}).then(
    x=> {console.log(x);}
 ).catch(
    x=> console.error(x))*/
//setup server and db with ports saved
//save locally
//ports