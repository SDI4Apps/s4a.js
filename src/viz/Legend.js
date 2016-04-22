'use strict';
/**
 * Legend for a visualization
 *
 * @param {s4a.viz.ChartConfig} chartConfig
 * @constructor
 */
s4a.viz.Legend = function(chartConfig) {

    /**
     * Internal reference to retain reference to self out of scope
     * @type s4a.viz.Legend
     */
    var _self = this;
    var _keyHeight = 12;
    var _keyWidth = 20;
    var _keySpacing = 10;
    var _offsetX = _keySpacing;
    var _offsetY = _keySpacing;
    var _availableWidth = chartConfig.legendWidth - ((3 * _keySpacing) + _keyWidth);

    /**
     * Internal reference to Legend svg element.
     * Use getSvg to retrieve it
     *
     * @private
     */
    var svg = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'))
            .attr('width', chartConfig.legendWidth)
            .attr('height', chartConfig.legendWidth)
            .attr('style', 'border: 1px solid black');

    /**
     * Element to be used for measuring font widths'
     */
    var legendRuler = d3.select('body')
            .append('svg')
            .style('visibility', 'hidden')
            .style('white-space', 'nowrap')
            .style('position', 'absolute')
            .append('text')
            .attr('id', 's4a-legend-ruler')
            .style('font-family', 'sans-serif')
            .style('font-size', chartConfig.fontSize);

    /**
     * Get the SVG of the legend
     *
     * @returns {svg}
     */
    _self.getSvg = function() {
        return svg.node();
    };

    /**
     * Get the width of a text string in pixels
     *
     * @param {string} textToMeasure Text to measure
     * @returns {number} Width of text in pixels
     * @private
     */
    var getTextWidth = function(textToMeasure) {
        legendRuler.text(textToMeasure);
        //return $('#s4a-legend-ruler').width();
        return legendRuler.node().getComputedTextLength();
    };

    /**
     * Split a label into a minimum number of lines
     *
     * @param {number} numParts
     * @param {string} label
     * @returns {string[]} String array with one entry for each line of the split text
     * @private
     */
    var splitLabel = function(numParts, label) {
        var _chunk = Math.ceil(label.length / numParts);
        var _parts = [];
        var _ct = 0;
        for (var _start = 0, _end = _chunk; _end <= label.length; true) {
            while (_ct <= (numParts * 5) && label[_end] !== ' ' && label[_end] !== '-') {
                _end -= 1;
                _ct++;
            }
            console.log(_ct);
            _parts.push(label.substring(_start, _end).trim());
            _start = _end;
            _end = _start + _chunk;
            if (_end >= label.length) {
                _parts.push(label.substring(_start, _end).trim());
                break;
            }
        }

        return _parts;
    };

    /**
     * Get the y-height of the line
     *
     * @param {type} lineIndex
     * @param {type} _lineHeight
     * @returns {Number}
     * @private
     */
    var getDy = function(lineIndex, _lineHeight) {
        // Return dy only for 2nd line of legend text and onwards
        if (lineIndex === 0) {
            return 0;
        } else {
            return _lineHeight;
        }
    };

    /**
     * Draws or updates legend
     */
    _self.updateLegend = function() {
        // Loop through labels
        for (var _i = 0; _i < (chartConfig.domains.length - 1); _i++) {

            var _id = 'key' + _i;
            var _label = chartConfig.seriesLabels[_i] + ' ' +
                    chartConfig.domains[_i] +
                    '-' + chartConfig.domains[_i + 1];
            // Append legend key
            svg.append('rect')
                    .attr('x', _offsetX)
                    .attr('y', _offsetY)
                    .attr('width', _keyWidth)
                    .attr('height', _keyHeight)
                    .style('fill', chartConfig.colors[_i]) //to be fixed
                    .style('stroke-width', 1)
                    .style('stroke', '#000000');
            // Append legend label
            svg.append('text')
                    .attr('id', _id)
                    .attr('x', _offsetX + _keyWidth + _keySpacing)
                    .attr('y', _offsetY + chartConfig.fontSize - 1)
                    .attr('text-anchor', 'left')
                    .attr('font-family', 'sans-serif')
                    .attr('font-size', chartConfig.fontSize)
                    .text(_label);
            // Get a reference to the drawn legend label
            var _labelElement = svg.select('#' + _id);

            // Calculate width of label
            var _labelWidth = getTextWidth(_label);
            // If label is too long, split it into multiple lines
            if (_labelWidth > _availableWidth) {

                // Remove old text
                _labelElement.text(null);
                // Calculate reasonable line height (experimental)
                var _lineHeight = Math.ceil(chartConfig.fontSize * 1.15);
                // Calculate tentative number of lines
                var _numParts = Math.ceil(_labelWidth / _availableWidth);
                // Get an array of lines by calling spitLabel function
                var _lines = splitLabel(_numParts, _label);
                // Loop through lines and add to text element as tspan elements
                for (var _l = 0; _l < _lines.length; _l++) {
                    _labelElement.append('tspan')
                            .attr('x', _offsetX + _keyWidth + _keySpacing)
                            .attr('dy', getDy(_l, _lineHeight))
                            .text(_lines[_l]);
                    // For each line of the legend, increment
                    _offsetY += chartConfig.fontSize;
                }

                // Increment vertical offset
                _offsetY += _lineHeight;
            } else {
                // Increment vertical offset
                _offsetY += _keySpacing + _keyHeight;
            }
        }

        // Resize SVG height
        svg.attr('height', _offsetY);
    };

    return _self;
};
