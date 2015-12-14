var https = require('https');
var WebSocket = require('ws');

var options = {
    baseUrl: 'www.stockfighter.io',
    basePath: '/ob/api',
    gmPath: '/gm'
};

exports.setApiKey = function(apiKey) {
    options.apiKey = apiKey;
};

exports.getApiKey = function() {
    return options.apiKey;
};

var makeRequest = function(urlPath, method, callback) {
    reqOpt = {
        hostname: options.baseUrl,
        path: urlPath,
        method: method,
        headers : {
            'Accept': '*/*',
            'X-Starfighter-Authorization' : options.apiKey
        }
    };
    return https.request(reqOpt, function(res) {
        var code = res.statusCode;
        res.setEncoding('utf8');
        res.on('data', function(d) {
            switch (code) {
                case 200:
                    r = JSON.parse(d);
                    r.code = code;
                    callback(r);
                    break;
                case 504:
                    callback({
                        'code': code,
                        'ok': false,
                        'error': 'Gateway Timeout'
                    });
                    break;
                default:
                    r = JSON.parse(d);
                    r.code = code;
                    callback(r);
                    break;
            }
        });
    });
};

var getRequest = function(urlPath, callback) {
    var request = makeRequest(urlPath, 'GET', callback);
    request.end();
    request.on('error', function(e) {
        callback({
            'code': e.code || null,
            'ok': false,
            'error': e.message
        });
    });
};

var postRequest = function(urlPath, body, callback) {
    var request = makeRequest(urlPath, 'POST', callback);
    request.write(body);
    request.end();
    request.on('error', function(e) {
        callback({
            'code': null,
            'ok': false,
            'error': e
        });
    });
};

var deleteRequest = function(urlPath, callback) {
    var request = makeRequest(urlPath, 'DELETE', callback);
    request.end();
    request.on('error', function(e) {
        callback({
            'code': null,
            'ok': false,
            'error': e
        });
    });
};

exports.getAppHeartbeat = function(callback) {
    getRequest(
        options.basePath + '/heartbeat',
        callback
    );
};

exports.getHeartbeat = function(venue, callback) {
    getRequest(
        options.basePath + '/venues/' + venue + '/heartbeat',
        callback
    );
};

exports.getStocks = function(venue, callback) {
    getRequest(
        options.basePath + '/venues/' + venue + '/stocks',
        callback
    );
};

exports.getStock = function(venue, stock, callback) {
    getRequest(
        options.basePath + '/venues/' + venue + '/stocks/' + stock,
        callback
    );
};

exports.postOrder = function(order, callback) {
    postRequest(
        options.basePath + '/venues/' + order.venue + '/stocks/' + order.stock + '/orders',
        JSON.stringify(order),
        callback
    );
};

exports.getQuote = function(venue, stock, callback) {
    getRequest(
        options.basePath + '/venues/' + venue + '/stocks/' + stock + '/quote',
        callback
    );
};

exports.getOrder = function(venue, stock, order, callback) {
    getRequest(
        options.basePath + '/venues/' + venue + '/stocks/' + stock + '/orders/' + order,
        callback
    );
};

exports.deleteOrder = function(venue, stock, order, callback) {
    deleteRequest(
        options.basePath + '/venues/' + venue + '/stocks/' + stock + '/orders/' + order,
        callback
    );
};

exports.getOrders = function(venue, account, callback) {
    getRequest(
        options.basePath + '/venues/' + venue + '/accounts/' + account + '/orders',
        callback
    );
};

exports.getStockOrders = function(venue, account, stock, callback) {
    getRequest(
        options.basePath + '/venues/' + venue + '/accounts/' + account + '/stocks/' +stock + '/orders',
        callback
    );
};

exports.quotesSocket = function(account, venue) {
    var qs = new WebSocket('wss://' + options.baseUrl + options.basePath + '/ws/' + account + '/venues/' + venue + '/tickertape');
    qs.addEventListener('message', function(msg) {
        console.log(msg);
    });
    return qs;
};

exports.startLevel = function(levelNumber, callback) {
    var level = getLevelFromNumber(levelNumber);
    postRequest(
        options.gmPath + '/levels/' + level,
        {},
        callback
    );
};

var getLevelFromNumber = function(levelNumber) {
    switch (levelNumber) {
        case 1:
            return "first_steps";
        case 2:
            return "chock_a_block";
        default:
            return null;
    }
};

exports.restartLevel = function(instance, callback) {
    postRequest(
        options.gmPath + '/instances/' + instance + '/restart',
        {},
        callback
    );
};

exports.stopLevel = function(instance, callback) {
    postRequest(
        options.gmPath + '/instances/' + instance + '/stop',
        {},
        callback
    );
};

exports.resumeLevel = function(instance, callback) {
    postRequest(
        options.gmPath + '/instances/' + instance + '/resume',
        {},
        callback
    );
};

exports.getLevel = function(instance, callback) {
    getRequest(
        options.gmPath + '/instances/' + instance,
        callback
    );
};
