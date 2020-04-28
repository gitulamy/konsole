
***Change your console object a little bit useful***

MAIN FUNCTION
=============

* You can add date/time stamp before your log line.
* console methods(info/error/warn/debug/log) are changed to prefix datetime stamp.
* One time use of 'require' changes global console object.

```
$ cat your.js

require('@gitul/konsole');
console.info("Hello, world!");

$ node your.js
2020-04-27 13:27:36.110 Hello, world?
```

That's it!

CUSTOMIZATION
=============

You can customize konsole with 'set' method of the object which is return from

```javascript
var konsole = require('@gitul/konsole');
```

the **konsole** object is **global.console** itself, and which is added some more functions.
so you can tweak these features with console.set method, but it is not recommend for
compatibilities.

Change date/time format
-----------------------

We use a simple strftime function which implements **%-prefixed** date/time value replacer.
The default format of konsole is **'%F %T.%f'** (which means **'%Y-%m-%d %H:%M:%S.%f'**;
*e.g 2000-01-23 12:34:56.789*). You can customize with **konsole.set** method.

```javascript
var konsole = require('@gitul/konsole');
konsole.set('date-format', '%H:%M:%S');

console.debug("Hello world?");

-- run --

13:27:36 Hello, world?
```

Above example produce just only time related field (%H:%M:%S).

Add log caller location
-----------------------

Log locations sometimes help your debugging works, for e.g.,

```javascript
function func1() {
    console.debug('CHECK 1');
    if (blah) {
        console.debug('CHECK 2');
        do_something();
    } else {
        console.debug('CHECK 3');
        do_anything();
    }
    for (var i=0; i<the.length; i++) {
        console.debug('CHECK 4', i);
        do_looping_works();
    }
    console.debug('CHECK 5');
}

func1();
```

Tracing the 'CHECK number' lines are good for debugging in runtime. Those lines are simply used
for flow checking and deleted after debugging. The different **numbers** are needed for
distinguishing source locations. To solve like this problem, just use as this.

```javascript
var konsole = require('@gitul/konsole');
konsole.set('log-caller', true);

var blah=true;
function do_somthing(){};
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
```

Only we need is the reapeated line **console.debug('CHECK');**. This makes your debugging simple.

Let's test!

```bash
2020-04-28 18:45:37.817 CHECK at func1 (/home/user1/work/konsole/a.js:11:13)
2020-04-28 18:45:37.824 CHECK at func1 (/home/user1/work/konsole/a.js:13:17)
2020-04-28 18:45:37.824 CHECK 0 at func1 (/home/user1/work/konsole/a.js:20:17)
2020-04-28 18:45:37.825 CHECK 1 at func1 (/home/user1/work/konsole/a.js:20:17)
2020-04-28 18:45:37.825 CHECK 2 at func1 (/home/user1/work/konsole/a.js:20:17)
2020-04-28 18:45:37.825 CHECK at func1 (/home/user1/work/konsole/a.js:23:13)
```

---

Strip caller's common path
--------------------------

As you see above example, the project root path is not necessary, so we can specify
with `strip-prefix` to stripping out the paths.

```javascript
var konsole = require('@gitul/konsole');
konsole.set('log-caller', true);
konsole.set('strip-prefix', __dirname );

... (same with above example) ...
```

Run again!

```
2020-04-28 20:13:40.269 CHECK at func1 (a.js:12:13)
2020-04-28 20:13:40.275 CHECK at func1 (a.js:14:17)
2020-04-28 20:13:40.276 CHECK 0 at func1 (a.js:21:17)
2020-04-28 20:13:40.276 CHECK 1 at func1 (a.js:21:17)
2020-04-28 20:13:40.277 CHECK 2 at func1 (a.js:21:17)
2020-04-28 20:13:40.277 CHECK at func1 (a.js:24:13)
```

You can check more simple logs but meaning clear.

**NOTICE**: We use 'new Error().stack' mechanism for checking call stack, and which is
expensive way, so it is recommended to be removed in production mode.

