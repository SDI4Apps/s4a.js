var gh = gh || {};

gh.rnd = function(low, high, round) {

    low = low || 0;
    high = high || 100;
    round = round || true;

    var tmp = Math.random() * (high - low + 1);
    if (round) {
        return Math.floor(tmp) + low;
    } else {
        return tmp;
    }

};