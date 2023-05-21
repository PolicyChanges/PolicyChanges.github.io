
var exports = module.exports = {};

var fastEmptyArray = function(array){
			while (array.length > 0) {
			array.pop();
		} 
};

var setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

var getCookie = function(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

var $ = function(id){
	return document.getElementById(id);
};



//if object is plain object
var _isPlainObject = function(obj) {

    if (typeof obj !== 'object') {
        return false;
    }


    if (obj.constructor &&
        !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

// Deeper clone
var deepClone = function(copyObject) {
	return Object.assign(Object.create(Object.getPrototypeOf(copyObject)), copyObject);
};

// this method source code is from jquery 2.0.x
// merge object's value and return
var extend = function() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = true;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        // skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && typeof obj !== 'function') {
        target = {};
    }


    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && _isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    //console.log('abc');

                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};


var proxy = function(fn,context){
    var args = [].slice.call( arguments, 2 );
    proxy = function() {
            return fn.apply( context || this, args.concat( [].slice.call( arguments ) ) );
    };
    return proxy;
};

var aniFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = aniFrame;


exports.$ = $;
exports.extend = extend;
exports.proxy = proxy;
exports.deepClone = deepClone;
exports.setCookie = setCookie;
exports.getCookie = getCookie;
exports.fastEmptyArray = fastEmptyArray;

// export $;
// export extend;
// export proxy;
