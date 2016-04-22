'use strict';
/**
 * Define namespace utilities
 * @namespace
 * @type {Object}
 */
s4a.viz.map.shared = {};

/**
 * Draws the chart title
 *
 * @param {Object} pContext
 * @param {Number} pFontSize
 * @param {String} pTitle
 * @param {Number} pLeftMargin
 * @param {Number} pCurrentLinePosition
 * @returns {Number}
 */
s4a.viz.map.shared._drawChartTitle =
        function(pContext, pFontSize, pTitle, pLeftMargin, pCurrentLinePosition) {
            pContext.font = 'bolder ' + pFontSize + 'px Arial';
            pContext.textAlign = 'start'; // Right align the labels
            pContext.fillStyle = '#000000';
            pContext.fillText(pTitle, pLeftMargin, pCurrentLinePosition);

            return (pCurrentLinePosition += (pFontSize * 2));
        };

/**
 * Draw map legend on canvas using a color scale
 *
 * @param {Object} pContext A drawing context retrieved by calling
 * c.getContext("2d") on the HTML5 canvas element c
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {String} pTitle The title to print on top of the legend
 */
s4a.viz.map.shared._drawRectSymMapLegend = function(pContext, pColor, pTitle, pFontSize) {

    pFontSize = pFontSize !== undefined ? pFontSize : s4a.viz.map.FontSizes.normal;

    var mLeftMargin = 10;
    var mTopMargin = 10;
    var mLineHeight = pFontSize * 1.8;
    var mKeyW = 20;
    var mKeyH = pFontSize + 4;

    var mYPos = mTopMargin + pFontSize;
    // Get the length of the longest legend label entry
    var mLongestLabel = s4a.viz.map.util.getLongestStringInArray(pColor.domain());
    pContext.font = pFontSize + 'px Arial';
    var mRightAlignInset = pContext.measureText(mLongestLabel).width * 2;

    if (pTitle !== undefined && pTitle !== null && pTitle !== '') {
        mYPos = s4a.viz.map.shared._drawChartTitle(pContext, pFontSize, pTitle, mLeftMargin, mYPos);
    }

    pContext.font = pFontSize + 'px Arial';
    pContext.textAlign = 'end'; // Right align the labels

    // For each color in the scale
    for (var j = pColor.domain().length - 1; j > 0; j--) {
        var mLabel;
        if (j === pColor.domain().length - 1) {
            mLabel = '> ' + jQuery.number(pColor.domain()[j - 1]);
        } else if (j === 1) {
            mLabel = '< ' + jQuery.number(pColor.domain()[j]);
        } else {
            mLabel = jQuery.number(pColor.domain()[j - 1]) + ' - ' + jQuery.number(pColor.domain()[j]);
        }

        // Set legend symbol colors
        pContext.fillStyle = pColor.range()[j];
        pContext.strokeStyle = '#000000';
        pContext.lineWidth = 0.2;
        // Add legend symbol
        pContext.beginPath();
        pContext.rect(mLeftMargin, mYPos - pFontSize, mKeyW, mKeyH);
        pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
        pContext.fill();
        pContext.globalAlpha = 1.0;
        pContext.stroke();
        // Add legend label
        pContext.fillStyle = '#000000';
        pContext.fillText(mLabel, mLeftMargin + mKeyW + mLeftMargin + mRightAlignInset, mYPos);
        // Move to next line
        mYPos += mLineHeight;
    }
};

/**
 * Draw polygons from geometry collection
 *
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMap A JavaScript object with key/value pairs
 * @param {Object} pScale A d3.scale.threshold object
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 */
s4a.viz.map.shared._drawPolygons = function(pGeoJson, pDataMap, pScale, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    var mRange = pScale.domain();
    var mMax = Math.max.apply(null, mRange);
    var mMin = Math.min.apply(null, mRange);
    pGeoJson.forEach(function(pFeature) {
        var mTestValue = pDataMap[pFeature.id];
        mTestValue = mTestValue < mMax ? mTestValue : mMax - 0.0001;
        mTestValue = mTestValue >= mMin ? mTestValue : mMin;
        var mColor = pScale(mTestValue);
        if (mColor !== undefined) {
            pContext.fillStyle = mColor;
            pContext.beginPath();
            pPath.context(pContext)(pFeature);
            pContext.fill();
        }
    });
    pContext.globalAlpha = 1.0;
};

/**
 * Draw polygons from geometry collection
 *
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMapMulti A JavaScript object with key/value pairs
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 */
s4a.viz.map.shared._drawPieCharts = function(pGeoJson, pDataMapMulti, pColor, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    pGeoJson.forEach(function(mFeature) {
        var mSize = 25;
        var mSlices = s4a.viz.map.util.valuesToSlices(pDataMapMulti[mFeature.id]);
        var mStartAngle = 1.5 * Math.PI;
        var mPoint = pPath.centroid(mFeature);
        for (var i = 0, j = mSlices.length; i < j; i++) {
            var mSlice = (Number(mSlices[i]) * (2 * Math.PI)) / 100;
            var mFinishAngle = mStartAngle + mSlice;
            if (mFinishAngle > (2 * Math.PI)) {
                mFinishAngle = mFinishAngle - (2 * Math.PI);
            }
            pContext.fillStyle = pColor[i];
            pContext.lineWidth = 2;
            pContext.strokeStyle = 'rgba(0,0,0,0.25)';
            pContext.beginPath();
            pContext.moveTo(mPoint[0], mPoint[1]);
            pContext.arc(mPoint[0], mPoint[1], mSize, mStartAngle, mFinishAngle, false);
            pContext.closePath();
            pContext.fill();
            pContext.stroke();
            mStartAngle += mSlice;
        }
    });
};

/**
 * Draw map legend on canvas using scale
 *
 * @param {Object} pContext A drawing context retrieved by calling c.getContext("2d") on the HTML5 canvas element c
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {String} pTitle The title to print on top of the legend
 */
s4a.viz.map.shared._drawCircleSymMapLegend = function(pContext, pColor, pTitle) {

    var mFontSize = 12;
    var mLeftMargin = 10;
    var mTopMargin = 10;
    var mLineHeight = mFontSize * 1.5;
    var mCurrentLinePosition = mTopMargin + mFontSize;
    // Get the length of the longest legend label entry
    var mRightAlignInset = s4a.viz.map.util.getLengthOfLongest(pColor.domain()) * (mFontSize / 1.5);
    // Insert logic for legend height here
    pContext.font = mFontSize + 'px Arial Bold';
    pContext.textAlign = 'start'; // Right align the labels
    pContext.fillStyle = '#000000';
    pContext.fillText('Teiknforklaring', mLeftMargin, mCurrentLinePosition);
    mCurrentLinePosition += mLineHeight;
    // Set font for legend items
    pContext.font = mFontSize + 'px Arial';
    pContext.textAlign = 'end'; // Right align the labels

    // For each color in the scale
    for (var j = pColor.domain().length - 1; j > 0; j--) {

        var mLabel = jQuery.number(pColor.domain()[j - 1]) + ' - ' + jQuery.number(pColor.domain()[j]);
        // Set legend symbol colors
        pContext.fillStyle = pColor.range()[j];
        pContext.strokeStyle = '#000000';
        pContext.lineWidth = 0.2;
        // Add legend symbol
        pContext.beginPath();
        pContext.arc(mLeftMargin, mCurrentLinePosition - (mFontSize / 2), 6, 0, 2 * Math.PI, false);
        //        pCanvas.arc(mFeat[0], mFeat[1], mSize, 0, 2 * Math.PI, false);
        pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
        pContext.fill();
        pContext.globalAlpha = 1;
        pContext.stroke();
        // Add legend label
        pContext.fillStyle = '#000000';
        pContext.fillText(mLabel, mLeftMargin + mRightAlignInset, mCurrentLinePosition);
        // Move to next line
        mCurrentLinePosition += mLineHeight;
    }
};

/**
 * Draw polygons from geometry collection
 *
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMap A JavaScript object with key/value pairs
 * @param {Object} pSizeScale A d3.scale.threshold object mapping to bubble sizes
 * @param {Object} pColorScale A d3.scale.threshold object mapping to bubble colors
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 */
s4a.viz.map.shared._drawBubbles = function(pGeoJson, pDataMap, pSizeScale, pColorScale, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    pGeoJson.forEach(function(pFeature) {
        var mSize = pSizeScale(pDataMap[pFeature.id]);
        var mColor = pColorScale(pDataMap[pFeature.id]);
        if (mSize !== undefined) {
            var mFeat = pPath.centroid(pFeature);
            pContext.beginPath();
            pContext.arc(mFeat[0], mFeat[1], mSize, 0, 2 * Math.PI, false);
            pContext.fillStyle = mColor;
            pContext.fill();
            pContext.lineWidth = 2;
            pContext.strokeStyle = 'rgba(0,0,0,0.25)';
            pContext.stroke();
        }
    });
    pContext.globalAlpha = 1;
};

/**
 * Place labels on top of polygons
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath d3.geo.path object
 * @param {Object} pGeoJson
 * @param {Number} pFontSize
 */
s4a.viz.map.shared._drawLabels = function(pContext, pPath, pGeoJson, pFontSize) {

    pFontSize = pFontSize !== undefined ? pFontSize : s4a.viz.map.FontSizes.small;

    pGeoJson.forEach(function(pFeature) {
        var xy = pPath.centroid(pFeature);
        pContext.font = pFontSize + 'px Arial';
        pContext.textAlign = 'center'; // Right align the labels
        pContext.fillStyle = '#000000';
        pContext.fillText(pFeature.properties.name, xy[0], xy[1]);
    });
};

/**
 * Draw a geojson object on the canvas
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {String} pLineColor
 * @param {String} pFillColor
 * @param {Number} pLineWidth
 */
s4a.viz.map.shared._drawGeoJson = function(pContext, pPath, pGeoJson, pLineColor, pFillColor, pLineWidth) {
    pContext.strokeStyle = pLineColor || 'transparent';
    pContext.lineWidth = pLineWidth;
    pContext.fillStyle = pFillColor || 'transparent';
    pContext.beginPath();
    pPath.context(pContext)(pGeoJson);
    if (pFillColor !== 'transparent') {
        pContext.fill();
    }
    if (pLineColor !== 'transparent') {
        pContext.stroke();
    }
    return;
};

/**
 * Draw municipality borders on the map
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pStatUnitTopoJson
 */
s4a.viz.map.shared._drawMunicipality = function(pContext, pPath, pStatUnitTopoJson) {
    var mKommune = topojson.mesh(pStatUnitTopoJson, pStatUnitTopoJson.objects.kommune, function(a, b) {
        return a.id !== b.id;
    });
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mKommune, '#000000', null, 0.5);
};

/**
 * Draw county borders on the map
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pStatUnitTopoJson
 */
s4a.viz.map.shared._drawCounty = function(pContext, pPath, pStatUnitTopoJson) {
    var mCounty = topojson.mesh(pStatUnitTopoJson, pStatUnitTopoJson.objects.fylke, function(a, b) {
        return a.id !== b.id;
    });
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mCounty, '#000000', null, 1);
};

/**
 * Draw land polygon on the map
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pLandTopoJson
 */
s4a.viz.map.shared._drawLand = function(pContext, pPath, pLandTopoJson) {
    var mLand = topojson.feature(pLandTopoJson, pLandTopoJson.objects.sea);
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mLand, '#999999', '#eeeeee', 0.2);
};
