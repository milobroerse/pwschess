import Controller from '@ember/controller';
import { computed, get, set} from '@ember/object';
import { later } from '@ember/runloop';

export default Controller.extend({
  queryParams: ['fen'],
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  move: '',
  lastPosWK: 64,
  lastPosBK: 64,

  pointsHash: Object.freeze({
    '1':0,
    'p':100,
    'n':300,
    'b':300,
    'r':500,
    'q':900,
    'k': 0,

    'P':-100,
    'N':-300,
    'B':-300,
    'R':-500,
    'Q':-900,
    'K': 0
  }),

  grid: Object.freeze({
    'p': [
      [7],
      [8,16],
      [9]
    ],
    'P': [
      [-7],
      [-8,-16],
      [-9]
    ],
    'n': [
      [17],
      [15],
      [10],
      [6],
      [-6],
      [-10],
      [-15],
      [-17]
    ],
    'b': [
      [9,18,27,36,45,54,63],
      [7,14,21,28,35,42,49],
      [-7,-14,-21,-28,-35,-42,-49],
      [-9,-18,-27,-36,-45,-54,-63]
    ],
    'r': [
      [8,16,24,32,40,48,56],
      [1,2,3,4,5,6,7],
      [-1,-2,-3,-4,-5,-6,-7],
      [-8,-16,-24,-32,-40,-48,-56]
    ],
    'q': [
      [9,18,27,36,45,54,63],
      [7,14,21,28,35,42,49],
      [-7,-14,-21,-28,-35,-42,-49],
      [-9,-18,-27,-36,-45,-54,-63],

      [8,16,24,32,40,48,56],
      [1,2,3,4,5,6,7],
      [-1,-2,-3,-4,-5,-6,-7],
      [-8,-16,-24,-32,-40,-48,-56]
    ],
    'k': [
      [9],
      [8],
      [7],
      [1,2],
      [-1,-2],
      [-7],
      [-8],
      [-9]
    ]
  }),

  board: computed(function() {
    let b =[];
    let i;
    let j;

    for(i = 0; i < 4; i++){
      for(j = 0; j < 4; j++){
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
    let fen = get(this,'fen').toString();
    let b = [];

    fen = fen.replace(/ .+$/,'');
    fen = fen.replace(/\//g,'');

    let i;
    let index = 0;
    let fenLength = fen.length;
    for(i = 0; i < fenLength; i++){
      let f = fen[i];
      if(isNaN(f)){
        b[index] = f;
        index++;
      } else{
        let j;
        let number = Number(f);
        for(j = 0; j < number; j++){
          b[index] = 1;
          index++;
        }
      }
    }
    if(index !== 64){
      let k;
      b = [];
      for(k = 0; k < 64; k++){
        b[k] = 1;
      }
    }
    return b;
  }),

  validMove: computed('move', 'boardArray', 'fenInfo',function(){
    let mv = get(this,'move');
    let fi = JSON.parse(JSON.stringify(get(this,'fenInfo')));
    let b =  get(this,'boardArray').toArray();
    let moveObject = this.mvToMoveObject(fi, mv, b);

    return this.checkValid(moveObject);
  }),

  tiles: computed('board', 'boardArray', function() {
    let b = get(this,'board').toArray();
    let boardArray = get(this,'boardArray').toArray();
    let i;

    for(i = 0; i < boardArray.length; i++){
      let f = boardArray[i];
      if(f !== 1){
        b[i] = b[i] + ' '  + this.fenToMbn(f);
      }
    }
    return b;
  }),

  fenInfo: computed('fen', function() {
    let fen = get(this,'fen').toString();
    if(fen){
      let orgFen = fen;
      fen = fen.replace(/^.+? /,'');
      let res = fen.split(" ");

        if(res.length == 5){
        let EnPassant = res[2];
        EnPassant = EnPassant.replace(/-/g,'');
        return {
          FenTrue: true,
          Fen: orgFen,
          ToMove: res[0],
          CastlingWk: res[1].includes("K"),
          CastlingWq: res[1].includes("Q"),
          CastlingBk: res[1].includes("k"),
          CastlingBq: res[1].includes("q"),
          EnPassant: EnPassant
        };
      }
    }
    return {FenTrue: false};
  }),

  checkValid(moveObject){
    let valid = false;
    let newMoveObject = this.checkMove(moveObject);
    if(newMoveObject.valid){
      valid = true;
      let afterMoveObject = this.makeMove(moveObject);
      let kf = false;
      if(afterMoveObject.ToMove === 'w'){
        if(afterMoveObject.b[this.lastPosBK] !== 'k');
          let i;
          let afterMoveObjectBLengthI = afterMoveObject.b.length;
          for(i = 0;  i < afterMoveObjectBLengthI; i++){
            if(afterMoveObject.b[i] === 'k'){
              afterMoveObject.toIndex = i;
              this.lastPosBK = i;
              kf = true;
              break;
          } else{
            afterMoveObject.toIndex = this.lastPosBK;
            kf = true;
          }
        }
        if(kf){
          let j;
          let afterMoveObjectBLengthJ = afterMoveObject.b.length;
          for(j = 0;  j < afterMoveObjectBLengthJ; j++){
            if(this.isWhite(afterMoveObject.b[j])){
              afterMoveObject.fromIndex = j;
              let fromNewMoveObjectW = this.checkMove(afterMoveObject);
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
        }
      } else{
        if(afterMoveObject.b[this.lastPosWK] !== 'K'){
          let p;
          let afterMoveObjectBLengthP = afterMoveObject.b.length;
          for( p = 0;  p < afterMoveObjectBLengthP; p++){
            if(afterMoveObject.b[p] === 'K'){
              afterMoveObject.toIndex = p;
              this.lastPosWK = p;
              kf = true;
            }
          }
        } else{
          afterMoveObject.toIndex = this.lastPosWK;
          kf = true;
        }
        if(kf){
          let u;
          let afterMoveObjectBLengthU = afterMoveObject.b.length;
          for(u = 0;  u < afterMoveObjectBLengthU; u++){
            if(this.isBlack(afterMoveObject.b[u])){
              afterMoveObject.fromIndex = u;
              let fromNewMoveObjectB = this.checkMove(afterMoveObject);
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
      }
    } else{
      valid = false;
    }
    return valid;
  },

  checkMove(moveObject){
    let valid = false;
    let mo = JSON.parse(JSON.stringify(moveObject));
    if(mo.valid) {
      let fromIndex = mo.fromIndex;
      let toIndex = mo.toIndex;
      let piecePromotion = mo.piecePromotion;
      let b = mo.b;
      let uci = [];
      uci[0] = (fromIndex % 8) + 1;
      uci[1] = 8 - (Math.floor(fromIndex / 8));
      uci[2] = (toIndex % 8) + 1;
      uci[3] = 8 - (Math.floor(toIndex / 8));
      let piece = b[fromIndex];
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
        if(uci[1] == '2' && fromIndex - toIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex - 8])){
          valid = true;
        }
        //e4d5
        if((fromIndex - toIndex === 9 || fromIndex - toIndex === 7) && this.isBlack(b[toIndex]) && uci[3] - uci[1] === 1) {
          valid = true;
        }
        //e5d6
        if((fromIndex - toIndex === 9 || fromIndex - toIndex === 7) && this.isEmpty(b[toIndex]) && uci[3] - uci[1] === 1){
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
        if(uci[1] == '7' && toIndex - fromIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex + 8])){
          valid = true;
        }
        //d5e4
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 7) && this.isWhite(b[toIndex]) && uci[3] - uci[1] === -1) {
          valid = true;
        }
        //d4e3
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 7) && this.isEmpty(b[toIndex]) && uci[3] - uci[1] === -1){
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
        if((toIndex - fromIndex === -17 || toIndex - fromIndex === -15) && this.isBlackOrEmpty(b[toIndex]) && uci[3] - uci[1] === 2){
          valid = true;
        }
        if((toIndex - fromIndex === 17 || toIndex - fromIndex === 15) && this.isBlackOrEmpty(b[toIndex]) && uci[3] - uci[1] === -2){
          valid = true;
        }
        if((toIndex - fromIndex === -6 || toIndex - fromIndex === -10) && this.isBlackOrEmpty(b[toIndex]) && uci[3] - uci[1] === 1){
          valid = true;
        }
        if((toIndex - fromIndex === 6 || toIndex - fromIndex === 10) && this.isBlackOrEmpty(b[toIndex]) && uci[3] - uci[1] === -1){
          valid = true;
        }
      }
      //black knight check all jumps
      if(piece === 'n'){
        if((toIndex - fromIndex === -17 || toIndex - fromIndex === -15) && this.isWhiteOrEmpty(b[toIndex]) && uci[3] - uci[1] === 2){
          valid = true;
        }
        if((toIndex - fromIndex === 17 || toIndex - fromIndex === 15) && this.isWhiteOrEmpty(b[toIndex]) && uci[3] - uci[1] === -2){
          valid = true;
        }
        if((toIndex - fromIndex === -6 || toIndex - fromIndex === -10) && this.isWhiteOrEmpty(b[toIndex]) && uci[3] - uci[1] === 1){
          valid = true;
        }
        if((toIndex - fromIndex === 6 || toIndex - fromIndex === 10) && this.isWhiteOrEmpty(b[toIndex]) && uci[3] - uci[1] === -1){
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
    mo.valid = valid;
    return mo;
  },
  makeMove(moveObject){
    let mo = JSON.parse(JSON.stringify(moveObject));
    let fen = mo.Fen;
    if(fen){
      //fen--->b
      let info = fen;
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
      let uci = [];
      uci[0] = (fromIndex % 8) + 1;
      uci[1] = 8 - (Math.floor(fromIndex / 8));
      uci[2] = (toIndex % 8) + 1;
      uci[3] = 8 - (Math.floor(toIndex / 8));
      let piece = b[fromIndex];
      b[fromIndex] = 1;
      b[toIndex] = piece;

      if(mo.toIndex === 0){
        extra[1] = extra[1].replace(/q/,'');
      }
      if(mo.toIndex === 7){
        extra[1] = extra[1].replace(/k/,'');
      }
      if(mo.toIndex === 56){
        extra[1] = extra[1].replace(/Q/,'');
      }
      if(mo.toIndex === 63){
        extra[1] = extra[1].replace(/K/,'');
      }
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
        if(fromIndex - toIndex === 16){
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
        if(toIndex - fromIndex === 16){
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
      let loopCount = 0;
      let i;
      for(i = 0; i < 8; i++){
        let tempNumber = 0;
        let p;
        for(p = 0; p < 8; p++){
          let x = b[loopCount];
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
    let EnPassant = extra[2];
    EnPassant = EnPassant.replace(/-/g,'');
    mo.b = b;
    mo.Fen = newfen;
    mo.CastlingWk = extra[1].includes("K");
    mo.CastlingWq = extra[1].includes("Q");
    mo.CastlingBk = extra[1].includes("k");
    mo.CastlingBq = extra[1].includes("q");
    mo.EnPassant =  EnPassant;
    return mo;
  },
  lineCheck(fromIndex, toIndex, b, piece){
    let valid = true;
    let fromX = fromIndex % 8;
    let fromY = Math.floor(fromIndex / 8);
    let toX = toIndex % 8;
    let toY = Math.floor(toIndex / 8);
    // nooit negatief
    let difX = Math.abs(fromX - toX);
    let difY = Math.abs(fromY - toY);
    // neemt de hoogste waarde en daarna berekent de dif.
    let maxXY = Math.max(difX, difY);
    let difMove = toIndex - fromIndex;
    let step = difMove / maxXY;
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
    let j;
    for(j = fromIndex + step; j !== toIndex; j += step){
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
    if(piece === 'p' || piece === 'n' || piece === 'b' || piece === 'r' || piece === 'q' || piece === 'k'){
      return true;
    } else{
      return false;
    }
  },
  isBlackOrEmpty(piece){
   return this.isBlack(piece) || piece === 1;
  },

  isWhite(piece){
    if(piece === 'P' || piece === 'N' || piece === 'B' || piece === 'R' || piece === 'Q' || piece === 'K'){
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
    let code = fen.toLowerCase();
    if(code === fen){
      return 'b' + code;
    } else{
      return 'w' + code;
    }
  },
  algebraicToIndex(alg){
    let piece = alg.split("");
    if (piece.length === 2){
      let x = this.uciToNumber(piece[0]);
      let y = piece[1];
      let index = (8 - y) * 8 + x-1;
      return(index);
    } else{
      return -1;
    }
  },
  indexToAlgebraic(index){
    let t = (index % 8) + 1 ;
    let y = 8 - (Math.floor(index / 8));
    let x = String.fromCharCode(t + 96);
    return(x + y);
  },
  mvToMoveObject(fenInfo, mv, b){
    let mo = JSON.parse(JSON.stringify(fenInfo));
    let valid = false;
    if(mv && mv.length > 3 && mv.length < 6){
      valid = true;
      let uci = mv.split('');
      let res = [];

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

  positionalPoints(moveObject){
    let points = 0;
    let c;
    let moveObjectBLengthC = moveObject.b.length;
    for(c = 0; c < moveObjectBLengthC; c++){
      points = points + this.pointsHash[moveObject.b[c]];

      if(this.pointsHash[moveObject.b[c]]){
        if((c === 8 || c === 9 || c === 10 || c === 11 || c === 12 || c === 13 || c === 14 || c === 15) && (moveObject.b[c] === 'P')){
          points = points - 20;
        }
        if((c === 16 || c === 17 || c === 18 || c === 19 || c === 20 || c === 21 || c === 14 || c === 15) && (moveObject.b[c] === 'P')){
          points = points - 10;
        }
        if((c === 40 || c === 41 || c === 42 || c === 43 || c === 44 || c === 45 || c === 46 || c === 47) && (moveObject.b[c] === 'p')){
          points = points + 10;
        }
        if((c === 48 || c === 49 || c === 50 || c === 51 || c === 52 || c === 53 || c === 54 || c === 55) && (moveObject.b[c] === 'p')){
          points = points + 20;
        }
        if(
        (c === 27 && (moveObject.b[c] === 'p' || moveObject.b[c] === 'P')) ||
        (c === 28 && (moveObject.b[c] === 'p' || moveObject.b[c] === 'P')) ||
        (c === 35 && (moveObject.b[c] === 'p' || moveObject.b[c] === 'P')) ||
        (c === 36 && (moveObject.b[c] === 'p' || moveObject.b[c] === 'P'))){
          if(this.isWhite(moveObject.b[c])) {
            points = points - 25;
          } else {
            points = points + 25;
          }
        }
      }
    }
    return points;
  },

  minimax(moveObject, depth, maximizingPlayer, alpha, beta){
    if(depth === 0){
      var points = this.positionalPoints(moveObject);
      return {
        'mv':moveObject.mv,
        'points': points
        }
    } else{
      let moveObjectBX;
      let validArray = [];
      let z;
      let moveObjectBLengthZ = moveObject.b.length;
      for(z = 0;  z < moveObjectBLengthZ; z++){
        if(moveObject.ToMove === 'b'){
          if(this.isBlack(moveObject.b[z])){
            let gridPiece = moveObject.b[z];
            let promotionFlag = false;
            moveObject.fromIndex = z;
            if(moveObject.fromIndex > 47 && moveObject.fromIndex < 56 && gridPiece === 'p'){
              promotionFlag = true;
            }
            let gridArray = this.grid[gridPiece];
            let gA;
            let gridArrayLength = gridArray.length;
            for(gA = 0; gA < gridArrayLength ; gA++){
              let gridMove = gridArray[gA];
              let gM;
              let gridMoveLength = gridMove.length;
              for(gM = 0; gM < gridMoveLength; gM++){
                moveObject.toIndex = z + gridMove[gM];
                if (promotionFlag){
                  moveObject.piecePromotion = 'q';
                } else {
                  moveObject.piecePromotion = '';
                }
                moveObject.valid = true;
                if(this.checkValid(moveObject)){
                  if(promotionFlag){
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'q');
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'r');
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'b');
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'n');
                  } else{
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex));
                  }
                } else{
                  if(moveObject.b[moveObject.toIndex] + '' !== '1'){
                    break;
                  }
                }
              }
            }
          }
        } else{
          if(this.isWhite(moveObject.b[z])){
            let gridPiece = moveObject.b[z];
            let promotionFlag = false;
            moveObject.fromIndex = z;
            if(gridPiece !== 'P'){
              gridPiece = gridPiece.toLowerCase();
            } else{
              if(moveObject.fromIndex < 16 && moveObject.fromIndex > 7){
                promotionFlag = true;
              }
            }
            let gridArrayW = this.grid[gridPiece];
            let gAW;
            let gridArrayLengthW = gridArrayW.length;
            for(gAW = 0; gAW < gridArrayLengthW; gAW++){
              let gridMoveW = gridArrayW[gAW];
              let gMW;
              let gridMoveLengthW = gridMoveW.length;
              for(gMW = 0; gMW < gridMoveLengthW; gMW++){
                moveObject.toIndex = z + gridMoveW[gMW];
                if (promotionFlag){
                  moveObject.piecePromotion = 'q';
                } else {
                  moveObject.piecePromotion = '';
                }
                moveObject.valid = true;
                if(this.checkValid(moveObject)){
                  if(promotionFlag){
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'q');
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'r');
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'b');
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex) + 'n');
                  } else{
                    validArray.push(this.indexToAlgebraic(moveObject.fromIndex) + this.indexToAlgebraic(moveObject.toIndex));
                  }
                } else{
                  if(moveObject.b[moveObject.toIndex] + '' !== '1'){
                    break;
                  }
                }
              }
            }
          }
        }
      }
      if(maximizingPlayer){
        var pointsMax = -1000000;
        var mvMax = '';
        let v;
        let validArrayLength = validArray.length;
        for(v = 0; v < validArrayLength; v++){
          let arrayMoveMax = validArray[v];
          let uciMax = arrayMoveMax.split('');
          let resMax = [];

          resMax[0] = uciMax[0] + uciMax[1];
          resMax[1] = uciMax[2] + uciMax[3];
          resMax[2] = uciMax[4];

          moveObject.fromIndex = this.algebraicToIndex(resMax[0]);
          moveObject.toIndex = this.algebraicToIndex(resMax[1]);
          moveObject.mv = arrayMoveMax;
          if(resMax[2]){
            moveObject.piecePromotion = resMax[2];
          } else{
            moveObject.piecePromotion = '';
          }
          moveObjectBX = this.makeMove(moveObject);
          let minimaxObjectMax = this.minimax(moveObjectBX, depth - 1, false, alpha, beta);
          if(minimaxObjectMax.points > pointsMax){
            pointsMax = minimaxObjectMax.points;
            mvMax = arrayMoveMax;
          }
          if(minimaxObjectMax.points > alpha){
            alpha = minimaxObjectMax.points;
          }
          if(alpha >= beta){
            break;
          }
        }
        return {
          'mv':mvMax,
          'points':pointsMax
          }
      } else{
        var pointsMin = 1000000;
        var mvMin = '';
        let o;
        let validArrayLengthO = validArray.length;
        for(o = 0; o < validArrayLengthO; o++){
          let arrayMoveMin = validArray[o];
          let uciMin = arrayMoveMin.split('');
          let resMin = [];

          resMin[0] = uciMin[0] + uciMin[1];
          resMin[1] = uciMin[2] + uciMin[3];
          resMin[2] = uciMin[4];

          moveObject.fromIndex = this.algebraicToIndex(resMin[0]);
          moveObject.toIndex = this.algebraicToIndex(resMin[1]);
          if(resMin[2]){
            moveObject.piecePromotion = resMin[2];
          } else{
            moveObject.piecePromotion = '';
          }
          moveObject.mv = arrayMoveMin;
          moveObjectBX = this.makeMove(moveObject);
          let minimaxObjectMin = this.minimax(moveObjectBX, depth - 1, true, alpha, beta);
          if(minimaxObjectMin.points < pointsMin){
            pointsMin = minimaxObjectMin.points;
            mvMin = arrayMoveMin;
          }
          if(minimaxObjectMin.points < beta){
            beta = minimaxObjectMin.points;
          }
          if(alpha >= beta){
            break;
          }
        }
        return {
          'mv':mvMin,
          'points':pointsMin
          }
      }
    }
  },
  actions: {
    playMove() {
      let mv = get(this,'move');
      let fi = JSON.parse(JSON.stringify(get(this,'fenInfo')));
      let b =  get(this,'boardArray').toArray();
      let moveObject = this.mvToMoveObject(fi, mv, b);
      if(this.checkValid(moveObject)){
        let newMoveObject = this.makeMove(moveObject);
        set(this, 'fen', newMoveObject.Fen);
        // Ember Run Later
        later(()=>{
          let mv = get(this,'move');
          let fi = JSON.parse(JSON.stringify(get(this,'fenInfo')));
          let b = get(this,'boardArray').toArray();
          let newMoveObject = this.mvToMoveObject(fi, mv, b);
          let minimaxMove = this.minimax(newMoveObject, 4, true, -1000000, 1000000);
          if(minimaxMove.points === -1000000){
            console.log("x");
          } else{
            console.log(minimaxMove);
            let uci = minimaxMove.mv.split('');
            let res = [];
            res[0] = uci[0] + uci[1];
            res[1] = uci[2] + uci[3];
            res[2] = uci[4];
            newMoveObject.fromIndex = this.algebraicToIndex(res[0]);
            newMoveObject.toIndex = this.algebraicToIndex(res[1]);
            if(res[2]){
              newMoveObject.piecePromotion = res[2];
            } else{
              newMoveObject.piecePromotion = '';
            }
            let newMoveObjectBX = this.makeMove(newMoveObject);
            set(this, 'fen', newMoveObjectBX.Fen);
            set(this, 'move', '');
          }
        },500);
      }
    }
  }
});
