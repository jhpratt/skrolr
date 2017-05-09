transpile:
	@echo "Transpiling TypeScript to ES6"
	@tsc
	@mv skrolr.js skrolr.es6.js
	@echo "Transpiling TypeScript to ES3"
	@tsc --module commonjs --target es3
	@mv skrolr.js skrolr.es3.js

minify: minify-js minify-css

minify-js:
	@echo "Minifying ES6"
	@uglifyjs --compress --mangle --screw-ie8 --output min/skrolr.es6.min.js -- skrolr.es6.js
	@echo "Minifying ES3"
	@uglifyjs --compress --mangle --screw-ie8 --output min/skrolr.es3.min.js -- skrolr.es3.js

minify-css:
	@echo "Minifying CSS"
	@cleancss -o min/skrolr.min.css skrolr.css

clean:
	@rm min/*
	@echo "Removed minified files"
