var nock = require('nock');
var assert = require('assert');
var profit = require('../index');

describe('StockFighterApiWrapper', function () {

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
		it('should respond when it alive', function(done){
			nock('https://www.stockfighter.io')
			.get('/ob/api/heartbeat')
			.reply(
				200,
				{
					"ok": true,
					"error": ""
				}
			);
			profit.getAppHeartbeat(function(d) {
				assert.equal(d.ok, true);
				assert.equal(d.code, 200);
				assert.equal(d.error, "")
				done();
			});

		});

		// should send

	});
/*
	describe('#getHeartbeat()', function () {
		it('should return ok when the app is alive', function () {
			var cb = sinon.stub().returns(23);
			profit.setApiKey('2');
			var proxy = profit.getHeartbeat(cb);
			console.log(proxy);
			assert.equal(proxy,23,"should be 23");
		});
	});
*/
});