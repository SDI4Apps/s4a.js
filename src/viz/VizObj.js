/* global s4a */

/**
 * <p>This is an abstract top-level object that coordinates data and visualizations
 * that take part in a coordinated view</p>
 *
 * <p>Any visualization object must implement an interface that contains the methods
 * update and filter</p>
 *
 * <p>The object receives as part of the constructor a ViewCoordinator object
 * that implicitly contains data</p>
 *
 * <p>The object receives as part of the constructor a DOMElement identified by its
 * ID, typically i DIV in which it is to be drawn</p>
 *
 * @abstract
 * @constructor
 * @param {s4a.viz.ViewCoordinator} viewCoordinator
 * @param {DOMElement} domElement
 * @returns {s4a.viz.VizObj}
 */
s4a.viz.VizObj = function(viewCoordinator, domElement) {
    var _self = this;

    viewCoordinator.subscribe(_self);

    /**
     * Update the visualization
     *
     * @abstract
     */
    _self.update = function() {
        throw new Error('Must be implemented by sub-class');
    };

    /**
     * Apply a filter to the visualization
     *
     * @abstract
     */
    _self.filter = function(filter) {
        throw new Error('Must be implemented by sub-class');
    };

    _self.get = function() {
        throw new Error('Must be implemented by sub-class');
    };
};
