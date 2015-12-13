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
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {
            process.stdout.write(d);
        });

        }).on('error', function(e) {
            console.error(e);
    });
};

exports.venueHeartbeat = function(venue) {
    https.get(options.baseUrl + 'venues/' + venue + '/heartbeat', function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {
            process.stdout.write(d);
        });

        }).on('error', function(e) {
            console.error(e);
    });
};

