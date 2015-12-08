/**
 * Mixin interface that must be implemented by s4a map tools
 * @interface
 */
s4a.map.ITool = {

    /**
     * Human readable name of tool
     * @type {String}
     */
    label: 'Button',

    /**
     * Type of tool
     * @type {s4a.map.ToolType}
     */
    toolType: s4a.map.ToolType.button,

    /**
     *
     * Type of geometry supported by tool
     * @type {s4a.map.GeometryType}
     */
    geomType: s4a.map.GeometryType.none,

    /**
     * Icon that will be used for tool button
     * @type {String}
     */
    icon: 'button.png',

    /**
     * Function that will be executed when the map is clicked when the tool is active
     *
     * @param {Object} e Mouse click event
     */
    onClick: function(e) {
        console.log('Must be overridden by derived class');
        return;
    },
    /**
     * Function that will be executed when the map is double-clicked when the tool is active
     *
     * @param {Object} e Mouse click event
     */
    onDoubleClick: function(e) {
        console.log('Must be overridden by derived class');
        return;
    },
    /**
     * Function that is run when the tool is activated
     */
    onActivate: function() {
        console.log('Must be overridden by derived class');
        return;
    },
    /**
     * Function that is run when the tool is deactivated
     */
    onDeactivate: function() {
        console.log('Must be overridden by derived class');
        return;
    }

};
