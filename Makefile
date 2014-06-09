BIN := ./node_modules/.bin

.PHONY: all clean preflight

all: filtrex.js filtrex.min.js clean-generated

preflight:
	@( test -d node_modules/browserify \
			&& test -d node_modules/jison \
			&& test -d node_modules/uglify-js ) \
		|| ( echo "Required modules missing. Please run 'npm install'."; exit 1 )

clean-generated:
	rm -f src/grammar.json
	rm -f src/parser.js

clean: clean-generated
	rm -f filtrex.js
	rm -f filtrex.min.js

src/grammar.json: src/grammar.js
	node $< > $@

src/parser.js: src/grammar.json preflight
	$(BIN)/jison -j -o $@ $<

filtrex.js: src/filtrex.js src/parser.js preflight
	$(BIN)/browserify -s compileExpression src/filtrex.js > $@

filtrex.min.js: filtrex.js preflight
	$(BIN)/uglifyjs < $< > $@
