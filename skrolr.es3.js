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
        this.curPos = 0;
        this.inTransition = false;
        this.wasRunning = true;
        this.isRunning = false;
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
        this.parent = document.createElement("div");
        this.parent.style.position = "relative";
        this.parent.style.overflow = "hidden";
        if (params.height !== undefined) {
            this.parent.style.height = params.height;
        }
        if (params.width !== undefined) {
            this.parent.style.width = params.width;
        }
        if (params.size !== undefined) {
            var size = params.size.split(" ");
            this.parent.style.width = size[0];
            this.parent.style.height = size[1];
        }
        this.root.parentElement.insertBefore(this.parent, this.root);
        this.parent.appendChild(this.root);
        this.autoWidth();
        if (params.arrows === true) {
            var that_1 = this;
            var leftArrow = document.createElement("div");
            leftArrow.className = "sk-arrow sk-left sk-hidden";
            leftArrow.onclick = function () { that_1.stop().goto(that_1.curPos - Math.abs(that_1.scrollBy)); };
            this.parent.appendChild(leftArrow);
            var rightArrow = document.createElement("div");
            rightArrow.className = "sk-arrow sk-right sk-hidden";
            rightArrow.onclick = function () { that_1.stop().goto(that_1.curPos + Math.abs(that_1.scrollBy)); };
            this.parent.appendChild(rightArrow);
            this.parent.addEventListener("mouseover", function () { that_1.toggleArrows(); });
            this.parent.addEventListener("mouseout", function () { that_1.toggleArrows(); });
        }
        if (params.buttons === true) {
            var buttons = document.createElement("div");
            buttons.className = "sk-button-cont sk-hidden";
            this.parent.appendChild(buttons);
            var that_2 = this;
            this.parent.addEventListener("mouseover", function () { that_2.toggleButtons(); });
            this.parent.addEventListener("mouseout", function () { that_2.toggleButtons(); });
            var _loop_1 = function (i) {
                var btn = document.createElement("div");
                btn.className = "sk-button";
                btn.onclick = function () { that_2.goto(i); };
                buttons.appendChild(btn);
            };
            for (var i = 0; i < this.numObjs; i++) {
                _loop_1(i);
            }
        }
        if (document.hasFocus())
            this.start();
    }
    skrolr.each = function (fn) {
        for (var _i = 0, _a = skrolr.all; _i < _a.length; _i++) {
            var obj = _a[_i];
            fn(obj);
        }
    };
    skrolr.pmod = function (x, n) { return ((x % n) + n) % n; };
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
        var that = this;
        var children = this.root.children;
        for (var i = 0, leni = this.numWide.length; i < leni; i++) {
            if (this.numWide[i][0] <= this.root.offsetWidth
                && (this.root.offsetWidth < this.numWide[i][1]
                    || this.numWide[i][1] === undefined
                    || this.numWide[i][1] === null)) {
                for (var j = 0, lenj = children.length; j < lenj; j++)
                    children[j].style.width = 100 / that.numWide[i][2] + "%";
                while (this.childrenWidth() < this.parent.offsetWidth) {
                    for (var j = 0, len = children.length; j < len; j++) {
                        var copy = children[j].cloneNode(true);
                        this.root.appendChild(copy);
                    }
                }
                break;
            }
        }
        return this;
    };
    skrolr.prototype.childrenWidth = function () {
        var children = this.root.children;
        var totalWidth = 0;
        for (var i = 0, len = children.length; i < len; i++)
            totalWidth += children[i].offsetWidth;
        return totalWidth;
    };
    skrolr.prototype.forward = function () {
        return this.goto(this.curPos + this.scrollBy, true);
    };
    skrolr.prototype.backward = function () {
        return this.goto(this.curPos - this.scrollBy, true);
    };
    skrolr.prototype.goto = function (loc, noStop) {
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
            var children_1 = skrolr.Array.from(this.root.children).slice(0, distToRight);
            var sumWidth = 0;
            for (var _i = 0, children_2 = children_1; _i < children_2.length; _i++) {
                var child = children_2[_i];
                var obj = child;
                sumWidth += obj.offsetWidth;
                var copy = obj.cloneNode(true);
                this.root.appendChild(copy);
            }
            this.root.style.transition = this.moveTime + 'ms ' + this.transitionTiming;
            this.root.style.left = -1 * sumWidth + 'px';
            var that_3 = this;
            setTimeout(function () {
                that_3.root.style.transition = '0s';
                that_3.root.style.left = '0';
                for (var _i = 0, children_3 = children_1; _i < children_3.length; _i++) {
                    var child = children_3[_i];
                    that_3.root.removeChild(child);
                }
            }, this.moveTime);
        }
        else {
            this.curPos = loc;
            var that_4 = this;
            var children_4 = skrolr.Array.from(this.root.children).slice(-distToLeft);
            var sumWidth = 0;
            var len = children_4.length;
            for (var i = 0; i < len; i++) {
                var obj = children_4[len - i - 1];
                sumWidth += obj.offsetWidth;
                var copy = obj.cloneNode(true);
                this.root.insertBefore(copy, that_4.root.firstChild);
            }
            this.root.style.transition = "0s";
            this.root.style.left = -1 * sumWidth + 'px';
            setTimeout(function () {
                that_4.root.style.transition = that_4.moveTime + 'ms ' + that_4.transitionTiming;
                that_4.root.style.left = '0';
            }, 0);
            setTimeout(function () {
                for (var _i = 0, children_5 = children_4; _i < children_5.length; _i++) {
                    var child = children_5[_i];
                    that_4.root.removeChild(child);
                }
            }, this.moveTime);
        }
        var that = this;
        setTimeout(function () {
            that.inTransition = false;
        }, this.moveTime);
        return this;
    };
    skrolr.prototype.start = function () {
        this.wasRunning = true;
        this.isRunning = true;
        var that = this;
        clearInterval(this.interval);
        this.interval = setInterval(function () {
            that.forward();
        }, this.moveTime + this.waitTime);
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
skrolr.Array = (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.from = function (obj) {
        var arr = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            arr[i] = obj[i];
        }
        return arr;
    };
    return class_1;
}(Array));
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
