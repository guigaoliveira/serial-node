# Serial-node
Serial-node is a module for Node.js to control serial ports. (For now only for windows, soon to Linux and MacOS.)
### Installation
Via NPM:
```sh
npm install serial-node 
https://www.npmjs.com/package/serial-node
```
### Functions
#### list()
This function list the available ports on your computer, returns an array of ports. 

Example:
```javascript
const SerialPort = require('serial-node');
const serialList = new SerialPort().list();

serialList.forEach(console.log); 

```
Note: if there is no available port, the returned array is equal 0.

#### use(port,values)
This function is to set up and use a port. 
The parameter 'port' is required and is the port name. 

Example:
```javascript
const SerialPort = require('serial-node');
const serial = new SerialPort();
serial.use('COM3');
```
###### values (optional)
The parameter 'values' is to set the parameters of a serial port.

 * baud, defaults to 9600. Must be a number you specify.
 * databits, defaults to 8. Must be one of: 8, 7, 6, or 5.
 * parity, defaults to none. Must be one of: none, even, mark, odd, or space.
 * stopbits, defaults to 1. Must be one of: 1,1.5, or 2.
 * timeout, defaults to off. Must be one of: on or off.
 * xon, defaults to off. Must be one of: on or off.
 * odsr, defaults to off. Must be one of: on or off.
 * octs, defaults to off. Must be one of: on or off.
 * dtr, defaults to off. Must be one of: on or off. 
 * rts, defaults to on. Must be one of: on or off.
 * idsr, defaults to off. Must be one of: on or off.
 * callbackUse , function callback when **Use** is completed.
 * callbackWrite , function callback when **Write** is completed.
 * callbackRead , function callback when **Read** is completed.
 * callbackList, function callback when **List** is completed.
  
#### write(value)
This function is to write the serial port. 

Example: 
```javascript
const SerialPort= require('serial-node');
const serial = new SerialPort();
serial.use('COM3');
serial.write('hi!');
```
Note: encoding is ASCII.
#### read([looping])
This function is to read the serial port, returns the value(split by '\n' or '\0' of '\r'). 

Example 1: 
```javascript
const SerialPort= require('serial-node');
const serial = new SerialPort();
serial.use('COM3'); 
const read = serial.read();
console.log(read);
```

Example 2: *(Using looping feature)*
When the lopping parameter is *true* the callbackUse is called until the *stop* function is called.
```javascript
const SerialPort= require('serial-node');
const serial = new SerialPort();

serial.use('COM3', { 
  callbackRead: (args) => {
    const read = args.value.trim() || '';
    console.log(read);
   }
 }
);

serial.read(true); // reading serial in looping
``` 
#### stop()
This function is to stop reading if was set to looping 

Example: 
```javascript
const SerialPort= require('serial-node');
const serial = new SerialPort();

serial.use('COM3', { 
  callbackRead: (args) => {
    const read = args.value.trim() || '';
    console.log(read);
   }
 }
);

serial.read(true); // reading serial in looping

// wait for 5 seconds to stop reading
setTimeout(() => {
    serial.stop();
}, 5000);
```

### Events
Please, take a look into callbacks on Use function options.
Example: 
```javascript

const SerialPort= require('serial-node');
const serial = new SerialPort();

// setting use with config arguments and callback functions
serial.use('COM3', {
    baud: '115200',
    callbackUse: (args) => {
        if (args.state) {
            // reading serial in looping
            serial.read(true);
 
            // wait for 5 seconds to stop reading
            setTimeout(() => {
                serial.stop();
            }, 5000);
        }
    },
    callbackRead: (args) => {
        // my rules to accept data when the serial data was like: @6:0!
        var read = args.value.trim() || '';
        if (read.startsWith('@') && read.endsWith('!') && read.length == 5) {
            // show the useful data
            console.log(read);
        }
    },
    callbackWrite: (args) => {
        // nothing todo for now
    },
    callbackList: (args) => {
        // nothing todo for now
    }
});
```
