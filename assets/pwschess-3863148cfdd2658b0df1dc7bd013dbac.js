"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,i,t,r){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:i.default});(0,t.default)(n,r.default.modulePrefix),e.default=n}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",lastPosWK:64,lastPosBK:64,pointsHash:Object.freeze({1:0,p:100,n:300,b:300,r:500,q:900,k:0,P:-100,N:-300,B:-300,R:-500,Q:-900,K:0}),grid:Object.freeze({p:[[7],[8,16],[9]],P:[[-7],[-8,-16],[-9]],n:[[17],[15],[10],[6],[-6],[-10],[-15],[-17]],b:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63]],r:[[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],q:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63],[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],k:[[9],[8],[7],[1,2],[-1,-2],[-7],[-8],[-9]]}),board:Ember.computed(function(){var e=[],i=void 0,t=void 0
for(i=0;i<4;i++){for(t=0;t<4;t++)e.push("tile white"),e.push("tile black")
for(t=0;t<4;t++)e.push("tile black"),e.push("tile white")}return e}),boardArray:Ember.computed("fen",function(){var e=Ember.get(this,"fen").toString(),i=[],t=void 0,r=0,n=(e=(e=e.replace(/ .+$/,"")).replace(/\//g,"")).length
for(t=0;t<n;t++){var o=e[t]
if(isNaN(o))i[r]=o,r++
else{var s=void 0,a=Number(o)
for(s=0;s<a;s++)i[r]=1,r++}}if(64!==r){var l=void 0
for(i=[],l=0;l<64;l++)i[l]=1}return i}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=Ember.get(this,"move"),i=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),t=Ember.get(this,"boardArray").toArray(),r=this.mvToMoveObject(i,e,t)
return this.checkValid(r)}),tiles:Ember.computed("board","boardArray",function(){var e=Ember.get(this,"board").toArray(),i=Ember.get(this,"boardArray").toArray(),t=void 0,r=[]
for(t=0;t<i.length;t++){var n=i[t]
r[t]=1!==n?{class:e[t]+" "+this.fenToMbn(n),index:t}:{class:e[t],index:t}}return r}),fenInfo:Ember.computed("fen",function(){var e=Ember.get(this,"fen").toString()
if(e){var i=e,t=(e=e.replace(/^.+? /,"")).split(" ")
if(5==t.length){var r=t[2]
return r=r.replace(/-/g,""),{FenTrue:!0,Fen:i,ToMove:t[0],CastlingWk:t[1].includes("K"),CastlingWq:t[1].includes("Q"),CastlingBk:t[1].includes("k"),CastlingBq:t[1].includes("q"),EnPassant:r}}}return{FenTrue:!1}}),checkValid:function(e){var i=this.checkMove(e,e.fromIndex,e.toIndex)
if(i){var t=this.makeMove(e),r=!1
if("w"===t.ToMove){var n=t.b.length
t.b[this.lastPosBK]
var o=void 0
for(o=0;o<n;o++){if("k"===t.b[o]){t.toIndex=o,this.lastPosBK=o,r=!0
break}t.toIndex=this.lastPosBK,r=!0}if(r){var s=void 0
for(s=0;s<n;s++)if(this.isWhite(t.b[s])&&(this.checkMove(t,s,t.toIndex)&&(i=!1),t.CastlingCheck)){var a=5
2===t.toIndex&&(a=3),t.valid=!0,this.checkMove(t,t.fromIndex,a)&&(i=!1),a=4,t.valid=!0,this.checkMove(t,t.fromIndex,a)&&(i=!1)}}}else{var l=t.b.length
if("K"!==t.b[this.lastPosWK]){var d=void 0
for(d=0;d<l;d++)"K"===t.b[d]&&(t.toIndex=d,this.lastPosWK=d,r=!0)}else t.toIndex=this.lastPosWK,r=!0
if(r){var f=void 0
for(f=0;f<l;f++)if(this.isBlack(t.b[f])&&(this.checkMove(t,f,t.toIndex)&&(i=!1),t.CastlingCheck)){var c=61
58===t.toIndex&&(c=59),t.valid=!0,this.checkMove(t,t.fromIndex,c)&&(i=!1),c=60,t.valid=!0,this.checkMove(t,t.fromIndex,c)&&(i=!1)}}}}return i},checkMove:function(e,i,t){var r=!1
if(e.valid){var n=e.piecePromotion,o=e.b,s=[]
s[0]=i%8+1,s[1]=8-Math.floor(i/8),s[2]=t%8+1,s[3]=8-Math.floor(t/8)
var a=o[i]
if("w"===e.ToMove&&this.isBlack(o[i]))return!1
if("b"===e.ToMove&&this.isWhite(o[i]))return!1
if(s[3]<1||s[3]>8)return!1
if("P"===a)return!("2"!=s[1]||i-t!=16||!this.isEmpty(o[t])||!this.isEmpty(o[i-8]))||(!(i-t!=9&&i-t!=7||!this.isEmpty(o[t])||s[3]-s[1]!=1||this.algebraicToIndex(e.EnPassant)!==t)||(i-t!=9&&i-t!=7||!this.isBlack(o[t])||s[3]-s[1]!=1||(r=!0),i-t==8&&this.isEmpty(o[t])&&(r=!0),!0===r&&8===s[3]?"n"===n||"b"===n||"r"===n||"q"===n:r))
if("p"===a)return!("7"!=s[1]||t-i!=16||!this.isEmpty(o[t])||!this.isEmpty(o[i+8]))||(!(t-i!=9&&t-i!=7||!this.isEmpty(o[t])||s[3]-s[1]!=-1||this.algebraicToIndex(e.EnPassant)!==t)||(t-i!=9&&t-i!=7||!this.isWhite(o[t])||s[3]-s[1]!=-1||(r=!0),t-i==8&&this.isEmpty(o[t])&&(r=!0),!0===r&&1==s[3]?"n"===n||"b"===n||"r"===n||"q"===n:r))
if("N"===a){if((t-i==-17||t-i==-15)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==2)return!0
if((t-i==17||t-i==15)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==-2)return!0
if((t-i==-6||t-i==-10)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==1)return!0
if((t-i==6||t-i==10)&&this.isBlackOrEmpty(o[t])&&s[3]-s[1]==-1)return!0}if("n"===a){if((t-i==-17||t-i==-15)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==2)return!0
if((t-i==17||t-i==15)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==-2)return!0
if((t-i==-6||t-i==-10)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==1)return!0
if((t-i==6||t-i==10)&&this.isWhiteOrEmpty(o[t])&&s[3]-s[1]==-1)return!0}if("K"===a)if((58===t&&e.CastlingWq||62===t&&e.CastlingWk)&&60===i){if(this.lineCheck(i,t,o,a+"0-0")&&this.isEmpty(o[t]))return!0}else if(this.lineCheck(i,t,o,a)&&this.isBlackOrEmpty(o[t]))return!0
if("k"===a)if((2===t&&e.CastlingBq||6===t&&e.CastlingBk)&&4===i){if(this.lineCheck(i,t,o,a+"0-0")&&this.isEmpty(o[t]))return!0}else if(this.lineCheck(i,t,o,a)&&this.isWhiteOrEmpty(o[t]))return!0
if(("Q"===a||"R"===a||"B"===a)&&this.lineCheck(i,t,o,a)&&this.isBlackOrEmpty(o[t]))return!0
if(("q"===a||"r"===a||"b"===a)&&this.lineCheck(i,t,o,a)&&this.isWhiteOrEmpty(o[t]))return!0}return!1},makeMove:function(e){var i=JSON.parse(JSON.stringify(e)),t=i.Fen,r=void 0,n=void 0,o=void 0,s=void 0,a=void 0,l=void 0
if(t){var d=t
t=(t=t.replace(/ .+$/,"")).replace(/\//g,""),"w"===(r=(d=d.replace(/^.+? /,"")).split(" "))[0].toLowerCase()?(r[0]="b",i.ToMove="b"):"b"===r[0].toLowerCase()&&(r[0]="w",i.ToMove="w"),n=i.fromIndex,o=i.toIndex,s=i.piecePromotion,a=i.b
var f=[]
f[0]=n%8+1,f[1]=8-Math.floor(n/8),f[2]=o%8+1,f[3]=8-Math.floor(o/8)
var c=a[n]
a[n]=1,a[o]=c,0===i.toIndex&&(r[1]=r[1].replace(/q/,"")),7===i.toIndex&&(r[1]=r[1].replace(/k/,"")),56===i.toIndex&&(r[1]=r[1].replace(/Q/,"")),63===i.toIndex&&(r[1]=r[1].replace(/K/,"")),"K"===c&&(r[1]=r[1].replace(/K/,""),r[1]=r[1].replace(/Q/,""),62===o&&60===n&&(a[63]=1,a[61]="R",i.CastlingCheck=!0),58===o&&60===n&&(a[56]=1,a[59]="R",i.CastlingCheck=!0)),"k"===c&&(r[1]=r[1].replace(/k/,""),r[1]=r[1].replace(/q/,""),2===o&&4===n&&(a[0]=1,a[3]="r",i.CastlingCheck=!0),6===o&&4===n&&(a[7]=1,a[5]="r",i.CastlingCheck=!0)),"R"===c&&(56===n&&(r[1]=r[1].replace(/Q/,"")),63===n&&(r[1]=r[1].replace(/K/,""))),"r"===c&&(0===n&&(r[1]=r[1].replace(/q/,"")),7===n&&(r[1]=r[1].replace(/k/,""))),r[2]="-","P"===c&&(o<8&&(a[o]=s.toUpperCase()),n-o==16&&(r[2]=this.indexToAlgebraic(n-8)),this.algebraicToIndex(i.EnPassant)===o&&(a[o+8]=1)),"p"===c&&(o>55&&(a[o]=s.toLowerCase()),o-n==16&&(r[2]=this.indexToAlgebraic(n+8)),this.algebraicToIndex(i.EnPassant)===o&&(a[o-8]=1)),r[1]||(r[1]="-"),l=""
var p=0,h=void 0
for(h=0;h<8;h++){var u=0,v=void 0
for(v=0;v<8;v++){var m=a[p]
p++,isNaN(m)?(u&&(l+=u),l+=m,u=0):u++}u&&(l+=u),h<7&&(l+="/")}l=l+" "+r.join(" ")}var b=r[2]
return b=b.replace(/-/g,""),i.b=a,i.Fen=l,i.CastlingWk=r[1].includes("K"),i.CastlingWq=r[1].includes("Q"),i.CastlingBk=r[1].includes("k"),i.CastlingBq=r[1].includes("q"),i.EnPassant=b,i},lineCheck:function(e,i,t,r){var n=!0,o=e%8,s=Math.floor(e/8),a=i%8,l=Math.floor(i/8),d=Math.abs(o-a),f=Math.abs(s-l),c=(i-e)/Math.max(d,f)
if(("Q"===r||"q"===r)&&0!==d&&0!==f&&d!==f)return!1
if(("R"===r||"r"===r)&&0!==d&&0!==f)return!1
if(("B"===r||"b"===r)&&d!==f)return!1
if(("K"===r||"k"===r)&&(d>1||f>1))return!1
if(("K0-0"===r||"k0-0"===r)&&2!==d&&0!==f)return!1
var p=void 0
for(p=e+c;p!==i;p+=c)this.isEmpty(t[p])||(n=!1)
return n},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var i=e.toLowerCase()
return i===e?"b"+i:"w"+i},algebraicToIndex:function(e){var i=e.split("")
if(2===i.length){var t=this.uciToNumber(i[0])
return 8*(8-i[1])+t-1}return-1},indexToAlgebraic:function(e){var i=e%8+1,t=8-Math.floor(e/8)
return String.fromCharCode(i+96)+t},mvToMoveObject:function(e,i,t){var r=JSON.parse(JSON.stringify(e)),n=!1
if(i&&i.length>3&&i.length<6){n=!0
var o=i.split(""),s=[]
s[0]=o[0]+o[1],s[1]=o[2]+o[3],s[2]=o[4],r.fromIndex=this.algebraicToIndex(s[0]),r.toIndex=this.algebraicToIndex(s[1]),s[2]&&(r.piecePromotion=s[2].toLowerCase()),r.b=t}return r.valid=n,r},positionalPoints:function(e){var i=0,t=void 0,r=e.b.length
for(t=0;t<r;t++)i+=this.pointsHash[e.b[t]],this.pointsHash[e.b[t]]&&(t>7&&t<16&&"P"===e.b[t]&&(i-=20),t>15&&t<24&&"P"===e.b[t]&&(i-=10),t>39&&t<48&&"p"===e.b[t]&&(i+=10),t>47&&t<56&&"p"===e.b[t]&&(i+=20),(27!==t||"p"!==e.b[t]&&"P"!==e.b[t])&&(28!==t||"p"!==e.b[t]&&"P"!==e.b[t])&&(35!==t||"p"!==e.b[t]&&"P"!==e.b[t])&&(36!==t||"p"!==e.b[t]&&"P"!==e.b[t])||(this.isWhite(e.b[t])?i-=25:i+=25))
return i},minimax:function(e,i,t,r,n){if(0===i){var o=this.positionalPoints(e)
return{mv:e.mv,points:o}}var s=void 0,a=[],l=e.b.length
for(s=0;s<l;s++)if("b"===e.ToMove){if(this.isBlack(e.b[s])){var d=e.b[s],f=!1
e.fromIndex=s,e.fromIndex>47&&e.fromIndex<56&&"p"===d&&(f=!0)
var c=this.grid[d],p=void 0,h=c.length
for(p=0;p<h;p++){var u=c[p],v=void 0,m=u.length
for(v=0;v<m;v++)if(e.toIndex=s+u[v],e.piecePromotion=f?"q":"",e.valid=!0,this.checkValid(e))f?(a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex))
else if(e.b[e.toIndex]+""!="1")break}}}else if(this.isWhite(e.b[s])){var b=e.b[s],g=!1
e.fromIndex=s,"P"!==b?b=b.toLowerCase():e.fromIndex<16&&e.fromIndex>7&&(g=!0)
var x=this.grid[b],I=void 0,k=x.length
for(I=0;I<k;I++){var y=x[I],P=void 0,E=y.length
for(P=0;P<E;P++)if(e.toIndex=s+y[P],e.piecePromotion=g?"q":"",e.valid=!0,this.checkValid(e))g?(a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):a.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex))
else if(e.b[e.toIndex]+""!="1")break}}if(!a.length){if(t){var T=void 0,M=void 0,w=void 0,C=!1
for(M=0;M<e.b.length;M++)"k"===e.b[M]&&(T=M)
for(w=0;w<e.b.length;w++)if(this.isWhite(e.b[w])&&(e.fromIndex=w,e.toIndex=T,e.ToMove="w",e.valid=!0,this.checkValid(e))){console.log("heyaa"),C=!0
break}return C?(console.log("mat"),{mv:"",points:-1e6}):(console.log("pat"),{mv:"",points:0})}var O=void 0,A=void 0,B=void 0,_=!1
for(A=0;A<e.b.length;A++)"K"===e.b[A]&&(O=A)
for(B=0;B<e.b.length;B++)if(this.isBlack(e.b[B])&&(e.fromIndex=B,e.toIndex=O,e.ToMove="b",e.valid=!0,this.checkValid(e))){console.log("hoi"),_=!0
break}return _?(console.log("mat"),{mv:"",points:1e6}):(console.log("pat"),{mv:"",points:0})}var q=void 0
if(t){var W=-1e6,j="",N=void 0,K=a.length
for(N=0;N<K;N++){var z=a[N],S=z.split(""),R=[]
R[0]=S[0]+S[1],R[1]=S[2]+S[3],R[2]=S[4],e.fromIndex=this.algebraicToIndex(R[0]),e.toIndex=this.algebraicToIndex(R[1]),e.mv=z,R[2]?e.piecePromotion=R[2]:e.piecePromotion="",q=this.makeMove(e)
var F=this.minimax(q,i-1,!1,r,n)
if(F.points>W&&(W=F.points,j=z),F.points>r&&(r=F.points),r>=n)break}return{mv:j,points:W}}var L=1e6,V="",J=void 0,Q=a.length
for(J=0;J<Q;J++){var H=a[J],U=H.split(""),G=[]
G[0]=U[0]+U[1],G[1]=U[2]+U[3],G[2]=U[4],e.fromIndex=this.algebraicToIndex(G[0]),e.toIndex=this.algebraicToIndex(G[1]),G[2]?e.piecePromotion=G[2]:e.piecePromotion="",e.mv=H,q=this.makeMove(e)
var $=this.minimax(q,i-1,!0,r,n)
if($.points<L&&(L=$.points,V=H),$.points<n&&(n=$.points),r>=n)break}return{mv:V,points:L}},actions:{playMove:function(e,i){var t=this,r=Ember.get(this,"move")
if(i){var n=this.indexToAlgebraic(e)
r.length>2&&(r="",n=""),r+=n,Ember.set(this,"move",r)}var o=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),s=Ember.get(this,"boardArray").toArray(),a=this.mvToMoveObject(o,r,s)
if(this.checkValid(a)){var l=this.makeMove(a)
Ember.set(this,"fen",l.Fen),Ember.run.later(function(){var e=Ember.get(t,"move"),i=JSON.parse(JSON.stringify(Ember.get(t,"fenInfo"))),r=Ember.get(t,"boardArray").toArray(),n=t.mvToMoveObject(i,e,r),o=t.minimax(n,4,!0,-1e6,1e6)
if(-1e6===o.points)console.log("x")
else{console.log(o)
var s=o.mv.split(""),a=[]
a[0]=s[0]+s[1],a[1]=s[2]+s[3],a[2]=s[4],n.fromIndex=t.algebraicToIndex(a[0]),n.toIndex=t.algebraicToIndex(a[1]),a[2]?n.piecePromotion=a[2]:n.piecePromotion=""
var l=t.makeMove(n)
Ember.set(t,"fen",l.Fen),Ember.set(t,"move","")}},500)}}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,i,t){function r(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=i.default.APP.version,o=r.versionOnly||r.hideSha,s=r.shaOnly||r.hideVersion,a=null
return o&&(r.showExtended&&(a=n.match(t.versionExtendedRegExp)),a||(a=n.match(t.versionRegExp))),s&&(a=n.match(t.shaRegExp)),a?a[0]:n}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=r,e.default=Ember.Helper.helper(r)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,i,t){Object.defineProperty(e,"__esModule",{value:!0})
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
t.map(function(){}),e.default=t}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"L23tVZV6",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","container-fluid"],[9],[0,"\\n"],[7,"div"],[11,"class","row"],[9],[0,"\\n\\n"],[7,"div"],[11,"class","column1"],[9],[0,"\\n"],[1,[27,"input",null,[["type","value","placeholder","class"],["text",[23,["fen"]],"Vul hier een FEN in","form-control"]]],false],[0," "],[7,"br"],[9],[10],[0,"\\n"],[7,"br"],[9],[10],[0,"\\n\\n"],[7,"form"],[3,"action",[[22,0,[]],"playMove"],[["on"],["submit"]]],[9],[0,"\\n    "],[1,[27,"input",null,[["class","type","value","placeholder"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],""]]],false],[0,"\\n    "],[7,"button"],[11,"type","submit"],[9],[0,"Move"],[10],[0,"\\n"],[10],[0,"\\n"],[10],[0,"\\n\\n"],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"    "],[7,"div"],[12,"class",[22,1,["class"]]],[3,"action",[[22,0,[]],"playMove",[22,1,["index"]],true]],[9],[0," "],[10],[0,"\\n"]],"parameters":[1]},null],[10],[0,"\\n"],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[0,"  "],[7,"b"],[9],[0,"To Move :"],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n  "],[7,"h4"],[9],[0,"Castling Availability"],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"En passant target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[10],[0,"\\n"],[1,[21,"outlet"],false],[0,"\\n"],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",i=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),t={default:JSON.parse(unescape(i))}
return Object.defineProperty(t,"__esModule",{value:!0}),t}catch(i){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+53910964"})
