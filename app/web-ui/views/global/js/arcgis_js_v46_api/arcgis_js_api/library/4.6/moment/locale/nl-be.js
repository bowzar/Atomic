//>>built
(function(c,b){"object"===typeof exports&&"undefined"!==typeof module&&"function"===typeof require?b(require("../moment")):"function"===typeof define&&define.amd?define(["../moment"],b):b(c.moment)})(this,function(c){var b="jan. feb. mrt. apr. mei jun. jul. aug. sep. okt. nov. dec.".split(" "),f="jan feb mrt apr mei jun jul aug sep okt nov dec".split(" "),d=[/^jan/i,/^feb/i,/^maart|mrt.?$/i,/^apr/i,/^mei$/i,/^jun[i.]?$/i,/^jul[i.]?$/i,/^aug/i,/^sep/i,/^okt/i,/^nov/i,/^dec/i],e=/^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
return c.defineLocale("nl-be",{months:"januari februari maart april mei juni juli augustus september oktober november december".split(" "),monthsShort:function(a,c){return a?/-MMM-/.test(c)?f[a.month()]:b[a.month()]:b},monthsRegex:e,monthsShortRegex:e,monthsStrictRegex:/^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,monthsShortStrictRegex:/^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,monthsParse:d,longMonthsParse:d,shortMonthsParse:d,
weekdays:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "),weekdaysShort:"zo. ma. di. wo. do. vr. za.".split(" "),weekdaysMin:"zo ma di wo do vr za".split(" "),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",
past:"%s geleden",s:"een paar seconden",m:"\u00e9\u00e9n minuut",mm:"%d minuten",h:"\u00e9\u00e9n uur",hh:"%d uur",d:"\u00e9\u00e9n dag",dd:"%d dagen",M:"\u00e9\u00e9n maand",MM:"%d maanden",y:"\u00e9\u00e9n jaar",yy:"%d jaar"},dayOfMonthOrdinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||20<=a?"ste":"de")},week:{dow:1,doy:4}})});