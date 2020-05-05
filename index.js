/*
 * Console date/time prefixer
 * (C) 2020 Copyright Hojin Choi <hojin.choi@gmail.com>
 */

var strftime = require('./strftime');

var options = {
    'date-format': '%F %T.%f',
    'log-caller': false,
    'strip-prefix': null,
    'log-caller-frames': 1,
    'color': '',
    //-- internal use --//
    'coloroff': ''
};

var COLORS = {
    red:     '\x1b[1;31m',
    green:   '\x1b[1;32m',
    yellow:  '\x1b[1;33m',
    blue:    '\x1b[1;34m',
    magenta: '\x1b[1;35m',
    cyan:    '\x1b[1;36m',
    white:   '\x1b[1;37m',
    normal:  '\x1b[0m',
    none:    ''
};

function getCaller() {
    var stack = new Error().stack;
    stack = stack.split('\n');
    frames = []
    var max = options['log-caller-frames'];
    for(var count = 0; count < max; ++count) {
        frame = stack[3+count].trim();
        if (options['strip-prefix']) {
            frame = frame.replace(options['strip-prefix'], '');
        }
        frames.push(frame)
    }
    return frames.join(' / ');
}

function set(k,v) {
    console.assert(Object.keys(options).indexOf(k) != -1, 'Unknown konsole key: ' + k);

    if (k == 'strip-prefix' && !v.endsWith('/')) {
        v += '/';
    }
    else if (options['color']) {
        v = COLORS[v] || COLORS.none;
        if (v !== COLORS.none) {
            options['coloroff'] = COLORS.normal;
        } else {
            options['coloroff'] = COLORS.none;
        }
    }
    options[k] = v;
}

function wrapper (obj, func) {
    function _wrapper() {
        var args = Array.prototype.slice.call(arguments);
        var now = strftime(options['date-format'], new Date());
        var prefix = [now];
        var postfix = [];

        if (options['log-caller']) {
            postfix.push(getCaller());
        }

        if (typeof args[0] === 'string') {
            prefix.push(args[0])
            args[0] = options.color + prefix.join(' ');
            args.push(postfix.join(' ') + options.coloroff );
        } else {
            args.unshift( options.color + prefix.join(' '));
            args.push(postfix.join(' ') + options.coloroff );
        }
        return func.apply(obj, args);
    }
    return _wrapper;
}

var methods = [ 'log', 'debug', 'info', 'warn', 'error' ];
for(var i=0; i<methods.length; i++ ) {
    var func = methods[i];
    global.console[func] = wrapper(global.console, global.console[func]);
}

Object.assign(global.console, { COLORS: COLORS, set: set });

Object.assign(module.exports, global.console);
