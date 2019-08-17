"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,i,t,r){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:i.default});(0,t.default)(n,r.default.modulePrefix),e.default=n}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var i=function(){return function(e,i){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,i){var t=[],r=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(t.push(a.value),!i||t.length!==i);r=!0);}catch(e){n=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(n)throw o}}return t}(e,i)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()
e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",lastPosWK:64,lastPosBK:64,algebraicLookup:Object.freeze({a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:8,b7:9,c7:10,d7:11,e7:12,f7:13,g7:14,h7:15,a6:16,b6:17,c6:18,d6:19,e6:20,f6:21,g6:22,h6:23,a5:24,b5:25,c5:26,d5:27,e5:28,f5:29,g5:30,h5:31,a4:32,b4:33,c4:34,d4:35,e4:36,f4:37,g4:38,h4:39,a3:40,b3:41,c3:42,d3:43,e3:44,f3:45,g3:46,h3:47,a2:48,b2:49,c2:50,d2:51,e2:52,f2:53,g2:54,h2:55,a1:56,b1:57,c1:58,d1:59,e1:60,f1:61,g1:62,h1:63}),pointsHash:Object.freeze({1:0,p:100,n:300,b:300,r:500,q:900,k:0,P:-100,N:-300,B:-300,R:-500,Q:-900,K:0}),grid:Object.freeze({p:[[7],[8,16],[9]],P:[[-7],[-8,-16],[-9]],n:[[17],[15],[10],[6],[-6],[-10],[-15],[-17]],b:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63]],r:[[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],q:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63],[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],k:[[9],[8],[7],[1,2],[-1,-2],[-7],[-8],[-9]]}),board:Ember.computed(function(){var e=[],i=void 0,t=void 0
for(i=0;i<4;i++){for(t=0;t<4;t++)e.push("tile white"),e.push("tile black")
for(t=0;t<4;t++)e.push("tile black"),e.push("tile white")}return e}),boardArray:Ember.computed("fen",function(){var e=this.fen.toString(),i=[],t=void 0,r=0,n=(e=(e=e.replace(/ .+$/,"")).replace(/\//g,"")).length
for(t=0;t<n;t++){var o=e[t]
if(isNaN(o))i[r]=o,r++
else{var a=void 0,s=Number(o)
for(a=0;a<s;a++)i[r]=1,r++}}if(64!==r){var l=void 0
for(i=[],l=0;l<64;l++)i[l]=1}return i}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=this.move,i=JSON.parse(JSON.stringify(this.fenInfo)),t=this.boardArray.toArray(),r=this.mvToMoveObject(i,e,t)
return this.checkValid(r)}),tiles:Ember.computed("board","boardArray",function(){var e=this.board.toArray(),i=this.boardArray.toArray(),t=void 0,r=[]
for(t=0;t<i.length;t++){var n=i[t]
r[t]=1!==n?{class:e[t]+" "+this.fenToMbn(n),index:t}:{class:e[t],index:t}}return r}),fenInfo:Ember.computed("fen",function(){var e=this.fen.toString()
if(e){var i=e,t=(e=e.replace(/^.+? /,"")).split(" ")
if(5==t.length){var r=t[2]
return r=r.replace(/-/g,""),{FenTrue:!0,Fen:i,ToMove:t[0],CastlingWk:t[1].includes("K"),CastlingWq:t[1].includes("Q"),CastlingBk:t[1].includes("k"),CastlingBq:t[1].includes("q"),EnPassant:r}}}return{FenTrue:!1}}),checkValid:function(e){var t=this.checkMove(e,e.fromIndex,e.toIndex)
if(t){var r=this.makeMove(e,e.b),n=i(r,2),o=n[0],a=n[1],s=!1
if("w"===o.ToMove){var l=a.length
if("k"!==a[this.lastPosBK]){var f=void 0
for(f=0;f<l;f++)if("k"===a[f]){o.toIndex=f,this.lastPosBK=f,s=!0
break}}else o.toIndex=this.lastPosBK,s=!0
if(s){var c=void 0
for(c=0;c<l;c++)if(this.isWhite(a[c])&&(this.checkMove(o,c,o.toIndex)&&(t=!1),o.CastlingCheck)){var d=5
2===o.toIndex&&(d=3),o.valid=!0,this.checkMove(o,o.fromIndex,d)&&(t=!1),d=4,o.valid=!0,this.checkMove(o,o.fromIndex,d)&&(t=!1)}}}else{var u=a.length
if("K"!==a[this.lastPosWK]){var h=void 0
for(h=0;h<u;h++)"K"===a[h]&&(o.toIndex=h,this.lastPosWK=h,s=!0)}else o.toIndex=this.lastPosWK,s=!0
if(s){var p=void 0
for(p=0;p<u;p++)if(this.isBlack(a[p])&&(this.checkMove(o,p,o.toIndex)&&(t=!1),o.CastlingCheck)){var v=61
58===o.toIndex&&(v=59),o.valid=!0,this.checkMove(o,o.fromIndex,v)&&(t=!1),v=60,o.valid=!0,this.checkMove(o,o.fromIndex,v)&&(t=!1)}}}}return t},checkMove:function(e,i,t){var r=!1
if(e.valid){var n=e.piecePromotion,o=e.b,a=[]
a[0]=i%8+1,a[1]=8-Math.floor(i/8),a[2]=t%8+1,a[3]=8-Math.floor(t/8)
var s=o[i]
if("w"===e.ToMove&&this.isBlack(o[i]))return!1
if("b"===e.ToMove&&this.isWhite(o[i]))return!1
if(a[3]<1||a[3]>8)return!1
if(this.isWhite(s)){if("P"===s)return!("2"!=a[1]||i-t!=16||!this.isEmpty(o[t])||!this.isEmpty(o[i-8]))||(!(i-t!=9&&i-t!=7||!this.isEmpty(o[t])||a[3]-a[1]!=1||this.algebraicLookup[e.EnPassant]!==t)||(i-t!=9&&i-t!=7||!this.isBlack(o[t])||a[3]-a[1]!=1||(r=!0),i-t==8&&this.isEmpty(o[t])&&(r=!0),!0===r&&8===a[3]?"n"===n||"b"===n||"r"===n||"q"===n:r))
if("N"===s){if((t-i==-17||t-i==-15)&&this.isBlackOrEmpty(o[t])&&a[3]-a[1]==2)return!0
if((t-i==17||t-i==15)&&this.isBlackOrEmpty(o[t])&&a[3]-a[1]==-2)return!0
if((t-i==-6||t-i==-10)&&this.isBlackOrEmpty(o[t])&&a[3]-a[1]==1)return!0
if((t-i==6||t-i==10)&&this.isBlackOrEmpty(o[t])&&a[3]-a[1]==-1)return!0}if("K"===s)if((58===t&&e.CastlingWq&&1===o[57]||62===t&&e.CastlingWk)&&60===i){if(this.lineCheck(i,t,o,s+"0-0")&&this.isEmpty(o[t]))return!0}else if(this.lineCheck(i,t,o,s)&&this.isBlackOrEmpty(o[t]))return!0
if(("Q"===s||"R"===s||"B"===s)&&this.lineCheck(i,t,o,s)&&this.isBlackOrEmpty(o[t]))return!0}if(this.isBlack(s)){if("p"===s)return!("7"!=a[1]||t-i!=16||!this.isEmpty(o[t])||!this.isEmpty(o[i+8]))||(!(t-i!=9&&t-i!=7||!this.isEmpty(o[t])||a[3]-a[1]!=-1||this.algebraicLookup[e.EnPassant]!==t)||(t-i!=9&&t-i!=7||!this.isWhite(o[t])||a[3]-a[1]!=-1||(r=!0),t-i==8&&this.isEmpty(o[t])&&(r=!0),!0===r&&1==a[3]?"n"===n||"b"===n||"r"===n||"q"===n:r))
if("n"===s){if((t-i==-17||t-i==-15)&&this.isWhiteOrEmpty(o[t])&&a[3]-a[1]==2)return!0
if((t-i==17||t-i==15)&&this.isWhiteOrEmpty(o[t])&&a[3]-a[1]==-2)return!0
if((t-i==-6||t-i==-10)&&this.isWhiteOrEmpty(o[t])&&a[3]-a[1]==1)return!0
if((t-i==6||t-i==10)&&this.isWhiteOrEmpty(o[t])&&a[3]-a[1]==-1)return!0}if("k"===s)if((2===t&&e.CastlingBq&&1===o[1]||6===t&&e.CastlingBk)&&4===i){if(this.lineCheck(i,t,o,s+"0-0")&&this.isEmpty(o[t]))return!0}else if(this.lineCheck(i,t,o,s)&&this.isWhiteOrEmpty(o[t]))return!0
if(("q"===s||"r"===s||"b"===s)&&this.lineCheck(i,t,o,s)&&this.isWhiteOrEmpty(o[t]))return!0}}return!1},makeMove:function(e,i){var t=Object.assign({},e),r=Object.assign([],i),n=t.Fen,o=void 0,a=void 0,s=void 0,l=void 0,f=void 0
if(n){var c=n
n=(n=n.replace(/ .+$/,"")).replace(/\//g,""),"w"===(o=(c=c.replace(/^.+? /,"")).split(" "))[0].toLowerCase()?(o[0]="b",t.ToMove="b"):"b"===o[0].toLowerCase()&&(o[0]="w",t.ToMove="w"),a=t.fromIndex,s=t.toIndex,l=t.piecePromotion
var d=[]
d[0]=a%8+1,d[1]=8-Math.floor(a/8),d[2]=s%8+1,d[3]=8-Math.floor(s/8)
var u=r[a]
r[a]=1,r[s]=u,0===t.toIndex&&(o[1]=o[1].replace(/q/,"")),7===t.toIndex&&(o[1]=o[1].replace(/k/,"")),56===t.toIndex&&(o[1]=o[1].replace(/Q/,"")),63===t.toIndex&&(o[1]=o[1].replace(/K/,"")),o[2]="-",this.isWhite(u)&&("K"===u&&(o[1]=o[1].replace(/K/,""),o[1]=o[1].replace(/Q/,""),62===s&&60===a&&(r[63]=1,r[61]="R",t.CastlingCheck=!0),58===s&&60===a&&(r[56]=1,r[59]="R",t.CastlingCheck=!0)),"R"===u&&(56===a&&(o[1]=o[1].replace(/Q/,"")),63===a&&(o[1]=o[1].replace(/K/,""))),"P"===u&&(s<8&&(r[s]=l.toUpperCase()),a-s==16&&(o[2]=this.indexToAlgebraic(a-8)),this.algebraicLookup[t.EnPassant]===s&&(r[s+8]=1))),this.isBlack(u)&&("k"===u&&(o[1]=o[1].replace(/k/,""),o[1]=o[1].replace(/q/,""),2===s&&4===a&&(r[0]=1,r[3]="r",t.CastlingCheck=!0),6===s&&4===a&&(r[7]=1,r[5]="r",t.CastlingCheck=!0)),"r"===u&&(0===a&&(o[1]=o[1].replace(/q/,"")),7===a&&(o[1]=o[1].replace(/k/,""))),"p"===u&&(s>55&&(r[s]=l.toLowerCase()),s-a==16&&(o[2]=this.indexToAlgebraic(a+8)),this.algebraicLookup[t.EnPassant]===s&&(r[s-8]=1))),o[1]||(o[1]="-"),f=""
var h=0,p=void 0
for(p=0;p<8;p++){var v=0,b=void 0
for(b=0;b<8;b++){var m=r[h]
h++,isNaN(m)?(v&&(f+=v),f+=m,v=0):v++}v&&(f+=v),p<7&&(f+="/")}f=f+" "+o.join(" ")}var g=o[2]
return g=g.replace(/-/g,""),t.b=r,t.Fen=f,t.CastlingWk=o[1].includes("K"),t.CastlingWq=o[1].includes("Q"),t.CastlingBk=o[1].includes("k"),t.CastlingBq=o[1].includes("q"),t.EnPassant=g,[t,r]},lineCheck:function(e,i,t,r){var n=!0,o=e%8,a=Math.floor(e/8),s=i%8,l=Math.floor(i/8),f=Math.abs(o-s),c=Math.abs(a-l)
if(0===f&&0===c)return!1
var d=(i-e)/Math.max(f,c)
if(("Q"===r||"q"===r)&&0!==f&&0!==c&&f!==c)return!1
if(("R"===r||"r"===r)&&0!==f&&0!==c)return!1
if(("B"===r||"b"===r)&&f!==c)return!1
if(("K"===r||"k"===r)&&(f>1||c>1))return!1
if(("K0-0"===r||"k0-0"===r)&&2!==f&&0!==c)return!1
var u=void 0
for(u=e+d;u!==i;u+=d)this.isEmpty(t[u])||(n=!1)
return n},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var i=e.toLowerCase()
return i===e?"b"+i:"w"+i},indexToAlgebraic:function(e){var i=e%8+1,t=8-Math.floor(e/8)
return String.fromCharCode(i+96)+t},mvToMoveObject:function(e,i,t){var r=JSON.parse(JSON.stringify(e)),n=!1
if(i&&i.length>3&&i.length<6){n=!0
var o=i.split(""),a=[]
a[0]=o[0]+o[1],a[1]=o[2]+o[3],a[2]=o[4],r.fromIndex=this.algebraicLookup[a[0]],r.toIndex=this.algebraicLookup[a[1]],a[2]&&(r.piecePromotion=a[2].toLowerCase()),r.b=t}return r.valid=n,r},positionalPoints:function(e){var i=0,t=void 0,r=e.b.length,n=[27,28,35,36],o=[0,8,16,24,32,40,48,56],a=[7,15,23,31,39,47,55,63]
for(t=0;t<r;t++)if(i+=this.pointsHash[e.b[t]],this.pointsHash[e.b[t]]&&"1"!==e.b[t])if(e.b[t]===e.b[t].toUpperCase()){if("P"===e.b[t]){n.includes(t)&&(i-=20),t>7&&t<16&&(i-=20),t>15&&t<24&&(i-=10)
var s=t-8
"P"===e.b[s]&&(i+=10)
var l=t-16
"P"===e.b[l]&&(i+=10)
var f=t-9,c=t-7
"P"===e.b[f]&&"P"===e.b[c]&&(i+=10)}"N"===e.b[t]&&(o.includes(t)&&(i+=10),a.includes(t)&&(i+=10))}else{if("p"===e.b[t]){n.includes(t)&&(i+=20),t>39&&t<48&&(i+=20),t>47&&t<56&&(i+=10)
var d=t+8
"P"===e.b[d]&&(i-=10)
var u=t+16
"P"===e.b[u]&&(i-=10)}"n"===e.b[t]&&(o.includes(t)&&(i-=10),a.includes(t)&&(i-=10))}return i},minimax:function(e,t,r,n,o){if(0===t){var a=this.positionalPoints(e)
return{mv:e.mv,points:a}}var s=void 0,l=[],f=e.b.length
for(s=0;s<f;s++)if("b"===e.ToMove){if(this.isBlack(e.b[s])){var c=e.b[s],d=!1
e.fromIndex=s,e.fromIndex>47&&e.fromIndex<56&&"p"===c&&(d=!0)
var u=this.grid[c],h=void 0,p=u.length
for(h=0;h<p;h++){var v=u[h],b=void 0,m=v.length
for(b=0;b<m;b++)if(e.toIndex=s+v[b],e.piecePromotion=d?"q":"",e.valid=!0,this.checkValid(e))e.b[e.toIndex]+""!="K"&&(d?(l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)))
else if(e.b[e.toIndex]+""!="1")break}}}else if(this.isWhite(e.b[s])){var g=e.b[s],x=!1
e.fromIndex=s,"P"!==g?g=g.toLowerCase():e.fromIndex<16&&e.fromIndex>7&&(x=!0)
var k=this.grid[g],y=void 0,P=k.length
for(y=0;y<P;y++){var I=k[y],M=void 0,E=I.length
for(M=0;M<E;M++)if(e.toIndex=s+I[M],e.piecePromotion=x?"q":"",e.valid=!0,this.checkValid(e))e.b[e.toIndex]+""!="k"&&(x?(l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)))
else if(e.b[e.toIndex]+""!="1")break}}if(!l.length){if(r){var T=void 0,w=void 0,O=void 0,C=!1
for(w=0;w<e.b.length;w++)"k"===e.b[w]&&(T=w)
for(O=0;O<e.b.length;O++)if(this.isWhite(e.b[O])&&(e.fromIndex=O,e.toIndex=T,e.ToMove="w",e.valid=!0,this.checkValid(e))){console.log("heyaa"),C=!0
break}return C?{mv:"",points:-2e5-t}:{mv:"",points:0}}var A=void 0,B=void 0,j=void 0,W=!1
for(B=0;B<e.b.length;B++)"K"===e.b[B]&&(A=B)
for(j=0;j<e.b.length;j++)if(this.isBlack(e.b[j])&&(e.fromIndex=j,e.toIndex=A,e.ToMove="b",e.valid=!0,this.checkValid(e))){console.log("hoi"),W=!0
break}return W?{mv:"",points:2e5+t}:{mv:"",points:0}}var _=void 0
if(r){var q=-1e6,K="",L=void 0,N=l.length
for(L=0;L<N;L++){var z=l[L],S=z.split(""),R=[]
R[0]=S[0]+S[1],R[1]=S[2]+S[3],R[2]=S[4],e.fromIndex=this.algebraicLookup[R[0]],e.toIndex=this.algebraicLookup[R[1]],e.mv=z,R[2]?e.piecePromotion=R[2]:e.piecePromotion=""
var F=this.makeMove(e,e.b)
_=i(F,1)[0]
var Q=this.minimax(_,t-1,!1,n,o)
if(Q.points>q&&(q=Q.points,K=z),Q.points>n&&(n=Q.points),n>=o)break}return{mv:K,points:q}}var V=1e6,J="",H=void 0,U=l.length
for(H=0;H<U;H++){var D=l[H],G=D.split(""),$=[]
$[0]=G[0]+G[1],$[1]=G[2]+G[3],$[2]=G[4],e.fromIndex=this.algebraicLookup[$[0]],e.toIndex=this.algebraicLookup[$[1]],$[2]?e.piecePromotion=$[2]:e.piecePromotion="",e.mv=D
var X=this.makeMove(e,e.b)
_=i(X,1)[0]
var Y=this.minimax(_,t-1,!0,n,o)
if(Y.points<V&&(V=Y.points,J=D),Y.points<o&&(o=Y.points),n>=o)break}return{mv:J,points:V}},actions:{playMove:function(e,t){var r=this,n=this.move
if(t){var o=this.indexToAlgebraic(e)
n.length>2&&(n="",o=""),n+=o,Ember.set(this,"move",n)}var a=JSON.parse(JSON.stringify(this.fenInfo)),s=this.boardArray.toArray(),l=this.mvToMoveObject(a,n,s)
if(this.checkValid(l)){var f=this.makeMove(l,l.b),c=i(f,2),d=c[0],u=c[1]
console.log(d,u),Ember.set(this,"fen",d.Fen),Ember.run.later(function(){var e=r.move,t=JSON.parse(JSON.stringify(r.fenInfo)),n=r.boardArray.toArray(),o=r.mvToMoveObject(t,e,n),a=void 0,s=0
for(a=0;a<n.length;a++)1!==n[a]&&s++
var l=0
l=s>16?4:Math.floor(32/s*1.5),console.log(l)
var f=(new Date).getTime(),c=r.minimax(o,l,!0,-1e6,1e6),d=(new Date).getTime(),u=Math.round((d-f)/100)/10
console.log("Execution time: "+u+" Seconds")
var h=u+" Seconds"
if(Ember.set(r,"executionTime",h),c.points===-1e5-l||c.points===-2e5-l)console.log("End of Game")
else{console.log(c)
var p=c.mv.split(""),v=[]
v[0]=p[0]+p[1],v[1]=p[2]+p[3],v[2]=p[4],o.fromIndex=r.algebraicLookup[v[0]],o.toIndex=r.algebraicLookup[v[1]],v[2]?o.piecePromotion=v[2]:o.piecePromotion=""
var b=r.makeMove(o,o.b),m=i(b,1)[0]
Ember.set(r,"fen",m.Fen),Ember.set(r,"move","")}},500)}}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,i,t){function r(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=i.default.APP.version,o=r.versionOnly||r.hideSha,a=r.shaOnly||r.hideVersion,s=null
return o&&(r.showExtended&&(s=n.match(t.versionExtendedRegExp)),s||(s=n.match(t.versionRegExp))),a&&(s=n.match(t.shaRegExp)),s?s[0]:n}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=r,e.default=Ember.Helper.helper(r)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,i,t){Object.defineProperty(e,"__esModule",{value:!0})
var r=void 0,n=void 0
t.default.APP&&(r=t.default.APP.name,n=t.default.APP.version),e.default={name:"App Version",initialize:(0,i.default)(r,n)}}),define("pwschess/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",i.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("pwschess/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:i.default}}),define("pwschess/initializers/export-application-global",["exports","pwschess/config/environment"],function(e,i){function t(){var e=arguments[1]||arguments[0]
if(!1!==i.default.exportApplicationGlobal){var t
if("undefined"!=typeof window)t=window
else if("undefined"!=typeof global)t=global
else{if("undefined"==typeof self)return
t=self}var r,n=i.default.exportApplicationGlobal
r="string"==typeof n?n:Ember.String.classify(i.default.modulePrefix),t[r]||(t[r]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete t[r]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=t,e.default={name:"export-application-global",initialize:t}}),define("pwschess/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:i.default}}),define("pwschess/resolver",["exports","ember-resolver"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/router",["exports","pwschess/config/environment"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Router.extend({location:i.default.locationType,rootURL:i.default.rootURL})
t.map(function(){}),e.default=t}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"VWX0p1n2",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","container-fluid"],[9],[0,"\\n  "],[7,"div"],[11,"class","row"],[9],[0,"\\n    "],[7,"div"],[11,"class","column1"],[9],[0,"\\n      "],[1,[27,"input",null,[["type","value","placeholder","class"],["text",[23,["fen"]],"Insert a FEN","form-control"]]],false],[7,"br"],[9],[10],[7,"br"],[9],[10],[0,"\\n      "],[7,"form"],[3,"action",[[22,0,[]],"playMove"],[["on"],["submit"]]],[9],[0,"\\n        "],[1,[27,"input",null,[["class","type","value","placeholder"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],""]]],false],[0,"\\n        "],[7,"button"],[11,"type","submit"],[9],[0,"Move"],[10],[0,"\\n      "],[10],[0,"\\n    "],[10],[0,"\\n    "],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"        "],[7,"div"],[12,"class",[22,1,["class"]]],[3,"action",[[22,0,[]],"playMove",[22,1,["index"]],true]],[9],[0," "],[10],[0,"\\n"]],"parameters":[1]},null],[0,"    "],[10],[0,"\\n    "],[7,"div"],[11,"class","column4"],[9],[0,"\\n      "],[7,"b"],[9],[0,"Execution Time:"],[10],[7,"br"],[9],[10],[0," "],[1,[21,"executionTime"],false],[0,"\\n    "],[10],[0,"\\n    "],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[0,"        "],[7,"b"],[9],[0,"To Move: "],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n        "],[7,"h4"],[9],[0,"Castling Availability"],[10],[0,"\\n        "],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"En Passant Target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[0,"    "],[10],[0,"\\n    "],[1,[21,"outlet"],false],[0,"\\n  "],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",i=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),t={default:JSON.parse(unescape(i))}
return Object.defineProperty(t,"__esModule",{value:!0}),t}catch(i){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+212c00d6"})
