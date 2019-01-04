"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,t,i,n){Object.defineProperty(e,"__esModule",{value:!0})
var r=Ember.Application.extend({modulePrefix:n.default.modulePrefix,podModulePrefix:n.default.podModulePrefix,Resolver:t.default});(0,i.default)(r,n.default.modulePrefix),e.default=r}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",board:Ember.computed(function(){var e,t,i=[]
for(e=0;e<4;e++){for(t=0;t<4;t++)i.push("tile white"),i.push("tile black")
for(t=0;t<4;t++)i.push("tile black"),i.push("tile white")}return i}),boardArray:Ember.computed("fen",function(){var e,t=Ember.get(this,"fen").toString(),i=[]
t=(t=t.replace(/ .+$/,"")).replace(/\//g,"")
var n,r=0
for(e=0;e<t.length;e++){var a=t[e]
if(isNaN(a))i[r]=a,r++
else for(var s=0;s<Number(a);s++)i[r]=1,r++}if(64!==r)for(i=[],n=0;n<64;n++)i[n]=1
return i}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=Ember.get(this,"move"),t=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),i=Ember.get(this,"boardArray").toArray(),n=this.mvToMoveObject(t,e,i)
return this.checkValid(n)}),tiles:Ember.computed("board","boardArray",function(){var e,t=Ember.get(this,"board").toArray(),i=Ember.get(this,"boardArray").toArray()
for(e=0;e<i.length;e++){var n=i[e]
1!==n&&(t[e]=t[e]+" "+this.fenToMbn(n))}return t}),fenInfo:Ember.computed("fen",function(){var e=Ember.get(this,"fen").toString()
if(e){var t=e,i=(e=e.replace(/^.+? /,"")).split(" ")
if(5==i.length){var n=i[2]
return n=n.replace(/-/g,""),{FenTrue:!0,Fen:t,ToMove:i[0],CastlingWk:i[1].includes("K"),CastlingWq:i[1].includes("Q"),CastlingBk:i[1].includes("k"),CastlingBq:i[1].includes("q"),EnPassant:n}}}return{FenTrue:!1}}),checkValid:function(e){var t=!1
if(this.checkMove(e).valid){t=!0
var i=this.makeMove(e),n=!1
if("w"===i.ToMove){for(var r=0;r<i.b.length;r++)"k"===i.b[r]&&(i.toIndex=r,n=!0)
if(n)for(var a=0;a<i.b.length;a++)if(this.isWhite(i.b[a])){i.fromIndex=a
var s=this.checkMove(i)
s.valid&&(t=!1),i.CastlingCheck&&(2===i.toIndex?s.toIndex=3:s.toIndex=5,s.valid=!0,(s=this.checkMove(s)).valid&&(t=!1),s.toIndex=4,s.valid=!0,(s=this.checkMove(s)).valid&&(t=!1))}}else{for(var o=0;o<i.b.length;o++)"K"===i.b[o]&&(i.toIndex=o,n=!0)
if(n)for(var l=0;l<i.b.length;l++)if(this.isBlack(i.b[l])){i.fromIndex=l
var c=this.checkMove(i)
c.valid&&(t=!1),i.CastlingCheck&&(58===i.toIndex?c.toIndex=59:c.toIndex=61,c.valid=!0,(c=this.checkMove(c)).valid&&(t=!1),c.toIndex=60,c.valid=!0,(c=this.checkMove(c)).valid&&(t=!1))}}}else t=!1
return t},checkMove:function(e){var t=!1
if(e.valid){var i=e.fromIndex,n=e.toIndex,r=e.piecePromotion,a=e.b,s=[]
s[0]=i%8+1,s[1]=8-Math.floor(i/8),s[2]=n%8+1,s[3]=8-Math.floor(n/8)
var o=a[i]
if("w"===e.ToMove&&this.isBlack(a[i]))return e.valid=!1,e
if("b"===e.ToMove&&this.isWhite(a[i]))return e.valid=!1,e
if(s[3]<1||s[3]>8)return e.valid=!1,e
"P"===o&&(i-n==8&&this.isEmpty(a[n])&&(t=!0),"2"==s[1]&&i-n==16&&this.isEmpty(a[n])&&this.isEmpty(a[i-8])&&(t=!0),i-n!=9&&i-n!=7||!this.isBlack(a[n])||s[3]-s[1]!=1||(t=!0),i-n!=9&&i-n!=7||!this.isEmpty(a[n])||s[3]-s[1]!=1||this.algebraicToIndex(e.EnPassant)===n&&(t=!0),8==s[3]&&!0===t&&(t=!1,"n"!==r&&"b"!==r&&"r"!==r&&"q"!==r||(t=!0))),"p"===o&&(n-i==8&&this.isEmpty(a[n])&&(t=!0),"7"==s[1]&&n-i==16&&this.isEmpty(a[n])&&this.isEmpty(a[i+8])&&(t=!0),n-i!=9&&n-i!=7||!this.isWhite(a[n])||s[3]-s[1]!=-1||(t=!0),n-i!=9&&n-i!=7||!this.isEmpty(a[n])||s[3]-s[1]!=-1||this.algebraicToIndex(e.EnPassant)===n&&(t=!0),1==s[3]&&!0===t&&(t=!1,"n"!==r&&"b"!==r&&"r"!==r&&"q"!==r||(t=!0))),"N"===o&&(n-i!=-17&&n-i!=-15||!this.isBlackOrEmpty(a[n])||s[3]-s[1]!=2||(t=!0),n-i!=17&&n-i!=15||!this.isBlackOrEmpty(a[n])||s[3]-s[1]!=-2||(t=!0),n-i!=-6&&n-i!=-10||!this.isBlackOrEmpty(a[n])||s[3]-s[1]!=1||(t=!0),n-i!=6&&n-i!=10||!this.isBlackOrEmpty(a[n])||s[3]-s[1]!=-1||(t=!0)),"n"===o&&(n-i!=-17&&n-i!=-15||!this.isWhiteOrEmpty(a[n])||s[3]-s[1]!=2||(t=!0),n-i!=17&&n-i!=15||!this.isWhiteOrEmpty(a[n])||s[3]-s[1]!=-2||(t=!0),n-i!=-6&&n-i!=-10||!this.isWhiteOrEmpty(a[n])||s[3]-s[1]!=1||(t=!0),n-i!=6&&n-i!=10||!this.isWhiteOrEmpty(a[n])||s[3]-s[1]!=-1||(t=!0)),"K"===o&&((58===n&&e.CastlingWq||62===n&&e.CastlingWk)&&60===i?this.lineCheck(i,n,a,o+"0-0")&&this.isEmpty(a[n])&&(t=!0):this.lineCheck(i,n,a,o)&&this.isBlackOrEmpty(a[n])&&(t=!0)),"k"===o&&((2===n&&e.CastlingBq||6===n&&e.CastlingBk)&&4===i?this.lineCheck(i,n,a,o+"0-0")&&this.isEmpty(a[n])&&(t=!0):this.lineCheck(i,n,a,o)&&this.isWhiteOrEmpty(a[n])&&(t=!0)),"Q"!==o&&"R"!==o&&"B"!==o||this.lineCheck(i,n,a,o)&&this.isBlackOrEmpty(a[n])&&(t=!0),"q"!==o&&"r"!==o&&"b"!==o||this.lineCheck(i,n,a,o)&&this.isWhiteOrEmpty(a[n])&&(t=!0)}return e.valid=t,e},makeMove:function(e){var t=JSON.parse(JSON.stringify(e)),i=t.Fen
if(i){var n=i
i=(i=i.replace(/ .+$/,"")).replace(/\//g,"")
var r=(n=n.replace(/^.+? /,"")).split(" ")
"w"===r[0].toLowerCase()?(r[0]="b",t.ToMove="b"):"b"===r[0].toLowerCase()&&(r[0]="w",t.ToMove="w")
var a=t.fromIndex,s=t.toIndex,o=t.piecePromotion,l=t.b,c=[]
c[0]=a%8+1,c[1]=8-Math.floor(a/8),c[2]=s%8+1,c[3]=8-Math.floor(s/8)
var f=l[a]
l[a]=1,l[s]=f,"K"===f&&(r[1]=r[1].replace(/K/,""),r[1]=r[1].replace(/Q/,""),62===s&&60===a&&(l[63]=1,l[61]="R",t.CastlingCheck=!0),58===s&&60===a&&(l[56]=1,l[59]="R",t.CastlingCheck=!0)),"k"===f&&(r[1]=r[1].replace(/k/,""),r[1]=r[1].replace(/q/,""),2===s&&4===a&&(l[0]=1,l[3]="r",t.CastlingCheck=!0),6===s&&4===a&&(l[7]=1,l[5]="r",t.CastlingCheck=!0)),"R"===f&&(56===a&&(r[1]=r[1].replace(/Q/,"")),63===a&&(r[1]=r[1].replace(/K/,""))),"r"===f&&(0===a&&(r[1]=r[1].replace(/q/,"")),7===a&&(r[1]=r[1].replace(/k/,""))),r[2]="-","P"===f&&(s<8&&(l[s]=o.toUpperCase()),a-s==16&&(r[2]=this.indexToAlgebraic(a-8)),this.algebraicToIndex(t.EnPassant)===s&&(l[s+8]=1)),"p"===f&&(s>55&&(l[s]=o.toLowerCase()),s-a==16&&(r[2]=this.indexToAlgebraic(a+8)),this.algebraicToIndex(t.EnPassant)===s&&(l[s-8]=1)),r[1]||(r[1]="-")
for(var d="",p=0,u=0;u<8;u++){for(var h=0,m=0;m<8;m++){var v=l[p]
p++,isNaN(v)?(h&&(d+=h),d+=v,h=0):h++}h&&(d+=h),u<7&&(d+="/")}d=d+" "+r.join(" ")}var b=r[2]
return b=b.replace(/-/g,""),t.b=l,t.Fen=d,t.CastlingWk=r[1].includes("K"),t.CastlingWq=r[1].includes("Q"),t.CastlingBk=r[1].includes("k"),t.CastlingBq=r[1].includes("q"),t.EnPassant=b,t},lineCheck:function(e,t,i,n){var r=!0,a=e%8,s=Math.floor(e/8),o=t%8,l=Math.floor(t/8),c=Math.abs(a-o),f=Math.abs(s-l),d=(t-e)/Math.max(c,f)
if(("Q"===n||"q"===n)&&0!==c&&0!==f&&c!==f)return!1
if(("R"===n||"r"===n)&&0!==c&&0!==f)return!1
if(("B"===n||"b"===n)&&c!==f)return!1
if(("K"===n||"k"===n)&&(c>1||f>1))return!1
if(("K0-0"===n||"k0-0"===n)&&2!==c&&0!==f)return!1
for(var p=e+d;p!==t;p+=d)this.isEmpty(i[p])||(r=!1)
return r},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var t=e.toLowerCase()
return t===e?"b"+t:"w"+t},algebraicToIndex:function(e){var t=e.split("")
if(2===t.length){var i=this.uciToNumber(t[0])
return 8*(8-t[1])+i-1}return-1},indexToAlgebraic:function(e){var t=e%8+1,i=8-Math.floor(e/8)
return String.fromCharCode(t+96)+i},mvToMoveObject:function(e,t,i){var n=JSON.parse(JSON.stringify(e)),r=!1
if(t&&t.length>3&&t.length<6){r=!0
var a=t.split(""),s=[]
s[0]=a[0]+a[1],s[1]=a[2]+a[3],s[2]=a[4],n.fromIndex=this.algebraicToIndex(s[0]),n.toIndex=this.algebraicToIndex(s[1]),s[2]&&(n.piecePromotion=s[2].toLowerCase()),n.b=i}return n.valid=r,n},minimax:function(e,t,i,n,r){if(0===t){for(var a={1:0,p:100,n:300,b:300,r:500,q:900,k:0,P:-100,N:-300,B:-300,R:-500,Q:-900,K:0},s=0,o=0;o<e.b.length;o++)s+=a[e.b[o]]
return{mv:e.mv,points:s}}for(var l,c=[],f={p:[[7],[8,16],[9]],P:[[-7],[-8,-16],[-9]],n:[[17],[15],[10],[6],[-6],[-10],[-15],[-17]],b:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63]],r:[[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],q:[[9,18,27,36,45,54,63],[7,14,21,28,35,42,49],[-7,-14,-21,-28,-35,-42,-49],[-9,-18,-27,-36,-45,-54,-63],[8,16,24,32,40,48,56],[1,2,3,4,5,6,7],[-1,-2,-3,-4,-5,-6,-7],[-8,-16,-24,-32,-40,-48,-56]],k:[[9],[8],[7],[1,2],[-1,-2],[-7],[-8],[-9]]},d=0;d<e.b.length;d++)if("b"===e.ToMove){if(this.isBlack(e.b[d])){e.fromIndex=d
for(var p=f[e.b[d]],u=0;u<p.length;u++)for(var h=p[u],m=0;m<h.length&&(e.toIndex=d+h[m],e.valid=!0,this.checkValid(e));m++)c.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex))}}else if(this.isWhite(e.b[d])){var v=e.b[d]
"P"!==v&&(v=v.toLowerCase()),e.fromIndex=d
for(var b=f[v],g=0;g<b.length;g++)for(var x=b[g],y=0;y<x.length&&(e.toIndex=d+x[y],e.valid=!0,this.checkValid(e));y++)c.push(this.indexToAlgebraic(e.fromIndex)+this.indexToAlgebraic(e.toIndex))}if(t>1&&console.log(c.length+"<- ->"+t),0!==c.length){if(i){for(var k=-1e6,E="",M=0;M<c.length;M++){var I=c[M],P=I.split(""),w=[]
w[0]=P[0]+P[1],w[1]=P[2]+P[3],w[2]=P[4],e.fromIndex=this.algebraicToIndex(w[0]),e.toIndex=this.algebraicToIndex(w[1]),e.mv=I,l=this.makeMove(e)
var C=this.minimax(l,t-1,!1,n,r)
if(C.points>k&&(k=C.points,E=I),C.points>n&&(n=C.points),n>=r){console.log("breakMax")
break}}return{mv:E,points:k}}for(var O=1e6,T="",_=0;_<c.length;_++){var A=c[_],B=A.split(""),j=[]
j[0]=B[0]+B[1],j[1]=B[2]+B[3],j[2]=B[4],e.fromIndex=this.algebraicToIndex(j[0]),e.toIndex=this.algebraicToIndex(j[1]),e.mv=A,l=this.makeMove(e)
var N=this.minimax(l,t-1,!0,n,r)
if(N.points<O&&(O=N.points,T=A),N.points<r&&(r=N.points),n>=r){console.log("breakMin")
break}}return{mv:T,points:O}}var q=-1e6
return i&&(q=1e6),{mv:e.mv,points:q}},actions:{playMove:function(){var e=this,t=Ember.get(this,"move"),i=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),n=Ember.get(this,"boardArray").toArray(),r=this.mvToMoveObject(i,t,n)
if(this.checkValid(r)){var a=this.makeMove(r)
Ember.set(this,"fen",a.Fen),Ember.run.later(function(){var t=Ember.get(e,"move"),i=JSON.parse(JSON.stringify(Ember.get(e,"fenInfo"))),n=Ember.get(e,"boardArray").toArray(),r=e.mvToMoveObject(i,t,n),a=e.minimax(r,2,!0,-1e6,1e6)
if(-1e6===a.points||1e6===a.points)console.log("mat of pat")
else{console.log(a)
var s=a.mv.split(""),o=[]
o[0]=s[0]+s[1],o[1]=s[2]+s[3],o[2]=s[4],r.fromIndex=e.algebraicToIndex(o[0]),r.toIndex=e.algebraicToIndex(o[1])
var l=e.makeMove(r)
Ember.set(e,"fen",l.Fen),Ember.set(e,"move","")}},500)}}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,i){function n(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.default.APP.version,a=n.versionOnly||n.hideSha,s=n.shaOnly||n.hideVersion,o=null
return a&&(n.showExtended&&(o=r.match(i.versionExtendedRegExp)),o||(o=r.match(i.versionRegExp))),s&&(o=r.match(i.shaRegExp)),o?o[0]:r}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=n,e.default=Ember.Helper.helper(n)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,t,i){Object.defineProperty(e,"__esModule",{value:!0})
var n=void 0,r=void 0
i.default.APP&&(n=i.default.APP.name,r=i.default.APP.version),e.default={name:"App Version",initialize:(0,t.default)(n,r)}}),define("pwschess/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("pwschess/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("pwschess/initializers/export-application-global",["exports","pwschess/config/environment"],function(e,t){function i(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var i
if("undefined"!=typeof window)i=window
else if("undefined"!=typeof global)i=global
else{if("undefined"==typeof self)return
i=self}var n,r=t.default.exportApplicationGlobal
n="string"==typeof r?r:Ember.String.classify(t.default.modulePrefix),i[n]||(i[n]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete i[n]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=i,e.default={name:"export-application-global",initialize:i}}),define("pwschess/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("pwschess/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/router",["exports","pwschess/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var i=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
i.map(function(){}),e.default=i}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"6wRSI2Et",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","row"],[9],[0,"\\n\\n"],[7,"div"],[11,"class","column1"],[9],[0,"\\n"],[1,[27,"input",null,[["type","value","placeholder","size"],["text",[23,["fen"]],"Vul hier een FEN in",60]]],false],[0," "],[7,"br"],[9],[10],[0,"\\n"],[7,"br"],[9],[10],[0,"\\n\\n"],[1,[27,"input",null,[["class","type","value","placeholder","size"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],"",30]]],false],[0,"\\n"],[7,"button"],[3,"action",[[22,0,[]],"playMove"]],[9],[0,"Move"],[10],[0,"\\n"],[10],[0,"\\n\\n"],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"       "],[7,"div"],[12,"class",[22,1,[]]],[9],[10],[0,"\\n"]],"parameters":[1]},null],[10],[0,"\\n"],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[0,"  "],[7,"b"],[9],[0,"To Move :"],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n  "],[7,"h4"],[9],[0,"Castling Availabilty"],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n  "],[7,"b"],[9],[0,"En passant target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[10],[0,"\\n"],[1,[21,"outlet"],false],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),i={default:JSON.parse(unescape(t))}
return Object.defineProperty(i,"__esModule",{value:!0}),i}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+e40104d6"})
