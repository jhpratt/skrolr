/* skrolr v0.4.0
 * MIT license
 * Jacob H. Pratt
 * jhprattdev@gmail.com
 */
var skrolrs = [];
var skrolr = (function () {
    function skrolr(elem, params) {
        skrolrs.push(this);
        this.elem = elem;
        elem.className = "sk";
        this.size = params.size;
        this.numWide = params.numWide;
        this.settimeout = [];
        this.numObjs = 0; // for determining if left/right is faster
        // create parent element
        this.parent = document.createElement("div");
        this.parent.style.position = "relative";
        this.parent.style.overflow = "hidden";
        // set size of parent element
        if (typeof params.height !== undefined) {
            this.parent.style.height = params.height;
        }
        if (typeof params.width !== undefined) {
            this.parent.style.width = params.width;
        }
        if (typeof params.size !== undefined) {
            var size = params.size.split(" ");
            this.parent.style.width = size[0];
            this.parent.style.height = size[1];
        }
        this.elem.parentElement.insertBefore(this.parent, this.elem);
        this.parent.appendChild(this.elem);
        // end create parent
        if (params.arrows !== false) {
            var leftArrow = document.createElement("div");
            leftArrow.className = "sk-arrow sk-left sk-hidden";
            this.parent.appendChild(leftArrow);
            var rightArrow = document.createElement("div");
            rightArrow.className = "sk-arrow sk-right sk-hidden";
            this.parent.appendChild(rightArrow);
            // show/hide on mouseover/out
            var that_1 = this;
            this.parent.addEventListener("mouseover", function () { that_1.toggleArrows(); });
            this.parent.addEventListener("mouseout", function () { that_1.toggleArrows(); });
        }
        if (params.buttons !== false) {
            var buttons = document.createElement("div");
            buttons.className = "sk-button-cont sk-hidden";
            this.parent.appendChild(buttons);
            // show/hide on mouseover/out
            var that_2 = this;
            this.parent.addEventListener("mouseover", function () { that_2.toggleButtons(); });
            this.parent.addEventListener("mouseout", function () { that_2.toggleButtons(); });
            var _loop_1 = function (i, len) {
                var btn = document.createElement("div"); // buttons (inside container)
                btn.className = "sk-button";
                btn.onclick = function () { that_2.goto(i); };
                buttons.appendChild(btn);
            };
            // create individual buttons
            for (var i = 0, len = this.elem.children.length; i < len; i++) {
                _loop_1(i, len);
            }
        }
    }
    skrolr.prototype.toggleArrows = function () {
        this.parent.children[1].classList.toggle("sk-hidden");
        this.parent.children[2].classList.toggle("sk-hidden");
    };
    skrolr.prototype.toggleButtons = function () {
        this.parent.children[3].classList.toggle("sk-hidden");
    };
    skrolr.prototype.autoWidth = function () {
        // find the size each child element should be
        for (var i = 0, len = this.numWide.length; i < len; i++) {
            if (this.numWide[i][0] <= this.elem.offsetWidth && (this.elem.offsetWidth < this.numWide[i][1] || typeof this.numWide[i][1] === "undefined" || this.numWide[i][1] === null)) {
                this.eachWidth = this.elem.offsetWidth / this.numWide[i][2];
                break;
            }
        }
        // set each child element to calculated width
        for (var i = 0, len = this.elem.children.length; i < len; i++) {
            this.elem.children[i].style.width = this.eachWidth + "px";
        }
    };
    skrolr.prototype.childrenWidth = function () {
        var children = this.elem.children;
        var totalWidth = 0;
        for (var i = 0, len = children.length; i < len; i++) {
            totalWidth += children[i].offsetWidth;
        }
        return totalWidth;
    };
    skrolr.prototype.goto = function (loc, spd, origDist) {
        if (spd === void 0) { spd = 500; }
        //
    };
    skrolr.prototype.start = function () {
        //
    };
    // take functions like `forward()`, `backward()`, `stop()` etc. and split off
    skrolr.prototype.forward = function () {
        //
    };
    skrolr.prototype.backward = function () {
        //
    };
    skrolr.prototype.stop = function () {
        //
    };
    return skrolr;
}());
// resize all child elements on window resize
window.onresize = function () {
    for (var i = 0, len = skrolrs.length; i < len; i++) {
        skrolrs[i].autoWidth();
    }
};
