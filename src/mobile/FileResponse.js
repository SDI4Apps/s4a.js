/* global s4a, LocalFileSystem */

'use strict';

s4a.extend('mobile');

/**
 * Response object for file operations
 *
 * @param {Boolean} [status=true] - Status of the response true for success, false for error
 * @param {Object} [data] - An Object
 * @param {String} [message] - A message to attach to the response
 * @class - A response object that is passed back and forth between methods in the s4a.mobile.File module
 * @constructor - Create a new FileResponse instance
 */
s4a.mobile.FileResponse = function(status, data, message) {

    /**
     * @type {Boolean}
     * @private
     */
    this.status = undefined;

    if (status !== undefined && status !== null) {
        this.status = status;
    } else {
        status = true;
    }

    /**
     * @type {Object}
     * @private
     */
    this.data = undefined;

    if (data !== undefined && data !== null) {
        this.data = data;
    }

    /**
     * @type {String[]}
     * @private
     */
    this.messages = [];

    // Add initial message to messages array
    if (message !== undefined && message !== null) {
        this.messages.push(message);
    }

    /**
     * Checks if response is success
     *
     * @returns {Boolean} - True on success, false on error
     * @public
     */
    this.isSuccess = function() {
        return this.status === true ? true : false;
    };

    /**
     * Checks if response is error
     *
     * @returns {Boolean} - True on error, false on success
     * @public
     */
    this.isError = function() {
        return this.status === false ? true : false;
    };

    /**
     * Returns any messages in the response object
     *
     * @returns {String}
     * @public
     */
    this.getMessages = function() {
        var messages = '';
        for (var i = 0; i < this.messages.length; i++) {
            message += this.messages[i] + '\n';
        }
        return message;
    };

    /**
     * Overloads default toString, alias for getMessages()
     *
     * @returns {String}
     * @public
     */
    this.toString = function() {
        return this.getMessages();
    };

    /**
     * Add a message to the response
     *
     * @param {String} message
     * @public
     */
    this.addMessage = function(message) {
        this.messages.push(message);
    };

};

/**
 * Create an error FileResponse
 *
 * @param {String} message - An error message
 * @returns {s4a.mobile.FileResponse}
 * @memberof s4a.mobile.FileResponse
 * @static
 */
s4a.mobile.FileResponse.createError = function(message) {
    return new s4a.mobile.FileResponse(false, null, message);
};

/**
 * Create a success FileReponse
 *
 * @param {Object} data - A data object
 * @returns {s4a.mobile.FileResponse}
 * @memberof s4a.mobile.FileResponse
 * @static
 */
s4a.mobile.FileResponse.createSuccess = function(data) {
    return new s4a.mobile.FileResponse(true, data, null);
};
