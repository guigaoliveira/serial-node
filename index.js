var fs = require('fs');
var child_process = require('child_process');
var Buff = require('buffer').Buffer;
var fd, config = {}, check_e = 0, stop = false;
var constant = {
    dbits: [5, 6, 7, 8],
    sbits: [1, 1.5, 2],
    parity: ['NONE', 'EVEN', 'MARK', 'ODD', 'SPACE'],
    on_off: ['on', 'off'],
    read_end: ['\n', '\0', '\r']
};

function contains(string, check) {
    return string.indexOf(check) != -1;
}
function onoff(value) {
    return (!value) ? 'off' : (contains(ON_OFF, value)) ? value : 0;
}
function error_use(config_var, local_var, text) {
    if (config_var === 0) {
        console.log('Error (function use): Invalid ' + text + ': ' + local_var);
        check_e = 1;
    }
}

function open() {
    try {
        port = "\\\\.\\" + config.port;
        fd = fs.openSync(port, 'w+');
    }
    catch (err) {
        console.log(err.message);
    }
};
function close() {
    try {
        fs.closeSync(fd);
    }
    catch (err) {
        console.log(err.message);
    }

};


var SerialPort = function () { };

SerialPort.prototype.use = function (port, options) {
    options = options || {};
    config.port = (!port) ? 0 : ((port.match(/^COM(\d+)$/gi)) ? port : 0);
    config.baud = (!options.baud) ? 9600 : (options.baud.match(/([\d])+/g)) ? options.baud : 0;
    config.databits = (!options.databits) ? 8 : (contains(constant.dbits, options.databits)) ? options.databits : 0;
    config.parity = (!options.parity) ? 'N' : (contains(constant.parity, options.parity.toUpperCase())) ? options.parity.charAt(0) : 0;
    config.stopbits = (!options.stopbits) ? 1 : (contains(constant.sbits, options.stopbits)) ? options.stopbits : 0;
    config.to = onoff(options.timeout);
    config.xon = onoff(options.xon);
    config.odsr = onoff(options.odsr);
    config.octs = onoff(options.octs);
    config.dtr = (options.dtr == 'hs') ? options.dtr : onoff(options.dtr);
    config.rts = (!options.dtr) ? 'on' : (contains(ON_OFF, options.rts) || options.rts == 'hs' || options.rts == 'tg') ? options.rts : 0;
    config.idsr = onoff(options.idsr);
    config.callbackUse = (!options.callbackUse ? function () { } : options.callbackUse);
    config.callbackWrite = (!options.callbackWrite ? function () { } : options.callbackWrite);
    config.callbackRead = (!options.callbackRead ? function () { } : options.callbackRead);
    config.callbackList = (!options.callbackList ? function () { } : options.callbackList);
    config.options = options;

    error_use(config.port, port, 'port');
    error_use(config.baud, options.baud, 'baud');
    error_use(config.databits, options.databits, 'databits');
    error_use(config.parity, options.parity, 'parity');
    error_use(config.stopbits, options.stopbits, 'stopbits');
    error_use(config.to, options.timeout, 'timeout');
    error_use(config.xon, options.xon, 'xon');
    error_use(config.odsr, options.odsr, 'odsr');
    error_use(config.octs, options.octs, 'octs');
    error_use(config.dtr, options.dtr, 'dtr');
    error_use(config.rts, options.rts, 'rts');
    error_use(config.idsr, options.idsr, 'idsr');

    if (!check_e) {
         
        var list = this.list();
        if (list.indexOf(port) > -1) {
            try {
                var mode = child_process.execSync("mode " + config.port + ": BAUD=" + config.baud + " PARITY=" + config.parity + " data=" + config.databits + " stop=" + config.stopbits + " rts=" + config.rts + "", { encoding: 'utf8' });
                config.callbackUse({ state: true });
            }
            catch (e) {
                config.callbackUse({ state: false, error: e });
            }
        }
        else {
            config.callbackUse({ state: false, error: x = new Error('Port is not available.') });
        }

    }
};

SerialPort.prototype.list = function () {
    try {
        var list = child_process.execSync('mode', { encoding: 'utf8' });
        var match = list.match(/[COM]+[\d]+/g);
        if (match == null) match = [0];
        config.callbackList({ state: true, value: match });
        return match;
    }
    catch (e) {
        config.callbackList({ state: false, error: e });
    }
};
SerialPort.prototype.write = function (value) {
    try {

        open();

        fs.writeSync(fd, value, null, "ascii");
        config.callbackWrite({ state: true });

        close();

    }
    catch (err) {
        config.callbackWrite({ state: false, error: err });
    }
};
SerialPort.prototype.stop = function () {
    stop = true;
},
SerialPort.prototype.read = function (looping) {
    try {

        var $this = this;
        open();

        var print = '', string;
        while (!contains(constant.read_end, string)) {
            var buff = new Buff([0]);
            var read = fs.readSync(fd, buff, 0, 1, null);
            string = buff.toString();
            if (read === 1) print += string; else buff = null;
        }

        close();
        config.callbackRead({ state: true, value: print });

        if (stop) {
            stop = false;
        } else {
            if (looping) {
                setTimeout(function () {
                    $this.read(looping);
                }, 10);
            }
        }

        return print;

    } catch (err) {
        config.callbackRead({ state: false, error: err });
    }
};

module.exports = SerialPort;
