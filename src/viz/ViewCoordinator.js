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
            _self = this;

    /**
     * Subscribes an object to publish events from the ViewCoordinator
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.publish = function () {
        for (var i = 0; i < _listeners.length; i++) {
            var listener = _listeners[i];
            if (typeof listener.update !== 'undefined') {
                _listeners[i].update(this._data);
                console.info('Published ' + i);
            } else {
                console.debug('Subscribed object ' + i + ' does not implement the update interface');
            }
        }
        return this;
    };

    var _setData = function (pData) {
        console.info('Updated data');
        _data = pData;
        _self.publish();
    };


    /**
     * Update the data object
     * @param {Object} t
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.test = function (t) {
        _setData(t);
        return this;
    };

    /**
     * Subscribe an object to the ViewCoordinator
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.subscribe = function (pObj) {
        if (_listeners.indexOf(pObj) < 0) {
            _listeners.push(pObj);
        }
        return this;
    };

    /**
     * Unsubscribe an object from the ViewCoordinator
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.unsubscribe = function (pObj) {
        var _modListeners = [];
        for (var i = 0; i < _listeners.length; i++) {
            if (_listeners[i] !== pObj) {
                _modListeners.push(_listeners[i]);
            }
        }
        _listeners = _modListeners;
        return this;
    };

    this.applyFilter = function () {
        _self.publish();
        return this;
    };

};