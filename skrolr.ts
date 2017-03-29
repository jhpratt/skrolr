/* skrolr v0.4.0
 * MIT license
 * Jacob H. Pratt
 * jhprattdev@gmail.com
 */

let skIdCount: number = 0;

class skrolr {
	let settimeout = [];
	let numObjs = []; // for determining if left/right is faster
	
	showArrows() {
		this.children[1].className = "sk-arrow sk-left";
		this.children[2].className = "sk-arrow sk-right";
	}
	removeArrows() {
		this.children[1].className = "sk-arrow sk-left sk-hidden";
		this.children[2].className = "sk-arrow sk-right sk-hidden";
	}
	showButtons() {
		this.lastElementChild.className = "sk-button-cont";
	}
	removeButtons() {
		this.lastElementChild.className = "sk-button-cont sk-hidden";
	}
	setWidth(sizes) {
		//
	}
	childrenWidth() { // get total width of all children of an object
		//
	}
	goto(loc, spd, origDist) {
		//
	}
	start() { // original skrolr() prototype
		//
	}
	
	// take functions like `forward()`, `backward()`, `stop()`, `declare()`, etc. and split off
	forward() {
		//
	}
	backward() {
		//
	}
	stop() {
		//
	}
	declare() {
		//
	}
}

Object.prototype.skrolr_setWidth = function(sizes) {
	"use strict";
	var width = this.offsetWidth;

	if(typeof sizes !== "undefined") { // bind sizes object to scroller element if it hasn't been done
		this.setAttribute("sk-sizes",JSON.stringify(sizes));
	} else { // otherwise, get the data
		var sizes = JSON.parse(this.getAttribute("sk-sizes"));
	}

	// find the size each child element should be
	for(var i=0; i<sizes.length; i++) {
		if(sizes[i][0] <= width && (typeof sizes[i][1] === "undefined" || sizes[i][1] === null)) { // [minSize,, numWide] match
			var eachWidth = width/sizes[i][2];
			break;
		}
		if(sizes[i][0] <= width && width < sizes[i][1]) { // [minSize, maxSize, numWide] match
			var eachWidth = width/sizes[i][2];
			break;
		}
	}

	// set each child element to calculated width
	var childsLen = this.children.length;
	for(var i=0; i<childsLen; i++) {
		obj.children[i].style.width = eachWidth+"px";
	}
};

// get total width of all children of an object
Object.prototype.skrolr_childrenWidth = function() {
	"use strict";	
	var obj = this;
	var children = obj.children;
	var totalWidth = 0;
	for(var i=0; i<children.length; i++) {
		totalWidth += children[i].offsetWidth;
	}
	return totalWidth;
};

Object.prototype.skrolr_goto = function(loc, spd, origDist) {
	"use strict";

	var curPos = obj.firstElementChild.getAttribute("sk-id");
	var len = skrolr_num_objs[obj.getAttribute("sk-id")];

	if(typeof spd==="undefined") { spd=500; }

	var distToLeft = (((curPos - loc)%len)+len)%len; // force positive result for modulus
	var distToRight = (((loc - curPos)%len)+len)%len;

	// ease-in-out over entire sequence
	if(distToLeft==1 || distToRight==1) { // last move
		var timing = "ease-out";
	}
	else if(typeof origDist==="undefined") { // first move
		var timing = "ease-in";
		var origDist = Math.min(distToLeft, distToRight);
	}
	else {
		var timing = "linear";
	}

	// move
	if(distToLeft==0 || distToRight==0) {
		return;
	}
	if(distToLeft < distToRight) {
		obj.skrolr({ lt: spd, transitionTiming: timing });
	}
	else {
		obj.skrolr({ rt: spd, transitionTiming: timing });
	}

	setTimeout( function() {
		obj.skrolr_goto(loc, spd, origDist);
	}, spd);
};

// main scroller function
Object.prototype.skrolr = function(params) {
	"use strict";
	var obj = this;

	// assign skrolr identifier
	if(obj.getAttribute("sk-id")===null) {
		obj.setAttribute("sk-id", skrolr_id_count++);
		for(i=0; i<obj.children.length; i++) { // assign children identifier
			obj.children[i].setAttribute("sk-id", i);
		}
		skrolr_num_objs[obj.getAttribute("sk-id")] = i; // store for later calculations regarding scrollTo()
	}
	var skrolr_id = obj.getAttribute("sk-id");

	var waitTime = (typeof params.waitTime==="undefined") ? 3000 : params.waitTime;
	var moveTime = (typeof params.moveTime==="undefined") ? 500 : params.moveTime;
	var transitionTiming = (typeof params.transitionTiming==="undefined") ? "ease-in-out" : params.transitionTiming;

	// in case all you want is defaults
	if(!params) { params = {}; }

	if(obj.getAttribute("sk-running")===null) { // initialize skrolr
		// get rid of default margin and padding on <ul> (without transition)
		obj.style.transition = "0";
		obj.style.margin = "0";
		obj.style.padding = "0";

		// create parent element
		var parent = document.createElement("div");
		parent.style.position = "relative";
		parent.style.overflow = "hidden";

		// set size of parent element
		if(typeof params.height !== "undefined") {
			parent.style.height = params.height;
		}
		if(typeof params.width !== "undefined") {
			parent.style.width = params.width;
		}
		if(typeof params.size !== "undefined") {
			var size = params.size.split(" ");
			parent.style.width = size[0];
			parent.style.height = size[1];
		}

		obj.parentElement.insertBefore(parent, obj);
		parent.appendChild(obj);

		if(params.arrows === true) {
			parent.onmouseenter = function() { obj.parentElement.skrolr_showArrows(); };
			parent.onmouseleave = function() { obj.parentElement.skrolr_removeArrows(); };

			// create left arrow
			var leftArrow = document.createElement("div");
			leftArrow.className = "sk-arrow sk-left sk-hidden";
			leftArrow.onclick = function() { obj.skrolr({ lt:moveTime }) };
			parent.appendChild(leftArrow);
	
			// create right arrow
			var rightArrow = document.createElement("div");
			rightArrow.className = "sk-arrow sk-right sk-hidden";
			rightArrow.onclick = function() { obj.skrolr({ rt:moveTime }) };
			parent.appendChild(rightArrow);
		}
		if(params.buttons !== false) {
			// if we don't check for arrows functions, buttons will override it
			if(String(parent.onmouseenter).includes("showArrows")) {
				parent.onmouseenter = function() { obj.parentElement.skrolr_showArrows(); obj.parentElement.skrolr_showButtons(); };
			}
			else {
				parent.onmouseenter = function() { obj.parentElement.skrolr_showButtons(); };
			}
			if(String(parent.onmouseleave).includes("removeArrows")) {
				parent.onmouseleave = function() { obj.parentElement.skrolr_removeArrows(); obj.parentElement.skrolr_removeButtons(); };
			}
			else {
				parent.onmouseleave = function() { obj.parentElement.skrolr_removeButtons(); };
			}

			// create buttons for goto()
			var buttons = document.createElement("div"); // container
			buttons.className = "sk-button-cont sk-hidden";
			parent.appendChild(buttons);

			for(var i=0; i<obj.children.length; i++) {
				var btn = document.createElement("div"); // buttons (inside container)
				btn.className = "sk-button";
				btn.onclick = function(j) {
					return function() { obj.skrolr_goto(j); };
				}(i);
				buttons.appendChild(btn);
			}
		}
	}
	if(obj.getAttribute("sk-running")===null && typeof params.numWide !== "undefined") { // if initialization AND numWide is defined, set width of each child element
		obj.skrolr_setWidth(params.numWide);
	}

	// if child elements do not fill parent, make copies until it does
	while(obj.skrolr_childrenWidth() <= obj.parentElement.offsetWidth) {
		var childsLen = obj.children.length;
		for(var i=0; i<childsLen; i++) {
			var child = obj.children[i];
			var copy = child.cloneNode(true);
			obj.appendChild(copy);
		}
	}

	// declare a scroller and don't start it
	if(params.declare === true && obj.getAttribute("sk-running") === null) {
		obj.setAttribute("sk-running","false");
		return;
	}

	// changes in running state
	if(obj.getAttribute("sk-running")===null) {
		obj.setAttribute("sk-running","true");
	}
	if(obj.getAttribute("sk-running")!="true" && !(params.forward // if not running AND not requested to go fd/bk
	                                            || params.fwd
                                                || params.fd
                                                || params.right
                                                || params.rt
                                                || params.backward
                                                || params.back
                                                || params.bk
                                                || params.left
                                                || params.lt)) {
		return;
	}
	if(params.stop) {
		obj.setAttribute("sk-running","false");
		return;
	}

	// skrolr is in middle of transition
	if(obj.getAttribute("sk-in-transition")=="true") {
		return;
		// stop transition
		//obj.style.transition = "0s";
		//obj.style.left = getComputedStyle(obj).left;

		// abort moving element
		//clearTimeout(skrolr_settimeout[skrolr_id]);
		/*
		var firstChild = obj.firstElementChild.getAttribute("sk-id");
		var lastChild = obj.lastElementChild.getAttribute("sk-id");
		*/
	}

	if(params.forward // set forward time
		|| params.fwd
		|| params.fd
		|| params.right
		|| params.rt) {
		obj.setAttribute("sk-running","false");
		var moveTime = params.forward || params.fwd || params.fd || params.right || params.rt || 500;
	}
	if(params.backward // back
		|| params.back
		|| params.bk
		|| params.left
		|| params.lt) {
		obj.setAttribute("sk-running","false");
		var moveTime = params.backward || params.back || params.bk || params.left || params.lt || 500;

		// get last object and move to front
		var lastChild = obj.lastElementChild;
		var copy = lastChild.cloneNode(true);
		obj.insertBefore(copy, obj.childNodes[0]);

		obj.setAttribute("sk-in-transition","true");
		obj.style.transition = '0s';
		obj.style.left = '-'+copy.offsetWidth+'px';

		skrolr_settimeout[obj.getAttribute("sk-id")] = setTimeout( function() {
			obj.style.transition = moveTime+'ms '+transitionTiming;
			obj.style.left = '0';
			obj.removeChild(lastChild);
		}, 0);
		setTimeout( function() {
			obj.setAttribute("sk-in-transition","false");
		}, moveTime);
	}
	else { // forward
		// get first object and move to end
		var firstChild = this.firstElementChild;
		var copy = firstChild.cloneNode(true);
		obj.appendChild(copy);
	
		obj.setAttribute("sk-in-transition","true");
		obj.style.transition = moveTime+'ms '+transitionTiming;
		obj.style.left = '-'+firstChild.offsetWidth+'px';
	
		skrolr_settimeout[obj.getAttribute("sk-id")] = setTimeout( function() {
			obj.setAttribute("sk-in-transition","false");
			obj.style.transition = '0s';
			obj.style.left = '0';
			obj.removeChild(firstChild);
		}, moveTime);
	}

	if(!(params.forward
		|| params.fwd
		|| params.fd
		|| params.right
		|| params.rt
		|| params.backward
		|| params.back
		|| params.bk
		|| params.left
		|| params.lt)) {
		setTimeout( function() {
			obj.skrolr(params);
		}, waitTime+moveTime);
	}
};

// resize all child elements on window resize
window.onresize = function() {
	"use strict";
	var allObjs = document.querySelectorAll("[sk-running]");
	for(var i=0; i<allObjs.length; i++) {
		allObjs[i].skrolr_setWidth();
	}
};
