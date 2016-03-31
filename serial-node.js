var fs = require('fs');
var child_process = require('child_process');
var Buffer = require('buffer').Buffer;
var config={write,open,list,read,close,use};
var global_fd; // global file descriptor
var connect = 1; // var check if disconnect port / set mode port
var global= {}, global_e=0;

/* constants */
var DATABITS = [5,6,7,8];
var STOPBITS = [1,1.5,2];
var PARITY = ['NONE','EVEN','MARK','ODD','SPACE'];
var ON_OFF = ['on','off'];
var END_READ = ['\n','\0','\r'];

/* functions */
function contains(string,check) 
{ 
    return string.indexOf(check) != -1; 
}
function onoff(value)
{ 
    return (value===undefined) ? 'off' : (contains(ON_OFF,value)) ? value : 0;
}
function error_use(global_var,local_var,text)
{
    if(global_var===0)
    {
      console.log('Error (function use): Invalid '+text+': ' + local_var); 
      global_e=1;
    }
}
function notopen()
{
    if(!global_fd) 
    {
      console.log("Port is not open."); 
      process.exit();
    }
}
/* public functions */
function list(options)
{  
  var list = child_process.execSync('mode',{encoding: 'utf8'});
  var match = list.match(/[COM]+[\d]+/g);
  options = options || {};
  var aux = (options.output===0) ? 0 : (options.output===1 || options.output===undefined) ? 1 : 2;
  if(match===null) 
  {
    match=[0];
  }
  if(aux==2) 
  { 
    console.log("Error function(list), Invalid 'output':"+options.output); 
    process.exit();
  }
  if(aux==1)
  {
    for(i=0;i<match.length;i++) 
    {
      console.log(match[i]);
    }
  }
  return match;
}
function open()
{  
  try 
  { 
    if(connect===1 || connect===3) // when the cable is unplugged, reconnect and do "mode"
    {   
      try
      {
        var mode= child_process.execSync("mode "+global.port+": BAUD="+global.baud+" PARITY="+global.parity+" data="+global.databits+" stop="+global.stopbits+" to="+global.to+" xon="+global.xon+" odsr="+global.xon+" octs="+global.octs+" dtr="+global.dtr+" rts="+global.rts+" idsr="+global.idsr+"", { encoding: 'utf8' });
      } catch(e) {}
      connect=2;
    }
    port= "\\\\.\\" + global.port;
    global_fd=fs.openSync(port, 'w+');
  } 
  catch(err) 
  { 
      connect=3;
      var e = (err.code=='ENOENT') ? "Device not connected, please connect." : err.code;
      console.log("Error (function open): " + e); 
      process.exit();
  }
}
function use(port,values)
{ 
  values = values || {};
  if(port===undefined) port = 'undefined'; 
  global.port= (port=='empty') ? 0 : ((port.match(/^COM(\d+)$/gi)) ? port : 0);
  global.baud = (values.baud===undefined) ? 9600 : (values.baud.match(/([\d])+/g)) ? values.baud : 0;
  global.databits = (values.databits===undefined) ? 8 : (contains(DATABITS,values.databits)) ? values.databits : 0;
  global.parity =(values.parity===undefined) ? 'N' : (contains(PARITY,values.parity.toUpperCase())) ? values.parity.charAt(0) : 0;
  global.stopbits= (values.stopbits===undefined) ? 1 : (contains(STOPBITS,values.stopbits)) ? values.stopbits : 0;
  global.to = onoff(values.timeout); 
  global.xon = onoff(values.xon);
  global.odsr = onoff(values.odsr);
  global.octs = onoff(values.octs); 
  global.dtr = (values.dtr=='hs') ? values.dtr : onoff(values.dtr);
  global.rts = (values.dtr===undefined) ? 'on' : (contains(ON_OFF,values.rts)||values.rts=='hs'||values.rts=='tg') ? values.rts : 0;
  global.idsr = onoff(values.idsr);
  
  /* errors console print */
  error_use(global.port,port,'port');
  error_use(global.baud,values.baud,'baud');
  error_use(global.databits,values.databits,'databits');
  error_use(global.parity,values.parity,'parity');
  error_use(global.stopbits,values.stopbits,'stopbits');
  error_use(global.to,values.timeout,'timeout');
  error_use(global.xon,values.xon,'xon');  
  error_use(global.odsr,values.odsr,'odsr'); 
  error_use(global.octs,values.octs,'octs');
  error_use(global.dtr,values.dtr,'dtr');
  error_use(global.rts,values.rts,'rts');
  error_use(global.idsr,values.idsr,'idsr');

  if(global_e) 
  process.exit();
}
function write(value,callback) 
{
  notopen();
  fs.writeSync(global_fd, value, null, "ascii"); 
}
function read()
{
  notopen();
  var print='',string;
    while(!contains(END_READ,string))
    {
      var buffer= new Buffer([0]);
      var bytes= fs.readSync(global_fd, buffer, 0, 1, null);
      string= buffer.toString();
      if(bytes===1) print+=string;
      else buffer=null;
    }
    return print;
  }
function close()
{    
  notopen();
  fs.closeSync(global_fd);
}
module.exports=config; 
