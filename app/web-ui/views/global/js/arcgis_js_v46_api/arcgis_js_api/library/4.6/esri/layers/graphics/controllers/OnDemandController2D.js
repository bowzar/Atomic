// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.6/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/tsSupport/declareExtendsHelper ../../../core/tsSupport/decorateHelper ../../../core/accessorSupport/decorators ../../../core/Accessor ../../../core/Error ../../../core/Evented ../../../core/HandleRegistry ../../../core/Logger ../../../core/Promise ../../../core/promiseUtils ../../../geometry/Extent ./support/TileSet ../../../views/2d/tiling/TileQueue ../../../views/2d/tiling/TileStrategy ../../../views/2d/tiling/TileInfoView ../../../views/2d/tiling/TileKey ../../support/GraphicsManager ../../support/TileInfo".split(" "),
function(G,H,n,g,e,p,q,r,t,u,v,k,w,x,y,z,A,B,C,D){var E=u.getLogger("esri.views.2d.layers.MapImageLayerView2D"),F=function(){function e(){this.key=new B(0,0,0,0)}e.prototype.dispose=function(){};return e}();return function(l){function d(a){var b=l.call(this)||this;b._handles=new t;b._pendingQueries=new Map;b._tileRequests=new Map;b.layer=a.layer;b.layerView=a.layerView;b.graphics=a.graphics;b._tileInfo=D.create({spatialReference:b.layerView.view.spatialReference,size:512});b._tileInfoView=new A(b._tileInfo);
b._tileQueue=new y({tileInfoView:b._tileInfoView,process:function(a){return b._fetchTile(a)}});b._tileSet=new x({layer:b.layer,tileInfo:b._tileInfo});b._graphicsManager=new C({graphics:b.graphics,objectIdField:b.layer.objectIdField});b._tileStrategy=new z({cachePolicy:"purge",acquireTile:function(a){return b._acquireTile(a)},releaseTile:function(a){return b._releaseTile(a)},tileInfoView:b._tileInfoView});b._handles.add([b.layer.watch("definitionExpression",function(){return b.refresh()}),b.layer.on("edits",
function(a){return b._editsHandler(a)})],"layer");return b}n(d,l);d.prototype.destroy=function(){var a=this;this._pendingQueries.forEach(function(a){a.isFulfilled()||a.cancel()});this._tileStrategy.tiles.forEach(function(b){return a._releaseTile(b)});this._handles.destroy();this._graphicsManager.destroy();this._tileStrategy.destroy();this._tileQueue.clear();this._tileRequests.clear()};Object.defineProperty(d.prototype,"graphics",{set:function(a){var b=this,c=this._get("graphics");c!==a&&(this._handles.remove("graphics"),
c&&c.forEach(function(a){return a.layer=null}),a&&(a.forEach(function(a){return a.layer=b.layer}),this._handles.add([a.on("after-add",function(a){return a.item.layer=b.layer}),a.on("after-remove",function(a){return a.item.layer=null})],"graphics")),this._set("graphics",a))},enumerable:!0,configurable:!0});Object.defineProperty(d.prototype,"updating",{get:function(){return 0<this._tileQueue.length||this.get("_graphicsManager.updating")},enumerable:!0,configurable:!0});d.prototype.update=function(a){var b=
this;this._tileQueue.pause();this._tileQueue.state=a.state;this._tileStrategy.update(a);this._graphicsManager.removeAll();this._tileStrategy.tiles.forEach(function(a){a.featureSet&&b._graphicsManager.add(a.featureSet.features,a.intentId)});this._tileQueue.resume();this.notifyChange("updating")};d.prototype.refresh=function(){var a=this;this._tileQueue.reset();this._tileStrategy.tiles.forEach(function(b){var c=a._graphicsManager.createIntentToAdd();a.notifyChange("updating");var h=a._tileSet.fetch(b.key).then(function(h){a._graphicsManager.remove(b.featureSet.features);
b.intentId=c;b.featureSet=h;a._graphicsManager.add(b.featureSet.features,b.intentId);return b});h.always(function(){a._graphicsManager.removeIntent(c);a.notifyChange("updating")});return h});this.notifyChange("updating")};d.prototype._acquireTile=function(a){var b=this,c=new F;c.key.set(a);a=this._tileQueue.push(c.key).then(function(a){c.attached=!0;c.featureSet=a.featureSet;c.intentId=a.intentId;b._graphicsManager.removeIntent(c.intentId);b.layerView.requestUpdate()});this._tileRequests.set(c,a);
this.notifyChange("updating");return c};d.prototype._releaseTile=function(a){if(this._tileRequests.has(a)){var b=this._tileRequests.get(a);b.isFulfilled()||b.cancel();this._tileRequests.delete(a);this.layerView.requestUpdate()}};d.prototype._fetchTile=function(a){var b=this,c=this._graphicsManager.createIntentToAdd();a=this._tileSet.fetch(a).then(function(a){return{featureSet:a,intentId:c}});a.otherwise(function(a){b._graphicsManager.removeIntent(c);if(a&&"cancel"===a.dojoType)return k.reject(a);
a=new q("ondemandcontroller2d:tile-request-failed","Failed to query for features",{error:a});E.error(a);return k.reject(a)});return a};d.prototype._editsHandler=function(a){var b=this,c=function(a){return a.objectId},d=a.deletedFeatures.map(c);this._graphicsManager.delete(d);a=a.addedFeatures.concat(a.updatedFeatures).map(c);if(a.length){c=this.layer.createQuery();c.objectIds=a;c.outSpatialReference=this._tileInfo.spatialReference;var e=this._graphicsManager.createIntentToAdd(a);a=this.layer.queryFeatures(c);
this._pendingQueries.set(e,a);this.notifyChange("updating");a.then(function(a){return b._refetchHandler(a,e)}).always(function(){b._graphicsManager.removeIntent(e);b._pendingQueries.delete(e);b.notifyChange("updating")})}};d.prototype._refetchHandler=function(a,b){var c=this,d=a.features;if(d){var e=this._tileInfo.spatialReference;a=function(a){var b=a.key.extent,f=new w({xmin:b[0],ymin:b[1],xmax:b[2],ymax:b[3],spatialReference:e});d.forEach(function(b){b.geometry&&f.intersects(b.geometry)&&c._addFeatureToTile(b,
a)})};for(var f=0,m=this._tileStrategy.tiles;f<m.length;f++)a(m[f]);this._graphicsManager.add(d,b)}};d.prototype._addFeatureToTile=function(a,b){var c=b.featureSet.features||[],d=this.layer.objectIdField,e=a.attributes&&a.attributes[d],f;c.some(function(a){(a.attributes&&a.attributes[d])===e&&(f=a);return!!f});f?(f.geometry=a.geometry,f.attributes=a.attributes):c.push(a);b.featureSet.features=c};g([e.property()],d.prototype,"graphics",null);g([e.property()],d.prototype,"layer",void 0);g([e.property()],
d.prototype,"layerView",void 0);g([e.property()],d.prototype,"updating",null);return d=g([e.subclass("esri.layers.graphics.controllers.OnDemandController2D")],d)}(e.declared(p,v,r))});