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
     * Formats a JavaScript date into a SensLog date string
     *
     * @param {Date} date - A JavaScript date
     * @returns {String} - SensLog formatted date string YYYY-MM-DDThh:mm:ss
     */
    var _toSensLogDate = function (date) {

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

    /**
     * Convert a SensLog date string to a JavaScript date
     *
     * @param {String} sensLogDateString
     * @returns {Date} - JavaScript date object
     */
    var _toJsDate = function (sensLogDateString) {
        var dateAndTime = sensLogDateString.split(' ');
        var dateParts = dateAndTime[0].split('-');
        // TODO: Only supports positive time-zone
        var timeParts = dateAndTime[1].split('+');
        var hourMinuteSecond = timeParts[0].split(':');
        var date = new Date(+dateParts[0],
                (+dateParts[1] - 1),
                +dateParts[2],
                +hourMinuteSecond[0],
                +hourMinuteSecond[1],
                +hourMinuteSecond[2]);
        return date;
    };

    /**
     * Converts a JavaScript date to an ISO date string
     *
     * @param {Date} date
     * @returns {String} - ISO date YYYY-MM-DD hh:mm:ss
     */
    var _toIsoDate = function (date) {
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

        // TODO: Supports only GMT+2
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

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
            Operation: 'InsertPosition',
            lat: lat,
            lon: lon,
            unit_id: unitId,
            date: _toSensLogDate(date)
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
            Operation: 'InsertObservation',
            value: value,
            unit_id: unitId,
            sensor_id: sensorId,
            date: _toSensLogDate(date)
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
     * @param {Date} [from=undefined] - Observation start time
     * @param {Date} [to=undefined] - Observation end-time
     * @returns {Promise.<Object>}
     */
    SensLog.getObservations = function (unitId, sensorId, username, from, to) {

        var params = {
            Operation: 'GetObservations',
            unit_id: unitId,
            sensor_id: sensorId,
            user: username
        };

        if (from !== undefined && to !== undefined) {
            params.from = _toIsoDate(from);
            params.to = _toIsoDate(to);
        }

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

    /**
     * Get last observation
     *
     * @param {Number} unitId
     * @param {Number} sensorId
     * @param {String} username
     * @returns {Promise.<Object|null>}
     */
    SensLog.getLastObservation = function (unitId, sensorId, username) {
        return SensLog.getSensors(unitId, username).then(function (res) {
            var tmpSensor = null;
            for (var i = 0; i < res.length; i++) {
                if (res[i].sensorId === sensorId) {
                    tmpSensor = res[i];
                    break;
                }
            }
            if (tmpSensor !== null) {
                var toDate = _toJsDate(tmpSensor.lastObservationTime);
                var fromDate = new Date(toDate.getTime());
                fromDate.setSeconds(fromDate.getSeconds() - 10);
                return SensLog.getObservations(unitId,
                        sensorId,
                        username,
                        fromDate,
                        toDate)
                        .then(function (res) {
                            return res[res.length - 1];
                        });
            } else {
                return null;
            }
        });
    };

    return SensLog;

}());
