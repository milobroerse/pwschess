"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,i,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var r=Ember.Application.extend({modulePrefix:n.default.modulePrefix,podModulePrefix:n.default.podModulePrefix,Resolver:i.default});(0,t.default)(r,n.default.modulePrefix),e.default=r}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var i=function(){return function(e,i){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,i){var t=[],n=!0,r=!1,o=void 0
try{for(var s,a=e[Symbol.iterator]();!(n=(s=a.next()).done)&&(t.push(s.value),!i||t.length!==i);n=!0);}catch(e){r=!0,o=e}finally{try{!n&&a.return&&a.return()}finally{if(r)throw o}}return t}(e,i)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()
e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",lastPosWK:60,lastPosBK:4,indexLookup:Object.freeze(["a8","b8","c8","d8","e8","f8","g8","h8","a7","b7","c7","d7","e7","f7","g7","h7","a6","b6","c6","d6","e6","f6","g6","h6","a5","b5","c5","d5","e5","f5","g5","h5","a4","b4","c4","d4","e4","f4","g4","h4","a3","b3","c3","d3","e3","f3","g3","h3","a2","b2","c2","d2","e2","f2","g2","h2","a1","b1","c1","d1","e1","f1","g1","h1"]),algebraicLookup:Object.freeze({a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:8,b7:9,c7:10,d7:11,e7:12,f7:13,g7:14,h7:15,a6:16,b6:17,c6:18,d6:19,e6:20,f6:21,g6:22,h6:23,a5:24,b5:25,c5:26,d5:27,e5:28,f5:29,g5:30,h5:31,a4:32,b4:33,c4:34,d4:35,e4:36,f4:37,g4:38,h4:39,a3:40,b3:41,c3:42,d3:43,e3:44,f3:45,g3:46,h3:47,a2:48,b2:49,c2:50,d2:51,e2:52,f2:53,g2:54,h2:55,a1:56,b1:57,c1:58,d1:59,e1:60,f1:61,g1:62,h1:63}),pointsHash:Object.freeze({1:0,p:100,n:300,b:300,r:500,q:900,k:0,P:-100,N:-300,B:-300,R:-500,Q:-900,K:0}),grid:Object.freeze({p:[[7],[8,16],[9]],P:[[-7],[-8,-16],[-9]],n:[[17],[15],[10],[6],[-6],[-10],[-15],[-17]],b:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63]],r:[[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],q:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63],[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],k:[[9],[8],[7],[1,2],[-1,-2],[-7],[-8],[-9]]}),board:Ember.computed(function(){var e=[],i=void 0,t=void 0
for(i=0;i<4;i++){for(t=0;t<4;t++)e.push("tile white"),e.push("tile black")
for(t=0;t<4;t++)e.push("tile black"),e.push("tile white")}return e}),boardArray:Ember.computed("fen",function(){var e=this.fen.toString(),i=[],t=void 0,n=0,r=(e=(e=e.replace(/ .+$/,"")).replace(/\//g,"")).length
for(t=0;t<r;t++){var o=e[t]
if(isNaN(o))i[n]=o,n++
else{var s=void 0,a=Number(o)
for(s=0;s<a;s++)i[n]=1,n++}}if(64!==n){var l=void 0
for(i=[],l=0;l<64;l++)i[l]=1}return i}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=this.move,i=JSON.parse(JSON.stringify(this.fenInfo)),t=this.boardArray.toArray(),n=this.mvToMoveObject(i,e,t)
return this.checkValid(n)}),tiles:Ember.computed("board","boardArray",function(){var e=this.board.toArray(),i=this.boardArray.toArray(),t=void 0,n=[]
for(t=0;t<i.length;t++){var r=i[t]
n[t]=1!==r?{class:e[t]+" "+this.fenToMbn(r),index:t}:{class:e[t],index:t}}return n}),fenInfo:Ember.computed("fen",function(){var e=this.fen.toString()
if(e){var i=e,t=(e=e.replace(/^.+? /,"")).split(" ")
if(5==t.length){var n=t[2]
return n=n.replace(/-/g,""),{FenTrue:!0,Fen:i,ToMove:t[0],CastlingWk:t[1].includes("K"),CastlingWq:t[1].includes("Q"),CastlingBk:t[1].includes("k"),CastlingBq:t[1].includes("q"),EnPassant:n}}}return{FenTrue:!1}}),checkValid:function(e){var t=this.checkMove(e,e.fromIndex,e.toIndex)
if(t){var n=this.makeMove(e,e.b),r=i(n,2),o=r[0],s=r[1],a=!1
if("w"===o.ToMove){var l=s.length
if("k"!==s[this.lastPosBK]){var f=void 0
for(f=0;f<l;f++)if("k"===s[f]){o.toIndex=f,this.lastPosBK=f,a=!0
break}}else o.toIndex=this.lastPosBK,a=!0
if(a){var d=void 0
for(d=0;d<l;d++)if(this.isWhite(s[d])&&(this.checkMove(o,d,o.toIndex)&&(t=!1),o.CastlingCheck)){var c=5
2===o.toIndex&&(c=3),o.valid=!0,this.checkMove(o,o.fromIndex,c)&&(t=!1),c=4,o.valid=!0,this.checkMove(o,o.fromIndex,c)&&(t=!1)}}}else{var u=s.length
if("K"!==s[this.lastPosWK]){var p=void 0
for(p=0;p<u;p++)"K"===s[p]&&(o.toIndex=p,this.lastPosWK=p,a=!0)}else o.toIndex=this.lastPosWK,a=!0
if(a){var h=void 0
for(h=0;h<u;h++)if(this.isBlack(s[h])&&(this.checkMove(o,h,o.toIndex)&&(t=!1),o.CastlingCheck)){var v=61
58===o.toIndex&&(v=59),o.valid=!0,this.checkMove(o,o.fromIndex,v)&&(t=!1),v=60,o.valid=!0,this.checkMove(o,o.fromIndex,v)&&(t=!1)}}}}return t},checkMove:function(e,i,t){var n=!1
if(e.valid){var r=e.piecePromotion,o=e.b,s=[]
s[0]=i%8+1,s[1]=8-Math.floor(i/8),s[2]=t%8+1,s[3]=8-Math.floor(t/8)
var a=o[i]
if("w"===e.ToMove&&this.isBlack(o[i]))return!1
if("b"===e.ToMove&&this.isWhite(o[i]))return!1
if(s[3]<1||s[3]>8)return!1
if(this.isWhite(a)){if("P"===a)return!("2"!=s[1]||i-t!=16||!this.isEmpty(o[t])||!this.isEmpty(o[i-8]))||(!(i-t!=9&&i-t!=7||!this.isEmpty(o[t])||s[3]-s[1]!=1||this.algebraicLookup[e.EnPassant]!==t)||(i-t!=9&&i-t!=7||!this.isBlack(o[t])||s[3]-s[1]!=1||(n=!0),i-t==8&&this.isEmpty(o[t])&&(n=!0),!0===n&&8===s[3]?"n"===r||"b"===r||"r"===r||"q"===r:n))
if("N"===a){if((t-i==-17||t-i==-15)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==2)return!0
if((t-i==17||t-i==15)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==-2)return!0
if((t-i==-6||t-i==-10)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==1)return!0
if((t-i==6||t-i==10)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==-1)return!0}if("K"===a)if((58===t&&e.CastlingWq&&1===o[57]||62===t&&e.CastlingWk)&&60===i){if(this.lineCheck(i,t,o,a+"0-0")&&this.isEmpty(o[t]))return!0}else if(this.lineCheck(i,t,o,a)&&this.isBlackOrEmpty(o[t]))return!0
if(("Q"===a||"R"===a||"B"===a)&&this.lineCheck(i,t,o,a)&&this.isBlackOrEmpty(o[t]))return!0}if(this.isBlack(a)){if("p"===a)return!("7"!=s[1]||t-i!=16||!this.isEmpty(o[t])||!this.isEmpty(o[i+8]))||(!(t-i!=9&&t-i!=7||!this.isEmpty(o[t])||s[3]-s[1]!=-1||this.algebraicLookup[e.EnPassant]!==t)||(t-i!=9&&t-i!=7||!this.isWhite(o[t])||s[3]-s[1]!=-1||(n=!0),t-i==8&&this.isEmpty(o[t])&&(n=!0),!0===n&&1==s[3]?"n"===r||"b"===r||"r"===r||"q"===r:n))
if("n"===a){if((t-i==-17||t-i==-15)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==2)return!0
if((t-i==17||t-i==15)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==-2)return!0
if((t-i==-6||t-i==-10)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==1)return!0
if((t-i==6||t-i==10)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==-1)return!0}if("k"===a)if((2===t&&e.CastlingBq&&1===o[1]||6===t&&e.CastlingBk)&&4===i){if(this.lineCheck(i,t,o,a+"0-0")&&this.isEmpty(o[t]))return!0}else if(this.lineCheck(i,t,o,a)&&this.isWhiteOrEmpty(o[t]))return!0
if(("q"===a||"r"===a||"b"===a)&&this.lineCheck(i,t,o,a)&&this.isWhiteOrEmpty(o[t]))return!0}}return!1},makeMove:function(e,i){var t=Object.assign({},e),n=Object.assign([],i),r=t.Fen,o=void 0,s=void 0,a=void 0,l=void 0,f=void 0
if(r){var d=r
r=(r=r.replace(/ .+$/,"")).replace(/\//g,""),"w"===(o=(d=d.replace(/^.+? /,"")).split(" "))[0].toLowerCase()?(o[0]="b",t.ToMove="b"):"b"===o[0].toLowerCase()&&(o[0]="w",t.ToMove="w"),s=t.fromIndex,a=t.toIndex,l=t.piecePromotion
var c=[]
c[0]=s%8+1,c[1]=8-Math.floor(s/8),c[2]=a%8+1,c[3]=8-Math.floor(a/8)
var u=n[s]
n[s]=1,n[a]=u,0===t.toIndex&&(o[1]=o[1].replace(/q/,"")),7===t.toIndex&&(o[1]=o[1].replace(/k/,"")),56===t.toIndex&&(o[1]=o[1].replace(/Q/,"")),63===t.toIndex&&(o[1]=o[1].replace(/K/,"")),o[2]="-",this.isWhite(u)&&("K"===u&&(o[1]=o[1].replace(/K/,""),o[1]=o[1].replace(/Q/,""),62===a&&60===s&&(n[63]=1,n[61]="R",t.CastlingCheck=!0),58===a&&60===s&&(n[56]=1,n[59]="R",t.CastlingCheck=!0)),"R"===u&&(56===s&&(o[1]=o[1].replace(/Q/,"")),63===s&&(o[1]=o[1].replace(/K/,""))),"P"===u&&(a<8&&(n[a]=l.toUpperCase()),s-a==16&&(o[2]=this.indexLookup[s-8]),this.algebraicLookup[t.EnPassant]===a&&(n[a+8]=1))),this.isBlack(u)&&("k"===u&&(o[1]=o[1].replace(/k/,""),o[1]=o[1].replace(/q/,""),2===a&&4===s&&(n[0]=1,n[3]="r",t.CastlingCheck=!0),6===a&&4===s&&(n[7]=1,n[5]="r",t.CastlingCheck=!0)),"r"===u&&(0===s&&(o[1]=o[1].replace(/q/,"")),7===s&&(o[1]=o[1].replace(/k/,""))),"p"===u&&(a>55&&(n[a]=l.toLowerCase()),a-s==16&&(o[2]=this.indexLookup[s+8]),this.algebraicLookup[t.EnPassant]===a&&(n[a-8]=1))),o[1]||(o[1]="-"),f=""
var p=0,h=void 0
for(h=0;h<8;h++){var v=0,m=void 0
for(m=0;m<8;m++){var b=n[p]
p++,isNaN(b)?(v&&(f+=v),f+=b,v=0):v++}v&&(f+=v),h<7&&(f+="/")}f=f+" "+o.join(" ")}var x=o[2]
return x=x.replace(/-/g,""),t.b=n,t.Fen=f,t.CastlingWk=o[1].includes("K"),t.CastlingWq=o[1].includes("Q"),t.CastlingBk=o[1].includes("k"),t.CastlingBq=o[1].includes("q"),t.EnPassant=x,[t,n]},lineCheck:function(e,i,t,n){var r=!0,o=e%8,s=Math.floor(e/8),a=i%8,l=Math.floor(i/8),f=Math.abs(o-a),d=Math.abs(s-l)
if(0===f&&0===d)return!1
var c=(i-e)/Math.max(f,d)
if(("Q"===n||"q"===n)&&0!==f&&0!==d&&f!==d)return!1
if(("R"===n||"r"===n)&&0!==f&&0!==d)return!1
if(("B"===n||"b"===n)&&f!==d)return!1
if(("K"===n||"k"===n)&&(f>1||d>1))return!1
if(("K0-0"===n||"k0-0"===n)&&2!==f&&0!==d)return!1
var u=void 0
for(u=e+c;u!==i;u+=c)this.isEmpty(t[u])||(r=!1)
return r},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var i=e.toLowerCase()
return i===e?"b"+i:"w"+i},mvToMoveObject:function(e,i,t){var n=JSON.parse(JSON.stringify(e)),r=!1
if(i&&i.length>3&&i.length<6){r=!0
var o=i.split(""),s=[]
s[0]=o[0]+o[1],s[1]=o[2]+o[3],s[2]=o[4],n.fromIndex=this.algebraicLookup[s[0]],n.toIndex=this.algebraicLookup[s[1]],s[2]&&(n.piecePromotion=s[2].toLowerCase()),n.b=t}return n.valid=r,n},positionalPoints:function(e){var i=0,t=void 0,n=e.b.length,r=[27,28,35,36],o=[0,8,16,24,32,40,48,56],s=[7,15,23,31,39,47,55,63]
for(t=0;t<n;t++)if(i+=this.pointsHash[e.b[t]],this.pointsHash[e.b[t]]&&"1"!==e.b[t])if(e.b[t]===e.b[t].toUpperCase()){if("P"===e.b[t]){r.includes(t)&&(i-=20),t>7&&t<16&&(i-=20),t>15&&t<24&&(i-=10)
var a=t-8
"P"===e.b[a]&&(i+=10)
var l=t-16
"P"===e.b[l]&&(i+=10)
var f=t-9,d=t-7
"P"===e.b[f]&&"P"===e.b[d]&&(i+=10)}"N"===e.b[t]&&(o.includes(t)&&(i+=10),s.includes(t)&&(i+=10))}else{if("p"===e.b[t]){r.includes(t)&&(i+=20),t>39&&t<48&&(i+=20),t>47&&t<56&&(i+=10)
var c=t+8
"P"===e.b[c]&&(i-=10)
var u=t+16
"P"===e.b[u]&&(i-=10)}"n"===e.b[t]&&(o.includes(t)&&(i-=10),s.includes(t)&&(i-=10))}return i},minimax:function(e,t,n,r,o){if(0===t){var s=this.positionalPoints(e)
return{mv:e.mv,points:s}}var a=void 0,l=[],f=e.b.length
for(a=0;a<f;a++)if("b"===e.ToMove){if(this.isBlack(e.b[a])){var d=e.b[a],c=!1
e.fromIndex=a,e.fromIndex>47&&e.fromIndex<56&&"p"===d&&(c=!0)
var u=this.grid[d],p=void 0,h=u.length
for(p=0;p<h;p++){var v=u[p],m=void 0,b=v.length
for(m=0;m<b;m++)if(e.toIndex=a+v[m],e.piecePromotion=c?"q":"",e.valid=!0,this.checkValid(e))e.b[e.toIndex]+""!="K"&&(c?(l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"q"),l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"r"),l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"b"),l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"n")):l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]))
else if(e.b[e.toIndex]+""!="1")break}}}else if(this.isWhite(e.b[a])){var x=e.b[a],g=!1
e.fromIndex=a,"P"!==x?x=x.toLowerCase():e.fromIndex<16&&e.fromIndex>7&&(g=!0)
var k=this.grid[x],y=void 0,P=k.length
for(y=0;y<P;y++){var I=k[y],M=void 0,E=I.length
for(M=0;M<E;M++)if(e.toIndex=a+I[M],e.piecePromotion=g?"q":"",e.valid=!0,this.checkValid(e))e.b[e.toIndex]+""!="k"&&(g?(l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"q"),l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"r"),l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"b"),l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]+"n")):l.push(this.indexLookup[e.fromIndex]+this.indexLookup[e.toIndex]))
else if(e.b[e.toIndex]+""!="1")break}}if(!l.length){if(n){var w=void 0,O=void 0,L=void 0,C=!1
for(O=0;O<e.b.length;O++)"k"===e.b[O]&&(w=O)
for(L=0;L<e.b.length;L++)if(this.isWhite(e.b[L])&&(e.fromIndex=L,e.toIndex=w,e.ToMove="w",e.valid=!0,this.checkValid(e))){console.log("heyaa"),C=!0
break}return C?{mv:"",points:-2e5-t}:{mv:"",points:0}}var B=void 0,T=void 0,j=void 0,W=!1
for(T=0;T<e.b.length;T++)"K"===e.b[T]&&(B=T)
for(j=0;j<e.b.length;j++)if(this.isBlack(e.b[j])&&(e.fromIndex=j,e.toIndex=B,e.ToMove="b",e.valid=!0,this.checkValid(e))){console.log("hoi"),W=!0
break}return W?{mv:"",points:2e5+t}:{mv:"",points:0}}var _=void 0
if(n){var q=-1e6,A="",K=void 0,N=l.length
for(K=0;K<N;K++){var z=l[K],S=z.split(""),R=[]
R[0]=S[0]+S[1],R[1]=S[2]+S[3],R[2]=S[4],e.fromIndex=this.algebraicLookup[R[0]],e.toIndex=this.algebraicLookup[R[1]],e.mv=z,R[2]?e.piecePromotion=R[2]:e.piecePromotion=""
var F=this.makeMove(e,e.b)
_=i(F,1)[0]
var Q=this.minimax(_,t-1,!1,r,o)
if(Q.points>q&&(q=Q.points,A=z),Q.points>r&&(r=Q.points),r>=o)break}return{mv:A,points:q}}var V=1e6,J="",H=void 0,U=l.length
for(H=0;H<U;H++){var D=l[H],G=D.split(""),$=[]
$[0]=G[0]+G[1],$[1]=G[2]+G[3],$[2]=G[4],e.fromIndex=this.algebraicLookup[$[0]],e.toIndex=this.algebraicLookup[$[1]],$[2]?e.piecePromotion=$[2]:e.piecePromotion="",e.mv=D
var X=this.makeMove(e,e.b)
_=i(X,1)[0]
var Y=this.minimax(_,t-1,!0,r,o)
if(Y.points<V&&(V=Y.points,J=D),Y.points<o&&(o=Y.points),r>=o)break}return{mv:J,points:V}},actions:{playMove:function(e,t){var n=this,r=this.move
if(t){var o=this.indexLookup[e]
r.length>2&&(r="",o=""),r+=o,Ember.set(this,"move",r)}var s=JSON.parse(JSON.stringify(this.fenInfo)),a=this.boardArray.toArray(),l=this.mvToMoveObject(s,r,a)
if(this.checkValid(l)){var f=this.makeMove(l,l.b),d=i(f,2),c=d[0],u=d[1]
console.log(c,u),Ember.set(this,"fen",c.Fen),Ember.run.later(function(){var e=n.move,t=JSON.parse(JSON.stringify(n.fenInfo)),r=n.boardArray.toArray(),o=n.mvToMoveObject(t,e,r),s=void 0,a=0
for(s=0;s<r.length;s++)1!==r[s]&&a++
var l=0
l=a>16?4:Math.floor(32/a*1.5),console.log(l)
var f=(new Date).getTime(),d=n.minimax(o,l,!0,-1e6,1e6),c=(new Date).getTime(),u=Math.round((c-f)/100)/10
console.log("Execution time: "+u+" Seconds")
var p=u+" Seconds"
if(Ember.set(n,"executionTime",p),d.points===-1e5-l||d.points===-2e5-l)console.log("End of Game")
else{console.log(d)
var h=d.mv.split(""),v=[]
v[0]=h[0]+h[1],v[1]=h[2]+h[3],v[2]=h[4],o.fromIndex=n.algebraicLookup[v[0]],o.toIndex=n.algebraicLookup[v[1]],v[2]?o.piecePromotion=v[2]:o.piecePromotion=""
var m=n.makeMove(o,o.b),b=i(m,1)[0]
Ember.set(n,"fen",b.Fen),Ember.set(n,"move","")}},500)}}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,i,t){function n(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=i.default.APP.version,o=n.versionOnly||n.hideSha,s=n.shaOnly||n.hideVersion,a=null
return o&&(n.showExtended&&(a=r.match(t.versionExtendedRegExp)),a||(a=r.match(t.versionRegExp))),s&&(a=r.match(t.shaRegExp)),a?a[0]:r}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=n,e.default=Ember.Helper.helper(n)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,i,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=void 0,r=void 0
t.default.APP&&(n=t.default.APP.name,r=t.default.APP.version),e.default={name:"App Version",initialize:(0,i.default)(n,r)}}),define("pwschess/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",i.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("pwschess/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:i.default}}),define("pwschess/initializers/export-application-global",["exports","pwschess/config/environment"],function(e,i){function t(){var e=arguments[1]||arguments[0]
if(!1!==i.default.exportApplicationGlobal){var t
if("undefined"!=typeof window)t=window
else if("undefined"!=typeof global)t=global
else{if("undefined"==typeof self)return
t=self}var n,r=i.default.exportApplicationGlobal
n="string"==typeof r?r:Ember.String.classify(i.default.modulePrefix),t[n]||(t[n]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete t[n]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=t,e.default={name:"export-application-global",initialize:t}}),define("pwschess/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:i.default}}),define("pwschess/resolver",["exports","ember-resolver"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/router",["exports","pwschess/config/environment"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.Router.extend({location:i.default.locationType,rootURL:i.default.rootURL})
t.map(function(){}),e.default=t}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"VWX0p1n2",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","container-fluid"],[9],[0,"\\n  "],[7,"div"],[11,"class","row"],[9],[0,"\\n    "],[7,"div"],[11,"class","column1"],[9],[0,"\\n      "],[1,[27,"input",null,[["type","value","placeholder","class"],["text",[23,["fen"]],"Insert a FEN","form-control"]]],false],[7,"br"],[9],[10],[7,"br"],[9],[10],[0,"\\n      "],[7,"form"],[3,"action",[[22,0,[]],"playMove"],[["on"],["submit"]]],[9],[0,"\\n        "],[1,[27,"input",null,[["class","type","value","placeholder"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],""]]],false],[0,"\\n        "],[7,"button"],[11,"type","submit"],[9],[0,"Move"],[10],[0,"\\n      "],[10],[0,"\\n    "],[10],[0,"\\n    "],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"        "],[7,"div"],[12,"class",[22,1,["class"]]],[3,"action",[[22,0,[]],"playMove",[22,1,["index"]],true]],[9],[0," "],[10],[0,"\\n"]],"parameters":[1]},null],[0,"    "],[10],[0,"\\n    "],[7,"div"],[11,"class","column4"],[9],[0,"\\n      "],[7,"b"],[9],[0,"Execution Time:"],[10],[7,"br"],[9],[10],[0," "],[1,[21,"executionTime"],false],[0,"\\n    "],[10],[0,"\\n    "],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[0,"        "],[7,"b"],[9],[0,"To Move: "],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n        "],[7,"h4"],[9],[0,"Castling Availability"],[10],[0,"\\n        "],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n        "],[7,"b"],[9],[0,"En Passant Target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[0,"    "],[10],[0,"\\n    "],[1,[21,"outlet"],false],[0,"\\n  "],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",i=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),t={default:JSON.parse(unescape(i))}
return Object.defineProperty(t,"__esModule",{value:!0}),t}catch(i){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+54100d0e"})
