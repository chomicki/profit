var https = require('https');

var options = {};

exports.setApiKey = function(apiKey) {
    options.apiKey = apiKey;
};

exports.getApiKey = function() {
    return options.apiKey;
};

exports.heartbeat = function() {
    https.get('https://www.stockfighter.io/ob/api/heartbeat', function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {
            process.stdout.write(d);
        });

        }).on('error', function(e) {
            console.error(e);
    });
};

