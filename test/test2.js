var konsole = require('../');
konsole.set('log-caller', true);
konsole.set('strip-prefix', __dirname);

process.stderr.write("* test2 begin..\n");

var blah=true;
var the = Array(3);
function do_something(){};
function do_anything(){};
function do_looping_works(){};

function func1() {
    console.debug('CHECK');
    if (blah) {
        console.debug('CHECK');
        do_something();
    } else {
        console.debug('CHECK');
        do_anything();
    }
    for (var i=0; i<the.length; i++) {
        console.debug('CHECK', i);
        do_looping_works();
    }
    console.debug('CHECK');
}

func1();
