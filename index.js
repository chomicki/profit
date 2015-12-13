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

exports.appHeartbeat = function() {
    https.get(options.baseUrl + 'heartbeat', function(res) {
        var code = res.statusCode;
        res.on('data', function(d) {
            d.code = code;
            return d;
        });

    }).on('error', function(e) {
        return {
            'code': null,
            'ok': false,
            'error': 'Request error. Try again?'
        };
    });
};

exports.venueHeartbeat = function(venue) {
    https.get(options.baseUrl + 'venues/' + venue + '/heartbeat', function(res) {
        var code = res.statusCode;
        res.on('data', function(d) {
            d.code = code;
            return d;
        });

    }).on('error', function(e) {
        return {
            'code': null,
            'ok': false,
            'error': 'Request error. Try again?'
        };
    });
};

