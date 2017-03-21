![alt tag](https://camo.githubusercontent.com/56c24ffe3f0b7230fc8209bbffda43386b6fd13b/687474703a2f2f7333322e706f7374696d672e6f72672f337270776b706867352f53657269616c5f73696d626f6c2e706e67)
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
var SerialPort = require('serial-node');
var serial = new SerialPort();
var match = serial.list();
for(i=0;i<list.length;i++) 
{
    console.log(match[i]); 
}
```
Note: if there is no available port, the returned array is equal 0.

#### use(port,values)
This function is to set up and use a port. 
The parameter 'port' is required and is the port name. 

Example:
```javascript
var SerialPort = require('serial-node');
var serial = new SerialPort();
serial.use('COM3');
'port' -> COM{N} (Windows).
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
var SerialPort= require('serial-node');
var serial = new SerialPort();
serial.use('COM3');
serial.write('hi!');
```
Note: encoding is ASCII.
#### read([looping])
This function is to read the serial port, returns the value(split by '\n' or '\0' of '\r'). 

Example 1: 
```javascript
var SerialPort= require('serial-node'), serial = new SerialPort();
serial.use('COM3'); 
var read = serial.read();
console.log(read);
```

Example 2: *(Using looping feature)*
When the lopping parameter is *true* the callbackUse is called until the *stop* function is called.
```javascript
var SerialPort= require('serial-node');
var serial = new SerialPort();

serial.use('COM3', { 
            callbackRead: function (args) {
      
                var read = args.value.trim() || '';
	            console.log(read);

            }
          });

//reading serial in looping
serial.read(true);
  
``` 
#### stop()
This function is to stop reading if was set to looping 

Example: 
```javascript
var SerialPort= require('serial-node');
var serial = new SerialPort();

serial.use('COM3', { 
            callbackRead: function (args) {
      
                var read = args.value.trim() || '';
	            console.log(read);

            }
          });

//reading serial in looping
serial.read(true);

//wait for 5 seconds to stop reading
setTimeout(function () {
    serial.stop();
}, 5000);

```

### Events
Please, take a look into callbacks on Use function options.
Example: 
```javascript

var SerialPort= require('serial-node');
var serial = new SerialPort();
//creating the serial object
var serial = new SerialPort();

//setting use with config arguments and callback functions
serial.use('COM3', {
    baud: '2400',
    callbackUse: function (args) {

        if (args.state) {

            //reading serial in looping
            serial.read(true);
 
            //wait for 5 seconds to stop reading
            setTimeout(function () {
                serial.stop();
            }, 5000);
             
        }

    },
    callbackRead: function (args) {
         
        //my rules to accept data when the serial data was like: @6:0!
        var read = args.value.trim() || '';
        if (read.startsWith('@') && read.endsWith('!') && read.length == 5) {

            //show the useful data
            console.log(read);

        }

    },
    callbackWrite: function (args) {

        //nothing todo for now

    },
    callbackList: function (args) {

        //nothing todo for now

    }

});
```
