/*
 * Mini strftime
 * Hojin Choi <hojin.choi@gmail.com>
 * Based on common strftime formats, this implements the subset of them.
 */

function strftime(fmt, t)
{
    if (! t instanceof Date) {
        t = new Date();
    }
    var G = t.toISOString();        //GMT
    var doubled = new Date(t.getTime() - t.getTimezoneOffset() * 60000);
    var L = doubled.toISOString();  //Local

    var out = '';
    var tokens = null;
    function gettokens(key) {
        //'Tue Apr 28 2020 14:41:24 GMT+0900 (Korean Standard Time)'
        if (tokens === null) {
            tokens = t.toString().split(' ', 6);
        }
        switch(key) {
            case 'tz': return tokens[5].substr(3); //skip "GMT" string
            case 'weekday': return tokens[0];
            case 'month': return tokens[1];
        }
        return '<null>';
    }

    for (var i=0; i<fmt.length; i++) {
        if (fmt[i] !== '%') {
            out += fmt[i];
            continue;
        }
        i++;
        if (i >= fmt.length) {
            break;
        }
        var v = '';

        switch(fmt[i]) {
            //Date
            case 'C': v = L.substring(0,2); break;        //Century
            case 'g': v = L.substring(2,4); break;        //Year of 2 digits
            case 'Y': v = L.substring(0,4); break;        //Year of 4 didgits
            case 'm': v = L.substring(5,7); break;        //Month
            case 'd': v = L.substring(8,10); break;       //Day with leading zero
            case 'e': v = (' ' + t.getDate()).substr(-2); //Day with leading space
                break;

            //Time
            case 'H': v = L.substring(11,13); break;      //Hour in 00-24
            case 'I': v = ('0'+((11 +t.getHours())%12+1)).substr(-2); //Hour in 01-12
                break;
            case 'M': v = L.substring(14,16); break;      //Minutes with leading zero
            case 'S': v = L.substring(17,19); break;      //Seconds with leading zero
            case 'f':                                     //Milli seconds (not micro seconds)
                v = ('00' + t.getMilliseconds()).substr(-3);
                break;
            case 's': v = String(Math.floor(t.getTime() / 1000)); //Sec. from 197001010000(UTC)
                break;
            case 'r': v = t.getHours() < 12 ? 'AM' : 'PM'; // AM, PM
                break;

            //Aggregation
            case 'F': v = L.substring(0,10); break;       //%Y-%m-%d
            case 'T': v = L.substring(11,19); break;      //%H:%M:%S

            //Day of week
            case 'w': v = String(t.getDay()); break;         // The day of week 0-6 (sun-sat)
            case 'u': v = String((6+t.getDay())%7+1); break; // The day of week 1-7 (mon-sun)

            //Timezone
            case 'z': v = gettokens('tz'); break;

            case 't': v = '\t'; break;
            case '%': v = '%'; break;
            default:
                v = '(fixme:%'+fmt[i]+')'
                break;
        }
        out += v;
    }
    return out;
}

module.exports = strftime;
