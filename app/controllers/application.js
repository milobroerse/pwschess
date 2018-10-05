import Controller from '@ember/controller';
import { computed, get } from '@ember/object';

export default Controller.extend({
  queryParams: ['fen'],
  fen: '',
  move: '',

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
  }),
  actions: {
    playMove() {
      var mv = get(this,'move');
      var fen = get(this,'fen').toString();
      if(mv){
        console.log(mv);
        var res = mv.split('-');
        console.log(res[0] + ' kippensap '  + res[1]);

        if(fen){
          //fen--->b
          var b = [];
          fen = fen.replace(/ .+$/,'');
          fen = fen.replace(/\//g,'');

          var i;
          var index=0;
          for( i = 0; i < fen.length; i++){
            var f= fen[i];
            if(isNaN(f)){
              b[index] = f;
              index++;
            } else{
              for(var j = 0; j < Number(f); j++){
                b[index] = 1;
                index++;
              }
            }
          }
          console.log(b);
          //b--->fen
          var newfen = '';
          var loopCount = 0;
          for( i = 0; i < 8; i++){
            var tempNumber = 0;
            for(var p = 0; p < 8; p++){
              var x = b[loopCount];
              loopCount++;
              if(isNaN(x)){
                if(tempNumber){
                  newfen = newfen + tempNumber;
                }
                newfen = newfen + x;
                tempNumber = 0;
              } else  {
                tempNumber++;
              }
            }
            if(tempNumber){
              newfen = newfen + tempNumber;
            }
            if(i < 7){
              newfen = newfen + '/';
            }
          }
          console.log(newfen);
        }
      }
    }
  }
});


// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
