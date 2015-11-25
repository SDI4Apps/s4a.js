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

    function getPosition(position, total, idx, padding, featurePadding) {
        var width = targetElement.width(),
            height = targetElement.height(),
            upper = padding,
            center1 = width / 2 - featurePadding,
            center2 = height / 2 - featurePadding,
            lower = height - featurePadding * 2 - padding,
            left = padding + idx * featurePadding + idx * padding,
            right = width - padding - featurePadding * 2;

        padding = padding || 10;
        featurePadding = featurePadding || 20;

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
                    function (padding, featurePadding) {
                        return getPosition(position, total, idx, padding, featurePadding);
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
