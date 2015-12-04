/**
 * Pie visualization
 *
 * @param {s4a.viz.ViewCoordinator} viewCoordinator
 * @param {s4a.viz.ChartConfig} mChartConfig
 * @constructor
 */
s4a.viz.Pie = function(viewCoordinator, mChartConfig) {
    var chartData, currentData, currentScale, scale, arc, bigArc;
    var _self = this;
    var transitionTime = 400;

    /**
     * Internal reference to Pie svg element.
     * Use getSvg to retrieve it
     *
     * @private
     */
    var svg = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'));

    function changeCollapsedState(collapsed) {
        currentScale = collapsed ? scale : 1;

        var featureWidth = mChartConfig.width * currentScale;
        var featureHeight = mChartConfig.height * currentScale;
        var g = svg.selectAll('g');

        if (currentScale === 1) {
            svg.attr('width', featureWidth)
                .attr('height',featureHeight);

            $(_self).trigger('resize');

            g.attr('transform', 'translate(' + featureWidth / 2 + ',' + featureHeight / 2 + ')');

            svg.selectAll('path')
                .transition()
                .duration(transitionTime)
                .attr('d', currentScale === 1 ? bigArc : arc);
        } else {
            svg.selectAll('path')
                .transition()
                .duration(transitionTime)
                .attr('d', currentScale === 1 ? bigArc : arc);

            setTimeout(function() {
                svg.attr('width', featureWidth)
                    .attr('height',featureHeight);

                $(_self).trigger('resize');

                g.attr('transform', 'translate(' + featureWidth / 2 + ',' + featureHeight / 2 + ')');

            }, transitionTime);

        }
    }

    /**
     * Create new pie chart
     *
     * @param {integer} width optional width of svg
     * @param {integer} height optional height of svg
     * @private
     */
    function updateChart(width, height) {
        // pick the first series
        currentData = chartData.series[0].values;

        // and the first color
        var colors = s4a.viz.color[mChartConfig.colors[0]][currentData.length];

        mChartConfig.height = mChartConfig.height || mChartConfig.width;
        mChartConfig.collapsedHeight = mChartConfig.collapsedHeight || mChartConfig.collapsedWidth;

        scale = mChartConfig.collapsed ? mChartConfig.collapsedWidth / mChartConfig.width : 1;

        currentScale = scale;

        var radius = Math.min(mChartConfig.width, mChartConfig.height) / 2;
        var collapsedRadius = Math.min(mChartConfig.collapsedWidth, mChartConfig.collapsedHeight) / 2;

        var color = d3.scale.ordinal()
            .range(colors);

        arc = d3.svg.arc()
            .outerRadius(collapsedRadius);

        bigArc = d3.svg.arc()
            .outerRadius(radius);

        if (mChartConfig.innerWidth) {
            bigArc.innerRadius(radius - mChartConfig.innerWidth);
        }

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d.valx;
            });

        // delete all current objects
        if (svg) {
            svg.selectAll('*').remove();
        }

        var g = svg.selectAll('.arc')
            .data(pie(currentData))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // avoid flash
        g.attr('transform', 'translate(' + -4000 + ',' + -4000 + ')');

        g.append('path')
            .attr('d', mChartConfig.collapsed ? arc : bigArc)
            .style('fill', function(d) {
                return color(d.data.label);
            });

        if (mChartConfig.collapsed) {
            changeCollapsedState(true);
        }

        if (mChartConfig.collapsible) {
            g.on('click', function() {
                changeCollapsedState(currentScale === 1);
            });
        }
    }

    /**
     * Get the geometry bound to the vizObject
     *
     * @returns {Object} set of lonlat or null
     */
    _self.getGeometry = function() {
        return chartData.geometry;
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
        var g = svg.selectAll('g');
        var featureWidth = mChartConfig.width * currentScale;
        var featureHeight = mChartConfig.height * currentScale;

        svg.attr('width', featureWidth)
            .attr('height', featureHeight);

        g.attr('transform', 'translate(' + featureWidth / 2 + ',' + featureHeight / 2 + ')');
    };

    // Methods inherited from top level vizObj

    /**
     * Callback from ViewCoordinator.
     * Update data object for the visualization
     *
     * @param {Object} mChartData
     */
    _self.update = function(mChartData) {
        chartData = mChartData;
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
