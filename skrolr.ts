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
	private size: number; // size of parent object
	private numWide: number[][]; // array of options
	private settimeout: number[]; // typeof setTimeout is number
	private numObjs: number;
	private eachWidth: number;
	
	public constructor(elem, params) {
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
			let leftArrow: HTMLElement = document.createElement("div");
			leftArrow.className = "sk-arrow sk-left sk-hidden";
			this.parent.appendChild(leftArrow);
			
			let rightArrow: HTMLElement = document.createElement("div");
			rightArrow.className = "sk-arrow sk-right sk-hidden";
			this.parent.appendChild(rightArrow);
			
			// show/hide on mouseover/out
			const that = this;
			this.parent.addEventListener("mouseover", function() { that.toggleArrows(); });
			this.parent.addEventListener("mouseout", function() { that.toggleArrows(); });
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
	}
	
	public toggleArrows(): void {
		this.parent.children[1].classList.toggle("sk-hidden");
		this.parent.children[2].classList.toggle("sk-hidden");
	}
	public toggleButtons(): void {
		this.parent.children[3].classList.toggle("sk-hidden");
	}
	public autoWidth(): void {
		// find the size each child element should be
		for( let i=0, len=this.numWide.length; i<len; i++ ) {
			if( this.numWide[i][0] <= this.elem.offsetWidth && (this.elem.offsetWidth < this.numWide[i][1] || typeof this.numWide[i][1] === "undefined" || this.numWide[i][1] === null) ) { // match
				this.eachWidth = this.elem.offsetWidth/this.numWide[i][2];
				break;
			}
		}
		// set each child element to calculated width
		for( let i=0, len=this.elem.children.length; i<len; i++ ) {
			(<HTMLElement>this.elem.children[i]).style.width = this.eachWidth+"px";
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
	public goto(loc, spd=500, origDist?) {
		//
	}
	public start() { // original skrolr() prototype
		//
	}
	
	// take functions like `forward()`, `backward()`, `stop()` etc. and split off
	public forward() {
		//
	}
	public backward() {
		//
	}
	public stop() {
		//
	}
}

// resize all child elements on window resize
window.onresize = function() {
	for( let i=0, len=skrolrs.length; i<len; i++ ) {
		skrolrs[i].autoWidth();
	}
};
