/*
 * Test for @gitul/konsole
 */

// Tested in ROK timezone
// It may fail in other zones

//var konsole = require('@gitul/konsole');
var konsole = require('../');
var strftime = require('../strftime');

process.stderr.write("* test1 begin..\n");

var s;
var t1 = new Date(2020,  4 -1, 26, 12, 34, 56); //Anytime Sunday.
var t2 = new Date(1970,  1 -1,  1,  0,  0,  0); //Origin of c-style strftime
var t3 = new Date(1988,  8 -1,  1,  0,  0,  0); //DST in ROK
var t4 = new Date(1908,  4 -1,  1,  6,  0,  0); //The first day of KST (+0830)

s = strftime('%Y-%m-%d %H:%M:%S', t1);
console.log(s);
console.assert( s === '2020-04-26 12:34:56', 'Test 1');

s = strftime('%Y-%m-%d %H:%M:%S %z', t2);
console.log(s, t2.getTimezoneOffset());
console.assert( s === '1970-01-01 00:00:00 +0900', 'Test 2');

//DST check (in ROK)
s = strftime('%Y-%m-%d %H:%M:%S %z', t3);
console.log(s, t3.getTimezoneOffset());
console.assert( s === '1988-08-01 00:00:00 +1000', 'Test 3');

s = strftime('%Y-%m-%d %H:%M:%S %z', t4);
console.log(s, t4.getTimezoneOffset());
console.assert( s === '1908-04-01 06:00:00 +0830' || s === '1908-04-01 06:00:00 +0900', 'Test 4');

s = strftime('%F %T', t1);
console.log(s)
console.assert( s === '2020-04-26 12:34:56', 'Test 5');

s = strftime('%F %I:%M:%S %r', t1);
console.log(s)
console.assert( s === '2020-04-26 12:34:56 PM', 'Test 6');

s = strftime('%F %T %w %u', t1);
console.log(s)
console.assert( s === '2020-04-26 12:34:56 0 7', 'Test 7');

s = strftime('%C %g %e', t4);
console.log(s)
console.assert( s === '19 08  1', 'Test 8');

s = strftime('%s%t%%', t1);
console.log(s)
console.assert( s === '1587872096\t%', 'Test 9');

s = strftime('%q', t1);
console.log(s)
console.assert( s === '(fixme:%q)', 'Test 10');

