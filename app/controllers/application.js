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
    let i,j;

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
      let i;
      b = [];
      for(i = 0; i < 64; i++){
        b[i] = 1;
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
          let afterMoveObjectBLength = afterMoveObject.b.length;
          for(i = 0; i < afterMoveObjectBLength; i++){
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
          let i;
          let afterMoveObjectBLength = afterMoveObject.b.length;
          for(i = 0; i < afterMoveObjectBLength; i++){
            if(this.isWhite(afterMoveObject.b[i])){
              afterMoveObject.fromIndex = i;
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
          let i;
          let afterMoveObjectBLength = afterMoveObject.b.length;
          for(i = 0; i < afterMoveObjectBLength; i++){
            if(afterMoveObject.b[i] === 'K'){
              afterMoveObject.toIndex = i;
              this.lastPosWK = i;
              kf = true;
            }
          }
        } else{
          afterMoveObject.toIndex = this.lastPosWK;
          kf = true;
        }
        if(kf){
          let i;
          let afterMoveObjectBLength = afterMoveObject.b.length;
          for(i = 0; i < afterMoveObjectBLength; i++){
            if(this.isBlack(afterMoveObject.b[i])){
              afterMoveObject.fromIndex = i;
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
      if(piece === 'P'){
        if(fromIndex - toIndex === 8 && this.isEmpty(b[toIndex])){
          valid = true;
        }
        if(uci[1] == '2' && fromIndex - toIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex - 8])){
          valid = true;
        }
        if((fromIndex - toIndex === 9 || fromIndex - toIndex === 7) && this.isBlack(b[toIndex]) && uci[3] - uci[1] === 1) {
          valid = true;
        }
        if((fromIndex - toIndex === 9 || fromIndex - toIndex === 7) && this.isEmpty(b[toIndex]) && uci[3] - uci[1] === 1){
          if(this.algebraicToIndex(mo.EnPassant) === toIndex){
            valid = true;
          }
        }
        if(uci[3] === 8 && valid === true){
          valid = false;
          if(piecePromotion === 'n' || piecePromotion === 'b' || piecePromotion === 'r' || piecePromotion === 'q'){
            valid = true;
          }
        }
      }
      if(piece === 'p'){
        if(toIndex - fromIndex === 8 && this.isEmpty(b[toIndex])){
          valid = true;
        }
        if(uci[1] == '7' && toIndex - fromIndex === 16 && this.isEmpty(b[toIndex]) && this.isEmpty(b[fromIndex + 8])){
          valid = true;
        }
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 7) && this.isWhite(b[toIndex]) && uci[3] - uci[1] === -1) {
          valid = true;
        }
        if((toIndex - fromIndex === 9 || toIndex - fromIndex === 7) && this.isEmpty(b[toIndex]) && uci[3] - uci[1] === -1){
          if(this.algebraicToIndex(mo.EnPassant) === toIndex){
          valid = true;
          }
        }
        if(uci[3] == 1 && valid === true){
          valid = false;
          if(piecePromotion === 'n' || piecePromotion === 'b' || piecePromotion === 'r' || piecePromotion === 'q'){
            valid = true;
          }
        }
      }
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
      if(piece === 'Q' || piece === 'R' || piece === 'B'){
        if(this.lineCheck(fromIndex, toIndex, b, piece) && this.isBlackOrEmpty(b[toIndex])){
          valid = true;
        }
      }
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
      if(piece === 'K'){
        extra[1] = extra[1].replace(/K/,'');
        extra[1] = extra[1].replace(/Q/,'');
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
      if(piece === 'k'){
        extra[1] = extra[1].replace(/k/,'');
        extra[1] = extra[1].replace(/q/,'');
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
      if(piece === 'R'){
        if(fromIndex === 56){
          extra[1] = extra[1].replace(/Q/,'');
        }
        if(fromIndex === 63){
          extra[1] = extra[1].replace(/K/,'');
        }
      }
      if(piece === 'r'){
        if(fromIndex === 0){
          extra[1] = extra[1].replace(/q/,'');
        }
        if(fromIndex === 7){
          extra[1] = extra[1].replace(/k/,'');
        }
      }
      extra[2] = '-';
      if(piece === 'P'){
        if(toIndex < 8){
          b[toIndex] = piecePromotion.toUpperCase();
        }
        if(fromIndex - toIndex === 16){
          extra[2] = this.indexToAlgebraic(fromIndex - 8);
        }
        if(this.algebraicToIndex(mo.EnPassant) === toIndex){
          b[toIndex + 8] = 1;
        }
      }
      if(piece === 'p'){
        if(toIndex > 55){
          b[toIndex] =  piecePromotion.toLowerCase();
        }
        if(toIndex - fromIndex === 16){
          extra[2] = this.indexToAlgebraic(fromIndex + 8);
        }
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
        let j;
        for(j = 0; j < 8; j++){
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

    let difX = Math.abs(fromX - toX);
    let difY = Math.abs(fromY - toY);

    let maxXY = Math.max(difX, difY);
    let difMove = toIndex - fromIndex;
    let step = difMove / maxXY;
    if(piece === 'Q' || piece === 'q'){
      if(difX !== 0 && difY !== 0 && difX !== difY){
        return false;
      }
    }
    if(piece === 'R' || piece === 'r'){
      if(difX !== 0 && difY !== 0){
        return false;
      }
    }
    if(piece === 'B' || piece === 'b'){
      if(difX !== difY){
        return false;
      }
    }
    if(piece === 'K' || piece === 'k'){
      if(difX > 1 || difY > 1){
        return false;
      }
    }
    if(piece === 'K0-0' || piece === 'k0-0'){
      if(difX !== 2 && difY !== 0){
        return false;
      }
    }
    let i;
    for(i = fromIndex + step; i !== toIndex; i += step){
      if(!this.isEmpty(b[i])){
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
    if(piece.length === 2){
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
    let i;
    let moveObjectBLength = moveObject.b.length;
    for(i = 0; i < moveObjectBLength; i++){
      points = points + this.pointsHash[moveObject.b[i]];
      if(this.pointsHash[moveObject.b[i]]){
        if((i === 8 || i === 9 || i === 10 || i === 11 || i === 12 || i === 13 || i === 14 || i === 15) && (moveObject.b[i] === 'P')){
          points = points - 20;
        }
        if((i === 16 || i === 17 || i === 18 || i === 19 || i === 20 || i === 21 || i === 14 || i === 15) && (moveObject.b[i] === 'P')){
          points = points - 10;
        }
        if((i === 40 || i === 41 || i === 42 || i === 43 || i === 44 || i === 45 || i === 46 || i === 47) && (moveObject.b[i] === 'p')){
          points = points + 10;
        }
        if((i === 48 || i === 49 || i === 50 || i === 51 || i === 52 || i === 53 || i === 54 || i === 55) && (moveObject.b[i] === 'p')){
          points = points + 20;
        }
        if(
        (i === 27 && (moveObject.b[i] === 'p' || moveObject.b[i] === 'P')) ||
        (i === 28 && (moveObject.b[i] === 'p' || moveObject.b[i] === 'P')) ||
        (i === 35 && (moveObject.b[i] === 'p' || moveObject.b[i] === 'P')) ||
        (i === 36 && (moveObject.b[i] === 'p' || moveObject.b[i] === 'P'))){
          if(this.isWhite(moveObject.b[i])) {
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
      let points = this.positionalPoints(moveObject);
      return {
        'mv':moveObject.mv,
        'points': points
        }
    } else{
      let moveObjectBX;
      let validArray = [];
      let i;
      let moveObjectBLength = moveObject.b.length;
      for(i = 0;  i < moveObjectBLength; i++){
        if(moveObject.ToMove === 'b'){
          if(this.isBlack(moveObject.b[i])){
            let gridPiece = moveObject.b[i];
            let promotionFlag = false;
            moveObject.fromIndex = i;
            if(moveObject.fromIndex > 47 && moveObject.fromIndex < 56 && gridPiece === 'p'){
              promotionFlag = true;
            }
            let gridArray = this.grid[gridPiece];
            let j;
            let gridArrayLength = gridArray.length;
            for(j = 0; j < gridArrayLength ; j++){
              let gridMove = gridArray[j];
              let k;
              let gridMoveLength = gridMove.length;
              for(k = 0; k < gridMoveLength; k++){
                moveObject.toIndex = i + gridMove[k];
                if(promotionFlag){
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
          if(this.isWhite(moveObject.b[i])){
            let gridPiece = moveObject.b[i];
            let promotionFlag = false;
            moveObject.fromIndex = i;
            if(gridPiece !== 'P'){
              gridPiece = gridPiece.toLowerCase();
            } else{
              if(moveObject.fromIndex < 16 && moveObject.fromIndex > 7){
                promotionFlag = true;
              }
            }
            let gridArray = this.grid[gridPiece];
            let j;
            let gridArrayLength = gridArray.length;
            for(j = 0; j < gridArrayLength; j++){
              let gridMove = gridArray[j];
              let k;
              let gridMoveLength = gridMove.length;
              for(k = 0; k < gridMoveLength; k++){
                moveObject.toIndex = i + gridMove[k];
                if(promotionFlag){
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
      let points = 1111111;
      if(!validArray.length){
        if(maximizingPlayer){

                  checkMateFlag = true;
                    }
                  }
                }
                if(checkMateFlag){
                  console.log('mat');
                  points = -1000000;
                } else{
                  console.log('pat')
                  points = 0;
            }
          }
        } else{
          let kingPosition,k;
          let checkMateFlag = false;
          for(k = 0; k < moveObject.b.length; k++){
            if(moveObject.b[k] === 'K'){
              kingPosition = k;
            }
          }
          let p;
          for(p = 0; p < moveObject.b.length; p++){
            if(this.isBlack(moveObject.b[p]) && !checkMateFlag){
              moveObject.fromIndex = p;
              moveObject.toIndex = kingPosition;
              moveObject.ToMove = 'b';
              if(this.checkValid(moveObject)){
                checkMateFlag = true;
                  }
                }
              }
              if(checkMateFlag){
                console.log('mat')
                points = 1000000
              } else{
                console.log('pat')
                points = 0;
          }
        }

      if(maximizingPlayer){
        let mv = '';
        let i;
        let validArrayLength = validArray.length;
        for(i = 0; i < validArrayLength; i++){
          let arrayMove = validArray[i];
          let uci = arrayMove.split('');
          let res = [];

          res[1] = uci[2] + uci[3];
          res[0] = uci[0] + uci[1];
          res[2] = uci[4];

          moveObject.fromIndex = this.algebraicToIndex(res[0]);
          moveObject.toIndex = this.algebraicToIndex(res[1]);
          moveObject.mv = arrayMove;
          if(res[2]){
            moveObject.piecePromotion = res[2];
          } else{
            moveObject.piecePromotion = '';
          }
          moveObjectBX = this.makeMove(moveObject);
          let minimaxObject = this.minimax(moveObjectBX, depth - 1, false, alpha, beta);
          if(minimaxObject.points > points){
            points = minimaxObject.points;
            mv = arrayMove;
          }
          if(minimaxObject.points > alpha){
            alpha = minimaxObject.points;
          }
          if(alpha >= beta){
            break;
          }
        }
        return {
          'mv':mv,
          'points':points
          }
      } else{
        let points = 1000000;
        let mv = '';
        let i;
        let validArrayLength = validArray.length;
        for(i = 0; i < validArrayLength; i++){
          let arrayMove = validArray[i];
          let uci = arrayMove.split('');
          let res = [];

          res[0] = uci[0] + uci[1];
          res[1] = uci[2] + uci[3];
          res[2] = uci[4];

          moveObject.fromIndex = this.algebraicToIndex(res[0]);
          moveObject.toIndex = this.algebraicToIndex(res[1]);
          if(res[2]){
            moveObject.piecePromotion = res[2];
          } else{
            moveObject.piecePromotion = '';
          }
          moveObject.mv = arrayMove;
          moveObjectBX = this.makeMove(moveObject);
          let minimaxObject = this.minimax(moveObjectBX, depth - 1, true, alpha, beta);
          if(minimaxObject.points < points){
            points = minimaxObject.points;
            mv = arrayMove;
          }
          if(minimaxObject.points < beta){
            beta = minimaxObject.points;
          }
          if(alpha >= beta){
            break;
          }
        }
        return {
          'mv':mv,
          'points':points
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
