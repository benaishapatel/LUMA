.PHONY: test karma
test:
	./node_modules/.bin/mocha --reporter list
karma:
	./node_modules/.bin/karma start karma.conf.js
