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
    var mv = get(this,'move');
    var fi = JSON.parse(JSON.stringify(get(this,'fenInfo')));
    var b =  get(this,'boardArray').toArray();
    var moveObject = this.mvToMoveObject(fi, mv, b);

    return this.checkValid(moveObject);
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
    console.log('fenInfo');
    var fen = get(this,'fen').toString();
    if(fen){
      var orgFen = fen;
      fen = fen.replace(/^.+? /,'');
      var res = fen.split(" ");

      if(res.length == 5){
        var EnPassant = res[2];
        EnPassant = EnPassant.replace(/-/g,'');
        return {FenTrue: true, Fen: orgFen, ToMove: res[0], CastlingWk: res[1].includes("K"), CastlingWq: res[1].includes("Q"),  CastlingBk: res[1].includes("k"),  CastlingBq: res[1].includes("q"), EnPassant: EnPassant};
      }
    }
    return {FenTrue: false};
  }),

  checkValid(moveObject){
    var valid = false;
    var newMoveObject = this.checkMove(moveObject);

    if(newMoveObject.valid){
      valid = true;
      var afterMoveObject = this.makeMove(moveObject);
      if(afterMoveObject.ToMove === 'w'){
        for(var i = 0;  i < afterMoveObject.b.length; i++){
          if(afterMoveObject.b[i] === 'k'){
            afterMoveObject.toIndex = i;
          }
        }
        for(var j = 0;  j < afterMoveObject.b.length; j++){
          if(this.isWhite(afterMoveObject.b[j])){
            afterMoveObject.fromIndex = j;
            var fromNewMoveObjectW = this.checkMove(afterMoveObject);
            if(fromNewMoveObjectW.valid){
              valid = false;
            }
            if(afterMoveObject.CastlingCheck){
              if(afterMoveObject.toIndex === 2){
                fromNewMoveObjectW.toIndex = 3;
              } else{
                fromNewMoveObjectW.toIndex = 5;
              }
              fromNewMoveObjectW.valid = true;
              fromNewMoveObjectW = this.checkMove(fromNewMoveObjectW);            ///////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PAS OP
              if(fromNewMoveObjectW.valid){
                valid = false;
              }
              fromNewMoveObjectW.toIndex = 4;
              fromNewMoveObjectW.valid = true;
              fromNewMoveObjectW = this.checkMove(fromNewMoveObjectW);            ///////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PAS OP
              if(fromNewMoveObjectW.valid){
                valid = false;
              }
            }
          }
        }
      } else{
        for(var p = 0;  p < afterMoveObject.b.length; p++){
          if(afterMoveObject.b[p] === 'K'){
            afterMoveObject.toIndex = p;
          }
        }
        for(var u = 0;  u < afterMoveObject.b.length; u++){
          if(this.isBlack(afterMoveObject.b[u])){
            afterMoveObject.fromIndex = u;
            var fromNewMoveObjectB = this.checkMove(afterMoveObject);
            if(fromNewMoveObjectB.valid){
              valid = false;
            }
            if(afterMoveObject.CastlingCheck){
              if(afterMoveObject.toIndex === 58){
                fromNewMoveObjectB.toIndex = 59;
              } else{
                fromNewMoveObjectB.toIndex = 61;
              }
              fromNewMoveObjectB.valid = true;
              fromNewMoveObjectB = this.checkMove(fromNewMoveObjectB);            ///////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PAS OP
              if(fromNewMoveObjectB.valid){
                valid = false;
              }
              fromNewMoveObjectB.toIndex = 60;
              fromNewMoveObjectB.valid = true;
              fromNewMoveObjectB = this.checkMove(fromNewMoveObjectB);            ///////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PAS OP
              if(fromNewMoveObjectB.valid){
                valid = false;
              }
            }
          }
        }
      }
    } else{
      valid = false;
    }
    return valid;
  },

  checkMove(moveObject){
    var valid = false;
    var mo = JSON.parse(JSON.stringify(moveObject));

    if(mo.valid) {

      var fromIndex = mo.fromIndex;
      var toIndex = mo.toIndex;
      var piecePromotion = mo.piecePromotion;
      var b = mo.b;

      var uci = [];

      uci[0] = (fromIndex % 8) + 1;
      uci[1] = 8 - (Math.floor(fromIndex / 8));
      uci[2] = (toIndex % 8) + 1;
      uci[3] = 8 - (Math.floor(toIndex / 8));

      var piece = b[fromIndex];

      if(mo.ToMove === 'w' && this.isBlack(b[fromIndex])){
        mo.valid = false;
        return mo
      }
      if(mo.ToMove === 'b' && this.isWhite(b[fromIndex])){
        mo.valid = false;
        return mo
      }
      if(uci[3] < 1 || uci[3] > 8){
        mo.valid = false;
        return mo
      }
      // WhitePawnCheck
      if(piece === 'P'){
        //e2e3
        if(fromIndex - toIndex === 8 && this.isEmpty(b[toIndex])){
          valid = true;
        }
        //e2e4
        if(uci[1] == '2' && fromIndex - toIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex-8])){
          valid = true;
        }
        //e4d5
        if((fromIndex - toIndex === 9 || fromIndex - toIndex === 7) && this.isBlack(b[toIndex]) && uci[3]-uci[1] === 1) {
          valid = true;
        }
        //e5d6
        if((fromIndex - toIndex === 9 || fromIndex - toIndex === 7) && this.isEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          if(this.algebraicToIndex(mo.EnPassant) === toIndex){
            valid = true;
          }
        }
        //e7e8 || e7d8
        if(uci[3] == 8 && valid === true){
          valid = false;
          if(piecePromotion === 'n' || piecePromotion === 'b' || piecePromotion === 'r' || piecePromotion === 'q'){
            valid = true;
          }
        }
      }
      // BlackPawnCheck
      if(piece === 'p'){
        // d7d6
        if(toIndex - fromIndex === 8 && this.isEmpty(b[toIndex])){
          valid = true;
        }
        //d7d5
        if(uci[1] == '7' && toIndex - fromIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex+8])){
          valid = true;
        }
        //d5e4
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 7) && this.isWhite(b[toIndex]) && uci[3]-uci[1] === -1) {
          valid = true;
        }
        //d4e3
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 7) && this.isEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          if(this.algebraicToIndex(mo.EnPassant) === toIndex){
          valid = true;
          }
        }
        // d2d1 || d2e1
        if(uci[3] == 1 && valid === true){
          valid = false;
          if(piecePromotion === 'n' || piecePromotion === 'b' || piecePromotion === 'r' || piecePromotion === 'q'){
            valid = true;
          }
        }
      }
      //white knight check all jumps
      if(piece === 'N'){
        if((toIndex - fromIndex === -17 || toIndex - fromIndex === -15) && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === 2){
          valid = true;
        }
        if((toIndex - fromIndex === 17 || toIndex - fromIndex === 15)  && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === -2){
          valid = true;
        }
        if((toIndex - fromIndex === -6 || toIndex - fromIndex === -10)  && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          valid = true;
        }
        if((toIndex - fromIndex === 6 || toIndex - fromIndex === 10)  && this.isBlackOrEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          valid = true;
        }
      }
      //black knight check all jumps
      if(piece === 'n'){
        if((toIndex - fromIndex === -17 || toIndex - fromIndex === -15) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === 2){
          valid = true;
        }
        if((toIndex - fromIndex === 17 || toIndex - fromIndex === 15) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === -2){
          valid = true;
        }
        if((toIndex - fromIndex === -6 || toIndex - fromIndex === -10) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === 1){
          valid = true;
        }
        if((toIndex - fromIndex === 6 || toIndex - fromIndex === 10) && this.isWhiteOrEmpty(b[toIndex]) && uci[3]-uci[1] === -1){
          valid = true;
        }
      }
      //white king check
      if(piece === 'K'){
        if(((toIndex === 58 && mo.CastlingWq) || (toIndex === 62 && mo.CastlingWk)) && fromIndex === 60){
          if(this.lineCheck(fromIndex, toIndex, b, piece + '0-0') && this.isEmpty(b[toIndex])){
            valid = true;
          }
        } else {
          if(this.lineCheck(fromIndex, toIndex, b, piece) && this.isBlackOrEmpty(b[toIndex])){
            valid = true;
          }
        }
      }
      //black king check
      if(piece === 'k'){
        if(((toIndex === 2 && mo.CastlingBq) || (toIndex === 6 && mo.CastlingBk)) && fromIndex === 4){
          if(this.lineCheck(fromIndex, toIndex, b, piece + '0-0') && this.isEmpty(b[toIndex])){
            valid = true;
          }
        } else {
          if(this.lineCheck(fromIndex, toIndex, b, piece) && this.isWhiteOrEmpty(b[toIndex])){
            valid = true;
          }
        }
      }
      //white queen check
      if(piece === 'Q' || piece === 'R' || piece === 'B'){
        if(this.lineCheck(fromIndex, toIndex, b, piece) && this.isBlackOrEmpty(b[toIndex])){
          valid = true;
        }
      }
      //black queen check
      if(piece === 'q' || piece === 'r' || piece === 'b'){
        if(this.lineCheck(fromIndex, toIndex, b, piece) && this.isWhiteOrEmpty(b[toIndex])){
          valid = true;
        }
      }
    }
    //console.log(mo);
    mo.valid = valid;
    return mo;
  },

  makeMove(moveObject){
    var mo= JSON.parse(JSON.stringify(moveObject));
    var fen = mo.Fen;
    if(fen){
      //fen--->b
      var info = fen;
      fen = fen.replace(/ .+$/,'');
      fen = fen.replace(/\//g,'');
      info = info.replace(/^.+? /,'');
      var extra = info.split(" ");

      if(extra[0].toLowerCase() === 'w'){
        extra[0] = 'b';
        mo.ToMove = 'b';
      } else if(extra[0].toLowerCase() === 'b'){
        extra[0] = 'w';
        mo.ToMove = 'w';
      }
      var fromIndex = mo.fromIndex;
      var toIndex = mo.toIndex;
      var piecePromotion = mo.piecePromotion;
      var b = mo.b;

      var uci = [];
      uci[0] = (fromIndex % 8) + 1;
      uci[1] = 8 - (Math.floor(fromIndex / 8));
      uci[2] = (toIndex % 8) + 1;
      uci[3] = 8 - (Math.floor(toIndex / 8));

      var piece = b[fromIndex];
      b[fromIndex] = 1;
      b[toIndex] = piece;

      //CastlingWhite
      if(piece === 'K'){
        //NoCastling
        extra[1] = extra[1].replace(/K/,'');
        extra[1] = extra[1].replace(/Q/,'');
        //Castle
        if(toIndex === 62 && fromIndex === 60){
          b[63] = 1;
          b[61] = 'R';
          mo.CastlingCheck = true;
        }
        if(toIndex === 58 && fromIndex === 60){
          b[56] = 1;
          b[59] = 'R';
          mo.CastlingCheck = true;
        }
      }

      //CastlingBlack
      if(piece === 'k'){
        //NoCastling
        extra[1] = extra[1].replace(/k/,'');
        extra[1] = extra[1].replace(/q/,'');
        //Castle
        if(toIndex === 2 && fromIndex === 4){
          b[0] = 1;
          b[3] = 'r';
          mo.CastlingCheck = true;
        }
        if(toIndex === 6 && fromIndex === 4){
          b[7] = 1;
          b[5] = 'r';
          mo.CastlingCheck = true;
        }
      }

      //RookMoveNoCastlingWhite
      if(piece === 'R'){
        if(fromIndex === 56){
          extra[1] = extra[1].replace(/Q/,'');
        }
        if(fromIndex === 63){
          extra[1] = extra[1].replace(/K/,'');
        }
      }

      //RookMoveNoCastlingBlack
      if(piece === 'r'){
        if(fromIndex === 0){
          extra[1] = extra[1].replace(/q/,'');
        }
        if(fromIndex === 7){
          extra[1] = extra[1].replace(/k/,'');
        }
      }
      extra[2] = '-';

      // WhitePawn
      if(piece === 'P'){
        // WhitePawnPromotion
        if(toIndex < 8){
          b[toIndex] = piecePromotion.toUpperCase();
        }
        //WhitePawnLong
        if(fromIndex-toIndex === 16){
          extra[2] = this.indexToAlgebraic(fromIndex - 8);
        }
        //WhitePawnEP
        if(this.algebraicToIndex(mo.EnPassant) === toIndex){
          b[toIndex + 8] = 1;
        }
      }

      // BlackPawn
      if(piece === 'p'){
        // BlackPawnPromotion
        if(toIndex > 55){
          b[toIndex] =  piecePromotion.toLowerCase();
        }
        // BlackPawnLong
        if(toIndex-fromIndex === 16){
          extra[2] = this.indexToAlgebraic(fromIndex + 8);
        }
        // BlackPawnEP
        if(this.algebraicToIndex(mo.EnPassant) === toIndex){
          b[toIndex - 8] = 1;
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
      newfen = newfen + ' ' + extra.join(' ');
    }
    mo.b = b;
    mo.Fen = newfen;
    return mo;
  },

  lineCheck(fromIndex, toIndex, b, piece){
    var valid = true;
    var fromX = fromIndex % 8;
    var fromY = Math.floor(fromIndex / 8);
    var toX = toIndex % 8;
    var toY = Math.floor(toIndex / 8);

    // nooit negatief
    var difX = Math.abs(fromX - toX);
    var difY = Math.abs(fromY - toY);

    //neemt de hoogste waarde en daarna berekent de dif.
    var maxXY = Math.max(difX, difY);
    var difMove = toIndex - fromIndex;
    var step = difMove / maxXY;

    if(piece === 'Q' || piece === 'q'){
      if(difX !== 0 && difY !== 0 && difX !== difY){
        return false;
      }
    }
    if(piece === 'R'|| piece === 'r'){
      if(difX !== 0 && difY !== 0){
        return false;
      }
    }
    if(piece === 'B'|| piece === 'b'){
      if(difX !== difY){
        return false;
      }
    }
    if(piece === 'K'|| piece === 'k'){
      if(difX > 1 || difY > 1){
        return false;
      }
    }
    if(piece === 'K0-0'|| piece === 'k0-0'){
      if(difX !== 2 && difY !== 0){
        return false;
      }
    }

    for(var j = fromIndex + step; j !== toIndex; j = j + step) {
      if(!this.isEmpty(b[j])){
        valid = false;
      }
    }
    return valid;
  },


  isEmpty(piece){
    return piece === 1;
  },

  isBlack(piece){
    if(piece === 'p' || piece === 'n' || piece === 'b'|| piece === 'r'|| piece === 'q'|| piece === 'k'){
      return true;
    } else{
      return false;
    }
  },

  isBlackOrEmpty(piece){
   return this.isBlack(piece) || piece === 1;
  },

  isWhite(piece){
    if(piece === 'P' || piece === 'N' || piece === 'B'|| piece === 'R'|| piece === 'Q'|| piece === 'K'){
      return true;
    } else{
      return false;
    }
  },

  isWhiteOrEmpty(piece){
   return this.isWhite(piece) || piece === 1;
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
    var piece = alg.split("");
    if (piece.length === 2){
      var x = this.uciToNumber(piece[0]);
      var y = piece[1];
      var index = (8-y)*8+x-1;

      return(index);
    } else{
      return -1;
    }
  },

  indexToAlgebraic(index){
    var t = (index % 8) + 1 ;
    var y = 8 - (Math.floor(index / 8));
    var x = String.fromCharCode(t + 96);
    return(x+y);
  },

  mvToMoveObject(fenInfo, mv, b){
    var mo = JSON.parse(JSON.stringify(fenInfo));
    var valid = false;
    if(mv && mv.length > 3 && mv.length < 6){
      valid = true;
      var uci = mv.split('');
      var res = [];

      res[0] = uci[0] + uci[1];
      res[1] = uci[2] + uci[3];
      res[2] = uci[4];

      mo.fromIndex = this.algebraicToIndex(res[0]);
      mo.toIndex = this.algebraicToIndex(res[1]);
      if(res[2]){
        mo.piecePromotion = res[2].toLowerCase();
      }
      mo.b = b;
    }
    mo.valid = valid;
    return mo;
  },

  actions: {
    playMove() {
      var mv = get(this,'move');
      var fi = JSON.parse(JSON.stringify(get(this,'fenInfo')));
      var b =  get(this,'boardArray').toArray();
      var moveObject = this.mvToMoveObject(fi, mv, b);
      if(this.checkValid(moveObject)){
        var newMoveObject = this.makeMove(moveObject);
        var check = false;
        var newMoveObjectBX;
        while (!check){
          for(var z = 0;  z < newMoveObject.b.length; z++){
            if(this.isBlack(newMoveObject.b[z]) && !check){
              newMoveObject.fromIndex = z;
              if(!check){
                newMoveObject.toIndex = Math.floor(Math.random() * 63);
                if(newMoveObject.fromIndex !== newMoveObject.toIndex){
                  newMoveObject.valid = true;
                  check = this.checkValid(newMoveObject);
                }
              }
            }
          }
        }
        console.log('ok');
        newMoveObjectBX = this.makeMove(newMoveObject);
        set(this, 'fen', newMoveObjectBX.Fen);
        set(this, 'move', '');
      }
    }
  }
});


// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
