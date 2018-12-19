"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,t,r,i){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Application.extend({modulePrefix:i.default.modulePrefix,podModulePrefix:i.default.podModulePrefix,Resolver:t.default});(0,r.default)(n,i.default.modulePrefix),e.default=n}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",board:Ember.computed(function(){var e,t,r=[]
for(e=0;e<4;e++){for(t=0;t<4;t++)r.push("tile white"),r.push("tile black")
for(t=0;t<4;t++)r.push("tile black"),r.push("tile white")}return r}),boardArray:Ember.computed("fen",function(){var e,t=Ember.get(this,"fen").toString(),r=[]
t=(t=t.replace(/ .+$/,"")).replace(/\//g,"")
var i,n=0
for(e=0;e<t.length;e++){var a=t[e]
if(isNaN(a))r[n]=a,n++
else for(var s=0;s<Number(a);s++)r[n]=1,n++}if(64!==n)for(r=[],i=0;i<64;i++)r[i]=1
return r}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=Ember.get(this,"move"),t=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),r=Ember.get(this,"boardArray").toArray(),i=this.mvToMoveObject(t,e,r)
return this.checkValid(i)}),tiles:Ember.computed("board","boardArray",function(){var e,t=Ember.get(this,"board").toArray(),r=Ember.get(this,"boardArray").toArray()
for(e=0;e<r.length;e++){var i=r[e]
1!==i&&(t[e]=t[e]+" "+this.fenToMbn(i))}return t}),fenInfo:Ember.computed("fen",function(){console.log("fenInfo")
var e=Ember.get(this,"fen").toString()
if(e){var t=e,r=(e=e.replace(/^.+? /,"")).split(" ")
if(5==r.length){var i=r[2]
return i=i.replace(/-/g,""),{FenTrue:!0,Fen:t,ToMove:r[0],CastlingWk:r[1].includes("K"),CastlingWq:r[1].includes("Q"),CastlingBk:r[1].includes("k"),CastlingBq:r[1].includes("q"),EnPassant:i}}}return{FenTrue:!1}}),checkValid:function(e){var t=!1
if(this.checkMove(e).valid){t=!0
var r=this.makeMove(e)
if("w"===r.ToMove){for(var i=0;i<r.b.length;i++)"k"===r.b[i]&&(r.toIndex=i)
for(var n=0;n<r.b.length;n++)if(this.isWhite(r.b[n])){r.fromIndex=n
var a=this.checkMove(r)
a.valid&&(t=!1),r.CastlingCheck&&(2===r.toIndex?a.toIndex=3:a.toIndex=5,a.valid=!0,(a=this.checkMove(a)).valid&&(t=!1),a.toIndex=4,a.valid=!0,(a=this.checkMove(a)).valid&&(t=!1))}}else{for(var s=0;s<r.b.length;s++)"K"===r.b[s]&&(r.toIndex=s)
for(var o=0;o<r.b.length;o++)if(this.isBlack(r.b[o])){r.fromIndex=o
var l=this.checkMove(r)
l.valid&&(t=!1),r.CastlingCheck&&(58===r.toIndex?l.toIndex=59:l.toIndex=61,l.valid=!0,(l=this.checkMove(l)).valid&&(t=!1),l.toIndex=60,l.valid=!0,(l=this.checkMove(l)).valid&&(t=!1))}}}else t=!1
return t},checkMove:function(e){var t=!1,r=JSON.parse(JSON.stringify(e))
if(r.valid){var i=r.fromIndex,n=r.toIndex,a=r.piecePromotion,s=r.b,o=[]
o[0]=i%8+1,o[1]=8-Math.floor(i/8),o[2]=n%8+1,o[3]=8-Math.floor(n/8)
var l=s[i]
if("w"===r.ToMove&&this.isBlack(s[i]))return r.valid=!1,r
if("b"===r.ToMove&&this.isWhite(s[i]))return r.valid=!1,r
if(o[3]<1||o[3]>8)return r.valid=!1,r
"P"===l&&(i-n==8&&this.isEmpty(s[n])&&(t=!0),"2"==o[1]&&i-n==16&&this.isEmpty(s[n])&&this.isEmpty(s[i-8])&&(t=!0),i-n!=9&&i-n!=7||!this.isBlack(s[n])||o[3]-o[1]!=1||(t=!0),i-n!=9&&i-n!=7||!this.isEmpty(s[n])||o[3]-o[1]!=1||this.algebraicToIndex(r.EnPassant)===n&&(t=!0),8==o[3]&&!0===t&&(t=!1,"n"!==a&&"b"!==a&&"r"!==a&&"q"!==a||(t=!0))),"p"===l&&(n-i==8&&this.isEmpty(s[n])&&(t=!0),"7"==o[1]&&n-i==16&&this.isEmpty(s[n])&&this.isEmpty(s[i+8])&&(t=!0),n-i!=9&&n-i!=7||!this.isWhite(s[n])||o[3]-o[1]!=-1||(t=!0),n-i!=9&&n-i!=7||!this.isEmpty(s[n])||o[3]-o[1]!=-1||this.algebraicToIndex(r.EnPassant)===n&&(t=!0),1==o[3]&&!0===t&&(t=!1,"n"!==a&&"b"!==a&&"r"!==a&&"q"!==a||(t=!0))),"N"===l&&(n-i!=-17&&n-i!=-15||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=2||(t=!0),n-i!=17&&n-i!=15||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=-2||(t=!0),n-i!=-6&&n-i!=-10||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=1||(t=!0),n-i!=6&&n-i!=10||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=-1||(t=!0)),"n"===l&&(n-i!=-17&&n-i!=-15||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=2||(t=!0),n-i!=17&&n-i!=15||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=-2||(t=!0),n-i!=-6&&n-i!=-10||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=1||(t=!0),n-i!=6&&n-i!=10||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=-1||(t=!0)),"K"===l&&((58===n&&r.CastlingWq||62===n&&r.CastlingWk)&&60===i?this.lineCheck(i,n,s,l+"0-0")&&this.isEmpty(s[n])&&(t=!0):this.lineCheck(i,n,s,l)&&this.isBlackOrEmpty(s[n])&&(t=!0)),"k"===l&&((2===n&&r.CastlingBq||6===n&&r.CastlingBk)&&4===i?this.lineCheck(i,n,s,l+"0-0")&&this.isEmpty(s[n])&&(t=!0):this.lineCheck(i,n,s,l)&&this.isWhiteOrEmpty(s[n])&&(t=!0)),"Q"!==l&&"R"!==l&&"B"!==l||this.lineCheck(i,n,s,l)&&this.isBlackOrEmpty(s[n])&&(t=!0),"q"!==l&&"r"!==l&&"b"!==l||this.lineCheck(i,n,s,l)&&this.isWhiteOrEmpty(s[n])&&(t=!0)}return r.valid=t,r},makeMove:function(e){var t=JSON.parse(JSON.stringify(e)),r=t.Fen
if(r){var i=r
r=(r=r.replace(/ .+$/,"")).replace(/\//g,"")
var n=(i=i.replace(/^.+? /,"")).split(" ")
"w"===n[0].toLowerCase()?(n[0]="b",t.ToMove="b"):"b"===n[0].toLowerCase()&&(n[0]="w",t.ToMove="w")
var a=t.fromIndex,s=t.toIndex,o=t.piecePromotion,l=t.b,f=[]
f[0]=a%8+1,f[1]=8-Math.floor(a/8),f[2]=s%8+1,f[3]=8-Math.floor(s/8)
var c=l[a]
l[a]=1,l[s]=c,"K"===c&&(n[1]=n[1].replace(/K/,""),n[1]=n[1].replace(/Q/,""),62===s&&60===a&&(l[63]=1,l[61]="R",t.CastlingCheck=!0),58===s&&60===a&&(l[56]=1,l[59]="R",t.CastlingCheck=!0)),"k"===c&&(n[1]=n[1].replace(/k/,""),n[1]=n[1].replace(/q/,""),2===s&&4===a&&(l[0]=1,l[3]="r",t.CastlingCheck=!0),6===s&&4===a&&(l[7]=1,l[5]="r",t.CastlingCheck=!0)),"R"===c&&(56===a&&(n[1]=n[1].replace(/Q/,"")),63===a&&(n[1]=n[1].replace(/K/,""))),"r"===c&&(0===a&&(n[1]=n[1].replace(/q/,"")),7===a&&(n[1]=n[1].replace(/k/,""))),n[2]="-","P"===c&&(s<8&&(l[s]=o.toUpperCase()),a-s==16&&(n[2]=this.indexToAlgebraic(a-8)),this.algebraicToIndex(t.EnPassant)===s&&(l[s+8]=1)),"p"===c&&(s>55&&(l[s]=o.toLowerCase()),s-a==16&&(n[2]=this.indexToAlgebraic(a+8)),this.algebraicToIndex(t.EnPassant)===s&&(l[s-8]=1)),n[1]||(n[1]="-")
for(var p="",u=0,d=0;d<8;d++){for(var h=0,m=0;m<8;m++){var v=l[u]
u++,isNaN(v)?(h&&(p+=h),p+=v,h=0):h++}h&&(p+=h),d<7&&(p+="/")}p=p+" "+n.join(" ")}return t.b=l,t.Fen=p,t},lineCheck:function(e,t,r,i){var n=!0,a=e%8,s=Math.floor(e/8),o=t%8,l=Math.floor(t/8),f=Math.abs(a-o),c=Math.abs(s-l),p=(t-e)/Math.max(f,c)
if(("Q"===i||"q"===i)&&0!==f&&0!==c&&f!==c)return!1
if(("R"===i||"r"===i)&&0!==f&&0!==c)return!1
if(("B"===i||"b"===i)&&f!==c)return!1
if(("K"===i||"k"===i)&&(f>1||c>1))return!1
if(("K0-0"===i||"k0-0"===i)&&2!==f&&0!==c)return!1
for(var u=e+p;u!==t;u+=p)this.isEmpty(r[u])||(n=!1)
return n},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var t=e.toLowerCase()
return t===e?"b"+t:"w"+t},algebraicToIndex:function(e){var t=e.split("")
if(2===t.length){var r=this.uciToNumber(t[0])
return 8*(8-t[1])+r-1}return-1},indexToAlgebraic:function(e){var t=e%8+1,r=8-Math.floor(e/8)
return String.fromCharCode(t+96)+r},mvToMoveObject:function(e,t,r){var i=JSON.parse(JSON.stringify(e)),n=!1
if(t&&t.length>3&&t.length<6){n=!0
var a=t.split(""),s=[]
s[0]=a[0]+a[1],s[1]=a[2]+a[3],s[2]=a[4],i.fromIndex=this.algebraicToIndex(s[0]),i.toIndex=this.algebraicToIndex(s[1]),s[2]&&(i.piecePromotion=s[2].toLowerCase()),i.b=r}return i.valid=n,i},actions:{playMove:function(){var e=this,t=Ember.get(this,"move"),r=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),i=Ember.get(this,"boardArray").toArray(),n=this.mvToMoveObject(r,t,i)
if(this.checkValid(n)){var a=this.makeMove(n)
Ember.set(this,"fen",a.Fen),Ember.run.later(function(){for(var t,r=Ember.get(e,"move"),i=JSON.parse(JSON.stringify(Ember.get(e,"fenInfo"))),n=Ember.get(e,"boardArray").toArray(),a=e.mvToMoveObject(i,r,n),s=!1;!s;)for(var o=0;o<a.b.length;o++)e.isBlack(a.b[o])&&!s&&(a.fromIndex=o,s||(a.toIndex=Math.floor(63*Math.random()),a.fromIndex!==a.toIndex&&(a.valid=!0,s=e.checkValid(a))))
console.log("ok"),t=e.makeMove(a),Ember.set(e,"fen",t.Fen),Ember.set(e,"move","")},1500)}}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,r){function i(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.default.APP.version,a=i.versionOnly||i.hideSha,s=i.shaOnly||i.hideVersion,o=null
return a&&(i.showExtended&&(o=n.match(r.versionExtendedRegExp)),o||(o=n.match(r.versionRegExp))),s&&(o=n.match(r.shaRegExp)),o?o[0]:n}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=i,e.default=Ember.Helper.helper(i)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,t,r){Object.defineProperty(e,"__esModule",{value:!0})
var i=void 0,n=void 0
r.default.APP&&(i=r.default.APP.name,n=r.default.APP.version),e.default={name:"App Version",initialize:(0,t.default)(i,n)}}),define("pwschess/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("pwschess/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("pwschess/initializers/export-application-global",["exports","pwschess/config/environment"],function(e,t){function r(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var r
if("undefined"!=typeof window)r=window
else if("undefined"!=typeof global)r=global
else{if("undefined"==typeof self)return
r=self}var i,n=t.default.exportApplicationGlobal
i="string"==typeof n?n:Ember.String.classify(t.default.modulePrefix),r[i]||(r[i]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete r[i]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=r,e.default={name:"export-application-global",initialize:r}}),define("pwschess/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("pwschess/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/router",["exports","pwschess/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var r=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
r.map(function(){}),e.default=r}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"t+Jpgm81",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","row"],[9],[0,"\\n\\n"],[7,"div"],[11,"class","column1"],[9],[0,"\\n"],[1,[27,"input",null,[["type","value","placeholder","size"],["text",[23,["fen"]],"Vul hier een FEN in",60]]],false],[0," "],[7,"br"],[9],[10],[0,"\\n"],[7,"br"],[9],[10],[0,"\\n\\n"],[1,[27,"input",null,[["class","type","value","placeholder","size"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],"",30]]],false],[0,"\\n"],[7,"button"],[3,"action",[[22,0,[]],"playMove"]],[9],[0,"Move"],[10],[0,"\\n"],[10],[0,"\\n\\n"],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"       "],[7,"div"],[12,"class",[22,1,[]]],[9],[10],[0,"\\n"]],"parameters":[1]},null],[10],[0,"\\n"],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[7,"b"],[9],[0,"To Move :"],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n"],[7,"h4"],[9],[0,"Castling Availabilty"],[10],[0,"\\n"],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"En passant target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[10],[0,"\\n"],[1,[21,"outlet"],false],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),r={default:JSON.parse(unescape(t))}
return Object.defineProperty(r,"__esModule",{value:!0}),r}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+2653238f"})
