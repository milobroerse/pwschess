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

  validMove: computed('move', 'boardArray', 'fenInfo',function(){
    var fenInfo = get(this, 'fenInfo');
    console.log(fenInfo);
    var mv = get(this,'move');
    var valid = false;
    if(mv && mv.length > 3){
      var b = get(this,'boardArray');
      mv = mv.toLowerCase();
      var uci = mv.split('');
      var res = [];

      res[0] = uci[0] + uci[1];
      res[1] = uci[2] + uci[3];
      res[2] = uci[4];

      var fromIndex = this.algebraicToIndex(res[0]);
      var toIndex = this.algebraicToIndex(res[1]);
      var ply = b[fromIndex];
      if(fenInfo.ToMove === 'w' && this.isBlack(b[fromIndex])){
        return false;
      }
      if(fenInfo.ToMove === 'b' && this.isWhite(b[fromIndex])){
        return false;
      }
      if(uci[3] < 1 || uci[3] > 8){
        return false;
      }

      //white pawn check
      if(ply === 'P'){
        // e2e3
        if(fromIndex - toIndex === 8 && this.isEmpty(b[toIndex])){
          valid = true;
        }
        // e2e4
        if(uci[1] == '2' && fromIndex - toIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex-8])){
          valid = true;
        }
        // e4d5
        if((fromIndex - toIndex === 9  || fromIndex - toIndex === 7) && this.isBlack(b[toIndex]) && uci[3]-uci[1] === 1) {
          valid = true;
        }
        // e5d6
        if((fromIndex - toIndex === 9 || fromIndex - toIndex === 7) && this.isEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          if(fenInfo.EnPassant === res[1]){
            valid = true;
          }
        }
        // e7e8 || e7d8
        if(uci[3] == 8 && valid === true){
          valid = false;
          if(res[2] === 'n' || res[2] === 'b'|| res[2] === 'r'|| res[2] === 'q'){
            valid = true;
          }
        }
      }

      //black pawn check
      if(ply === 'p'){
        // d7d6
        if(toIndex - fromIndex === 8 && this.isEmpty(b[toIndex])){
          valid = true;
        }
        // d7d5
        if(uci[1] == '7' && toIndex - fromIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex+8])){
          valid = true;
        }
        // d5e4
        if((toIndex - fromIndex === 9  || toIndex - fromIndex === 7) && this.isWhite(b[toIndex]) && uci[3]-uci[1] === -1) {
          valid = true;
        }
        // d4e3
        if((toIndex - fromIndex === 9  || toIndex - fromIndex === 7) && this.isEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          if(fenInfo.EnPassant === res[1]){
          valid = true;
          }
        }
        // d2d1 || d2e1
        if(uci[3] == 1 && valid === true){
          valid = false;
          if(res[2] === 'n' || res[2] === 'b'|| res[2] === 'r'|| res[2] === 'q'){
            valid = true;
          }
        }
      }

      //white knight check all jumps
      if(ply === 'N'){
        if((toIndex - fromIndex === -17 ||  toIndex - fromIndex === -15) && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === 2){
          valid = true;
        }
        if((toIndex - fromIndex === 17 ||  toIndex - fromIndex === 15)  && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === -2){
          valid = true;
        }
        if((toIndex - fromIndex === -6 ||  toIndex - fromIndex === -10)  && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          valid = true;
        }
        if((toIndex - fromIndex === 6 ||  toIndex - fromIndex === 10)  && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          valid = true;
        }
      }

      //black knight check all jumps
      if(ply === 'n'){
        if((toIndex - fromIndex === -17 ||  toIndex - fromIndex === -15) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === 2){
          valid = true;
          console.log('true13');
        }
        if((toIndex - fromIndex === 17 ||  toIndex - fromIndex === 15) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === -2){
          valid = true;
          console.log('true14');
        }
        if((toIndex - fromIndex === -6 ||  toIndex - fromIndex === -10) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          valid = true;
          console.log('true15');
        }
        if((toIndex - fromIndex === 6 ||  toIndex - fromIndex === 10) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          valid = true;
          console.log('true16');
        }
      }
      //white king check
      if(ply === 'K'){
        if((toIndex - fromIndex === -9 ||  toIndex - fromIndex === -8 || toIndex - fromIndex === -7) && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          valid = true;
        }
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 8 || toIndex - fromIndex === 7) && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          valid = true;
        }
        if(toIndex - fromIndex === 1 && this.isBlackOrEmpty(b[toIndex]) && this.uciToNumber(uci[2])-this.uciToNumber(uci[0]) === 1){
          valid = true;
        }
        if(toIndex - fromIndex === -1 && this.isBlackOrEmpty(b[toIndex]) && this.uciToNumber(uci[2])-this.uciToNumber(uci[0]) === -1){
          valid = true;
        }
      }
      //black king check
      if(ply === 'k'){
        if((toIndex - fromIndex === -9 ||  toIndex - fromIndex === -8 || toIndex - fromIndex === -7) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          valid = true;
        }
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 8 || toIndex - fromIndex === 7) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          valid = true;
        }
        if(toIndex - fromIndex === 1 && this.isWhiteOrEmpty(b[toIndex]) && this.uciToNumber(uci[2])-this.uciToNumber(uci[0]) === 1){
          valid = true;
        }
        if(toIndex - fromIndex === -1 && this.isWhiteOrEmpty(b[toIndex]) && this.uciToNumber(uci[2])-this.uciToNumber(uci[0]) === -1){
          valid = true;
        }
      }
    }

    return valid;
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

  isEmpty(ply){
    return ply === 1;
  },

  isBlack(ply){
    if(ply === 'p' ||ply === 'n' ||ply === 'b'||ply === 'r'||ply === 'q'||ply === 'k'){
      return true;
    } else{
      return false;
    }
  },

  isBlackOrEmpty(ply){
   return this.isBlack(ply) || ply === 1;
  },

  isWhite(ply){
    if(ply === 'P' ||ply === 'N' ||ply === 'B'||ply === 'R'||ply === 'Q'||ply === 'K'){
      return true;
    } else{
      return false;
    }
  },

  isWhiteOrEmpty(ply){
   return this.isWhite(ply) || ply === 1;
  },

  uciToNumber(uci){
     return uci.toLowerCase().charCodeAt(0) - 96;

  },

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
    var x = this.uciToNumber(ply[0]);
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
