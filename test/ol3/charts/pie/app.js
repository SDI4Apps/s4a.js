function getLocation(i) {
    // random places along the norwegian coast
    var locations = [{
        y: 59.94486,
        x: 10.74487
    }, {
        y: 58.82520,
        x: 9.40336
    }, {
        y: 58.10915,
        x: 7.71918
    }, {
        y: 58.13342,
        x: 6.62903
    }, {
        y: 58.55824,
        x: 5.95984
    }, {
        y: 59.86223,
        x: 5.29493
    }];

    if (i != undefined && i < locations.length) {
        return locations[i];
    }

    return locations[Math.floor(Math.random() * locations.length)];
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
        map = s4a.map.createMap('map', cfg);

    data.seriesData.forEach(function(item, i) {
        var _data = [];

        if (i > 5) return;

        item.forEach(function(d, i) {
            _data.push({
                _label: data.seriesLabels[i],
                _value: d,
            });
        });

        _data.forEach(function(d) {
            d._value = +d._value;
        });


        var vizObj = {
            data: _data,
            location: getLocation(i)
        };

        s4a.viz.pie.createChart(vizObj, map);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof data !== 'undefined') {
        init();
    }
});