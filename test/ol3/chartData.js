var chartConfig = {
    //title and description of chart
    title: 'Dyrka mark',
    description: 'Dyrka mark i Norge',

    // default color scale to be used- should perhaps be ordinal
    colors: ['RdPu'],

    showLabels: false,

    // relevant for visualization types that are capable of showing only
    // a single series
    showSeries: [2],

    width: 250,

    // default 0 = no doughnut
    innerWidth: 0,
    height: null,
    fontSize: 12,
    collapsible: true,
    collapsed: true,
    collapsedWidth: 80
};

var chartData = [{
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 19
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 20.7
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 36
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 37
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            10.74487,
            59.94486
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 3
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 4
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 1
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            9.40336,
            58.82520
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 4
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 5
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 1
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 2
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            7.71918,
            58.10915
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 48
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 49
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 1
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            6.62903,
            58.13342
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 1
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 1
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            5.95984,
            58.55824
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 1
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 1
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            5.29493,
            59.86223
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 62
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 63
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 26
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 27
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            6.05385,
            62.55605
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 12
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 13
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 50.7
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 51
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            11.05473,
            64.49060
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 3
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 4
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 1
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            12.84346,
            67.86978
        ]
    }
}, {
    series: [{
        values: [{
            label: 'Omd dyrka jord 2006',
            valx: 1
        }, {
            label: 'Omd dyrka jord 2010',
            valx: 2
        }, {
            label: 'Omd dyrkbar jord 2006',
            valx: 0.7
        }, {
            label: 'Omd dyrkbar jord 2010',
            valx: 1
        }]
    }],
    geometry: {
        type: 'point',
        coordinates: [
            24.83296,
            68.94897
        ]
    }
}];
