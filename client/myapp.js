MyApp = (function(){
    var api = {};

    // A private method
    var printNumber = function(n) { console.log(n); };

    // A public method we're putting on the API
    api.printA = function() { printNumber(1111); };

    return api;
}());
