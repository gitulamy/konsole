MAIN FUNCTION
=============

You can add date/time stamp before your log line.
global.console object member methods(info/error/warn/debug/log) are changed by one time `require'

```
$ cat your.js

require('@gitul/konsole');
console.info("Hello, world!");

$ node your.js
2020-04-27 13:27:36.110 Hello, world?
```

That's it!

