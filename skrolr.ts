/* skrolr v0.4.0
 * MIT license
 * Jacob H. Pratt
 * jhprattdev@gmail.com
 */

let skrolrs: skrolr[] = [];
class skrolr {
	// initialize variables for later
	private parent: HTMLElement;
	private root: HTMLElement;
	private numObjs: number;
	private curPos: number = 0;
	private interval: number;
	public numWide: number[][]; // array of options
	public moveTime: number;
	public waitTime: number;
	public transitionTiming: string;
	
	private pmod(x:number, n:number): number { return ((x%n)+n)%n; }
	
	public constructor(root: HTMLElement|string, params) {
		skrolrs.push(this);
		
		switch(typeof root) {
			case "object":
				this.root = <HTMLElement>root;
				break;
			case "string":
				this.root = document.getElementById(<string>root);
				break;
			default:
				console.log("Error: parameter passed must be DOM object or ID of a DOM object");
				return;
		}
		this.root.className = "sk";
		
		this.numWide = params.numWide;
		this.numObjs = this.root.children.length; // for determining if left/right is faster
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
		
		this.root.parentElement.insertBefore(this.parent, this.root);
		this.parent.appendChild(this.root);
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
			for(let i=0, len=this.root.children.length; i<len; i++) {
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
			if( this.numWide[i][0] <= this.root.offsetWidth && (this.root.offsetWidth < this.numWide[i][1] || typeof this.numWide[i][1] === "undefined" || this.numWide[i][1] === null) ) { // match
				const children = this.root.children;
				for( let i=0, len=children.length; i<len; i++ ) { // set all children
					(<HTMLElement>children[i]).style.width = 100/this.numWide[i][2]+"%";
				}
				break;
			}
		}
	}
	private childrenWidth(): number { // get total width of all children of an object
		const children = this.root.children;
		let totalWidth: number = 0;
		for( let i=0, len=children.length; i<len; i++ ) {
			totalWidth += (<HTMLElement>children[i]).offsetWidth;
		}
		return totalWidth;
	}
	
	// TODO implement childrenWidth() to duplicate elements if width is too small
	
	public forward(): void {
		this.curPos = this.pmod(this.curPos+1, this.numObjs);
		
		const firstChild = <HTMLElement>this.root.firstElementChild;
		const copy = <HTMLElement>firstChild.cloneNode(true);
		this.root.appendChild(copy);
		
		this.root.style.transition = this.moveTime+'ms '+this.transitionTiming;
		this.root.style.left = '-'+firstChild.offsetWidth+'px';
		
		const that = this;
		setTimeout( function() {
			that.root.style.transition = '0s';
			that.root.style.left = '0';
			that.root.removeChild(firstChild);
		}, this.moveTime);
	}
	public backward(): void {
		this.curPos = this.pmod(this.curPos-1, this.numObjs);

		// get last object and move to front
		const lastChild = <HTMLElement>this.root.lastElementChild;
		const copy = <HTMLElement>lastChild.cloneNode(true);
		this.root.insertBefore(copy, this.root.firstElementChild);
		
		this.root.style.transition = "0s";
		this.root.style.left = "-"+copy.offsetWidth+"px";
		
		const that = this;
		setTimeout( function() { // force queue in correct order
			that.root.style.transition = that.moveTime+'ms '+that.transitionTiming;
			that.root.style.left = "0";
		}, 0);
		setTimeout( function() {
			that.root.removeChild(lastChild);
		}, this.moveTime );
	}
	
	public goto(loc: number) {
		// stop if running
		if( this.interval ) clearInterval( this.interval );
		
		let distToLeft: number = this.pmod(this.curPos-loc, this.numObjs);
		let distToRight: number = this.pmod(loc-this.curPos, this.numObjs);
		
		if( !distToLeft || !distToRight ) return; // already at location
		if( distToRight <= distToLeft ) { // move left/forward
			this.curPos = loc;
			
			// copy n elements from beginning to end
			const children = Array.from( <HTMLCollection>this.root.children ).slice(0, distToRight);
			let sumWidth: number = 0;
			let i; for( i in children ) {
				const obj = <HTMLElement>children[i];
				sumWidth += obj.offsetWidth;
				const copy = obj.cloneNode(true);
				this.root.appendChild(copy);
			}
			
			// move
			this.root.style.transition = this.moveTime+'ms '+this.transitionTiming;
			this.root.style.left = '-'+sumWidth+'px';
			
			// remove n elements from beginning
			const that = this;
			setTimeout( function() {
				that.root.style.transition = '0s';
				that.root.style.left = '0';
				let i; for(i in children) that.root.removeChild(children[i]);
			}, this.moveTime);
		}
		else { // move right/backward
			this.curPos = loc;
			
			const that = this;
			// copy n elements from end to beginning
			const children = Array.from( <HTMLCollection>this.root.children ).slice(-distToLeft);
			let sumWidth: number = 0;
			let i;
			let len = children.length; // to go in reverse order
			for( i in children ) {
				const obj = <HTMLElement>children[len-i-1]; // -1 because len is 1-index, not 0-index
				sumWidth += obj.offsetWidth;
				const copy = obj.cloneNode(true);
				this.root.insertBefore(copy, that.root.firstChild);
			}
			
			// move
			this.root.style.transition = "0s";
			this.root.style.left = "-"+sumWidth+'px';
			
			// remove n elements from end
			// const `that` already declared
			setTimeout( function() { // force queue in correct order
				that.root.style.transition = that.moveTime+'ms '+that.transitionTiming;
				that.root.style.left = '0';
			}, 0);
			setTimeout( function() {
				let i; for(i in children) that.root.removeChild(children[i]);
			}, this.moveTime );
		}
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
