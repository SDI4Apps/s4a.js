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

    var layer = new s4a.map.VizLayer();

    var mChartConfig = new s4a.viz.ChartConfig(chartConfig);

    map.add(layer);

    chartData.forEach(function(data) {
        var vc = new s4a.viz.ViewCoordinator();
        var pie = new s4a.viz.Pie(vc, mChartConfig);

        layer.add(pie);
        vc.setData(data);
    });

};

document.addEventListener('DOMContentLoaded', function() {
    init();
});
