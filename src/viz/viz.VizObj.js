/* global s4a */

/**
 * A top level object that coordinates data and visualizations 
 * @param {s4a.viz.ViewCoordinator} pViewCoordinator
 * @constructor
 * @returns {s4a.viz.VizObj}
 */
s4a.viz.VizObj = (function (pViewCoordinator) {
    
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
});