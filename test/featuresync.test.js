describe('Feature synchronization service', function() {

    it('Test 1 km2', function(a) {
        var s = new gh.stats('Test 1 km2');
        for (var i = 0; i < 100; i++) {

            jQuery.post('http://localhost:8084/featuresync/FeatureSync', {
                action: 'CheckOut',
                longitude: 10,
                latitude: 59,
                buffer: 500
            }, function(res) {

                console.log(res);
                s.log();

            }, 'json').fail(function(res) {
                console.log(res.status);
                s.log();
            });

        }
        s.print();
        expect(s.avg).toBeLessThan(1000);
    });


});