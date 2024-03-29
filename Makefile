NODE_BIN=./node_modules/.bin

check: lint test

lint:
	$(NODE_BIN)/jshint *.js lib test

test:
	node --test

.PHONY: check lint test
