/**
 * Map visualization objects
 * @class
 * @namespace s4a.viz.map
 */
s4a.viz.map = {};

/**
 * The transparency to apply to statistical areas, bubbles and their respective
 * legends
 *
 * @type {Number}
 */
s4a.viz.map.StatAreaAlpha = 0.75;

/**
 * Create a choropleth map layer for use in ol3
 *
 * @param {s4a.viz.ViewCoordinator} mapData
 * @param {s4a.viz.DiagramData} mapConfig
 */
s4a.viz.map.ChoroplethMapLayer = function(mapData, mapConfig) {
    console.log('Not implemented');
};

/**
 * Create a bubble map layer for use in ol3
 *
 * @param {s4a.viz.ViewCoordinator} mapData
 * @param {s4a.viz.DiagramData} mapConfig
 */
s4a.viz.map.BubbleMapLayer = function(mapData, mapConfig) {
    console.log('Not implemented');
};

/**
 * Draw a choropleth map inside the specified canvas
 *
 * @param {Object} pDomNode
 * @param {s4a.viz.DiagramData} pDiagramData JSON
 */
s4a.viz.map.getMap = function(pDomNode, pDiagramData) {
    var mProjection, mPath, mStatGeometries, mBounds, s, t,
        mContext, mDomain, mColor, mColor2, mSizes, mColorScale,
        mColorScale2, mSizeScale, mDataMap, mDataMapMulti, mSeriesValues,
        mDataMap2, mSeriesValues2;

    // Determine default values for width/height if not present
    var pWidth = (pDiagramData.mapWidth === 'auto') ? jQuery(pDomNode).width() : pDiagramData.mapWidth;
    var pHeight = (pDiagramData.mapHeight === 'auto') ? jQuery(pDomNode).height() : pDiagramData.mapHeight;

    // Check if an existing canvas exists
    var mCanvas = jQuery(pDomNode + ' canvas');

    if (mCanvas.length < 1) {
        mCanvas = jQuery('<canvas/>');
        jQuery(pDomNode).append(mCanvas);
    }

    // Need to handle the type of statistical unit here! Presently assumes everything is "kommune"
    // Create HTML5 Canvas and return context
    mContext = mCanvas
        .prop('height', pHeight)
        .prop('width', pWidth)[0]
        .getContext('2d');

    // Set the number of domains - default to jenks natural breaks
    mDomain = pDiagramData.domains.map(function(pValue) {
        return Number(pValue);
    }) || null;

    // Set a default color scale
    mColor = pDiagramData.colors !== null && (pDiagramData.colors.length >= 1) ?
            s4a.viz.color[pDiagramData.colors[0]][mDomain.length] :
            s4a.viz.color.Reds[mDomain.length];

    // Set a default secondary color scale
    mColor2 = pDiagramData.colors !== null && (pDiagramData.colors.length >= 2) ?
            s4a.viz.color[pDiagramData.colors[1]][mDomain.length] :
            s4a.viz.color.Blues[mDomain.length];

    // Set a default size range (for bubble diagrams etc)
    mSizes = s4a.viz.Sizes.medium;

    // Construct a color scale
    mColorScale = d3.scale.threshold()
        .domain(mDomain)
        .range(mColor);

    // Construct a secondary color scale
    mColorScale2 = d3.scale.threshold()
        .domain(mDomain)
        .range(mColor2);

    // Construct a size scale
    mSizeScale = mSizes !== null ? d3.scale.threshold()
        .domain(mDomain)
        .range(mSizes) : null;

    // Construct a data map object
    mDataMap = {};

    // Construct a data map object that maps to multiple values per id
    mDataMapMulti = {};

    // Initialize a series values object
    mSeriesValues = [];

    // Construct a data map object for secondary data series
    mDataMap2 = {};

    // Initialize a series values object for secondary data  series
    mSeriesValues2 = [];

    for (var i = 0, j = pDiagramData.mapUnitIDs.length; i < j; i++) {

        mDataMapMulti[pDiagramData.mapUnitIDs[i]] = Number(pDiagramData.seriesData[i]);
        mDataMap[pDiagramData.mapUnitIDs[i]] =
                Number(pDiagramData.seriesData[i][pDiagramData.showSeries[0]]);
        mSeriesValues.push(Number(pDiagramData.seriesData[i][pDiagramData.showSeries[0]]));
    }

    if (pDiagramData.showSeries.length === 2) {
        for (i = 0, j = pDiagramData.mapUnitIDs.length; i < j; i++) {
            mDataMap2[pDiagramData.mapUnitIDs[i]] =
                Number(pDiagramData.seriesData[i][pDiagramData.showSeries[1]]);
            mSeriesValues2.push(Number(pDiagramData.seriesData[i][pDiagramData.showSeries[1]]));
        }
    }

    if (pDiagramData.title === null || pDiagramData.title === undefined || pDiagramData.title === '') {
        if (pDiagramData.showSeries.length > 1) {
            pDiagramData.title = pDiagramData.seriesLabels[pDiagramData.showSeries[0]] + ' / ' +
                pDiagramData.seriesLabels[pDiagramData.showSeries[2]];
        } else {
            pDiagramData.title = pDiagramData.seriesLabels[pDiagramData.showSeries[0]];
        }
    }

    // Load the data and basemap JSON files
    queue()
            .defer(d3.json, './data/data-topojson.json')
            .defer(d3.json, './data/sea.json')
            .await(function(pError, pStatAreas, pBaseMap) {

                //Create a d3.geo.projection object
                mProjection = d3.geo.transverseMercator()
                    .scale(1)
                    .translate([0, 0]);

                // Create a d3.geo.path object
                mPath = d3.geo.path()
                    .projection(mProjection);

                // Read all topojson features into a GeoJson object
                mStatGeometries = topojson.feature(pStatAreas, pStatAreas.objects.kommune)
                .features.filter(function(d) {
                    return (pDiagramData.mapUnitIDs.indexOf(d.id.toString()) !== -1);
                });

                // Get the complete bounds of all features and calculate scale and translation
                //var mBounds = mPath.bounds(zoomArea),
                mBounds = s4a.viz.map.util.getFeatureCollectionBounds(mPath, mStatGeometries);

                // Calculate the scale factor
                s = 0.95 / Math.max(
                        (mBounds[1][0] - mBounds[0][0]) / pWidth,
                        (mBounds[1][1] - mBounds[0][1]) / pHeight);

                // Calculate the translation offset from zero
                t = [(pWidth - s * (mBounds[1][0] + mBounds[0][0])) / 2,
                    (pHeight - s * (mBounds[1][1] + mBounds[0][1])) / 2];

                // Update projection
                mProjection
                        .scale(s)
                        .translate(t);

                // Clear the canvas and prepare for drawing
                mContext.clearRect(0, 0, pWidth, pHeight);

                // Set white background color
                mContext.fillStyle = '#ffffff';
                mContext.fillRect(0, 0, pWidth, pHeight);

                // Draw basemap features I
                s4a.viz.map.shared._drawLand(mContext, mPath, pBaseMap);

                // Conditionally draw choropleth polygons
                if (pDiagramData.mapType === 'choroplethMap' ||
                        pDiagramData.mapType === 'bubbleChoroplethMap') {
                    s4a.viz.map.shared._drawPolygons(mStatGeometries, mDataMap, mColorScale, mPath, mContext);
                }

                // Draw basemap features II
                s4a.viz.map.shared._drawMunicipality(mContext, mPath, pStatAreas);
                s4a.viz.map.shared._drawCounty(mContext, mPath, pStatAreas);

                // Conditionally draw bubbles
                if (pDiagramData.mapType === 'bubbleMap') {
                    s4a.viz.map.shared._drawBubbles(mStatGeometries, mDataMap, mSizeScale, mColorScale,
                            mPath, mContext);
                }
                // Conditionally draw additional bubbles (series 2)
                else if (pDiagramData.mapType === 'bubbleChoroplethMap') {
                    s4a.viz.map.shared._drawBubbles(mStatGeometries, mDataMap2, mSizeScale, mColorScale2,
                            mPath, mContext);
                }
                // Conditionally draw pie charts
                else if (pDiagramData.mapType === 'pieChartMap') {
                    s4a.viz.map.shared._drawPieCharts(mStatGeometries, mDataMapMulti, mColor, mPath,
                            mContext);
                }

                // Draw labels
                s4a.viz.map.shared._drawLabels(mContext, mPath, mStatGeometries, (pDiagramData.fontSize - 2));

                // Draw legend
                s4a.viz.map.shared._drawRectSymMapLegend(mContext, mColorScale, pDiagramData.title,
                    Number(pDiagramData.fontSize));

                return mContext;
            });
};
