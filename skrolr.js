"use strict";
class skrolr {
    constructor(root, params) {
        this.curPos = 0;
        this.wasRunning = false;
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
        if (typeof params.height !== undefined) {
            this.parent.style.height = params.height;
        }
        if (typeof params.width !== undefined) {
            this.parent.style.width = params.width;
        }
        if (typeof params.size !== undefined) {
            let size = params.size.split(" ");
            this.parent.style.width = size[0];
            this.parent.style.height = size[1];
        }
        this.root.parentElement.insertBefore(this.parent, this.root);
        this.parent.appendChild(this.root);
        this.autoWidth();
        if (params.arrows === true) {
            const that = this;
            let leftArrow = document.createElement("div");
            leftArrow.className = "sk-arrow sk-left sk-hidden";
            leftArrow.onclick = function () { that.stop().backward(); };
            this.parent.appendChild(leftArrow);
            let rightArrow = document.createElement("div");
            rightArrow.className = "sk-arrow sk-right sk-hidden";
            rightArrow.onclick = function () { that.stop().forward(); };
            this.parent.appendChild(rightArrow);
            this.parent.addEventListener("mouseover", function () { that.toggleArrows(); });
            this.parent.addEventListener("mouseout", function () { that.toggleArrows(); });
        }
        if (params.buttons === true) {
            let buttons = document.createElement("div");
            buttons.className = "sk-button-cont sk-hidden";
            this.parent.appendChild(buttons);
            const that = this;
            this.parent.addEventListener("mouseover", function () { that.toggleButtons(); });
            this.parent.addEventListener("mouseout", function () { that.toggleButtons(); });
            for (let i = 0; i < this.numObjs; i++) {
                let btn = document.createElement("div");
                btn.className = "sk-button";
                btn.onclick = function () { that.stop().goto(i); };
                buttons.appendChild(btn);
            }
        }
        if (document.hasFocus()) {
            this.start();
        }
    }
    static each(fn) {
        skrolr.all.forEach((obj) => { fn(obj); });
    }
    pmod(x, n) { return ((x % n) + n) % n; }
    toggleArrows() {
        this.parent.children[1].classList.toggle("sk-hidden");
        this.parent.children[2].classList.toggle("sk-hidden");
        return this;
    }
    toggleButtons() {
        this.parent.children[3].classList.toggle("sk-hidden");
        return this;
    }
    autoWidth() {
        const that = this;
        for (let i = 0, leni = this.numWide.length; i < leni; i++) {
            if (this.numWide[i][0] <= this.root.offsetWidth && (this.root.offsetWidth < this.numWide[i][1] || this.numWide[i][1] === undefined || this.numWide[i][1] === null)) {
                const children = this.root.children;
                for (let j = 0, lenj = children.length; j < lenj; j++) {
                    children[j].style.width = 100 / that.numWide[i][2] + "%";
                }
                break;
            }
        }
        return this;
    }
    childrenWidth() {
        const children = this.root.children;
        let totalWidth = 0;
        for (let i = 0, len = children.length; i < len; i++) {
            totalWidth += children[i].offsetWidth;
        }
        return totalWidth;
    }
    forward() {
        return this.goto(this.curPos + this.scrollBy, true);
    }
    backward() {
        return this.goto(this.curPos - this.scrollBy, true);
    }
    goto(loc, noStop) {
        if (!noStop)
            clearInterval(this.interval);
        loc = this.pmod(loc, this.numObjs);
        let distToLeft = this.pmod(this.curPos - loc, this.numObjs);
        let distToRight = this.pmod(loc - this.curPos, this.numObjs);
        if (!distToLeft || !distToRight)
            return;
        if (distToRight <= distToLeft) {
            this.curPos = loc;
            const children = Array.from(this.root.children).slice(0, distToRight);
            let sumWidth = 0;
            let i;
            for (i in children) {
                const obj = children[i];
                sumWidth += obj.offsetWidth;
                const copy = obj.cloneNode(true);
                this.root.appendChild(copy);
            }
            this.root.style.transition = this.moveTime + 'ms ' + this.transitionTiming;
            this.root.style.left = '-' + sumWidth + 'px';
            const that = this;
            setTimeout(function () {
                that.root.style.transition = '0s';
                that.root.style.left = '0';
                let i;
                for (i in children)
                    that.root.removeChild(children[i]);
            }, this.moveTime);
        }
        else {
            this.curPos = loc;
            const that = this;
            const children = Array.from(this.root.children).slice(-distToLeft);
            let sumWidth = 0;
            let len = children.length;
            for (let i = 0; i < len; i++) {
                const obj = children[len - i - 1];
                sumWidth += obj.offsetWidth;
                const copy = obj.cloneNode(true);
                this.root.insertBefore(copy, that.root.firstChild);
            }
            this.root.style.transition = "0s";
            this.root.style.left = "-" + sumWidth + 'px';
            setTimeout(function () {
                that.root.style.transition = that.moveTime + 'ms ' + that.transitionTiming;
                that.root.style.left = '0';
            }, 0);
            setTimeout(function () {
                let i;
                for (i in children)
                    that.root.removeChild(children[i]);
            }, this.moveTime);
        }
        return this;
    }
    start() {
        this.wasRunning = true;
        this.isRunning = true;
        const that = this;
        clearInterval(this.interval);
        this.interval = setInterval(function () {
            that.forward();
        }, this.moveTime + this.waitTime);
        return this;
    }
    stop(noSet) {
        if (!noSet)
            this.wasRunning = false;
        this.isRunning = false;
        clearInterval(this.interval);
        return this;
    }
    isVisible() {
        const bounding = this.parent.getBoundingClientRect();
        const html = document.documentElement;
        return (bounding.bottom >= 0 &&
            bounding.top <= (window.innerHeight || html.clientHeight) &&
            bounding.right >= 0 &&
            bounding.left <= (window.innerWidth || html.clientWidth));
    }
}
skrolr.all = [];
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
        const visible = obj.isVisible();
        if (!obj.isRunning && obj.wasRunning && visible)
            obj.start();
        else if (obj.isRunning && !visible)
            obj.stop(true);
    });
});
