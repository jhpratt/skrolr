/* skrolr v0.4.0
 * MIT license
 * Jacob H. Pratt
 * jhprattdev@gmail.com
 */

let skrolrs: skrolr[] = [];
class skrolr {
	// initialize variables for later
	private parent: HTMLElement;
	private elem: HTMLElement;
	private numWide: number[][]; // array of options
	private numObjs: number;
	private curPos: number = 0;
	private moveTime: number;
	private waitTime: number;
	private transitionTiming: string;
	private interval: number;
	
	pmod(x:number, n:number): number { return ((x%n)+n)%n; }
	
	public constructor(elem, params) {
		skrolrs.push(this);
		
		switch(typeof elem) {
			case "object":
				this.elem = elem;
				break;
			case "string":
				this.elem = document.getElementById(elem);
				break;
			default:
				console.log("Error: parameter passed must be DOM object or ID of a DOM object");
				return;
		}
		this.elem.className = "sk";
		
		this.numWide = params.numWide;
		this.numObjs = this.elem.children.length; // for determining if left/right is faster
		this.moveTime = params.moveTime || 500;
		this.waitTime = params.waitTime || 3000;
		this.transitionTiming = params.transitionTiming || "ease-in-out";
		
		// create parent element
		this.parent = document.createElement("div");
		this.parent.style.position = "relative";
		this.parent.style.overflow = "hidden";
		
		// set size of parent element
		if(typeof params.height !== undefined) {
			this.parent.style.height = params.height;
		}
		if(typeof params.width !== undefined) {
			this.parent.style.width = params.width;
		}
		if(typeof params.size !== undefined) {
			let size = params.size.split(" ");
			this.parent.style.width = size[0];
			this.parent.style.height = size[1];
		}
		
		this.elem.parentElement.insertBefore(this.parent, this.elem);
		this.parent.appendChild(this.elem);
		// end create parent
		
		if( params.arrows !== false ) { // create arrows, hidden
			const that = this;
			
			let leftArrow: HTMLElement = document.createElement("div");
			leftArrow.className = "sk-arrow sk-left sk-hidden";
			leftArrow.onclick = function() { that.backward(); }
			this.parent.appendChild(leftArrow);
			
			let rightArrow: HTMLElement = document.createElement("div");
			rightArrow.className = "sk-arrow sk-right sk-hidden";
			rightArrow.onclick = function() { that.forward(); }
			this.parent.appendChild(rightArrow);
			
			// show/hide on mouseover/out
			this.parent.addEventListener("mouseover", function() { that.stop(); that.toggleArrows(); });
			this.parent.addEventListener("mouseout", function() { that.stop(); that.toggleArrows(); });
		}
		
		if( params.buttons !== false ) { // create buttons, hidden
			let buttons: HTMLElement = document.createElement("div");
			buttons.className = "sk-button-cont sk-hidden";
			this.parent.appendChild(buttons);
			
			// show/hide on mouseover/out
			const that = this;
			this.parent.addEventListener("mouseover", function() { that.toggleButtons(); });
			this.parent.addEventListener("mouseout", function() { that.toggleButtons(); });
			
			// create individual buttons
			for(let i=0, len=this.elem.children.length; i<len; i++) {
				let btn = document.createElement("div"); // buttons (inside container)
				btn.className = "sk-button";
				btn.onclick = function() { that.goto(i); };
				buttons.appendChild(btn);
			}
		}
		
		this.start();
	}
	
	public toggleArrows(): void {
		this.parent.children[1].classList.toggle("sk-hidden");
		this.parent.children[2].classList.toggle("sk-hidden");
	}
	public toggleButtons(): void {
		this.parent.children[3].classList.toggle("sk-hidden");
	}
	public autoWidth(): void { // set all children to correct size (in pct)
		for( let i=0, len=this.numWide.length; i<len; i++ ) {
			if( this.numWide[i][0] <= this.elem.offsetWidth && (this.elem.offsetWidth < this.numWide[i][1] || typeof this.numWide[i][1] === "undefined" || this.numWide[i][1] === null) ) { // match
				const children = this.elem.children;
				for( let i=0, len=children.length; i<len; i++ ) { // set all children
					(<HTMLElement>children[i]).style.width = 100/this.numWide[i][2]+"%";
				}
				break;
			}
		}
	}
	private childrenWidth(): number { // get total width of all children of an object
		const children = this.elem.children;
		let totalWidth: number = 0;
		for( let i=0, len=children.length; i<len; i++ ) {
			totalWidth += (<HTMLElement>children[i]).offsetWidth;
		}
		return totalWidth;
	}
	
	public forward(): void {
		this.curPos = this.pmod(this.curPos+1, this.numObjs);
		
		const firstChild = <HTMLElement>this.elem.firstElementChild;
		const copy = <HTMLElement>firstChild.cloneNode(true);
		this.elem.appendChild(copy);
		
		this.elem.style.transition = this.moveTime+'ms '+this.transitionTiming;
		this.elem.style.left = '-'+firstChild.offsetWidth+'px';
		
		const that = this;
		setTimeout( function() {
			that.elem.style.transition = '0s';
			that.elem.style.left = '0';
			that.elem.removeChild(firstChild);
		}, this.moveTime);
	}
	public backward(): void {
		this.curPos = this.pmod(this.curPos-1, this.numObjs);

		// get last object and move to front
		const lastChild = <HTMLElement>this.elem.lastElementChild;
		const copy = <HTMLElement>lastChild.cloneNode(true);
		this.elem.insertBefore(copy, this.elem.firstElementChild);
		
		this.elem.style.transition = "0s";
		this.elem.style.left = -1*copy.offsetWidth+"px";
		
		const that = this;
		setTimeout( function() { // force queue in correct order
			that.elem.style.transition = that.moveTime+'ms '+that.transitionTiming;
			that.elem.style.left = "0";
		}, 0);
		setTimeout( function() {
			that.elem.removeChild(lastChild);
		}, this.moveTime );
	}
	public goto(loc, origDist?) {
		//
	}
	
	public start(): void {
		const that = this;
		this.interval = setInterval( function() {
			that.forward();
		}, this.moveTime + this.waitTime );
	}
	public stop(): void {
		clearInterval( this.interval );
	}
}

// resize all child elements on window resize
window.onresize = function() {
	for( let i=0, len=skrolrs.length; i<len; i++ ) {
		skrolrs[i].autoWidth();
	}
};
