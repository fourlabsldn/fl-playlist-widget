(function () {
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports), module.exports; }

var classCallCheck = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = (classCallCheck && typeof classCallCheck === 'object' && 'default' in classCallCheck ? classCallCheck['default'] : classCallCheck);

var _core = __commonjs(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var require$$0$2 = (_core && typeof _core === 'object' && 'default' in _core ? _core['default'] : _core);

var _fails = __commonjs(function (module) {
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
});

var require$$0$4 = (_fails && typeof _fails === 'object' && 'default' in _fails ? _fails['default'] : _fails);

var _descriptors = __commonjs(function (module) {
// Thank's IE8 for his funny defineProperty
module.exports = !require$$0$4(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
});

var require$$0$3 = (_descriptors && typeof _descriptors === 'object' && 'default' in _descriptors ? _descriptors['default'] : _descriptors);

var _isObject = __commonjs(function (module) {
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
});

var require$$3$1 = (_isObject && typeof _isObject === 'object' && 'default' in _isObject ? _isObject['default'] : _isObject);

var _toPrimitive = __commonjs(function (module) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require$$3$1;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
});

var require$$3 = (_toPrimitive && typeof _toPrimitive === 'object' && 'default' in _toPrimitive ? _toPrimitive['default'] : _toPrimitive);

var _global = __commonjs(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var require$$3$2 = (_global && typeof _global === 'object' && 'default' in _global ? _global['default'] : _global);

var _domCreate = __commonjs(function (module) {
var isObject = require$$3$1
  , document = require$$3$2.document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
});

var require$$1$2 = (_domCreate && typeof _domCreate === 'object' && 'default' in _domCreate ? _domCreate['default'] : _domCreate);

var _ie8DomDefine = __commonjs(function (module) {
module.exports = !require$$0$3 && !require$$0$4(function(){
  return Object.defineProperty(require$$1$2('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
});

var require$$1$1 = (_ie8DomDefine && typeof _ie8DomDefine === 'object' && 'default' in _ie8DomDefine ? _ie8DomDefine['default'] : _ie8DomDefine);

var _anObject = __commonjs(function (module) {
var isObject = require$$3$1;
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
});

var require$$2 = (_anObject && typeof _anObject === 'object' && 'default' in _anObject ? _anObject['default'] : _anObject);

var _objectDp = __commonjs(function (module, exports) {
var anObject       = require$$2
  , IE8_DOM_DEFINE = require$$1$1
  , toPrimitive    = require$$3
  , dP             = Object.defineProperty;

exports.f = require$$0$3 ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
});

var require$$1 = (_objectDp && typeof _objectDp === 'object' && 'default' in _objectDp ? _objectDp['default'] : _objectDp);

var _propertyDesc = __commonjs(function (module) {
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
});

var require$$3$3 = (_propertyDesc && typeof _propertyDesc === 'object' && 'default' in _propertyDesc ? _propertyDesc['default'] : _propertyDesc);

var _hide = __commonjs(function (module) {
var dP         = require$$1
  , createDesc = require$$3$3;
module.exports = require$$0$3 ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
});

var require$$1$4 = (_hide && typeof _hide === 'object' && 'default' in _hide ? _hide['default'] : _hide);

var _aFunction = __commonjs(function (module) {
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
});

var require$$0$5 = (_aFunction && typeof _aFunction === 'object' && 'default' in _aFunction ? _aFunction['default'] : _aFunction);

var _ctx = __commonjs(function (module) {
// optional / simple context binding
var aFunction = require$$0$5;
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
});

var require$$1$5 = (_ctx && typeof _ctx === 'object' && 'default' in _ctx ? _ctx['default'] : _ctx);

var _export = __commonjs(function (module, exports) {
var global    = require$$3$2
  , core      = require$$0$2
  , ctx       = require$$1$5
  , hide      = require$$1$4
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
});

var require$$1$3 = (_export && typeof _export === 'object' && 'default' in _export ? _export['default'] : _export);

var es6_object_defineProperty = __commonjs(function (module) {
var $export = require$$1$3;
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require$$0$3, 'Object', {defineProperty: require$$1.f});
});

var defineProperty$1 = __commonjs(function (module) {
var $Object = require$$0$2.Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
});

var require$$0$1 = (defineProperty$1 && typeof defineProperty$1 === 'object' && 'default' in defineProperty$1 ? defineProperty$1['default'] : defineProperty$1);

var defineProperty = __commonjs(function (module) {
module.exports = { "default": require$$0$1, __esModule: true };
});

var require$$0 = (defineProperty && typeof defineProperty === 'object' && 'default' in defineProperty ? defineProperty['default'] : defineProperty);

var createClass = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _defineProperty = require$$0;

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = (createClass && typeof createClass === 'object' && 'default' in createClass ? createClass['default'] : createClass);

var _uid = __commonjs(function (module) {
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
});

var require$$4 = (_uid && typeof _uid === 'object' && 'default' in _uid ? _uid['default'] : _uid);

var _shared = __commonjs(function (module) {
var global = require$$3$2
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
});

var require$$1$6 = (_shared && typeof _shared === 'object' && 'default' in _shared ? _shared['default'] : _shared);

var _wks = __commonjs(function (module) {
var store      = require$$1$6('wks')
  , uid        = require$$4
  , Symbol     = require$$3$2.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
});

var require$$0$9 = (_wks && typeof _wks === 'object' && 'default' in _wks ? _wks['default'] : _wks);

var _wksExt = __commonjs(function (module, exports) {
exports.f = require$$0$9;
});

var require$$0$8 = (_wksExt && typeof _wksExt === 'object' && 'default' in _wksExt ? _wksExt['default'] : _wksExt);

var _library = __commonjs(function (module) {
module.exports = true;
});

var require$$9 = (_library && typeof _library === 'object' && 'default' in _library ? _library['default'] : _library);

var _wksDefine = __commonjs(function (module) {
var global         = require$$3$2
  , core           = require$$0$2
  , LIBRARY        = require$$9
  , wksExt         = require$$0$8
  , defineProperty = require$$1.f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
});

var require$$17 = (_wksDefine && typeof _wksDefine === 'object' && 'default' in _wksDefine ? _wksDefine['default'] : _wksDefine);

var es7_symbol_observable = __commonjs(function (module) {
require$$17('observable');
});

var es7_symbol_asyncIterator = __commonjs(function (module) {
require$$17('asyncIterator');
});

var _objectGops = __commonjs(function (module, exports) {
exports.f = Object.getOwnPropertySymbols;
});

var require$$1$7 = (_objectGops && typeof _objectGops === 'object' && 'default' in _objectGops ? _objectGops['default'] : _objectGops);

var _objectPie = __commonjs(function (module, exports) {
exports.f = {}.propertyIsEnumerable;
});

var require$$0$10 = (_objectPie && typeof _objectPie === 'object' && 'default' in _objectPie ? _objectPie['default'] : _objectPie);

var _enumBugKeys = __commonjs(function (module) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
});

var require$$3$4 = (_enumBugKeys && typeof _enumBugKeys === 'object' && 'default' in _enumBugKeys ? _enumBugKeys['default'] : _enumBugKeys);

var _sharedKey = __commonjs(function (module) {
var shared = require$$1$6('keys')
  , uid    = require$$4;
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
});

var require$$0$12 = (_sharedKey && typeof _sharedKey === 'object' && 'default' in _sharedKey ? _sharedKey['default'] : _sharedKey);

var _toInteger = __commonjs(function (module) {
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
});

var require$$1$10 = (_toInteger && typeof _toInteger === 'object' && 'default' in _toInteger ? _toInteger['default'] : _toInteger);

var _toIndex = __commonjs(function (module) {
var toInteger = require$$1$10
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
});

var require$$0$13 = (_toIndex && typeof _toIndex === 'object' && 'default' in _toIndex ? _toIndex['default'] : _toIndex);

var _toLength = __commonjs(function (module) {
// 7.1.15 ToLength
var toInteger = require$$1$10
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
});

var require$$1$11 = (_toLength && typeof _toLength === 'object' && 'default' in _toLength ? _toLength['default'] : _toLength);

var _defined = __commonjs(function (module) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
});

var require$$0$14 = (_defined && typeof _defined === 'object' && 'default' in _defined ? _defined['default'] : _defined);

var _cof = __commonjs(function (module) {
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
});

var require$$0$15 = (_cof && typeof _cof === 'object' && 'default' in _cof ? _cof['default'] : _cof);

var _iobject = __commonjs(function (module) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require$$0$15;
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
});

var require$$1$12 = (_iobject && typeof _iobject === 'object' && 'default' in _iobject ? _iobject['default'] : _iobject);

var _toIobject = __commonjs(function (module) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require$$1$12
  , defined = require$$0$14;
module.exports = function(it){
  return IObject(defined(it));
};
});

var require$$2$1 = (_toIobject && typeof _toIobject === 'object' && 'default' in _toIobject ? _toIobject['default'] : _toIobject);

var _arrayIncludes = __commonjs(function (module) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require$$2$1
  , toLength  = require$$1$11
  , toIndex   = require$$0$13;
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
});

var require$$1$9 = (_arrayIncludes && typeof _arrayIncludes === 'object' && 'default' in _arrayIncludes ? _arrayIncludes['default'] : _arrayIncludes);

var _has = __commonjs(function (module) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
});

var require$$2$2 = (_has && typeof _has === 'object' && 'default' in _has ? _has['default'] : _has);

var _objectKeysInternal = __commonjs(function (module) {
var has          = require$$2$2
  , toIObject    = require$$2$1
  , arrayIndexOf = require$$1$9(false)
  , IE_PROTO     = require$$0$12('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
});

var require$$1$8 = (_objectKeysInternal && typeof _objectKeysInternal === 'object' && 'default' in _objectKeysInternal ? _objectKeysInternal['default'] : _objectKeysInternal);

var _objectGopn = __commonjs(function (module, exports) {
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require$$1$8
  , hiddenKeys = require$$3$4.concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
});

var require$$0$11 = (_objectGopn && typeof _objectGopn === 'object' && 'default' in _objectGopn ? _objectGopn['default'] : _objectGopn);

var _objectKeys = __commonjs(function (module) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require$$1$8
  , enumBugKeys = require$$3$4;

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
});

var require$$1$13 = (_objectKeys && typeof _objectKeys === 'object' && 'default' in _objectKeys ? _objectKeys['default'] : _objectKeys);

var _objectGopd = __commonjs(function (module, exports) {
var pIE            = require$$0$10
  , createDesc     = require$$3$3
  , toIObject      = require$$2$1
  , toPrimitive    = require$$3
  , has            = require$$2$2
  , IE8_DOM_DEFINE = require$$1$1
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require$$0$3 ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
});

var require$$0$16 = (_objectGopd && typeof _objectGopd === 'object' && 'default' in _objectGopd ? _objectGopd['default'] : _objectGopd);

var _objectGopnExt = __commonjs(function (module) {
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require$$2$1
  , gOPN      = require$$0$11.f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};
});

var require$$8 = (_objectGopnExt && typeof _objectGopnExt === 'object' && 'default' in _objectGopnExt ? _objectGopnExt['default'] : _objectGopnExt);

var _html = __commonjs(function (module) {
module.exports = require$$3$2.document && document.documentElement;
});

var require$$0$18 = (_html && typeof _html === 'object' && 'default' in _html ? _html['default'] : _html);

var _objectDps = __commonjs(function (module) {
var dP       = require$$1
  , anObject = require$$2
  , getKeys  = require$$1$13;

module.exports = require$$0$3 ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
});

var require$$4$1 = (_objectDps && typeof _objectDps === 'object' && 'default' in _objectDps ? _objectDps['default'] : _objectDps);

var _objectCreate = __commonjs(function (module) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require$$2
  , dPs         = require$$4$1
  , enumBugKeys = require$$3$4
  , IE_PROTO    = require$$0$12('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require$$1$2('iframe')
    , i      = enumBugKeys.length
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require$$0$18.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
});

var require$$0$17 = (_objectCreate && typeof _objectCreate === 'object' && 'default' in _objectCreate ? _objectCreate['default'] : _objectCreate);

var _isArray = __commonjs(function (module) {
// 7.2.2 IsArray(argument)
var cof = require$$0$15;
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
});

var require$$14 = (_isArray && typeof _isArray === 'object' && 'default' in _isArray ? _isArray['default'] : _isArray);

var _enumKeys = __commonjs(function (module) {
// all enumerable object keys, includes symbols
var getKeys = require$$1$13
  , gOPS    = require$$1$7
  , pIE     = require$$0$10;
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
});

var require$$15 = (_enumKeys && typeof _enumKeys === 'object' && 'default' in _enumKeys ? _enumKeys['default'] : _enumKeys);

var _keyof = __commonjs(function (module) {
var getKeys   = require$$1$13
  , toIObject = require$$2$1;
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
});

var require$$16 = (_keyof && typeof _keyof === 'object' && 'default' in _keyof ? _keyof['default'] : _keyof);

var _setToStringTag = __commonjs(function (module) {
var def = require$$1.f
  , has = require$$2$2
  , TAG = require$$0$9('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
});

var require$$2$3 = (_setToStringTag && typeof _setToStringTag === 'object' && 'default' in _setToStringTag ? _setToStringTag['default'] : _setToStringTag);

var _meta = __commonjs(function (module) {
var META     = require$$4('meta')
  , isObject = require$$3$1
  , has      = require$$2$2
  , setDesc  = require$$1.f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require$$0$4(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
});

var require$$24 = (_meta && typeof _meta === 'object' && 'default' in _meta ? _meta['default'] : _meta);

var _redefine = __commonjs(function (module) {
module.exports = require$$1$4;
});

var require$$7 = (_redefine && typeof _redefine === 'object' && 'default' in _redefine ? _redefine['default'] : _redefine);

var es6_symbol = __commonjs(function (module) {
'use strict';
// ECMAScript 6 symbols shim
var global         = require$$3$2
  , has            = require$$2$2
  , DESCRIPTORS    = require$$0$3
  , $export        = require$$1$3
  , redefine       = require$$7
  , META           = require$$24.KEY
  , $fails         = require$$0$4
  , shared         = require$$1$6
  , setToStringTag = require$$2$3
  , uid            = require$$4
  , wks            = require$$0$9
  , wksExt         = require$$0$8
  , wksDefine      = require$$17
  , keyOf          = require$$16
  , enumKeys       = require$$15
  , isArray        = require$$14
  , anObject       = require$$2
  , toIObject      = require$$2$1
  , toPrimitive    = require$$3
  , createDesc     = require$$3$3
  , _create        = require$$0$17
  , gOPNExt        = require$$8
  , $GOPD          = require$$0$16
  , $DP            = require$$1
  , $keys          = require$$1$13
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require$$0$11.f = gOPNExt.f = $getOwnPropertyNames;
  require$$0$10.f  = $propertyIsEnumerable;
  require$$1$7.f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require$$9){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require$$1$4($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
});

var index = __commonjs(function (module) {
module.exports = require$$0$2.Symbol;
});

var require$$0$7 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

var symbol = __commonjs(function (module) {
module.exports = { "default": require$$0$7, __esModule: true };
});

var require$$0$6 = (symbol && typeof symbol === 'object' && 'default' in symbol ? symbol['default'] : symbol);

var _iterators = __commonjs(function (module) {
module.exports = {};
});

var require$$4$2 = (_iterators && typeof _iterators === 'object' && 'default' in _iterators ? _iterators['default'] : _iterators);

var _toObject = __commonjs(function (module) {
// 7.1.13 ToObject(argument)
var defined = require$$0$14;
module.exports = function(it){
  return Object(defined(it));
};
});

var require$$2$4 = (_toObject && typeof _toObject === 'object' && 'default' in _toObject ? _toObject['default'] : _toObject);

var _objectGpo = __commonjs(function (module) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require$$2$2
  , toObject    = require$$2$4
  , IE_PROTO    = require$$0$12('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
});

var require$$1$15 = (_objectGpo && typeof _objectGpo === 'object' && 'default' in _objectGpo ? _objectGpo['default'] : _objectGpo);

var _iterCreate = __commonjs(function (module) {
'use strict';
var create         = require$$0$17
  , descriptor     = require$$3$3
  , setToStringTag = require$$2$3
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require$$1$4(IteratorPrototype, require$$0$9('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
});

var require$$3$5 = (_iterCreate && typeof _iterCreate === 'object' && 'default' in _iterCreate ? _iterCreate['default'] : _iterCreate);

var _iterDefine = __commonjs(function (module) {
'use strict';
var LIBRARY        = require$$9
  , $export        = require$$1$3
  , redefine       = require$$7
  , hide           = require$$1$4
  , has            = require$$2$2
  , Iterators      = require$$4$2
  , $iterCreate    = require$$3$5
  , setToStringTag = require$$2$3
  , getPrototypeOf = require$$1$15
  , ITERATOR       = require$$0$9('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
});

var require$$0$20 = (_iterDefine && typeof _iterDefine === 'object' && 'default' in _iterDefine ? _iterDefine['default'] : _iterDefine);

var _iterStep = __commonjs(function (module) {
module.exports = function(done, value){
  return {value: value, done: !!done};
};
});

var require$$3$6 = (_iterStep && typeof _iterStep === 'object' && 'default' in _iterStep ? _iterStep['default'] : _iterStep);

var _addToUnscopables = __commonjs(function (module) {
module.exports = function(){ /* empty */ };
});

var require$$4$3 = (_addToUnscopables && typeof _addToUnscopables === 'object' && 'default' in _addToUnscopables ? _addToUnscopables['default'] : _addToUnscopables);

var es6_array_iterator = __commonjs(function (module) {
'use strict';
var addToUnscopables = require$$4$3
  , step             = require$$3$6
  , Iterators        = require$$4$2
  , toIObject        = require$$2$1;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require$$0$20(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
});

var web_dom_iterable = __commonjs(function (module) {
var global        = require$$3$2
  , hide          = require$$1$4
  , Iterators     = require$$4$2
  , TO_STRING_TAG = require$$0$9('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
});

var _stringAt = __commonjs(function (module) {
var toInteger = require$$1$10
  , defined   = require$$0$14;
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
});

var require$$1$16 = (_stringAt && typeof _stringAt === 'object' && 'default' in _stringAt ? _stringAt['default'] : _stringAt);

var es6_string_iterator = __commonjs(function (module) {
'use strict';
var $at  = require$$1$16(true);

// 21.1.3.27 String.prototype[@@iterator]()
require$$0$20(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
});

var iterator$1 = __commonjs(function (module) {
module.exports = require$$0$8.f('iterator');
});

var require$$0$19 = (iterator$1 && typeof iterator$1 === 'object' && 'default' in iterator$1 ? iterator$1['default'] : iterator$1);

var iterator = __commonjs(function (module) {
module.exports = { "default": require$$0$19, __esModule: true };
});

var require$$1$14 = (iterator && typeof iterator === 'object' && 'default' in iterator ? iterator['default'] : iterator);

var _typeof = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _iterator = require$$1$14;

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require$$0$6;

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof$1 = (_typeof && typeof _typeof === 'object' && 'default' in _typeof ? _typeof['default'] : _typeof);

var possibleConstructorReturn = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _typeof2 = _typeof$1;

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
});

var _possibleConstructorReturn = (possibleConstructorReturn && typeof possibleConstructorReturn === 'object' && 'default' in possibleConstructorReturn ? possibleConstructorReturn['default'] : possibleConstructorReturn);

var _objectSap = __commonjs(function (module) {
// most Object methods by ES6 should accept primitives
var $export = require$$1$3
  , core    = require$$0$2
  , fails   = require$$0$4;
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
});

var require$$0$23 = (_objectSap && typeof _objectSap === 'object' && 'default' in _objectSap ? _objectSap['default'] : _objectSap);

var es6_object_getOwnPropertyDescriptor = __commonjs(function (module) {
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require$$2$1
  , $getOwnPropertyDescriptor = require$$0$16.f;

require$$0$23('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
});

var getOwnPropertyDescriptor$1 = __commonjs(function (module) {
var $Object = require$$0$2.Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
});

var require$$0$22 = (getOwnPropertyDescriptor$1 && typeof getOwnPropertyDescriptor$1 === 'object' && 'default' in getOwnPropertyDescriptor$1 ? getOwnPropertyDescriptor$1['default'] : getOwnPropertyDescriptor$1);

var getOwnPropertyDescriptor = __commonjs(function (module) {
module.exports = { "default": require$$0$22, __esModule: true };
});

var require$$0$21 = (getOwnPropertyDescriptor && typeof getOwnPropertyDescriptor === 'object' && 'default' in getOwnPropertyDescriptor ? getOwnPropertyDescriptor['default'] : getOwnPropertyDescriptor);

var es6_object_getPrototypeOf = __commonjs(function (module) {
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require$$2$4
  , $getPrototypeOf = require$$1$15;

require$$0$23('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
});

var getPrototypeOf$1 = __commonjs(function (module) {
module.exports = require$$0$2.Object.getPrototypeOf;
});

var require$$0$24 = (getPrototypeOf$1 && typeof getPrototypeOf$1 === 'object' && 'default' in getPrototypeOf$1 ? getPrototypeOf$1['default'] : getPrototypeOf$1);

var getPrototypeOf = __commonjs(function (module) {
module.exports = { "default": require$$0$24, __esModule: true };
});

var require$$1$17 = (getPrototypeOf && typeof getPrototypeOf === 'object' && 'default' in getPrototypeOf ? getPrototypeOf['default'] : getPrototypeOf);

var get = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require$$1$17;

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require$$0$21;

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
});

var _get = (get && typeof get === 'object' && 'default' in get ? get['default'] : get);

var es6_object_create = __commonjs(function (module) {
var $export = require$$1$3
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require$$0$17});
});

var create$1 = __commonjs(function (module) {
var $Object = require$$0$2.Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
});

var require$$0$25 = (create$1 && typeof create$1 === 'object' && 'default' in create$1 ? create$1['default'] : create$1);

var create = __commonjs(function (module) {
module.exports = { "default": require$$0$25, __esModule: true };
});

var require$$1$18 = (create && typeof create === 'object' && 'default' in create ? create['default'] : create);

var _setProto = __commonjs(function (module) {
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require$$3$1
  , anObject = require$$2;
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require$$1$5(Function.call, require$$0$16.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
});

var require$$0$27 = (_setProto && typeof _setProto === 'object' && 'default' in _setProto ? _setProto['default'] : _setProto);

var es6_object_setPrototypeOf = __commonjs(function (module) {
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require$$1$3;
$export($export.S, 'Object', {setPrototypeOf: require$$0$27.set});
});

var setPrototypeOf$1 = __commonjs(function (module) {
module.exports = require$$0$2.Object.setPrototypeOf;
});

var require$$0$26 = (setPrototypeOf$1 && typeof setPrototypeOf$1 === 'object' && 'default' in setPrototypeOf$1 ? setPrototypeOf$1['default'] : setPrototypeOf$1);

var setPrototypeOf = __commonjs(function (module) {
module.exports = { "default": require$$0$26, __esModule: true };
});

var require$$2$5 = (setPrototypeOf && typeof setPrototypeOf === 'object' && 'default' in setPrototypeOf ? setPrototypeOf['default'] : setPrototypeOf);

var inherits = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require$$2$5;

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require$$1$18;

var _create2 = _interopRequireDefault(_create);

var _typeof2 = _typeof$1;

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
});

var _inherits = (inherits && typeof inherits === 'object' && 'default' in inherits ? inherits['default'] : inherits);

// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false
/**
 * Processes the message and outputs the correct message if the condition
 * is false. Otherwise it outputs null.
 * @api private
 * @method processCondition
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return {String | null}  - Error message if there is an error, nul otherwise.
 */
function processCondition(condition, errorMessage) {
  if (!condition) {
    var completeErrorMessage = '';
    var re = /at ([^\s]+)\s\(/g;
    var stackTrace = new Error().stack;
    var stackFunctions = [];

    var funcName = re.exec(stackTrace);
    while (funcName && funcName[1]) {
      stackFunctions.push(funcName[1]);
      funcName = re.exec(stackTrace);
    }

    // Number 0 is processCondition itself,
    // Number 1 is assert,
    // Number 2 is the caller function.
    if (stackFunctions[2]) {
      completeErrorMessage = stackFunctions[2] + ': ' + completeErrorMessage;
    }

    completeErrorMessage += errorMessage;
    return completeErrorMessage;
  }

  return null;
}

/**
 * Throws an error if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert(myDate !== undefined, "Date cannot be undefined.");
 * @api public
 * @method assert
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
function assert(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    throw new Error(error);
  }
}

/**
 * Logs a warning if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert.warn(myDate !== undefined, "No date provided.");
 * @api public
 * @method warn
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
assert.warn = function warn(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    console.warn(error);
  }
};

/**
 * This class creates elements with an html counterpart.
 * HTML components are stored in this.html, and the main container
 * is this.html.container.
 * @abstract @class
 */

var ViewController = function () {
  function ViewController(modulePrefix) {
    _classCallCheck(this, ViewController);

    this.listeners = {};
    this.acceptEvents('destroy');

    this.modulePrefix = modulePrefix;
    this.cssPrefix = this.modulePrefix + '_' + this.constructor.name;

    for (var _len = arguments.length, additionalArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      additionalArgs[_key - 1] = arguments[_key];
    }

    this.buildHtml.apply(this, additionalArgs);
  }

  /**
   * Creates the HTML structure of the class
   * @private
   * @method buildHtml
   * @return {void}
   */


  _createClass(ViewController, [{
    key: 'buildHtml',
    value: function buildHtml() {
      this.html = {};
      this.html.container = document.createElement('div');
      this.html.container.classList.add(this.cssPrefix);
    }

    /**
     * Sets which events will be accepted.
     * @method acceptEvents
     * @param  {Array<String>} eventList
     * @return {void}
     */

  }, {
    key: 'acceptEvents',
    value: function acceptEvents() {
      for (var _len2 = arguments.length, eventList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        eventList[_key2] = arguments[_key2];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = eventList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eventName = _step.value;

          this.listeners[eventName] = new Set();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @method on
     * @param  {function} fn
     * @param {String} event
     * @return {void}
     */

  }, {
    key: 'on',
    value: function on(event, fn) {
      assert(this.listeners[event], 'Trying to listen to invalid event: ' + event);
      this.listeners[event].add(fn);
    }

    /**
     * @method removeListener
     * @param  {String} event
     * @param  {Function} fn
     * @return {void}
     */

  }, {
    key: 'removeListener',
    value: function removeListener(event, fn) {
      assert(this.listeners[event], 'Trying to remove listener from invalid event: ' + event);
      this.listeners[event].delete(fn);
    }

    /**
     * @method trigger
     * @param  {String} event
     */

  }, {
    key: 'trigger',
    value: function trigger(event) {
      var _this = this;

      for (var _len3 = arguments.length, additionalArgs = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        additionalArgs[_key3 - 1] = arguments[_key3];
      }

      assert(this.listeners[event], 'Trying to trigger listener from invalid event: ' + event);
      this.listeners[event].forEach(function (fn) {
        return fn.apply(undefined, [_this].concat(additionalArgs));
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.trigger('destroy');
      this.html.container.remove();
      var keys = Object.keys(this);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          this[key] = null;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.html = {};
    }
  }, {
    key: 'getContainer',
    value: function getContainer() {
      return this.html.container;
    }
  }]);

  return ViewController;
}();

var constants = {
  dragIcon: '<svg height="1em"width="1em" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg2" viewBox="0 0 282.00001 224.00001" ><defs id="defs4" /><metadata id="metadata7"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g transform="translate(-122.42857,-67.07648)" id="layer1"><path style="fill-opacity:1" d="m 122.42857,266.57649 0,-24.5 141,0 141,0 0,24.5 0,24.5 -141,0 -141,0 0,-24.5 z m 0,-89 0,-24.5 141,0 141,0 0,24.5 0,24.5 -141,0 -141,0 0,-24.5 z m 0,-86 0,-24.50001 141,0 141,0 0,24.50001 0,24.5 -141,0 -141,0 0,-24.5 z" id="path4149" /></g></svg>',
  soundNoteIcon: '<svg height="1em" width="1em" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg2" viewBox="0 0 333.9721 382.85264" ><defs id="defs4" /><metadata id="metadata7"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g transform="translate(-18.777104,-32.548383)" id="layer1"><path d="m 74.949777,414.69224 c -24.36158,-3.6749 -45.24612,-21.2619 -53.32035,-44.9015 -3.04674,-8.9201 -3.80818,-26.9045 -1.52529,-36.0258 4.6794,-18.6966 18.09492,-35.6783 34.62255,-43.826 18.42598,-9.0836 39.16235,-9.5299 57.452803,-1.2366 3.74629,1.6986 6.97419,3.0884 7.17312,3.0884 0.19892,0 0.36636,-43.3125 0.37208,-96.25 l 0.0104,-96.249957 114.2396,-32.79881 c 62.83178,-18.03934 115.25996,-33.05638 116.50706,-33.3712 l 2.26746,-0.57239 -0.26746,136.371197 -0.26746,136.37116 -2.21768,6.5153 c -6.70708,19.7046 -22.23229,35.3047 -42.16457,42.368 -7.85242,2.7826 -9.72786,3.0538 -21.11775,3.0538 -11.38989,0 -13.26533,-0.2712 -21.11775,-3.0538 -20.22765,-7.168 -35.96639,-23.1703 -42.17692,-42.8833 -3.17523,-10.0785 -3.16898,-29.9586 0.0126,-40 5.3142,-16.7722 17.76312,-31.2302 33.50929,-38.917 9.73365,-4.7518 20.84978,-7.583 29.77278,-7.583 7.93755,0 19.80739,2.7821 27.75,6.504 l 7.25,3.3975 0,-57.51814 c 0,-54.31114 -0.0976,-57.48902 -1.75,-56.99659 -0.9625,0.28682 -36.4,10.4687 -78.75,22.62639 -42.35,12.1577 -80.0375,22.9974 -83.75,24.08824 l -6.75,1.98333 -0.0148,94.70767 c -0.0164,104.8978 0.20224,101.0758 -6.56607,114.7947 -12.60307,25.5456 -41.16979,40.5402 -69.183663,36.3144 z" id="path4149" /></g></svg>',
  trashIcon: '<svg height="1em" width="1em" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg2" viewBox="0 0 401.00392 437.17416" ><defs id="defs4" /><metadata id="metadata7"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g transform="translate(-69.142849,-71.290783)" id="layer1"><path style="fill-opacity:1" d="m 141.88876,507.71461 c -11.2959,-2.69082 -22.77229,-12.5913 -29.11149,-25.11395 -7.63899,-15.09029 -7.0366,-1.9836 -7.37949,-160.55988 l -0.30758,-142.25 -14.523341,0 c -15.07073,0 -19.42377,-0.95101 -20.80283,-4.5448 -0.34165,-0.89033 -0.62118,-7.15712 -0.62118,-13.9262 0,-10.62618 0.26105,-12.62993 1.91101,-14.66822 l 1.91103,-2.36078 46.641881,-0.5 46.64187,-0.5 10.80058,-25.63985 c 5.94031,-14.10192 11.73692,-26.95484 12.88135,-28.56204 3.83713,-5.38875 11.29712,-11.442569 18.03267,-14.633586 l 6.6796,-3.164521 55.05186,0 55.05187,0 7.50873,3.711018 c 5.12147,2.531166 9.25845,5.551519 13.01218,9.499999 5.01632,5.27659 6.32572,7.73623 14.79352,27.78898 5.10954,12.1 10.19863,24.1375 11.3091,26.75 l 2.01903,4.75 45.92231,0 45.92231,0 2.45454,2.45455 c 2.35305,2.35304 2.45455,2.98944 2.45455,15.38921 0,18.27613 0.78682,17.56494 -19.88623,17.97473 l -16.06737,0.3185 -0.30375,141.6815 c -0.28512,132.99472 -0.41397,142.04512 -2.1015,147.61197 -4.84592,15.98573 -15.55074,29.93802 -27.47351,35.80802 l -6.62461,3.26152 -126.02151,0.15905 c -71.24698,0.0899 -127.65321,-0.22964 -129.7756,-0.73522 z M 391.04124,470.6708 c 1.25154,-1.16598 3.2489,-4.20348 4.43856,-6.75 l 2.16304,-4.63002 0.267,-139.75 0.267,-139.75 -128.53406,0 -128.53405,0 0.26705,139.25 c 0.25137,131.07047 0.37214,139.5135 2.05591,143.73583 0.98386,2.4672 2.98055,5.7297 4.4371,7.25 l 2.64823,2.76417 119.12435,0 119.12435,0 2.27553,-2.11998 z M 183.5272,416.39957 c -1.99156,-0.89442 -3.52492,-2.57328 -4.25,-4.65325 -1.58465,-4.54571 -1.6092,-166.29495 -0.0259,-170.8367 1.70623,-4.89458 5.18594,-6.11884 17.39155,-6.11884 10.9993,0 15.61136,1.24185 16.87882,4.5448 0.34165,0.89033 0.62118,40.20353 0.62118,87.36267 l 0,85.7439 -2.57767,2.42432 c -2.36876,2.22783 -3.48315,2.4449 -13.75,2.67834 -7.89778,0.17958 -12.08551,-0.15609 -14.28798,-1.14524 z m 73.70637,0.30113 c -5.24241,-2.09609 -5.02482,1.77833 -5.05892,-90.07813 -0.0175,-47.11752 0.24772,-86.39666 0.58938,-87.28699 1.26745,-3.30295 5.87953,-4.5448 16.87881,-4.5448 12.78832,0 15.90811,1.20723 17.44786,6.7516 1.45386,5.23509 1.43275,164.33755 -0.0225,169.57828 -1.47713,5.31953 -5.1311,6.68781 -17.64324,6.60673 -5.38016,-0.0349 -10.86629,-0.49687 -12.19139,-1.02669 z m 74.40927,0.37425 c -1.1,-0.26611 -3.0125,-1.41735 -4.25,-2.55831 l -2.25,-2.07449 0,-86.13712 c 0,-84.69805 0.0333,-86.17292 1.99605,-88.27963 2.63232,-2.82547 6.76201,-3.49872 18.89783,-3.08084 8.87282,0.30553 10.32205,0.61391 12.33036,2.62374 l 2.27577,2.27752 0.26725,84.72248 c 0.20102,63.72861 -0.0275,85.4344 -0.92228,87.59549 -1.74536,4.2155 -6.17757,5.64703 -17.06286,5.51099 -5.10517,-0.0638 -10.18212,-0.33373 -11.28212,-0.59983 z m 1.57375,-275.53417 c -6.66627,-17.10754 -13.46419,-32.50479 -14.79034,-33.5 -1.2776,-0.95877 -12.65147,-1.25 -48.81955,-1.25 -44.4169,0 -47.24997,0.10618 -48.80935,1.82927 -1.66709,1.84211 -14.65451,32.04379 -14.65451,34.07841 0,0.77838 18.38704,1.09232 63.97525,1.09232 l 63.97526,0 -0.87676,-2.25 z" id="path4205" /></g></svg>'
};

var Track = function (_ViewController) {
  _inherits(Track, _ViewController);

  function Track(modulePrefix, info) {
    _classCallCheck(this, Track);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Track).call(this, modulePrefix, info));

    _this.info = info;
    Object.preventExtensions(_this);

    _this.acceptEvents('dragstart', 'dragend', 'deleteBtnClick');
    return _this;
  }

  _createClass(Track, [{
    key: 'buildHtml',
    value: function buildHtml(info) {
      var _this2 = this;

      _get(Object.getPrototypeOf(Track.prototype), 'buildHtml', this).call(this);

      // Create HTML

      var coverImg = document.createElement('img');
      coverImg.classList.add(this.cssPrefix + '-cover');
      coverImg.setAttribute('src', info.album.images[1].url);
      this.html.container.appendChild(coverImg);

      var linearGradients = 'linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.94))';
      this.html.container.style.background = 'url("' + info.album.images[1].url + '"), ' + linearGradients;

      var trackInfoClass = this.cssPrefix + '-info';
      var trackInfo = document.createElement('div');
      trackInfo.classList.add(trackInfoClass);
      this.html.container.appendChild(trackInfo);

      var title = document.createElement('span');
      title.classList.add(trackInfoClass + '-title');
      title.innerHTML = info.name;
      trackInfo.appendChild(title);

      var artist = document.createElement('span');
      artist.classList.add(trackInfoClass + '-artist');
      artist.innerHTML = info.artists[0].name;
      trackInfo.appendChild(artist);

      if (info.explicit) {
        var explicit = document.createElement('span');
        explicit.classList.add(trackInfoClass + '-explicit');
        explicit.innerHTML = 'explicit';
        trackInfo.appendChild(explicit);
      }

      var buttonsBar = document.createElement('div');
      var buttonsBarClass = this.cssPrefix + '-btns';
      buttonsBar.classList.add(buttonsBarClass);
      this.html.container.appendChild(buttonsBar);

      var dragBtn = document.createElement('button');
      dragBtn.innerHTML = constants.dragIcon;
      dragBtn.setAttribute('draggable', 'true');
      dragBtn.classList.add(buttonsBarClass + '-drag');
      this.html.container.dragBtn = dragBtn;
      buttonsBar.appendChild(dragBtn);

      var deleteBtn = document.createElement('button');
      deleteBtn.classList.add(buttonsBarClass + '-delete');
      this.deleteBtn = deleteBtn;
      deleteBtn.innerHTML = constants.trashIcon;
      buttonsBar.appendChild(deleteBtn);

      // Set listeners

      var draggingClass = this.cssPrefix + '--dragging';
      dragBtn.addEventListener('dragstart', function (e) {
        _this2.trigger('dragstart', e);
        _this2.html.container.classList.add(draggingClass);
      });

      dragBtn.addEventListener('dragend', function (e) {
        _this2.trigger('dragend', e);
        setTimeout(function () {
          return _this2.html.container.classList.remove(draggingClass);
        }, 100);
      });

      deleteBtn.addEventListener('click', function () {
        return _this2.trigger('deleteBtnClick');
      });
    }
  }]);

  return Track;
}(ViewController);

/**
 * @function throttle
 * @param  {integer}   FuncDelay
 * @param  {Function} callback
 * @return {Function}                  the throttled function
 */
function throttle(FuncDelay, callback) {
  var lastCall = +new Date();
  var delay = FuncDelay;
  var params = void 0;
  var context = {};
  var calledDuringDelay = false;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var now = +new Date();
    var diff = now - lastCall;
    var timeToEndOfDelay = void 0;

    params = args;

    if (diff > delay) {
      callback.apply(context, params); // Call function with latest parameters
      calledDuringDelay = false;
      lastCall = now;
    } else if (!calledDuringDelay) {
      // If it wasn't called yet, call it when there is enough delay.
      timeToEndOfDelay = delay - diff;

      setTimeout(function () {
        callback.apply(context, params); // Call function with latest parameters
      }, timeToEndOfDelay);

      calledDuringDelay = true;
      lastCall = now + timeToEndOfDelay;
    } // Otherwise do nothing.
  };
}

/**
 * Will take care of the dragging and reordering a list for one drag.
 * @function trackReorderDrag
 * @param  {event} paramE        The dragstart event, from which this should be called.
 * @param  {HTMLElement} paramEl       The main Element being dragged
 * @param  {Array<HTMLElement>} paramElements Array of elements to be tracked.
 * @return {void}
 */
function trackReorderDrag(paramE, paramEl, paramElements) {
  function setTranslation(el, val) {
    el.style.transform = 'translate3d(0, ' + val + 'px, 0)'; //  eslint-disable-line no-param-reassign
  }

  /**
   * @function resetElementsPositions
   * @param {Array<HTMLElement>} els Elements being tracked
   */
  function resetElementsPositions(els) {
    els.forEach(function (el) {
      setTranslation(el, 0);
    });
  }

  /**
   * @function calculateElementHeight
   * @param  {Array<HTMLElement>} els    Elements ordered by vertical position
   * @param  {Integer} elIndex
   * @return {void}
   */
  function calculateElementHeight(els, elIndex) {
    var spaceOccupied = void 0;

    // If not the last element
    if (elIndex < els.length - 1) {
      var elTop = els[elIndex].getBoundingClientRect().top;
      var nextElTop = els[elIndex + 1].getBoundingClientRect().top;
      spaceOccupied = nextElTop - elTop;
    } else {
      // let's estimate the general vertical distance between elements by
      // subtracting the size of the first element from the distance between
      // its top and the next element.
      var firstElSpaceOccupied = els[1].getBoundingClientRect().top - els[0].getBoundingClientRect().top;
      var verticalDistance = firstElSpaceOccupied - els[0].clientHeight;
      var height = els[elIndex].clientHeight;
      spaceOccupied = height + verticalDistance;
    }

    return spaceOccupied;
  }

  /**
   * @function createDragMover
   * @param  {Array<HTMLElement>} els
   * @param  {Array<Integer>} tops        Initial tops
   * @param  {Integer} targetIndex Index of element being dragged around
   * @return {function}             The function to translate elements in the
   *                                  list to make room for the dragged element
   */
  function createDragMover(els, tops, targetIndex) {
    var target = els[targetIndex];
    var targetInitialTop = tops[targetIndex];
    var targetHeight = calculateElementHeight(els, targetIndex);
    return function doDragMove() {
      var targetTop = target.getBoundingClientRect().top;
      var movedUp = targetTop < targetInitialTop;

      var i = void 0;
      for (i = 0; i < tops.length; i++) {
        if (i === targetIndex) {
          continue;
        } else if (!movedUp && targetTop > tops[i] && tops[i] > targetInitialTop) {
          setTranslation(els[i], -targetHeight);
        } else if (movedUp && targetTop < tops[i + 1] && tops[i] < targetInitialTop) {
          setTranslation(els[i], targetHeight);
        } else {
          setTranslation(els[i], 0);
        }
      }
    };
  }

  function createDragListener(els, tops, targetIndex, initialY) {
    var target = els[targetIndex];
    var doDragMove = createDragMover(els, tops, targetIndex);
    var shouldStopListening = void 0;
    function dragListener(e) {
      if (shouldStopListening) {
        return;
      }

      doDragMove();
      var newY = e.pageY;
      if (newY === 0) {
        return;
      } // correct weird behaviour when mouse goes up

      var diff = newY - initialY;
      setTranslation(target, diff);
    }

    dragListener.stop = function () {
      shouldStopListening = true;
    };

    return dragListener;
  }

  function getElementsCurrentTop(els) {
    var tops = [];
    els.forEach(function (el) {
      tops.push(el.getBoundingClientRect().top);
    });

    return tops;
  }

  // function adjustElementsToTops(els, tops) {
  //   const currentTops = getElementsCurrentTop(els);
  //   els.forEach(function (el, i) {
  //     const diff =  currentTops[i] - tops[i];
  //     setTranslation(el, diff);
  //   });
  // }

  function insertTargetInRightPlace(els, initialTops, targetIndex) {
    var target = els[targetIndex];
    var topsBeforeInsertion = getElementsCurrentTop(els);
    var targetTop = topsBeforeInsertion[targetIndex];
    var i = 0;

    // Pass by all elements that are above the target
    while (topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop || i === targetIndex) {
      i++;
    }

    // Take away transitions from all elements and save them
    var initialTransitions = [];
    els.forEach(function (anEl) {
      initialTransitions.push(anEl.style.transition);
      anEl.style.transition = 'none'; // eslint-disable-line no-param-reassign
    });

    // Put everyone at translate3d(0,0,0) without transitions
    resetElementsPositions(els);

    // Add the element in the appropriate place. This will displace everyone else.
    var parent = els[i] ? els[i].parentElement : els[els.length - 1].parentElement;
    if (!parent || !parent.appendChild) {
      throw new Error('trackReorderDrag(): No parent found in element list.');
    } else if (els[i]) {
      parent.insertBefore(target, els[i]);
    } else {
      var lastEl = els[els.length - 1];
      parent.insertBefore(target, lastEl);
      parent.insertBefore(lastEl, target);
    }

    // Now let's translate it to where it was just before it was repositioned
    // All without transitions. It will seem like it never left that spot.
    var futureTop = target.getBoundingClientRect().top;
    var displacement = targetTop - futureTop;
    setTranslation(target, displacement);

    // Let's add a timeout to get the last place in the UI queue and let the
    // CSS renderer to process the fact that all these elements do not have
    // transitions and should appear wherever their coordinates say immediately.
    setTimeout(function () {
      // Restore all transitions
      els.forEach(function (anEl, k) {
        anEl.style.transition = initialTransitions[k]; // eslint-disable-line no-param-reassign
      });

      // Now transition the target can transition smoothly from where it
      // was dropped to its final position at translate value 0.
      setTranslation(target, 0);
    }, 15);

    //  adjustElementsToTops(els, topsBeforeInsertion);
  }

  function init(e, el, elements) {
    if ((typeof el === 'undefined' ? 'undefined' : _typeof$1(el)) !== 'object') {
      throw new Error('trackReorderDrag(): Invalid parameter');
    }

    // Reorder elements
    elements.sort(function (el1, el2) {
      return el1.getBoundingClientRect().top > el2.getBoundingClientRect().top;
    });

    // Set initial states
    var initialTops = [];
    elements.forEach(function (element) {
      initialTops.push(element.getBoundingClientRect().top);
    });

    var elIndex = elements.indexOf(el);

    // Create throttled drag listener
    var initialY = e.pageY;
    var dragListener = createDragListener(elements, initialTops, elIndex, initialY);
    var throttledDragListener = throttle(50, dragListener);

    // Listen to drags
    var eventTarget = e.target;
    eventTarget.addEventListener('drag', throttledDragListener);
    eventTarget.addEventListener('dragend', function dragEndListener() {
      dragListener.stop();
      insertTargetInRightPlace(elements, initialTops, elIndex);
      eventTarget.removeEventListener('drag', throttledDragListener);
      eventTarget.removeEventListener('dragend', dragEndListener);
    });
  }

  init(paramE, paramEl, paramElements);
}

/**
 * Returns a new array without the element in the given index
 * @method removeIndex
 * @param {Int} index
 * @return {Array} [description]
 */
function removeIndex(arr, index) {
  assert(typeof index === 'number', 'Invalid index: ' + index);
  return arr.slice(0, index).concat(arr.slice(index + 1, arr.length));
}

var demoData = [{ "album": { "album_type": "album", "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "GB", "AD", "MC", "ID"], "external_urls": { "spotify": "https://open.spotify.com/album/0TN9abNwnSnMW3jxw6uIeL" }, "href": "https://api.spotify.com/v1/albums/0TN9abNwnSnMW3jxw6uIeL", "id": "0TN9abNwnSnMW3jxw6uIeL", "images": [{ "height": 640, "url": "https://i.scdn.co/image/da88959a881cdc64bd576383c755fec0af2ca5f5", "width": 640 }, { "height": 300, "url": "https://i.scdn.co/image/6d2190a9b3f711b57e6ee924fa343239a36752df", "width": 300 }, { "height": 64, "url": "https://i.scdn.co/image/66f1b8e6703f912ffd76947ab8ab428a87e44ed0", "width": 64 }], "name": "Total Life Forever", "type": "album", "uri": "spotify:album:0TN9abNwnSnMW3jxw6uIeL" }, "artists": [{ "external_urls": { "spotify": "https://open.spotify.com/artist/6FQqZYVfTNQ1pCqfkwVFEa" }, "href": "https://api.spotify.com/v1/artists/6FQqZYVfTNQ1pCqfkwVFEa", "id": "6FQqZYVfTNQ1pCqfkwVFEa", "name": "Foals", "type": "artist", "uri": "spotify:artist:6FQqZYVfTNQ1pCqfkwVFEa" }], "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "GB", "AD", "MC", "ID"], "disc_number": 1, "duration_ms": 409560, "explicit": true, "external_ids": { "isrc": "GBAHT1000047" }, "external_urls": { "spotify": "https://open.spotify.com/track/4i3txPQIUV4eC9g9FBpi9I" }, "href": "https://api.spotify.com/v1/tracks/4i3txPQIUV4eC9g9FBpi9I", "id": "4i3txPQIUV4eC9g9FBpi9I", "name": "Spanish Sahara", "popularity": 60, "preview_url": "https://p.scdn.co/mp3-preview/75d32af506df2354251f80726ab3e0656fa8e8f7", "track_number": 5, "type": "track", "uri": "spotify:track:4i3txPQIUV4eC9g9FBpi9I" }, { "album": { "album_type": "album", "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"], "external_urls": { "spotify": "https://open.spotify.com/album/0UccZZgelTAbbk3OSPZymO" }, "href": "https://api.spotify.com/v1/albums/0UccZZgelTAbbk3OSPZymO", "id": "0UccZZgelTAbbk3OSPZymO", "images": [{ "height": 640, "url": "https://i.scdn.co/image/f66195f98d32ffb0f1fcca0ea9e69e2794ec6742", "width": 640 }, { "height": 300, "url": "https://i.scdn.co/image/1f594d484a753cf21d909f3eaf0c3953d7caca61", "width": 300 }, { "height": 64, "url": "https://i.scdn.co/image/f323863361593570fe9a932e006a5a8b834991ec", "width": 64 }], "name": "Greatest Hits Volume One - The Singles", "type": "album", "uri": "spotify:album:0UccZZgelTAbbk3OSPZymO" }, "artists": [{ "external_urls": { "spotify": "https://open.spotify.com/artist/2sil8z5kiy4r76CRTXxBCA" }, "href": "https://api.spotify.com/v1/artists/2sil8z5kiy4r76CRTXxBCA", "id": "2sil8z5kiy4r76CRTXxBCA", "name": "The Goo Goo Dolls", "type": "artist", "uri": "spotify:artist:2sil8z5kiy4r76CRTXxBCA" }], "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"], "disc_number": 1, "duration_ms": 238333, "explicit": false, "external_ids": { "isrc": "USWB10704696" }, "external_urls": { "spotify": "https://open.spotify.com/track/7p1PhtGLjq0ISncRXBHqXY" }, "href": "https://api.spotify.com/v1/tracks/7p1PhtGLjq0ISncRXBHqXY", "id": "7p1PhtGLjq0ISncRXBHqXY", "name": "Here Is Gone", "popularity": 52, "preview_url": "https://p.scdn.co/mp3-preview/4a8b9f71672407eeae6b138cf27ad1613cafe767", "track_number": 3, "type": "track", "uri": "spotify:track:7p1PhtGLjq0ISncRXBHqXY" }, { "album": { "album_type": "album", "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"], "external_urls": { "spotify": "https://open.spotify.com/album/67cksuMf5EvK5pu1DwGeFi" }, "href": "https://api.spotify.com/v1/albums/67cksuMf5EvK5pu1DwGeFi", "id": "67cksuMf5EvK5pu1DwGeFi", "images": [{ "height": 640, "url": "https://i.scdn.co/image/cc5549f65c77d85b5b5405ba3a18f15995a7be9b", "width": 640 }, { "height": 300, "url": "https://i.scdn.co/image/265b55a307f70ba0c3f4770843601ab7130f0de6", "width": 300 }, { "height": 64, "url": "https://i.scdn.co/image/82363a9ee7c45f8afce1df0e541e56dea1be2a33", "width": 64 }], "name": "Illusions", "type": "album", "uri": "spotify:album:67cksuMf5EvK5pu1DwGeFi" }, "artists": [{ "external_urls": { "spotify": "https://open.spotify.com/artist/0NSO0g40h9CTj13hKPskeb" }, "href": "https://api.spotify.com/v1/artists/0NSO0g40h9CTj13hKPskeb", "id": "0NSO0g40h9CTj13hKPskeb", "name": "Ibrahim Maalouf", "type": "artist", "uri": "spotify:artist:0NSO0g40h9CTj13hKPskeb" }], "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"], "disc_number": 1, "duration_ms": 291303, "explicit": false, "external_ids": { "isrc": "FRP8H1300280" }, "external_urls": { "spotify": "https://open.spotify.com/track/5EzGOkUwkRUXYAyvjlEHah" }, "href": "https://api.spotify.com/v1/tracks/5EzGOkUwkRUXYAyvjlEHah", "id": "5EzGOkUwkRUXYAyvjlEHah", "name": "True Sorry", "popularity": 49, "preview_url": "https://p.scdn.co/mp3-preview/6b6beff68189d762fb03f3a24c5ada56c6232f61", "track_number": 8, "type": "track", "uri": "spotify:track:5EzGOkUwkRUXYAyvjlEHah" }];

var TrackList = function (_ViewController) {
  _inherits(TrackList, _ViewController);

  function TrackList(modulePrefix) {
    _classCallCheck(this, TrackList);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TrackList).call(this, modulePrefix));

    _this.tracks = [];
    _this.setTracks(_this.tracks);
    Object.preventExtensions(_this);

    _this.acceptEvents('change');
    _this.setTracks(demoData);
    return _this;
  }

  _createClass(TrackList, [{
    key: 'buildHtml',
    value: function buildHtml() {
      _get(Object.getPrototypeOf(TrackList.prototype), 'buildHtml', this).call(this);
    }
  }, {
    key: 'getTracks',
    value: function getTracks() {}

    /**
     * @public
     * @method setTracks
     * @param  {Array<Object>} tracks
     */

  }, {
    key: 'setTracks',
    value: function setTracks(tracks) {
      var _this2 = this;

      assert(Array.isArray(tracks), 'Invalid tracks object. Not an array: "' + tracks + '"');
      this.clearAllTracks();
      tracks.forEach(function (trackInfo) {
        return _this2.addTrack(trackInfo);
      });
    }

    /**
     * @private
     * @method clearAllTracks
     * @return {void}
     */

  }, {
    key: 'clearAllTracks',
    value: function clearAllTracks() {
      // TODO implement this
      this.tracks.forEach(function (t) {
        return t.destroy();
      });
    }

    /**
     * @private
     * @method addTrack
     * @param  {Object} trackInfo
     * @return {Track}
     */

  }, {
    key: 'addTrack',
    value: function addTrack(trackInfo) {
      var _this3 = this;

      var newTrack = new Track(this.modulePrefix, trackInfo);

      newTrack.on('dragstart', function (track, e) {
        e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
        var allTracks = _this3.tracks.map(function (t) {
          return t.getContainer();
        });
        var trackEl = track.getContainer();
        trackReorderDrag(e, trackEl, allTracks);
      });

      newTrack.on('dragend', function () {
        // Reorder components according to their position.
        var beforeReordering = JSON.stringify(_this3.html.container);
        _this3.tracks.sort(function (t1, t2) {
          return t1.getContainer().getBoundingClientRect().top > t2.getContainer().getBoundingClientRect().top;
        });

        // Trigger change if elements were reordered
        var afterReordering = JSON.stringify(_this3.html.container);
        if (beforeReordering !== afterReordering) {
          _this3.trigger('change');
        }
      });

      newTrack.on('deleteBtnClick', function () {
        var trackIndex = _this3.tracks.indexOf(newTrack);
        assert(trackIndex !== -1, 'Invalid track being deleted.');
        _this3.tracks = removeIndex(_this3.tracks, trackIndex);
        newTrack.destroy();
        _this3.trigger('change');
      });

      this.html.container.appendChild(newTrack.getContainer());
      this.tracks.push(newTrack);
      return newTrack;
    }
  }]);

  return TrackList;
}(ViewController);

var SubmissionBox = function (_ViewController) {
  _inherits(SubmissionBox, _ViewController);

  function SubmissionBox(modulePrefix) {
    _classCallCheck(this, SubmissionBox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SubmissionBox).call(this, modulePrefix));

    _this.highlightTimeout = null;
    _this.acceptEvents('submit');
    return _this;
  }

  _createClass(SubmissionBox, [{
    key: 'buildHtml',
    value: function buildHtml() {
      var _this2 = this;

      _get(Object.getPrototypeOf(SubmissionBox.prototype), 'buildHtml', this).call(this);

      var submitBtn = document.createElement('button');
      this.html.submitBtn = submitBtn;
      submitBtn.innerHTML = constants.soundNoteIcon;
      submitBtn.classList.add(this.cssPrefix + '-submitBtn', 'btn', 'btn-default');
      this.html.container.appendChild(submitBtn);
      submitBtn.addEventListener('click', function () {
        _this2.trigger('submit');
      });

      var textInput = document.createElement('input');
      this.html.textInput = textInput;
      textInput.setAttribute('type', 'text');
      textInput.classList.add(this.cssPrefix + '-textInput', 'form-control');
      this.html.container.appendChild(textInput);
      textInput.addEventListener('keydown', function (e) {
        var enterKeyCode = 13;
        var keyPressedCode = e.keyCode ? e.keyCode : e.which;
        if (keyPressedCode === enterKeyCode) {
          _this2.trigger('submit');
        }
      });
    }

    /**
     * @public
     * @method getInput
     * @return {String}
     */

  }, {
    key: 'getInput',
    value: function getInput() {
      return this.html.textInput.value.trim();
    }

    /**
     * @public
     * @method setInput
     * @param  {String} text
     */

  }, {
    key: 'setInput',
    value: function setInput(text) {
      assert(typeof text === 'string', 'Invalid value for inputText: ' + text);
      this.html.textInput.value = text;
    }

    /**
     * Highlights the submission box for success or failure
     * @method showOutcomeSuccess
     * @param  {Boolean} noError
     * @param  {Int} duration
     * @return {void}
     */

  }, {
    key: 'showOutcomeSuccess',
    value: function showOutcomeSuccess() {
      var _this3 = this;

      var noError = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      var duration = arguments.length <= 1 || arguments[1] === undefined ? 2000 : arguments[1];

      var successClass = 'has-success';
      var errorClass = 'has-error';

      if (noError) {
        this.html.container.classList.add(successClass);
      } else {
        this.html.container.classList.add(errorClass);
      }
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = setTimeout(function () {
        return _this3.html.container.classList.remove(successClass, errorClass);
      }, duration);
    }
  }]);

  return SubmissionBox;
}(ViewController);

var WidgetContainer = function (_ViewController) {
  _inherits(WidgetContainer, _ViewController);

  function WidgetContainer(modulePrefix) {
    _classCallCheck(this, WidgetContainer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WidgetContainer).call(this, modulePrefix));

    _this.infoTimeout = null;
    Object.preventExtensions(_this);
    return _this;
  }

  _createClass(WidgetContainer, [{
    key: 'buildHtml',
    value: function buildHtml() {
      _get(Object.getPrototypeOf(WidgetContainer.prototype), 'buildHtml', this).call(this);
      var info = document.createElement('span');
      this.html.info = info;
      info.classList.add(this.cssPrefix + '-info');
      this.html.container.appendChild(info);

      var loadingIndicator = document.createElement('span');
      this.html.loadingIndicator = loadingIndicator;
      loadingIndicator.classList.add(this.cssPrefix + '-loadingIndicator');
      this.html.container.appendChild(loadingIndicator);

      var submissionBox = document.createElement('span');
      this.html.submissionBox = submissionBox;
      this.html.container.appendChild(submissionBox);

      var trackList = document.createElement('div');
      this.html.trackList = trackList;
      trackList.classList.add(this.cssPrefix + '-trackList');
      this.html.container.appendChild(trackList);
    }

    /**
     * Sets a ViewController instance as one of the container's elements.
     * @public
     * @method set
     * @param  {String} name
     * @param  {ViewController} instance
     */

  }, {
    key: 'set',
    value: function set(name, instance) {
      assert(this.html[name], 'Trying to set invalid property: ' + name);
      this.html[name].parentNode.replaceChild(instance.html.container, this.html[name]);
      this.html[name] = instance.html.container;
    }

    /**
     * Displays a message for a certain period of time
     * @method displayInfo
     * @param  {String} message
     * @param  {Int} duration
     * @return {void}
     */

  }, {
    key: 'displayInfo',
    value: function displayInfo(message) {
      var _this2 = this;

      var error = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var duration = arguments.length <= 2 || arguments[2] === undefined ? 2000 : arguments[2];

      var errorClass = this.cssPrefix + '-info--error';
      var successClass = this.cssPrefix + '-info--success';
      this.html.info.classList.remove(errorClass, successClass);
      this.html.info.innerHTML = message;
      if (error) {
        this.html.info.classList.add(errorClass);
      } else {
        this.html.info.classList.add(successClass);
      }
      this.errorTimeout = setTimeout(function () {
        _this2.html.info.classList.remove(errorClass, successClass);
        _this2.html.info.innerHTML = '';
      }, duration);
    }
  }]);

  return WidgetContainer;
}(ViewController);

var ModuleCoordinator = function () {
  function ModuleCoordinator(modulePrefix) {
    var _this = this;

    _classCallCheck(this, ModuleCoordinator);

    this.submissionBox = new SubmissionBox(modulePrefix);
    this.widgetContainer = new WidgetContainer(modulePrefix);
    this.trackList = new TrackList(modulePrefix);
    Object.preventExtensions(this);

    this.widgetContainer.set('submissionBox', this.submissionBox);
    this.widgetContainer.set('trackList', this.trackList);
    this.submissionBox.on('submit', function () {
      return _this.submitTrack();
    });
  }

  /**
   * @private
   * @method submitTrack
   * @return {void}
   */


  _createClass(ModuleCoordinator, [{
    key: 'submitTrack',
    value: function submitTrack() {
      var trackUri = this.submissionBox.getInput();
      if (this.isValid(trackUri)) {
        this.displayInfo('Valid track');
      } else {
        this.displayInfo('Invalid track', true);
      }
    }

    /**
     * @private
     * @method isValid
     * @param  {String} trackUri
     * @return {Boolean}
     */

  }, {
    key: 'isValid',
    value: function isValid(trackUri) {
      var linkValidation = /^https:\/\/open.spotify.com\/track\/\w{22}$/;
      var uriValidation = /^spotify:track:\w{22}$/;
      return linkValidation.test(trackUri) || uriValidation.test(trackUri);
    }

    /**
     * @public
     * @method getWidget
     * @return {[type]} [description]
     */

  }, {
    key: 'getWidget',
    value: function getWidget() {
      return this.widgetContainer.getContainer();
    }

    /**
     * @private
     * @method displayInfo
     * @param  {String} message
     * @param  {Boolean} isError
     * @return {void}
     */

  }, {
    key: 'displayInfo',
    value: function displayInfo(message) {
      var isError = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var duration = 2000;
      this.widgetContainer.displayInfo(message, isError, duration);
      this.submissionBox.showOutcomeSuccess(!isError, duration);
    }
  }]);

  return ModuleCoordinator;
}();

var MODULE_PREFIX = 'fl-pw';

xController(function (xdiv) {
  console.log(xdiv);
  var serverUrl = 'tesssst';
  var userId = 'abcde';

  var coordinator = new ModuleCoordinator(MODULE_PREFIX);
  xdiv.appendChild(coordinator.getWidget());
});
}());
//# sourceMappingURL=fl-playlist-widget.js.map
