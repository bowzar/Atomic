//>>built
define(["dojo/_base/lang","dojo/_base/array","./_base"],function(k,h,c){function t(a,b,d){var e=new c.Palette;e.colors=[];h.forEach(a.colors,function(a){e.colors.push(new c.Color({r:Math.min(255,Math.max(0,"dr"==b?a.r+d:a.r)),g:Math.min(255,Math.max(0,"dg"==b?a.g+d:a.g)),b:Math.min(255,Math.max(0,"db"==b?a.b+d:a.b)),a:Math.min(1,Math.max(0,"da"==b?a.a+d:a.a))}))});return e}function l(a,b,d){var e=new c.Palette;e.colors=[];h.forEach(a.colors,function(a){a=a.toCmy();e.colors.push(c.fromCmy(Math.min(100,
Math.max(0,"dc"==b?a.c+d:a.c)),Math.min(100,Math.max(0,"dm"==b?a.m+d:a.m)),Math.min(100,Math.max(0,"dy"==b?a.y+d:a.y))))});return e}function p(a,b,d){var e=new c.Palette;e.colors=[];h.forEach(a.colors,function(a){a=a.toCmyk();e.colors.push(c.fromCmyk(Math.min(100,Math.max(0,"dc"==b?a.c+d:a.c)),Math.min(100,Math.max(0,"dm"==b?a.m+d:a.m)),Math.min(100,Math.max(0,"dy"==b?a.y+d:a.y)),Math.min(100,Math.max(0,"dk"==b?a.b+d:a.b))))});return e}function q(a,b,d){var e=new c.Palette;e.colors=[];h.forEach(a.colors,
function(a){a=a.toHsl();e.colors.push(c.fromHsl(("dh"==b?a.h+d:a.h)%360,Math.min(100,Math.max(0,"ds"==b?a.s+d:a.s)),Math.min(100,Math.max(0,"dl"==b?a.l+d:a.l))))});return e}function r(a,b,d){var e=new c.Palette;e.colors=[];h.forEach(a.colors,function(a){a=a.toHsv();e.colors.push(c.fromHsv(("dh"==b?a.h+d:a.h)%360,Math.min(100,Math.max(0,"ds"==b?a.s+d:a.s)),Math.min(100,Math.max(0,"dv"==b?a.v+d:a.v))))});return e}c.Palette=function(a){this.colors=[];a instanceof c.Palette?this.colors=a.colors.slice(0):
a instanceof c.Color?this.colors=[null,null,a,null,null]:k.isArray(a)?this.colors=h.map(a.slice(0),function(a){return k.isString(a)?new c.Color(a):a}):k.isString(a)&&(this.colors=[null,null,new c.Color(a),null,null])};k.extend(c.Palette,{transform:function(a){var b=t;if(a.use){var c=a.use.toLowerCase();0==c.indexOf("hs")?b="l"==c.charAt(2)?q:r:0==c.indexOf("cmy")&&(b="k"==c.charAt(3)?p:l)}else if("dc"in a||"dm"in a||"dy"in a)b="dk"in a?p:l;else if("dh"in a||"ds"in a)b="dv"in a?r:q;var c=this,e;for(e in a)"use"!=
e&&(c=b(c,e,a[e]));return c},clone:function(){return new c.Palette(this)}});k.mixin(c.Palette,{generators:{analogous:function(a){var b=a.high||60,d=a.low||18;a=(k.isString(a.base)?new c.Color(a.base):a.base).toHsv();var e=Math.max(10,95>=a.s?a.s+5:100-(a.s-95)),g=92<=a.v?a.v-9:Math.max(a.v+9,20),f=90>=a.v?Math.max(a.v+5,20):95+Math.ceil((a.v-90)/2),n=[e,1<a.s?a.s-1:21-a.s,a.s,e,e],m=[g,f,a.v,g,f];return new c.Palette(h.map([(a.h+d+360)%360,(a.h+Math.round(d/2)+360)%360,a.h,(a.h-Math.round(b/2)+360)%
360,(a.h-b+360)%360],function(a,b){return c.fromHsv(a,n[b],m[b])}))},monochromatic:function(a){a=k.isString(a.base)?new c.Color(a.base):a.base;var b=a.toHsv(),d=9<b.s-30?b.s-30:b.s+30,e=b.s,g=20<b.v-20?b.v-20:b.v+60,f=20<b.v-50?b.v-50:b.v+30;return new c.Palette([c.fromHsv(b.h,d,100-.8*(100-b.v)),c.fromHsv(b.h,e,f),a,c.fromHsv(b.h,d,f),c.fromHsv(b.h,e,g)])},triadic:function(a){a=k.isString(a.base)?new c.Color(a.base):a.base;var b=a.toHsv(),d=(b.h-157+360)%360,e=90<b.s?b.s-10:b.s+10,g=95<b.s?b.s-5:
b.s+5,f=20<b.v-20?b.v-20:b.v+20,n=20<b.v-30?b.v-30:b.v+30,h=70<b.v-30?b.v-30:b.v+30;return new c.Palette([c.fromHsv((b.h+57+360)%360,20<b.s?b.s-10:b.s+10,b.v),c.fromHsv(b.h,e,n),a,c.fromHsv(d,e,f),c.fromHsv(d,g,h)])},complementary:function(a){a=k.isString(a.base)?new c.Color(a.base):a.base;var b=a.toHsv(),d=360>2*b.h+137?2*b.h+137:Math.floor(b.h/2)-137,e=100-.9*(100-b.s),g=Math.min(100,b.s+20),f=20<b.v?b.v-30:b.v+30;return new c.Palette([c.fromHsv(b.h,Math.max(b.s-10,0),Math.min(100,b.v+30)),c.fromHsv(b.h,
e,f),a,c.fromHsv(d,g,f),c.fromHsv(d,b.s,b.v)])},splitComplementary:function(a){var b=k.isString(a.base)?new c.Color(a.base):a.base,d=a.da||30;a=b.toHsv();var e=360>2*a.h+137?2*a.h+137:Math.floor(a.h/2)-137,g=(e-d+360)%360,d=(e+d)%360,e=100-.9*(100-a.s),f=Math.min(100,a.s+20),h=20<a.v?a.v-30:a.v+30;return new c.Palette([c.fromHsv(g,Math.max(a.s-10,0),Math.min(100,a.v+30)),c.fromHsv(g,e,h),b,c.fromHsv(d,f,h),c.fromHsv(d,a.s,a.v)])},compound:function(a){a=k.isString(a.base)?new c.Color(a.base):a.base;
var b=a.toHsv(),d=360>2*b.h+18?2*b.h+18:Math.floor(b.h/2)-18,e=360>2*b.h+120?2*b.h+120:Math.floor(b.h/2)-120,g=360>2*b.h+99?2*b.h+99:Math.floor(b.h/2)-99,f=80<b.s-10?b.s-10:b.s+10,h=10<b.s-25?b.s-25:b.s+25,m=80<b.v-20?b.v-20:b.v+20,l=Math.max(b.v,20);return new c.Palette([c.fromHsv(d,10<b.s-40?b.s-40:b.s+40,10<b.v-40?b.v-40:b.v+40),c.fromHsv(d,f,m),a,c.fromHsv(e,h,l),c.fromHsv(g,f,m)])},shades:function(a){a=k.isString(a.base)?new c.Color(a.base):a.base;var b=a.toHsv(),d=100==b.s&&0==b.v?0:b.s,e=20<=
b.v-25?b.v-25:b.v+55,g=20<=b.v-75?b.v-75:b.v+5,f=Math.max(b.v-10,20);return new c.Palette([new c.fromHsv(b.h,d,20<b.v-50?b.v-50:b.v+30),new c.fromHsv(b.h,d,e),a,new c.fromHsv(b.h,d,g),new c.fromHsv(b.h,d,f)])}},generate:function(a,b){if(k.isFunction(b))return b({base:a});if(c.Palette.generators[b])return c.Palette.generators[b]({base:a});throw Error("dojox.color.Palette.generate: the specified generator ('"+b+"') does not exist.");}});return c.Palette});