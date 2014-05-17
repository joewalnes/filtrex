var expect = require('chai').expect;
var compileExpression = require('../');

if(typeof window === 'undefined')
    return;

describe('filtrex-client-only', function() {
    it('cannot call prototype methods on function table', function() {
        // Credit to @emilvirkki for finding this
        window.p0wned = false;
        var evil = compileExpression(
            'constructor.constructor.name.replace("",constructor.constructor("window.p0wned=true"))');
        try {
            evil();
            fail('Exception should have been thrown');
        } catch(expected) {}
        expect(window.p0wned).to.equal(false);
    });
});
