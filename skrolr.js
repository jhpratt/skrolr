Object.prototype.skrolr_showOverlay = function() {
	"use strict";
	this.children[1].className = "skrolr-arrow skrolr-left";
	this.children[2].className = "skrolr-arrow skrolr-right";
	this.children[3].className = "skrolr-button-cont";
};
Object.prototype.skrolr_removeOverlay = function() {
	"use strict";
	this.children[1].className = "skrolr-arrow skrolr-left skrolr-hidden";
	this.children[2].className = "skrolr-arrow skrolr-right skrolr-hidden";
	this.children[3].className = "skrolr-button-cont skrolr-hidden";
};

var skrolr_id_count = 0;

var skrolr_settimeout = [];
var skrolr_num_objs = []; // for determining if left/right is faster

Object.prototype.skrolr_setWidth = function(sizes) {
	"use strict";
	var width = this.offsetWidth;

	if(typeof sizes !== "undefined") { // bind sizes object to scroller element if it hasn't been done
		this.setAttribute("data-skrolr-sizes",JSON.stringify(sizes));
	} else { // otherwise, get the data
		var sizes = JSON.parse(this.getAttribute("data-skrolr-sizes"));
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

	var curPos = obj.firstElementChild.getAttribute("data-skrolr-id");
	var len = skrolr_num_objs[obj.getAttribute("data-skrolr-id")];

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
	if(obj.getAttribute("data-skrolr-id")===null) {
		obj.setAttribute("data-skrolr-id", skrolr_id_count++);
		for(i=0; i<obj.children.length; i++) { // assign children identifier
			obj.children[i].setAttribute("data-skrolr-id", i);
		}
		skrolr_num_objs[obj.getAttribute("data-skrolr-id")] = i; // store for later calculations regarding scrollTo()
	}
	var skrolr_id = obj.getAttribute("data-skrolr-id");

	var scrollTime = (typeof params.scrollTime==="undefined") ? 3000 : params.scrollTime;
	var transitionTime = (typeof params.transitionTime==="undefined") ? 500 : params.transitionTime;
	var transitionTiming = (typeof params.transitionTiming==="undefined") ? "ease-in-out" : params.transitionTiming;

	// in case all you want is defaults
	if(!params) { params = {}; }

	if(obj.getAttribute("data-skrolr-running")===null) { // initialize skrolr
		// get rid of default margin and padding on <ul> (without transition)
		obj.style.transition = "0";
		obj.style.margin = "0";
		obj.style.padding = "0";

		// create parent element
		var parent = document.createElement("div");
		parent.style.position = "relative";
		parent.style.overflow = "hidden";
		obj.parentElement.insertBefore(parent, obj);
		parent.appendChild(obj);

		if(typeof params.arrows !== "undefined") {
			parent.onmouseenter = function() { obj.parentElement.skrolr_showOverlay(); };
			parent.onmouseleave = function() { obj.parentElement.skrolr_removeOverlay(); };

			// create left arrow
			var leftArrow = document.createElement("div");
			leftArrow.className = "skrolr-arrow skrolr-left skrolr-hidden";
			leftArrow.onclick = function() { obj.skrolr({ lt:transitionTime }) };
			parent.appendChild(leftArrow);
	
			// create right arrow
			var rightArrow = document.createElement("div");
			rightArrow.className = "skrolr-arrow skrolr-right skrolr-hidden";
			rightArrow.onclick = function() { obj.skrolr({ rt:transitionTime }) };
			parent.appendChild(rightArrow);
		}
		if(typeof params.buttons === "undefined") {
			// create buttons for goto()
			var buttons = document.createElement("div"); // container
			buttons.className = "skrolr-button-cont skrolr-hidden";
			parent.appendChild(buttons);

			for(var i=0; i<obj.children.length; i++) {
				var btn = document.createElement("div"); // buttons (inside container)
				btn.className = "skrolr-button";
				btn.onclick = function(j) {
					return function() { obj.skrolr_goto(j); };
				}(i);
				buttons.appendChild(btn);
			}
		}
	}
	if(obj.getAttribute("data-skrolr-running")===null && typeof params.numWide !== "undefined") { // if initialization AND numWide is defined, set width of each child element
		obj.skrolr_setWidth(params.numWide);
	}

	// if child elements do not fill parent, make copies until it does
	while(obj.skrolr_childrenWidth() < obj.parentElement.offsetWidth) {
		var childsLen = obj.children.length;
		for(var i=0; i<childsLen; i++) {
			var child = obj.children[i];
			var copy = child.cloneNode(true);
			obj.appendChild(copy);
		}
	}

	// declare a scroller and don't start it
	if(params.declare == true && obj.getAttribute("data-skrolr-running") === null) {
		obj.setAttribute("data-skrolr-running","false");
		return;
	}

	// changes in running state
	if(obj.getAttribute("data-skrolr-running")===null) {
		obj.setAttribute("data-skrolr-running","true");
	}
	if(obj.getAttribute("data-skrolr-running")!="true" && !(params.forward // if not running AND not requested to go fd/bk
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
		obj.setAttribute("data-skrolr-running","false");
		return;
	}

	// skrolr is in middle of transition
	if(obj.getAttribute("data-skrolr-in-transition")=="true") {
		return;
		// stop transition
		//obj.style.transition = "0s";
		//obj.style.left = getComputedStyle(obj).left;

		// abort moving element
		//clearTimeout(skrolr_settimeout[skrolr_id]);
		/*
		var firstChild = obj.firstElementChild.getAttribute("data-skrolr-id");
		var lastChild = obj.lastElementChild.getAttribute("data-skrolr-id");
		*/
	}

	if(params.forward // set forward time
		|| params.fwd
		|| params.fd
		|| params.right
		|| params.rt) {
		obj.setAttribute("data-skrolr-running","false");
		var transitionTime = params.forward || params.fwd || params.fd || params.right || params.rt || 500;
	}
	if(params.backward // back
		|| params.back
		|| params.bk
		|| params.left
		|| params.lt) {
		obj.setAttribute("data-skrolr-running","false");
		var transitionTime = params.backward || params.back || params.bk || params.left || params.lt || 500;

		// get last object and move to front
		var lastChild = obj.lastElementChild;
		var copy = lastChild.cloneNode(true);
		obj.insertBefore(copy, obj.childNodes[0]);

		obj.setAttribute("data-skrolr-in-transition","true");
		obj.style.transition = '0s';
		obj.style.left = '-'+copy.offsetWidth+'px';

		skrolr_settimeout[obj.getAttribute("data-skrolr-id")] = setTimeout( function() {
			obj.style.transition = transitionTime+'ms '+transitionTiming;
			obj.style.left = '0';
			obj.removeChild(lastChild);
		}, 0);
		setTimeout( function() {
			obj.setAttribute("data-skrolr-in-transition","false");
		}, transitionTime);
	}
	else { // forward
		// get first object and move to end
		var firstChild = this.firstElementChild;
		var copy = firstChild.cloneNode(true);
		obj.appendChild(copy);
	
		obj.setAttribute("data-skrolr-in-transition","true");
		obj.style.transition = transitionTime+'ms '+transitionTiming;
		obj.style.left = '-'+firstChild.offsetWidth+'px';
	
		skrolr_settimeout[obj.getAttribute("data-skrolr-id")] = setTimeout( function() {
			obj.setAttribute("data-skrolr-in-transition","false");
			obj.style.transition = '0s';
			obj.style.left = '0';
			obj.removeChild(firstChild);
		}, transitionTime);
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
		}, scrollTime+transitionTime);
	}
};

// resize all child elements on window resize
window.onresize = function() {
	"use strict";
	var allObjs = document.querySelectorAll("[data-skrolr-running]");
	for(var i=0; i<allObjs.length; i++) {
		allObjs[i].skrolr_setWidth();
	}
};