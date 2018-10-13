import Controller from '@ember/controller';
import { computed, get, set} from '@ember/object';

export default Controller.extend({
  queryParams: ['fen'],
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
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
  boardArray: computed('fen', function(){
    var fen = get(this,'fen').toString();
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

    if(index !== 64){
      var k;
      b = [];
      for( k = 0; k < 64; k++){
        b[k] = 1;
      }
    }
    return b;
  }),

  tiles: computed('board', 'boardArray', function() {
    var b = get(this,'board').toArray();
    var boardArray = get(this,'boardArray').toArray();
    var i;

    for( i = 0; i < boardArray.length; i++){
      var f = boardArray[i];
      if(f !== 1){
        b[i] = b[i] + ' '  + this.fenToMbn(f);
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

  indexToAlgebraic(index){
    var t = (index % 8) + 1 ;
    var y = 8 - (Math.floor(index / 8));
    var x = String.fromCharCode(t + 96);
    return(x+y);

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
        var uci = mv.split('');
        var res = [];

        res[0] = uci[0] + uci[1];
        res[1] = uci[2] + uci[3];
        res[2] = uci[4];

        if(fen){
          //fen--->b
          var b = get(this,'boardArray');
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
          extra[2] = '-';


          if(ply === 'P'){
            if(toIndex < 8){
              b[toIndex] = res[2].toUpperCase();
            }
            if(fromIndex-toIndex === 16){
              extra[2] = this.indexToAlgebraic(fromIndex - 8);
            }
          }

          if(ply === 'p'){
            if(toIndex > 55){
              b[toIndex] = res[2].toLowerCase();
            }
            if(toIndex-fromIndex === 16){
              extra[2] = this.indexToAlgebraic(fromIndex + 8);
            }
          }

          if(!extra[1]){
            extra[1] = '-';
          }

          //b--->fen
          var newfen = '';
          var loopCount = 0;
          for(var i = 0; i < 8; i++){
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
          set(this, "fen", newfen);

        }
      }
    }
  }
});


// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
