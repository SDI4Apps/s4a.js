
function getPosition(i) {
    var positions = ['UL', 'UC', 'UR', 'CL', 'CC', 'CR', 'LL', 'LC', 'LR'];

    //positions = ['UL', 'UC', 'UR', 'UL', 'UR', 'UR', 'UL', 'UR', 'UR'];

    if (i != undefined && i < positions.length) {
        return positions[i];
    }

    return positions[Math.floor(Math.random() * positions.length)];
}

function init() {
    var center = {
        x: 10.56710,
        y: 59.91312,
        epsg: 'EPSG:4326',
        zoom: 7
    };

    var cfg = s4a.config.loadConfig({
        center: center
    });

    var map = new s4a.map.Map('map', cfg);

    var layout = new s4a.viz.layout.Anchor(map);

    var mChartConfig = new s4a.viz.ChartConfig(chartConfig);
    mChartConfig.collapsible = false;
    mChartConfig.collapsed = false;
    mChartConfig.width = 150;

    chartData.forEach(function(data, i) {
        var vc = new s4a.viz.ViewCoordinator();
        var pie = new s4a.viz.Pie(vc, mChartConfig);

        layout.add(pie, getPosition(i));

        vc.setData(data);
    });

    layout.redraw();
};

document.addEventListener('DOMContentLoaded', function() {
    init();
});
