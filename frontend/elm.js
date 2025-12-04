(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bi.ad === region.bz.ad)
	{
		return 'on line ' + region.bi.ad;
	}
	return 'on lines ' + region.bi.ad + ' through ' + region.bz.ad;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c1,
		impl.dG,
		impl.dy,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		L: func(record.L),
		bj: record.bj,
		a8: record.a8
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.L;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bj;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.a8) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c1,
		impl.dG,
		impl.dy,
		function(sendToApp, initialModel) {
			var view = impl.dH;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c1,
		impl.dG,
		impl.dy,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bh && impl.bh(sendToApp)
			var view = impl.dH;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cD);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.dE) && (_VirtualDom_doc.title = title = doc.dE);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.di;
	var onUrlRequest = impl.dj;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bh: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.b3 === next.b3
							&& curr.bD === next.bD
							&& curr.b0.a === next.b0.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		c1: function(flags)
		{
			return A3(impl.c1, flags, _Browser_getUrl(), key);
		},
		dH: impl.dH,
		dG: impl.dG,
		dy: impl.dy
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { c_: 'hidden', cG: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { c_: 'mozHidden', cG: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { c_: 'msHidden', cG: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { c_: 'webkitHidden', cG: 'webkitvisibilitychange' }
		: { c_: 'hidden', cG: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		ca: _Browser_getScene(),
		cm: {
			co: _Browser_window.pageXOffset,
			ct: _Browser_window.pageYOffset,
			bm: _Browser_doc.documentElement.clientWidth,
			aU: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		bm: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		aU: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			ca: {
				bm: node.scrollWidth,
				aU: node.scrollHeight
			},
			cm: {
				co: node.scrollLeft,
				ct: node.scrollTop,
				bm: node.clientWidth,
				aU: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			ca: _Browser_getScene(),
			cm: {
				co: x,
				ct: y,
				bm: _Browser_doc.documentElement.clientWidth,
				aU: _Browser_doc.documentElement.clientHeight
			},
			cS: {
				co: x + rect.left,
				ct: y + rect.top,
				bm: rect.width,
				aU: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $author$project$Main$EvLinkClicked = function (a) {
	return {$: 11, a: a};
};
var $author$project$Main$EvUrlChanged = function (a) {
	return {$: 12, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.g) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.i);
		} else {
			var treeLen = builder.g * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.k) : builder.k;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.g);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.i);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{k: nodeList, g: (len / $elm$core$Array$branchFactor) | 0, i: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {cZ: fragment, bD: host, a7: path, b0: port_, b3: protocol, dr: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$WaitingForInitData = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$url$Url$Parser$Internal$Parser = $elm$core$Basics$identity;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm$url$Url$Parser$Query$custom = F2(
	function (key, func) {
		return function (dict) {
			return func(
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, key, dict)));
		};
	});
var $elm$url$Url$Parser$Query$int = function (key) {
	return A2(
		$elm$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.b && (!stringList.b.b)) {
				var str = stringList.a;
				return $elm$core$String$toInt(str);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {Q: frag, S: params, N: unvisited, aJ: value, U: visited};
	});
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.U;
		var unvisited = _v0.N;
		var params = _v0.S;
		var frag = _v0.Q;
		var value = _v0.aJ;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.U;
			var unvisited = _v1.N;
			var params = _v1.S;
			var frag = _v1.Q;
			var value = _v1.aJ;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $author$project$Main$SharedInfos = function (atlas) {
	return function (img) {
		return function (lcmap) {
			return function (rcmap) {
				return function (idx4d) {
					return function (lx1) {
						return function (lx2) {
							return function (lx3) {
								return function (llow) {
									return function (lhigh) {
										return function (lthreshl) {
											return function (lthreshh) {
												return function (rx1) {
													return function (rx2) {
														return function (rx3) {
															return function (rlow) {
																return function (rhigh) {
																	return function (rthreshl) {
																		return function (rthreshh) {
																			return {bp: atlas, r: idx4d, Y: img, aW: lcmap, aX: lhigh, aY: llow, aZ: lthreshh, a_: lthreshl, a$: lx1, a0: lx2, a1: lx3, a9: rcmap, ba: rhigh, bb: rlow, bc: rthreshh, bd: rthreshl, be: rx1, bf: rx2, bg: rx3};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Main$maybeSharedInfos = function (mbArg1) {
	return function (mbArg2) {
		return function (mbArg3) {
			return function (mbArg4) {
				return function (mbArg5) {
					return function (mbArg6) {
						return function (mbArg7) {
							return function (mbArg8) {
								return function (mbArg9) {
									return function (mbArg10) {
										return function (mbArg11) {
											return function (mbArg12) {
												return function (mbArg13) {
													return function (mbArg14) {
														return function (mbArg15) {
															return function (mbArg16) {
																return function (mbArg17) {
																	return function (mbArg18) {
																		return function (mbArg19) {
																			return A2(
																				$elm$core$Maybe$andThen,
																				function (g1) {
																					return A2(
																						$elm$core$Maybe$andThen,
																						function (g2) {
																							return A2(
																								$elm$core$Maybe$andThen,
																								function (g3) {
																									return A2(
																										$elm$core$Maybe$andThen,
																										function (g4) {
																											return A2(
																												$elm$core$Maybe$andThen,
																												function (g5) {
																													return A2(
																														$elm$core$Maybe$andThen,
																														function (g6) {
																															return A2(
																																$elm$core$Maybe$andThen,
																																function (g7) {
																																	return A2(
																																		$elm$core$Maybe$andThen,
																																		function (g8) {
																																			return A2(
																																				$elm$core$Maybe$andThen,
																																				function (g9) {
																																					return A2(
																																						$elm$core$Maybe$andThen,
																																						function (g10) {
																																							return A2(
																																								$elm$core$Maybe$andThen,
																																								function (g11) {
																																									return A2(
																																										$elm$core$Maybe$andThen,
																																										function (g12) {
																																											return A2(
																																												$elm$core$Maybe$andThen,
																																												function (g13) {
																																													return A2(
																																														$elm$core$Maybe$andThen,
																																														function (g14) {
																																															return A2(
																																																$elm$core$Maybe$andThen,
																																																function (g15) {
																																																	return A2(
																																																		$elm$core$Maybe$andThen,
																																																		function (g16) {
																																																			return A2(
																																																				$elm$core$Maybe$andThen,
																																																				function (g17) {
																																																					return A2(
																																																						$elm$core$Maybe$andThen,
																																																						function (g18) {
																																																							return A2(
																																																								$elm$core$Maybe$andThen,
																																																								function (g19) {
																																																									return $elm$core$Maybe$Just(
																																																										$author$project$Main$SharedInfos(g1)(g2)(g3)(g4)(g5)(g6)(g7)(g8)(g9)(g10)(g11)(g12)(g13)(g14)(g15)(g16)(g17)(g18)(g19));
																																																								},
																																																								mbArg19);
																																																						},
																																																						mbArg18);
																																																				},
																																																				mbArg17);
																																																		},
																																																		mbArg16);
																																																},
																																																mbArg15);
																																														},
																																														mbArg14);
																																												},
																																												mbArg13);
																																										},
																																										mbArg12);
																																								},
																																								mbArg11);
																																						},
																																						mbArg10);
																																				},
																																				mbArg9);
																																		},
																																		mbArg8);
																																},
																																mbArg7);
																														},
																														mbArg6);
																												},
																												mbArg5);
																										},
																										mbArg4);
																								},
																								mbArg3);
																						},
																						mbArg2);
																				},
																				mbArg1);
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.N;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.aJ);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.aJ);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.a7),
					$elm$url$Url$Parser$prepareQuery(url.dr),
					url.cZ,
					$elm$core$Basics$identity)));
	});
var $elm$url$Url$Parser$query = function (_v0) {
	var queryParser = _v0;
	return function (_v1) {
		var visited = _v1.U;
		var unvisited = _v1.N;
		var params = _v1.S;
		var frag = _v1.Q;
		var value = _v1.aJ;
		return _List_fromArray(
			[
				A5(
				$elm$url$Url$Parser$State,
				visited,
				unvisited,
				params,
				frag,
				value(
					queryParser(params)))
			]);
	};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $elm$url$Url$Parser$questionMark = F2(
	function (parser, queryParser) {
		return A2(
			$elm$url$Url$Parser$slash,
			parser,
			$elm$url$Url$Parser$query(queryParser));
	});
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.U;
		var unvisited = _v0.N;
		var params = _v0.S;
		var frag = _v0.Q;
		var value = _v0.aJ;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$Query$string = function (key) {
	return A2(
		$elm$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.b && (!stringList.b.b)) {
				var str = stringList.a;
				return $elm$core$Maybe$Just(str);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
};
var $author$project$Main$parseShareLink = function (url) {
	if (url.a7 === '/') {
		return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
	} else {
		var parser = A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$maybeSharedInfos,
			A2(
				$elm$url$Url$Parser$questionMark,
				A2(
					$elm$url$Url$Parser$questionMark,
					A2(
						$elm$url$Url$Parser$questionMark,
						A2(
							$elm$url$Url$Parser$questionMark,
							A2(
								$elm$url$Url$Parser$questionMark,
								A2(
									$elm$url$Url$Parser$questionMark,
									A2(
										$elm$url$Url$Parser$questionMark,
										A2(
											$elm$url$Url$Parser$questionMark,
											A2(
												$elm$url$Url$Parser$questionMark,
												A2(
													$elm$url$Url$Parser$questionMark,
													A2(
														$elm$url$Url$Parser$questionMark,
														A2(
															$elm$url$Url$Parser$questionMark,
															A2(
																$elm$url$Url$Parser$questionMark,
																A2(
																	$elm$url$Url$Parser$questionMark,
																	A2(
																		$elm$url$Url$Parser$questionMark,
																		A2(
																			$elm$url$Url$Parser$questionMark,
																			A2(
																				$elm$url$Url$Parser$questionMark,
																				A2(
																					$elm$url$Url$Parser$questionMark,
																					A2(
																						$elm$url$Url$Parser$questionMark,
																						$elm$url$Url$Parser$s('index.html'),
																						$elm$url$Url$Parser$Query$string('atlas')),
																					$elm$url$Url$Parser$Query$string('img')),
																				$elm$url$Url$Parser$Query$string('cmap_l')),
																			$elm$url$Url$Parser$Query$string('cmap_r')),
																		$elm$url$Url$Parser$Query$int('idx4d')),
																	$elm$url$Url$Parser$Query$string('lx1')),
																$elm$url$Url$Parser$Query$string('lx2')),
															$elm$url$Url$Parser$Query$string('lx3')),
														$elm$url$Url$Parser$Query$string('llow')),
													$elm$url$Url$Parser$Query$string('lhigh')),
												$elm$url$Url$Parser$Query$string('lthreshl')),
											$elm$url$Url$Parser$Query$string('lthreshh')),
										$elm$url$Url$Parser$Query$string('rx1')),
									$elm$url$Url$Parser$Query$string('rx2')),
								$elm$url$Url$Parser$Query$string('rx3')),
							$elm$url$Url$Parser$Query$string('rlow')),
						$elm$url$Url$Parser$Query$string('rhigh')),
					$elm$url$Url$Parser$Query$string('rthreshl')),
				$elm$url$Url$Parser$Query$string('rthreshh')));
		var _v0 = A2($elm$url$Url$Parser$parse, parser, url);
		if ((!_v0.$) && (!_v0.a.$)) {
			var infos = _v0.a.a;
			return $elm$core$Result$Ok(
				$elm$core$Maybe$Just(infos));
		} else {
			return $elm$core$Result$Err('Invalid URL-path:' + url.a7);
		}
	}
};
var $author$project$Main$init = F3(
	function (_v0, url, key) {
		var sharedData = function () {
			var _v1 = $author$project$Main$parseShareLink(url);
			if (!_v1.$) {
				var sd = _v1.a;
				return sd;
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}();
		return _Utils_Tuple2(
			A3($author$project$Main$WaitingForInitData, key, url, sharedData),
			$elm$core$Platform$Cmd$none);
	});
var $elm$browser$Browser$Document = F2(
	function (title, body) {
		return {cD: body, dE: title};
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$core$String$trim = _String_trim;
var $author$project$Vutils$css = function (str) {
	return A2(
		$elm$core$List$concatMap,
		function (style_def) {
			if ((style_def.b && style_def.b.b) && (!style_def.b.b.b)) {
				var key = style_def.a;
				var _v1 = style_def.b;
				var val = _v1.a;
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, key, val)
					]);
			} else {
				return _List_Nil;
			}
		},
		A2(
			$elm$core$List$map,
			$elm$core$List$map($elm$core$String$trim),
			A2(
				$elm$core$List$map,
				$elm$core$String$split(':'),
				A2(
					$elm$core$List$map,
					$elm$core$String$trim,
					A2($elm$core$String$split, ';', str)))));
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$renderInvalid = function (desc) {
	return A2(
		$elm$html$Html$div,
		$author$project$Vutils$css('max-width: 60em; width: 60em;'),
		A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[x]));
			},
			_List_fromArray(
				[
					$elm$html$Html$text('There was an error'),
					$elm$html$Html$text('Reason: ' + desc),
					$elm$html$Html$text('Please reload the page to start over')
				])));
};
var $author$project$Main$EvCloseDialog = {$: 14};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Vutils$column = function (gap) {
	return $author$project$Vutils$css('\n    display: flex;\n    flex-direction: column;\n    gap: ' + (gap + ';'));
};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
	});
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.b3;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.cZ,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.dr,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.b0,
					_Utils_ap(http, url.bD)),
				url.a7)));
};
var $author$project$Main$getShareLink = function (rtData) {
	var url = rtData.cl;
	var r = rtData.a;
	var l = rtData.d;
	var path = A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			['index.html']),
		_List_fromArray(
			[
				A2($elm$url$Url$Builder$string, 'atlas', rtData.W),
				A2($elm$url$Url$Builder$string, 'img', rtData.P),
				A2($elm$url$Url$Builder$string, 'cmap_l', rtData.d.w),
				A2($elm$url$Url$Builder$string, 'cmap_r', rtData.a.w),
				A2(
				$elm$url$Url$Builder$string,
				'idx4d',
				$elm$core$String$fromInt(rtData.r)),
				A2($elm$url$Url$Builder$string, 'lx1', l.j.o),
				A2($elm$url$Url$Builder$string, 'lx2', l.j.p),
				A2($elm$url$Url$Builder$string, 'lx3', l.j.q),
				A2($elm$url$Url$Builder$string, 'llow', l.f.c),
				A2($elm$url$Url$Builder$string, 'lhigh', l.f.b),
				A2($elm$url$Url$Builder$string, 'lthreshl', l.v.c),
				A2($elm$url$Url$Builder$string, 'lthreshh', l.v.b),
				A2($elm$url$Url$Builder$string, 'rx1', r.j.o),
				A2($elm$url$Url$Builder$string, 'rx2', r.j.p),
				A2($elm$url$Url$Builder$string, 'rx3', r.j.q),
				A2($elm$url$Url$Builder$string, 'rlow', r.f.c),
				A2($elm$url$Url$Builder$string, 'rhigh', r.f.b),
				A2($elm$url$Url$Builder$string, 'rthreshl', r.v.c),
				A2($elm$url$Url$Builder$string, 'rthreshh', r.v.b)
			]));
	return $elm$url$Url$toString(
		_Utils_update(
			url,
			{cZ: $elm$core$Maybe$Nothing, a7: path, dr: $elm$core$Maybe$Nothing}));
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$dialogView = function (rtData) {
	return rtData.aI ? A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Vutils$css('\n              position: absolute;\n              left: 0%; top: 0%; width: 100vw; height: 100vh;\n              background-color: #000;\n              z-index: 1001;\n              opacity: 0.4; '),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Vutils$column('10px'),
					$author$project$Vutils$css('\n                background-color: #fff; \n                border-radius: 20px;\n                padding: 20px;\n                color: black;\n                opacity: 1;\n                \n                position:absolute;\n                top:50%;\n                left:50%;\n                transform:translate(-50%, -50%);\n                z-index: 1002;\n                ')),
				_List_fromArray(
					[
						$elm$html$Html$text('Use the following link to share your current settings:'),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$readonly(true),
								$elm$html$Html$Attributes$value(
								$author$project$Main$getShareLink(rtData))
							]),
						_List_Nil),
						A2(
						$elm$html$Html$button,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Events$onClick($author$project$Main$EvCloseDialog),
							$author$project$Vutils$css('float: right;')),
						_List_fromArray(
							[
								$elm$html$Html$text('Close me')
							]))
					]))
			])) : $elm$html$Html$text('');
};
var $author$project$Vutils$fullwidth = $author$project$Vutils$css('width: 100%;');
var $author$project$Vutils$hcenter = $author$project$Vutils$css('margin-left: auto; margin-right: auto;');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Main$loadingStyles = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('\n@keyframes shimmerBar { 0% { transform: translateX(-60%); } 100% { transform: translateX(160%); } }\n.cx-loader-overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.82); backdrop-filter: blur(1px); z-index: 3000; }\n.cx-loader-card { padding: 14px 18px; border-radius: 10px; background: white; border: 1px solid rgba(0,20,80,0.12); box-shadow: 0 10px 28px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 12px; min-width: 200px; }\n.cx-loader-text { font-weight: 700; color: #0f172a; letter-spacing: 0.2px; font-size: 15px; }\n.cx-loader-bar { position: relative; width: 140px; height: 6px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }\n.cx-loader-bar::after { content: \"\"; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,20,80,0) 0%, rgba(0,20,80,0.4) 50%, rgba(0,20,80,0) 100%); transform: translateX(-60%); animation: shimmerBar 1.2s ease-in-out infinite; }\n')
		]));
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$renderLoadingOverlay = function (isLoading) {
	return (!isLoading) ? $elm$html$Html$text('') : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('cx-loader-overlay')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('cx-loader-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cx-loader-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Loading...')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cx-loader-bar')
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Main$EvImageClick = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$EvSelected4DImg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$EvSelectedAtlas = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$Left = 0;
var $author$project$Main$Right = 1;
var $author$project$Main$ClickMeta = F5(
	function (offsetX, offsetY, width, height, ctrl) {
		return {bw: ctrl, aU: height, bW: offsetX, bX: offsetY, bm: width};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Main$clickDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Main$ClickMeta,
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'clientWidth']),
		$elm$json$Json$Decode$float),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'clientHeight']),
		$elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool));
var $mathiajusth$nonempty_dict$Dict$Nonempty$get = F2(
	function (k, _v0) {
		var _v1 = _v0;
		var dictTail = _v1.b;
		return A2($elm$core$Dict$get, k, dictTail);
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$Vutils$prettySelect = $author$project$Vutils$css('padding: 6px 8px; border: 1px solid #c7cede; border-radius: 6px; background: #f7f9fc; font-size: 15px; min-height: 34px;');
var $author$project$Main$EvToggleMatrixLabels = function (a) {
	return {$: 17, a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$Main$BothHemis = 0;
var $author$project$Main$LeftHemis = 1;
var $author$project$Main$RightHemis = 2;
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$getAt = F2(
	function (idx, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, idx, list));
	});
var $elm$core$String$map = _String_map;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $author$project$Main$applyHemisphereToSlice = F2(
	function (hemi, slice) {
		if ((slice.at !== 'regions') || (!hemi)) {
			return slice;
		} else {
			var filterWith = F2(
				function (mask, xs) {
					return A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						A3(
							$elm$core$List$map2,
							F2(
								function (flag, val) {
									return flag ? $elm$core$Maybe$Just(val) : $elm$core$Maybe$Nothing;
								}),
							mask,
							xs));
				});
			var dedupConsecutive = function (lst) {
				return $elm$core$List$reverse(
					A3(
						$elm$core$List$foldl,
						F2(
							function (v, acc) {
								if (!acc.b) {
									return _List_fromArray(
										[v]);
								} else {
									var h = acc.a;
									return _Utils_eq(h, v) ? acc : A2($elm$core$List$cons, v, acc);
								}
							}),
						_List_Nil,
						lst));
			};
			var countTruesBefore = F2(
				function (n, mask) {
					return $elm$core$List$length(
						A2(
							$elm$core$List$filter,
							$elm$core$Basics$identity,
							A2($elm$core$List$take, n, mask)));
				});
			var remapBounds = F2(
				function (mask, bounds) {
					return dedupConsecutive(
						A2(
							$elm$core$List$map,
							function (b) {
								return A2(countTruesBefore, b, mask);
							},
							bounds));
				});
			var classify = F2(
				function (lbl, shortLbl) {
					var base = $elm$core$String$isEmpty(shortLbl) ? lbl : shortLbl;
					var tokens = $elm$core$String$words(
						A2(
							$elm$core$String$map,
							function (c) {
								return A2(
									$elm$core$List$member,
									c,
									_List_fromArray(
										['_', '-', '(', ')', ','])) ? ' ' : c;
							},
							$elm$core$String$toLower(base)));
					return (A2($elm$core$List$member, 'left', tokens) || (A2($elm$core$List$member, 'l', tokens) || A2($elm$core$List$member, 'lh', tokens))) ? 1 : ((A2($elm$core$List$member, 'right', tokens) || (A2($elm$core$List$member, 'r', tokens) || A2($elm$core$List$member, 'rh', tokens))) ? 2 : 0);
				});
			var keepLabel = F2(
				function (shortLbl, lbl) {
					var _v1 = _Utils_Tuple2(
						A2(classify, lbl, shortLbl),
						hemi);
					_v1$4:
					while (true) {
						switch (_v1.a) {
							case 1:
								if (_v1.b === 1) {
									var _v2 = _v1.a;
									var _v3 = _v1.b;
									return true;
								} else {
									break _v1$4;
								}
							case 2:
								if (_v1.b === 2) {
									var _v4 = _v1.a;
									var _v5 = _v1.b;
									return true;
								} else {
									break _v1$4;
								}
							default:
								if (!_v1.b) {
									var _v6 = _v1.a;
									var _v7 = _v1.b;
									return true;
								} else {
									var _v8 = _v1.a;
									return false;
								}
						}
					}
					return false;
				});
			var maskX = A3($elm$core$List$map2, keepLabel, slice.ap, slice.ao);
			var newBounds = A2(remapBounds, maskX, slice.az);
			var newXCenters = A2(filterWith, maskX, slice.an);
			var newXIds = A2(filterWith, maskX, slice.aa);
			var newXLabels = A2(filterWith, maskX, slice.ao);
			var newXNets = A2(filterWith, maskX, slice.aK);
			var newXNetsFull = A2(filterWith, maskX, slice.aL);
			var newXShort = A2(filterWith, maskX, slice.ap);
			var maskY = A3($elm$core$List$map2, keepLabel, slice.as, slice.ar);
			var filterValues = function (rows) {
				return A2(
					$elm$core$List$filterMap,
					function (_v0) {
						var keepRow = _v0.a;
						var row = _v0.b;
						return keepRow ? $elm$core$Maybe$Just(
							A2(filterWith, maskX, row)) : $elm$core$Maybe$Nothing;
					},
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, row) {
								return _Utils_Tuple2(
									A2(
										$elm$core$Maybe$withDefault,
										false,
										A2($author$project$Main$getAt, i, maskY)),
									row);
							}),
						rows));
			};
			var newValues = filterValues(slice.am);
			var newBoundsY = A2(remapBounds, maskY, slice.aA);
			var newYCenters = A2(filterWith, maskY, slice.aq);
			var newYIds = A2(filterWith, maskY, slice.ab);
			var newYLabels = A2(filterWith, maskY, slice.ar);
			var newYNets = A2(filterWith, maskY, slice.aM);
			var newYNetsFull = A2(filterWith, maskY, slice.aN);
			var newYShort = A2(filterWith, maskY, slice.as);
			return _Utils_update(
				slice,
				{az: newBounds, aA: newBoundsY, am: newValues, an: newXCenters, aa: newXIds, ao: newXLabels, aK: newXNets, aL: newXNetsFull, ap: newXShort, aq: newYCenters, ab: newYIds, ar: newYLabels, aM: newYNets, aN: newYNetsFull, as: newYShort});
		}
	});
var $author$project$Main$matrixSliceFromBundle = function (rtData) {
	return A2(
		$elm$core$Maybe$andThen,
		function (bundle) {
			var baseRegion = bundle.ah;
			var withToggle = _Utils_update(
				baseRegion,
				{aH: true});
			return $elm$core$Maybe$Just(
				A2($author$project$Main$applyHemisphereToSlice, rtData.ay, withToggle));
		},
		rtData.ae);
};
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Main$EvSetHemisphere = function (a) {
	return {$: 18, a: a};
};
var $author$project$Main$hemisphereToString = function (h) {
	switch (h) {
		case 0:
			return 'both';
		case 1:
			return 'left';
		default:
			return 'right';
	}
};
var $author$project$Vutils$row = function (gap) {
	return $author$project$Vutils$css('display: flex; align-items: stretch; gap: ' + (gap + ';'));
};
var $author$project$Main$renderHemisphereToggle = function (rtData) {
	var opt = F2(
		function (label, hemi) {
			var isActive = _Utils_eq(rtData.ay, hemi);
			var baseStyle = 'padding: 6px 10px; border-radius: 6px; border: 1px solid #c9d0dc; background: ' + ((isActive ? '#001450' : '#f5f7fb') + ('; color: ' + ((isActive ? 'white' : '#001450') + '; cursor: pointer; font-size: 13px; min-width: 70px; text-align: center; transition: all 0.15s;')));
			return A2(
				$elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Main$EvSetHemisphere(
								$author$project$Main$hemisphereToString(hemi)))
						]),
					$author$project$Vutils$css(baseStyle)),
				_List_fromArray(
					[
						$elm$html$Html$text(label)
					]));
		});
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			$author$project$Vutils$row('4px'),
			$author$project$Vutils$css('align-items: center; flex-wrap: wrap; gap: 6px;')),
		_List_fromArray(
			[
				$elm$html$Html$text('Hemisphere:'),
				A2(opt, 'Both', 0),
				A2(opt, 'Left', 1),
				A2(opt, 'Right', 2)
			]));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Main$renderMatrixHeader = function (rtData) {
	var matrixSlice = $author$project$Main$matrixSliceFromBundle(rtData);
	var labelSwitch = function () {
		var active = rtData.E;
		var knobTransform = active ? 'translateX(16px)' : 'translateX(0px)';
		var trackColor = active ? '#001450' : '#e5e7eb';
		return A2(
			$elm$html$Html$label,
			$author$project$Vutils$css('display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;'),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					$author$project$Vutils$css('font-size: 14px; color: #0f172a; font-weight: 600;'),
					_List_fromArray(
						[
							$elm$html$Html$text('Labels')
						])),
					A2(
					$elm$html$Html$span,
					$author$project$Vutils$css('position: relative; width: 36px; height: 20px; background: ' + (trackColor + '; border-radius: 999px; transition: all 0.15s; display: inline-block;')),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							$author$project$Vutils$css('position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 999px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transform: ' + (knobTransform + '; transition: transform 0.15s;')),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('checkbox'),
								$elm$html$Html$Attributes$checked(active),
								$elm$html$Html$Events$onCheck($author$project$Main$EvToggleMatrixLabels)
							]),
						$author$project$Vutils$css('position: absolute; opacity: 0; width: 0; height: 0;')),
					_List_Nil)
				]));
	}();
	var helperTxt = function () {
		if (matrixSlice.$ === 1) {
			return 'Request an image to view the underlying matrix slice with zoom & pan.';
		} else {
			return 'Source/target (click to sync views)';
		}
	}();
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			$author$project$Vutils$row('12px'),
			$author$project$Vutils$css('align-items: center; flex-wrap: wrap; gap: 10px; padding-bottom: 4px;')),
		_List_fromArray(
			[
				$author$project$Main$renderHemisphereToggle(rtData),
				A2(
				$elm$html$Html$div,
				$author$project$Vutils$css('display: inline-flex; align-items: center; gap: 10px;'),
				_List_fromArray(
					[
						labelSwitch,
						A2(
						$elm$html$Html$p,
						$author$project$Vutils$css('margin: 0; font-size: 12px; color: #0f172a; font-weight: 600;'),
						_List_fromArray(
							[
								$elm$html$Html$text(helperTxt)
							]))
					]))
			]));
};
var $author$project$Main$renderMatrixView = function (rtData) {
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			$author$project$Vutils$column('5px'),
			$author$project$Vutils$css('padding-top: 0.2em;')),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Vutils$css('width: 100%; aspect-ratio: 1.05 / 1; min-height: 440px; max-height: 78vh; height: 70vh; border: none; border-radius: 0px; margin-top: 6px;'),
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('matrix-plot')
						])),
				_List_Nil)
			]));
};
var $author$project$Main$EvSideSelect = function (a) {
	return {$: 3, a: a};
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Main$EvUpdateCMapLeft = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$EvUpdateCMapRight = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$ColorOption = F3(
	function (name, gradient, category) {
		return {aO: category, aT: gradient, R: name};
	});
var $author$project$Main$allowedColorMaps = function () {
	var seq = 'Sequential / Continuous';
	var qual = 'Qualitative';
	var divg = 'Diverging';
	return _List_fromArray(
		[
			A3($author$project$Main$ColorOption, 'viridis', 'linear-gradient(90deg,#440154,#3b528b,#21908c,#5dc863,#fde725)', seq),
			A3($author$project$Main$ColorOption, 'plasma', 'linear-gradient(90deg,#0d0887,#7e03a8,#cb4679,#f0f921)', seq),
			A3($author$project$Main$ColorOption, 'inferno', 'linear-gradient(90deg,#000004,#420a68,#932667,#dd513a,#fca50a,#fcffa4)', seq),
			A3($author$project$Main$ColorOption, 'magma', 'linear-gradient(90deg,#000004,#3b0f70,#8c2981,#de4968,#fe9f6d,#fcfdbf)', seq),
			A3($author$project$Main$ColorOption, 'cividis', 'linear-gradient(90deg,#00204c,#414487,#2a788e,#22a884,#7ad151,#fde725)', seq),
			A3($author$project$Main$ColorOption, 'RdBu', 'linear-gradient(90deg,#b2182b,#ef8a62,#fddbc7,#d1e5f0,#67a9cf,#2166ac)', divg),
			A3($author$project$Main$ColorOption, 'RdYlBu', 'linear-gradient(90deg,#a50026,#f46d43,#fdae61,#fee090,#e0f3f8,#abd9e9,#74add1,#4575b4)', divg),
			A3($author$project$Main$ColorOption, 'BrBG', 'linear-gradient(90deg,#543005,#bf812d,#f6e8c3,#c7eae5,#35978f,#003c30)', divg),
			A3($author$project$Main$ColorOption, 'PuOr', 'linear-gradient(90deg,#7f3b08,#b35806,#f1a340,#fee0b6,#d8daeb,#998ec3,#542788)', divg),
			A3($author$project$Main$ColorOption, 'Spectral', 'linear-gradient(90deg,#9e0142,#f46d43,#fdae61,#fee08b,#e6f598,#abdda4,#66c2a5,#3288bd,#5e4fa2)', divg),
			A3($author$project$Main$ColorOption, 'coolwarm', 'linear-gradient(90deg,#3b4cc0,#7aa0f2,#b5c6e5,#e5c6b5,#f2a07a,#c03b4c)', divg),
			A3($author$project$Main$ColorOption, 'Set1', 'linear-gradient(90deg,#e41a1c,#377eb8,#4daf4a,#984ea3,#ff7f00,#ffff33,#a65628,#f781bf,#999999)', qual),
			A3($author$project$Main$ColorOption, 'Set2', 'linear-gradient(90deg,#66c2a5,#fc8d62,#8da0cb,#e78ac3,#a6d854,#ffd92f,#e5c494,#b3b3b3)', qual),
			A3($author$project$Main$ColorOption, 'Dark2', 'linear-gradient(90deg,#1b9e77,#d95f02,#7570b3,#e7298a,#66a61e,#e6ab02,#a6761d,#666666)', qual)
		]);
}();
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$details = _VirtualDom_node('details');
var $author$project$Main$gradientFor = function (name) {
	return A2(
		$elm$core$Maybe$withDefault,
		'linear-gradient(90deg,#3b4cc0,#7aa0f2,#b5c6e5,#e5c6b5,#f2a07a,#c03b4c)',
		A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.aT;
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (opt) {
						return _Utils_eq(
							$elm$core$String$toLower(opt.R),
							$elm$core$String$toLower(name));
					},
					$author$project$Main$allowedColorMaps))));
};
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $author$project$Main$groupColorOptions = function (opts) {
	var step = F2(
		function (opt, acc) {
			var _v0 = A2(
				$elm$core$List$partition,
				function (_v1) {
					var c = _v1.a;
					return _Utils_eq(c, opt.aO);
				},
				acc);
			if (_v0.a.b) {
				var _v2 = _v0.a;
				var _v3 = _v2.a;
				var cat = _v3.a;
				var lst = _v3.b;
				var rest = _v2.b;
				var others = _v0.b;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						cat,
						_Utils_ap(
							lst,
							_List_fromArray(
								[opt]))),
					_Utils_ap(rest, others));
			} else {
				return _Utils_ap(
					acc,
					_List_fromArray(
						[
							_Utils_Tuple2(
							opt.aO,
							_List_fromArray(
								[opt]))
						]));
			}
		});
	return A3($elm$core$List$foldl, step, _List_Nil, opts);
};
var $author$project$Main$renderCmapSelect = F2(
	function (side, si) {
		var handler = function () {
			if (!side) {
				return $author$project$Main$EvUpdateCMapLeft;
			} else {
				return $author$project$Main$EvUpdateCMapRight;
			}
		}();
		var renderOption = function (opt) {
			var sample = A3(
				$elm$html$Html$node,
				'span',
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
						A2($elm$html$Html$Attributes$style, 'width', '46px'),
						A2($elm$html$Html$Attributes$style, 'height', '12px'),
						A2($elm$html$Html$Attributes$style, 'margin-right', '10px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
						A2($elm$html$Html$Attributes$style, 'border', '1px solid #c9d0dc'),
						A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle'),
						A2($elm$html$Html$Attributes$style, 'background-image', opt.aT),
						A2($elm$html$Html$Attributes$style, 'background-size', '100% 100%'),
						A2($elm$html$Html$Attributes$style, 'background-repeat', 'no-repeat')
					]),
				_List_Nil);
			var isActive = _Utils_eq(
				$elm$core$String$toLower(opt.R),
				$elm$core$String$toLower(si.w));
			return A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						handler(opt.R)),
						A2($elm$html$Html$Attributes$attribute, 'type', 'button'),
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
						A2($elm$html$Html$Attributes$style, 'padding', '7px 10px'),
						A2(
						$elm$html$Html$Attributes$style,
						'border',
						isActive ? '1px solid #001450' : '1px solid #d4dae4'),
						A2(
						$elm$html$Html$Attributes$style,
						'background',
						isActive ? '#eef2f7' : 'white'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
						A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
						A2($elm$html$Html$Attributes$style, 'color', '#111111'),
						A2($elm$html$Html$Attributes$style, 'font-size', '15px')
					]),
				_List_fromArray(
					[
						sample,
						$elm$html$Html$text(opt.R)
					]));
		};
		var renderGroup = function (_v0) {
			var label = _v0.a;
			var opts = _v0.b;
			return A2(
				$elm$html$Html$div,
				$author$project$Vutils$column('6px'),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$p,
						$author$project$Vutils$css('margin: 0; font-size: 13px; color: #1c2734; font-weight: 700;'),
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							])),
					A2($elm$core$List$map, renderOption, opts)));
		};
		var grouped = $author$project$Main$groupColorOptions($author$project$Main$allowedColorMaps);
		var currentGrad = $author$project$Main$gradientFor(si.w);
		return A2(
			$elm$html$Html$details,
			$author$project$Vutils$css('min-width: 200px; max-width: 230px; border: 1px solid #d4dae4; border-radius: 8px; padding: 8px; background: white; position: relative;'),
			_List_fromArray(
				[
					A3(
					$elm$html$Html$node,
					'summary',
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'list-style', 'none'),
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
							A2($elm$html$Html$Attributes$style, 'outline', 'none'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'color', '#1c2734')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							$author$project$Vutils$css('display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: #111111;'),
							_List_fromArray(
								[
									A3(
									$elm$html$Html$node,
									'span',
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
											A2($elm$html$Html$Attributes$style, 'width', '60px'),
											A2($elm$html$Html$Attributes$style, 'height', '12px'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #c9d0dc'),
											A2($elm$html$Html$Attributes$style, 'background-image', currentGrad),
											A2($elm$html$Html$Attributes$style, 'background-size', '100% 100%'),
											A2($elm$html$Html$Attributes$style, 'background-repeat', 'no-repeat')
										]),
									_List_Nil),
									$elm$html$Html$text(si.w)
								])),
							A2(
							$elm$html$Html$span,
							$author$project$Vutils$css('font-size: 14px; color: #4b5563;'),
							_List_fromArray(
								[
									$elm$html$Html$text('▼')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						$author$project$Vutils$column('8px'),
						$author$project$Vutils$css('padding: 8px; position: absolute; top: calc(100% + 6px); left: 0; width: 100%; background: white; border: 1px solid #d4dae4; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.12); max-height: 200px; overflow-y: auto; z-index: 10;')),
					A2($elm$core$List$map, renderGroup, grouped))
				]));
	});
var $author$project$Main$EvRequestNewImage = {$: 9};
var $author$project$Main$EvUpdateCoord = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Main$X1 = 0;
var $author$project$Main$X1I = 0;
var $author$project$Main$X2 = 1;
var $author$project$Main$X2I = 1;
var $author$project$Main$X3 = 2;
var $author$project$Main$X3I = 2;
var $author$project$Main$coordsToStr = function (_v0) {
	var x1 = _v0.o;
	var x2 = _v0.p;
	var x3 = _v0.q;
	return '(' + ($elm$core$String$fromInt(x1) + (', ' + ($elm$core$String$fromInt(x2) + (', ' + ($elm$core$String$fromInt(x3) + ')')))));
};
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $author$project$Main$onEnter = function (msg) {
	var isEnter = function (code) {
		return (code === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('not ENTER');
	};
	return A2(
		$elm$html$Html$Events$on,
		'keydown',
		A2($elm$json$Json$Decode$andThen, isEnter, $elm$html$Html$Events$keyCode));
};
var $author$project$Vutils$redText = $author$project$Vutils$css('color: red');
var $author$project$Main$parsibilityStyle = function (val) {
	var _v0 = $elm$core$String$toInt(val);
	if (!_v0.$) {
		return _List_Nil;
	} else {
		return $author$project$Vutils$redText;
	}
};
var $author$project$Vutils$prettyInput = $author$project$Vutils$css('padding: 6px 8px; border: 1px solid #c7cede; border-radius: 6px; background: #f7f9fc; font-size: 13px;');
var $author$project$Vutils$short = $author$project$Vutils$css('width: 4em;');
var $Gizra$elm_keyboard_event$Keyboard$Event$KeyboardEvent = F7(
	function (altKey, ctrlKey, key, keyCode, metaKey, repeat, shiftKey) {
		return {cB: altKey, cM: ctrlKey, c3: key, bI: keyCode, c6: metaKey, dt: repeat, dx: shiftKey};
	});
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeKey = $elm$json$Json$Decode$maybe(
	A2(
		$elm$json$Json$Decode$andThen,
		function (key) {
			return $elm$core$String$isEmpty(key) ? $elm$json$Json$Decode$fail('empty key') : $elm$json$Json$Decode$succeed(key);
		},
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero = A2(
	$elm$json$Json$Decode$andThen,
	function (code) {
		return (!code) ? $elm$json$Json$Decode$fail('code was zero') : $elm$json$Json$Decode$succeed(code);
	},
	$elm$json$Json$Decode$int);
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyCode = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$field, 'keyCode', $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero),
			A2($elm$json$Json$Decode$field, 'which', $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero),
			A2($elm$json$Json$Decode$field, 'charCode', $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero),
			$elm$json$Json$Decode$succeed(0)
		]));
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$A = {$: 0};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Add = {$: 85};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Alt = {$: 32};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ambiguous = function (a) {
	return {$: 89, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$B = {$: 1};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Backspace = {$: 38};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$C = {$: 2};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$CapsLock = {$: 34};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$ChromeSearch = {$: 59};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Command = {$: 58};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ctrl = function (a) {
	return {$: 31, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$D = {$: 3};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Decimal = {$: 87};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Delete = {$: 39};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Divide = {$: 88};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Down = {$: 29};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$E = {$: 4};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Eight = {$: 52};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$End = {$: 42};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Enter = {$: 37};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Escape = {$: 36};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F = {$: 5};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F1 = {$: 62};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F10 = {$: 71};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F11 = {$: 72};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F12 = {$: 73};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F2 = {$: 63};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F3 = {$: 64};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F4 = {$: 65};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F5 = {$: 66};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F6 = {$: 67};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F7 = {$: 68};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F8 = {$: 69};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F9 = {$: 70};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Five = {$: 49};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Four = {$: 48};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$G = {$: 6};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$H = {$: 7};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Home = {$: 43};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$I = {$: 8};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Insert = {$: 54};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$J = {$: 9};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$K = {$: 10};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$L = {$: 11};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Left = {$: 26};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$M = {$: 12};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Multiply = {$: 84};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$N = {$: 13};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Nine = {$: 53};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumLock = {$: 60};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadEight = {$: 82};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFive = {$: 79};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFour = {$: 78};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadNine = {$: 83};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadOne = {$: 75};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSeven = {$: 81};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSix = {$: 80};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadThree = {$: 77};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadTwo = {$: 76};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadZero = {$: 74};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$O = {$: 14};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$One = {$: 45};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$P = {$: 15};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageDown = {$: 41};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageUp = {$: 40};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PauseBreak = {$: 56};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PrintScreen = {$: 55};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Q = {$: 16};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$R = {$: 17};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Right = {$: 27};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$S = {$: 18};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$ScrollLock = {$: 61};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Seven = {$: 51};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Shift = function (a) {
	return {$: 30, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Six = {$: 50};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Spacebar = {$: 35};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Subtract = {$: 86};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$T = {$: 19};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Tab = {$: 33};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Three = {$: 47};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Two = {$: 46};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$U = {$: 20};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Unknown = function (a) {
	return {$: 90, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Up = {$: 28};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$V = {$: 21};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$W = {$: 22};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Windows = {$: 57};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$X = {$: 23};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Y = {$: 24};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Z = {$: 25};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Zero = {$: 44};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$fromCode = function (keyCode) {
	switch (keyCode) {
		case 8:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Backspace;
		case 9:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Tab;
		case 13:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Enter;
		case 16:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Shift($elm$core$Maybe$Nothing);
		case 17:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ctrl($elm$core$Maybe$Nothing);
		case 18:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Alt;
		case 19:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PauseBreak;
		case 20:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$CapsLock;
		case 27:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Escape;
		case 32:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Spacebar;
		case 33:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageUp;
		case 34:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageDown;
		case 35:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$End;
		case 36:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Home;
		case 37:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Left;
		case 38:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Up;
		case 39:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Right;
		case 40:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Down;
		case 44:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PrintScreen;
		case 45:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Insert;
		case 46:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Delete;
		case 48:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Zero;
		case 49:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$One;
		case 50:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Two;
		case 51:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Three;
		case 52:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Four;
		case 53:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Five;
		case 54:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Six;
		case 55:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Seven;
		case 56:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Eight;
		case 57:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Nine;
		case 65:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$A;
		case 66:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$B;
		case 67:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$C;
		case 68:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$D;
		case 69:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$E;
		case 70:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F;
		case 71:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$G;
		case 72:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$H;
		case 73:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$I;
		case 74:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$J;
		case 75:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$K;
		case 76:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$L;
		case 77:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$M;
		case 78:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$N;
		case 79:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$O;
		case 80:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$P;
		case 81:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Q;
		case 82:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$R;
		case 83:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$S;
		case 84:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$T;
		case 85:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$U;
		case 86:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$V;
		case 87:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$W;
		case 88:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$X;
		case 89:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Y;
		case 90:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Z;
		case 91:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ambiguous(
				_List_fromArray(
					[$SwiftsNamesake$proper_keyboard$Keyboard$Key$Windows, $SwiftsNamesake$proper_keyboard$Keyboard$Key$Command, $SwiftsNamesake$proper_keyboard$Keyboard$Key$ChromeSearch]));
		case 96:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadZero;
		case 97:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadOne;
		case 98:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadTwo;
		case 99:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadThree;
		case 100:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFour;
		case 101:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFive;
		case 102:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSix;
		case 103:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSeven;
		case 104:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadEight;
		case 105:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadNine;
		case 106:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Multiply;
		case 107:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Add;
		case 109:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Subtract;
		case 110:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Decimal;
		case 111:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Divide;
		case 112:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F1;
		case 113:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F2;
		case 114:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F3;
		case 115:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F4;
		case 116:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F5;
		case 117:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F6;
		case 118:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F7;
		case 119:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F8;
		case 120:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F9;
		case 121:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F10;
		case 122:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F11;
		case 123:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F12;
		case 144:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumLock;
		case 145:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$ScrollLock;
		default:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Unknown(keyCode);
	}
};
var $elm$json$Json$Decode$map7 = _Json_map7;
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyboardEvent = A8(
	$elm$json$Json$Decode$map7,
	$Gizra$elm_keyboard_event$Keyboard$Event$KeyboardEvent,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	$Gizra$elm_keyboard_event$Keyboard$Event$decodeKey,
	A2($elm$json$Json$Decode$map, $SwiftsNamesake$proper_keyboard$Keyboard$Key$fromCode, $Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyCode),
	A2($elm$json$Json$Decode$field, 'metaKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'repeat', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $Gizra$elm_keyboard_event$Keyboard$Event$considerKeyboardEvent = function (func) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (event) {
			var _v0 = func(event);
			if (!_v0.$) {
				var msg = _v0.a;
				return $elm$json$Json$Decode$succeed(msg);
			} else {
				return $elm$json$Json$Decode$fail('Ignoring keyboard event');
			}
		},
		$Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyboardEvent);
};
var $author$project$Main$EvAdjustInput = F2(
	function (a, b) {
		return {$: 15, a: a, b: b};
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Main$toIncDec = F2(
	function (inputId, ev) {
		var mbDirection = _Utils_eq(ev.bI, $SwiftsNamesake$proper_keyboard$Keyboard$Key$Up) ? $elm$core$Maybe$Just(1) : (_Utils_eq(ev.bI, $SwiftsNamesake$proper_keyboard$Keyboard$Key$Down) ? $elm$core$Maybe$Just(-1) : $elm$core$Maybe$Nothing);
		var factor = ev.dx ? 5 : 1;
		return A2(
			$elm$core$Maybe$map,
			function (x) {
				return A2($author$project$Main$EvAdjustInput, inputId, x * factor);
			},
			mbDirection);
	});
var $author$project$Main$withValKeyHandlerFor = function (inputId) {
	return A2(
		$elm$html$Html$Events$on,
		'keyup',
		$Gizra$elm_keyboard_event$Keyboard$Event$considerKeyboardEvent(
			$author$project$Main$toIncDec(inputId)));
};
var $author$project$Main$renderMniCoords = F6(
	function (_v0, invalidCoord, minMni, maxMni, side, extraAttrs) {
		var x1 = _v0.o;
		var x2 = _v0.p;
		var x3 = _v0.q;
		var labelTxt = function (txt) {
			return A2(
				$elm$html$Html$span,
				$author$project$Vutils$css('font-weight: 700; color: #000; margin-right: 6px; line-height: 1; font-size: clamp(10px, 1.05vw, 13px);'),
				_List_fromArray(
					[
						$elm$html$Html$text(txt)
					]));
		};
		var compact = $author$project$Vutils$css('max-width: clamp(50px, 12vw, 90px); padding: 3px 5px; font-size: clamp(9px, 1vw, 12px); height: 22px;');
		var mni_fields = A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$Vutils$row('5px'),
				$author$project$Vutils$css('align-items: center;')),
			_List_fromArray(
				[
					labelTxt('MNI:'),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								$author$project$Main$EvUpdateCoord(0)),
								$elm$html$Html$Events$onBlur($author$project$Main$EvRequestNewImage),
								$author$project$Main$onEnter($author$project$Main$EvRequestNewImage),
								$author$project$Main$withValKeyHandlerFor(
								_Utils_Tuple2(0, side)),
								$elm$html$Html$Attributes$value(x1)
							]),
						_Utils_ap(
							$author$project$Main$parsibilityStyle(x1),
							_Utils_ap(
								$author$project$Vutils$short,
								_Utils_ap($author$project$Vutils$prettyInput, compact)))),
					_List_Nil),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								$author$project$Main$EvUpdateCoord(1)),
								$elm$html$Html$Events$onBlur($author$project$Main$EvRequestNewImage),
								$author$project$Main$onEnter($author$project$Main$EvRequestNewImage),
								$author$project$Main$withValKeyHandlerFor(
								_Utils_Tuple2(1, side)),
								$elm$html$Html$Attributes$value(x2)
							]),
						_Utils_ap(
							$author$project$Main$parsibilityStyle(x2),
							_Utils_ap(
								$author$project$Vutils$short,
								_Utils_ap($author$project$Vutils$prettyInput, compact)))),
					_List_Nil),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								$author$project$Main$EvUpdateCoord(2)),
								$elm$html$Html$Events$onBlur($author$project$Main$EvRequestNewImage),
								$author$project$Main$onEnter($author$project$Main$EvRequestNewImage),
								$author$project$Main$withValKeyHandlerFor(
								_Utils_Tuple2(2, side)),
								$elm$html$Html$Attributes$value(x3)
							]),
						_Utils_ap(
							$author$project$Main$parsibilityStyle(x3),
							_Utils_ap(
								$author$project$Vutils$short,
								_Utils_ap($author$project$Vutils$prettyInput, compact)))),
					_List_Nil)
				]));
		return invalidCoord ? A2(
			$elm$html$Html$div,
			$author$project$Vutils$column('5px'),
			_List_fromArray(
				[
					mni_fields,
					A2(
					$elm$html$Html$p,
					$author$project$Vutils$css('color: red; font-size: 14px;'),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'allowed values: ' + ($author$project$Main$coordsToStr(minMni) + (' to ' + $author$project$Main$coordsToStr(maxMni))))
						]))
				])) : mni_fields;
	});
var $author$project$Main$EvUpdateThresh = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Main$High = 1;
var $author$project$Main$Low = 0;
var $author$project$Main$ThreshHigh = 5;
var $author$project$Main$ThreshLow = 6;
var $author$project$Main$renderThreshold = F3(
	function (side, thresh, extras) {
		var labelTxt = function (txt) {
			return A2(
				$elm$html$Html$span,
				$author$project$Vutils$css('font-weight: 700; color: #000; margin-right: 6px; font-size: clamp(9px, 1vw, 12px);'),
				_List_fromArray(
					[
						$elm$html$Html$text(txt)
					]));
		};
		var compact = $author$project$Vutils$css('max-width: clamp(46px, 10vw, 80px); padding: 2px 4px; font-size: clamp(8px, 0.9vw, 11px); height: 20px;');
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$Vutils$row('5px'),
				$author$project$Vutils$css('align-items: center; flex-wrap: nowrap; line-height: 1;')),
			_List_fromArray(
				[
					labelTxt('Threshold:'),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								$author$project$Main$EvUpdateThresh(0)),
								$elm$html$Html$Events$onBlur($author$project$Main$EvRequestNewImage),
								$author$project$Main$onEnter($author$project$Main$EvRequestNewImage),
								$author$project$Main$withValKeyHandlerFor(
								_Utils_Tuple2(6, side)),
								$elm$html$Html$Attributes$value(thresh.c)
							]),
						_Utils_ap(
							$author$project$Vutils$short,
							_Utils_ap(
								$author$project$Vutils$prettyInput,
								_Utils_ap(compact, extras)))),
					_List_Nil),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								$author$project$Main$EvUpdateThresh(1)),
								$elm$html$Html$Events$onBlur($author$project$Main$EvRequestNewImage),
								$author$project$Main$onEnter($author$project$Main$EvRequestNewImage),
								$author$project$Main$withValKeyHandlerFor(
								_Utils_Tuple2(5, side)),
								$elm$html$Html$Attributes$value(thresh.b)
							]),
						_Utils_ap(
							$author$project$Vutils$short,
							_Utils_ap(
								$author$project$Vutils$prettyInput,
								_Utils_ap(compact, extras)))),
					_List_Nil)
				]));
	});
var $author$project$Main$EvUpdateVRange = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Main$Vhigh = 4;
var $author$project$Main$Vlow = 3;
var $author$project$Main$renderVRange = F3(
	function (side, vrange, extras) {
		var labelTxt = function (txt) {
			return A2(
				$elm$html$Html$span,
				$author$project$Vutils$css('font-weight: 700; color: #000; margin-right: 6px; font-size: clamp(10px, 1.05vw, 13px);'),
				_List_fromArray(
					[
						$elm$html$Html$text(txt)
					]));
		};
		var compact = $author$project$Vutils$css('max-width: clamp(50px, 12vw, 90px); padding: 3px 5px; font-size: clamp(9px, 1vw, 12px); height: 22px;');
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$Vutils$row('6px'),
				$author$project$Vutils$css('flex-wrap: nowrap; align-items: center; line-height: 1;')),
			_List_fromArray(
				[
					labelTxt('Colour Range:'),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								$author$project$Main$EvUpdateVRange(0)),
								$elm$html$Html$Events$onBlur($author$project$Main$EvRequestNewImage),
								$author$project$Main$onEnter($author$project$Main$EvRequestNewImage),
								$author$project$Main$withValKeyHandlerFor(
								_Utils_Tuple2(3, side)),
								$elm$html$Html$Attributes$value(vrange.c)
							]),
						_Utils_ap(
							$author$project$Vutils$short,
							_Utils_ap(
								$author$project$Vutils$prettyInput,
								_Utils_ap(compact, extras)))),
					_List_Nil),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								$author$project$Main$EvUpdateVRange(1)),
								$elm$html$Html$Events$onBlur($author$project$Main$EvRequestNewImage),
								$author$project$Main$onEnter($author$project$Main$EvRequestNewImage),
								$author$project$Main$withValKeyHandlerFor(
								_Utils_Tuple2(4, side)),
								$elm$html$Html$Attributes$value(vrange.b)
							]),
						_Utils_ap(
							$author$project$Vutils$short,
							_Utils_ap(
								$author$project$Vutils$prettyInput,
								_Utils_ap(compact, extras)))),
					_List_Nil)
				]));
	});
var $author$project$Main$sideToString = function (s) {
	if (!s) {
		return 'Left';
	} else {
		return 'Right';
	}
};
var $author$project$Main$renderSideOverlay = F3(
	function (side, si, rtData) {
		var valueLabel = function () {
			var _v1 = si.aJ;
			if (!_v1.$) {
				var v = _v1.a;
				return 'Value: ' + $elm$core$String$fromFloat(v);
			} else {
				return 'Value: -';
			}
		}();
		var regionLabel = function () {
			var _v0 = si.aw;
			if (!_v0.$) {
				var vol = _v0.a.cn;
				var name = _v0.a.R;
				return 'Region: ' + (name + (' (' + (vol + ')')));
			} else {
				return 'Region: None';
			}
		}();
		var onFocusSide = $elm$html$Html$Events$onFocus(
			$author$project$Main$EvSideSelect(
				$author$project$Main$sideToString(side)));
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				$author$project$Vutils$column('4px'),
				$author$project$Vutils$css('flex:1; min-width: 180px; font-size: clamp(7px, 0.8vw, 11px); line-height: 1.26;')),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					$author$project$Vutils$css('font-size: clamp(9px, 1vw, 13px); color: #000; font-weight: 600; margin: 0;'),
					_List_fromArray(
						[
							$elm$html$Html$text(regionLabel)
						])),
					A2(
					$elm$html$Html$p,
					$author$project$Vutils$css('margin: 0; color: #1f2430; font-size: clamp(8px, 0.9vw, 10px); font-weight: 500;'),
					_List_fromArray(
						[
							$elm$html$Html$text(valueLabel)
						])),
					A6(
					$author$project$Main$renderMniCoords,
					si.j,
					rtData.av,
					rtData.K.a4,
					rtData.K.a2,
					side,
					_List_fromArray(
						[onFocusSide])),
					A3(
					$author$project$Main$renderVRange,
					side,
					si.f,
					_List_fromArray(
						[onFocusSide])),
					A3(
					$author$project$Main$renderThreshold,
					side,
					si.v,
					_List_fromArray(
						[onFocusSide])),
					A2(
					$elm$html$Html$div,
					$author$project$Vutils$css('margin-top: 4px;'),
					_List_fromArray(
						[
							A2($author$project$Main$renderCmapSelect, side, si)
						]))
				]));
	});
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $mathiajusth$nonempty_dict$Dict$Nonempty$toList = function (_v0) {
	var _v1 = _v0;
	var dictTail = _v1.b;
	return $elm$core$Dict$toList(dictTail);
};
var $mgold$elm_nonempty_list$List$Nonempty$toList = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return A2($elm$core$List$cons, x, xs);
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $author$project$Vutils$toSelectChild = function (c) {
	return A2(
		$elm$html$Html$option,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$value(c)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(c)
			]));
};
var $author$project$Main$renderMainView = function (rtData) {
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			$author$project$Vutils$column('12px'),
			$author$project$Vutils$css('width: 100%; max-width: none;')),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('figure-shell')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('figure-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('brain-panel')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										$author$project$Vutils$css('display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: flex-start;'),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$select,
												A2(
													$elm$core$List$cons,
													$elm$html$Html$Events$onInput($author$project$Main$EvSelectedAtlas),
													_Utils_ap(
														$author$project$Vutils$css('flex: 1 1 48%; min-width: 180px;'),
														$author$project$Vutils$prettySelect)),
												A2(
													$elm$core$List$map,
													$author$project$Vutils$toSelectChild,
													A2(
														$elm$core$List$map,
														function (_v0) {
															var k = _v0.a;
															return k;
														},
														$mathiajusth$nonempty_dict$Dict$Nonempty$toList(rtData.K.O)))),
												A2(
												$elm$html$Html$select,
												A2(
													$elm$core$List$cons,
													$elm$html$Html$Events$onInput($author$project$Main$EvSelected4DImg),
													_Utils_ap(
														$author$project$Vutils$css('flex: 1 1 48%; min-width: 180px;'),
														$author$project$Vutils$prettySelect)),
												function () {
													var imgs = A2(
														$elm$core$Maybe$withDefault,
														_List_fromArray(
															[rtData.P]),
														A2(
															$elm$core$Maybe$map,
															$mgold$elm_nonempty_list$List$Nonempty$toList,
															A2($mathiajusth$nonempty_dict$Dict$Nonempty$get, rtData.W, rtData.K.O)));
													return A2($elm$core$List$map, $author$project$Vutils$toSelectChild, imgs);
												}())
											])),
										A2(
										$elm$html$Html$div,
										$author$project$Vutils$css('position: relative; width: 100%;'),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$img,
												_Utils_ap(
													_List_fromArray(
														[
															$elm$html$Html$Attributes$src('data:image/png;base64,' + rtData.Y),
															$elm$html$Html$Attributes$id('main-img'),
															A2(
															$elm$html$Html$Events$on,
															'click',
															A2($elm$json$Json$Decode$map, $author$project$Main$EvImageClick, $author$project$Main$clickDecoder))
														]),
													$author$project$Vutils$css('width: 100%; height: auto; max-height: 80vh; object-fit: contain; display: block; border: none; outline: none; background: transparent;')),
												_List_Nil),
												A2(
												$elm$html$Html$div,
												$author$project$Vutils$css('position: absolute; right: calc(50% + 6px); top: calc(64% + clamp(0px, (1400px - 100vw), 600px)); transform: translateY(-50%); width: clamp(140px, 20vw, 200px); background: rgba(255,255,255,0); padding: clamp(4px, 0.8vw, 10px); border-radius: 10px; box-shadow: none; border: none; z-index: 2;'),
												_List_fromArray(
													[
														A3($author$project$Main$renderSideOverlay, 0, rtData.d, rtData)
													])),
												A2(
												$elm$html$Html$div,
												$author$project$Vutils$css('position: absolute; left: clamp(70%, 74%, 78%); top: calc(64% + clamp(0px, (1400px - 100vw), 600px)); transform: translateY(-50%); width: clamp(140px, 20vw, 200px); background: rgba(255,255,255,0); padding: clamp(4px, 0.8vw, 10px); border-radius: 10px; box-shadow: none; border: none; z-index: 2;'),
												_List_fromArray(
													[
														A3($author$project$Main$renderSideOverlay, 1, rtData.a, rtData)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_Utils_ap(
											$author$project$Vutils$row('10px'),
											$author$project$Vutils$css('align-items: flex-start; flex-wrap: wrap; padding-top: clamp(12px, 4vw, 28px); background: transparent;')),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$div,
								_Utils_ap(
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('matrix-panel')
										]),
									$author$project$Vutils$css('margin-left: clamp(10px, 3vw, 20px); margin-top: clamp(-14px, -3vw, 0px); background: transparent;')),
								_List_fromArray(
									[
										$author$project$Main$renderMatrixHeader(rtData),
										$author$project$Main$renderMatrixView(rtData)
									]))
							]))
					]))
			]));
};
var $author$project$Main$renderRunning = function (rtData) {
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			$author$project$Vutils$fullwidth,
			$author$project$Vutils$css('background: rgba(255,255,255,1);max-height:100%; position: relative;')),
		_List_fromArray(
			[
				$author$project$Main$loadingStyles,
				A2(
				$elm$html$Html$div,
				_Utils_ap(
					$author$project$Vutils$row('12px'),
					_Utils_ap(
						$author$project$Vutils$hcenter,
						$author$project$Vutils$css('align-items: flex-start; padding: 0 8px; margin-top: 4px;'))),
				_List_fromArray(
					[
						$author$project$Main$renderMainView(rtData)
					])),
				$author$project$Main$dialogView(rtData),
				$author$project$Main$renderLoadingOverlay(rtData.A)
			]));
};
var $author$project$Main$renderUninitialized = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Main$loadingStyles,
			$author$project$Main$renderLoadingOverlay(true)
		]));
var $author$project$Main$EvShareButtonPressed = {$: 13};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Main$topNav = function (rtData) {
	var tabsStyle = $author$project$Vutils$css('display: flex; gap: 6px; flex-wrap: wrap; align-items: center; font-size: 12px;');
	var tabLink = F2(
		function (hrefTxt, labelTxt) {
			return A2(
				$elm$html$Html$a,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(hrefTxt),
							$elm$html$Html$Attributes$target('_blank')
						]),
					$author$project$Vutils$css('padding: 4px 8px; background: rgba(255,255,255,0.14); border-radius: 7px; color: #f8fafc; text-decoration: none; font-weight: 700; font-size: 12px; letter-spacing: 0.05px; transition: background 0.15s;')),
				_List_fromArray(
					[
						$elm$html$Html$text(labelTxt)
					]));
		});
	var shareBtn = A2(
		$elm$html$Html$button,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$Main$EvShareButtonPressed)
				]),
			$author$project$Vutils$css('padding: 4px 10px; background: #f8fafc; color: #001450; border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; transition: transform 0.1s ease;')),
		_List_fromArray(
			[
				$elm$html$Html$text('Share')
			]));
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				tabsStyle,
				_List_fromArray(
					[
						A2(tabLink, '/about.html', 'About'),
						A2(tabLink, 'https://tu-dresden.de/impressum', 'Legal Notice'),
						A2(tabLink, 'https://tu-dresden.de/impressum#ck_datenschutz', 'Privacy'),
						A2(tabLink, 'https://tu-dresden.de/transparenzgesetz', 'Transparency Act'),
						A2(tabLink, '/atlas-info.html?atlas=' + rtData.W, 'Atlas Info'),
						A2(tabLink, 'https://tu-dresden.de/barrierefreiheit', 'Accessibility'),
						A2(
						$elm$html$Html$div,
						$author$project$Vutils$css('flex: 1;'),
						_List_Nil),
						shareBtn
					]))
			]));
};
var $author$project$Vutils$containerCSS = $author$project$Vutils$css('\n    min-height: 3.3em;\n    background-color: #00008c;\n    width: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 6px 12px;\n    gap: 8px;\n');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Vutils$headerCSS = $author$project$Vutils$css('\n    display: inline-flex;\n    align-items: center;\n    gap: 10px;\n    color: white;\n    font-size: 1.25em;\n    letter-spacing: -0.15px;\n    margin: 0;\n');
var $author$project$Vutils$tudWrapper = F2(
	function (headerNav, content) {
		return A2(
			$elm$html$Html$div,
			$author$project$Vutils$css('max-height: 100vh; display: flex; flex-direction: column;'),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$author$project$Vutils$containerCSS,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							$author$project$Vutils$css('display: inline-flex; align-items: center; gap: 8px;'),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$src('/TUD_Logo_RGB_horizontal_weiß_de.svg'),
										$author$project$Vutils$css('max-height: 2.3em; margin:0; padding: 0;')),
									_List_Nil),
									A2(
									$elm$html$Html$h1,
									$author$project$Vutils$headerCSS,
									_List_fromArray(
										[
											$elm$html$Html$text('ConnExplorer')
										]))
								])),
							A2(
							$elm$html$Html$div,
							$author$project$Vutils$css('display: flex; justify-content: flex-end; align-items: center; gap: 8px;'),
							_List_fromArray(
								[headerNav]))
						])),
					A2(
					$elm$html$Html$div,
					$author$project$Vutils$css('margin: 0; padding: 0; flex: 1 1 auto; width: 100%; height: auto; min-height: 100vh; background: transparent; box-shadow: none; border: none; overflow: hidden;'),
					_List_fromArray(
						[content]))
				]));
	});
var $author$project$Main$renderPage = function (model) {
	var nav = function () {
		if (model.$ === 2) {
			var data = model.a;
			return $author$project$Main$topNav(data);
		} else {
			return $elm$html$Html$text('');
		}
	}();
	var app = function () {
		switch (model.$) {
			case 3:
				var desc = model.a;
				return $author$project$Main$renderInvalid(desc);
			case 0:
				return $author$project$Main$renderUninitialized;
			case 1:
				return $author$project$Main$renderUninitialized;
			default:
				var data = model.a;
				return $author$project$Main$renderRunning(data);
		}
	}();
	var body = A2($author$project$Vutils$tudWrapper, nav, app);
	return A2(
		$elm$browser$Browser$Document,
		'TU Dresden - ConnExplorer',
		_List_fromArray(
			[body]));
};
var $author$project$Main$EvMatrixClicked = F2(
	function (a, b) {
		return {$: 16, a: a, b: b};
	});
var $author$project$Main$RecvFS = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Main$matrixClicked = _Platform_incomingPort(
	'matrixClicked',
	A2(
		$elm$json$Json$Decode$andThen,
		function (row) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (col) {
					return $elm$json$Json$Decode$succeed(
						{bu: col, b7: row});
				},
				A2($elm$json$Json$Decode$field, 'col', $elm$json$Json$Decode$int));
		},
		A2($elm$json$Json$Decode$field, 'row', $elm$json$Json$Decode$int)));
var $author$project$Main$messageReceiver = _Platform_incomingPort('messageReceiver', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$messageReceiver($author$project$Main$RecvFS),
				$author$project$Main$matrixClicked(
				function (p) {
					return A2($author$project$Main$EvMatrixClicked, p.b7, p.bu);
				})
			]));
};
var $author$project$Main$Error = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$MaybeHighLowPair = F2(
	function (low, high) {
		return {b: high, c: low};
	});
var $author$project$Main$Running = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$stringAdd = F2(
	function (val, offset) {
		var _v0 = $elm$core$String$toInt(val);
		if (!_v0.$) {
			var ival = _v0.a;
			return $elm$core$String$fromInt(ival + offset);
		} else {
			return val;
		}
	});
var $author$project$Main$updateCoord = F3(
	function (idx, newVal, coords) {
		switch (idx) {
			case 0:
				return _Utils_update(
					coords,
					{o: newVal});
			case 1:
				return _Utils_update(
					coords,
					{p: newVal});
			default:
				return _Utils_update(
					coords,
					{q: newVal});
		}
	});
var $author$project$Main$updateCoords = F2(
	function (updateFn, sideInfo) {
		return _Utils_update(
			sideInfo,
			{
				j: updateFn(sideInfo.j)
			});
	});
var $author$project$Main$updateHLPairVal = F3(
	function (idx, val, vrange) {
		if (!idx) {
			return _Utils_update(
				vrange,
				{c: val});
		} else {
			return _Utils_update(
				vrange,
				{b: val});
		}
	});
var $author$project$Main$updateThresh = F2(
	function (updateFn, side) {
		return _Utils_update(
			side,
			{
				v: updateFn(side.v)
			});
	});
var $author$project$Main$updateVRange = F2(
	function (updateFn, side) {
		return _Utils_update(
			side,
			{
				f: updateFn(side.f)
			});
	});
var $author$project$Main$adjustInputValue = F3(
	function (_v0, offset, rtData) {
		var field = _v0.a;
		var side = _v0.b;
		var adjustField = F2(
			function (targetField, si) {
				switch (targetField) {
					case 0:
						return A2(
							$author$project$Main$updateCoords,
							A2(
								$author$project$Main$updateCoord,
								0,
								A2($author$project$Main$stringAdd, si.j.o, offset)),
							si);
					case 1:
						return A2(
							$author$project$Main$updateCoords,
							A2(
								$author$project$Main$updateCoord,
								1,
								A2($author$project$Main$stringAdd, si.j.p, offset)),
							si);
					case 2:
						return A2(
							$author$project$Main$updateCoords,
							A2(
								$author$project$Main$updateCoord,
								2,
								A2($author$project$Main$stringAdd, si.j.q, offset)),
							si);
					case 3:
						return A2(
							$author$project$Main$updateVRange,
							A2(
								$author$project$Main$updateHLPairVal,
								0,
								A2($author$project$Main$stringAdd, si.f.c, offset)),
							si);
					case 4:
						return A2(
							$author$project$Main$updateVRange,
							A2(
								$author$project$Main$updateHLPairVal,
								1,
								A2($author$project$Main$stringAdd, si.f.b, offset)),
							si);
					case 5:
						return A2(
							$author$project$Main$updateThresh,
							A2(
								$author$project$Main$updateHLPairVal,
								1,
								A2($author$project$Main$stringAdd, si.v.b, offset)),
							si);
					default:
						return A2(
							$author$project$Main$updateThresh,
							A2(
								$author$project$Main$updateHLPairVal,
								0,
								A2($author$project$Main$stringAdd, si.v.c, offset)),
							si);
				}
			});
		if (!side) {
			return _Utils_update(
				rtData,
				{
					d: A2(adjustField, field, rtData.d)
				});
		} else {
			return _Utils_update(
				rtData,
				{
					a: A2(adjustField, field, rtData.a)
				});
		}
	});
var $author$project$Main$getCoordAtIdx = F2(
	function (idx, coords) {
		switch (idx) {
			case 0:
				return coords.o;
			case 1:
				return coords.p;
			default:
				return coords.q;
		}
	});
var $author$project$Main$getMbCoordAtIdx = F2(
	function (idx, coords) {
		switch (idx) {
			case 0:
				return coords.o;
			case 1:
				return coords.p;
			default:
				return coords.q;
		}
	});
var $author$project$Main$isValid = F3(
	function (coordIdx, mbCoords, initData) {
		return A2(
			$elm$core$Maybe$withDefault,
			true,
			A2(
				$elm$core$Maybe$map,
				function (i) {
					var min_v = A2($author$project$Main$getCoordAtIdx, coordIdx, initData.a4);
					var max_v = A2($author$project$Main$getCoordAtIdx, coordIdx, initData.a2);
					return (_Utils_cmp(min_v, i) < 1) && (_Utils_cmp(i, max_v) < 1);
				},
				A2($author$project$Main$getMbCoordAtIdx, coordIdx, mbCoords)));
	});
var $author$project$Main$coordsValid = F2(
	function (initData, mbCoords) {
		return A3($author$project$Main$isValid, 0, mbCoords, initData) && (A3($author$project$Main$isValid, 1, mbCoords, initData) && A3($author$project$Main$isValid, 2, mbCoords, initData));
	});
var $author$project$Main$MaybeCoords = F3(
	function (x1, x2, x3) {
		return {o: x1, p: x2, q: x3};
	});
var $author$project$Main$parseCoords = function (sc) {
	return A3(
		$author$project$Main$MaybeCoords,
		$elm$core$String$toInt(sc.o),
		$elm$core$String$toInt(sc.p),
		$elm$core$String$toInt(sc.q));
};
var $author$project$Main$allMniCoordsValid = function (rtData) {
	return A2(
		$author$project$Main$coordsValid,
		rtData.K,
		$author$project$Main$parseCoords(rtData.d.j)) && A2(
		$author$project$Main$coordsValid,
		rtData.K,
		$author$project$Main$parseCoords(rtData.a.j));
};
var $author$project$Main$applyBundleCmap = F2(
	function (cmap, bundle) {
		var upd = function (slice) {
			return _Utils_update(
				slice,
				{w: cmap});
		};
		return _Utils_update(
			bundle,
			{
				ah: upd(bundle.ah)
			});
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Main$clearMatrix = function (rtData) {
	return _Utils_update(
		rtData,
		{
			ae: $elm$core$Maybe$Nothing,
			s: A2($author$project$Main$MaybeHighLowPair, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
			H: $elm$core$Maybe$Nothing
		});
};
var $author$project$Main$StringCoords = F3(
	function (x1, x2, x3) {
		return {o: x1, p: x2, q: x3};
	});
var $author$project$Main$coordsToString = function (_v0) {
	var x1 = _v0.o;
	var x2 = _v0.p;
	var x3 = _v0.q;
	var fToS = function (f) {
		if (!f.$) {
			var x = f.a;
			return $elm$core$String$fromInt(x);
		} else {
			return '-';
		}
	};
	return A3(
		$author$project$Main$StringCoords,
		fToS(x1),
		fToS(x2),
		fToS(x3));
};
var $author$project$Main$MFSDeathRattle = {$: 3};
var $author$project$Main$MFSImg = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {$: 0, a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Main$MFSImgWithPos = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return {$: 1, a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j, k: k, l: l, m: m};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Main$MFSInitData = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$MFSUnknown = {$: 4};
var $author$project$Main$andMap = F2(
	function (dec, funDec) {
		return A3($elm$json$Json$Decode$map2, $elm$core$Basics$apL, funDec, dec);
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Main$InitData = F4(
	function (atlas_image_map, min_mni, max_mni, cmaps) {
		return {O: atlas_image_map, cK: cmaps, a2: max_mni, a4: min_mni};
	});
var $author$project$Main$Coords = F3(
	function (x1, x2, x3) {
		return {o: x1, p: x2, q: x3};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$coordDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (l) {
		if (((l.b && l.b.b) && l.b.b.b) && (!l.b.b.b.b)) {
			var x1 = l.a;
			var _v1 = l.b;
			var x2 = _v1.a;
			var _v2 = _v1.b;
			var x3 = _v2.a;
			return $elm$json$Json$Decode$succeed(
				A3($author$project$Main$Coords, x1, x2, x3));
		} else {
			return $elm$json$Json$Decode$fail('cant decode value as Coords');
		}
	},
	$elm$json$Json$Decode$list($elm$json$Json$Decode$int));
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $author$project$Main$dictOfMaybesToMaybeOfDict = function (dict) {
	return A3(
		$elm$core$Dict$foldl,
		F3(
			function (key, mbVal, mbRes) {
				var _v0 = _Utils_Tuple2(mbVal, mbRes);
				if ((!_v0.a.$) && (!_v0.b.$)) {
					var val = _v0.a.a;
					var res = _v0.b.a;
					return $elm$core$Maybe$Just(
						A3($elm$core$Dict$insert, key, val, res));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}),
		$elm$core$Maybe$Just($elm$core$Dict$empty),
		dict);
};
var $mathiajusth$nonempty_dict$Dict$Nonempty$NonemptyDict = $elm$core$Basics$identity;
var $mathiajusth$nonempty_dict$Dict$Nonempty$fromList = F2(
	function (_v0, list) {
		var guaranteedK = _v0.a;
		var guaranteedV = _v0.b;
		return _Utils_Tuple2(
			_Utils_Tuple2(guaranteedK, guaranteedV),
			A3(
				$elm$core$Dict$insert,
				guaranteedK,
				guaranteedV,
				$elm$core$Dict$fromList(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(guaranteedK, guaranteedV),
						list))));
	});
var $mgold$elm_nonempty_list$List$Nonempty$Nonempty = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mgold$elm_nonempty_list$List$Nonempty$fromList = function (ys) {
	if (ys.b) {
		var x = ys.a;
		var xs = ys.b;
		return $elm$core$Maybe$Just(
			A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$Main$decodeAtlasImageMap = function () {
	var outerDictToNonEmpty = function (outer_dict) {
		return function (elems) {
			if (elems.b) {
				var head = elems.a;
				var tail = elems.b;
				return $elm$json$Json$Decode$succeed(
					A2($mathiajusth$nonempty_dict$Dict$Nonempty$fromList, head, tail));
			} else {
				return $elm$json$Json$Decode$fail('No atlas received');
			}
		}(
			$elm$core$Dict$toList(outer_dict));
	};
	var innerDictToNonEmpty = function (outer_dict) {
		return function (mbData) {
			if (!mbData.$) {
				var data = mbData.a;
				return $elm$json$Json$Decode$succeed(data);
			} else {
				return $elm$json$Json$Decode$fail('error decoding atlas-image-map');
			}
		}(
			$author$project$Main$dictOfMaybesToMaybeOfDict(
				A2(
					$elm$core$Dict$map,
					F2(
						function (_v0, val) {
							return $mgold$elm_nonempty_list$List$Nonempty$fromList(val);
						}),
					outer_dict)));
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		outerDictToNonEmpty,
		A2(
			$elm$json$Json$Decode$andThen,
			innerDictToNonEmpty,
			$elm$json$Json$Decode$dict(
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string))));
}();
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Main$initDataDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$InitData,
	A2($elm$json$Json$Decode$field, 'atlas_image_map', $author$project$Main$decodeAtlasImageMap),
	A2($elm$json$Json$Decode$field, 'min_mni', $author$project$Main$coordDecoder),
	A2($elm$json$Json$Decode$field, 'max_mni', $author$project$Main$coordDecoder),
	A2(
		$elm$json$Json$Decode$field,
		'cmaps',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Main$MatrixBundle = function (region) {
	return {ah: region};
};
var $author$project$Main$MatrixSlice = function (axis) {
	return function (index) {
		return function (values) {
			return function (rawValues) {
				return function (vrange) {
					return function (cmap) {
						return function (showLabels) {
							return function (netBoundaries) {
								return function (netBoundariesY) {
									return function (netLabels) {
										return function (netLabelsFull) {
											return function (netLabelsY) {
												return function (netLabelsFullY) {
													return function (netMembers) {
														return function (netMemberIndices) {
															return function (showRegionLabels) {
																return function (showNetworkLabels) {
																	return function (xLabels) {
																		return function (yLabels) {
																			return function (xShortLabels) {
																				return function (yShortLabels) {
																					return function (xIds) {
																						return function (yIds) {
																							return function (xCenters) {
																								return function (yCenters) {
																									return function (xNets) {
																										return function (yNets) {
																											return function (xNetsFull) {
																												return function (yNetsFull) {
																													return function (selectedRowId) {
																														return function (selectedColId) {
																															return function (xDlim) {
																																return function (yDlim) {
																																	return function (xLabelRaw) {
																																		return function (yLabelRaw) {
																																			return {at: axis, w: cmap, bF: index, az: netBoundaries, aA: netBoundariesY, bO: netLabels, bP: netLabelsFull, bQ: netLabelsFullY, bR: netLabelsY, bS: netMemberIndices, bT: netMembers, b4: rawValues, cb: selectedColId, cc: selectedRowId, cd: showLabels, aH: showNetworkLabels, ce: showRegionLabels, am: values, f: vrange, an: xCenters, cp: xDlim, aa: xIds, cq: xLabelRaw, ao: xLabels, aK: xNets, aL: xNetsFull, ap: xShortLabels, aq: yCenters, cu: yDlim, ab: yIds, cv: yLabelRaw, ar: yLabels, aM: yNets, aN: yNetsFull, as: yShortLabels};
																																		};
																																	};
																																};
																															};
																														};
																													};
																												};
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $author$project$Main$maybeHighLowDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (vals) {
		if ((vals.b && vals.b.b) && (!vals.b.b.b)) {
			var low = vals.a;
			var _v1 = vals.b;
			var high = _v1.a;
			return $elm$json$Json$Decode$succeed(
				A2($author$project$Main$MaybeHighLowPair, low, high));
		} else {
			return $elm$json$Json$Decode$fail('expected [low, high] for vrange');
		}
	},
	$elm$json$Json$Decode$list(
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$float)));
var $author$project$Main$matrixDecoder = A2(
	$author$project$Main$andMap,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'ylabel',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	A2(
		$author$project$Main$andMap,
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$field,
					'xlabel',
					$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
					$elm$json$Json$Decode$succeed(_List_Nil)
				])),
		A2(
			$author$project$Main$andMap,
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$json$Json$Decode$field,
						'ydlim',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
						$elm$json$Json$Decode$succeed(_List_Nil)
					])),
			A2(
				$author$project$Main$andMap,
				$elm$json$Json$Decode$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$json$Json$Decode$field,
							'xdlim',
							$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
							$elm$json$Json$Decode$succeed(_List_Nil)
						])),
				A2(
					$author$project$Main$andMap,
					A2($elm$json$Json$Decode$field, 'selected_col_id', $elm$json$Json$Decode$int),
					A2(
						$author$project$Main$andMap,
						A2($elm$json$Json$Decode$field, 'selected_row_id', $elm$json$Json$Decode$int),
						A2(
							$author$project$Main$andMap,
							$elm$json$Json$Decode$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$json$Json$Decode$field,
										'y_nets_full',
										$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
										$elm$json$Json$Decode$succeed(_List_Nil)
									])),
							A2(
								$author$project$Main$andMap,
								$elm$json$Json$Decode$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$json$Json$Decode$field,
											'x_nets_full',
											$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
											$elm$json$Json$Decode$succeed(_List_Nil)
										])),
								A2(
									$author$project$Main$andMap,
									$elm$json$Json$Decode$oneOf(
										_List_fromArray(
											[
												A2(
												$elm$json$Json$Decode$field,
												'y_nets',
												$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
												$elm$json$Json$Decode$succeed(_List_Nil)
											])),
									A2(
										$author$project$Main$andMap,
										$elm$json$Json$Decode$oneOf(
											_List_fromArray(
												[
													A2(
													$elm$json$Json$Decode$field,
													'x_nets',
													$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
													$elm$json$Json$Decode$succeed(_List_Nil)
												])),
										A2(
											$author$project$Main$andMap,
											A2(
												$elm$json$Json$Decode$field,
												'y_centers',
												$elm$json$Json$Decode$list(
													$elm$json$Json$Decode$list($elm$json$Json$Decode$float))),
											A2(
												$author$project$Main$andMap,
												A2(
													$elm$json$Json$Decode$field,
													'x_centers',
													$elm$json$Json$Decode$list(
														$elm$json$Json$Decode$list($elm$json$Json$Decode$float))),
												A2(
													$author$project$Main$andMap,
													A2(
														$elm$json$Json$Decode$field,
														'y_ids',
														$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
													A2(
														$author$project$Main$andMap,
														A2(
															$elm$json$Json$Decode$field,
															'x_ids',
															$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
														A2(
															$author$project$Main$andMap,
															A2(
																$elm$json$Json$Decode$field,
																'y_short_labels',
																$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
															A2(
																$author$project$Main$andMap,
																A2(
																	$elm$json$Json$Decode$field,
																	'x_short_labels',
																	$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
																A2(
																	$author$project$Main$andMap,
																	A2(
																		$elm$json$Json$Decode$field,
																		'y_labels',
																		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
																	A2(
																		$author$project$Main$andMap,
																		A2(
																			$elm$json$Json$Decode$field,
																			'x_labels',
																			$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
																		A2(
																			$author$project$Main$andMap,
																			$elm$json$Json$Decode$oneOf(
																				_List_fromArray(
																					[
																						A2($elm$json$Json$Decode$field, 'show_network_labels', $elm$json$Json$Decode$bool),
																						$elm$json$Json$Decode$succeed(true)
																					])),
																			A2(
																				$author$project$Main$andMap,
																				$elm$json$Json$Decode$oneOf(
																					_List_fromArray(
																						[
																							A2($elm$json$Json$Decode$field, 'show_region_labels', $elm$json$Json$Decode$bool),
																							$elm$json$Json$Decode$succeed(true)
																						])),
																				A2(
																					$author$project$Main$andMap,
																					$elm$json$Json$Decode$oneOf(
																						_List_fromArray(
																							[
																								A2(
																								$elm$json$Json$Decode$field,
																								'net_member_indices',
																								$elm$json$Json$Decode$list(
																									$elm$json$Json$Decode$list($elm$json$Json$Decode$int))),
																								$elm$json$Json$Decode$succeed(_List_Nil)
																							])),
																					A2(
																						$author$project$Main$andMap,
																						$elm$json$Json$Decode$oneOf(
																							_List_fromArray(
																								[
																									A2(
																									$elm$json$Json$Decode$field,
																									'net_members',
																									$elm$json$Json$Decode$list(
																										$elm$json$Json$Decode$list($elm$json$Json$Decode$int))),
																									$elm$json$Json$Decode$succeed(_List_Nil)
																								])),
																						A2(
																							$author$project$Main$andMap,
																							$elm$json$Json$Decode$oneOf(
																								_List_fromArray(
																									[
																										A2(
																										$elm$json$Json$Decode$field,
																										'net_labels_full_y',
																										$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
																										$elm$json$Json$Decode$succeed(_List_Nil)
																									])),
																							A2(
																								$author$project$Main$andMap,
																								$elm$json$Json$Decode$oneOf(
																									_List_fromArray(
																										[
																											A2(
																											$elm$json$Json$Decode$field,
																											'net_labels_y',
																											$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
																											$elm$json$Json$Decode$succeed(_List_Nil)
																										])),
																								A2(
																									$author$project$Main$andMap,
																									$elm$json$Json$Decode$oneOf(
																										_List_fromArray(
																											[
																												A2(
																												$elm$json$Json$Decode$field,
																												'net_labels_full',
																												$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
																												$elm$json$Json$Decode$succeed(_List_Nil)
																											])),
																									A2(
																										$author$project$Main$andMap,
																										$elm$json$Json$Decode$oneOf(
																											_List_fromArray(
																												[
																													A2(
																													$elm$json$Json$Decode$field,
																													'net_labels',
																													$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
																													$elm$json$Json$Decode$succeed(_List_Nil)
																												])),
																										A2(
																											$author$project$Main$andMap,
																											$elm$json$Json$Decode$oneOf(
																												_List_fromArray(
																													[
																														A2(
																														$elm$json$Json$Decode$field,
																														'net_boundaries_y',
																														$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
																														$elm$json$Json$Decode$succeed(_List_Nil)
																													])),
																											A2(
																												$author$project$Main$andMap,
																												$elm$json$Json$Decode$oneOf(
																													_List_fromArray(
																														[
																															A2(
																															$elm$json$Json$Decode$field,
																															'net_boundaries',
																															$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
																															$elm$json$Json$Decode$succeed(_List_Nil)
																														])),
																												A2(
																													$author$project$Main$andMap,
																													$elm$json$Json$Decode$oneOf(
																														_List_fromArray(
																															[
																																A2($elm$json$Json$Decode$field, 'show_labels', $elm$json$Json$Decode$bool),
																																$elm$json$Json$Decode$succeed(true)
																															])),
																													A2(
																														$author$project$Main$andMap,
																														A2($elm$json$Json$Decode$field, 'cmap', $elm$json$Json$Decode$string),
																														A2(
																															$author$project$Main$andMap,
																															A2($elm$json$Json$Decode$field, 'vrange', $author$project$Main$maybeHighLowDecoder),
																															A2(
																																$author$project$Main$andMap,
																																$elm$json$Json$Decode$oneOf(
																																	_List_fromArray(
																																		[
																																			A2(
																																			$elm$json$Json$Decode$field,
																																			'raw_values',
																																			$elm$json$Json$Decode$list(
																																				$elm$json$Json$Decode$list(
																																					$elm$json$Json$Decode$nullable($elm$json$Json$Decode$float)))),
																																			$elm$json$Json$Decode$succeed(_List_Nil)
																																		])),
																																A2(
																																	$author$project$Main$andMap,
																																	A2(
																																		$elm$json$Json$Decode$field,
																																		'values',
																																		$elm$json$Json$Decode$list(
																																			$elm$json$Json$Decode$list(
																																				$elm$json$Json$Decode$nullable($elm$json$Json$Decode$float)))),
																																	A2(
																																		$author$project$Main$andMap,
																																		A2($elm$json$Json$Decode$field, 'index', $elm$json$Json$Decode$int),
																																		A2(
																																			$author$project$Main$andMap,
																																			A2($elm$json$Json$Decode$field, 'axis', $elm$json$Json$Decode$string),
																																			$elm$json$Json$Decode$succeed($author$project$Main$MatrixSlice))))))))))))))))))))))))))))))))))));
var $author$project$Main$matrixBundleDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$map,
			$author$project$Main$MatrixBundle,
			A2($elm$json$Json$Decode$field, 'region', $author$project$Main$matrixDecoder)),
			A2($elm$json$Json$Decode$map, $author$project$Main$MatrixBundle, $author$project$Main$matrixDecoder)
		]));
var $author$project$Main$maybeCoordDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (l) {
		if (((l.b && l.b.b) && l.b.b.b) && (!l.b.b.b.b)) {
			var x1 = l.a;
			var _v1 = l.b;
			var x2 = _v1.a;
			var _v2 = _v1.b;
			var x3 = _v2.a;
			return $elm$json$Json$Decode$succeed(
				A3(
					$author$project$Main$MaybeCoords,
					$elm$core$Maybe$Just(x1),
					$elm$core$Maybe$Just(x2),
					$elm$core$Maybe$Just(x3)));
		} else {
			return $elm$json$Json$Decode$fail('cant decode value as MaybeCoords');
		}
	},
	$elm$json$Json$Decode$list($elm$json$Json$Decode$int));
var $author$project$Main$rangeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (l) {
		if ((l.b && l.b.b) && (!l.b.b.b)) {
			var low = l.a;
			var _v1 = l.b;
			var high = _v1.a;
			return $elm$json$Json$Decode$succeed(
				A2($author$project$Main$MaybeHighLowPair, low, high));
		} else {
			return $elm$json$Json$Decode$fail('Expected range [low, high]');
		}
	},
	$elm$json$Json$Decode$list(
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$float)));
var $author$project$Main$RegionLabel = F2(
	function (vol, name) {
		return {R: name, cn: vol};
	});
var $author$project$Main$regionLabelDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (l) {
		if ((l.b && l.b.b) && (!l.b.b.b)) {
			var vol = l.a;
			var _v1 = l.b;
			var name = _v1.a;
			return $elm$json$Json$Decode$succeed(
				A2($author$project$Main$RegionLabel, vol, name));
		} else {
			return $elm$json$Json$Decode$fail('Can\'t build a RegionLabel from this');
		}
	},
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
var $author$project$Main$decodeServerMsg = function (msg) {
	var decoder = A2(
		$elm$json$Json$Decode$andThen,
		function (t) {
			switch (t) {
				case 'Img':
					return A2(
						$author$project$Main$andMap,
						$elm$json$Json$Decode$maybe(
							A2($elm$json$Json$Decode$field, 'vrange_r', $author$project$Main$rangeDecoder)),
						A2(
							$author$project$Main$andMap,
							$elm$json$Json$Decode$maybe(
								A2($elm$json$Json$Decode$field, 'vrange_l', $author$project$Main$rangeDecoder)),
							A2(
								$author$project$Main$andMap,
								A2(
									$elm$json$Json$Decode$field,
									'color_r',
									$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
								A2(
									$author$project$Main$andMap,
									A2(
										$elm$json$Json$Decode$field,
										'color_l',
										$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
									A2(
										$author$project$Main$andMap,
										A2(
											$elm$json$Json$Decode$field,
											'value_r',
											$elm$json$Json$Decode$maybe($elm$json$Json$Decode$float)),
										A2(
											$author$project$Main$andMap,
											A2(
												$elm$json$Json$Decode$field,
												'value_l',
												$elm$json$Json$Decode$maybe($elm$json$Json$Decode$float)),
											A2(
												$author$project$Main$andMap,
												$elm$json$Json$Decode$maybe(
													A2($elm$json$Json$Decode$field, 'matrix', $author$project$Main$matrixBundleDecoder)),
												A2(
													$author$project$Main$andMap,
													A2(
														$elm$json$Json$Decode$field,
														'label_r',
														$elm$json$Json$Decode$maybe($author$project$Main$regionLabelDecoder)),
													A2(
														$author$project$Main$andMap,
														A2(
															$elm$json$Json$Decode$field,
															'label_l',
															$elm$json$Json$Decode$maybe($author$project$Main$regionLabelDecoder)),
														A2(
															$author$project$Main$andMap,
															A2($elm$json$Json$Decode$field, 'val', $elm$json$Json$Decode$string),
															$elm$json$Json$Decode$succeed($author$project$Main$MFSImg)))))))))));
				case 'ImgWithCoord':
					return A2(
						$author$project$Main$andMap,
						$elm$json$Json$Decode$maybe(
							A2($elm$json$Json$Decode$field, 'vrange_r', $author$project$Main$rangeDecoder)),
						A2(
							$author$project$Main$andMap,
							$elm$json$Json$Decode$maybe(
								A2($elm$json$Json$Decode$field, 'vrange_l', $author$project$Main$rangeDecoder)),
							A2(
								$author$project$Main$andMap,
								A2(
									$elm$json$Json$Decode$field,
									'color_r',
									$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
								A2(
									$author$project$Main$andMap,
									A2(
										$elm$json$Json$Decode$field,
										'color_l',
										$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
									A2(
										$author$project$Main$andMap,
										A2(
											$elm$json$Json$Decode$field,
											'value_r',
											$elm$json$Json$Decode$maybe($elm$json$Json$Decode$float)),
										A2(
											$author$project$Main$andMap,
											A2(
												$elm$json$Json$Decode$field,
												'value_l',
												$elm$json$Json$Decode$maybe($elm$json$Json$Decode$float)),
											A2(
												$author$project$Main$andMap,
												$elm$json$Json$Decode$maybe(
													A2($elm$json$Json$Decode$field, 'matrix', $author$project$Main$matrixBundleDecoder)),
												A2(
													$author$project$Main$andMap,
													A2($elm$json$Json$Decode$field, 'idx_4d', $elm$json$Json$Decode$int),
													A2(
														$author$project$Main$andMap,
														A2($elm$json$Json$Decode$field, 'coords_r', $author$project$Main$maybeCoordDecoder),
														A2(
															$author$project$Main$andMap,
															A2($elm$json$Json$Decode$field, 'coords_l', $author$project$Main$maybeCoordDecoder),
															A2(
																$author$project$Main$andMap,
																A2(
																	$elm$json$Json$Decode$field,
																	'label_r',
																	$elm$json$Json$Decode$maybe($author$project$Main$regionLabelDecoder)),
																A2(
																	$author$project$Main$andMap,
																	A2(
																		$elm$json$Json$Decode$field,
																		'label_l',
																		$elm$json$Json$Decode$maybe($author$project$Main$regionLabelDecoder)),
																	A2(
																		$author$project$Main$andMap,
																		A2($elm$json$Json$Decode$field, 'val', $elm$json$Json$Decode$string),
																		$elm$json$Json$Decode$succeed($author$project$Main$MFSImgWithPos))))))))))))));
				case 'InitData':
					return A2($elm$json$Json$Decode$map, $author$project$Main$MFSInitData, $author$project$Main$initDataDecoder);
				case 'DeathRattle':
					return $elm$json$Json$Decode$succeed($author$project$Main$MFSDeathRattle);
				case 'UnknownMsg':
					return $elm$json$Json$Decode$succeed($author$project$Main$MFSUnknown);
				default:
					return $elm$json$Json$Decode$fail('can\'t decode Message from Server');
			}
		},
		A2($elm$json$Json$Decode$field, 'mtype', $elm$json$Json$Decode$string));
	return A2($elm$json$Json$Decode$decodeString, decoder, msg);
};
var $author$project$Main$errorStateFromDecoding = F2(
	function (decodeErr, msg) {
		var res = $author$project$Main$Error(
			'Couldn\'t decode this message:\n' + (msg + ('This was the error:\n' + $elm$json$Json$Decode$errorToString(decodeErr))));
		return _Utils_Tuple2(res, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$getMatrixCmap = function (rtData) {
	return rtData.a.w;
};
var $mgold$elm_nonempty_list$List$Nonempty$head = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return x;
};
var $author$project$Main$hemisphereFromString = function (s) {
	var _v0 = $elm$core$String$toLower(s);
	switch (_v0) {
		case 'left':
			return 1;
		case 'right':
			return 2;
		default:
			return 0;
	}
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Main$mergeRanges = F2(
	function (existing, incoming) {
		var minMaybe = F2(
			function (a, b) {
				var _v3 = _Utils_Tuple2(a, b);
				if (!_v3.a.$) {
					if (!_v3.b.$) {
						var x = _v3.a.a;
						var y = _v3.b.a;
						return $elm$core$Maybe$Just(
							A2($elm$core$Basics$min, x, y));
					} else {
						var x = _v3.a.a;
						var _v4 = _v3.b;
						return $elm$core$Maybe$Just(x);
					}
				} else {
					if (!_v3.b.$) {
						var _v5 = _v3.a;
						var y = _v3.b.a;
						return $elm$core$Maybe$Just(y);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			});
		var maxMaybe = F2(
			function (a, b) {
				var _v0 = _Utils_Tuple2(a, b);
				if (!_v0.a.$) {
					if (!_v0.b.$) {
						var x = _v0.a.a;
						var y = _v0.b.a;
						return $elm$core$Maybe$Just(
							A2($elm$core$Basics$max, x, y));
					} else {
						var x = _v0.a.a;
						var _v1 = _v0.b;
						return $elm$core$Maybe$Just(x);
					}
				} else {
					if (!_v0.b.$) {
						var _v2 = _v0.a;
						var y = _v0.b.a;
						return $elm$core$Maybe$Just(y);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			});
		return A2(
			$author$project$Main$MaybeHighLowPair,
			A2(minMaybe, existing.c, incoming.c),
			A2(maxMaybe, existing.b, incoming.b));
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$matrixBundleRange = function (bundle) {
	var sliceRange = function (slice) {
		return function (vals) {
			if (!vals.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var minVal = A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$List$minimum(vals));
				var maxVal = A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$List$maximum(vals));
				return $elm$core$Maybe$Just(
					A2(
						$author$project$Main$MaybeHighLowPair,
						$elm$core$Maybe$Just(minVal),
						$elm$core$Maybe$Just(maxVal)));
			}
		}(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				$elm$core$List$concat(slice.am)));
	};
	var regionR = sliceRange(bundle.ah);
	var combineRange = F2(
		function (r1, r2) {
			var _v0 = _Utils_Tuple2(r1, r2);
			if (!_v0.a.$) {
				if (!_v0.b.$) {
					var a = _v0.a.a;
					var b = _v0.b.a;
					return $elm$core$Maybe$Just(
						A2($author$project$Main$mergeRanges, a, b));
				} else {
					var a = _v0.a.a;
					var _v1 = _v0.b;
					return $elm$core$Maybe$Just(a);
				}
			} else {
				if (!_v0.b.$) {
					var _v2 = _v0.a;
					var b = _v0.b.a;
					return $elm$core$Maybe$Just(b);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		});
	return regionR;
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$encodeMaybeFloat = function (mbVal) {
	if (!mbVal.$) {
		var v = mbVal.a;
		return $elm$json$Json$Encode$float(v);
	} else {
		return $elm$json$Json$Encode$null;
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Main$encodeMatrixValues = function (rows) {
	return A2(
		$elm$json$Json$Encode$list,
		$elm$json$Json$Encode$list($author$project$Main$encodeMaybeFloat),
		rows);
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Main$encodeMaybeHighLow = function (_v0) {
	var low = _v0.c;
	var high = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'low',
				$author$project$Main$encodeMaybeFloat(low)),
				_Utils_Tuple2(
				'high',
				$author$project$Main$encodeMaybeFloat(high))
			]));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Main$encodeMatrixSlice = F4(
	function (fixedRange, labelsOn, focusRange, slice) {
		var vrangeOverride = function () {
			var _v8 = _Utils_Tuple2(fixedRange.c, fixedRange.b);
			if ((!_v8.a.$) && (!_v8.b.$)) {
				return fixedRange;
			} else {
				return A2($author$project$Main$MaybeHighLowPair, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
			}
		}();
		var showRegionLabels = labelsOn && (slice.cd && slice.ce);
		var showNetworkLabels = labelsOn && slice.aH;
		var rows = $elm$core$List$length(slice.ab);
		var isNetwork = slice.at === 'networks';
		var cols = $elm$core$List$length(slice.aa);
		var clampRange = F2(
			function (total, _v7) {
				var lo = _v7.a;
				var hi = _v7.b;
				var l = A2($elm$core$Basics$max, 0, lo);
				var h = A2($elm$core$Basics$min, total, hi);
				return ((h - l) <= 0) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
					_Utils_Tuple2(l, h));
			});
		var focusVals = function () {
			if (isNetwork) {
				return $elm$core$Maybe$Nothing;
			} else {
				if (!focusRange.$) {
					var _v1 = focusRange.a;
					var _v2 = _v1.a;
					var ys = _v2.a;
					var ye = _v2.b;
					var _v3 = _v1.b;
					var xs = _v3.a;
					var xe = _v3.b;
					var yClamp = A2(
						clampRange,
						rows,
						_Utils_Tuple2(ys, ye));
					var xClamp = A2(
						clampRange,
						cols,
						_Utils_Tuple2(xs, xe));
					var _v4 = _Utils_Tuple2(yClamp, xClamp);
					if ((!_v4.a.$) && (!_v4.b.$)) {
						var _v5 = _v4.a.a;
						var ys1 = _v5.a;
						var ye1 = _v5.b;
						var _v6 = _v4.b.a;
						var xs1 = _v6.a;
						var xe1 = _v6.b;
						return $elm$core$Maybe$Just(
							{cr: xe1, cs: xs1, cw: ye1, cy: ys1});
					} else {
						return $elm$core$Maybe$Nothing;
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}();
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'targetId',
					$elm$json$Json$Encode$string('matrix-plot')),
					_Utils_Tuple2(
					'axis',
					$elm$json$Json$Encode$string(slice.at)),
					_Utils_Tuple2(
					'index',
					$elm$json$Json$Encode$int(slice.bF)),
					_Utils_Tuple2(
					'values',
					$author$project$Main$encodeMatrixValues(slice.am)),
					_Utils_Tuple2(
					'raw_values',
					$author$project$Main$encodeMatrixValues(slice.b4)),
					_Utils_Tuple2(
					'vrange',
					$author$project$Main$encodeMaybeHighLow(vrangeOverride)),
					_Utils_Tuple2(
					'cmap',
					$elm$json$Json$Encode$string(slice.w)),
					_Utils_Tuple2(
					'showLabels',
					$elm$json$Json$Encode$bool(labelsOn)),
					_Utils_Tuple2(
					'showRegionLabels',
					$elm$json$Json$Encode$bool(showRegionLabels)),
					_Utils_Tuple2(
					'showNetworkLabels',
					$elm$json$Json$Encode$bool(showNetworkLabels)),
					_Utils_Tuple2(
					'net_boundaries',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, slice.az)),
					_Utils_Tuple2(
					'net_boundaries_y',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, slice.aA)),
					_Utils_Tuple2(
					'net_labels',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.bO)),
					_Utils_Tuple2(
					'net_labels_full',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.bP)),
					_Utils_Tuple2(
					'net_labels_y',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.bR)),
					_Utils_Tuple2(
					'net_labels_full_y',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.bQ)),
					_Utils_Tuple2(
					'net_members',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$list($elm$json$Json$Encode$int),
						slice.bT)),
					_Utils_Tuple2(
					'net_member_indices',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$list($elm$json$Json$Encode$int),
						slice.bS)),
					_Utils_Tuple2(
					'xFocusStart',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$int(-1),
						A2(
							$elm$core$Maybe$map,
							function (f) {
								return $elm$json$Json$Encode$int(f.cs);
							},
							focusVals))),
					_Utils_Tuple2(
					'xFocusEnd',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$int(-1),
						A2(
							$elm$core$Maybe$map,
							function (f) {
								return $elm$json$Json$Encode$int(f.cr);
							},
							focusVals))),
					_Utils_Tuple2(
					'yFocusStart',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$int(-1),
						A2(
							$elm$core$Maybe$map,
							function (f) {
								return $elm$json$Json$Encode$int(f.cy);
							},
							focusVals))),
					_Utils_Tuple2(
					'yFocusEnd',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$int(-1),
						A2(
							$elm$core$Maybe$map,
							function (f) {
								return $elm$json$Json$Encode$int(f.cw);
							},
							focusVals))),
					_Utils_Tuple2(
					'xLabels',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.ao)),
					_Utils_Tuple2(
					'yLabels',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.ar)),
					_Utils_Tuple2(
					'xShortLabels',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.ap)),
					_Utils_Tuple2(
					'yShortLabels',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.as)),
					_Utils_Tuple2(
					'xIds',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, slice.aa)),
					_Utils_Tuple2(
					'yIds',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, slice.ab)),
					_Utils_Tuple2(
					'xCenters',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$list($elm$json$Json$Encode$float),
						slice.an)),
					_Utils_Tuple2(
					'yCenters',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$list($elm$json$Json$Encode$float),
						slice.aq)),
					_Utils_Tuple2(
					'x_nets',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.aK)),
					_Utils_Tuple2(
					'y_nets',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.aM)),
					_Utils_Tuple2(
					'x_nets_full',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.aL)),
					_Utils_Tuple2(
					'y_nets_full',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.aN)),
					_Utils_Tuple2(
					'selectedRowId',
					$elm$json$Json$Encode$int(slice.cc)),
					_Utils_Tuple2(
					'selectedColId',
					$elm$json$Json$Encode$int(slice.cb)),
					_Utils_Tuple2(
					'xdlim',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, slice.cp)),
					_Utils_Tuple2(
					'ydlim',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, slice.cu)),
					_Utils_Tuple2(
					'xlabel',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.cq)),
					_Utils_Tuple2(
					'ylabel',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, slice.cv)),
					_Utils_Tuple2(
					'showNetBoundaries',
					$elm$json$Json$Encode$bool(true)),
					_Utils_Tuple2(
					'showOverlayTitles',
					$elm$json$Json$Encode$bool(slice.aH))
				]));
	});
var $author$project$Main$renderMatrix = _Platform_outgoingPort('renderMatrix', $elm$core$Basics$identity);
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Main$stringPairToMaybeRange = function (_v0) {
	var low = _v0.c;
	var high = _v0.b;
	return A2(
		$author$project$Main$MaybeHighLowPair,
		$elm$core$String$toFloat(low),
		$elm$core$String$toFloat(high));
};
var $author$project$Main$matrixPortCmd = function (rtData) {
	var _v0 = $author$project$Main$matrixSliceFromBundle(rtData);
	if (_v0.$ === 1) {
		return $elm$core$Platform$Cmd$none;
	} else {
		var slice = _v0.a;
		var overlayRange = $author$project$Main$stringPairToMaybeRange(rtData.a.f);
		var fallbackRange = A2(
			$author$project$Main$MaybeHighLowPair,
			$elm$core$Maybe$Just(-2),
			$elm$core$Maybe$Just(2));
		var fixedRange = function () {
			var _v1 = _Utils_Tuple2(overlayRange.c, overlayRange.b);
			if ((!_v1.a.$) && (!_v1.b.$)) {
				return overlayRange;
			} else {
				var _v2 = _Utils_Tuple2(rtData.s.c, rtData.s.b);
				if ((!_v2.a.$) && (!_v2.b.$)) {
					return rtData.s;
				} else {
					return fallbackRange;
				}
			}
		}();
		return $author$project$Main$renderMatrix(
			A4($author$project$Main$encodeMatrixSlice, fixedRange, rtData.E, rtData.H, slice));
	}
};
var $author$project$Main$MTSGetImgWithClick = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Main$coordsToList = function (_v0) {
	var x1 = _v0.o;
	var x2 = _v0.p;
	var x3 = _v0.q;
	return A2(
		$elm$core$List$map,
		$elm$core$Maybe$withDefault(0),
		_List_fromArray(
			[x1, x2, x3]));
};
var $author$project$Main$encodeHLPair = function (_v0) {
	var low = _v0.c;
	var high = _v0.b;
	var encodeVal = function (x) {
		if (!x.$) {
			var v = x.a;
			return $elm$json$Json$Encode$float(v);
		} else {
			return $elm$json$Json$Encode$null;
		}
	};
	return A2(
		$elm$json$Json$Encode$list,
		$elm$core$Basics$identity,
		_List_fromArray(
			[
				encodeVal(low),
				encodeVal(high)
			]));
};
var $author$project$Main$parseStringHLPair = function (vr) {
	return A2(
		$author$project$Main$MaybeHighLowPair,
		$elm$core$String$toFloat(vr.c),
		$elm$core$String$toFloat(vr.b));
};
var $author$project$Main$encodeSideInfo = function (info) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'coords',
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$int,
					$author$project$Main$coordsToList(
						$author$project$Main$parseCoords(info.j)))),
				_Utils_Tuple2(
				'vrange',
				$author$project$Main$encodeHLPair(
					$author$project$Main$parseStringHLPair(info.f))),
				_Utils_Tuple2(
				'threshold',
				$author$project$Main$encodeHLPair(
					$author$project$Main$parseStringHLPair(info.v))),
				_Utils_Tuple2(
				'smoothed',
				$elm$json$Json$Encode$bool(info.cg)),
				_Utils_Tuple2(
				'cmap',
				$elm$json$Json$Encode$string(info.w))
			]));
};
var $author$project$Main$reqDefaultFields = function (req) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'atlas_name',
			$elm$json$Json$Encode$string(req.bq)),
			_Utils_Tuple2(
			'img_name',
			$elm$json$Json$Encode$string(req.bE)),
			_Utils_Tuple2(
			'idx_4d',
			$elm$json$Json$Encode$int(req.r)),
			_Utils_Tuple2(
			'infos_l',
			$author$project$Main$encodeSideInfo(req.bG)),
			_Utils_Tuple2(
			'infos_r',
			$author$project$Main$encodeSideInfo(req.bH))
		]);
};
var $author$project$Main$encodeGetImgReq = function (req) {
	return $elm$json$Json$Encode$object(
		A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'mtype',
				$elm$json$Json$Encode$string('GetImg')),
			$author$project$Main$reqDefaultFields(req)));
};
var $author$project$Main$encodePos = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				$elm$json$Json$Encode$float(x)),
				_Utils_Tuple2(
				'y',
				$elm$json$Json$Encode$float(y))
			]));
};
var $author$project$Main$encodeGetImgReqWithPos = F3(
	function (req, pos, ctrlIsHeld) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'mtype',
					$elm$json$Json$Encode$string('GetImgWithPos')),
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						'pos',
						$author$project$Main$encodePos(pos)),
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							'ctrl',
							$elm$json$Json$Encode$bool(ctrlIsHeld)),
						$author$project$Main$reqDefaultFields(req)))));
	});
var $author$project$Main$mkArglessJsonMsg = function (mtype) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'mtype',
				$elm$json$Json$Encode$string(mtype))
			]));
};
var $author$project$Main$msgToServerToValue = function (msg) {
	switch (msg.$) {
		case 2:
			return $author$project$Main$mkArglessJsonMsg('GetInitData');
		case 0:
			var req = msg.a;
			return $author$project$Main$encodeGetImgReq(req);
		default:
			var reqData = msg.a;
			var pos = msg.b;
			var ctrlIsHeld = msg.c;
			return A3($author$project$Main$encodeGetImgReqWithPos, reqData, pos, ctrlIsHeld);
	}
};
var $author$project$Main$encodeMsgToServer = A2(
	$elm$core$Basics$composeR,
	$author$project$Main$msgToServerToValue,
	$elm$json$Json$Encode$encode(0));
var $author$project$Main$sendMessage = _Platform_outgoingPort('sendMessage', $elm$json$Json$Encode$string);
var $author$project$Main$GetImageData = F5(
	function (atlasName, imgName, idx4d, infosL, infosR) {
		return {bq: atlasName, r: idx4d, bE: imgName, bG: infosL, bH: infosR};
	});
var $author$project$Main$toImgRequest = function (rtData) {
	return A5($author$project$Main$GetImageData, rtData.W, rtData.P, rtData.r, rtData.d, rtData.a);
};
var $author$project$Main$requestFromClick = F3(
	function (rtData, pos, ctrlIsHeld) {
		var data = $author$project$Main$toImgRequest(rtData);
		return $author$project$Main$sendMessage(
			$author$project$Main$encodeMsgToServer(
				A3($author$project$Main$MTSGetImgWithClick, data, pos, ctrlIsHeld)));
	});
var $author$project$Main$MTSGetImg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$requestNewImage = function (rtData) {
	return $author$project$Main$sendMessage(
		$author$project$Main$encodeMsgToServer(
			$author$project$Main$MTSGetImg(
				$author$project$Main$toImgRequest(rtData))));
};
var $author$project$Main$clear_overlay = function (sideInfo) {
	return _Utils_update(
		sideInfo,
		{aP: $elm$core$Maybe$Nothing, aw: $elm$core$Maybe$Nothing, aJ: $elm$core$Maybe$Nothing});
};
var $author$project$Main$reset_coords = function (sideInfo) {
	return _Utils_update(
		sideInfo,
		{
			j: A3($author$project$Main$StringCoords, '0', '0', '0')
		});
};
var $author$project$Main$StringHighLowPair = F2(
	function (low, high) {
		return {b: high, c: low};
	});
var $author$project$Main$reset_vrange = function (sideInfo) {
	return _Utils_update(
		sideInfo,
		{
			v: A2($author$project$Main$StringHighLowPair, '-', '-'),
			f: A2($author$project$Main$StringHighLowPair, '-', '-')
		});
};
var $author$project$Main$reset_side_all = function (sideInfo) {
	return $author$project$Main$clear_overlay(
		$author$project$Main$reset_vrange(
			$author$project$Main$reset_coords(sideInfo)));
};
var $author$project$Main$withColor = F2(
	function (colorVal, sideInfo) {
		return _Utils_update(
			sideInfo,
			{aP: colorVal});
	});
var $author$project$Main$withLabel = F2(
	function (label, sideInfo) {
		return _Utils_update(
			sideInfo,
			{aw: label});
	});
var $author$project$Main$withValue = F2(
	function (value, sideInfo) {
		return _Utils_update(
			sideInfo,
			{aJ: value});
	});
var $author$project$Main$setOverlayInfo = F3(
	function (label, value, color) {
		return A2(
			$elm$core$Basics$composeR,
			$author$project$Main$withLabel(label),
			A2(
				$elm$core$Basics$composeR,
				$author$project$Main$withValue(value),
				$author$project$Main$withColor(color)));
	});
var $author$project$Main$setRangeFromServer = F2(
	function (mbRange, sideInfo) {
		if (mbRange.$ === 1) {
			return sideInfo;
		} else {
			var low = mbRange.a.c;
			var high = mbRange.a.b;
			var toStr = function (v) {
				if (!v.$) {
					var x = v.a;
					return $elm$core$String$fromFloat(x);
				} else {
					return '-';
				}
			};
			return _Utils_update(
				sideInfo,
				{
					f: A2(
						$author$project$Main$StringHighLowPair,
						toStr(low),
						toStr(high))
				});
		}
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Main$toCoordsMaybe = function (l) {
	if (((l.b && l.b.b) && l.b.b.b) && (!l.b.b.b.b)) {
		var x1 = l.a;
		var _v1 = l.b;
		var x2 = _v1.a;
		var _v2 = _v1.b;
		var x3 = _v2.a;
		return $elm$core$Maybe$Just(
			A3(
				$author$project$Main$MaybeCoords,
				$elm$core$Maybe$Just(
					$elm$core$Basics$round(x1)),
				$elm$core$Maybe$Just(
					$elm$core$Basics$round(x2)),
				$elm$core$Maybe$Just(
					$elm$core$Basics$round(x3))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$unexpectedMFS = F2(
	function (currModel, _v0) {
		return _Utils_Tuple2(
			$author$project$Main$Error('Unexpected server message in current state'),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$updateActiveSide = F2(
	function (updFn, data) {
		var _v0 = data.V;
		if (!_v0) {
			return _Utils_update(
				data,
				{
					d: updFn(data.d)
				});
		} else {
			return _Utils_update(
				data,
				{
					a: updFn(data.a)
				});
		}
	});
var $author$project$Main$updateCmap = F2(
	function (val, sideInfo) {
		return _Utils_update(
			sideInfo,
			{w: val});
	});
var $author$project$Main$updateSideCoords = F3(
	function (side, coordsStr, rt) {
		if (!side) {
			return _Utils_update(
				rt,
				{
					d: A2(
						$author$project$Main$updateCoords,
						function (_v1) {
							return coordsStr;
						},
						rt.d)
				});
		} else {
			return _Utils_update(
				rt,
				{
					a: A2(
						$author$project$Main$updateCoords,
						function (_v2) {
							return coordsStr;
						},
						rt.a)
				});
		}
	});
var $author$project$Main$updateRunning = F2(
	function (rtData, ev) {
		switch (ev.$) {
			case 0:
				var msg = ev.a;
				var _v1 = $author$project$Main$decodeServerMsg(msg);
				if (!_v1.$) {
					switch (_v1.a.$) {
						case 0:
							var _v2 = _v1.a;
							var img = _v2.a;
							var left_label = _v2.b;
							var right_label = _v2.c;
							var matrixBundle = _v2.d;
							var value_l = _v2.e;
							var value_r = _v2.f;
							var color_l = _v2.g;
							var color_r = _v2.h;
							var vrange_l = _v2.i;
							var vrange_r = _v2.j;
							var overlayRange = $author$project$Main$stringPairToMaybeRange(rtData.a.f);
							var fallbackRange = A2(
								$author$project$Main$MaybeHighLowPair,
								$elm$core$Maybe$Just(-2),
								$elm$core$Maybe$Just(2));
							var fixedRange = function () {
								var _v3 = _Utils_Tuple2(overlayRange.c, overlayRange.b);
								if ((!_v3.a.$) && (!_v3.b.$)) {
									return overlayRange;
								} else {
									return function (r) {
										var _v4 = _Utils_Tuple2(r.c, r.b);
										if ((!_v4.a.$) && (!_v4.b.$)) {
											return r;
										} else {
											return fallbackRange;
										}
									}(
										A2(
											$elm$core$Maybe$withDefault,
											rtData.s,
											A2($elm$core$Maybe$andThen, $author$project$Main$matrixBundleRange, matrixBundle)));
								}
							}();
							var baseData = _Utils_update(
								rtData,
								{
									Y: img,
									d: A2(
										$author$project$Main$setRangeFromServer,
										vrange_l,
										A4($author$project$Main$setOverlayInfo, left_label, value_l, color_l, rtData.d)),
									a: A2(
										$author$project$Main$setRangeFromServer,
										vrange_r,
										A4($author$project$Main$setOverlayInfo, right_label, value_r, color_r, rtData.a)),
									A: false,
									ae: A2(
										$elm$core$Maybe$map,
										$author$project$Main$applyBundleCmap(
											$author$project$Main$getMatrixCmap(rtData)),
										matrixBundle),
									s: fixedRange,
									E: rtData.E
								});
							var cmds = $elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$matrixPortCmd(baseData)
									]));
							return _Utils_Tuple2(
								$author$project$Main$Running(baseData),
								cmds);
						case 1:
							var _v5 = _v1.a;
							var img = _v5.a;
							var leftLabel = _v5.b;
							var rightLabel = _v5.c;
							var l_coords = _v5.d;
							var r_coords = _v5.e;
							var idx4d = _v5.f;
							var matrixBundle = _v5.g;
							var value_l = _v5.h;
							var value_r = _v5.i;
							var color_l = _v5.j;
							var color_r = _v5.k;
							var vrange_l = _v5.l;
							var vrange_r = _v5.m;
							var overlayRange = $author$project$Main$stringPairToMaybeRange(rtData.a.f);
							var fallbackRange = A2(
								$author$project$Main$MaybeHighLowPair,
								$elm$core$Maybe$Just(-2),
								$elm$core$Maybe$Just(2));
							var fixedRange = function () {
								var _v8 = _Utils_Tuple2(overlayRange.c, overlayRange.b);
								if ((!_v8.a.$) && (!_v8.b.$)) {
									return overlayRange;
								} else {
									return function (r) {
										var _v9 = _Utils_Tuple2(r.c, r.b);
										if ((!_v9.a.$) && (!_v9.b.$)) {
											return r;
										} else {
											return fallbackRange;
										}
									}(
										A2(
											$elm$core$Maybe$withDefault,
											rtData.s,
											A2($elm$core$Maybe$andThen, $author$project$Main$matrixBundleRange, matrixBundle)));
								}
							}();
							var base = _Utils_update(
								rtData,
								{
									r: idx4d,
									Y: img,
									d: A2(
										$author$project$Main$setRangeFromServer,
										vrange_l,
										A4(
											$author$project$Main$setOverlayInfo,
											leftLabel,
											value_l,
											color_l,
											A2(
												$author$project$Main$updateCoords,
												function (_v6) {
													return $author$project$Main$coordsToString(l_coords);
												},
												rtData.d))),
									a: A2(
										$author$project$Main$setRangeFromServer,
										vrange_r,
										A4(
											$author$project$Main$setOverlayInfo,
											rightLabel,
											value_r,
											color_r,
											A2(
												$author$project$Main$updateCoords,
												function (_v7) {
													return $author$project$Main$coordsToString(r_coords);
												},
												rtData.a))),
									A: false,
									ae: A2(
										$elm$core$Maybe$map,
										$author$project$Main$applyBundleCmap(
											$author$project$Main$getMatrixCmap(rtData)),
										matrixBundle),
									s: fixedRange,
									E: rtData.E
								});
							var cmds = $elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$matrixPortCmd(base)
									]));
							return _Utils_Tuple2(
								$author$project$Main$Running(base),
								cmds);
						case 3:
							var _v10 = _v1.a;
							return _Utils_Tuple2(
								$author$project$Main$Error('There was a Server error, please reload the page'),
								$elm$core$Platform$Cmd$none);
						case 4:
							var _v11 = _v1.a;
							return _Utils_Tuple2(
								$author$project$Main$Running(rtData),
								$elm$core$Platform$Cmd$none);
						default:
							var mfs = _v1.a;
							return A2(
								$author$project$Main$unexpectedMFS,
								$author$project$Main$Running(rtData),
								mfs);
					}
				} else {
					var e = _v1.a;
					return A2($author$project$Main$errorStateFromDecoding, e, msg);
				}
			case 1:
				var newAtlas = ev.a;
				var newRtData = $author$project$Main$clearMatrix(
					_Utils_update(
						rtData,
						{
							W: newAtlas,
							P: A2(
								$elm$core$Maybe$withDefault,
								rtData.P,
								A2(
									$elm$core$Maybe$map,
									$mgold$elm_nonempty_list$List$Nonempty$head,
									A2($mathiajusth$nonempty_dict$Dict$Nonempty$get, newAtlas, rtData.K.O))),
							r: 0,
							d: $author$project$Main$reset_side_all(rtData.d),
							a: $author$project$Main$reset_side_all(rtData.a),
							A: true,
							s: A2($author$project$Main$MaybeHighLowPair, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
							E: rtData.E
						}));
				return _Utils_Tuple2(
					$author$project$Main$Running(newRtData),
					$author$project$Main$requestNewImage(newRtData));
			case 2:
				var currentImg = ev.a;
				var newRtData = $author$project$Main$clearMatrix(
					_Utils_update(
						rtData,
						{
							P: currentImg,
							a: $author$project$Main$reset_side_all(rtData.a)
						}));
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							newRtData,
							{A: true})),
					$author$project$Main$requestNewImage(newRtData));
			case 3:
				var newSide = ev.a;
				switch (newSide) {
					case 'Left':
						return _Utils_Tuple2(
							$author$project$Main$Running(
								_Utils_update(
									rtData,
									{V: 0})),
							$elm$core$Platform$Cmd$none);
					case 'Right':
						return _Utils_Tuple2(
							$author$project$Main$Running(
								_Utils_update(
									rtData,
									{V: 1})),
							$elm$core$Platform$Cmd$none);
					default:
						var inval = newSide;
						return _Utils_Tuple2(
							$author$project$Main$Error('Invalid side: ' + inval),
							$elm$core$Platform$Cmd$none);
				}
			case 4:
				var idx = ev.a;
				var val = ev.b;
				return _Utils_Tuple2(
					$author$project$Main$Running(
						A2(
							$author$project$Main$updateActiveSide,
							$author$project$Main$updateCoords(
								A2($author$project$Main$updateCoord, idx, val)),
							rtData)),
					$elm$core$Platform$Cmd$none);
			case 5:
				var idx = ev.a;
				var val = ev.b;
				var updateFn = $author$project$Main$updateActiveSide(
					$author$project$Main$updateVRange(
						A2($author$project$Main$updateHLPairVal, idx, val)));
				var updated = updateFn(rtData);
				var updatedWithMatrixRange = function () {
					if (rtData.V === 1) {
						var range = $author$project$Main$stringPairToMaybeRange(updated.a.f);
						var _v13 = _Utils_Tuple2(range.c, range.b);
						if ((!_v13.a.$) && (!_v13.b.$)) {
							return _Utils_update(
								updated,
								{s: range});
						} else {
							return updated;
						}
					} else {
						return updated;
					}
				}();
				return _Utils_Tuple2(
					$author$project$Main$Running(updatedWithMatrixRange),
					$author$project$Main$matrixPortCmd(updatedWithMatrixRange));
			case 6:
				var idx = ev.a;
				var val = ev.b;
				var updateFn = $author$project$Main$updateActiveSide(
					$author$project$Main$updateThresh(
						A2($author$project$Main$updateHLPairVal, idx, val)));
				return _Utils_Tuple2(
					$author$project$Main$Running(
						updateFn(rtData)),
					$elm$core$Platform$Cmd$none);
			case 7:
				var val = ev.a;
				var newData = $author$project$Main$clearMatrix(
					_Utils_update(
						rtData,
						{
							d: A2($author$project$Main$updateCmap, val, rtData.d)
						}));
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							newData,
							{A: true})),
					$author$project$Main$requestNewImage(newData));
			case 8:
				var val = ev.a;
				var newData = $author$project$Main$clearMatrix(
					_Utils_update(
						rtData,
						{
							a: A2($author$project$Main$updateCmap, val, rtData.a)
						}));
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							newData,
							{A: true})),
					$author$project$Main$requestNewImage(newData));
			case 9:
				if ($author$project$Main$allMniCoordsValid(rtData)) {
					var cleared = $author$project$Main$clearMatrix(rtData);
					return _Utils_Tuple2(
						$author$project$Main$Running(
							_Utils_update(
								cleared,
								{av: false, A: true, H: $elm$core$Maybe$Nothing})),
						$author$project$Main$requestNewImage(cleared));
				} else {
					return _Utils_Tuple2(
						$author$project$Main$Running(
							_Utils_update(
								rtData,
								{av: true})),
						$elm$core$Platform$Cmd$none);
				}
			case 10:
				var click = ev.a;
				var relY = (click.aU <= 0) ? 0 : (click.bX / click.aU);
				var relX = (click.bm <= 0) ? 0 : (click.bW / click.bm);
				var relCoords = _Utils_Tuple2(
					A3($elm$core$Basics$clamp, 0, 1, relX),
					A3($elm$core$Basics$clamp, 0, 1, relY));
				var cleared = $author$project$Main$clearMatrix(rtData);
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							cleared,
							{A: false, H: $elm$core$Maybe$Nothing})),
					A3($author$project$Main$requestFromClick, cleared, relCoords, click.bw));
			case 13:
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							rtData,
							{aI: true})),
					$elm$core$Platform$Cmd$none);
			case 14:
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							rtData,
							{aI: false})),
					$elm$core$Platform$Cmd$none);
			case 19:
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							rtData,
							{H: $elm$core$Maybe$Nothing})),
					$author$project$Main$matrixPortCmd(
						_Utils_update(
							rtData,
							{H: $elm$core$Maybe$Nothing})));
			case 11:
				var req = ev.a;
				if (req.$ === 1) {
					var link = req.a;
					return _Utils_Tuple2(
						$author$project$Main$Running(rtData),
						$elm$browser$Browser$Navigation$load(link));
				} else {
					var link = req.a;
					return _Utils_Tuple2(
						$author$project$Main$Running(rtData),
						$elm$browser$Browser$Navigation$load(
							$elm$url$Url$toString(link)));
				}
			case 15:
				var fieldId = ev.a;
				var val = ev.b;
				var newData = $author$project$Main$clearMatrix(
					A3($author$project$Main$adjustInputValue, fieldId, val, rtData));
				return _Utils_Tuple2(
					$author$project$Main$Running(
						_Utils_update(
							newData,
							{A: true})),
					$author$project$Main$requestNewImage(newData));
			case 16:
				var row = ev.a;
				var col = ev.b;
				var _v15 = $author$project$Main$matrixSliceFromBundle(rtData);
				if (_v15.$ === 1) {
					return _Utils_Tuple2(
						$author$project$Main$Running(rtData),
						$elm$core$Platform$Cmd$none);
				} else {
					var slice = _v15.a;
					var updateCoordsIf = F3(
						function (side, mbCoord, rt) {
							if (mbCoord.$ === 1) {
								return rt;
							} else {
								var c = mbCoord.a;
								return A3(
									$author$project$Main$updateSideCoords,
									side,
									$author$project$Main$coordsToString(c),
									rt);
							}
						});
					var tgtCoord = A2(
						$elm$core$Maybe$andThen,
						$author$project$Main$toCoordsMaybe,
						A2($author$project$Main$getAt, col, slice.an));
					var targetId = A2(
						$elm$core$Maybe$withDefault,
						rtData.r,
						A2($author$project$Main$getAt, col, slice.aa));
					var srcCoord = A2(
						$elm$core$Maybe$andThen,
						$author$project$Main$toCoordsMaybe,
						A2($author$project$Main$getAt, row, slice.aq));
					var sourceId = A2(
						$elm$core$Maybe$withDefault,
						rtData.r,
						A2($author$project$Main$getAt, row, slice.ab));
					var rtWithIds = $author$project$Main$clearMatrix(
						A3(
							updateCoordsIf,
							1,
							tgtCoord,
							A3(
								updateCoordsIf,
								0,
								srcCoord,
								_Utils_update(
									rtData,
									{r: sourceId}))));
					return _Utils_Tuple2(
						$author$project$Main$Running(
							_Utils_update(
								rtWithIds,
								{A: true, H: $elm$core$Maybe$Nothing})),
						$author$project$Main$requestNewImage(
							_Utils_update(
								rtWithIds,
								{H: $elm$core$Maybe$Nothing})));
				}
			case 17:
				var flag = ev.a;
				var newRt = _Utils_update(
					rtData,
					{E: flag});
				return _Utils_Tuple2(
					$author$project$Main$Running(newRt),
					$author$project$Main$matrixPortCmd(newRt));
			case 18:
				var val = ev.a;
				var hemi = $author$project$Main$hemisphereFromString(val);
				var newRt = _Utils_update(
					rtData,
					{ay: hemi});
				return _Utils_Tuple2(
					$author$project$Main$Running(newRt),
					$author$project$Main$matrixPortCmd(newRt));
			default:
				var other = ev;
				return _Utils_Tuple2(
					$author$project$Main$Error('Unexpected event received'),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$RtData = function (initData) {
	return function (img) {
		return function (info_l) {
			return function (info_r) {
				return function (idx4d) {
					return function (activeSide) {
						return function (currentAtlas) {
							return function (currentImg) {
								return function (invalidMniCoord) {
									return function (key) {
										return function (url) {
											return function (showShareDialog) {
												return function (matrixBundle) {
													return function (matrixFixedRange) {
														return function (matrixLabelsOn) {
															return function (matrixFocusRange) {
																return function (matrixHemisphere) {
																	return function (loading) {
																		return {V: activeSide, W: currentAtlas, P: currentImg, r: idx4d, Y: img, d: info_l, a: info_r, K: initData, av: invalidMniCoord, c3: key, A: loading, ae: matrixBundle, s: matrixFixedRange, H: matrixFocusRange, ay: matrixHemisphere, E: matrixLabelsOn, aI: showShareDialog, cl: url};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Main$SideInfo = F8(
	function (coords, vrange, threshold, smoothed, label, value, color, cmap) {
		return {w: cmap, aP: color, j: coords, aw: label, cg: smoothed, v: threshold, aJ: value, f: vrange};
	});
var $author$project$Main$WaitingForFirstImage = F4(
	function (a, b, c, d) {
		return {$: 1, a: a, b: b, c: c, d: d};
	});
var $author$project$Main$defaultSideInfoLeft = A8(
	$author$project$Main$SideInfo,
	A3($author$project$Main$StringCoords, '0', '0', '0'),
	A2($author$project$Main$StringHighLowPair, '-', '-'),
	A2($author$project$Main$StringHighLowPair, '-', '-'),
	true,
	$elm$core$Maybe$Nothing,
	$elm$core$Maybe$Nothing,
	$elm$core$Maybe$Nothing,
	'Set1');
var $author$project$Main$defaultSideInfoRight = A8(
	$author$project$Main$SideInfo,
	A3($author$project$Main$StringCoords, '0', '0', '0'),
	A2($author$project$Main$StringHighLowPair, '-', '-'),
	A2($author$project$Main$StringHighLowPair, '-', '-'),
	true,
	$elm$core$Maybe$Nothing,
	$elm$core$Maybe$Nothing,
	$elm$core$Maybe$Nothing,
	'coolwarm');
var $mathiajusth$nonempty_dict$Dict$Nonempty$head = function (_v0) {
	var _v1 = _v0;
	var guarantee = _v1.a;
	var dictTail = _v1.b;
	return A2(
		$elm$core$Maybe$withDefault,
		guarantee,
		$elm$core$List$head(
			$elm$core$Dict$toList(dictTail)));
};
var $author$project$Main$maybeApplyFixedRangeToRight = F2(
	function (fixed, rt) {
		var _v0 = _Utils_Tuple2(fixed.c, fixed.b);
		if ((!_v0.a.$) && (!_v0.b.$)) {
			var l = _v0.a.a;
			var h = _v0.b.a;
			var newPair = A2(
				$author$project$Main$StringHighLowPair,
				$elm$core$String$fromFloat(l),
				$elm$core$String$fromFloat(h));
			var changed = (!_Utils_eq(newPair, rt.a.f)) || (!_Utils_eq(fixed, rt.s));
			return _Utils_Tuple2(
				_Utils_update(
					rt,
					{s: fixed}),
				changed);
		} else {
			return _Utils_Tuple2(rt, false);
		}
	});
var $author$project$Main$unexpectedEv = F2(
	function (currModel, _v0) {
		return _Utils_Tuple2(
			$author$project$Main$Error('Unexpected event in current state'),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$updateWaitingForFirstImage = F5(
	function (initData, key, url, ev, mbSharedInfos) {
		if (!ev.$) {
			var msg = ev.a;
			var _v1 = $author$project$Main$decodeServerMsg(msg);
			if (!_v1.$) {
				switch (_v1.a.$) {
					case 0:
						var _v2 = _v1.a;
						var img = _v2.a;
						var lLabel = _v2.b;
						var rLabel = _v2.c;
						var matrixBundle = _v2.d;
						var value_l = _v2.e;
						var value_r = _v2.f;
						var color_l = _v2.g;
						var color_r = _v2.h;
						var vrange_l = _v2.i;
						var vrange_r = _v2.j;
						var fixedRange = A2(
							$elm$core$Maybe$withDefault,
							A2($author$project$Main$MaybeHighLowPair, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
							A2($elm$core$Maybe$andThen, $author$project$Main$matrixBundleRange, matrixBundle));
						var _v3 = $mathiajusth$nonempty_dict$Dict$Nonempty$head(initData.O);
						var atlas = _v3.a;
						var images = _v3.b;
						var baseData = function () {
							if (mbSharedInfos.$ === 1) {
								return $author$project$Main$RtData(initData)(img)($author$project$Main$defaultSideInfoLeft)($author$project$Main$defaultSideInfoRight)(0)(0)(atlas)(
									$mgold$elm_nonempty_list$List$Nonempty$head(images))(false)(key)(url)(false)(matrixBundle)(fixedRange)(true)($elm$core$Maybe$Nothing)(0)(false);
							} else {
								var si = mbSharedInfos.a;
								return $author$project$Main$RtData(initData)(img)(
									A8(
										$author$project$Main$SideInfo,
										A3($author$project$Main$StringCoords, si.a$, si.a0, si.a1),
										A2($author$project$Main$StringHighLowPair, si.aY, si.aX),
										A2($author$project$Main$StringHighLowPair, si.a_, si.aZ),
										true,
										lLabel,
										$elm$core$Maybe$Nothing,
										$elm$core$Maybe$Nothing,
										si.aW))(
									A8(
										$author$project$Main$SideInfo,
										A3($author$project$Main$StringCoords, si.be, si.bf, si.bg),
										A2($author$project$Main$StringHighLowPair, si.bb, si.ba),
										A2($author$project$Main$StringHighLowPair, si.bd, si.bc),
										true,
										rLabel,
										$elm$core$Maybe$Nothing,
										$elm$core$Maybe$Nothing,
										si.a9))(si.r)(0)(atlas)(
									$mgold$elm_nonempty_list$List$Nonempty$head(images))(false)(key)(url)(false)(matrixBundle)(fixedRange)(true)($elm$core$Maybe$Nothing)(0)(false);
							}
						}();
						var overlayed = _Utils_update(
							baseData,
							{
								d: A2(
									$author$project$Main$setRangeFromServer,
									vrange_l,
									A4($author$project$Main$setOverlayInfo, lLabel, value_l, color_l, baseData.d)),
								a: A2(
									$author$project$Main$setRangeFromServer,
									vrange_r,
									A4($author$project$Main$setOverlayInfo, rLabel, value_r, color_r, baseData.a))
							});
						var _v4 = A2($author$project$Main$maybeApplyFixedRangeToRight, fixedRange, overlayed);
						var rtData = _v4.a;
						var rangeChanged = _v4.b;
						var cmds = $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$matrixPortCmd(rtData),
									rangeChanged ? $author$project$Main$requestNewImage(rtData) : $elm$core$Platform$Cmd$none
								]));
						return _Utils_Tuple2(
							$author$project$Main$Running(rtData),
							cmds);
					case 4:
						var _v6 = _v1.a;
						return _Utils_Tuple2(
							A4($author$project$Main$WaitingForFirstImage, initData, key, url, mbSharedInfos),
							$elm$core$Platform$Cmd$none);
					default:
						var mfs = _v1.a;
						return A2(
							$author$project$Main$unexpectedMFS,
							A4($author$project$Main$WaitingForFirstImage, initData, key, url, mbSharedInfos),
							mfs);
				}
			} else {
				var e = _v1.a;
				return A2($author$project$Main$errorStateFromDecoding, e, msg);
			}
		} else {
			return A2(
				$author$project$Main$unexpectedEv,
				A4($author$project$Main$WaitingForFirstImage, initData, key, url, mbSharedInfos),
				ev);
		}
	});
var $author$project$Main$getImageReqFromInitData = F2(
	function (initData, mbSharedData) {
		if (mbSharedData.$ === 1) {
			var _v1 = $mathiajusth$nonempty_dict$Dict$Nonempty$head(initData.O);
			var aName = _v1.a;
			var images = _v1.b;
			var iName = $mgold$elm_nonempty_list$List$Nonempty$head(images);
			return $author$project$Main$MTSGetImg(
				A5($author$project$Main$GetImageData, aName, iName, 0, $author$project$Main$defaultSideInfoLeft, $author$project$Main$defaultSideInfoRight));
		} else {
			var d = mbSharedData.a;
			return $author$project$Main$MTSGetImg(
				A5(
					$author$project$Main$GetImageData,
					d.bp,
					d.Y,
					d.r,
					A8(
						$author$project$Main$SideInfo,
						A3($author$project$Main$StringCoords, d.a$, d.a0, d.a1),
						A2($author$project$Main$StringHighLowPair, d.aY, d.aX),
						A2($author$project$Main$StringHighLowPair, d.a_, d.aZ),
						true,
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Nothing,
						d.aW),
					A8(
						$author$project$Main$SideInfo,
						A3($author$project$Main$StringCoords, d.be, d.bf, d.bg),
						A2($author$project$Main$StringHighLowPair, d.bb, d.ba),
						A2($author$project$Main$StringHighLowPair, d.bd, d.bc),
						true,
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Nothing,
						d.a9)));
		}
	});
var $author$project$Main$updateWaitingForInitData = F4(
	function (ev, key, url, mbSharedInfos) {
		if (!ev.$) {
			var msg = ev.a;
			var _v1 = $author$project$Main$decodeServerMsg(msg);
			if (!_v1.$) {
				switch (_v1.a.$) {
					case 2:
						var initData = _v1.a.a;
						return function (res) {
							if (!res.$) {
								var cmd = res.a;
								return _Utils_Tuple2(
									A4($author$project$Main$WaitingForFirstImage, initData, key, url, mbSharedInfos),
									cmd);
							} else {
								var e = res.a;
								return _Utils_Tuple2(
									$author$project$Main$Error('While processing received init Data\n' + e),
									$elm$core$Platform$Cmd$none);
							}
						}(
							$elm$core$Result$Ok(
								$author$project$Main$sendMessage(
									$author$project$Main$encodeMsgToServer(
										A2($author$project$Main$getImageReqFromInitData, initData, mbSharedInfos)))));
					case 4:
						var _v3 = _v1.a;
						return _Utils_Tuple2(
							A3($author$project$Main$WaitingForInitData, key, url, mbSharedInfos),
							$elm$core$Platform$Cmd$none);
					default:
						var mfs = _v1.a;
						return A2(
							$author$project$Main$unexpectedMFS,
							A3($author$project$Main$WaitingForInitData, key, url, mbSharedInfos),
							mfs);
				}
			} else {
				var e = _v1.a;
				return A2($author$project$Main$errorStateFromDecoding, e, msg);
			}
		} else {
			return A2(
				$author$project$Main$unexpectedEv,
				A3($author$project$Main$WaitingForInitData, key, url, mbSharedInfos),
				ev);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (model.$) {
			case 0:
				var key = model.a;
				var url = model.b;
				var sharedData = model.c;
				return A4($author$project$Main$updateWaitingForInitData, msg, key, url, sharedData);
			case 1:
				var initData = model.a;
				var key = model.b;
				var url = model.c;
				var sharedData = model.d;
				return A5($author$project$Main$updateWaitingForFirstImage, initData, key, url, msg, sharedData);
			case 2:
				var rtData = model.a;
				return A2($author$project$Main$updateRunning, rtData, msg);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$main = $elm$browser$Browser$application(
	{c1: $author$project$Main$init, di: $author$project$Main$EvUrlChanged, dj: $author$project$Main$EvLinkClicked, dy: $author$project$Main$subscriptions, dG: $author$project$Main$update, dH: $author$project$Main$renderPage});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));