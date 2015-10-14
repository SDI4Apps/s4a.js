/**
 * Define namespace utilities
 * @namespace AASDiag.Util
 * @memberOf AASDiag
 * @type {Object}
 */
AASDiag.Util = AASDiag.Util || {};

/**
 * Return a unique URL to ensure that scripts/styles are reloaded every time
 * @param {String} pUrl An URL
 * @returns {String} URL with unique suffix
 */
AASDiag.Util.secureReload = function (pUrl) {
    var mConcatChar = pUrl.indexOf('?' !== -1) ? '?' : '&';
    return pUrl + mConcatChar + "rnd=" + (Math.random() * 100).toString();
};

/**
 * Returns the number of characters in the longest formatted number in an array
 * @param {Array} pArray An array of numbers
 * @returns {Number} The number of characters in formatted number
 */
AASDiag.Util.getLengthOfLongest = function (pArray) {
    var mLength = 0;
    if (pArray !== null && pArray.length > 1) {
        var tmpLength;
        for (var i = (pArray.length - 1); i > 0; i--) {
            var mLabel = jQuery.number(pArray[i - 1]) + " - " + jQuery.number(pArray[i]);
            var tmpLength = mLabel.length;
            if (tmpLength > mLength) {
                mLength = tmpLength;
            }
        }
    }
    return mLength;
};

/**
 * Return the longest entry from an array
 * @param {Array} pArray
 * @returns {String}
 */
AASDiag.Util.getLongestStringInArray = function (pArray) {
    mArray = pArray.slice();
    return mArray.sort(function (a, b) {
        return b.toString().length - a.toString().length;
    })[0];
};

/**
 * Get the total product of the items in an array of numbers, i.e. passing the
 * array [1,3,4,5] to this function will return 1+3+4+5 = 13. Non-numeric values
 * will be ignored.
 * @param {Number} pDataArray An array of numbers
 * @returns {Number}
 */
AASDiag.Util.getTotal = function (pDataArray) {
    var pTotal = 0;
    for (var j = 0; j < pDataArray.length; j++) {
        pTotal += (typeof pDataArray[j] === 'number') ? pDataArray[j] : 0;
    }
    return pTotal;
};
/**
 * Method to transform json returned by xml2json to the correct format for the
 * diagram data object
 * @param {Object} pObject
 * @returns {AASDiag.DiagramData}
 */
AASDiag.Util.fixJsonData = function (pObject) {
    var mDiagramData = new AASDiag.DiagramData();
    mDiagramData.title = pObject.title[0] || null;
    mDiagramData.mapType = pObject.type !== undefined ? pObject.type : mDiagramData.mapType;
    mDiagramData.mapUnitType = pObject.mapUnitType;
    mDiagramData.mapUnitIDs = pObject.categoryLabels.string;
    mDiagramData.seriesLabels = pObject.title.string;
    mDiagramData.seriesData = AASDiag.Util.fixSeriesJsonData(pObject.seriesData);
    mDiagramData.domains = pObject.intervals.float;
    mDiagramData.showLabels = pObject.showLabels || false;
    mDiagramData.showSeries = pObject.showSeries || [0];

    //Special handling of colors
    if (pObject.palette !== undefined) {
        mDiagramData.colors = pObject.palette !== undefined ? [pObject.palette] : mDiagramData.colors;
    } else {
        mDiagramData.colors = pObject.colors !== undefined ? [pObject.colors] : mDiagramData.colors;
    }

    return mDiagramData;
};

/**
 * Transform the series data object
 * @param {Object} pSeriesData
 * @returns {Array} Array of arrays containing series data
 */
AASDiag.Util.fixSeriesJsonData = function (pSeriesData) {
    var mSeriesData = [];
    for (var i = 0; i < pSeriesData.ArrayOfDecimal.length; i++) {
        mSeriesData.push(pSeriesData.ArrayOfDecimal[i].decimal);
    }
    return mSeriesData;
};
/**
 * Return the bounds of a feature collections
 * @param {Object} pPath A d3.js geo.path
 * @param {type} pFeatures An array of geojson features
 * @returns {Array} The combined bounds of the features [[xmin,ymin], [xmax,ymax]]
 */
AASDiag.Util.getFeatureCollectionBounds = function (pPath, pFeatures) {
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

AASDiag.Util.valuesToSlices = function (pSeries) {
    if (pSeries !== undefined && typeof pSeries === "object" && Array.isArray(pSeries) === true) {
        var mSum = 0;
        for (var i = 0, j = pSeries.length; i < j; i++) {
            mSum = mSum + Number(pSeries[i]);
        }
        var mSlices = [];
        for (var i = 0, j = pSeries.length; i < j; i++) {
            mSlices.push((Number(pSeries[i]) * 100) / mSum);
        }
        return mSlices;
    } else {
        return pSeries;
    }

};