BIN := ./node_modules/.bin

.PHONY: all clean

all: filtrex.js filtrex.min.js

clean:
	rm -f filtrex.js
	rm -f filtrex.min.js
	rm -f src/grammar.json
	rm -f src/parser.js

src/grammar.json: src/grammar.js
	node $< > $@

src/parser.js: src/grammar.json
	$(BIN)/jison -j -o $@ $<

filtrex.js: src/filtrex.js src/parser.js
	$(BIN)/browserify -s filtrex index.js > $@

filtrex.min.js: filtrex.js
	$(BIN)/uglifyjs < $< > $@
