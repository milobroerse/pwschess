import Controller from '@ember/controller';
import { computed, get } from '@ember/object';


export default Controller.extend({
  queryParams: ['fen'],
  fen: null,

  board: computed(function() {
    var b =[];

    var i,j;
    for( i = 0; i < 4; i ++){
      for( j = 0; j < 4; j ++){
        b.push('tile white');
        b.push('tile black');
      }
      for( j = 0; j < 4; j ++){
        b.push('tile black');
        b.push('tile white');
      }
    }
    return b;
  }),

  tiles: computed('board', 'fen', function() {
    console.log("papa is dom");
    var b = get(this,'board').toArray();
    b[0] = b[0] + ' '  + this.fenToMbn('r');
    return b;
  }),

  fenToMbn(fen){
    var code = fen.toLowerCase();
    if(code === fen){
      return 'b' + code;
    } else{
      return 'w' + code;
    }
  }
});


// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
