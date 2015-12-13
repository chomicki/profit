var https = require('https');

var options = {
    baseUrl: 'https://www.stockfighter.io/ob/api/'
};

exports.setApiKey = function(apiKey) {
    options.apiKey = apiKey;
};

exports.getApiKey = function() {
    return options.apiKey;
};

exports.appHeartbeat = function(callback) {
    https.get(options.baseUrl + 'heartbeat', function(res) {
        var code = res.statusCode;
        res.setEncoding('utf8');
        res.on('data', function(d) {
            r = JSON.parse(d);
            r.code = code;
            callback(r);
        });
    }).on('error', function(e) {
        return {
            'code': null,
            'ok': false,
            'error': 'Request error. Try again?'
        };
    });
};

exports.venueHeartbeat = function(venue, callback) {
    https.get(options.baseUrl + 'venues/' + venue + '/heartbeat', function(res) {
        var code = res.statusCode;
        res.setEncoding('utf8');
        res.on('data', function(d) {
            r = JSON.parse(d);
            r.code = code;
            callback(r);
        });

    }).on('error', function(e) {
        return {
            'code': null,
            'ok': false,
            'error': 'Request error. Try again?'
        };
    });
};

