// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.6/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper dojo/dom ../../core/Accessor ../../core/accessorSupport/decorators ../../core/Collection ../../widgets/libs/maquette/maquette".split(" "),function(m,n,g,d,h,k,c,f,l){return function(e){function a(){var b=null!==e&&e.apply(this,arguments)||this;b.items=new f;b._callbacks=new Map;b._projector=l.createProjector();return b}g(a,e);Object.defineProperty(a.prototype,"needsRender",{get:function(){return 0<
this.items.length},enumerable:!0,configurable:!0});a.prototype.initialize=function(){var b=this,a=document.createElement("div");a.className="esri-overlay-surface";h.setSelectable(a,!1);this._set("surface",a);this._itemsChangeHandle=this.items.on("change",function(a){a.added.map(function(a){var c=function(){return a.render()};b._callbacks.set(a,c);b._projector.append(b.surface,c)});a.removed.map(function(a){var c=b._projector.detach(b._callbacks.get(a));b.surface.removeChild(c.domNode);b._callbacks.delete(a)})})};
a.prototype.addItem=function(a){this.items.add(a)};a.prototype.removeItem=function(a){this.items.remove(a)};a.prototype.destroy=function(){this.items.removeAll();this._itemsChangeHandle.remove();this._projector=this._callbacks=null};a.prototype.render=function(){this._projector.renderNow()};d([c.property({type:HTMLDivElement})],a.prototype,"surface",void 0);d([c.property({type:f})],a.prototype,"items",void 0);d([c.property({readOnly:!0,dependsOn:["items.length"]})],a.prototype,"needsRender",null);
return a=d([c.subclass("esri.views.overlay.ViewOverlay")],a)}(c.declared(k))});