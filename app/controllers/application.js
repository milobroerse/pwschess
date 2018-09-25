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
    var fen = get(this,'fen').toString();

    if(fen){
      fen = fen.replace(/ .+$/,'');
      fen = fen.replace(/\//g,'');

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
      if(index !== 64){
        return get(this,'board').toArray();
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
  },

  fenInfo: computed('fen', function() {
    var fen = get(this,'fen').toString();
    if(fen){
      fen = fen.replace(/^.+? /,'');
      var res = fen.split(" ");

      if(res.length == 5){
        var EnPassant = res[2];
        EnPassant = EnPassant.replace(/-/g,'');
        return {FenTrue: true, ToMove: res[0], CastlingWk: res[1].includes("K"), CastlingWq: res[1].includes("Q"),  CastlingBk: res[1].includes("k"),  CastlingBq: res[1].includes("q"), EnPassant: EnPassant}
      }
    }
    return {FenTrue: false};
  })
});


// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
