/**
 * Object that defines the content, type and layout of a map
 * 
 * @class
 * @constructor
 * @property {String} [title=null] The title of the diagram
 * @property {String} [mapType="choroplethMap"] One of: "choroplethMap", "bubbleMap",
 *              "pieChartMap" or "bubbleChoroplethMap"
 * @property {String} mapUnitType The type of map unit (i.e. "land", "fylke", "kommune", "grunnkrets")
 * @property {Array} mapUnitIDs An array of map unit IDs. This array should be of the same length
 *              as the array seriesData.
 * @property {Array} seriesLabels An array of strings containing the name of each data series
 *              if the map contains more than one series. This array shoud be of the same length
 *              as the arrays stored in each item of the array seriesData
 * @property {Array} seriesData An array of arrays with one key for each mapUnitID in the array
 *              mapUnitIDs, each sub-array should have as many entries as the array seriesLabels
 * @property {Array} domains The classification of the data series, e.g. the array [1,3,5,7,9]
 *              represents the classes 1-3, 3-5, 5-7 and 7-9.
 * @property {Array} [colors=["Reds"]] An array of named color scales as defined in AASDiag.Colors.
 *              Legal values include "Blues", "Greens", "Oranges", "Reds"
 * @property {Boolean} [showLabels=false] True to show labels
 * @property {Array} [showSeries=[0]] An array containing the zero-based index of
 *              the series to display if the supplied data contains more than one
 *              data series. the mapType "bubbleChoroplethMap" supports
 *              two data series and the mapType "pieChartMap" supports any number of
 *              data series.
 * @property {Number} [mapWidth="auto"] The width of the map in pixels or auto to use
 *              width of containing DOM element
 * @property {Number} [mapHeight="auto"] The width of the map in pixels or auto to use
 *              height of containing DOM element
 */
s4a.viz.DiagramData = function(mDiagramData) {
    mDiagramData = mDiagramData || {};

    var defaults = {
        title: null,
        mapType: 'choroplethMap',
        mapUnitType: null,
        mapUnitIDs: null,
        seriesLabels: null,
        seriesData: null,
        domains: null,
        colors: ['RdPu'],
        showLabels: false,
        showSeries: [0],
        mapWidth: 'auto',
        mapHeight: 'auto',
        fontSize: 12
    };

    return $.extend(defaults, mDiagramData);
};