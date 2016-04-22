var gh = gh || {};

gh.stats = function(sampleName) {

    this.sampleName = sampleName;

    this.reset = function() {

        this.baselineTime = new Date().getTime();

        this.data = [];

        this.min = null;

        this.max = null;

        this.avg = null;

        this.cnt = 0;

        this.sum = 0;
    };

    this.median = function() {
        this.data.sort();
        var medianIndex = Math.floor(this.data.length / 2);
        return this.data[medianIndex];
    };

    this.reset();

    this.log = function(value) {

        if (value === undefined || !isNaN(value)) {

            var currentTime = new Date().getTime();
            value = currentTime - this.baselineTime;
            this.baselineTime = currentTime;
        }

        this.data.push(value);

        this.cnt++;

        if (this.min === null || value < this.min) {
            this.min = value;
        }

        if (this.max === null || value > this.max) {
            this.max = value;
        }

        this.sum += value;

        this.avg = this.sum / this.cnt;

    };

    this.print = function() {
        console.log('Sample summary: ' + this.sampleName);
        console.log('- Sample size: ' + this.cnt);
        console.log('- Sum: ' + this.sum);
        console.log('- Average: ' + this.avg);
        console.log('- Median: ' + this.median());
        console.log('- Min: ' + this.min);
        console.log('- Max: ' + this.max);
    };

};