<sub><super>NB: *skrolr* relies on CSS transitions, and has no JavaScript backup. All modern browsers support this, but IE9- does not.</super></sub>

#### Note from the creator: please add your website to the [wiki](https://github.com/jhpratt/skrolr/wiki/Who-uses-skrolr%3F) so I know who's using *skrolr*! It's great seeing my work in use.

*skrolr* library
===

## [Live demo](https://jhpratt.github.io/skrolr)
[GitHub](https://github.com/jhpratt/skrolr) | 
[npm](https://www.npmjs.com/package/skrolr) | 
[CSS Script](http://www.cssscript.com/smooth-horizontal-slider-javascript-css3-skrolr/)

### &#x2713; No dependencies.
### &#x2713; Lightweight.
### &#x2713; Easy to use.

*skrolr* is a JavaScript library intended to make creating dynamic *skrolr* a piece of cake. *skrolr* has no dependencies (not even jQuery), and is very lightweight, so it can be used pretty much everywhere. How small is *skrolr*? If all you want is the basics, it's only **495 bytes total**.

Don't believe how easy it is? Here's all that's required to create a *skrolr*:

```html
<script src="skrolr.basic.min.js"></script>
<link rel="stylesheet" href="skrolr.basic.min.css">
<ul id="skrolr">
	<li>1</li>
	<li>2</li>
	<li>3</li>
</ul>

<script>
document.getElementById("skrolr").skrolr();
</script>
```

### Timing

Let's set some timing when we initialize a *skrolr*.

```javascript
document.getElementById("skrolr").skrolr({
	waitTime: 1000,
	moveTime: 350
});
```

### Stopping

What if you want to stop a *skrolr*?

```javascript
document.getElementById("skrolr").skrolr({
	stop: true
});
```

NB: `stop` will override initialization if called together

### Forward and backward

Lots of scrollers have controls to go forwards and backwards. *skrolr* can do that too. The best part? There's tons of ways to call it, so it's easy to remember.

```javascript
// forward (5 ways)
document.getElementById("skrolr").skrolr({
	forward: 500
	// fwd: 500
	// fd: 500
	// right: 500
	// rt: 500
});
```
```javascript
// backward (5 ways)
document.getElementById("skrolr").skrolr({
	backward: 500
	// back: 500
	// bk: 500
	// right: 500
	// rt: 500
});
```

NB: `moveTime` overrides `forward` and `backward`. Using them together will move the *skrolr* forward/backward, but the time will not be what is expected/wanted.

NB: `forward` overrides `backward`

### Number of objects wide

Having the ability to only show a certain number of objects at a time can be immensely useful. *skrolr* allows you to do this by default, and it's as easy as you'd hope.

```javascript
document.getElementById("skrolr").skrolr({
	// [minSize, maxSize, numberShown]
	[0, 500, 1], // if width of parent is 0-499px, show 1 <li> element
	[500, 750, 2], // " 500-749 px, show 2 <li> elements
	[750, 1000, 3],
	[1000, 1250, 4],
	[1250,1500,5],
	[1500,1750,6],
	// for the highest number, don't set a maximum size
	[1750,, 7]
});
```

### Transition timing

By default, *skrolr* uses `ease-in-out` for the transition-timing property in CSS. If you want to use another timing function, here's how you can set it:
javascript
```
document.getElementById("skrolr").skrolr({
	transitionTiming: 'linear'
});
```

### Declaration

Sometime you might want to initialize a *skrolr* without it running. Not an issue; just declare it as a *skrolr*.

```javascript
document.getElementById("skrolr").skrolr({
	declare: true
});
```

NB: `declare` will override initialization if called together

### Arrows

If you want to add forward/back arrows to *skrolr*, just tell *skrolr* to show the arrows and don't worry about anything else.

```javascript
document.getElementById("skrolr").skrolr({
	arrows: true
});
```

### Buttons

Control buttons that jump to a certain location are, **unlike most options**, included by default. If you don't want them, pass the parameter `buttons`

```javascript
document.getElementById("skrolr").skrolr({
	buttons: false
});
```

### Size

Give *skrolr* a certain size, no parent element required.

```javascript
document.getElementById("skrolr").skrolr({
	width: '100%',
	height: '400px'
});
```

Or if you prefer a shorthand

```javascript
document.getElementById("skrolr").skrolr({
	size: '100% 400px' // width then height
});
```
