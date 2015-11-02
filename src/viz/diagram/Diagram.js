/**
 * Map visualization objects
 * @class
 * @namespace s4a.viz.diagram
 */
s4a.viz.diagram = (function() {

    function _createPieChart(mDiagramData) {
        function resize(feature) {
            var svg = feature.svg,
                g = svg.selectAll('g'),
                newWidth = mDiagramData.width * (svg.attr('scale') || scale),
                newWidthHalf = (newWidth / 2);

            g.attr('transform', 'translate(' + newWidthHalf + ',' + newWidthHalf + ')');
        }

        var features = [];

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

        var radius = mDiagramData.radius,
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

        var overlay = d3.select('body').append('div').attr('id', 'overlay'),
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

        var feature = {
            location: mDiagramData.location,
            svg: svg
        };

        features.push(feature);

        g.on('click', function() {
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
                    resize(feature);
                }, 200);
            }
        });
    }

    return {
        createPieChart: _createPieChart
    };
})();