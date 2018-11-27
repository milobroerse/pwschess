"use strict"
define("pwschess/app",["exports","pwschess/resolver","ember-load-initializers","pwschess/config/environment"],function(e,t,i,r){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:t.default});(0,i.default)(n,r.default.modulePrefix),e.default=n}),define("pwschess/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({queryParams:["fen"],fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",move:"",board:Ember.computed(function(){var e,t,i=[]
for(e=0;e<4;e++){for(t=0;t<4;t++)i.push("tile white"),i.push("tile black")
for(t=0;t<4;t++)i.push("tile black"),i.push("tile white")}return i}),boardArray:Ember.computed("fen",function(){var e,t=Ember.get(this,"fen").toString(),i=[]
t=(t=t.replace(/ .+$/,"")).replace(/\//g,"")
var r,n=0
for(e=0;e<t.length;e++){var a=t[e]
if(isNaN(a))i[n]=a,n++
else for(var s=0;s<Number(a);s++)i[n]=1,n++}if(64!==n)for(i=[],r=0;r<64;r++)i[r]=1
return i}),validMove:Ember.computed("move","boardArray","fenInfo",function(){var e=!1,t=Ember.get(this,"move"),i=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),r=Ember.get(this,"boardArray").toArray(),n=this.mvToMoveObject(i,t,r)
if(this.checkValid(n).valid){e=!0
var a=this.makeMove(n)
if("w"===a.ToMove){for(var s=0;s<a.b.length;s++)"k"===a.b[s]&&(a.toIndex=s)
for(var o=0;o<a.b.length;o++)if(this.isWhite(a.b[o])){a.fromIndex=o
var l=this.checkValid(a)
l.valid&&(e=!1),a.CastlingCheck&&(l=2===a.toIndex?3:5,(l=this.checkValid(l)).valid&&(e=!1))}}else{for(var f=0;f<a.b.length;f++)"K"===a.b[f]&&(a.toIndex=f)
for(var c=0;c<a.b.length;c++)if(this.isBlack(a.b[c])){a.fromIndex=c
var p=this.checkValid(a)
p.valid&&(e=!1),a.CastlingCheck&&(p=58===a.toIndex?59:61,(p=this.checkValid(p)).valid&&(e=!1))}}}else e=!1
return e}),tiles:Ember.computed("board","boardArray",function(){var e,t=Ember.get(this,"board").toArray(),i=Ember.get(this,"boardArray").toArray()
for(e=0;e<i.length;e++){var r=i[e]
1!==r&&(t[e]=t[e]+" "+this.fenToMbn(r))}return t}),fenInfo:Ember.computed("fen",function(){console.log("fenInfo")
var e=Ember.get(this,"fen").toString()
if(e){var t=e,i=(e=e.replace(/^.+? /,"")).split(" ")
if(5==i.length){var r=i[2]
return r=r.replace(/-/g,""),{FenTrue:!0,Fen:t,ToMove:i[0],CastlingWk:i[1].includes("K"),CastlingWq:i[1].includes("Q"),CastlingBk:i[1].includes("k"),CastlingBq:i[1].includes("q"),EnPassant:r}}}return{FenTrue:!1}}),checkValid:function(e){var t=!1,i=JSON.parse(JSON.stringify(e))
if(i.valid){var r=i.fromIndex,n=i.toIndex,a=i.piecePromotion,s=i.b,o=[]
o[0]=r%8+1,o[1]=8-Math.floor(r/8),o[2]=n%8+1,o[3]=8-Math.floor(n/8)
var l=s[r]
if("w"===i.ToMove&&this.isBlack(s[r]))return i.valid=!1,i
if("b"===i.ToMove&&this.isWhite(s[r]))return i.valid=!1,i
if(o[3]<1||o[3]>8)return i.valid=!1,i
"P"===l&&(r-n==8&&this.isEmpty(s[n])&&(t=!0),"2"==o[1]&&r-n==16&&this.isEmpty(s[n])&&this.isEmpty(s[r-8])&&(t=!0),r-n!=9&&r-n!=7||!this.isBlack(s[n])||o[3]-o[1]!=1||(t=!0),r-n!=9&&r-n!=7||!this.isEmpty(s[n])||o[3]-o[1]!=1||this.algebraicToIndex(i.EnPassant)===n&&(t=!0),8==o[3]&&!0===t&&(t=!1,"n"!==a&&"b"!==a&&"r"!==a&&"q"!==a||(t=!0))),"p"===l&&(n-r==8&&this.isEmpty(s[n])&&(t=!0),"7"==o[1]&&n-r==16&&this.isEmpty(s[n])&&this.isEmpty(s[r+8])&&(t=!0),n-r!=9&&n-r!=7||!this.isWhite(s[n])||o[3]-o[1]!=-1||(t=!0),n-r!=9&&n-r!=7||!this.isEmpty(s[n])||o[3]-o[1]!=-1||this.algebraicToIndex(i.EnPassant)===n&&(t=!0),1==o[3]&&!0===t&&(t=!1,"n"!==a&&"b"!==a&&"r"!==a&&"q"!==a||(t=!0))),"N"===l&&(n-r!=-17&&n-r!=-15||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=2||(t=!0),n-r!=17&&n-r!=15||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=-2||(t=!0),n-r!=-6&&n-r!=-10||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=1||(t=!0),n-r!=6&&n-r!=10||!this.isBlackOrEmpty(s[n])||o[3]-o[1]!=-1||(t=!0)),"n"===l&&(n-r!=-17&&n-r!=-15||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=2||(t=!0),n-r!=17&&n-r!=15||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=-2||(t=!0),n-r!=-6&&n-r!=-10||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=1||(t=!0),n-r!=6&&n-r!=10||!this.isWhiteOrEmpty(s[n])||o[3]-o[1]!=-1||(t=!0)),"K"===l&&((58===n&&i.CastlingWq||62===n&&i.CastlingWk)&&60===r?this.lineCheck(r,n,s,l+"0-0")&&this.isEmpty(s[n])&&(t=!0):this.lineCheck(r,n,s,l)&&this.isBlackOrEmpty(s[n])&&(t=!0)),"k"===l&&((2===n&&i.CastlingBq||6===n&&i.CastlingBk)&&4===r?this.lineCheck(r,n,s,l+"0-0")&&this.isEmpty(s[n])&&(t=!0):this.lineCheck(r,n,s,l)&&this.isWhiteOrEmpty(s[n])&&(t=!0)),"Q"!==l&&"R"!==l&&"B"!==l||this.lineCheck(r,n,s,l)&&this.isBlackOrEmpty(s[n])&&(t=!0),"q"!==l&&"r"!==l&&"b"!==l||this.lineCheck(r,n,s,l)&&this.isWhiteOrEmpty(s[n])&&(t=!0)}return i.valid=t,i},makeMove:function(e){var t=JSON.parse(JSON.stringify(e)),i=t.Fen
if(i){var r=i
i=(i=i.replace(/ .+$/,"")).replace(/\//g,"")
var n=(r=r.replace(/^.+? /,"")).split(" ")
"w"===n[0].toLowerCase()?(n[0]="b",t.ToMove="b"):"b"===n[0].toLowerCase()&&(n[0]="w",t.ToMove="w")
var a=t.fromIndex,s=t.toIndex,o=t.piecePromotion,l=t.b,f=[]
f[0]=a%8+1,f[1]=8-Math.floor(a/8),f[2]=s%8+1,f[3]=8-Math.floor(s/8)
var c=l[a]
l[a]=1,l[s]=c,"K"===c&&(n[1]=n[1].replace(/K/,""),n[1]=n[1].replace(/Q/,""),62===s&&60===a&&(l[63]=1,l[61]="R",t.CastlingCheck=!0),58===s&&60===a&&(l[56]=1,l[59]="R",t.CastlingCheck=!0)),"k"===c&&(n[1]=n[1].replace(/k/,""),n[1]=n[1].replace(/q/,""),2===s&&4===a&&(l[0]=1,l[3]="r",t.CastlingCheck=!0),6===s&&4===a&&(l[7]=1,l[5]="r",t.CastlingCheck=!0)),"R"===c&&(56===a&&(n[1]=n[1].replace(/Q/,"")),63===a&&(n[1]=n[1].replace(/K/,""))),"r"===c&&(0===a&&(n[1]=n[1].replace(/q/,"")),7===a&&(n[1]=n[1].replace(/k/,""))),n[2]="-","P"===c&&(s<8&&(l[s]=o.toUpperCase()),a-s==16&&(n[2]=this.indexToAlgebraic(a-8)),this.algebraicToIndex(t.EnPassant)===s&&(l[s+8]=1)),"p"===c&&(s>55&&(l[s]=o.toLowerCase()),s-a==16&&(n[2]=this.indexToAlgebraic(a+8)),this.algebraicToIndex(t.EnPassant)===s&&(l[s-8]=1)),n[1]||(n[1]="-")
for(var p="",u=0,d=0;d<8;d++){for(var h=0,m=0;m<8;m++){var b=l[u]
u++,isNaN(b)?(h&&(p+=h),p+=b,h=0):h++}h&&(p+=h),d<7&&(p+="/")}p=p+" "+n.join(" ")}return t.b=l,t.Fen=p,t},lineCheck:function(e,t,i,r){var n=!0,a=e%8,s=Math.floor(e/8),o=t%8,l=Math.floor(t/8),f=Math.abs(a-o),c=Math.abs(s-l),p=(t-e)/Math.max(f,c)
if(("Q"===r||"q"===r)&&0!==f&&0!==c&&f!==c)return!1
if(("R"===r||"r"===r)&&0!==f&&0!==c)return!1
if(("B"===r||"b"===r)&&f!==c)return!1
if(("K"===r||"k"===r)&&(f>1||c>1))return!1
if(("K0-0"===r||"k0-0"===r)&&2!==f&&0!==c)return!1
for(var u=e+p;u!==t;u+=p)this.isEmpty(i[u])||(n=!1)
return n},isEmpty:function(e){return 1===e},isBlack:function(e){return"p"===e||"n"===e||"b"===e||"r"===e||"q"===e||"k"===e},isBlackOrEmpty:function(e){return this.isBlack(e)||1===e},isWhite:function(e){return"P"===e||"N"===e||"B"===e||"R"===e||"Q"===e||"K"===e},isWhiteOrEmpty:function(e){return this.isWhite(e)||1===e},uciToNumber:function(e){return e.toLowerCase().charCodeAt(0)-96},fenToMbn:function(e){var t=e.toLowerCase()
return t===e?"b"+t:"w"+t},algebraicToIndex:function(e){var t=e.split("")
if(2===t.length){var i=this.uciToNumber(t[0])
return 8*(8-t[1])+i-1}return-1},indexToAlgebraic:function(e){var t=e%8+1,i=8-Math.floor(e/8)
return String.fromCharCode(t+96)+i},mvToMoveObject:function(e,t,i){var r=JSON.parse(JSON.stringify(e)),n=!1
if(t&&t.length>3&&t.length<6){n=!0
var a=t.split(""),s=[]
s[0]=a[0]+a[1],s[1]=a[2]+a[3],s[2]=a[4],r.fromIndex=this.algebraicToIndex(s[0]),r.toIndex=this.algebraicToIndex(s[1]),s[2]&&(r.piecePromotion=s[2].toLowerCase()),r.b=i}return r.valid=n,r},actions:{playMove:function(){var e=Ember.get(this,"move"),t=JSON.parse(JSON.stringify(Ember.get(this,"fenInfo"))),i=Ember.get(this,"boardArray").toArray(),r=this.mvToMoveObject(t,e,i),n=this.makeMove(r)
console.log(n),Ember.set(this,"fen",n.Fen)}}})}),define("pwschess/helpers/app-version",["exports","pwschess/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,i){function r(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.default.APP.version,a=r.versionOnly||r.hideSha,s=r.shaOnly||r.hideVersion,o=null
return a&&(r.showExtended&&(o=n.match(i.versionExtendedRegExp)),o||(o=n.match(i.versionRegExp))),s&&(o=n.match(i.shaRegExp)),o?o[0]:n}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=r,e.default=Ember.Helper.helper(r)}),define("pwschess/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("pwschess/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","pwschess/config/environment"],function(e,t,i){Object.defineProperty(e,"__esModule",{value:!0})
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
i.map(function(){}),e.default=i}),define("pwschess/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("pwschess/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"t+Jpgm81",block:'{"symbols":["tile"],"statements":[[7,"div"],[11,"class","row"],[9],[0,"\\n\\n"],[7,"div"],[11,"class","column1"],[9],[0,"\\n"],[1,[27,"input",null,[["type","value","placeholder","size"],["text",[23,["fen"]],"Vul hier een FEN in",60]]],false],[0," "],[7,"br"],[9],[10],[0,"\\n"],[7,"br"],[9],[10],[0,"\\n\\n"],[1,[27,"input",null,[["class","type","value","placeholder","size"],[[27,"unless",[[23,["validMove"]],"valid"],null],"text",[23,["move"]],"",30]]],false],[0,"\\n"],[7,"button"],[3,"action",[[22,0,[]],"playMove"]],[9],[0,"Move"],[10],[0,"\\n"],[10],[0,"\\n\\n"],[7,"div"],[11,"class","board column2"],[9],[0,"\\n"],[4,"each",[[23,["tiles"]]],null,{"statements":[[0,"       "],[7,"div"],[12,"class",[22,1,[]]],[9],[10],[0,"\\n"]],"parameters":[1]},null],[10],[0,"\\n"],[7,"div"],[11,"class","column3"],[9],[0,"\\n"],[4,"if",[[23,["fenInfo","FenTrue"]]],null,{"statements":[[7,"b"],[9],[0,"To Move :"],[10],[0," "],[1,[23,["fenInfo","ToMove"]],false],[7,"br"],[9],[10],[0,"\\n"],[7,"h4"],[9],[0,"Castling Availabilty"],[10],[0,"\\n"],[7,"b"],[9],[0,"White Long: "],[10],[4,"if",[[23,["fenInfo","CastlingWq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"White Short: "],[10],[4,"if",[[23,["fenInfo","CastlingWk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"Black Long: "],[10],[4,"if",[[23,["fenInfo","CastlingBq"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"Black Short: "],[10],[4,"if",[[23,["fenInfo","CastlingBk"]]],null,{"statements":[[0,"True"]],"parameters":[]},{"statements":[[0,"False"]],"parameters":[]}],[7,"br"],[9],[10],[0,"\\n"],[7,"b"],[9],[0,"En passant target: "],[10],[1,[23,["fenInfo","EnPassant"]],false],[0,"\\n"]],"parameters":[]},null],[10],[0,"\\n"],[1,[21,"outlet"],false],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"pwschess/templates/application.hbs"}})}),define("pwschess/config/environment",[],function(){try{var e="pwschess/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),i={default:JSON.parse(unescape(t))}
return Object.defineProperty(i,"__esModule",{value:!0}),i}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("pwschess/app").default.create({name:"pwschess",version:"0.0.0+9e6cdfc2"})
