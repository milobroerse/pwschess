"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,t,i,r){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:t.default});(0,i.default)(n,r.default.modulePrefix),e.default=n}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
var t=function(){return function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var i=[],r=!0,n=!1,o=void 0
try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(i.push(a.value),!t||i.length!==t);r=!0);}catch(e){n=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(n)throw o}}return i}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()
e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",lastPosWK:64,lastPosBK:64,pointsHash:Object.freeze({1:0,p:100,n:300,b:300,r:500,q:900,k:0,P:-100,N:-300,B:-300,R:-500,Q:-900,K:0}),grid:Object.freeze({p:[[7],[8,16],[9]],P:[[-7],[-8,-16],[-9]],n:[[17],[15],[10],[6],[-6],[-10],[-15],[-17]],b:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63]],r:[[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],q:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63],[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],k:[[9],[8],[7],[1,2],[-1,-2],[-7],[-8],[-9]]}),board:Ember.computed(function(){var e=[],t=void 0,i=void 0
for(t=0;t<4;t++){for(i=0;i<4;i++)e.push("tile white"),e.push("tile black")
for(i=0;i<4;i++)e.push("tile black"),e.push("tile white")}return e}),boardArray:Ember.computed("fen",function(){var e=Ember.get(this,"fen").toString(),t=[],i=void 0,r=0,n=(e=(e=e.replace(/ .+$/,"")).replace(/\//g,"")).length
for(i=0;i<n;i++){var o=e[i]
if(isNaN(o))t[r]=o,r++
else{var a=void 0,s=Number(o)
for(a=0;a<s;a++)t[r]=1,r++}}if(64!==r){var l=void 0
for(t=[],l=0;l<64;l++)t[l]=1}return t}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=Ember.get(this,"move"),t=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),i=Ember.get(this,"boardArray").toArray(),r=this.mvToMoveObject(t,e,i)
return this.checkValid(r)}),tiles:Ember.computed("board","boardArray",function(){var e=Ember.get(this,"board").toArray(),t=Ember.get(this,"boardArray").toArray(),i=void 0,r=[]
for(i=0;i<t.length;i++){var n=t[i]
r[i]=1!==n?{class:e[i]+" "+this.fenToMbn(n),index:i}:{class:e[i],index:i}}return r}),fenInfo:Ember.computed("fen",function(){var e=Ember.get(this,"fen").toString()
if(e){var t=e,i=(e=e.replace(/^.+? /,"")).split(" ")
if(5==i.length){var r=i[2]
return r=r.replace(/-/g,""),{FenTrue:!0,Fen:t,ToMove:i[0],CastlingWk:i[1].includes("K"),CastlingWq:i[1].includes("Q"),CastlingBk:i[1].includes("k"),CastlingBq:i[1].includes("q"),EnPassant:r}}}return{FenTrue:!1}}),checkValid:function(e){var i=this.checkMove(e,e.fromIndex,e.toIndex)
if(i){var r=this.makeMove(e,e.b),n=t(r,2),o=n[0],a=n[1],s=!1
if("w"===o.ToMove){var l=a.length
if("k"!==a[this.lastPosBK]){var f=void 0
for(f=0;f<l;f++)if("k"===a[f]){o.toIndex=f,this.lastPosBK=f,s=!0
break}}else o.toIndex=this.lastPosBK,s=!0
if(s){var d=void 0
for(d=0;d<l;d++)if(this.isWhite(a[d])&&(this.checkMove(o,d,o.toIndex)&&(i=!1),o.CastlingCheck)){var c=5
2===o.toIndex&&(c=3),o.valid=!0,this.checkMove(o,o.fromIndex,c)&&(i=!1),c=4,o.valid=!0,this.checkMove(o,o.fromIndex,c)&&(i=!1)}}}else{var p=a.length
if("K"!==a[this.lastPosWK]){var h=void 0
for(h=0;h<p;h++)"K"===a[h]&&(o.toIndex=h,this.lastPosWK=h,s=!0)}else o.toIndex=this.lastPosWK,s=!0
if(s){var u=void 0
for(u=0;u<p;u++)if(this.isBlack(a[u])&&(this.checkMove(o,u,o.toIndex)&&(i=!1),o.CastlingCheck)){var v=61
58===o.toIndex&&(v=59),o.valid=!0,this.checkMove(o,o.fromIndex,v)&&(i=!1),v=60,o.valid=!0,this.checkMove(o,o.fromIndex,v)&&(i=!1)}}}}return i},checkMove:function(e,t,i){var r=!1
if(e.valid){var n=e.piecePromotion,o=e.b,a=[]
a[0]=t%8+1,a[1]=8-Math.floor(t/8),a[2]=i%8+1,a[3]=8-Math.floor(i/8)
var s=o[t]
if("w"===e.ToMove&&this.isBlack(o[t]))return!1
if("b"===e.ToMove&&this.isWhite(o[t]))return!1
if(a[3]<1||a[3]>8)return!1
if("P"===s)return!("2"!=a[1]||t-i!=16||!this.isEmpty(o[i])||!this.isEmpty(o[t-8]))||(!(t-i!=9&&t-i!=7||!this.isEmpty(o[i])||a[3]-a[1]!=1||this.algebraicToIndex(e.EnPassant)!==i)||(t-i!=9&&t-i!=7||!this.isBlack(o[i])||a[3]-a[1]!=1||(r=!0),t-i==8&&this.isEmpty(o[i])&&(r=!0),!0===r&&8===a[3]?"n"===n||"b"===n||"r"===n||"q"===n:r))
if("p"===s)return!("7"!=a[1]||i-t!=16||!this.isEmpty(o[i])||!this.isEmpty(o[t+8]))||(!(i-t!=9&&i-t!=7||!this.isEmpty(o[i])||a[3]-a[1]!=-1||this.algebraicToIndex(e.EnPassant)!==i)||(i-t!=9&&i-t!=7||!this.isWhite(o[i])||a[3]-a[1]!=-1||(r=!0),i-t==8&&this.isEmpty(o[i])&&(r=!0),!0===r&&1==a[3]?"n"===n||"b"===n||"r"===n||"q"===n:r))
if("N"===s){if((i-t==-17||i-t==-15)&&this.isBlackOrEmpty(o[i])&&a[3]-a[1]==2)return!0
if((i-t==17||i-t==15)&&this.isBlackOrEmpty(o[i])&&a[3]-a[1]==-2)return!0
if((i-t==-6||i-t==-10)&&this.isBlackOrEmpty(o[i])&&a[3]-a[1]==1)return!0
if((i-t==6||i-t==10)&&this.isBlackOrEmpty(o[i])&&a[3]-a[1]==-1)return!0}if("n"===s){if((i-t==-17||i-t==-15)&&this.isWhiteOrEmpty(o[i])&&a[3]-a[1]==2)return!0
if((i-t==17||i-t==15)&&this.isWhiteOrEmpty(o[i])&&a[3]-a[1]==-2)return!0
if((i-t==-6||i-t==-10)&&this.isWhiteOrEmpty(o[i])&&a[3]-a[1]==1)return!0
if((i-t==6||i-t==10)&&this.isWhiteOrEmpty(o[i])&&a[3]-a[1]==-1)return!0}if("K"===s)if((58===i&&e.CastlingWq||62===i&&e.CastlingWk)&&60===t){if(this.lineCheck(t,i,o,s+"0-0")&&this.isEmpty(o[i]))return!0}else if(this.lineCheck(t,i,o,s)&&this.isBlackOrEmpty(o[i]))return!0
if("k"===s)if((2===i&&e.CastlingBq||6===i&&e.CastlingBk)&&4===t){if(this.lineCheck(t,i,o,s+"0-0")&&this.isEmpty(o[i]))return!0}else if(this.lineCheck(t,i,o,s)&&this.isWhiteOrEmpty(o[i]))return!0
if(("Q"===s||"R"===s||"B"===s)&&this.lineCheck(t,i,o,s)&&this.isBlackOrEmpty(o[i]))return!0
if(("q"===s||"r"===s||"b"===s)&&this.lineCheck(t,i,o,s)&&this.isWhiteOrEmpty(o[i]))return!0}return!1},makeMove:function(e,t){var i=Object.assign({},e),r=Object.assign([],t),n=i.Fen,o=void 0,a=void 0,s=void 0,l=void 0,f=void 0
if(n){var d=n
n=(n=n.replace(/ .+$/,"")).replace(/\//g,""),"w"===(o=(d=d.replace(/^.+? /,"")).split(" "))[0].toLowerCase()?(o[0]="b",i.ToMove="b"):"b"===o[0].toLowerCase()&&(o[0]="w",i.ToMove="w"),a=i.fromIndex,s=i.toIndex,l=i.piecePromotion
var c=[]
c[0]=a%8+1,c[1]=8-Math.floor(a/8),c[2]=s%8+1,c[3]=8-Math.floor(s/8)
var p=r[a]
r[a]=1,r[s]=p,0===i.toIndex&&(o[1]=o[1].replace(/q/,"")),7===i.toIndex&&(o[1]=o[1].replace(/k/,"")),56===i.toIndex&&(o[1]=o[1].replace(/Q/,"")),63===i.toIndex&&(o[1]=o[1].replace(/K/,"")),"K"===p&&(o[1]=o[1].replace(/K/,""),o[1]=o[1].replace(/Q/,""),62===s&&60===a&&(r[63]=1,r[61]="R",i.CastlingCheck=!0),58===s&&60===a&&(r[56]=1,r[59]="R",i.CastlingCheck=!0)),"k"===p&&(o[1]=o[1].replace(/k/,""),o[1]=o[1].replace(/q/,""),2===s&&4===a&&(r[0]=1,r[3]="r",i.CastlingCheck=!0),6===s&&4===a&&(r[7]=1,r[5]="r",i.CastlingCheck=!0)),"R"===p&&(56===a&&(o[1]=o[1].replace(/Q/,"")),63===a&&(o[1]=o[1].replace(/K/,""))),"r"===p&&(0===a&&(o[1]=o[1].replace(/q/,"")),7===a&&(o[1]=o[1].replace(/k/,""))),o[2]="-","P"===p&&(s<8&&(r[s]=l.toUpperCase()),a-s==16&&(o[2]=this.indexToAlgebraic(a-8)),this.algebraicToIndex(i.EnPassant)===s&&(r[s+8]=1)),"p"===p&&(s>55&&(r[s]=l.toLowerCase()),s-a==16&&(o[2]=this.indexToAlgebraic(a+8)),this.algebraicToIndex(i.EnPassant)===s&&(r[s-8]=1)),o[1]||(o[1]="-"),f=""
var h=0,u=void 0
for(u=0;u<8;u++){var v=0,m=void 0
for(m=0;m<8;m++){var b=r[h]
h++,isNaN(b)?(v&&(f+=v),f+=b,v=0):v++}v&&(f+=v),u<7&&(f+="/")}f=f+" "+o.join(" ")}var g=o[2]
return g=g.replace(/-/g,""),i.b=r,i.Fen=f,i.CastlingWk=o[1].includes("K"),i.CastlingWq=o[1].includes("Q"),i.CastlingBk=o[1].includes("k"),i.CastlingBq=o[1].includes("q"),i.EnPassant=g,[i,r]},lineCheck:function(e,t,i,r){var n=!0,o=e%8,a=Math.floor(e/8),s=t%8,l=Math.floor(t/8),f=Math.abs(o-s),d=Math.abs(a-l),c=(t-e)/Math.max(f,d)
if(("Q"===r||"q"===r)&&0!==f&&0!==d&&f!==d)return!1
if(("R"===r||"r"===r)&&0!==f&&0!==d)return!1
if(("B"===r||"b"===r)&&f!==d)return!1
if(("K"===r||"k"===r)&&(f>1||d>1))return!1
if(("K0-0"===r||"k0-0"===r)&&2!==f&&0!==d)return!1
var p=void 0
for(p=e+c;p!==t;p+=c)this.isEmpty(i[p])||(n=!1)
return n},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var t=e.toLowerCase()
return t===e?"b"+t:"w"+t},algebraicToIndex:function(e){var t=e.split("")
if(2===t.length){var i=this.uciToNumber(t[0])
return 8*(8-t[1])+i-1}return-1},indexToAlgebraic:function(e){var t=e%8+1,i=8-Math.floor(e/8)
return String.fromCharCode(t+96)+i},mvToMoveObject:function(e,t,i){var r=JSON.parse(JSON.stringify(e)),n=!1
if(t&&t.length>3&&t.length<6){n=!0
var o=t.split(""),a=[]
a[0]=o[0]+o[1],a[1]=o[2]+o[3],a[2]=o[4],r.fromIndex=this.algebraicToIndex(a[0]),r.toIndex=this.algebraicToIndex(a[1]),a[2]&&(r.piecePromotion=a[2].toLowerCase()),r.b=i}return r.valid=n,r},positionalPoints:function(e){var t=0,i=void 0,r=e.b.length
for(i=0;i<r;i++)t+=this.pointsHash[e.b[i]],this.pointsHash[e.b[i]]&&(i>7&&i<16&&"P"===e.b[i]&&(t-=20),i>15&&i<24&&"P"===e.b[i]&&(t-=10),i>39&&i<48&&"p"===e.b[i]&&(t+=10),i>47&&i<56&&"p"===e.b[i]&&(t+=20),(27!==i||"p"!==e.b[i]&&"P"!==e.b[i])&&(28!==i||"p"!==e.b[i]&&"P"!==e.b[i])&&(35!==i||"p"!==e.b[i]&&"P"!==e.b[i])&&(36!==i||"p"!==e.b[i]&&"P"!==e.b[i])||(this.isWhite(e.b[i])?t-=25:t+=25))
return t},minimax:function(e,i,r,n,o){if(0===i){var a=this.positionalPoints(e)
return{mv:e.mv,points:a}}var s=void 0,l=[],f=e.b.length
for(s=0;s<f;s++)if("b"===e.ToMove){if(this.isBlack(e.b[s])){var d=e.b[s],c=!1
e.fromIndex=s,e.fromIndex>47&&e.fromIndex<56&&"p"===d&&(c=!0)
var p=this.grid[d],h=void 0,u=p.length
for(h=0;h<u;h++){var v=p[h],m=void 0,b=v.length
for(m=0;m<b;m++)if(e.toIndex=s+v[m],e.piecePromotion=c?"q":"",e.valid=!0,this.checkValid(e))e.b[e.toIndex]+""!="K"&&(c?(l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)))
else if(e.b[e.toIndex]+""!="1")break}}}else if(this.isWhite(e.b[s])){var g=e.b[s],x=!1
e.fromIndex=s,"P"!==g?g=g.toLowerCase():e.fromIndex<16&&e.fromIndex>7&&(x=!0)
var y=this.grid[g],I=void 0,k=y.length
for(I=0;I<k;I++){var P=y[I],E=void 0,T=P.length
for(E=0;E<T;E++)if(e.toIndex=s+P[E],e.piecePromotion=x?"q":"",e.valid=!0,this.checkValid(e))e.b[e.toIndex]+""!="k"&&(x?(l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):l.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)))
else if(e.b[e.toIndex]+""!="1")break}}if(!l.length){if(r){var M=void 0,w=void 0,O=void 0,A=!1
for(w=0;w<e.b.length;w++)"k"===e.b[w]&&(M=w)
for(O=0;O<e.b.length;O++)if(this.isWhite(e.b[O])&&(e.fromIndex=O,e.toIndex=M,e.ToMove="w",e.valid=!0,this.checkValid(e))){console.log("heyaa"),A=!0
break}return A?{mv:"",points:-2e5-i}:{mv:"",points:0}}var C=void 0,B=void 0,_=void 0,j=!1
for(B=0;B<e.b.length;B++)"K"===e.b[B]&&(C=B)
for(_=0;_<e.b.length;_++)if(this.isBlack(e.b[_])&&(e.fromIndex=_,e.toIndex=C,e.ToMove="b",e.valid=!0,this.checkValid(e))){console.log("hoi"),j=!0
break}return j?{mv:"",points:2e5+i}:{mv:"",points:0}}var q=void 0
if(r){var W=-1e6,K="",N=void 0,z=l.length
for(N=0;N<z;N++){var S=l[N],R=S.split(""),F=[]
F[0]=R[0]+R[1],F[1]=R[2]+R[3],F[2]=R[4],e.fromIndex=this.algebraicToIndex(F[0]),e.toIndex=this.algebraicToIndex(F[1]),e.mv=S,F[2]?e.piecePromotion=F[2]:e.piecePromotion=""
var L=this.makeMove(e,e.b),V=t(L,2)
q=V[0],V[1]
var Q=this.minimax(q,i-1,!1,n,o)
if(Q.points>W&&(W=Q.points,K=S),Q.points>n&&(n=Q.points),n>=o)break}return{mv:K,points:W}}var J=1e6,H="",D=void 0,U=l.length
for(D=0;D<U;D++){var G=l[D],$=G.split(""),Z=[]
Z[0]=$[0]+$[1],Z[1]=$[2]+$[3],Z[2]=$[4],e.fromIndex=this.algebraicToIndex(Z[0]),e.toIndex=this.algebraicToIndex(Z[1]),Z[2]?e.piecePromotion=Z[2]:e.piecePromotion="",e.mv=G
var X=this.makeMove(e,e.b),Y=t(X,2)
q=Y[0],Y[1]
var ee=this.minimax(q,i-1,!0,n,o)
if(ee.points<J&&(J=ee.points,H=G),ee.points<o&&(o=ee.points),n>=o)break}return{mv:H,points:J}},actions:{playMove:function(e,i){var r=this,n=Ember.get(this,"move")
if(i){var o=this.indexToAlgebraic(e)
n.length>2&&(n="",o=""),n+=o,Ember.set(this,"move",n)}var a=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),s=Ember.get(this,"boardArray").toArray(),l=this.mvToMoveObject(a,n,s)
if(this.checkValid(l)){var f=this.makeMove(l,l.b),d=t(f,2),c=d[0],p=d[1]
console.log(c,p),Ember.set(this,"fen",c.Fen),Ember.run.later(function(){var e=Ember.get(r,"move"),i=JSON.parse(JSON.stringify(Ember.get(r,"fenInfo"))),n=Ember.get(r,"boardArray").toArray(),o=r.mvToMoveObject(i,e,n),a=void 0,s=0
for(a=0;a<n.length;a++)1!==n[a]&&s++
var l=0
l=s>16?4:Math.floor(32/s*1.5),console.log(l)
var f=(new Date).getTime(),d=r.minimax(o,l,!0,-1e6,1e6),c=(new Date).getTime()-f
if(console.log("Execution time: "+c),d.points===-1e5-l||d.points===-2e5-l)console.log("x")
else{console.log(d)
var p=d.mv.split(""),h=[]
h[0]=p[0]+p[1],h[1]=p[2]+p[3],h[2]=p[4],o.fromIndex=r.algebraicToIndex(h[0]),o.toIndex=r.algebraicToIndex(h[1]),h[2]?o.piecePromotion=h[2]:o.piecePromotion=""
var u=r.makeMove(o,o.b),v=t(u,2),m=v[0]
v[1]
Ember.set(r,"fen",m.Fen),Ember.set(r,"move","")}},500)}}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,i){function r(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.default.APP.version,o=r.versionOnly||r.hideSha,a=r.shaOnly||r.hideVersion,s=null
return o&&(r.showExtended&&(s=n.match(i.versionExtendedRegExp)),s||(s=n.match(i.versionRegExp))),a&&(s=n.match(i.shaRegExp)),s?s[0]:n}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=r,e.default=Ember.Helper.helper(r)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,t,i){Object.defineProperty(e,"__esModule",{value:!0})
var r=void 0,n=void 0
i.default.APP&&(r=i.default.APP.name,n=i.default.APP.version),e.default={name:"App Version",initialize:(0,t.default)(r,n)}}),define("pwschess/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("pwschess/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("pwschess/initializers/export-application-global",["exports","pwschess/config/environment"],function(e,t){function i(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var i
if("undefined"!=typeof window)i=window
else if("undefined"!=typeof global)i=global
else{if("undefined"==typeof self)return
i=self}var r,n=t.default.exportApplicationGlobal
r="string"==typeof n?n:Ember.String.classify(t.default.modulePrefix),i[r]||(i[r]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete i[r]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=i,e.default={name:"export-application-global",initialize:i}}),define("pwschess/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("pwschess/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/router",["exports","pwschess/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var i=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
i.map(function(){}),e.default=i}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"L23tVZV6",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","container-fluid"],[9],[0,"\\n"],[7,"div"],[11,"class","row"],[9],[0,"\\n\\n"],[7,"div"],[11,"class","column1"],[9],[0,"\\n"],[1,[27,"input",null,[["type","value","placeholder","class"],["text",[23,["fen"]],"Vul hier een FEN in","form-control"]]],false],[0," "],[7,"br"],[9],[10],[0,"\\n"],[7,"br"],[9],[10],[0,"\\n\\n"],[7,"form"],[3,"action",[[22,0,[]],"playMove"],[["on"],["submit"]]],[9],[0,"\\n    "],[1,[27,"input",null,[["class","type","value","placeholder"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],""]]],false],[0,"\\n    "],[7,"button"],[11,"type","submit"],[9],[0,"Move"],[10],[0,"\\n"],[10],[0,"\\n"],[10],[0,"\\n\\n"],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"    "],[7,"div"],[12,"class",[22,1,["class"]]],[3,"action",[[22,0,[]],"playMove",[22,1,["index"]],true]],[9],[0," "],[10],[0,"\\n"]],"parameters":[1]},null],[10],[0,"\\n"],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[0,"  "],[7,"b"],[9],[0,"To Move :"],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n  "],[7,"h4"],[9],[0,"Castling Availability"],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"En passant target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[10],[0,"\\n"],[1,[21,"outlet"],false],[0,"\\n"],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),i={default:JSON.parse(unescape(t))}
return Object.defineProperty(i,"__esModule",{value:!0}),i}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+59a37c30"})
