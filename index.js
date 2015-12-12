var https = require('https');

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

