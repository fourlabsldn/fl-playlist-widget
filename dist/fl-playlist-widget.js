(function () {
var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

var runtime = __commonjs(function (module, exports, global) {
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : __commonjs_global
);
});

var require$$0$1 = (runtime && typeof runtime === 'object' && 'default' in runtime ? runtime['default'] : runtime);

var runtimeModule = __commonjs(function (module, exports, global) {
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : __commonjs_global;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require$$0$1;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}
});

var require$$0 = (runtimeModule && typeof runtimeModule === 'object' && 'default' in runtimeModule ? runtimeModule['default'] : runtimeModule);

var index = __commonjs(function (module) {
module.exports = require$$0;
});

var _regeneratorRuntime = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

var _core = __commonjs(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var require$$0$4 = (_core && typeof _core === 'object' && 'default' in _core ? _core['default'] : _core);

var _global = __commonjs(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var require$$29 = (_global && typeof _global === 'object' && 'default' in _global ? _global['default'] : _global);

var _uid = __commonjs(function (module) {
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
});

var require$$4 = (_uid && typeof _uid === 'object' && 'default' in _uid ? _uid['default'] : _uid);

var _shared = __commonjs(function (module) {
var global = require$$29
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
});

var require$$22 = (_shared && typeof _shared === 'object' && 'default' in _shared ? _shared['default'] : _shared);

var _wks = __commonjs(function (module) {
var store      = require$$22('wks')
  , uid        = require$$4
  , Symbol     = require$$29.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
});

var require$$19 = (_wks && typeof _wks === 'object' && 'default' in _wks ? _wks['default'] : _wks);

var _iterDetect = __commonjs(function (module) {
var ITERATOR     = require$$19('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
});

var require$$0$5 = (_iterDetect && typeof _iterDetect === 'object' && 'default' in _iterDetect ? _iterDetect['default'] : _iterDetect);

var _fails = __commonjs(function (module) {
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
});

var require$$0$6 = (_fails && typeof _fails === 'object' && 'default' in _fails ? _fails['default'] : _fails);

var _descriptors = __commonjs(function (module) {
// Thank's IE8 for his funny defineProperty
module.exports = !require$$0$6(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
});

var require$$27 = (_descriptors && typeof _descriptors === 'object' && 'default' in _descriptors ? _descriptors['default'] : _descriptors);

var _isObject = __commonjs(function (module) {
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
});

var require$$3 = (_isObject && typeof _isObject === 'object' && 'default' in _isObject ? _isObject['default'] : _isObject);

var _toPrimitive = __commonjs(function (module) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require$$3;
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

var require$$11 = (_toPrimitive && typeof _toPrimitive === 'object' && 'default' in _toPrimitive ? _toPrimitive['default'] : _toPrimitive);

var _domCreate = __commonjs(function (module) {
var isObject = require$$3
  , document = require$$29.document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
});

var require$$1$2 = (_domCreate && typeof _domCreate === 'object' && 'default' in _domCreate ? _domCreate['default'] : _domCreate);

var _ie8DomDefine = __commonjs(function (module) {
module.exports = !require$$27 && !require$$0$6(function(){
  return Object.defineProperty(require$$1$2('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
});

var require$$1$1 = (_ie8DomDefine && typeof _ie8DomDefine === 'object' && 'default' in _ie8DomDefine ? _ie8DomDefine['default'] : _ie8DomDefine);

var _anObject = __commonjs(function (module) {
var isObject = require$$3;
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
});

var require$$13 = (_anObject && typeof _anObject === 'object' && 'default' in _anObject ? _anObject['default'] : _anObject);

var _objectDp = __commonjs(function (module, exports) {
var anObject       = require$$13
  , IE8_DOM_DEFINE = require$$1$1
  , toPrimitive    = require$$11
  , dP             = Object.defineProperty;

exports.f = require$$27 ? Object.defineProperty : function defineProperty(O, P, Attributes){
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

var _setSpecies = __commonjs(function (module) {
'use strict';
var global      = require$$29
  , core        = require$$0$4
  , dP          = require$$1
  , DESCRIPTORS = require$$27
  , SPECIES     = require$$19('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
});

var require$$2 = (_setSpecies && typeof _setSpecies === 'object' && 'default' in _setSpecies ? _setSpecies['default'] : _setSpecies);

var _has = __commonjs(function (module) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
});

var require$$2$1 = (_has && typeof _has === 'object' && 'default' in _has ? _has['default'] : _has);

var _setToStringTag = __commonjs(function (module) {
var def = require$$1.f
  , has = require$$2$1
  , TAG = require$$19('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
});

var require$$21 = (_setToStringTag && typeof _setToStringTag === 'object' && 'default' in _setToStringTag ? _setToStringTag['default'] : _setToStringTag);

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

var require$$10 = (_propertyDesc && typeof _propertyDesc === 'object' && 'default' in _propertyDesc ? _propertyDesc['default'] : _propertyDesc);

var _hide = __commonjs(function (module) {
var dP         = require$$1
  , createDesc = require$$10;
module.exports = require$$27 ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
});

var require$$0$7 = (_hide && typeof _hide === 'object' && 'default' in _hide ? _hide['default'] : _hide);

var _redefineAll = __commonjs(function (module) {
var hide = require$$0$7;
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
});

var require$$4$1 = (_redefineAll && typeof _redefineAll === 'object' && 'default' in _redefineAll ? _redefineAll['default'] : _redefineAll);

var _cof = __commonjs(function (module) {
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
});

var require$$0$8 = (_cof && typeof _cof === 'object' && 'default' in _cof ? _cof['default'] : _cof);

var _html = __commonjs(function (module) {
module.exports = require$$29.document && document.documentElement;
});

var require$$0$9 = (_html && typeof _html === 'object' && 'default' in _html ? _html['default'] : _html);

var _invoke = __commonjs(function (module) {
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
});

var require$$4$2 = (_invoke && typeof _invoke === 'object' && 'default' in _invoke ? _invoke['default'] : _invoke);

var _aFunction = __commonjs(function (module) {
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
});

var require$$1$5 = (_aFunction && typeof _aFunction === 'object' && 'default' in _aFunction ? _aFunction['default'] : _aFunction);

var _ctx = __commonjs(function (module) {
// optional / simple context binding
var aFunction = require$$1$5;
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

var require$$1$4 = (_ctx && typeof _ctx === 'object' && 'default' in _ctx ? _ctx['default'] : _ctx);

var _task = __commonjs(function (module, exports, global) {
var ctx                = require$$1$4
  , invoke             = require$$4$2
  , html               = require$$0$9
  , cel                = require$$1$2
  , global             = require$$29
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require$$0$8(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
});

var require$$1$3 = (_task && typeof _task === 'object' && 'default' in _task ? _task['default'] : _task);

var _microtask = __commonjs(function (module) {
var global    = require$$29
  , macrotask = require$$1$3.set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require$$0$8(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
});

var require$$6 = (_microtask && typeof _microtask === 'object' && 'default' in _microtask ? _microtask['default'] : _microtask);

var _speciesConstructor = __commonjs(function (module) {
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require$$13
  , aFunction = require$$1$5
  , SPECIES   = require$$19('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
});

var require$$8 = (_speciesConstructor && typeof _speciesConstructor === 'object' && 'default' in _speciesConstructor ? _speciesConstructor['default'] : _speciesConstructor);

var _defined = __commonjs(function (module) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
});

var require$$0$11 = (_defined && typeof _defined === 'object' && 'default' in _defined ? _defined['default'] : _defined);

var _iobject = __commonjs(function (module) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require$$0$8;
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
});

var require$$1$7 = (_iobject && typeof _iobject === 'object' && 'default' in _iobject ? _iobject['default'] : _iobject);

var _toIobject = __commonjs(function (module) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require$$1$7
  , defined = require$$0$11;
module.exports = function(it){
  return IObject(defined(it));
};
});

var require$$2$2 = (_toIobject && typeof _toIobject === 'object' && 'default' in _toIobject ? _toIobject['default'] : _toIobject);

var _objectPie = __commonjs(function (module, exports) {
exports.f = {}.propertyIsEnumerable;
});

var require$$0$12 = (_objectPie && typeof _objectPie === 'object' && 'default' in _objectPie ? _objectPie['default'] : _objectPie);

var _objectGopd = __commonjs(function (module, exports) {
var pIE            = require$$0$12
  , createDesc     = require$$10
  , toIObject      = require$$2$2
  , toPrimitive    = require$$11
  , has            = require$$2$1
  , IE8_DOM_DEFINE = require$$1$1
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require$$27 ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
});

var require$$1$6 = (_objectGopd && typeof _objectGopd === 'object' && 'default' in _objectGopd ? _objectGopd['default'] : _objectGopd);

var _setProto = __commonjs(function (module) {
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require$$3
  , anObject = require$$13;
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require$$1$4(Function.call, require$$1$6.f(Object.prototype, '__proto__').set, 2);
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

var require$$0$10 = (_setProto && typeof _setProto === 'object' && 'default' in _setProto ? _setProto['default'] : _setProto);

var _iterators = __commonjs(function (module) {
module.exports = {};
});

var require$$4$3 = (_iterators && typeof _iterators === 'object' && 'default' in _iterators ? _iterators['default'] : _iterators);

var _classof = __commonjs(function (module) {
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require$$0$8
  , TAG = require$$19('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
});

var require$$3$1 = (_classof && typeof _classof === 'object' && 'default' in _classof ? _classof['default'] : _classof);

var core_getIteratorMethod = __commonjs(function (module) {
var classof   = require$$3$1
  , ITERATOR  = require$$19('iterator')
  , Iterators = require$$4$3;
module.exports = require$$0$4.getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
});

var require$$0$13 = (core_getIteratorMethod && typeof core_getIteratorMethod === 'object' && 'default' in core_getIteratorMethod ? core_getIteratorMethod['default'] : core_getIteratorMethod);

var _toInteger = __commonjs(function (module) {
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
});

var require$$1$9 = (_toInteger && typeof _toInteger === 'object' && 'default' in _toInteger ? _toInteger['default'] : _toInteger);

var _toLength = __commonjs(function (module) {
// 7.1.15 ToLength
var toInteger = require$$1$9
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
});

var require$$1$8 = (_toLength && typeof _toLength === 'object' && 'default' in _toLength ? _toLength['default'] : _toLength);

var _isArrayIter = __commonjs(function (module) {
// check on default Array iterator
var Iterators  = require$$4$3
  , ITERATOR   = require$$19('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
});

var require$$3$2 = (_isArrayIter && typeof _isArrayIter === 'object' && 'default' in _isArrayIter ? _isArrayIter['default'] : _isArrayIter);

var _iterCall = __commonjs(function (module) {
// call something on iterator step with safe closing on error
var anObject = require$$13;
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
});

var require$$4$4 = (_iterCall && typeof _iterCall === 'object' && 'default' in _iterCall ? _iterCall['default'] : _iterCall);

var _forOf = __commonjs(function (module) {
var ctx         = require$$1$4
  , call        = require$$4$4
  , isArrayIter = require$$3$2
  , anObject    = require$$13
  , toLength    = require$$1$8
  , getIterFn   = require$$0$13
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
});

var require$$10$1 = (_forOf && typeof _forOf === 'object' && 'default' in _forOf ? _forOf['default'] : _forOf);

var _anInstance = __commonjs(function (module) {
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
});

var require$$11$1 = (_anInstance && typeof _anInstance === 'object' && 'default' in _anInstance ? _anInstance['default'] : _anInstance);

var _export = __commonjs(function (module, exports) {
var global    = require$$29
  , core      = require$$0$4
  , ctx       = require$$1$4
  , hide      = require$$0$7
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

var require$$1$10 = (_export && typeof _export === 'object' && 'default' in _export ? _export['default'] : _export);

var _library = __commonjs(function (module) {
module.exports = true;
});

var require$$1$11 = (_library && typeof _library === 'object' && 'default' in _library ? _library['default'] : _library);

var es6_promise = __commonjs(function (module, exports, global) {
'use strict';
var LIBRARY            = require$$1$11
  , global             = require$$29
  , ctx                = require$$1$4
  , classof            = require$$3$1
  , $export            = require$$1$10
  , isObject           = require$$3
  , anObject           = require$$13
  , aFunction          = require$$1$5
  , anInstance         = require$$11$1
  , forOf              = require$$10$1
  , setProto           = require$$0$10.set
  , speciesConstructor = require$$8
  , task               = require$$1$3.set
  , microtask          = require$$6()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require$$19('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require$$4$1($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require$$21($Promise, PROMISE);
require$$2(PROMISE);
Wrapper = require$$0$4[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require$$0$5(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
});

var _sharedKey = __commonjs(function (module) {
var shared = require$$22('keys')
  , uid    = require$$4;
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
});

var require$$0$15 = (_sharedKey && typeof _sharedKey === 'object' && 'default' in _sharedKey ? _sharedKey['default'] : _sharedKey);

var _toObject = __commonjs(function (module) {
// 7.1.13 ToObject(argument)
var defined = require$$0$11;
module.exports = function(it){
  return Object(defined(it));
};
});

var require$$2$3 = (_toObject && typeof _toObject === 'object' && 'default' in _toObject ? _toObject['default'] : _toObject);

var _objectGpo = __commonjs(function (module) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require$$2$1
  , toObject    = require$$2$3
  , IE_PROTO    = require$$0$15('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
});

var require$$1$12 = (_objectGpo && typeof _objectGpo === 'object' && 'default' in _objectGpo ? _objectGpo['default'] : _objectGpo);

var _enumBugKeys = __commonjs(function (module) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
});

var require$$0$17 = (_enumBugKeys && typeof _enumBugKeys === 'object' && 'default' in _enumBugKeys ? _enumBugKeys['default'] : _enumBugKeys);

var _toIndex = __commonjs(function (module) {
var toInteger = require$$1$9
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
});

var require$$0$18 = (_toIndex && typeof _toIndex === 'object' && 'default' in _toIndex ? _toIndex['default'] : _toIndex);

var _arrayIncludes = __commonjs(function (module) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require$$2$2
  , toLength  = require$$1$8
  , toIndex   = require$$0$18;
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

var require$$1$15 = (_arrayIncludes && typeof _arrayIncludes === 'object' && 'default' in _arrayIncludes ? _arrayIncludes['default'] : _arrayIncludes);

var _objectKeysInternal = __commonjs(function (module) {
var has          = require$$2$1
  , toIObject    = require$$2$2
  , arrayIndexOf = require$$1$15(false)
  , IE_PROTO     = require$$0$15('IE_PROTO');

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

var require$$1$14 = (_objectKeysInternal && typeof _objectKeysInternal === 'object' && 'default' in _objectKeysInternal ? _objectKeysInternal['default'] : _objectKeysInternal);

var _objectKeys = __commonjs(function (module) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require$$1$14
  , enumBugKeys = require$$0$17;

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
});

var require$$1$13 = (_objectKeys && typeof _objectKeys === 'object' && 'default' in _objectKeys ? _objectKeys['default'] : _objectKeys);

var _objectDps = __commonjs(function (module) {
var dP       = require$$1
  , anObject = require$$13
  , getKeys  = require$$1$13;

module.exports = require$$27 ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
});

var require$$4$5 = (_objectDps && typeof _objectDps === 'object' && 'default' in _objectDps ? _objectDps['default'] : _objectDps);

var _objectCreate = __commonjs(function (module) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require$$13
  , dPs         = require$$4$5
  , enumBugKeys = require$$0$17
  , IE_PROTO    = require$$0$15('IE_PROTO')
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
  require$$0$9.appendChild(iframe);
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

var require$$0$16 = (_objectCreate && typeof _objectCreate === 'object' && 'default' in _objectCreate ? _objectCreate['default'] : _objectCreate);

var _iterCreate = __commonjs(function (module) {
'use strict';
var create         = require$$0$16
  , descriptor     = require$$10
  , setToStringTag = require$$21
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require$$0$7(IteratorPrototype, require$$19('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
});

var require$$3$3 = (_iterCreate && typeof _iterCreate === 'object' && 'default' in _iterCreate ? _iterCreate['default'] : _iterCreate);

var _redefine = __commonjs(function (module) {
module.exports = require$$0$7;
});

var require$$25 = (_redefine && typeof _redefine === 'object' && 'default' in _redefine ? _redefine['default'] : _redefine);

var _iterDefine = __commonjs(function (module) {
'use strict';
var LIBRARY        = require$$1$11
  , $export        = require$$1$10
  , redefine       = require$$25
  , hide           = require$$0$7
  , has            = require$$2$1
  , Iterators      = require$$4$3
  , $iterCreate    = require$$3$3
  , setToStringTag = require$$21
  , getPrototypeOf = require$$1$12
  , ITERATOR       = require$$19('iterator')
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

var require$$0$14 = (_iterDefine && typeof _iterDefine === 'object' && 'default' in _iterDefine ? _iterDefine['default'] : _iterDefine);

var _iterStep = __commonjs(function (module) {
module.exports = function(done, value){
  return {value: value, done: !!done};
};
});

var require$$3$4 = (_iterStep && typeof _iterStep === 'object' && 'default' in _iterStep ? _iterStep['default'] : _iterStep);

var _addToUnscopables = __commonjs(function (module) {
module.exports = function(){ /* empty */ };
});

var require$$4$6 = (_addToUnscopables && typeof _addToUnscopables === 'object' && 'default' in _addToUnscopables ? _addToUnscopables['default'] : _addToUnscopables);

var es6_array_iterator = __commonjs(function (module) {
'use strict';
var addToUnscopables = require$$4$6
  , step             = require$$3$4
  , Iterators        = require$$4$3
  , toIObject        = require$$2$2;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require$$0$14(Array, 'Array', function(iterated, kind){
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
var global        = require$$29
  , hide          = require$$0$7
  , Iterators     = require$$4$3
  , TO_STRING_TAG = require$$19('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
});

var _stringAt = __commonjs(function (module) {
var toInteger = require$$1$9
  , defined   = require$$0$11;
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
require$$0$14(String, 'String', function(iterated){
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

var promise$1 = __commonjs(function (module) {
module.exports = require$$0$4.Promise;
});

var require$$0$3 = (promise$1 && typeof promise$1 === 'object' && 'default' in promise$1 ? promise$1['default'] : promise$1);

var promise = __commonjs(function (module) {
module.exports = { "default": require$$0$3, __esModule: true };
});

var require$$0$2 = (promise && typeof promise === 'object' && 'default' in promise ? promise['default'] : promise);

var asyncToGenerator = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _promise = require$$0$2;

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            return step("next", value);
          }, function (err) {
            return step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
});

var _asyncToGenerator = (asyncToGenerator && typeof asyncToGenerator === 'object' && 'default' in asyncToGenerator ? asyncToGenerator['default'] : asyncToGenerator);

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

var es6_object_defineProperty = __commonjs(function (module) {
var $export = require$$1$10;
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require$$27, 'Object', {defineProperty: require$$1.f});
});

var defineProperty$1 = __commonjs(function (module) {
var $Object = require$$0$4.Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
});

var require$$0$20 = (defineProperty$1 && typeof defineProperty$1 === 'object' && 'default' in defineProperty$1 ? defineProperty$1['default'] : defineProperty$1);

var defineProperty = __commonjs(function (module) {
module.exports = { "default": require$$0$20, __esModule: true };
});

var require$$0$19 = (defineProperty && typeof defineProperty === 'object' && 'default' in defineProperty ? defineProperty['default'] : defineProperty);

var createClass = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _defineProperty = require$$0$19;

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

var _wksExt = __commonjs(function (module, exports) {
exports.f = require$$19;
});

var require$$0$23 = (_wksExt && typeof _wksExt === 'object' && 'default' in _wksExt ? _wksExt['default'] : _wksExt);

var _wksDefine = __commonjs(function (module) {
var global         = require$$29
  , core           = require$$0$4
  , LIBRARY        = require$$1$11
  , wksExt         = require$$0$23
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

var require$$1$17 = (_objectGops && typeof _objectGops === 'object' && 'default' in _objectGops ? _objectGops['default'] : _objectGops);

var _objectGopn = __commonjs(function (module, exports) {
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require$$1$14
  , hiddenKeys = require$$0$17.concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
});

var require$$0$24 = (_objectGopn && typeof _objectGopn === 'object' && 'default' in _objectGopn ? _objectGopn['default'] : _objectGopn);

var _objectGopnExt = __commonjs(function (module) {
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require$$2$2
  , gOPN      = require$$0$24.f
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

var require$$8$1 = (_objectGopnExt && typeof _objectGopnExt === 'object' && 'default' in _objectGopnExt ? _objectGopnExt['default'] : _objectGopnExt);

var _isArray = __commonjs(function (module) {
// 7.2.2 IsArray(argument)
var cof = require$$0$8;
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
});

var require$$14 = (_isArray && typeof _isArray === 'object' && 'default' in _isArray ? _isArray['default'] : _isArray);

var _enumKeys = __commonjs(function (module) {
// all enumerable object keys, includes symbols
var getKeys = require$$1$13
  , gOPS    = require$$1$17
  , pIE     = require$$0$12;
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
  , toIObject = require$$2$2;
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

var _meta = __commonjs(function (module) {
var META     = require$$4('meta')
  , isObject = require$$3
  , has      = require$$2$1
  , setDesc  = require$$1.f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require$$0$6(function(){
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

var es6_symbol = __commonjs(function (module) {
'use strict';
// ECMAScript 6 symbols shim
var global         = require$$29
  , has            = require$$2$1
  , DESCRIPTORS    = require$$27
  , $export        = require$$1$10
  , redefine       = require$$25
  , META           = require$$24.KEY
  , $fails         = require$$0$6
  , shared         = require$$22
  , setToStringTag = require$$21
  , uid            = require$$4
  , wks            = require$$19
  , wksExt         = require$$0$23
  , wksDefine      = require$$17
  , keyOf          = require$$16
  , enumKeys       = require$$15
  , isArray        = require$$14
  , anObject       = require$$13
  , toIObject      = require$$2$2
  , toPrimitive    = require$$11
  , createDesc     = require$$10
  , _create        = require$$0$16
  , gOPNExt        = require$$8$1
  , $GOPD          = require$$1$6
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
  require$$0$24.f = gOPNExt.f = $getOwnPropertyNames;
  require$$0$12.f  = $propertyIsEnumerable;
  require$$1$17.f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require$$1$11){
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
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require$$0$7($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
});

var index$1 = __commonjs(function (module) {
module.exports = require$$0$4.Symbol;
});

var require$$0$22 = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

var symbol = __commonjs(function (module) {
module.exports = { "default": require$$0$22, __esModule: true };
});

var require$$0$21 = (symbol && typeof symbol === 'object' && 'default' in symbol ? symbol['default'] : symbol);

var iterator$1 = __commonjs(function (module) {
module.exports = require$$0$23.f('iterator');
});

var require$$0$25 = (iterator$1 && typeof iterator$1 === 'object' && 'default' in iterator$1 ? iterator$1['default'] : iterator$1);

var iterator = __commonjs(function (module) {
module.exports = { "default": require$$0$25, __esModule: true };
});

var require$$1$18 = (iterator && typeof iterator === 'object' && 'default' in iterator ? iterator['default'] : iterator);

var _typeof = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _iterator = require$$1$18;

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require$$0$21;

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
var $export = require$$1$10
  , core    = require$$0$4
  , fails   = require$$0$6;
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
});

var require$$0$28 = (_objectSap && typeof _objectSap === 'object' && 'default' in _objectSap ? _objectSap['default'] : _objectSap);

var es6_object_getOwnPropertyDescriptor = __commonjs(function (module) {
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require$$2$2
  , $getOwnPropertyDescriptor = require$$1$6.f;

require$$0$28('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
});

var getOwnPropertyDescriptor$1 = __commonjs(function (module) {
var $Object = require$$0$4.Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
});

var require$$0$27 = (getOwnPropertyDescriptor$1 && typeof getOwnPropertyDescriptor$1 === 'object' && 'default' in getOwnPropertyDescriptor$1 ? getOwnPropertyDescriptor$1['default'] : getOwnPropertyDescriptor$1);

var getOwnPropertyDescriptor = __commonjs(function (module) {
module.exports = { "default": require$$0$27, __esModule: true };
});

var require$$0$26 = (getOwnPropertyDescriptor && typeof getOwnPropertyDescriptor === 'object' && 'default' in getOwnPropertyDescriptor ? getOwnPropertyDescriptor['default'] : getOwnPropertyDescriptor);

var es6_object_getPrototypeOf = __commonjs(function (module) {
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require$$2$3
  , $getPrototypeOf = require$$1$12;

require$$0$28('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
});

var getPrototypeOf$1 = __commonjs(function (module) {
module.exports = require$$0$4.Object.getPrototypeOf;
});

var require$$0$29 = (getPrototypeOf$1 && typeof getPrototypeOf$1 === 'object' && 'default' in getPrototypeOf$1 ? getPrototypeOf$1['default'] : getPrototypeOf$1);

var getPrototypeOf = __commonjs(function (module) {
module.exports = { "default": require$$0$29, __esModule: true };
});

var require$$1$19 = (getPrototypeOf && typeof getPrototypeOf === 'object' && 'default' in getPrototypeOf ? getPrototypeOf['default'] : getPrototypeOf);

var get = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require$$1$19;

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require$$0$26;

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
var $export = require$$1$10
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require$$0$16});
});

var create$1 = __commonjs(function (module) {
var $Object = require$$0$4.Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
});

var require$$0$30 = (create$1 && typeof create$1 === 'object' && 'default' in create$1 ? create$1['default'] : create$1);

var create = __commonjs(function (module) {
module.exports = { "default": require$$0$30, __esModule: true };
});

var require$$1$20 = (create && typeof create === 'object' && 'default' in create ? create['default'] : create);

var es6_object_setPrototypeOf = __commonjs(function (module) {
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require$$1$10;
$export($export.S, 'Object', {setPrototypeOf: require$$0$10.set});
});

var setPrototypeOf$1 = __commonjs(function (module) {
module.exports = require$$0$4.Object.setPrototypeOf;
});

var require$$0$31 = (setPrototypeOf$1 && typeof setPrototypeOf$1 === 'object' && 'default' in setPrototypeOf$1 ? setPrototypeOf$1['default'] : setPrototypeOf$1);

var setPrototypeOf = __commonjs(function (module) {
module.exports = { "default": require$$0$31, __esModule: true };
});

var require$$2$4 = (setPrototypeOf && typeof setPrototypeOf === 'object' && 'default' in setPrototypeOf ? setPrototypeOf['default'] : setPrototypeOf);

var inherits = __commonjs(function (module, exports) {
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require$$2$4;

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require$$1$20;

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
      this.html.container.classList.add('DESTROYED');
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
   trashIcon: '<svg height="1em" width="1em" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg2" viewBox="0 0 401.00392 437.17416" ><defs id="defs4" /><metadata id="metadata7"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g transform="translate(-69.142849,-71.290783)" id="layer1"><path style="fill-opacity:1" d="m 141.88876,507.71461 c -11.2959,-2.69082 -22.77229,-12.5913 -29.11149,-25.11395 -7.63899,-15.09029 -7.0366,-1.9836 -7.37949,-160.55988 l -0.30758,-142.25 -14.523341,0 c -15.07073,0 -19.42377,-0.95101 -20.80283,-4.5448 -0.34165,-0.89033 -0.62118,-7.15712 -0.62118,-13.9262 0,-10.62618 0.26105,-12.62993 1.91101,-14.66822 l 1.91103,-2.36078 46.641881,-0.5 46.64187,-0.5 10.80058,-25.63985 c 5.94031,-14.10192 11.73692,-26.95484 12.88135,-28.56204 3.83713,-5.38875 11.29712,-11.442569 18.03267,-14.633586 l 6.6796,-3.164521 55.05186,0 55.05187,0 7.50873,3.711018 c 5.12147,2.531166 9.25845,5.551519 13.01218,9.499999 5.01632,5.27659 6.32572,7.73623 14.79352,27.78898 5.10954,12.1 10.19863,24.1375 11.3091,26.75 l 2.01903,4.75 45.92231,0 45.92231,0 2.45454,2.45455 c 2.35305,2.35304 2.45455,2.98944 2.45455,15.38921 0,18.27613 0.78682,17.56494 -19.88623,17.97473 l -16.06737,0.3185 -0.30375,141.6815 c -0.28512,132.99472 -0.41397,142.04512 -2.1015,147.61197 -4.84592,15.98573 -15.55074,29.93802 -27.47351,35.80802 l -6.62461,3.26152 -126.02151,0.15905 c -71.24698,0.0899 -127.65321,-0.22964 -129.7756,-0.73522 z M 391.04124,470.6708 c 1.25154,-1.16598 3.2489,-4.20348 4.43856,-6.75 l 2.16304,-4.63002 0.267,-139.75 0.267,-139.75 -128.53406,0 -128.53405,0 0.26705,139.25 c 0.25137,131.07047 0.37214,139.5135 2.05591,143.73583 0.98386,2.4672 2.98055,5.7297 4.4371,7.25 l 2.64823,2.76417 119.12435,0 119.12435,0 2.27553,-2.11998 z M 183.5272,416.39957 c -1.99156,-0.89442 -3.52492,-2.57328 -4.25,-4.65325 -1.58465,-4.54571 -1.6092,-166.29495 -0.0259,-170.8367 1.70623,-4.89458 5.18594,-6.11884 17.39155,-6.11884 10.9993,0 15.61136,1.24185 16.87882,4.5448 0.34165,0.89033 0.62118,40.20353 0.62118,87.36267 l 0,85.7439 -2.57767,2.42432 c -2.36876,2.22783 -3.48315,2.4449 -13.75,2.67834 -7.89778,0.17958 -12.08551,-0.15609 -14.28798,-1.14524 z m 73.70637,0.30113 c -5.24241,-2.09609 -5.02482,1.77833 -5.05892,-90.07813 -0.0175,-47.11752 0.24772,-86.39666 0.58938,-87.28699 1.26745,-3.30295 5.87953,-4.5448 16.87881,-4.5448 12.78832,0 15.90811,1.20723 17.44786,6.7516 1.45386,5.23509 1.43275,164.33755 -0.0225,169.57828 -1.47713,5.31953 -5.1311,6.68781 -17.64324,6.60673 -5.38016,-0.0349 -10.86629,-0.49687 -12.19139,-1.02669 z m 74.40927,0.37425 c -1.1,-0.26611 -3.0125,-1.41735 -4.25,-2.55831 l -2.25,-2.07449 0,-86.13712 c 0,-84.69805 0.0333,-86.17292 1.99605,-88.27963 2.63232,-2.82547 6.76201,-3.49872 18.89783,-3.08084 8.87282,0.30553 10.32205,0.61391 12.33036,2.62374 l 2.27577,2.27752 0.26725,84.72248 c 0.20102,63.72861 -0.0275,85.4344 -0.92228,87.59549 -1.74536,4.2155 -6.17757,5.64703 -17.06286,5.51099 -5.10517,-0.0638 -10.18212,-0.33373 -11.28212,-0.59983 z m 1.57375,-275.53417 c -6.66627,-17.10754 -13.46419,-32.50479 -14.79034,-33.5 -1.2776,-0.95877 -12.65147,-1.25 -48.81955,-1.25 -44.4169,0 -47.24997,0.10618 -48.80935,1.82927 -1.66709,1.84211 -14.65451,32.04379 -14.65451,34.07841 0,0.77838 18.38704,1.09232 63.97525,1.09232 l 63.97526,0 -0.87676,-2.25 z" id="path4205" /></g></svg>',
   playIcon: '<svg\n     xmlns:dc="http://purl.org/dc/elements/1.1/"\n     xmlns:cc="http://creativecommons.org/ns#"\n     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n     xmlns:svg="http://www.w3.org/2000/svg"\n     xmlns="http://www.w3.org/2000/svg"\n     xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n     version="1.1"\n     id="svg2"\n     viewBox="0 0 271.36617 232"\n     height="1em"\n     width="1em"\n     inkscape:version="0.91 r13725"\n     sodipodi:docname="playIcon.svg">\n    <sodipodi:namedview\n       borderopacity="1"\n       objecttolerance="10"\n       gridtolerance="10"\n       guidetolerance="10"\n       inkscape:pageopacity="0"\n       inkscape:pageshadow="2"\n       inkscape:window-width="1920"\n       inkscape:window-height="1031"\n       id="namedview7"\n       showgrid="false"\n       inkscape:zoom="1.0172414"\n       inkscape:cx="103.19915"\n       inkscape:cy="116"\n       inkscape:window-x="0"\n       inkscape:window-y="25"\n       inkscape:window-maximized="1"\n       inkscape:current-layer="svg2" />\n    <defs\n       id="defs4" />\n    <metadata\n       id="metadata7">\n      <rdf:RDF>\n        <cc:Work\n           rdf:about="">\n          <dc:format>image/svg+xml</dc:format>\n          <dc:type\n             rdf:resource="http://purl.org/dc/dcmitype/StillImage" />\n          <dc:title></dc:title>\n        </cc:Work>\n      </rdf:RDF>\n    </metadata>\n    <g\n       transform="translate(-172.80473,-97.167477)"\n       id="layer1">\n      <path\n         d="m 233.75389,213.16748 c 0,-63.8 0.3493,-116.000003 0.77623,-116.000003 1.79411,0 199.72377,114.939843 199.72377,115.981703 0,1.04409 -197.92084,116.0183 -199.71817,116.0183 -0.43,0 -0.78183,-52.2 -0.78183,-116 z"\n         id="path4149"\n         inkscape:connector-curvature="0" />\n    </g>\n  </svg>'
};

var Track = function (_ViewController) {
  _inherits(Track, _ViewController);

  /**
   * @method constructor
   * @param  {String} modulePrefix
   * @param  {Object} info - Spotify song info object
   * @param  {Boolean} rearrageable - whether the track can be rearranged
   * @return {Track}
   */

  function Track(modulePrefix, info) {
    var rearrageable = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    _classCallCheck(this, Track);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Track).call(this, modulePrefix, info, rearrageable));

    _this.info = info;
    Object.preventExtensions(_this);

    _this.acceptEvents('dragstart', 'dragend', 'deleteBtnClick');
    return _this;
  }

  _createClass(Track, [{
    key: 'buildHtml',
    value: function buildHtml(info, rearrageable) {
      var _this2 = this;

      _get(Object.getPrototypeOf(Track.prototype), 'buildHtml', this).call(this);

      // Create HTML

      var coverImg = document.createElement('img');
      coverImg.classList.add(this.cssPrefix + '-cover');
      coverImg.setAttribute('src', info.album.images[1].url);
      this.html.container.appendChild(coverImg);

      var linearGradients = 'linear-gradient(45deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, .94) 50%, rgba(255, 255, 255, 0.8) 100%)'; // eslint-disable-line max-len
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

      if (info.playing) {
        var playingSign = document.createElement('button');
        playingSign.classList.add(buttonsBarClass + '-playingSign');
        this.playingSign = playingSign;
        playingSign.innerHTML = constants.playIcon;
        buttonsBar.appendChild(playingSign);
      } else if (rearrageable) {
        (function () {
          var dragBtn = document.createElement('button');
          dragBtn.innerHTML = constants.dragIcon;
          dragBtn.setAttribute('draggable', 'true');
          dragBtn.classList.add(buttonsBarClass + '-drag');
          _this2.html.container.dragBtn = dragBtn;
          buttonsBar.appendChild(dragBtn);

          var deleteBtn = document.createElement('button');
          deleteBtn.classList.add(buttonsBarClass + '-delete');
          _this2.deleteBtn = deleteBtn;
          deleteBtn.innerHTML = constants.trashIcon;
          buttonsBar.appendChild(deleteBtn);

          // Set listeners
          var draggingClass = _this2.cssPrefix + '--dragging';
          dragBtn.addEventListener('dragstart', function (e) {
            _this2.trigger('dragstart', e);
            _this2.html.container.classList.add(draggingClass);
          });

          dragBtn.addEventListener('dragend', function (e) {
            _this2.trigger('dragend', e);
            setTimeout(function () {
              // Protect against destroyed track
              if (_this2.html && _this2.html.container) {
                _this2.html.container.classList.remove(draggingClass);
              }
            }, 100);
          });

          deleteBtn.addEventListener('click', function () {
            return _this2.trigger('deleteBtnClick');
          });
        })();
      }

      if (info.user.name) {
        var userName = document.createElement('span');
        userName.textContent = info.user.name;
        userName.classList.add(this.cssPrefix + '-userName');
        this.html.container.appendChild(userName);
      }
    }

    /**
     * @public
     * @method getInfo
     * @return {Object}
     */

  }, {
    key: 'getInfo',
    value: function getInfo() {
      return this.info;
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
 * @return {Promise} - Will be resolved after elements have been reordered.
 */
function trackReorderDrag(paramE, paramEl, paramElements) {
  return new Promise(function (resolve) {
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
        resolve();
      });
    }

    init(paramE, paramEl, paramElements);
  });
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

var TrackList = function (_ViewController) {
  _inherits(TrackList, _ViewController);

  function TrackList(modulePrefix) {
    var rearrageable = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, TrackList);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TrackList).call(this, modulePrefix));

    _this.tracks = [];
    _this.rearrageable = rearrageable;
    Object.preventExtensions(_this);

    _this.acceptEvents('trackReorder');
    return _this;
  }

  _createClass(TrackList, [{
    key: 'buildHtml',
    value: function buildHtml() {
      _get(Object.getPrototypeOf(TrackList.prototype), 'buildHtml', this).call(this);
    }
  }, {
    key: 'getTracks',
    value: function getTracks() {
      return this.tracks.map(function (t) {
        return t.getInfo();
      });
    }

    /**
     * @public
     * @method setTracks
     * @param  {Array<Object>} tracks
     */

  }, {
    key: 'setTracks',
    value: function setTracks(tracks) {
      var _this2 = this;

      if (tracks[0]) tracks[0].playing = true;
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
      this.tracks = [];
    }

    /**
     * @public
     * @method addTrack
     * @param  {Object} trackInfo
     * @return {Track}
     */

  }, {
    key: 'addTrack',
    value: function addTrack(trackInfo) {
      var _this3 = this;

      var newTrack = new Track(this.modulePrefix, trackInfo, this.rearrageable);

      newTrack.on('dragstart', function (track, e) {
        e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
        // Rearrange all tracks except the one playing
        var allTracks = _this3.tracks.filter(function (t) {
          return !t.info.playing;
        }).map(function (t) {
          return t.getContainer();
        });
        var trackEl = track.getContainer();

        trackReorderDrag(e, trackEl, allTracks)
        // When drag has finished and elements have been reordered
        // We use this promise instead of listening to newTrack.on('dragend')
        // because the trigger('trackReorder') would be triggered before
        // trackReorderDrag and thus could remove the elements it was dragging.
        .then(function () {
          // Reorder components according to their position.
          var beforeReordering = JSON.stringify(_this3.tracks);
          _this3.tracks.sort(function (t1, t2) {
            return getElementIndex(t1.getContainer()) > getElementIndex(t2.getContainer());
          });

          // Trigger change if elements were reordered
          var afterReordering = JSON.stringify(_this3.tracks);
          if (beforeReordering !== afterReordering) {
            _this3.trigger('trackReorder');
          }
        });
      });

      newTrack.on('deleteBtnClick', function () {
        var trackIndex = _this3.tracks.indexOf(newTrack);
        assert(trackIndex !== -1, 'Invalid track being deleted.');
        _this3.tracks = removeIndex(_this3.tracks, trackIndex);
        newTrack.destroy();
        _this3.trigger('trackReorder');
      });

      this.html.container.appendChild(newTrack.getContainer());
      this.tracks.push(newTrack);
      return newTrack;
    }
  }]);

  return TrackList;
}(ViewController);

function getElementIndex(el) {
  var node = el;
  var i = 0;
  while (node !== null) {
    node = node.previousSibling;
    i++;
  }
  return i;
}

/**
 * executes a callback when there is a click outside of a list of
 * elements
 * @method onClickOut
 * @param  {Array<HTMLElement>} elements
 * @param  {Function} callback
 * @return {Function} A function to cancel onClickOut
 */
function onClickOut(elements, callback) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }
  var clickOutOfComponent = createClickOut(elements, callback);
  document.body.addEventListener('mousedown', clickOutOfComponent, true);

  return function cancelOnclickOut() {
    document.body.removeEventListener('mousedown', clickOutOfComponent, true);
  };
}

// Returns a function that will execute a callback if there is a click
// outside of the given element.
function createClickOut(elements, callback) {
  return function clickOutOfComponent(e) {
    if (clickIsWithinComponents(elements, e)) {
      return;
    }

    document.body.removeEventListener('mousedown', clickOutOfComponent, true);
    callback();
  };
}

function clickIsWithinComponents(elements, e) {
  var x = e.clientX;
  var y = e.clientY;
  var isInsideAnyElement = false;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var element = _step.value;

      var elementBox = element.getBoundingClientRect();
      var top = elementBox.top;
      var bottom = elementBox.bottom;
      var right = elementBox.right;
      var left = elementBox.left;

      // If point is outside of the component
      if (x > left && right > x && bottom > y && y > top) {
        isInsideAnyElement = true;
        break;
      }
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

  return isInsideAnyElement;
}

var SearchResults = function (_ViewController) {
  _inherits(SearchResults, _ViewController);

  function SearchResults(modulePrefix) {
    _classCallCheck(this, SearchResults);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchResults).call(this, modulePrefix));

    _this.results = [];
    Object.preventExtensions(_this);

    _this.acceptEvents('resultClick');
    _this.on('resultClick', function () {
      return _this.setVisible(false);
    });
    _this.handleKeyboardNavigation();
    return _this;
  }

  /**
   * @public
   * @method setResults
   * @param  {[type]} resultsInfo [description]
   */


  _createClass(SearchResults, [{
    key: 'setResults',
    value: function setResults(resultsInfo) {
      var _this2 = this;

      assert(Array.isArray(resultsInfo), 'Results is not an array: ' + resultsInfo);
      this.clearResults();
      this.setVisible(true);

      if (resultsInfo.length === 0) {
        this.addResult({ text: 'No results found.' });
      } else {
        resultsInfo.forEach(function (info) {
          return _this2.addResult(info);
        });
      }
    }

    /**
     * @private
     * @method addResult
     * @param  {[type]} info [description]
     */

  }, {
    key: 'addResult',
    value: function addResult(info) {
      var _this3 = this;

      var result = document.createElement('button');
      result.classList.add(this.cssPrefix + '-result');

      if (info.album && info.album.images && info.album.images[1]) {
        var cover = document.createElement('img');
        cover.setAttribute('src', info.album.images[1].url);
        cover.classList.add(this.cssPrefix + '-cover');
        result.appendChild(cover);
      }

      if (info.name) {
        var title = document.createElement('span');
        title.classList.add(this.cssPrefix + '-title');
        title.innerHTML = info.name;
        result.appendChild(title);
      }

      if (Array.isArray(info.artists)) {
        var artist = document.createElement('span');
        artist.classList.add(this.cssPrefix + '-artist');
        artist.innerHTML = info.artists[0] ? info.artists[0].name : 'Unknown artist';
        result.appendChild(artist);
      }

      if (info.text) {
        var text = document.createElement('span');
        text.classList.add(this.cssPrefix + '-text');
        text.innerHTML = info.text;
        result.appendChild(text);
      }

      if (info.id) {
        result.addEventListener('click', function () {
          return _this3.trigger('resultClick', info);
        });
        result.addEventListener('keydown', function (e) {
          var enterKeyCode = 13;
          if (e.keyCode === enterKeyCode) {
            _this3.trigger('resultClick', info);
          }
        });
      }

      result.info = info;
      this.html.container.appendChild(result);
      this.results.push(result);
    }

    /**
     * @public
     * @method setVisible
     * @param  {Boolean} visible
     */

  }, {
    key: 'setVisible',
    value: function setVisible(visible) {
      var _this4 = this;

      var visibilityClass = this.cssPrefix + '--visible';
      if (visible) {
        this.html.container.classList.add(visibilityClass);
        onClickOut(this.html.container, function () {
          return _this4.setVisible(false);
        });
      } else {
        this.html.container.classList.remove(visibilityClass);
      }
    }

    /**
     * @private
     * @method clearResults
     * @return {void}
     */

  }, {
    key: 'clearResults',
    value: function clearResults() {
      this.results.forEach(function (r) {
        return r.remove();
      });
      this.results = [];
    }

    /**
     * @public
     * @method getFirst
     * @return {Object}
     */

  }, {
    key: 'getFirst',
    value: function getFirst() {
      return this.results[0] ? this.results[0].info : null;
    }
  }, {
    key: 'handleKeyboardNavigation',
    value: function handleKeyboardNavigation() {
      var _this5 = this;

      var container = arguments.length <= 0 || arguments[0] === undefined ? this.html.container : arguments[0];

      container.addEventListener('keydown', function (e) {
        e.preventDefault();
        // Only navigate if there are enough elements
        if (_this5.getContainer().children.length < 2) {
          return;
        }
        var activeElement = document.activeElement;
        assert(activeElement, 'No active element found');

        switch (e.keyCode) {
          case 40:
            // arrow down
            if (activeElement.nextSibling) {
              activeElement.nextSibling.focus();
            } else {
              _this5.startKeyboardNavigation();
            }
            break;
          case 38:
            // arrow up
            if (activeElement.previousSibling) {
              activeElement.previousSibling.focus();
            }
            break;
          case 27:
            // escape key
            _this5.setVisible(false);
            break;
          default:
            break;
        }
      });
    }

    /**
     * Focuses on the first element to start the keyboard navigation.
     * @public
     * @method startKeyboardNavigation
     * @return {[type]} [description]
     */

  }, {
    key: 'startKeyboardNavigation',
    value: function startKeyboardNavigation() {
      var firstElement = this.getContainer().children[0];
      if (firstElement) {
        firstElement.focus();
      }
    }
  }]);

  return SearchResults;
}(ViewController);

var SearchBox = function (_ViewController) {
  _inherits(SearchBox, _ViewController);

  function SearchBox(modulePrefix) {
    _classCallCheck(this, SearchBox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchBox).call(this, modulePrefix));

    _this.highlightTimeout = null;
    _this.acceptEvents('enterPressed', 'usertyping');
    return _this;
  }

  _createClass(SearchBox, [{
    key: 'buildHtml',
    value: function buildHtml() {
      var _this2 = this;

      _get(Object.getPrototypeOf(SearchBox.prototype), 'buildHtml', this).call(this);

      var icon = document.createElement('div');
      this.html.icon = icon;
      icon.innerHTML = constants.soundNoteIcon;
      icon.classList.add(this.cssPrefix + '-icon', 'btn', 'btn-default');
      this.html.container.appendChild(icon);

      var textInput = document.createElement('input');
      this.html.textInput = textInput;
      textInput.setAttribute('type', 'text');
      textInput.classList.add(this.cssPrefix + '-textInput', 'form-control');
      this.html.container.appendChild(textInput);
      textInput.addEventListener('keydown', function (e) {
        var enterKeyCode = 13;
        var keyPressedCode = e.keyCode ? e.keyCode : e.which;
        if (keyPressedCode === enterKeyCode) {
          _this2.trigger('enterPressed');
        } else {
          _this2.trigger('usertyping', keyPressedCode);
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

  return SearchBox;
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

      var mySongsTab = document.createElement('div');

      var searchBox = document.createElement('span');
      this.html.searchBox = searchBox;
      mySongsTab.appendChild(searchBox);

      var tracksContainer = document.createElement('div');
      this.html.tracksContainer = tracksContainer;
      tracksContainer.classList.add(this.cssPrefix + '-tracksContainer');
      mySongsTab.appendChild(tracksContainer);

      var userTrackList = document.createElement('div');
      this.html.userTrackList = userTrackList;
      userTrackList.classList.add(this.cssPrefix + '-trackList');
      tracksContainer.appendChild(userTrackList);

      var searchResults = document.createElement('div');
      this.html.searchResults = searchResults;
      searchResults.classList.add(this.cssPrefix + '-searchResults');
      tracksContainer.appendChild(searchResults);

      var fullPlaylistTab = document.createElement('div');
      this.html.fullTrackList = fullPlaylistTab;

      var tabs = this.createTabs(['My songs', 'Full Playlist'], [mySongsTab, fullPlaylistTab]);

      this.html.container.appendChild(tabs);
    }

    /**
     * Creates tabs given titles and contents
     * @private
     * @method createTabs
     * @param  {Array<String>} labels - Tab titles
     * @param  {Array<HTMLElements>} contents
     * @return {HTMLElement}
     */

  }, {
    key: 'createTabs',
    value: function createTabs(labels, contents) {
      assert(labels.length === contents.length, 'Invalid arguments. tabLabels of size ' + labels.length + ' and tabContents of size ' + contents.length); // eslint-disable-line max-len
      var tabsClass = this.cssPrefix + '-tabs';
      var labelClass = tabsClass + '-label';
      var labelSelectedClass = labelClass + '--selected';
      var tabClass = tabsClass + '-content';
      var tabVisibleClass = tabClass + '--visible';

      var tabsContainer = document.createElement('div');
      tabsContainer.classList.add(tabsClass);

      var tabLabels = document.createElement('ul');
      tabLabels.classList.add(tabsClass + '-labels');
      tabsContainer.appendChild(tabLabels);

      var tabContents = document.createElement('ul');
      tabContents.classList.add(tabsClass + '-contents');
      tabsContainer.appendChild(tabContents);

      function showTab(tabIndex) {
        var labelElements = Array.from(tabLabels.children);
        labelElements.forEach(function (l) {
          return l.classList.remove(labelSelectedClass);
        });
        labelElements[tabIndex].classList.add(labelSelectedClass);

        var contentElements = Array.from(tabContents.children);
        contentElements.forEach(function (t) {
          return t.classList.remove(tabVisibleClass);
        });
        contentElements[tabIndex].classList.add(tabVisibleClass);
      }

      // Create elements

      var _loop = function _loop(i) {
        var tabLabel = document.createElement('li');
        tabLabel.classList.add(labelClass);
        tabLabel.innerHTML = labels[i];
        tabLabels.appendChild(tabLabel);
        tabLabel.addEventListener('click', function () {
          return showTab(i);
        });

        var tabContent = document.createElement('li');
        tabContent.classList.add(tabClass);
        tabContent.appendChild(contents[i]);
        tabContents.appendChild(tabContent);
      };

      for (var i = 0; i < contents.length; i++) {
        _loop(i);
      }

      showTab(0);
      return tabsContainer;
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

var Ajax = function () {
  function Ajax(url) {
    var defaultParameters = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Ajax);

    assert(url, 'No URL provided on instantiation');
    this.url = url;
    this.defaultParameters = defaultParameters;
  }

  _createClass(Ajax, [{
    key: 'query',
    value: function () {
      var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(params) {
        var url = arguments.length <= 1 || arguments[1] === undefined ? this.url : arguments[1];
        var requestUrl, requestConfig, response, content;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('LOADING FROM SERVER');
                requestUrl = this.addParametersToUrl(url, this.defaultParameters, params);
                requestConfig = {
                  method: 'GET',
                  cache: 'no-cache'
                };
                // credentials: 'include',
                response = void 0;
                _context.prev = 4;
                _context.next = 7;
                return fetch(requestUrl, requestConfig);

              case 7:
                response = _context.sent;
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](4);
                throw new Error('Error connecting to server.');

              case 13:
                _context.prev = 13;
                _context.next = 16;
                return response.json();

              case 16:
                content = _context.sent;
                return _context.abrupt('return', content);

              case 20:
                _context.prev = 20;
                _context.t1 = _context['catch'](13);
                throw new Error('Invalid server response.');

              case 23:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 10], [13, 20]]);
      }));

      function query(_x2, _x3) {
        return ref.apply(this, arguments);
      }

      return query;
    }()

    /**
     * Adds parameters as GET string parameters to a prepared URL
     * @private
     * @method _addParametersToUrl
     * @param  {String} url
     * @param  {Object} params
     * @return {String} The full URL with parameters
     */
    // TODO: this must be more robust. What about www.asdf.com/, www.asdf.com/?, www.asdf.com

  }, {
    key: 'addParametersToUrl',
    value: function addParametersToUrl() {
      var url = arguments.length <= 0 || arguments[0] === undefined ? this.url : arguments[0];

      var getParams = [];

      for (var _len = arguments.length, paramObjects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        paramObjects[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = paramObjects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var params = _step.value;

          var keys = Object.keys(params);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var key = _step2.value;

              var value = params[key] !== undefined && params[key] !== null ? params[key].toString() : '';
              var encodedKey = encodeURIComponent(key);
              var encodedValue = encodeURIComponent(value);
              getParams.push(encodedKey + '=' + encodedValue);
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

      var encodedGetParams = getParams.join('&');
      var fullUrl = url + '?' + encodedGetParams;
      return fullUrl;
    }
  }]);

  return Ajax;
}();

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(wait, func, immediate) {
	var timeout;
	return function () {
		var context = this,
		    args = arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

var demoData = [{
  "user": {
    "id": 2,
    "name": "Marcelo Lazaroni de Rezende Junior"
  },
  "album": {
    "album_type": "album",
    "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "GB", "AD", "MC", "ID"],
    "external_urls": {
      "spotify": "https://open.spotify.com/album/0TN9abNwnSnMW3jxw6uIeL"
    },
    "href": "https://api.spotify.com/v1/albums/0TN9abNwnSnMW3jxw6uIeL",
    "id": "0TN9abNwnSnMW3jxw6uIeL",
    "images": [{
      "height": 640,
      "url": "https://i.scdn.co/image/da88959a881cdc64bd576383c755fec0af2ca5f5",
      "width": 640
    }, {
      "height": 300,
      "url": "https://i.scdn.co/image/6d2190a9b3f711b57e6ee924fa343239a36752df",
      "width": 300
    }, {
      "height": 64,
      "url": "https://i.scdn.co/image/66f1b8e6703f912ffd76947ab8ab428a87e44ed0",
      "width": 64
    }],
    "name": "Total Life Forever",
    "type": "album",
    "uri": "spotify:album:0TN9abNwnSnMW3jxw6uIeL"
  },
  "artists": [{
    "external_urls": {
      "spotify": "https://open.spotify.com/artist/6FQqZYVfTNQ1pCqfkwVFEa"
    },
    "href": "https://api.spotify.com/v1/artists/6FQqZYVfTNQ1pCqfkwVFEa",
    "id": "6FQqZYVfTNQ1pCqfkwVFEa",
    "name": "Foals",
    "type": "artist",
    "uri": "spotify:artist:6FQqZYVfTNQ1pCqfkwVFEa"
  }],
  "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "GB", "AD", "MC", "ID"],
  "disc_number": 1,
  "duration_ms": 409560,
  "explicit": true,
  "external_ids": {
    "isrc": "GBAHT1000047"
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/track/4i3txPQIUV4eC9g9FBpi9I"
  },
  "href": "https://api.spotify.com/v1/tracks/4i3txPQIUV4eC9g9FBpi9I",
  "id": "4i3txPQIUV4eC9g9FBpi9I",
  "name": "Spanish Sahara",
  "popularity": 60,
  "preview_url": "https://p.scdn.co/mp3-preview/75d32af506df2354251f80726ab3e0656fa8e8f7",
  "track_number": 5,
  "type": "track",
  "uri": "spotify:track:4i3txPQIUV4eC9g9FBpi9I"
}, {
  "user": {
    "id": 2,
    "name": "Marcelo Lazaroni de Rezende Junior"
  },
  "album": {
    "album_type": "album",
    "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"],
    "external_urls": {
      "spotify": "https://open.spotify.com/album/0UccZZgelTAbbk3OSPZymO"
    },
    "href": "https://api.spotify.com/v1/albums/0UccZZgelTAbbk3OSPZymO",
    "id": "0UccZZgelTAbbk3OSPZymO",
    "images": [{
      "height": 640,
      "url": "https://i.scdn.co/image/f66195f98d32ffb0f1fcca0ea9e69e2794ec6742",
      "width": 640
    }, {
      "height": 300,
      "url": "https://i.scdn.co/image/1f594d484a753cf21d909f3eaf0c3953d7caca61",
      "width": 300
    }, {
      "height": 64,
      "url": "https://i.scdn.co/image/f323863361593570fe9a932e006a5a8b834991ec",
      "width": 64
    }],
    "name": "Greatest Hits Volume One - The Singles",
    "type": "album",
    "uri": "spotify:album:0UccZZgelTAbbk3OSPZymO"
  },
  "artists": [{
    "external_urls": {
      "spotify": "https://open.spotify.com/artist/2sil8z5kiy4r76CRTXxBCA"
    },
    "href": "https://api.spotify.com/v1/artists/2sil8z5kiy4r76CRTXxBCA",
    "id": "2sil8z5kiy4r76CRTXxBCA",
    "name": "The Goo Goo Dolls",
    "type": "artist",
    "uri": "spotify:artist:2sil8z5kiy4r76CRTXxBCA"
  }],
  "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"],
  "disc_number": 1,
  "duration_ms": 238333,
  "explicit": false,
  "external_ids": {
    "isrc": "USWB10704696"
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/track/7p1PhtGLjq0ISncRXBHqXY"
  },
  "href": "https://api.spotify.com/v1/tracks/7p1PhtGLjq0ISncRXBHqXY",
  "id": "7p1PhtGLjq0ISncRXBHqXY",
  "name": "Here Is Gone",
  "popularity": 52,
  "preview_url": "https://p.scdn.co/mp3-preview/4a8b9f71672407eeae6b138cf27ad1613cafe767",
  "track_number": 3,
  "type": "track",
  "uri": "spotify:track:7p1PhtGLjq0ISncRXBHqXY"
}, {
  "user": {
    "id": 2,
    "name": "Marcelo Lazaroni de Rezende Junior"
  },
  "album": {
    "album_type": "album",
    "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"],
    "external_urls": {
      "spotify": "https://open.spotify.com/album/67cksuMf5EvK5pu1DwGeFi"
    },
    "href": "https://api.spotify.com/v1/albums/67cksuMf5EvK5pu1DwGeFi",
    "id": "67cksuMf5EvK5pu1DwGeFi",
    "images": [{
      "height": 640,
      "url": "https://i.scdn.co/image/cc5549f65c77d85b5b5405ba3a18f15995a7be9b",
      "width": 640
    }, {
      "height": 300,
      "url": "https://i.scdn.co/image/265b55a307f70ba0c3f4770843601ab7130f0de6",
      "width": 300
    }, {
      "height": 64,
      "url": "https://i.scdn.co/image/82363a9ee7c45f8afce1df0e541e56dea1be2a33",
      "width": 64
    }],
    "name": "Illusions",
    "type": "album",
    "uri": "spotify:album:67cksuMf5EvK5pu1DwGeFi"
  },
  "artists": [{
    "external_urls": {
      "spotify": "https://open.spotify.com/artist/0NSO0g40h9CTj13hKPskeb"
    },
    "href": "https://api.spotify.com/v1/artists/0NSO0g40h9CTj13hKPskeb",
    "id": "0NSO0g40h9CTj13hKPskeb",
    "name": "Ibrahim Maalouf",
    "type": "artist",
    "uri": "spotify:artist:0NSO0g40h9CTj13hKPskeb"
  }],
  "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID"],
  "disc_number": 1,
  "duration_ms": 291303,
  "explicit": false,
  "external_ids": {
    "isrc": "FRP8H1300280"
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/track/5EzGOkUwkRUXYAyvjlEHah"
  },
  "href": "https://api.spotify.com/v1/tracks/5EzGOkUwkRUXYAyvjlEHah",
  "id": "5EzGOkUwkRUXYAyvjlEHah",
  "name": "True Sorry",
  "popularity": 49,
  "preview_url": "https://p.scdn.co/mp3-preview/6b6beff68189d762fb03f3a24c5ada56c6232f61",
  "track_number": 8,
  "type": "track",
  "uri": "spotify:track:5EzGOkUwkRUXYAyvjlEHah"
}];

var ModuleCoordinator = function () {
  function ModuleCoordinator(modulePrefix, userId) {
    _classCallCheck(this, ModuleCoordinator);

    this.userId = userId;
    this.searchBox = new SearchBox(modulePrefix);
    this.widgetContainer = new WidgetContainer(modulePrefix);
    this.userTrackList = new TrackList(modulePrefix);
    this.fullTrackList = new TrackList(modulePrefix, false); // non-rearrageable
    this.searchResults = new SearchResults(modulePrefix);
    this.ajax = {};
    Object.preventExtensions(this);

    this.ajax.trackSearch = new Ajax('https://api.spotify.com/v1/search', { type: 'track' });

    this.ajax.trackSubmission = new Ajax('https://api.spotify.com/v1/search', { userId: this.userId });

    this.ajax.trackLoading = new Ajax('https://api.spotify.com/v1/search', { type: 'track', userId: this.userId });

    this.widgetContainer.set('searchBox', this.searchBox);
    this.widgetContainer.set('userTrackList', this.userTrackList);
    this.widgetContainer.set('searchResults', this.searchResults);
    this.widgetContainer.set('fullTrackList', this.fullTrackList);

    this.listenToElementsEvents();
    // this.loadTracks();
    this.userTrackList.setTracks(demoData);
    this.fullTrackList.setTracks(demoData);
  }

  /**
   * Called once at instantiation time
   * @private
   * @method listenToElementsEvents
   * @return {void}
   */


  _createClass(ModuleCoordinator, [{
    key: 'listenToElementsEvents',
    value: function listenToElementsEvents() {
      var _this = this;

      this.searchBox.on('enterPressed', function () {
        var firstResult = _this.searchResults.getFirst();
        if (!firstResult) {
          return;
        }
        _this.searchResults.setVisible(false);
        _this.addTrack(firstResult);
      });

      var debouncedTrackSearch = debounce(200, _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
        var searchString, tracksFound;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                searchString = _this.searchBox.getInput();
                _context.next = 3;
                return _this.searchTrack(searchString);

              case 3:
                tracksFound = _context.sent;

                if (tracksFound) {
                  _this.searchResults.setResults(tracksFound);
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      })));

      this.searchBox.on('usertyping', function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(box, keyCode) {
          var arrowDownCode, arrowUpCode;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  arrowDownCode = 40;
                  arrowUpCode = 38;

                  if (keyCode === arrowDownCode || keyCode === arrowUpCode) {
                    _this.searchResults.startKeyboardNavigation();
                  } else {
                    debouncedTrackSearch();
                  }

                case 3:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this);
        }));

        return function (_x, _x2) {
          return ref.apply(this, arguments);
        };
      }());

      this.searchResults.on('resultClick', function (el, trackInfo) {
        _this.addTrack(trackInfo);
      });

      this.userTrackList.on('trackReorder', function () {
        _this.submitTracks();
      });
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
      this.searchBox.showOutcomeSuccess(!isError, duration);
    }

    /**
     * Adds a track to the user list and trigger tracks update.
     * @private
     * @method addTrack
     * @param  {Object} trackInfo
     */

  }, {
    key: 'addTrack',
    value: function addTrack(trackInfo) {
      // Add user credentials to track
      trackInfo.user = { id: this.userId, name: 'Marcelo Lazaroni' }; // eslint-disable-line no-param-reassign
      this.userTrackList.addTrack(trackInfo);
      this.submitTracks();
    }

    /**
     * Submits all local tracks to server.
     * @private
     * @method submitTrack
     * @return {void}
     */

  }, {
    key: 'submitTracks',
    value: function () {
      var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3() {
        var currentTracks;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                currentTracks = this.userTrackList.getTracks();
                // await this.ajax.trackSubmission.query({ tracks: currentTracks }, 'POST');

                _context3.next = 3;
                return this.loadTracks();

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function submitTracks() {
        return ref.apply(this, arguments);
      }

      return submitTracks;
    }()

    /**
     * Loads tracks form the server
     * @method loadTracks
     * @return {tracks}
     */

  }, {
    key: 'loadTracks',
    value: function () {
      var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4() {
        var _this2 = this;

        var loadedTracks, userTracks;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // await this.ajax.loadTracks.query({ tracks: currentTracks }, 'POST');
                loadedTracks = this.fullTrackList.getTracks(); // change this for the line above

                assert(Array.isArray(loadedTracks), 'Invalid tracks object loaded from server.');
                userTracks = loadedTracks.filter(function (t) {
                  return t.user.id === _this2.userId;
                });

                this.userTrackList.setTracks(userTracks);
                this.fullTrackList.setTracks(loadedTracks);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function loadTracks() {
        return ref.apply(this, arguments);
      }

      return loadTracks;
    }()

    /**
     * Queries Spotify for a track based on a string
     * @method searchTrack
     * @param  {String} searchString [description]
     * @return {Array | null}
     */

  }, {
    key: 'searchTrack',
    value: function () {
      var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(searchString) {
        var tracksFound, res;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (searchString) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', null);

              case 2:
                tracksFound = null;
                _context5.prev = 3;
                _context5.next = 6;
                return this.ajax.trackSearch.query({ q: searchString });

              case 6:
                res = _context5.sent;

                tracksFound = res.tracks.items;
                _context5.next = 13;
                break;

              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5['catch'](3);

                assert.warn(false, 'Error searching tracks: ' + _context5.t0.message);

              case 13:
                return _context5.abrupt('return', tracksFound);

              case 14:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 10]]);
      }));

      function searchTrack(_x4) {
        return ref.apply(this, arguments);
      }

      return searchTrack;
    }()
  }]);

  return ModuleCoordinator;
}();

var MODULE_PREFIX = 'fl-pw';

xController(function (xdiv) {
  console.log(xdiv);
  var serverUrl = 'tesssst';
  var userId = 'abcde';

  var coordinator = new ModuleCoordinator(MODULE_PREFIX, 2);
  xdiv.appendChild(coordinator.getWidget());
});
}());
//# sourceMappingURL=fl-playlist-widget.js.map
