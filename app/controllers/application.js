import Controller from '@ember/controller';
import { computed, get, set} from '@ember/object';

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

  algebraicToIndex(alg){
    var ply = alg.split("");
    var x = ply[0].toLowerCase().charCodeAt(0) - 96;
    var y = ply[1];
    var index = (8-y)*8+x-1;

    return(index);

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
          var info = fen;
          fen = fen.replace(/ .+$/,'');
          fen = fen.replace(/\//g,'');
          info = info.replace(/^.+? /,'');
          var extra = info.split(" ");
          if(extra[0].toLowerCase() === 'w'){
            extra[0] = 'b';
          } else{
            extra[0] = 'w';
          }

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
          var fromIndex = this.algebraicToIndex(res[0]);
          var toIndex = this.algebraicToIndex(res[1]);
          var ply = b[fromIndex];
          b[fromIndex] = 1;
          b[toIndex] = ply;

          //CastlingWhite
          if(ply === 'K'){
            //NoCastling
            extra[1] = extra[1].replace(/K/,'');
            extra[1] = extra[1].replace(/Q/,'');
            //Castle
            if(toIndex === 62){
                b[63] = 1;
                b[61] = 'R';
            }
            if(toIndex === 58){
              b[56] = 1;
              b[59] = 'R';
            }
          }

          //CastlingBlack
          if(ply === 'k'){
            //NoCastling
            extra[1] = extra[1].replace(/k/,'');
            extra[1] = extra[1].replace(/q/,'');
            //Castle
            if(toIndex === 2){
                b[0] = 1;
                b[3] = 'r';
            }
            if(toIndex === 6){
              b[7] = 1;
              b[5] = 'r';
            }
          }

          //RookMoveNoCastlingWhite
          if(ply === 'R'){
            if(fromIndex === 56){
              extra[1] = extra[1].replace(/Q/,'');

            }
            if(fromIndex === 63){
              extra[1] = extra[1].replace(/K/,'');

            }
          }

          //RookMoveNoCastlingBlack
          if(ply === 'r'){
            if(fromIndex === 0){
              extra[1] = extra[1].replace(/q/,'');

            }
            if(fromIndex === 7){
              extra[1] = extra[1].replace(/k/,'');

            }
          }

          if(!extra[1]){
            extra[1] = '-';

          }
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
          newfen = newfen + ' '+ extra.join(' ');
          console.log(newfen);
          set(this, "fen", newfen);

        }
      }
    }
  }
});


// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
