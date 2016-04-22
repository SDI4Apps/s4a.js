describe('Drawing and update performance', function() {

    var getRecords = function(num) {

        var arr = [];
        for (var n = 0; n < num; n++) {
            arr.push({
                id: n + 1,
                label: 'label-' + (n + 1),
                var1: gh.rnd(0, 100),
                var2: gh.rnd(200, 2000),
                var3: gh.rnd(50000, 150000),
                var4: gh.rnd(1, 10)
            });
        }
        return arr;
    };

    console.log('Setup test data');

    var s100 = getRecords(100);
    var s1000 = getRecords(1000);
    var s5000 = getRecords(5000);
    var s10000 = getRecords(10000);
    var s15000 = getRecords(15000);
    var s100000 = getRecords(100000);

    console.log('Completed setup of test data');

    it('Testing 100 records', function() {
        var s = new gh.stats('Test 100');
        for (var i = 0; i < 100; i++) {
            var t = crossfilter(s100);
            var d1 = t.dimension(function(d) {
                return d.var1;
            });
            var d2 = t.dimension(function(d) {
                return d.var2;
            });

            var g1 = d2.group().reduceSum();

            s.log();
        }
        s.print();
        expect(s.avg).toBeLessThan(1000);
    });

    it('Testing 1 000 records', function() {
        var s = new gh.stats('Test 1 000');
        for (var i = 0; i < 100; i++) {
            var t = crossfilter(s1000);
            var d1 = t.dimension(function(d) {
                return d.var1;
            });
            var d2 = t.dimension(function(d) {
                return d.var2;
            });

            var g1 = d2.group().reduceSum();

            s.log();
        }
        s.print();
        expect(s.avg).toBeLessThan(1000);
    });

    it('Testing 5 000 records', function() {
        var s = new gh.stats('Test 5 000');
        for (var i = 0; i < 100; i++) {
            var t = crossfilter(s5000);
            var d1 = t.dimension(function(d) {
                return d.var1;
            });
            var d2 = t.dimension(function(d) {
                return d.var2;
            });

            var g1 = d2.group().reduceSum();

            s.log();
        }
        s.print();
        expect(s.avg).toBeLessThan(1000);
    });

    it('Testing 10 000 records', function() {
        var s = new gh.stats('Test 10 000');
        for (var i = 0; i < 100; i++) {
            var t = crossfilter(s10000);
            var d1 = t.dimension(function(d) {
                return d.var1;
            });
            var d2 = t.dimension(function(d) {
                return d.var2;
            });

            var g1 = d2.group().reduceSum();

            s.log();
        }
        s.print();
        expect(s.avg).toBeLessThan(1000);
    });

    it('Testing 100 000 records', function() {
        var s = new gh.stats('Test 100 000');
        for (var i = 0; i < 100; i++) {
            var t = crossfilter(s100000);
            var d1 = t.dimension(function(d) {
                return d.var1;
            });
            var d2 = t.dimension(function(d) {
                return d.var2;
            });

            var g1 = d2.group().reduceSum();

            s.log();
        }
        s.print();
        expect(s.avg).toBeLessThan(1000);
    });

});