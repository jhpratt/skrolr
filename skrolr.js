"use strict";
let skrolrs = [];
class skrolr {
    constructor(root, params) {
        this.curPos = 0;
        skrolrs.push(this);
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
        this.numObjs = this.root.children.length;
        this.moveTime = params.moveTime || 500;
        this.waitTime = params.waitTime || 3000;
        this.transitionTiming = params.transitionTiming || "ease-in-out";
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
        if (params.arrows !== false) {
            const that = this;
            let leftArrow = document.createElement("div");
            leftArrow.className = "sk-arrow sk-left sk-hidden";
            leftArrow.onclick = function () { that.backward(); };
            this.parent.appendChild(leftArrow);
            let rightArrow = document.createElement("div");
            rightArrow.className = "sk-arrow sk-right sk-hidden";
            rightArrow.onclick = function () { that.forward(); };
            this.parent.appendChild(rightArrow);
            this.parent.addEventListener("mouseover", function () { that.stop(); that.toggleArrows(); });
            this.parent.addEventListener("mouseout", function () { that.stop(); that.toggleArrows(); });
        }
        if (params.buttons !== false) {
            let buttons = document.createElement("div");
            buttons.className = "sk-button-cont sk-hidden";
            this.parent.appendChild(buttons);
            const that = this;
            this.parent.addEventListener("mouseover", function () { that.toggleButtons(); });
            this.parent.addEventListener("mouseout", function () { that.toggleButtons(); });
            for (let i = 0, len = this.root.children.length; i < len; i++) {
                let btn = document.createElement("div");
                btn.className = "sk-button";
                btn.onclick = function () { that.goto(i); };
                buttons.appendChild(btn);
            }
        }
        this.start();
    }
    pmod(x, n) { return ((x % n) + n) % n; }
    toggleArrows() {
        this.parent.children[1].classList.toggle("sk-hidden");
        this.parent.children[2].classList.toggle("sk-hidden");
    }
    toggleButtons() {
        this.parent.children[3].classList.toggle("sk-hidden");
    }
    autoWidth() {
        for (let i = 0, len = this.numWide.length; i < len; i++) {
            if (this.numWide[i][0] <= this.root.offsetWidth && (this.root.offsetWidth < this.numWide[i][1] || typeof this.numWide[i][1] === "undefined" || this.numWide[i][1] === null)) {
                const children = this.root.children;
                for (let i = 0, len = children.length; i < len; i++) {
                    children[i].style.width = 100 / this.numWide[i][2] + "%";
                }
                break;
            }
        }
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
        this.curPos = this.pmod(this.curPos + 1, this.numObjs);
        const firstChild = this.root.firstElementChild;
        const copy = firstChild.cloneNode(true);
        this.root.appendChild(copy);
        this.root.style.transition = this.moveTime + 'ms ' + this.transitionTiming;
        this.root.style.left = '-' + firstChild.offsetWidth + 'px';
        const that = this;
        setTimeout(function () {
            that.root.style.transition = '0s';
            that.root.style.left = '0';
            that.root.removeChild(firstChild);
        }, this.moveTime);
    }
    backward() {
        this.curPos = this.pmod(this.curPos - 1, this.numObjs);
        const lastChild = this.root.lastElementChild;
        const copy = lastChild.cloneNode(true);
        this.root.insertBefore(copy, this.root.firstElementChild);
        this.root.style.transition = "0s";
        this.root.style.left = "-" + copy.offsetWidth + "px";
        const that = this;
        setTimeout(function () {
            that.root.style.transition = that.moveTime + 'ms ' + that.transitionTiming;
            that.root.style.left = "0";
        }, 0);
        setTimeout(function () {
            that.root.removeChild(lastChild);
        }, this.moveTime);
    }
    goto(loc) {
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
            let i;
            for (i in children) {
                const obj = children[i];
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
    }
    start() {
        const that = this;
        this.interval = setInterval(function () {
            that.forward();
        }, this.moveTime + this.waitTime);
    }
    stop() {
        clearInterval(this.interval);
    }
}
window.onresize = function () {
    for (let i = 0, len = skrolrs.length; i < len; i++) {
        skrolrs[i].autoWidth();
    }
};
