minify:
	@echo "Minifying JavaScript"
	@uglifyjs --compress --mangle --screw-ie8 --output min/skrolr.min.js -- skrolr.js
	@echo "Minifying CSS"
	@cleancss -o min/skrolr.min.css skrolr.css
	@echo "Done"

clean:
	@rm min/*
	@echo "Removed minified files"
