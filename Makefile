transpile:
	@echo "Transpiling TypeScript"
	@tsc skrolr.ts

minify: minify-js minify-css

minify-js:
	@echo "Minifying JavaScript"
	@uglifyjs --compress --mangle --screw-ie8 --output min/skrolr.min.js -- skrolr.js

minify-css:
	@echo "Minifying CSS"
	@cleancss -o min/skrolr.min.css skrolr.css

clean:
	@rm min/*
	@echo "Removed minified files"
