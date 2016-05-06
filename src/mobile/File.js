/* global s4a, LocalFileSystem */

'use strict';

s4a.extend('mobile');

s4a.mobile.File = (function() {

    var File = {};

    /**
     * Get a file entry for a specific filename
     *
     * @function getFileEntry
     * @param {String} filename
     * @returns {Promise.<s4a.mobile.FileResponse>}
     * @name File#getFileEntry
     */
    File.getFileEntry = function(filename, directory) {

        var promise = jQuery.Deferred();

        if (window.cordova !== undefined && window.cordova.file !== undefined) {

            if (directory === undefined) {
                directory = window.cordova.file.dataDirectory;
            }

            window.resolveLocalFileSystemURL(directory, function(directoryEntry) {
                directoryEntry.getFile(filename, {create: true}, function(fileEntry) {
                    promise.resolve(s4a.mobile.FileResponse.createSuccess(fileEntry));
                }, function(directoryEntryError) {
                    promise.resolve(s4a.mobile.FileResponse.createError(directoryEntryError));
                });

            }, function(resolveFileSystemError) {
                promise.resolve(s4a.mobile.FileResponse.createError(resolveFileSystemError));
            });

        } else {
            promise.resolve(
                    s4a.mobile.FileResponse
                    .createError('Requires Cordova with "cordova-plugin-file".'));
        }

        return promise;
    };

    /**
     * Write JSON object to file using the cordova-plugin-file API
     *
     * @param {String} filename - Filename to write to
     * @param {String} contents - Text to write to file
     * @returns {Promise.<s4a.mobile.FileResponse>}
     * @memberof s4a.mobile.File
     */
    File.writeFile = function(filename, contents) {

        var promise = jQuery.Deferred();

        File.getFileEntry(filename).then(function(fileResponse) {
            if (fileResponse.isSuccess()) {
                fileResponse.data.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function() {

                        promise.resolve(s4a.mobile.FileResponse.createSuccess(contents));

                    };
                    fileWriter.onerror = function(e) {

                        promise.resolve(s4a.mobile.FileResponse.createError(e.toString()));

                    };
                    var blob = new Blob([JSON.stringify(contents, null, '\t')], {type: 'text/plain'});
                    fileWriter.write(blob);
                });

            } else {
                promise.resolve(s4a.mobile.FileResponse.createError(fileResponse.messages));
            }
        });

        return promise;
    };

    /**
     * Read the JSON contents from a file using the cordova-plugin-file API
     *
     * @param {String} filename - Name of file to read
     * @returns {Promise.<s4a.mobile.FileResponse>} - If success, data property will be file contents
     * @memberof s4a.mobile.File
     */
    File.readFile = function(filename) {

        var promise = jQuery.Deferred();

        File.getFileEntry(filename).then(function(fileResponse) {
            if (fileResponse.isSuccess()) {
                fileResponse.data.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        promise.resolve(s4a.mobile.FileResponse.createSuccess(JSON.parse(this.result)));
                    };
                    reader.readAsText(file);

                }, function(onErrorReadFile) {
                    promise.resolve(s4a.mobile.FileResponse.createError(onErrorReadFile));
                });
            } else {
                promise.resolve(s4a.mobile.FileResponse.createError(fileResponse.messages));
            }
        });

        return promise;
    };

    return File;

}());
