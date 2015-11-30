/* global s4a */

/**
 * A top level object that coordinates data and visualizations 
 * @param {Object} pData
 * @constructor
 * @returns {s4a.viz.ViewCoordinator}
 */
s4a.viz.ViewCoordinator = function (pData) {

    var _data = pData,
        _listeners = [],
        _self = {};

    /**
     * Subscribes an object to publish events from the ViewCoordinator
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.publish = function () {
        for (var i = 0; i < _listeners.length; i++) {
            var listener = _listeners[i];
            if (listener.update) {
                listener.update(_data);
                console.info('Published ' + i);
            } else {
                console.debug('Subscribed object ' + i + ' does not implement the update interface', listener);
            }
        }
        return _self;
    };

    /**
     * Update the data object
     * @param {Object} t
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.setData = function (pData) {
        _data = pData;
        _self.publish();
        return _self;
    };

    /**
     * Subscribe an object to the ViewCoordinator
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.subscribe = function (pObj) {
        if (_listeners.indexOf(pObj) < 0) {
            _listeners.push(pObj);
        }
        return _self;
    };

    /**
     * Unsubscribe an object from the ViewCoordinator
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.unsubscribe = function (pObj) {
        var _modListeners = [];
        for (var i = 0; i < _listeners.length; i++) {
            if (_listeners[i] !== pObj) {
                _modListeners.push(_listeners[i]);
            }
        }
        _listeners = _modListeners;
        return _self;
    };

    _self.applyFilter = function () {
        _self.publish();
        return _self;
    };


    return _self;

};