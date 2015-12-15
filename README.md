# profit

![npm version](https://img.shields.io/npm/v/profit.svg)
![npmp license](https://img.shields.io/npm/l/profit.svg)

profit is a [Stockfighter](https://www.stockfighter.io) API wrapper in node.js.

It currently wraps the Stockfighter REST API, and the unofficial Stockfighter GM REST API. Wrapping for the Websockets API is under development.

# Installation
To add profit to your node project run:

`npm install profit --save`

# Description
profit wraps each Stockfighter API method in a convenient function that takes string arguments as well as a final callback argument to handle the response from the API. The objects in the wrapper responses are identical to the API response, with the addition of the `code` parameter containing the response code.

# Documentation

to use profit in your code, add it with:

`var profit = require("profit");`

For some methods, an API key is required. Stockfighter allows the key to be provided in multiple ways, but profit passes it along via the `X-Starfighter-Authorization` header. It can be set like so:

`profit.setApiKey(API_KEY_GOES_HERE);`

### Get App Heartbeat
```
profit.getAppHeartbeat(function(d){
    console.log(d);
});
```

### Get Venue Heartbeat
```
profit.getHeartbeat(VENUE_NAME, function(d){
    console.log(d);
});
```

### Get Stocks Traded at Venue
```
profit.getStocks(VENUE_NAME, function(d){
    console.log(d);
});
```

### Get Stock Order Book
```
profit.getStock(VENUE_NAME, STOCK_SYMBOL, function(d){
    console.log(d);
});
```

### Submit Order
_Note: This call does not use string arguments like all of the other methods. Instead, you pass along the JSON object required by the Stockfighter API (the object contains the venue and stock symbol information required for the call)._

```
profit.postOrder(ORDER_OBJECT, function(d){
    console.log(d);
});
```

### Get Stock Quote
```
profit.getQuote(VENUE_NAME, STOCK_SYMBOL, function(d){
    console.log(d);
});
```

### Get Order Information
```
profit.getOrder(VENUE_NAME, STOCK_SYMBOL, ORDER_ID, function(d){
    console.log(d);
});
```

### Delete/Cancel Order
```
profit.deleteOrder(VENUE_NAME, STOCK_SYMBOL, ORDER_ID, function(d){
    console.log(d);
});
```

### Get All Orders
```
profit.getOrders(VENUE_NAME, ACCOUNT_ID, function(d){
    console.log(d);
});
```

### Get All Orders for a Stock
```
profit.getStockOrders(VENUE_NAME, ACCOUNT_ID, STOCK_SYMBOL, function(d){
    console.log(d);
});
```

### Start Level
```
profit.startLevel(LEVEL_NUMBER, function(d){
    console.log(d);
});
```

### Restart Level
```
profit.restartLevel(INSTANCE_ID, function(d){
    console.log(d);
});
```

### Stop Level
```
profit.stopLevel(INSTANCE_ID, function(d){
    console.log(d);
});
```

### Resume Level
```
profit.resumeLevel(INSTANCE_ID, function(d){
    console.log(d);
});
```

### Get Level Information
```
profit.getLevel(INSTANCE_ID, function(d){
    console.log(d);
});
```