const fs = require("fs");
const exec = require("child_process").exec;

function pad(i) { return i<10?"0"+i:i; }

fs.watchFile("skrolr.ts", {interval:1000}, function() {
	const date = new Date();
	const time = pad(date.getHours())+":"+pad(date.getMinutes())+":"+pad(date.getSeconds());
	
	var i=0;
	var e = exec("make transpile minify-js");
	e.stdout.on("data", function(data) {
		if( i==0 ) {
			console.log(time+"  "+data.trim()); i++;
		}
		else {
			console.log("          "+data.trim());
		}
	});
	
	e.on("exit", function() {
		console.log("          Done\n");
	});
});
