import Controller from '@ember/controller';
import { computed, get } from '@ember/object';


export default Controller.extend({
  queryParams: ['fen'],
  fen: '',

  board: computed(function() {
    var b =[];

    var i,j;
    for( i = 0; i < 4; i++){
      for( j = 0; j < 4; j++){
        b.push('tile white');
        b.push('tile black');
      }
      for( j = 0; j < 4; j++){
        b.push('tile black');
        b.push('tile white');
      }
    }
    return b;
  }),

  tiles: computed('board', 'fen', function() {
    var b = get(this,'board').toArray();
    var fen = get(this,'fen');
    console.log(fen);
    fen = fen.replace(/ .+$/,'');
    fen = fen.replace(/\//g,'');
    console.log(fen);

    var i;
    var index=0;
    for( i = 0; i < fen.length; i++){
      var f= fen[i];
      if(isNaN(f)){

        b[index] = b[index] + ' '  + this.fenToMbn(f);
        index++;
      } else{
        index = index + Number(f);


      }
    }

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
