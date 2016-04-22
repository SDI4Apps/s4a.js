'use strict';
s4a.viz.map.util = {};

/**
 * Return a unique URL to ensure that scripts/styles are reloaded every time
 *
 * @param {String} pUrl An URL
 * @returns {String} URL with unique suffix
 */
s4a.viz.map.util.secureReload = function(pUrl) {
    var mConcatChar = pUrl.indexOf('?' !== -1) ? '?' : '&';
    return pUrl + mConcatChar + 'rnd=' + (Math.random() * 100).toString();
};

/**
 * Returns the number of characters in the longest formatted number in an array of numbers
 *
 * @param {number[]} numberArray An array of numbers to be measured
 * @returns {number} The number of characters in the longest number
 */
s4a.viz.map.util.getLengthOfLongest = function(numberArray) {
    var mLength = 0;
    if (numberArray !== null && numberArray.length > 1) {
        var tmpLength;
        for (var i = (numberArray.length - 1); i > 0; i--) {
            var mLabel = jQuery.number(numberArray[i - 1]) + ' - ' + jQuery.number(numberArray[i]);
            tmpLength = mLabel.length;
            if (tmpLength > mLength) {
                mLength = tmpLength;
            }
        }
    }
    return mLength;
};

/**
 * Return the longest entry from an array
 *
 * @param {Array} pArray
 * @returns {String}
 */
s4a.viz.map.util.getLongestStringInArray = function(pArray) {
    var mArray = pArray.slice();
    return mArray.sort(function(a, b) {
        return b.toString().length - a.toString().length;
    })[0];
};

/**
 * Get the total product of the items in an array of numbers, i.e. passing the
 * array [1,3,4,5] to this function will return 1+3+4+5 = 13. Non-numeric values
 * will be ignored.
 *
 * @param {Number} pDataArray An array of numbers
 * @returns {Number}
 */
s4a.viz.map.util.getTotal = function(pDataArray) {
    var pTotal = 0;
    for (var j = 0; j < pDataArray.length; j++) {
        pTotal += (typeof pDataArray[j] === 'number') ? pDataArray[j] : 0;
    }
    return pTotal;
};

/**
 * Method to transform json returned by xml2json to the correct format for the
 * chart data object
 *
 * @param {Object} pObject
 * @returns {AASDiag.ChartData}
 */
s4a.viz.map.util.fixJsonData = function(pObject) {
    var mChartData = new s4a.viz.ChartData();
    mChartData.title = pObject.title[0] || null;
    mChartData.mapType = pObject.type !== undefined ? pObject.type : mChartData.mapType;
    mChartData.mapUnitType = pObject.mapUnitType;
    mChartData.mapUnitIDs = pObject.categoryLabels.string;
    mChartData.seriesLabels = pObject.title.string;
    mChartData.seriesData = s4a.viz.map.util.fixSeriesJsonData(pObject.seriesData);
    mChartData.domains = pObject.intervals.float;
    mChartData.showLabels = pObject.showLabels || false;
    mChartData.showSeries = pObject.showSeries || [0];

    //Special handling of colors
    if (pObject.palette !== undefined) {
        mChartData.colors = pObject.palette !== undefined ? [pObject.palette] : mChartData.colors;
    } else {
        mChartData.colors = pObject.colors !== undefined ? [pObject.colors] : mChartData.colors;
    }

    return mChartData;
};

/**
 * Transform the series data object
 *
 * @param {Object} pSeriesData
 * @returns {Array} Array of arrays containing series data
 */
s4a.viz.map.util.fixSeriesJsonData = function(pSeriesData) {
    var mSeriesData = [];
    for (var i = 0; i < pSeriesData.ArrayOfDecimal.length; i++) {
        mSeriesData.push(pSeriesData.ArrayOfDecimal[i].decimal);
    }
    return mSeriesData;
};

/**
 * Return the bounds of a feature collections
 *
 * @param {Object} pPath A d3.js geo.path
 * @param {type} pFeatures An array of geojson features
 * @returns {Array} The combined bounds of the features [[xmin,ymin], [xmax,ymax]]
 */
s4a.viz.map.util.getFeatureCollectionBounds = function(pPath, pFeatures) {
    var mBounds = [[null, null], [null, null]];
    for (var i = 0, j = pFeatures.length; i < j; i++) {
        var mCBounds = pPath.bounds(pFeatures[i]);
        if (!mBounds[0][0] || mCBounds[0][0] < mBounds[0][0]) {
            mBounds[0][0] = mCBounds[0][0];
        }
        if (!mBounds[0][1] || mCBounds[0][1] < mBounds[0][1]) {
            mBounds[0][1] = mCBounds[0][1];
        }
        if (!mBounds[1][0] || mCBounds[1][0] > mBounds[1][0]) {
            mBounds[1][0] = mCBounds[1][0];
        }
        if (!mBounds[1][1] || mCBounds[1][1] > mBounds[1][1]) {
            mBounds[1][1] = mCBounds[1][1];
        }
    }
    return mBounds;
};

s4a.viz.map.util.valuesToSlices = function(pSeries) {
    if (pSeries !== undefined && typeof pSeries === 'object' && Array.isArray(pSeries) === true) {
        var mSum = 0;
        for (var i = 0, j = pSeries.length; i < j; i++) {
            mSum = mSum + Number(pSeries[i]);
        }
        var mSlices = [];
        for (i = 0, j = pSeries.length; i < j; i++) {
            mSlices.push((Number(pSeries[i]) * 100) / mSum);
        }
        return mSlices;
    } else {
        return pSeries;
    }

};
