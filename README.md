<sub><super>NB: *skrolr* relies on CSS transitions, and has no JavaScript backup. All modern browsers support this, but IE9- does not. Everything *should* work in IE10+, as well as any modern version of Firefox, Chrome, and Safari (as they auto-update). Also, the jQuery library is only included for compatibility purposes. There is no requirement to use jQuery with *skrolr*.</super></sub>

*skrolr* library
===

## [Live demo](https://jhpratt.github.io/skrolr)
[GitHub](https://github.com/jhpratt/skrolr) | 
[npm](https://www.npmjs.com/package/skrolr)

### &#x2713; No dependencies.
### &#x2713; Lightweight.
### &#x2713; Easy to use.

*skrolr* is a JavaScript library intended to make creating responsive, easy to use marquee a piece of cake. *skrolr* has no dependencies (not even jQuery!), and is very lightweight, so it can be used pretty much everywhere. How small is *skrolr*? If all you want is the basics, it's only **396 bytes total**.

Don't believe how easy it is? Here's all that's required to create a basic *skrolr*:

```html
<script src="skrolr.basic.min.js"></script>
<link rel="stylesheet" href="skrolr.basic.min.css">
<ul id="obj">
	<li>1</li>
	<li>2</li>
	<li>3</li>
</ul>

<script>
let x = document.getElementById("obj");
new skrolr(x);
</script>
```

And for a full-featured *skrolr*:

```html
<script src="skrolr.es6.js"></script>
<script rel="stylesheet" href="skrolr.min.css">
<ul id="obj">
	<li>1</li>
	<li>2</li>
	<li>3</li>
</ul>

<script>
new skrolr( "obj", { // can pass an HTMLElement or ID
	waitTime: 2000,
	moveTime: 750,
	size: "100% 400px",
	arrows: true,
	buttons: true,
	numWide: [
		[   0,  500, 1],
		[ 500,  750, 2],
		[ 750, 1000, 3],
		[1000, 1250, 4],
		[1250, 1500, 5],
		[1500, 1750, 6],
		[1750,     , 7]
	]
});
</script>
```

### What file do I use?

There are many files to choose from. If you want to do create your own API for *skrolr*, you probably want the basic version. For most people, you'll either want the ES6 or ES3 file, minified of course. The functionality is identical, but ES6 is smaller and much easier to read.

If you're helping in development, use the TypeScript file. Running `auto-compile.js` in the background (with node) does just that, automatically compiling and minifying the TypeScript to ES3 and ES6.

### Timing

Let's set some timing when we initialize a *skrolr*.

```javascript
new skrolr( "id", {
	waitTime: 1000,
	moveTime: 350
});
```

### Stopping

What if you want to stop a *skrolr*?

```javascript
skObject.stop();
```

### Forward and backward

Lots of scrollers have controls to go forwards and backwards. *skrolr* can do that too. The best part? There's tons of ways to call it, so it's easy to remember.

```javascript
skObject.forward();
skObject.backward();
```

### Number of objects wide

Having the ability to only show a certain number of objects at a time can be immensely useful. *skrolr* allows you to do this by default, and it's as easy as you'd hope.

```javascript
new skrolr( "id", {
	// [minSize, maxSize, numberShown]
	[   0,  500, 1], // if width of parent is 0-499px, show 1 <li> element
	[ 500,  750, 2], // " 500-749 px, show 2 <li> elements
	[ 750, 1000, 3],
	[1000, 1250, 4],
	[1250, 1500, 5],
	[1500, 1750, 6],
	[1750,     , 7] // for the highest number, don't set a maximum size
});
```

### Transition timing

By default, *skrolr* uses `ease-in-out` for the transition-timing property in CSS. If you want to use another timing function, here's how you can set it:
javascript
```javascript
new skrolr( "id", {
	transitionTiming: 'linear'
});
```

### Arrows

If you want to add forward/back arrows to *skrolr*, just tell *skrolr* to show the arrows and don't worry about anything else.

```javascript
new skrolr( "id", {
	arrows: true
});
```

### Buttons

Similar to arrows, control buttons allow you to jump to a certain location.

```javascript
new skrolr( "id", {
	buttons: true
});
```

### Size

Give *skrolr* a certain size with an auto-generated parent element.

```javascript
new skrolr( "id", {
	width: '100%',
	height: '400px'
});
```

Or if you prefer a shorthand

```javascript
new skrolr( "id", {
	size: '100% 400px' // width then height
});
```

### Scroll by

It's possible to scroll by multiple elements at once. To scroll backwards, scroll by a negative number.

Scrolling by zero is allowed, but useless.

```javascript
new skrolr( "id", {
	scrollBy: 1 // default value
	// scrollBy: -1 // reverse direction
});
```

### Randomize

You can randomize the order of the children on load.

```javascript
new skrolr( "id", {
	randomize: true
});
```

### Additional features

 - Stop scrolling if viewport is blurred
 - Stop scrolling if element not in viewport
 - Creation of object with id or HTMLElement object
 - `.each()` method on `skrolr` class, allowing a function to be run on every *skrolr* in the page

### Namespace

All JavaScript is contained within the `skrolr` namespace, including a custom polyfill class. All CSS is in the namespace `sk-*`.
