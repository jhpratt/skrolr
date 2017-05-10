const fs = require("fs");
const exec = require("child_process").exec;

//function pad(i) { return i<10?"0"+i:i; }
function pad (str, len) {
	len = len || 2;
	ch = "0";
	str = str + '';
	len = len - str.length;
	if (len <= 0) return str;
	var pad = '';
	while( true ) {
		if (len & 1) pad += ch;
		len >>= 1;
		if (len) ch += ch;
		else break;
	}
	return pad + str;
}

function time() {
	const date = new Date();
	return pad(date.getHours()) +":"+ pad(date.getMinutes()) +":"+ pad(date.getSeconds()) +"."+ pad(date.getMilliseconds(),3);
}

fs.watchFile("skrolr.ts", { interval:1000 }, function() {
	var e = exec("make transpile minify-js");
	e.stdout.on("data", function(data) {
		console.log(time()+"  "+data.trim());
	});
	
	e.on("exit", function() {
		console.log("              Done\n");
	});
});
