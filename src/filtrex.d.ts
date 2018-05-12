/**
 * A simple, safe, JavaScript expression engine, allowing end-users to enter arbitrary expressions without p0wning you.
 * 
 * @example
 * // Input from user (e.g. search filter)
 * let expression = 'transactions <= 5 and abs(profit) > 20.5';
 *
 * // Compile expression to executable function
 * let myfilter = compileExpression(expression);
 * 
 * // Execute function
 * myfilter({transactions: 3, profit:-40.5}); // returns 1
 * myfilter({transactions: 3, profit:-14.5}); // returns 0
 * 
 * @param expression
 * The expression to be parsed. Under the hood, the expression gets compiled to a clean and fast JavaScript function.
 * There are only 2 types: numbers and strings. Numbers may be floating point or integers. Boolean logic is applied
 * on the truthy value of values (e.g. any non-zero number is true, any non-empty string is true, otherwise false).
 * Examples of numbers: `43`, `-1.234`; example of a string: `"hello"`; example of external data variable: `foo`, `a.b.c`,
 * `'foo-bar'`.  
 * You can use the following operators:
 *  * `x + y` Add
 *  * `x - y` Aubtract
 *  * `x * y` Multiply
 *  * `x / y` Divide
 *  * `x % y` Modulo
 *  * `x ^ y` Power
 *  * `x == y` Equals
 *  * `x < y` Less than
 *  * `x <= y` Less than or equal to
 *  * `x > y` Greater than
 *  * `x >= y` Greater than or equal to
 *  * `x in (a, b, c)` Equivalent to `(x == a or x == b or x == c)`
 *  * `x not in (a, b, c)` Equivalent to `(x != a and x != b and x != c)`
 *  * `x or y` Boolean or
 *  * `x and y` Boolean and
 *  * `not x` Boolean not
 *  * `x ? y : z` If boolean x, value y, else z
 *  * `( x )` Explicity operator precedence
 *  * `abs(x)` Absolute value
 *  * `ceil(x)` Round floating point up
 *  * `floor(x)` Round floating point down
 *  * `log(x)` Natural logarithm
 *  * `max(a, b, c...)` Max value (variable length of args)
 *  * `min(a, b, c...)` Min value (variable length of args)
 *  * `random()` Random floating point from 0.0 to 1.0
 *  * `round(x)` Round floating point
 *  * `sqrt(x)` Square root
 *  * `myFooBarFunction(x)` Custom function defined in `extraFunctions`
 * 
 * @param extraFunctions
 * When integrating in to your application, you can add your own custom functions.
 * These functions will be available in the expression in the same way as `sqrt(x)` and `round(x)`.
 */
export function compileExpression(
    expression: string,
    extraFunctions?: {
        [T: string]: Function
    }
): (obj: {}) => any
