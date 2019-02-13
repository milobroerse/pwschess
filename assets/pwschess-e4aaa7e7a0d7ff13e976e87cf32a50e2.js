"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,i,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var r=Ember.Application.extend({modulePrefix:n.default.modulePrefix,podModulePrefix:n.default.podModulePrefix,Resolver:i.default});(0,t.default)(r,n.default.modulePrefix),e.default=r}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",lastPosWK:64,lastPosBK:64,pointsHash:Object.freeze({1:0,p:100,n:300,b:300,r:500,q:900,k:0,P:-100,N:-300,B:-300,R:-500,Q:-900,K:0}),grid:Object.freeze({p:[[7],[8,16],[9]],P:[[-7],[-8,-16],[-9]],n:[[17],[15],[10],[6],[-6],[-10],[-15],[-17]],b:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63]],r:[[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],q:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63],[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],k:[[9],[8],[7],[1,2],[-1,-2],[-7],[-8],[-9]]}),board:Ember.computed(function(){var e=[],i=void 0,t=void 0
for(i=0;i<4;i++){for(t=0;t<4;t++)e.push("tile white"),e.push("tile black")
for(t=0;t<4;t++)e.push("tile black"),e.push("tile white")}return e}),boardArray:Ember.computed("fen",function(){var e=Ember.get(this,"fen").toString(),i=[],t=void 0,n=0,r=(e=(e=e.replace(/ .+$/,"")).replace(/\//g,"")).length
for(t=0;t<r;t++){var a=e[t]
if(isNaN(a))i[n]=a,n++
else{var o=void 0,s=Number(a)
for(o=0;o<s;o++)i[n]=1,n++}}if(64!==n){var l=void 0
for(i=[],l=0;l<64;l++)i[l]=1}return i}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=Ember.get(this,"move"),i=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),t=Ember.get(this,"boardArray").toArray(),n=this.mvToMoveObject(i,e,t)
return this.checkValid(n)}),tiles:Ember.computed("board","boardArray",function(){var e=Ember.get(this,"board").toArray(),i=Ember.get(this,"boardArray").toArray(),t=void 0
for(t=0;t<i.length;t++){var n=i[t]
1!==n&&(e[t]=e[t]+" "+this.fenToMbn(n))}return e}),fenInfo:Ember.computed("fen",function(){var e=Ember.get(this,"fen").toString()
if(e){var i=e,t=(e=e.replace(/^.+? /,"")).split(" ")
if(5==t.length){var n=t[2]
return n=n.replace(/-/g,""),{FenTrue:!0,Fen:i,ToMove:t[0],CastlingWk:t[1].includes("K"),CastlingWq:t[1].includes("Q"),CastlingBk:t[1].includes("k"),CastlingBq:t[1].includes("q"),EnPassant:n}}}return{FenTrue:!1}}),checkValid:function(e){var i=!1
if(this.checkMove(e).valid){i=!0
var t=this.makeMove(e),n=!1
if("w"===t.ToMove){t.b[this.lastPosBK]
var r=void 0,a=t.b.length
for(r=0;r<a;r++){if("k"===t.b[r]){t.toIndex=r,this.lastPosBK=r,n=!0
break}t.toIndex=this.lastPosBK,n=!0}if(n){var o=void 0,s=t.b.length
for(o=0;o<s;o++)if(this.isWhite(t.b[o])){t.fromIndex=o
var l=this.checkMove(t)
l.valid&&(i=!1),t.CastlingCheck&&(2===t.toIndex?l.toIndex=3:l.toIndex=5,l.valid=!0,(l=this.checkMove(l)).valid&&(i=!1),l.toIndex=4,l.valid=!0,(l=this.checkMove(l)).valid&&(i=!1))}}}else{if("K"!==t.b[this.lastPosWK]){var d=void 0,c=t.b.length
for(d=0;d<c;d++)"K"===t.b[d]&&(t.toIndex=d,this.lastPosWK=d,n=!0)}else t.toIndex=this.lastPosWK,n=!0
if(n){var f=void 0,p=t.b.length
for(f=0;f<p;f++)if(this.isBlack(t.b[f])){t.fromIndex=f
var h=this.checkMove(t)
h.valid&&(i=!1),t.CastlingCheck&&(58===t.toIndex?h.toIndex=59:h.toIndex=61,h.valid=!0,(h=this.checkMove(h)).valid&&(i=!1),h.toIndex=60,h.valid=!0,(h=this.checkMove(h)).valid&&(i=!1))}}}}else i=!1
return i},checkMove:function(e){var i=!1,t=JSON.parse(JSON.stringify(e))
if(t.valid){var n=t.fromIndex,r=t.toIndex,a=t.piecePromotion,o=t.b,s=[]
s[0]=n%8+1,s[1]=8-Math.floor(n/8),s[2]=r%8+1,s[3]=8-Math.floor(r/8)
var l=o[n]
if("w"===t.ToMove&&this.isBlack(o[n]))return t.valid=!1,t
if("b"===t.ToMove&&this.isWhite(o[n]))return t.valid=!1,t
if(s[3]<1||s[3]>8)return t.valid=!1,t
"P"===l&&(n-r==8&&this.isEmpty(o[r])&&(i=!0),"2"==s[1]&&n-r==16&&this.isEmpty(o[r])&&this.isEmpty(o[n-8])&&(i=!0),n-r!=9&&n-r!=7||!this.isBlack(o[r])||s[3]-s[1]!=1||(i=!0),n-r!=9&&n-r!=7||!this.isEmpty(o[r])||s[3]-s[1]!=1||this.algebraicToIndex(t.EnPassant)===r&&(i=!0),8==s[3]&&!0===i&&(i=!1,"n"!==a&&"b"!==a&&"r"!==a&&"q"!==a||(i=!0))),"p"===l&&(r-n==8&&this.isEmpty(o[r])&&(i=!0),"7"==s[1]&&r-n==16&&this.isEmpty(o[r])&&this.isEmpty(o[n+8])&&(i=!0),r-n!=9&&r-n!=7||!this.isWhite(o[r])||s[3]-s[1]!=-1||(i=!0),r-n!=9&&r-n!=7||!this.isEmpty(o[r])||s[3]-s[1]!=-1||this.algebraicToIndex(t.EnPassant)===r&&(i=!0),1==s[3]&&!0===i&&(i=!1,"n"!==a&&"b"!==a&&"r"!==a&&"q"!==a||(i=!0))),"N"===l&&(r-n!=-17&&r-n!=-15||!this.isBlackOrEmpty(o[r])||s[3]-s[1]!=2||(i=!0),r-n!=17&&r-n!=15||!this.isBlackOrEmpty(o[r])||s[3]-s[1]!=-2||(i=!0),r-n!=-6&&r-n!=-10||!this.isBlackOrEmpty(o[r])||s[3]-s[1]!=1||(i=!0),r-n!=6&&r-n!=10||!this.isBlackOrEmpty(o[r])||s[3]-s[1]!=-1||(i=!0)),"n"===l&&(r-n!=-17&&r-n!=-15||!this.isWhiteOrEmpty(o[r])||s[3]-s[1]!=2||(i=!0),r-n!=17&&r-n!=15||!this.isWhiteOrEmpty(o[r])||s[3]-s[1]!=-2||(i=!0),r-n!=-6&&r-n!=-10||!this.isWhiteOrEmpty(o[r])||s[3]-s[1]!=1||(i=!0),r-n!=6&&r-n!=10||!this.isWhiteOrEmpty(o[r])||s[3]-s[1]!=-1||(i=!0)),"K"===l&&((58===r&&t.CastlingWq||62===r&&t.CastlingWk)&&60===n?this.lineCheck(n,r,o,l+"0-0")&&this.isEmpty(o[r])&&(i=!0):this.lineCheck(n,r,o,l)&&this.isBlackOrEmpty(o[r])&&(i=!0)),"k"===l&&((2===r&&t.CastlingBq||6===r&&t.CastlingBk)&&4===n?this.lineCheck(n,r,o,l+"0-0")&&this.isEmpty(o[r])&&(i=!0):this.lineCheck(n,r,o,l)&&this.isWhiteOrEmpty(o[r])&&(i=!0)),"Q"!==l&&"R"!==l&&"B"!==l||this.lineCheck(n,r,o,l)&&this.isBlackOrEmpty(o[r])&&(i=!0),"q"!==l&&"r"!==l&&"b"!==l||this.lineCheck(n,r,o,l)&&this.isWhiteOrEmpty(o[r])&&(i=!0)}return t.valid=i,t},makeMove:function(e){var i=JSON.parse(JSON.stringify(e)),t=i.Fen
if(t){var n=t
t=(t=t.replace(/ .+$/,"")).replace(/\//g,"")
var r=(n=n.replace(/^.+? /,"")).split(" ")
"w"===r[0].toLowerCase()?(r[0]="b",i.ToMove="b"):"b"===r[0].toLowerCase()&&(r[0]="w",i.ToMove="w")
var a=i.fromIndex,o=i.toIndex,s=i.piecePromotion,l=i.b,d=[]
d[0]=a%8+1,d[1]=8-Math.floor(a/8),d[2]=o%8+1,d[3]=8-Math.floor(o/8)
var c=l[a]
l[a]=1,l[o]=c,0===i.toIndex&&(r[1]=r[1].replace(/q/,"")),7===i.toIndex&&(r[1]=r[1].replace(/k/,"")),56===i.toIndex&&(r[1]=r[1].replace(/Q/,"")),63===i.toIndex&&(r[1]=r[1].replace(/K/,"")),"K"===c&&(r[1]=r[1].replace(/K/,""),r[1]=r[1].replace(/Q/,""),62===o&&60===a&&(l[63]=1,l[61]="R",i.CastlingCheck=!0),58===o&&60===a&&(l[56]=1,l[59]="R",i.CastlingCheck=!0)),"k"===c&&(r[1]=r[1].replace(/k/,""),r[1]=r[1].replace(/q/,""),2===o&&4===a&&(l[0]=1,l[3]="r",i.CastlingCheck=!0),6===o&&4===a&&(l[7]=1,l[5]="r",i.CastlingCheck=!0)),"R"===c&&(56===a&&(r[1]=r[1].replace(/Q/,"")),63===a&&(r[1]=r[1].replace(/K/,""))),"r"===c&&(0===a&&(r[1]=r[1].replace(/q/,"")),7===a&&(r[1]=r[1].replace(/k/,""))),r[2]="-","P"===c&&(o<8&&(l[o]=s.toUpperCase()),a-o==16&&(r[2]=this.indexToAlgebraic(a-8)),this.algebraicToIndex(i.EnPassant)===o&&(l[o+8]=1)),"p"===c&&(o>55&&(l[o]=s.toLowerCase()),o-a==16&&(r[2]=this.indexToAlgebraic(a+8)),this.algebraicToIndex(i.EnPassant)===o&&(l[o-8]=1)),r[1]||(r[1]="-")
var f="",p=0,h=void 0
for(h=0;h<8;h++){var u=0,v=void 0
for(v=0;v<8;v++){var b=l[p]
p++,isNaN(b)?(u&&(f+=u),f+=b,u=0):u++}u&&(f+=u),h<7&&(f+="/")}f=f+" "+r.join(" ")}var m=r[2]
return m=m.replace(/-/g,""),i.b=l,i.Fen=f,i.CastlingWk=r[1].includes("K"),i.CastlingWq=r[1].includes("Q"),i.CastlingBk=r[1].includes("k"),i.CastlingBq=r[1].includes("q"),i.EnPassant=m,i},lineCheck:function(e,i,t,n){var r=!0,a=e%8,o=Math.floor(e/8),s=i%8,l=Math.floor(i/8),d=Math.abs(a-s),c=Math.abs(o-l),f=(i-e)/Math.max(d,c)
if(("Q"===n||"q"===n)&&0!==d&&0!==c&&d!==c)return!1
if(("R"===n||"r"===n)&&0!==d&&0!==c)return!1
if(("B"===n||"b"===n)&&d!==c)return!1
if(("K"===n||"k"===n)&&(d>1||c>1))return!1
if(("K0-0"===n||"k0-0"===n)&&2!==d&&0!==c)return!1
var p=void 0
for(p=e+f;p!==i;p+=f)this.isEmpty(t[p])||(r=!1)
return r},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var i=e.toLowerCase()
return i===e?"b"+i:"w"+i},algebraicToIndex:function(e){var i=e.split("")
if(2===i.length){var t=this.uciToNumber(i[0])
return 8*(8-i[1])+t-1}return-1},indexToAlgebraic:function(e){var i=e%8+1,t=8-Math.floor(e/8)
return String.fromCharCode(i+96)+t},mvToMoveObject:function(e,i,t){var n=JSON.parse(JSON.stringify(e)),r=!1
if(i&&i.length>3&&i.length<6){r=!0
var a=i.split(""),o=[]
o[0]=a[0]+a[1],o[1]=a[2]+a[3],o[2]=a[4],n.fromIndex=this.algebraicToIndex(o[0]),n.toIndex=this.algebraicToIndex(o[1]),o[2]&&(n.piecePromotion=o[2].toLowerCase()),n.b=t}return n.valid=r,n},positionalPoints:function(e){var i=0,t=void 0,n=e.b.length
for(t=0;t<n;t++)i+=this.pointsHash[e.b[t]],this.pointsHash[e.b[t]]&&(8!==t&&9!==t&&10!==t&&11!==t&&12!==t&&13!==t&&14!==t&&15!==t||"P"!==e.b[t]||(i-=20),16!==t&&17!==t&&18!==t&&19!==t&&20!==t&&21!==t&&14!==t&&15!==t||"P"!==e.b[t]||(i-=10),40!==t&&41!==t&&42!==t&&43!==t&&44!==t&&45!==t&&46!==t&&47!==t||"p"!==e.b[t]||(i+=10),48!==t&&49!==t&&50!==t&&51!==t&&52!==t&&53!==t&&54!==t&&55!==t||"p"!==e.b[t]||(i+=20),(27!==t||"p"!==e.b[t]&&"P"!==e.b[t])&&(28!==t||"p"!==e.b[t]&&"P"!==e.b[t])&&(35!==t||"p"!==e.b[t]&&"P"!==e.b[t])&&(36!==t||"p"!==e.b[t]&&"P"!==e.b[t])||(this.isWhite(e.b[t])?i-=25:i+=25))
return i},minimax:function(e,i,t,n,r){if(0===i){var a=this.positionalPoints(e)
return{mv:e.mv,points:a}}var o=void 0,s=[],l=void 0,d=e.b.length
for(l=0;l<d;l++)if("b"===e.ToMove){if(this.isBlack(e.b[l])){var c=e.b[l],f=!1
e.fromIndex=l,e.fromIndex>47&&e.fromIndex<56&&"p"===c&&(f=!0)
var p=this.grid[c],h=void 0,u=p.length
for(h=0;h<u;h++){var v=p[h],b=void 0,m=v.length
for(b=0;b<m;b++)if(e.toIndex=l+v[b],e.piecePromotion=f?"q":"",e.valid=!0,this.checkValid(e))f?(s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex))
else if(e.b[e.toIndex]+""!="1")break}}}else if(this.isWhite(e.b[l])){var g=e.b[l],x=!1
e.fromIndex=l,"P"!==g?g=g.toLowerCase():e.fromIndex<16&&e.fromIndex>7&&(x=!0)
var I=this.grid[g],y=void 0,P=I.length
for(y=0;y<P;y++){var k=I[y],E=void 0,T=k.length
for(E=0;E<T;E++)if(e.toIndex=l+k[E],e.piecePromotion=x?"q":"",e.valid=!0,this.checkValid(e))x?(s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"q"),s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"r"),s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"b"),s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex)+"n")):s.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex))
else if(e.b[e.toIndex]+""!="1")break}}if(t){var M=-1e6,w="",O=void 0,C=s.length
for(O=0;O<C;O++){var A=s[O],B=A.split(""),_=[]
_[0]=B[0]+B[1],_[1]=B[2]+B[3],_[2]=B[4],e.fromIndex=this.algebraicToIndex(_[0]),e.toIndex=this.algebraicToIndex(_[1]),e.mv=A,_[2]?e.piecePromotion=_[2]:e.piecePromotion="",o=this.makeMove(e)
var q=this.minimax(o,i-1,!1,n,r)
if(q.points>M&&(M=q.points,w=A),q.points>n&&(n=q.points),n>=r)break}return{mv:w,points:M}}var W=1e6,j="",N=void 0,K=s.length
for(N=0;N<K;N++){var z=s[N],S=z.split(""),R=[]
R[0]=S[0]+S[1],R[1]=S[2]+S[3],R[2]=S[4],e.fromIndex=this.algebraicToIndex(R[0]),e.toIndex=this.algebraicToIndex(R[1]),R[2]?e.piecePromotion=R[2]:e.piecePromotion="",e.mv=z,o=this.makeMove(e)
var F=this.minimax(o,i-1,!0,n,r)
if(F.points<W&&(W=F.points,j=z),F.points<r&&(r=F.points),n>=r)break}return{mv:j,points:W}},actions:{playMove:function(){var e=this,i=Ember.get(this,"move"),t=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),n=Ember.get(this,"boardArray").toArray(),r=this.mvToMoveObject(t,i,n)
if(this.checkValid(r)){var a=this.makeMove(r)
Ember.set(this,"fen",a.Fen),Ember.run.later(function(){var i=Ember.get(e,"move"),t=JSON.parse(JSON.stringify(Ember.get(e,"fenInfo"))),n=Ember.get(e,"boardArray").toArray(),r=e.mvToMoveObject(t,i,n),a=e.minimax(r,4,!0,-1e6,1e6)
if(-1e6===a.points)console.log("x")
else{console.log(a)
var o=a.mv.split(""),s=[]
s[0]=o[0]+o[1],s[1]=o[2]+o[3],s[2]=o[4],r.fromIndex=e.algebraicToIndex(s[0]),r.toIndex=e.algebraicToIndex(s[1]),s[2]?r.piecePromotion=s[2]:r.piecePromotion=""
var l=e.makeMove(r)
Ember.set(e,"fen",l.Fen),Ember.set(e,"move","")}},500)}}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,i,t){function n(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=i.default.APP.version,a=n.versionOnly||n.hideSha,o=n.shaOnly||n.hideVersion,s=null
return a&&(n.showExtended&&(s=r.match(t.versionExtendedRegExp)),s||(s=r.match(t.versionRegExp))),o&&(s=r.match(t.shaRegExp)),s?s[0]:r}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=n,e.default=Ember.Helper.helper(n)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=i.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,i,t){Object.defineProperty(e,"__esModule",{value:!0})
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
t.map(function(){}),e.default=t}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"6wRSI2Et",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","row"],[9],[0,"\\n\\n"],[7,"div"],[11,"class","column1"],[9],[0,"\\n"],[1,[27,"input",null,[["type","value","placeholder","size"],["text",[23,["fen"]],"Vul hier een FEN in",60]]],false],[0," "],[7,"br"],[9],[10],[0,"\\n"],[7,"br"],[9],[10],[0,"\\n\\n"],[1,[27,"input",null,[["class","type","value","placeholder","size"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],"",30]]],false],[0,"\\n"],[7,"button"],[3,"action",[[22,0,[]],"playMove"]],[9],[0,"Move"],[10],[0,"\\n"],[10],[0,"\\n\\n"],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"       "],[7,"div"],[12,"class",[22,1,[]]],[9],[10],[0,"\\n"]],"parameters":[1]},null],[10],[0,"\\n"],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[0,"  "],[7,"b"],[9],[0,"To Move :"],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n  "],[7,"h4"],[9],[0,"Castling Availabilty"],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"En passant target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[10],[0,"\\n"],[1,[21,"outlet"],false],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",i=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),t={default:JSON.parse(unescape(i))}
return Object.defineProperty(t,"__esModule",{value:!0}),t}catch(i){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+453f9132"})
