var nock = require('nock');
var assert = require('assert');
var profit = require('../index');

describe('API Wrapper', function () {

	describe('API Key Tests', function(){
		it('should initially be null', function () {
			assert.equal(profit.getApiKey(),null);
		});

		it('should should be updated by the set method', function () {
			var key = "TESTKEY";
			profit.setApiKey(key);
			assert.equal(profit.getApiKey(),key);
		});
	});

	describe('Application Heartbeat Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"error": ""
			};

			nock('https://www.stockfighter.io')
			.get('/ob/api/heartbeat')
			.reply(200,data);
			profit.getAppHeartbeat(function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 504', function(done){
			nock('https://www.stockfighter.io')
			.get('/ob/api/heartbeat')
			.reply(504,{});
			profit.getAppHeartbeat(function(d) {
				assert.equal(d.ok, false);
				assert.equal(d.code, 504);
				assert.equal(d.error, "Gateway Timeout");
				done();
			});
		});

		it('should handle an error without a code', function(done){
			nock('https://www.stockfighter.io')
			.get('/ob/api/heartbeat')
			.replyWithError("Uh oh!");
			profit.getAppHeartbeat(function(d) {
				assert.equal(d.ok, false);
				assert.equal(d.code, null);
				assert.equal(d.error, "Uh oh!");
				done();
			});
		});

		it('should handle an error with a code', function(done){
			nock('https://www.stockfighter.io')
			.get('/ob/api/heartbeat')
			.replyWithError({message: "Uh oh!", code:"BAD"});
			profit.getAppHeartbeat(function(d) {
				assert.equal(d.ok, false);
				assert.equal(d.code, "BAD");
				assert.equal(d.error, "Uh oh!");
				done();
			});
		});

	});

	describe('Venue Heartbeat Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"venue": "EX"
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/heartbeat')
			.reply(200, data);
			profit.getHeartbeat("EX",function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 500', function(done){
			var data = {
				"ok": false,
				"error": "The venue appears to be non-responsive even though its server is up."
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/heartbeat')
			.reply(500, data);
			profit.getHeartbeat("EX", function(d) {
				data.code = 500
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 404', function(done){
			var data = {
				"ok": false,
				"error": "No venue exists with the symbol FOOBAR."
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/heartbeat')
			.reply(404, data);
			profit.getHeartbeat("EX", function(d) {
				data.code = 404;
				assert.deepEqual(d, data);
				done();
			});
		});
	});

	describe('Stocks on Venue Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"symbols": [
				    {
						"name": "Foreign Owned Occulmancy",
						"symbol": "FOO"
				    },{
						"name": "Best American Ricecookers",
						"symbol": "BAR"
				    }
				]
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks')
			.reply(200, data);
			profit.getStocks("EX",function(d) {
				data.code = 200;
				assert.deepEqual(d,data);
				done();
			});
		});

		it('should handle 404', function(done){
			var data = {
				"ok": true,
				"error": "No venue exists with the symbol EX"
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks')
			.reply(404, data);
			profit.getStocks("EX",function(d) {
				data.code = 404;
				assert.deepEqual(d, data);
				done();
			});
		});
	});

	describe('Stock Order Book Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"venue": "EX",
				"symbol": "FAC",
				"bids": [
					{
						"price": 5200,
						"qty": 1,
						"isBuy": true
					},{
						"price": 5100,
						"qty": 1,
						"isBuy": true
					}
				],
				"asks": [
					{
						"price": 5100,
						"qty": 1,
						"isBuy": false
					},{
						"price": 5200,
						"qty": 1,
						"isBuy": false
					}
				],
				"ts": "2015-12-04T09:02:16.680986205Z"
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks/FAC')
			.reply(200, data);

			profit.getStock("EX", "FAC", function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 404', function(done){
			var data = {
				"ok": false,
				"error":  "symbol FAC does not exist on venue EX"
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks/FAC')
			.reply(404, data);
			profit.getStock("EX","FAC",function(d) {
				data.code = 404;
				assert.deepEqual(d, data);
				done();
			});
		});
	});

	describe('Post Stock Order Tests', function(){
		it('should handle 200 order successful', function(done){
			var submitData = {
				account: "OGB12345",
				venue: "EX",
				stock: "FAC",
				price: 5100,
				qty: 100,
				direction: "buy",
				orderType: "limit"
			};
			var responseData = {
				"ok": true,
				"symbol": "FAC",
				"venue": "EX",
				"direction": "buy",
				"originalQty": 100,
				"qty": 20,   // quantity outstanding
				"price":  5100,
				"type": "limit",
				"id": 12345, // unique to venue
				"account": "OGB12345",
				"ts": "2015-07-05T22:16:18+00:00",
				"fills":
				[
					{
						"price": 5050,
						"qty": 80,
						"ts": "2015-07-05T22:16:18+00:00"
					}
				],
				"totalFilled": 80,
				"open": true
			};
			nock('https://www.stockfighter.io')
			.post('/ob/api/venues/EX/stocks/FAC/orders', submitData)
			.reply(200, responseData);

			profit.postOrder(submitData, function(d) {
				responseData.code = 200;
				assert.deepEqual(d, responseData);
				done();
			});
		});

		it('should handle 200 invalid order', function(done){
			var submitData = {
				venue: "EX",
				stock: "FAC",
				orderType: "BAD ORDER"
			};
			var responseData = {
				"ok": false,
				"error": "A descriptive error message telling you " +
					"that the order you attempted to place was invalid " +
					"and not processed by the stock exchange."
			};
			nock('https://www.stockfighter.io')
			.post('/ob/api/venues/EX/stocks/FAC/orders', submitData)
			.reply(200, responseData);

			profit.postOrder(submitData, function(d) {
				responseData.code = 200;
				assert.deepEqual(d, responseData);
				done();
			});
		});

		it('should handle 400 order mismatch', function(){
			// This cannot be tested because the wrapper
			// ensures the URL matches the request body.
			assert(true);
		});
	});

	describe('Stock Quote Tests', function(){
		it('should handle 200', function(done){
			var data = {
			    "ok": true,
			    "symbol": "FAC",
			    "venue": "OGEX",
			    "bid": 5100,
			    "ask": 5125,
			    "bidSize": 392,
			    "askSize": 711,
			    "bidDepth": 2748,
			    "askDepth": 2237,
			    "last": 5125,
			    "lastSize": 52,
			    "lastTrade": "2015-07-13T05:38:17.33640392Z",
			    "quoteTime": "2015-07-13T05:38:17.33640392Z"
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks/FAC/quote')
			.reply(200, data);

			profit.getQuote("EX", "FAC", function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 404', function(done){
			var data = {
				"ok": false,
				"error": "symbol FAC does not exist on venue EX"
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks/FAC/quote')
			.reply(404, data);
			profit.getQuote("EX","FAC",function(d) {
				data.code = 404;
				assert.deepEqual(d, data);
				done();
			});
		});
	});

	describe('Single Order Status Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"symbol": "FAC",
				"venue": "EX",
				"direction": "buy",
				"originalQty": 85,
				"qty": 40,
				"price": 993,
				"orderType": "immediate-or-cancel",
				"id": 1,
				"account": "FOO123",
				"ts": "2015-08-10T16:10:32.987288+09:00",
				"fills": [
					{
						"price": 366,
						"qty": 45,
						"ts": "2015-08-10T16:10:32.987292+09:00"
					}
				],
				"totalFilled": 85,
				"open": true
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks/FAC/orders/1')
			.reply(200, data);

			profit.getOrder("EX", "FAC", 1, function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 401', function(done){
			var data = {
				"ok": false,
				"error": "You are not authorized to view that order's details."
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/stocks/FAC/orders/1')
			.reply(401, data);
			profit.getOrder("EX", "FAC", 1, function(d) {
				data.code = 401;
				assert.deepEqual(d, data);
				done();
			});
		});
	});

	describe('Delete Order Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"symbol": "FAC",
				"venue": "EX",
				"direction": "buy",
				"originalQty": 85,
				"qty": 0,
				"price": 993,
				"orderType": "immediate-or-cancel",
				"id": 1,
				"account": "FOO123",
				"ts": "2015-08-10T16:10:32.987288+09:00",
				"fills": [
					{
						"price": 366,
						"qty": 45,
						"ts": "2015-08-10T16:10:32.987292+09:00"
					}
				],
				"totalFilled": 85,
				"open": false
			};
			nock('https://www.stockfighter.io')
			.delete('/ob/api/venues/EX/stocks/FAC/orders/1')
			.reply(200, data);

			profit.deleteOrder("EX", "FAC", 1, function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 401', function(done){
			var data = {
				"ok": false,
				"error": "Not authorized to delete that order.  You have to own account FOO123."
			};
			nock('https://www.stockfighter.io')
			.delete('/ob/api/venues/EX/stocks/FAC/orders/1')
			.reply(401, data);
			profit.deleteOrder("EX", "FAC", 1, function(d) {
				data.code = 401;
				assert.deepEqual(d, data);
				done();
			});
		});
	});

	describe('All Order Status Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"venue": "EX",
				orders: [
				{
				"symbol": "ROBO",
				"venue": "EX",
				"direction": "buy",
				"originalQty": 85,
				"qty": 40,
				"price": 993,
				"orderType": "immediate-or-cancel",
				"id": 1,
				"account": "FOO123",
				"ts": "2015-08-10T16:10:32.987288+09:00",
				"fills": [
					{
						"price": 366,
						"qty": 45,
						"ts": "2015-08-10T16:10:32.987292+09:00"
					}
				],
				"totalFilled": 85,
				"open": true
				},
				]
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/accounts/FOO123/orders')
			.reply(200, data);

			profit.getOrders("EX", "FOO123", function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 401', function(done){
			var data = {
				"ok": false,
				"error": "You are not authorized to view that order's details."
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/accounts/FOO123/orders')
			.reply(401, data);
			profit.getOrders("EX", "FOO123", function(d) {
				data.code = 401;
				assert.deepEqual(d, data);
				done();
			});
		});
	});

	describe('All Stock Order Status Tests', function(){
		it('should handle 200', function(done){
			var data = {
				"ok": true,
				"venue": "EX",
				orders: [
				{
				"symbol": "FAC",
				"venue": "EX",
				"direction": "buy",
				"originalQty": 85,
				"qty": 40,
				"price": 993,
				"orderType": "immediate-or-cancel",
				"id": 1,
				"account": "FOO123",
				"ts": "2015-08-10T16:10:32.987288+09:00",
				"fills": [
					{
						"price": 366,
						"qty": 45,
						"ts": "2015-08-10T16:10:32.987292+09:00"
					}
				],
				"totalFilled": 85,
				"open": true
				},
				]
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/accounts/FOO123/stocks/FAC/orders')
			.reply(200, data);

			profit.getStockOrders("EX", "FOO123", "FAC", function(d) {
				data.code = 200;
				assert.deepEqual(d, data);
				done();
			});
		});

		it('should handle 401', function(done){
			var data = {
				"ok": false,
				"error": "You are not authorized to view that order's details."
			};
			nock('https://www.stockfighter.io')
			.get('/ob/api/venues/EX/accounts/FOO123/stocks/FAC/orders')
			.reply(401, data);
			profit.getStockOrders("EX", "FOO123", "FAC", function(d) {
				data.code = 401;
				assert.deepEqual(d, data);
				done();
			});
		});
	});
});