var sinon = require('sinon');
var assert = require('assert');
var profit = require('../index');

describe('StockFighterApiWrapper', function () {

	describe('#getHeartbeat()', function () {

		it('should return ok when the app is alive', function () {
			var cb = sinon.stub().returns(23);
			profit.setApiKey('2');
			var proxy = profit.getHeartbeat(cb);
			console.log(proxy);
			assert.equal(proxy,23,"should be 23");
		})
	});

	describe('subtractOne()', function () {

	it('should correctly subtract one from the given number', function () {
	  // assertions here
	})

	})

})