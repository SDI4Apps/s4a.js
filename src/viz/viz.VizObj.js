/* global s4a */

/**
 * A top level object that coordinates data and visualizations 
 * @param {s4a.viz.ViewCoordinator} pViewCoordinator
 * @constructor
 * @returns {s4a.viz.VizObj}
 */
s4a.viz.VizObj = (function (pViewCoordinator) {

    var _i = 0,
            _self = this,
            _viewCoordinator = pViewCoordinator;

    this.update = function (pData) {
        _self.increment();
    };

    this.increment = function () {
        self._i++;
    };

    this.get = function () {
        return self._i++;
    };

    this.filter = function (pFilter) {
        _viewCoordinator.applyFilter();
    }

    pViewCoordinator.subscribe(_self);

});