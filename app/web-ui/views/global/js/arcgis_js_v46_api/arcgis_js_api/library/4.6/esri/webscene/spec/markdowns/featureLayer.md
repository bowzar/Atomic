# Feature Layer (ArcGISFeatureLayer)

Feature layers can be created by referencing a layer from either a map service or a feature service. Use a map service if you just want to retrieve geometries and attributes from the server and symbolize them yourself. Use a feature service if you want to take advantage of symbols from the service's source map document. Also, use a feature service if you plan on doing editing with the feature layer. Feature layers honor any feature templates configured in the source map document. Feature collection objects are used to create a feature layer based on the supplied definition.

### Properties

| Property | Details
| --- | ---
| disablePopup | Indicates whether to allow a client to ignore popups defined by the service item.
| id | A unique identifying string for the layer.
| itemId | Optional string containing the item ID of the service if it's registered on ArcGIS Online or your organization's portal.
| [layerDefinition](layerDefinition.md) | A layerDefinition object defining the attribute schema and drawing information for the layer.
| layerType | String indicating the layer type.<br>Value of this property must be `ArcGISFeatureLayer`
| listMode | To show or hide layers in the layer list<br>Must be one of the following values:<ul><li>`show`</li><li>`hide`</li></ul>
| mode | 0 is snapshot mode. 1 is on-demand mode. 2 is selection-only mode. Used with ArcGIS feature services and individual layers in ArcGIS map services.
| opacity | The degree of transparency applied to the layer on the client side, where 0 is full transparency and 1 is no transparency.
| [popupInfo](popupInfo.md) | A popupInfo object defining the content of popup windows when you click or query a feature.
| screenSizePerspective | Apply [perspective scaling](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#screenSizePerspectiveEnabled) to screen-size symbols.
| showLabels | Labels will display if this property is set to `true` and the layer also has a [labelingInfo](labelingInfo.md) property associated with it. This property can get stored in the web scene config and in the item/data.
| showLegend | Boolean value indicating whether to display the layer in the legend. Default value is `true`.
| title | A user-friendly string title for the layer that can be used in a table of contents.
| url | The URL to the layer. If the layer is not from a web service but rather a feature collection, then the url property is omitted.
| visibility | Boolean property determining whether the layer is initially visible in the web scene.
| visibleLayers | An array of sublayer ids that should appear visible. Used with feature layers that are based on feature collections.


### Example

Live sample web scene showing ArcGISFeatureLayer as an [operationalLayer](https://www.arcgis.com/home/webscene/viewer.html?webscene=44136259db5b42e19d2fb88e5ef0ce1c)

```json
{
  "operationalLayers": [
    {
      "id": "Recreation_4720",
      "layerType": "ArcGISFeatureLayer",
      "url": "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Recreation/MapServer/0",
      "visibility": true,
      "opacity": 1,
      "mode": 1,
      "title": "Map Service Layer",
      "popupInfo": {
        "title": "Facilities: {description}",
        "fieldInfos": [],
        "description": null,
        "showAttachments": true,
        "mediaInfos": []
      }
    },
    {
      "id": "DamageAssessment_2445",
      "layerType": "ArcGISFeatureLayer",
      "url": "http://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/FeatureServer/0",
      "visibility": true,
      "opacity": 1,
      "mode": 1,
      "title": "Feature Service",
      "itemId": "f6df665cdf3d45e094e0e2379cf90f1c",
      "popupInfo": {
        "title": "Damage to Residential Buildings: {firstname}",
        "fieldInfos": [],
        "description": null,
        "showAttachments": true,
        "mediaInfos": []
      }
    }
  ]
}
```

