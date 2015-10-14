/* global s4a */

/**
 * A top level object that coordinates data and visualizations 
 * 
 * Any visualization object must implement an interface that contains the methods
 * update and filter
 * 
 * The object receives as part of the constructor a ViewCoordinator object
 * that implicitly contains data
 * 
 * The object receives as part of the constructor a DOMElement identified by its
 * ID, typically i DIV in which it is to be drawn
 * 
 * @param {s4a.viz.ViewCoordinator} pViewCoordinator
 * @param {DOMElement} pElement
 * @constructor
 * @returns {s4a.viz.VizObj}
 */

s4a.viz.VizObj = function (pViewCoordinator, pElement) {

    var _i = 0,
            _self = this,
            _viewCoordinator = pViewCoordinator;

    this.update = function () {
        _self.increment();
    };

    this.increment = function () {
        _self._i++;
    };

    this.get = function () {
        return _self._i++;
    };

    this.filter = function (pFilter) {
        _viewCoordinator.applyFilter();
    };

    pViewCoordinator.subscribe(_self);

};