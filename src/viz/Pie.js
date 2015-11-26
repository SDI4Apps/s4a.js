s4a.viz.Pie = function(viewCoordinator) {
    var _self = {},
        currentPositionPx = [],
        currentData, feature, scale, radius;

    /**
     * Create new pie chart
     * @param {} mDiagramData object
     * @param {integer} optional width of svg
     * @param {integer} optional height of svg
     */
    function createChart(mDiagramData, width, height) {
        var onClick = function () {
            var currentScale = parseInt(svg.attr('scale'), 10) || scale,
                newScale = currentScale === 1 ? scale : 1;

            svg.selectAll('path')
                .transition()
                .duration(200)
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

                // Wait until resize animation is complete before 
                // applying new scale
                setTimeout(function() {
                    svg.attr('scale', newScale);
                    _self.redraw(currentPositionPx);
                }, 200);
            }
        };

        var data = mDiagramData.data || [];


        // default styles
        var defaults = {
            colors: s4a.viz.color.Purples[data.length],
            donutWidth: 75,
            radius: 150,
            scale: 0.15,
            width: 300
        };


        mDiagramData = $.extend(defaults, mDiagramData);

        radius = mDiagramData.radius;
        scale = mDiagramData.scale;

        var color = d3.scale.ordinal()
            .range(mDiagramData.colors);

        var arc = d3.svg.arc()
            .outerRadius(mDiagramData.radius - 10)
            .innerRadius(0);

        var bigArc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 75);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d._value;
            });

        var overlay = d3.select('div.ol-viewport').append('div').attr('id', 'overlay'),
            svg = overlay.append('svg');

        svg.append('g');

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
            return d3.interpolateString(a, 'scale(' + scale + ')');
        });

        feature = {
            location: mDiagramData.location,
            svg: svg
        };

        g.on('click', onClick);

        
        currentData = mDiagramData;
    }


    /**
     * Set the visibility of the pie visualization (`true` or `false`).
     * @param {boolean} visible The visibility of the layer.
     */
    _self.setVisible = function(visible) {
        if (feature && feature.svg) { 
            feature.svg.attr('display', visible ? null : 'none');
        }
    };

    _self.redraw = function(getOrigin) {
        var svg = feature.svg,
            g = svg.selectAll('g'),
            featureWidth = currentData.width * (svg.attr('scale') || scale),
            featureWidthHalf = (featureWidth / 2);

        var pixel = getOrigin(feature, featureWidth);

        svg.attr('width', featureWidth)
            .attr('height', featureWidth)
            .style('left', pixel[0] + 'px')
            .style('top', pixel[1] + 'px');

        g.attr('transform', 'translate(' + featureWidthHalf + ',' + featureWidthHalf + ')');

        currentPositionPx = pixel;
    };


    // Methods inherited from top level vizObj

    /**
     * Callback from ViewCoordinator. 
     * Update data object for the visualization
     * @param {Object} pData
     */
    _self.update = function(pData) {
        createChart(pData);
    };

    /**
     * Apply a filter to the visualization
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
