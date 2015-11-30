
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
        },
        cfg = s4a.config.loadConfig({
            center: center
        }),
        map = new s4a.map.Map('map', cfg),
        layout = new s4a.viz.layout.Anchor(map);


    var seriesData = {};


    var seriesConfig = {

    };


    data.seriesData.forEach(function(item, i) {
        var _data = [];

        if (i > 9) return;

        item.forEach(function(d, i) {
            _data.push({
                _label: data.seriesLabels[i],
                _value: d,
            });
        });

        _data.forEach(function(d) {
            d._value = +d._value;
        });

        var vc = new s4a.viz.ViewCoordinator();
        var pie = new s4a.viz.Pie(vc);

        layout.add(pie, getPosition(i));

        vc.setData({
            data: _data,
            collapsible: true,
            collapsed: true
        });
    });

    layout.redraw();
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof data !== 'undefined') {
        init();
    }
});