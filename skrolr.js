Object.prototype.setWidth = function(sizes) {
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
}

// get total width of all children of an object
Object.prototype.childrenWidth = function() {
	"use strict";	
	var obj = this;
	var children = obj.children;
	var totalWidth = 0;
	for(var i=0; i<children.length; i++) {
		totalWidth += children[i].offsetWidth;
	}
	return totalWidth;
}

// main scroller function
Object.prototype.skrolr = function(params, notFirst) {
	"use strict";
	var obj = this;

	// in case all you want is defaults
	if(!params) { params = {}; }

	// get rid of default margin and padding on <ul> (without transition)
	if(!notFirst) {
		obj.style.transition = "0";
		obj.style.margin = "0";
		obj.style.padding = "0";
	}

	if(!notFirst && typeof params.numWide !== "undefined") { // if initialization AND numWide is defined, set width of each child element
		obj.setWidth(params.numWide);
	}

	// if child elements do not fill parent, make copies until it does
	while(obj.childrenWidth() < obj.parentElement.offsetWidth) {
		var childsLen = obj.children.length;
		for(var i=0; i<childsLen; i++) {
			var child = obj.children[i];
			var copy = child.cloneNode(true);
			obj.appendChild(copy);
		}
	}

	// declare a scroller and don't start it
	if(params.declare == true && obj.getAttribute("data-skrolr-running") === null) {
		obj.parentElement.style.overflow = "hidden"; // this is why the parent element of the scroller is required
		obj.setAttribute("data-skrolr-running","false");
		return;
	}

	var scrollTime = (typeof params.scrollTime==="undefined") ? 3000 : params.scrollTime;
	var transitionTime = (typeof params.transitionTime==="undefined") ? 500 : params.transitionTime;
	var transitionTiming = (typeof params.transitionTiming==="undefined") ? "ease-in-out" : params.transitionTiming;

	// changes in running state
	if(!notFirst) {
		obj.setAttribute("data-skrolr-running","true");
		obj.parentElement.style.overflow = "hidden"; // this is why the parent element of the scroller is required
	}
	if(obj.getAttribute("data-skrolr-running")!="true") {
		return;
	}
	if(params.stop) {
		obj.setAttribute("data-skrolr-running","false");
		return;
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

		obj.style.transition = '0s';
		obj.style.left = '-'+copy.offsetWidth+'px';

		setTimeout( function() {
			obj.style.transition = transitionTime+'ms '+transitionTiming;
			obj.style.left = '0';
			obj.removeChild(lastChild);
		});
	}
	else { // forward
		// get first object and move to end
		var firstChild = this.firstElementChild;
		var copy = firstChild.cloneNode(true);
		obj.appendChild(copy);
	
		obj.style.transition = transitionTime+'ms '+transitionTiming;
		obj.style.left = '-'+firstChild.offsetWidth+'px';
	
		setTimeout( function() {
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
			obj.skrolr(params, true);
		}, scrollTime+transitionTime);
	}
}

// resize all child elements on window resize
window.onresize = function() {
	"use strict";
	var allObjs = document.querySelectorAll("[data-skrolr-running]");
	for(var i=0; i<allObjs.length; i++) {
		allObjs[i].setWidth();
	}
}