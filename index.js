/*
 * Console date/time prefixer
 * (C) 2020 Copyright Hojin Choi <hojin.choi@gmail.com>
 */

var strftime = require('./strftime');

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

var options = {
    'date-format': '%F %T.%f',
    'log-caller': false,
    'strip-prefix': null,
    'log-caller-frames': 1,
    'color': '',
    'hexdump-level': 'debug',
    'hexdump-color': COLORS.normal,
    'hexdump-mark-color': COLORS.yellow,
    //-- internal use --//
    'coloroff': ''
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
    else if (k == 'color') {
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

function _isprintable(ord) {
    if(ord > 32 && ord < 127 ) {
        return true;
    }
    return false;
}

function hexdump(buf, opts = null) {
    var hexopts = {
        dump_begin: 0,
        dump_length: -1,
        mark_position: -1,
        mark_size: 1,
        max_lines: 1024
    };

    Object.assign( hexopts, opts || {} );
    hexopts.dump_length = hexopts.dump_length < 0 ? buf.length : hexopts.dump_length;

    var mark_beg = hexopts.mark_position;
    var mark_end = hexopts.mark_position + hexopts.mark_size;
    var idx = Math.max(0, hexopts.dump_begin);
    var end = Math.min(idx + 16 * hexopts.max_lines, buf.length, hexopts.dump_begin + hexopts.dump_length);

    hexopts.max_lines = Math.min( hexopts.max_lines, Math.floor(end/16) - Math.floor(idx/16) + 1);
    hexopts.max_lines = Math.min(hexopts.max_lines, Math.floor((hexopts.dump_length + 15)/16));

    var inposition = 0;
    var outposition = 0;
    var saved_log_caller = options['log-caller'];
    var saved_color = options['color'];

    options['color'] = options['hexdump-color'];
    options['log-caller'] = false;
    for (var i=0; i < hexopts.max_lines; i++) {
        var logprefix = ('00000' + idx.toString(16)).substr(-4) + ':';
        var hexvals = [];
        var dmpvals = [];
        var line_beg = idx;
        var dmpstr = '';
        for( var j=0; j<16; j++) {
            var ch = buf[idx];
            //TODO if ch is char.
            if (idx < end) {
                hexvals.push(('0' + ch.toString(16)).substr(-2));
                if( _isprintable(ch) ) {
                    dmpvals.push(String.fromCodePoint(ch));
                } else {
                    dmpvals.push('.');
                }
            } else {
                hexvals.push('  ');
                dmpvals.push(' ');
            }
            idx++;
        }
        if (line_beg <= mark_beg && mark_beg < idx) {
            var disp = mark_beg - line_beg;
            hexvals[disp] = options['hexdump-mark-color'] + hexvals[disp];
            dmpvals[disp] = options['hexdump-mark-color'] + dmpvals[disp];
            inposition = 1;
        }
        if (line_beg < mark_end && mark_end <= idx) {
            var disp = mark_end - line_beg - 1;
            hexvals[disp] = hexvals[disp] + options['hexdump-color'];
            dmpvals[disp] = dmpvals[disp] + options['hexdump-color'];
            outposition = 1;
        }
        var hexstr = ' ' + hexvals.join(' ');
        var dmpstr = ' ' + dmpvals.join('');
        if (inposition > 0) {
            if (inposition > 1) {
                hexstr = options['hexdump-mark-color'] + hexstr;
                dmpstr = options['hexdump-mark-color'] + dmpstr;
            }
            if (outposition) {
                outposition = 0;
                inposition = 0;
            } else {
                hexstr += options['hexdump-color'];
                dmpstr += options['hexdump-color'];
                inposition++;
            }
        }
        global.console[options['hexdump-level']](logprefix + hexstr + ' ' + dmpstr);
    }
    options['log-caller'] = saved_log_caller;
    options['color']      = saved_color;
}

var methods = [ 'log', 'debug', 'info', 'warn', 'error' ];
for(var i=0; i<methods.length; i++ ) {
    var func = methods[i];
    global.console[func] = wrapper(global.console, global.console[func]);
}

Object.assign(global.console, { COLORS: COLORS, set: set, hexdump: hexdump });

Object.assign(module.exports, global.console);
