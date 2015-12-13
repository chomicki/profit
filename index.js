var https = require('https');
var WebSocket = require('ws');

var options = {
    baseUrl: 'api.stockfighter.io',
    basePath: '/ob/api'
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
        path: options.basePath + urlPath,
        method: method,
        headers : {
            'Accept': '*/*',
            'X-Starfighter-Authorization' : options.apiKey
        }
    };
    return https.request(reqOpt, function(res) {
        var code = res.statusCode;
        console.log(code);
        res.setEncoding('utf8');
        res.on('data', function(d) {
            r = JSON.parse(d);
            r.code = code;
            callback(r);
        });
    });
};

var getRequest = function(urlPath, callback) {
    var request = makeRequest(urlPath, 'GET', callback);
    request.end();
    request.on('error', function(e) {
        callback({
            'code': null,
            'ok': false,
            'error': e
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
        '/heartbeat',
        callback
    );
};

exports.getHeartbeat = function(venue, callback) {
    getRequest(
        '/venues/' + venue + '/heartbeat',
        callback
    );
};

exports.getStocks = function(venue, callback) {
    getRequest(
        '/venues/' + venue + '/stocks',
        callback
    );
}

exports.getStock = function(venue, stock, callback) {
    getRequest(
        '/venues/' + venue + '/stocks/' + stock,
        callback
    );
};

exports.postOrder = function(order, callback) {
    postRequest(
        '/venues/' + order.venue + '/stocks/' + order.symbol + '/orders',
        order,
        callback
    );
};

exports.getQuote = function(venue, stock, callback) {
    getRequest(
        '/venues/' + venue + '/stocks/' + stock + '/quote',
        callback
    );
};

exports.getOrder = function(venue, stock, order, callback) {
    getRequest(
        '/venues/' + venue + '/stocks/' + stock + '/orders/' + order,
        callback
    );
};

exports.deleteOrder = function(venue, stock, order, callback) {
    deleteRequest(
        '/venues/' + venue + '/stocks/' + stock + '/orders/' + order,
        callback
    );
};

exports.getOrders = function(venue, account, callback) {
    getRequest(
        '/venues/' + venue + '/accounts/' + account + '/orders',
        callback
    );
};

exports.getStockOrders = function(venue, account, stock, callback) {
    getRequest(
        '/venues/' + venue + '/accounts/' + account + '/stocks/' +stock + '/orders',
        callback
    );
};

exports.quotesSocket = function(account, venue) {
    var qs = new WebSocket('ws://' + options.baseUrl + options.basePath + '/ws/' + account + '/venues/' + venue + '/tickertape');
    qs.addEventListener('message', function(msg) {
        console.log(msg);
    });
    return qs;
};