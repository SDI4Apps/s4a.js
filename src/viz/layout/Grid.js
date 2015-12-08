/* global s4a */

/**
 * <p>This is an abstract top-level object that take care of layout for a group
 * of elements</p>
 *
 * @abstract
 * @constructor
 * @param {DOMElement} domElement
 */
s4a.viz.layout.Grid = function(domElement) {

    /**
     * Get view
     *
     * @abstract
     */
    function getView() {
        throw new Error('Must be implemented by sub-class');
    }

    return {
        getView: getView
    };
};
