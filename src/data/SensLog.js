'use strict';

s4a.extend('data');

s4a.data.SensLog = (function () {
    /**
     * Class with methods to interact with SensLog
     * 
     * @exports SensLog
     */
    var SensLog = {};

    /**
     * Formats a date for insertion into SensLog
     * 
     * @param {Date} date - A JavaScript date
     * @returns {String} - Formatted date string
     */
    var _formatDate = function (date) {

        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        var day = date.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }
        var hours = date.getHours().toString();
        if (hours.length === 1) {
            hours = '0' + hours;
        }

        var minutes = date.getMinutes().toString();
        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }
        var seconds = date.getSeconds().toString();

        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }

        return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
    };

    var _controllerServletUriFragment = '/../SensLog/ControllerServlet';

    var _feederUriFragment = '/../SensLog/FeederServlet';

    var _dataServiceUriFragment = '/../SensLog/DataService';

    var _sensorServiceUriFragment = '/../SensLog/SensorService';

    /**
     * Send an auth request
     * 
     * @param {String} username
     * @param {String} password
     * @returns {Promise.<Object>}
     */
    SensLog.login = function (username, password) {
        return s4a.doPost(_controllerServletUriFragment, {
            username: username,
            password: password
        });
    };

    /**
     * Insert of sensor unit position
     * 
     * @param {Number} lat
     * @param {Number} lon
     * @param {Number} unitId
     * @param {Date} date
     * @returns {Promise.<Object>}
     */
    SensLog.insertPosition = function (lat, lon, unitId, date) {

        return s4a.doGet(_feederUriFragment, {
            Operation: "InsertPosition",
            lat: lat,
            lon: lon,
            unit_id: unitId,
            date: _formatDate(date)
        }, 'text');

    };

    /**
     * Insert a sensor observation
     * 
     * @param {Number} value
     * @param {Number} unitId
     * @param {Number} sensorId
     * @param {Date} date
     * @returns {Promise.<Object>}
     */
    SensLog.insertObservation = function (value, unitId, sensorId, date) {
        return s4a.doGet(_feederUriFragment, {
            Operation: "InsertObservation",
            value: value,
            unit_id: unitId,
            sensor_id: sensorId,
            date: _formatDate(date)
        }, 'text');
    };

    /**
     * Get last position for devices belonging to user
     * 
     * @param {String} username
     * @returns {Promise.<Object>}
     */
    SensLog.getLastPositions = function (username) {
        return s4a.doGet(_dataServiceUriFragment, {
            Operation: 'GetLastPositions',
            user: username
        });
    };

    /**
     * Get last position for specific device belonging to user
     * 
     * @param {Number} unitId
     * @param {String} username
     * @returns {Promise.<Object|null>}
     */
    SensLog.getLastPosition = function (unitId, username) {
        return SensLog.getLastPositions(username).then(function (res) {
            for (var i = 0; i < res.length; i++) {
                var pos = res[i];
                if (pos.unit_id === unitId) {
                    return pos;
                }
            }
            return null;
        });
    };

    /**
     * Get observations for a sensor
     * 
     * @param {Number} unitId
     * @param {Number} sensorId
     * @param {String} username
     * @param {String} from - ISO date/time YYYY-MM-DD hh:mm:ss
     * @param {String} to - ISO date/time YYYY-MM-DD hh:mm:ss
     * @returns {Promise.<Object>}
     */
    SensLog.getObservations = function (unitId, sensorId, username, from, to) {

        var params = {
            Operation: 'GetObservations',
            unit_id: unitId,
            sensor_id: sensorId,
            user: username
        };

        return s4a.doGet(_sensorServiceUriFragment, params);
    };

    /**
     * Get sensors for a device
     * 
     * @param {Number} unitId - Id of sensor
     * @param {String} username - User name of user owning sensor
     * @returns {Promise.<Object>}
     */
    SensLog.getSensors = function (unitId, username) {

        return s4a.doGet(_sensorServiceUriFragment, {
            Operation: 'GetSensors',
            unit_id: unitId,
            user: username
        });
    };

    return SensLog;

}());




