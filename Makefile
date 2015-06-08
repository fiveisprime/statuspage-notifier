SPEC_FILES := $(shell find ./spec -name "*.js")
LINT_SRC = index.js $(SPEC_FILES)

test: $(LINT_SRC)
	@node_modules/.bin/jshint $^
	@node_modules/.bin/istanbul cover node_modules/.bin/_mocha \
		-R spec -- \
		--recursive \
		--require should \
		--reporter spec

.PHONY: test
