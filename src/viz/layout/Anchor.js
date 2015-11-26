/* global s4a */

/**
 * <p>This is an abstract top-level object that take care of layout for a group
 * of elements</p> 
 * 
 * @constructor
 * @param {DOMElement} domElement
 */
s4a.viz.layout.Anchor = function(targetElement) {

    if (targetElement.getDomElement) {
        targetElement = targetElement.getDomElement();
    }

    // Internal list of all vizualization objects added to the layout
    // key = position
    // value = list of vizualization objects at the given position
    var vizObjects = {};

    var projectPoint = function (argument) {
        return null;
    };

    function add(vizObject, position) {
        if (!vizObjects.hasOwnProperty(position)) {
            vizObjects[position] = [];
        }

        vizObjects[position].push(vizObject);
    }


    $( window ).resize(function() {
        redraw();
    });

    function getPosition(position, total, idx, feature, featureWidth) {
        var width = targetElement.width(),
            height = targetElement.height(),
            padding = 10,
            upper = padding,
            center1 = width / 2 - featureWidth,
            center2 = height / 2 - featureWidth,
            lower = height - featureWidth * 2 - padding,
            left = padding + idx * featureWidth + idx * padding,
            right = width - padding - featureWidth * 2;

        switch (position) {
            case 'UL':
                return [left, upper];
            case 'UC':
                return [center1, upper];
            case 'UR':
                return [right, upper];
            case 'CL':
                return [left, center2];
            case 'CC':
                return [center1, center2];
            case 'CR':
                return [right, center2];
            case 'LL':
                return [left, lower];
            case 'LC':
                return [center1, lower];
            case 'LR':
                return [right, lower];
            default:
                console.warn('s4a.viz.layout.Anchor:', 'Given position is incorrect:', position);
        }
    }

    function updateAllVizObjects(fn) {
        jQuery.each(vizObjects, function(position, vizObjectsAtPosition) {
            vizObjectsAtPosition.forEach(function(vizObj, idx) {
                fn(vizObj, position, vizObjectsAtPosition.length, idx);
            });
        });
    }

    function redraw() {
        updateAllVizObjects(function (vizObj, position, total, idx) {
            if (vizObj.redraw) {
                vizObj.redraw(
                    function (feature, featureWidth) {
                        return getPosition(position, total, idx, feature, featureWidth);
                    }
                );
            }
            else {
                console.debug('s4a.viz.layout.Anchor:', 'Object does not implement the redraw interface:', vizObj);
            }
        });
    }

    return {
        add: add,

        redraw: redraw
    };
};
