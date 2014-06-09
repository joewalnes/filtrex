var expect = require('chai').expect;
var compileExpression = require('../');

describe('filtrex', function() {
    it('simple numeric expressions', function() {
        expect(compileExpression('1 + 2 * 3')()).to.equal(7);
        expect(compileExpression('2 * 3 + 1')()).to.equal(7);
        expect(compileExpression('1 + (2 * 3)')()).to.equal(7);
        expect(compileExpression('(1 + 2) * 3')()).to.equal(9);
        expect(compileExpression('((1 + 2) * 3 / 2 + 1 - 4 + (2 ^ 3)) * -2')()).to.equal(-19);
        expect(compileExpression('1.4 * 1.1')()).to.equal(1.54);
        expect(compileExpression('97 % 10')()).to.equal(7);
    });

    it('bind to data', function() {
        var something = compileExpression('1 + foo * bar');
        expect(something({foo:5, bar:2})).to.equal(11);
        expect(something({foo:2, bar:1})).to.equal(3);
    });

    it('math functions', function() {
        expect(compileExpression('abs(-5)')()).to.equal(5);
        expect(compileExpression('abs(5)')()).to.equal(5);
        expect(compileExpression('ceil(4.1)')()).to.equal(5);
        expect(compileExpression('ceil(4.6)')()).to.equal(5);
        expect(compileExpression('floor(4.1)')()).to.equal(4);
        expect(compileExpression('floor(4.6)')()).to.equal(4);
        expect(compileExpression('round(4.1)')()).to.equal(4);
        expect(compileExpression('round(4.6)')()).to.equal(5);
        expect(compileExpression('sqrt(9)')()).to.equal(3);
    });

    it('functions with multiple args', function() {
        expect(compileExpression('min(2)')()).to.equal(2);
        expect(compileExpression('max(2)')()).to.equal(2);
        expect(compileExpression('min(2, 5)')()).to.equal(2);
        expect(compileExpression('max(2, 5)')()).to.equal(5);
        expect(compileExpression('min(2, 5, 6)')()).to.equal(2);
        expect(compileExpression('max(2, 5, 6)')()).to.equal(6);
        expect(compileExpression('min(2, 5, 6, 1)')()).to.equal(1);
        expect(compileExpression('max(2, 5, 6, 1)')()).to.equal(6);
        expect(compileExpression('min(2, 5, 6, 1, 9)')()).to.equal(1);
        expect(compileExpression('max(2, 5, 6, 1, 9)')()).to.equal(9);
        expect(compileExpression('min(2, 5, 6, 1, 9, 12)')()).to.equal(1);
        expect(compileExpression('max(2, 5, 6, 1, 9, 12)')()).to.equal(12);
    });

    it('boolean logic', function() {
        expect(compileExpression('0 and 0')()).to.equal(0);
        expect(compileExpression('0 and 1')()).to.equal(0);
        expect(compileExpression('1 and 0')()).to.equal(0);
        expect(compileExpression('1 and 1')()).to.equal(1);
        expect(compileExpression('0 or 0')()).to.equal(0);
        expect(compileExpression('0 or 1')()).to.equal(1);
        expect(compileExpression('1 or 0')()).to.equal(1);
        expect(compileExpression('1 or 1')()).to.equal(1);
        expect(compileExpression('not 0')()).to.equal(1);
        expect(compileExpression('not 1')()).to.equal(0);
        expect(compileExpression('(0 and 1) or 1')()).to.equal(1);
        expect(compileExpression('0 and (1 or 1)')()).to.equal(0);
        expect(compileExpression('0 and 1 or 1')()).to.equal(1); // or is higher precedence
        expect(compileExpression('1 or 1 and 0')()).to.equal(1); // or is higher precedence
        expect(compileExpression('not 1 and 0')()).to.equal(0); // not is higher precedence
    });

    it('comparisons', function() {
        expect(compileExpression('foo == 4')({foo:4})).to.equal(1);
        expect(compileExpression('foo == 4')({foo:3})).to.equal(0);
        expect(compileExpression('foo == 4')({foo:-4})).to.equal(0);
        expect(compileExpression('foo != 4')({foo:4})).to.equal(0);
        expect(compileExpression('foo != 4')({foo:3})).to.equal(1);
        expect(compileExpression('foo != 4')({foo:-4})).to.equal(1);
        expect(compileExpression('foo > 4')({foo:3})).to.equal(0);
        expect(compileExpression('foo > 4')({foo:4})).to.equal(0);
        expect(compileExpression('foo > 4')({foo:5})).to.equal(1);
        expect(compileExpression('foo >= 4')({foo:3})).to.equal(0);
        expect(compileExpression('foo >= 4')({foo:4})).to.equal(1);
        expect(compileExpression('foo >= 4')({foo:5})).to.equal(1);
        expect(compileExpression('foo < 4')({foo:3})).to.equal(1);
        expect(compileExpression('foo < 4')({foo:4})).to.equal(0);
        expect(compileExpression('foo < 4')({foo:5})).to.equal(0);
        expect(compileExpression('foo <= 4')({foo:3})).to.equal(1);
        expect(compileExpression('foo <= 4')({foo:4})).to.equal(1);
        expect(compileExpression('foo <= 4')({foo:5})).to.equal(0);
    });

    it('in / not in', function() {
        expect(compileExpression('5 in (1, 2, 3, 4)')()).to.equal(false);
        expect(compileExpression('3 in (1, 2, 3, 4)')()).to.equal(true);
        expect(compileExpression('5 not in (1, 2, 3, 4)')()).to.equal(true);
        expect(compileExpression('3 not in (1, 2, 3, 4)')()).to.equal(false);
    });

    it('string test', function() {
        expect(compileExpression('foo == "hello"')({foo:'hello'})).to.equal(1);
        expect(compileExpression('foo == "hello"')({foo:'bye'})).to.equal(0);
        expect(compileExpression('foo != "hello"')({foo:'hello'})).to.equal(0);
        expect(compileExpression('foo != "hello"')({foo:'bye'})).to.equal(1);
        expect(compileExpression('foo in ("aa", "bb")')({foo:'aa'})).to.equal(true);
        expect(compileExpression('foo in ("aa", "bb")')({foo:'c'})).to.equal(false);
        expect(compileExpression('foo not in ("aa", "bb")')({foo:'aa'})).to.equal(false);
        expect(compileExpression('foo not in ("aa", "bb")')({foo:'cc'})).to.equal(true);
    });

    it('a ? b : c', function() {
        expect(compileExpression('1 > 2 ? 3 : 4')()).to.equal(4);
        expect(compileExpression('1 < 2 ? 3 : 4')()).to.equal(3);
    });

    it('kitchensink', function() {
        var kitchenSink = compileExpression('4 > lowNumber * 2 and (max(a, b) < 20 or foo) ? 1.1 : 9.4');
        expect(kitchenSink({lowNumber:1.5, a:10, b:12, foo:false})).to.equal(1.1);
        expect(kitchenSink({lowNumber:3.5, a:10, b:12, foo:false})).to.equal(9.4);
    });

    it('symbols with dots', function() {
        expect(compileExpression('hello.world.foo')({'hello.world.foo': 123})).to.equal(123);
        expect(compileExpression('order.gooandstuff')({'order.gooandstuff': 123})).to.equal(123);
    });

    it('custom functions', function() {
        function triple(x) { return x * 3; };
        expect(compileExpression('triple(v)', {triple:triple})({v:7})).to.equal(21);
    });
});
