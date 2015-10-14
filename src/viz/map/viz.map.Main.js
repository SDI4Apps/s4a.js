/**
 * Functions to draw statistical maps for the Adaptive 3.0 geo-statistics module
 * requires jQuery and D3js. Uses HTML5 Canvas and JavaScript to generate client-
 * side graphics based on WebServices and GeoJson/TopoJson files.
 * @namespace AASDiag
 * @requires d3.v3
 * @requires jQuery-1.10.2
 * @requires jQuery-xml2json
 * @requires jQuery-number-2.1.3
 * @requires topojson
 * @requires simple-statistics
 * @requires queue.v1
 * @requires topojson.v1
 * @author (Stein) Runar Bergheim, Asplan Viak Internet AS
 */
var AASDiag = AASDiag || {};

/**
 * The transparency to apply to statistical areas, bubbles and their respective
 * legends
 * @type {Number}
 */
AASDiag.StatAreaAlpha = 0.75;