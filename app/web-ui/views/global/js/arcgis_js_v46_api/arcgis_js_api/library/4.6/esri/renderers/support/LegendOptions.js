// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.6/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/accessorSupport/decorators ../../core/JSONSupport".split(" "),function(b,a,f,e,d,g){Object.defineProperty(a,"__esModule",{value:!0});b=function(b){function c(){var a=null!==b&&b.apply(this,arguments)||this;a.title=null;return a}f(c,b);a=c;c.prototype.clone=function(){return new a({title:this.title})};e([d.property({type:String,json:{write:!0}})],c.prototype,"title",void 0);return c=a=e([d.subclass("esri.renderers.support.LegendOptions")],
c);var a}(d.declared(g));a.LegendOptions=b;a.default=b});