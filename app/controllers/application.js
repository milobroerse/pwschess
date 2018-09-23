import Controller from '@ember/controller';
import { computed } from '@ember/object';


export default Controller.extend({
  queryParams: ['fen'],
  fen: null,

  board: computed(function() {
    var b =[];
    for(var i = 0; i < 4; i ++){
      b.push('tile white');
      b.push('tile black');
      b.push('tile white');
      b.push('tile black');
      b.push('tile white');
      b.push('tile black');
      b.push('tile white');
      b.push('tile black');

      b.push('tile black');
      b.push('tile white');
      b.push('tile black');
      b.push('tile white');
      b.push('tile black');
      b.push('tile white');
      b.push('tile black');
      b.push('tile white');
    }

    return b;
  })
});


// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
