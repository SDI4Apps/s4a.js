/* global s4a */
s4a.viz.layout = {};

/**
 * <p>This abstract top-level object handles layout for a group
 * of elements</p>
 *
 * @abstract
 * @constructor
 * @param {DOMElement} domElement
 */
s4a.viz.layout.Layout = function(domElement) {

    /**
     * Add vizualization object to layout
     *
     * @abstract
     */
    function add() {
        throw new Error('Must be implemented by sub-class');
    }

    /**
     * Redraw all vizualization objects added to the layout
     *
     * @abstract
     */
    function redraw() {
        throw new Error('Must be implemented by sub-class');
    }

    return {
        add: add,
        redraw: redraw
    };
};
