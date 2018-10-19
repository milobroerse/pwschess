// fromIndex = 27
//
// ToIndex = 9   step = -9
// ToIndex = 11  step = -8
// ToIndex = 13  step = -7
// ToIndex = 29  step = 1
// ToIndex = 45  step = +9
// ToIndex = 43  step = +8
// ToIndex = 41  step = +7
// ToIndex = 25  step = -1

var from = 27;
var to = [9,11,13,29,45,43,41,25];

for (var i = 0; i < to.length; i++){
  var t1 = from % 8;
  var t2 = Math.floor(from / 8);
  var t3 = to[i] % 8;
  var t4 = Math.floor(to[i] / 8);

  var t5 = Math.abs(t1 - t3);
  var t6 = Math.abs(t2 - t4);
  var t7 = Math.max(t5, t6);
  var t8 = to[i] - from;
  var step = t8 / t7;
  console.log(to[i] + ' : ' + t1 + ' ' + t2 + ' ' + t3 + ' ' + t4 + ' ' + t5 + ' ' + t6 + ' ' + t7 + ' ' + t8 + ' ' + step);

  for(var j = from + step; j !== to[i]; j = j + step) {
  //  console.log('check : ' + j);
  }
}
