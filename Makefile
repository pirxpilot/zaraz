NODE_BIN=./node_modules/.bin

check: lint test

lint:
	$(NODE_BIN)/jshint *.js lib test

test:
	$(NODE_BIN)/tape test/*js | $(NODE_BIN)/tap-dot

.PHONY: check lint test
