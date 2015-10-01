/* global s4a */

/**
 * A top level object that coordinates data and visualizations 
 * @param {s4a.viz.ViewCoordinator} pViewCoordinator
 * @constructor
 * @returns {s4a.viz.VizObj}
 */
s4a.viz.VizObj = (function (pViewCoordinator) {
<<<<<<< HEAD

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

=======
    
    var _i = 0;
    var _self = this;
  
    this.update = function (pData) {
        return true;
    };
    
    this.increment = function () {
        _i++;
    };
    
    this.get = function () {
        return _i++;
    };
    
    pViewCoordinator.subscribe(_self);
>>>>>>> 2c02355956782a8cfa7d1a4e9f9c617b1cf3afa9
});