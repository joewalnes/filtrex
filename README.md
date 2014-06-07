Filtrex
=======

A simple, safe, JavaScript expression engine, allowing end-users to enter arbitrary expressions without p0wning you.

````python
category == "meal" and (calories * weight > 2000.0 or subcategory in ("cake", "pie"))
````

Why?
----

There are many cases where you want a user to be able enter an arbitrary expression through a user interface. e.g.

*   Plot a chart ([example](http://rawgit.com/joewalnes/filtrex/master/example/plot.html))
*   Filter/searching across items using multiple fields ([example](http://rawgit.com/joewalnes/filtrex/master/example/highlight.html))
*   Colorize items based on values ([example](http://rawgit.com/joewalnes/filtrex/master/example/colorize.html))
*   Implement a browser based spreadsheet

Sure, you could do that with JavaScript and `eval()`, but I'm sure I don't have to tell you how stupid that would be.

Filtrex defines a really simple expression language that should be familiar to anyone who's ever used a spreadsheet and compile it into a JavaScript function at runtime.

Features
--------

*   **Simple!** End user expression language looks like this `transactions <= 5 and abs(profit) > 20.5`
*   **Fast!** Expressions get compiled into JavaScript functions, offering the same performance as if it had been hand coded. e.g. `function(item) { return item.transactions <=5 && Math.abs(item.profit) > 20.5; }`
*   **Safe!** You as the developer have control of which data can be accessed and the functions that can be called. Expressions cannot escape the sandbox.
*   **Pluggable!** Add your own data and functions.
*   **Predictable!** Because users can't define loops or recursive functions, you know you won't be left hanging.

Installation
------------

    npm install filtrex

or

    bower install filtrex

10 second tutorial
------------------

````javascript
// Input from user (e.g. search filter)
var expression = 'transactions <= 5 and abs(profit) > 20.5';

// Compile expression to executable function
var myfilter = compileExpression(expression);

// Execute function
myfilter({transactions: 3, profit:-40.5}); // returns 1
myfilter({transactions: 3, profit:-14.5}); // returns 0
````

Under the hood, the above expression gets compiled to a clean and fast JavaScript function, looking something like this:

```javascript
// Resulting function
function(item) {
  return item.transactions <= 5 && Math.abs(item.profit) > 20.5;
}
````

Expressions
-----------

There are only 2 types: numbers and strings. Numbers may be floating point or integers. Boolean logic is applied on the truthy value of values (e.g. any non-zero number is true, any non-empty string is true, otherwise false).

Values | Description
--- | ---
43, -1.234 | Numbers
"hello" | String
foo, a.b.c | External data variable defined by application (may be numbers or strings)

Numeric arithmetic | Description
--- | ---
x + y | Add
x - y | Subtract
x * y | Multiply
x / y | Divide
x % y | Modulo
x ^ y | Power

Comparisons | Description
--- | ---
x == y | Equals
x < y | Less than
x <= y | Less than or equal to
x > y | Greater than
x >= y | Greater than or equal to
x in (a, b, c) | Equivalent to (x == a or x == b or x == c)
x not in (a, b, c) | Equivalent to (x != a and x != b and x != c)

Boolean logic | Description
--- | ---
x or y | Boolean or
x and y | Boolean and
not x | Boolean not
x ? y : z | If boolean x, value y, else z
( x ) | Explicity operator precedence

Built-in functions | Description
--- | ---
abs(x) | Absolute value
ceil(x) | Round floating point up
floor(x) | Round floating point down
log(x) | Natural logarithm
max(a, b, c...) | Max value (variable length of args)
min(a, b, c...) | Min value (variable length of args)
random() | Random floating point from 0.0 to 1.0
round(x) | Round floating point
sqrt(x) | Square root

Operator precedence follows that of any sane language.

Adding custom functions
-----------------------

When integrating in to your application, you can add your own custom functions.

````javascript
// Custom function: Return string length.
function strlen(s) {
  return s.length;
}

// Compile expression to executable function
var myfilter = compileExpression(
                    'strlen(firstname) > 5',
                    {strlen:strlen}); // custom functions

myfilter({firstname:'Joe'});    // returns 0
myfilter({firstname:'Joseph'}); // returns 1
````

FAQ
---

**Why the name?**

Because it was originally built for FILTeR EXpressions.

**What's Jison?**

[Jison](http://zaach.github.io/jison/) is bundled with Filtrex - it's a JavaScript parser generator that does the underlying hard work of understanding the expression. It's based on Flex and Bison.

**License?**

[MIT](https://github.com/joewalnes/filtrex/raw/master/LICENSE)

**Unit tests?**

Here: [Source](https://github.com/joewalnes/filtrex/blob/master/test/filtrex-test.html), [Results](https://rawgit.com/joewalnes/filtrex/master/test/filtrex-test.html)

**What happens if the expression is malformed?**

Calling `compileExpression()` with a malformed expression will throw an exception. You can catch that and display feedback to the user. A good UI pattern is to attempt to compile on each keystroke and continuously indicate whether the expression is valid.

Like this? Want other thingies?
-------------------------------

*   [websocketd](https://github.com/joewalnes/websocketd) - Turn any program that uses STDIN/STDOUT into a WebSocket server. Like inetd, but for WebSockets.
*   [ReconnectingWebSocket](https://github.com/joewalnes/reconnecting-websocket) - Simplest way to add some robustness to your WebSocket connections.
*   [Smoothie Charts](http://smoothiecharts.org/) - JavaScript charts for streaming data.
*   Visit [The Igloo Lab](http://theigloolab.com/) to see and subscribe to other thingies I make.

And **[follow @joewalnes](https://twitter.com/joewalnes)**!

