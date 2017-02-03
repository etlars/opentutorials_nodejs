// var sum = function(a, b){
//   return a+b;
// }

var sum = require('./lib/sum');
var cal = require('./lib/calculator');
console.log('sum: ', sum(1,2));
console.log('cal.sum: ', cal.sum(1,2));
console.log('cal.ave: ', cal.ave(1,2));
