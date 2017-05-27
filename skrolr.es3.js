"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var skrolr = (function () {
    function skrolr(root, params) {
        var _this = this;
        this.curPos = 0;
        this.inTransition = false;
        this.wasRunning = true;
        this.isRunning = false;
        this.forward = function () { return _this.goto(_this.curPos + _this.scrollBy, true); };
        this.backward = function () { return _this.goto(_this.curPos - _this.scrollBy, true); };
        skrolr.all.push(this);
        switch (typeof root) {
            case "object":
                this.root = root;
                break;
            case "string":
                this.root = document.getElementById(root);
                break;
            default:
                console.log("Error: parameter passed must be DOM object or ID of a DOM object");
                return;
        }
        this.root.className = "sk";
        this.numWide = params.numWide;
        this.moveTime = params.moveTime || 500;
        this.waitTime = params.waitTime || 3000;
        this.transitionTiming = params.transitionTiming || "ease-in-out";
        this.scrollBy = params.scrollBy || 1;
        this.numObjs = this.root.children.length;
        if (params.randomize === true) {
            var children = skrolr.Array.from(this.root.children);
            for (var i = this.numObjs - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [children[j], children[i]], children[i] = _a[0], children[j] = _a[1];
            }
            var child = void 0;
            while (child = this.root.firstChild)
                this.root.removeChild(child);
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child_1 = children_1[_i];
                this.root.appendChild(child_1);
            }
        }
        if (params.stopOnMouseOver === true) {
            this.root.onmouseover = function () { return _this.stop(true); };
            this.root.onmouseout = function () { if (_this.wasRunning)
                _this.start(); };
        }
        this.parent = document.createElement("div");
        this.parent.style.position = "relative";
        this.parent.style.overflow = "hidden";
        if (params.height !== undefined)
            this.parent.style.height = params.height;
        if (params.width !== undefined)
            this.parent.style.width = params.width;
        if (params.size !== undefined) {
            var size = params.size.split(" ");
            this.parent.style.width = size[0];
            this.parent.style.height = size[1];
        }
        this.root.parentElement.insertBefore(this.parent, this.root);
        this.parent.appendChild(this.root);
        this.autoWidth();
        if (params.arrows === true) {
            var leftArrow = document.createElement("div");
            leftArrow.className = "sk-arrow sk-left sk-hidden";
            leftArrow.onclick = function () { return _this.stop().goto(_this.curPos - Math.abs(_this.scrollBy)); };
            this.parent.appendChild(leftArrow);
            var rightArrow = document.createElement("div");
            rightArrow.className = "sk-arrow sk-right sk-hidden";
            rightArrow.onclick = function () { return _this.stop().goto(_this.curPos + Math.abs(_this.scrollBy)); };
            this.parent.appendChild(rightArrow);
            this.parent.addEventListener("mouseover", function () { return _this.toggleArrows(); });
            this.parent.addEventListener("mouseout", function () { return _this.toggleArrows(); });
        }
        if (params.buttons === true) {
            var buttons = document.createElement("div");
            buttons.className = "sk-button-cont sk-hidden";
            this.parent.appendChild(buttons);
            this.parent.addEventListener("mouseover", function () { return _this.toggleButtons(); });
            this.parent.addEventListener("mouseout", function () { return _this.toggleButtons(); });
            var _loop_1 = function (i) {
                var btn = document.createElement("div");
                btn.className = "sk-button";
                btn.onclick = function () { return _this.stop().goto(i); };
                buttons.appendChild(btn);
            };
            for (var i = 0; i < this.numObjs; i++) {
                _loop_1(i);
            }
        }
        if (document.hasFocus())
            this.start();
        var _a;
    }
    skrolr.prototype.reinitialize = function (options) {
        var arrowsButtons = document.querySelectorAll(".sk-arrow, .sk-button-cont");
        skrolr.forEach(arrowsButtons, function (obj) { return obj.parentNode.removeChild(obj); });
        this.parent.parentNode.insertBefore(this.root, this.parent);
        this.parent.parentNode.removeChild(this.parent);
        if (options === undefined)
            options = {};
        if (!('numWide' in options))
            options['numWide'] = this.numWide;
        return new skrolr(this.root, options);
    };
    skrolr.prototype.toggleArrows = function () {
        this.parent.children[1].classList.toggle("sk-hidden");
        this.parent.children[2].classList.toggle("sk-hidden");
        return this;
    };
    skrolr.prototype.toggleButtons = function () {
        this.parent.children[3].classList.toggle("sk-hidden");
        return this;
    };
    skrolr.prototype.autoWidth = function () {
        var _this = this;
        var children = this.root.children;
        var _loop_2 = function (i, leni) {
            if (this_1.numWide[i][0] <= this_1.root.offsetWidth
                && (this_1.root.offsetWidth < this_1.numWide[i][1]
                    || this_1.numWide[i][1] === undefined
                    || this_1.numWide[i][1] === null)) {
                skrolr.forEach(children, function (child) { return child.style.width = 100 / _this.numWide[i][2] + "%"; });
                while (this_1.childrenWidth() < this_1.parent.offsetWidth) {
                    for (var j = 0, len = children.length; j < len; j++) {
                        var copy = children[j].cloneNode(true);
                        this_1.root.appendChild(copy);
                    }
                }
                return "break";
            }
        };
        var this_1 = this;
        for (var i = 0, leni = this.numWide.length; i < leni; i++) {
            var state_1 = _loop_2(i, leni);
            if (state_1 === "break")
                break;
        }
        return this;
    };
    skrolr.prototype.childrenWidth = function () {
        var totalWidth = 0;
        skrolr.forEach(this.root.children, function (child) { return totalWidth += child.offsetWidth; });
        return totalWidth;
    };
    skrolr.prototype.goto = function (loc, noStop) {
        var _this = this;
        if (this.inTransition)
            return;
        if (noStop !== true)
            clearInterval(this.interval);
        loc = skrolr.pmod(loc, this.numObjs);
        var distToLeft = skrolr.pmod(this.curPos - loc, this.numObjs);
        var distToRight = skrolr.pmod(loc - this.curPos, this.numObjs);
        if (!distToLeft || !distToRight)
            return;
        this.inTransition = true;
        if (distToRight <= distToLeft) {
            this.curPos = loc;
            var children_2 = skrolr.Array.from(this.root.children).slice(0, distToRight);
            var sumWidth = 0;
            for (var _i = 0, children_3 = children_2; _i < children_3.length; _i++) {
                var child = children_3[_i];
                var obj = child;
                sumWidth += obj.offsetWidth;
                var copy = obj.cloneNode(true);
                this.root.appendChild(copy);
            }
            this.root.style.transition = this.moveTime + 'ms ' + this.transitionTiming;
            this.root.style.left = -1 * sumWidth + 'px';
            setTimeout(function () {
                _this.root.style.transition = '0s';
                _this.root.style.left = '0';
                skrolr.forEach(children_2, function (child) { return _this.root.removeChild(child); });
            }, this.moveTime);
        }
        else {
            this.curPos = loc;
            var children_4 = skrolr.Array.from(this.root.children).slice(-distToLeft);
            var sumWidth = 0;
            var len = children_4.length;
            for (var i = 0; i < len; i++) {
                var obj = children_4[len - i - 1];
                sumWidth += obj.offsetWidth;
                var copy = obj.cloneNode(true);
                this.root.insertBefore(copy, this.root.firstChild);
            }
            this.root.style.transition = "0s";
            this.root.style.left = -1 * sumWidth + 'px';
            setTimeout(function () {
                _this.root.style.transition = _this.moveTime + 'ms ' + _this.transitionTiming;
                _this.root.style.left = '0';
            }, 0);
            setTimeout(function () {
                skrolr.forEach(children_4, function (child) { return _this.root.removeChild(child); });
            }, this.moveTime);
        }
        setTimeout(function () {
            _this.inTransition = false;
        }, this.moveTime);
        return this;
    };
    skrolr.prototype.start = function () {
        var _this = this;
        this.wasRunning = true;
        this.isRunning = true;
        clearInterval(this.interval);
        this.interval = setInterval(function () { return _this.forward(); }, this.moveTime + this.waitTime);
        return this;
    };
    skrolr.prototype.stop = function (noSet) {
        if (!noSet)
            this.wasRunning = false;
        this.isRunning = false;
        clearInterval(this.interval);
        return this;
    };
    skrolr.prototype.isVisible = function () {
        var bounding = this.parent.getBoundingClientRect();
        var html = document.documentElement;
        return (bounding.bottom >= 0 &&
            bounding.top <= (window.innerHeight || html.clientHeight) &&
            bounding.right >= 0 &&
            bounding.left <= (window.innerWidth || html.clientWidth));
    };
    return skrolr;
}());
skrolr.all = [];
skrolr.each = function (fn) { return skrolr.all.forEach(function (obj) { return fn(obj); }); };
skrolr.Array = (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.from = function (obj) {
        var arr = [];
        for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
            var o = obj_1[_i];
            arr.push(o);
        }
        return arr;
    };
    return class_1;
}(Array));
skrolr.forEach = function (obj, fn) { for (var _i = 0, obj_2 = obj; _i < obj_2.length; _i++) {
    var o = obj_2[_i];
    fn(o);
} };
skrolr.pmod = function (x, n) { return ((x % n) + n) % n; };
window.onresize = function () {
    skrolr.each(function (obj) {
        obj.autoWidth();
    });
};
window.addEventListener("focus", function () {
    skrolr.each(function (obj) {
        if (obj.wasRunning)
            obj.start();
    });
});
window.addEventListener("blur", function () {
    skrolr.each(function (obj) {
        obj.stop(true);
    });
});
window.addEventListener("scroll", function () {
    skrolr.each(function (obj) {
        var visible = obj.isVisible();
        if (!obj.isRunning && obj.wasRunning && visible)
            obj.start();
        else if (obj.isRunning && !visible)
            obj.stop(true);
    });
});
