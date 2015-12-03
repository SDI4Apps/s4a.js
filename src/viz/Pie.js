s4a.viz.Pie = function(viewCoordinator) {
    var currentData, currentScale;
    var _self = this;

    /**
     * Set of default styles
     *
     * @private
     */
    var defaults = {
        collapsed: false,
        collapsedWidth: 45,
        collapsible: false,
        donutWidth: 75,
        radius: 150,
        scale: 1,
        width: 300
    };

    /**
     * Internal reference to Pie svg element.
     * Use getSvg to retrieve it
     *
     * @private
     */
    var svg = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'));

    /**
     * Create new pie chart
     *
     * @param {integer} width optional width of svg
     * @param {integer} height optional height of svg
     * @private
     */
    function updateChart(width, height) {
        var onClick = function() {
            var newScale = currentScale === 1 ? currentData.scale : 1;

            svg.selectAll('path')
                .transition()
                .duration(0)
                .attrTween('transform', function(d, i, a) {
                    return d3.interpolateString(a, 'scale(' + newScale + ')');
                })
                .attr('d', newScale === 1 ? bigArc : arc);

            if (newScale === 1) {
                svg.attr('scale', newScale)
                // show selected pies at top
                .style('z-index', 100);

                var legendRectSize = 18;
                var legendSpacing = 4;

                g.append('rect')
                    .attr('class', 'legend')
                    .attr('x', -50)
                    .attr('y', function(d, i) {
                        return -40 + i * 20;
                    })
                    .attr('width', 15)
                    .attr('height', 10)
                    .style('fill', function(d) {
                        return color(d.data._label);
                    });

                g.append('text')
                    .attr('class', 'legend')
                    .attr('x', -20)
                    .attr('y', function(d, i) {
                        return -40 + i * 20;
                    })
                    .text(function(d) {
                        return d.data._label;
                    });
            } else {
                g.selectAll('text').remove();
                g.selectAll('rect').remove();

                // show unselected pies at bottom
                svg.style('z-index', 1);
            }

            currentScale = currentScale === 1 ? currentData.scale : 1;

            //adjust the size of the SVG
            _self.redraw();

            // notify that the SVG need repositioning
            $(_self).trigger('resize');
        };

        var data = currentData.data || [];

        currentData = $.extend(defaults, currentData);
        currentData.colors = currentData.colors || s4a.viz.color.Purples[data.length];

        if (currentData.collapsed) {
            currentData.scale = currentData.collapsedWidth / currentData.width;
        }

        currentScale = currentData.scale;

        var radius = currentData.radius;

        var color = d3.scale.ordinal()
            .range(currentData.colors);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var bigArc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 75);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d._value;
            });

        // delete all current objects
        if (svg) {
            svg.selectAll('*').remove();
        }

        var g = svg.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // avoid flash
        g.attr('transform', 'translate(' + -4000 + ',' + -4000 + ')');

        g.append('path')
            .attr('d', arc)
            .style('fill', function(d) {
                return color(d.data._label);
            });

        svg.selectAll('path').transition().attrTween('transform', function(d, i, a) {
            return d3.interpolateString(a, 'scale(' + currentScale + ')');
        });

        g.on('click', onClick);
    }

    /**
     * Get the geometry bound to the vizObject
     *
     * @returns {Object} set of lonlat or null
     */
    _self.getGeometry = function() {
        return currentData.location;
    };

    /**
     * Get the svg representation of the vizObject
     *
     * @returns {d3.svg} set of lonlat or null
     */
    _self.getSvg = function() {
        return svg;
    };

    /**
     * Set the visibility of the pie visualization (`true` or `false`).
     *
     * @param {boolean} visible The visibility of the layer.
     */
    _self.setVisible = function(visible) {
        if (svg) {
            svg.attr('display', visible ? null : 'none');
        }
    };

    /**
     * Redraw the vizObject
     */
    _self.redraw = function() {
        if (currentData) {
            if (!svg) {
                updateChart();
            }

            var g = svg.selectAll('g');
            var featureWidth = currentData.width * currentScale;
            var featureWidthHalf = featureWidth / 2;

            svg.attr('width', featureWidth)
                .attr('height', featureWidth);

            g.attr('transform', 'translate(' + featureWidthHalf + ',' + featureWidthHalf + ')');
        }
    };

    // Methods inherited from top level vizObj

    /**
     * Callback from ViewCoordinator.
     * Update data object for the visualization
     *
     * @param {Object} pData
     */
    _self.update = function(pData) {
        currentData = pData;
        updateChart();
        _self.redraw();
    };

    /**
     * Apply a filter to the visualization
     *
     * @abstract
     */
    _self.filter = function() {
        throw new Error('Must be implemented by sub-class');
    };

    _self.get = function() {
        throw new Error('Must be implemented by sub-class');
    };

    viewCoordinator.subscribe(_self);

    return _self;
};
