/* jshint ignore:start */

// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());




// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();


// usage:
// instead of setInterval(render, 16) ....

// (function animloop(){
//   requestAnimFrame(animloop);
//   render();
// })();
// place the rAF *before* the render() to assure as close to
// 60fps with the setTimeout fallback.


/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestTimeout = function(fn, delay) {
	if( !window.requestAnimationFrame       &&
		!window.webkitRequestAnimationFrame &&
		!window.mozRequestAnimationFrame    &&
		!window.oRequestAnimationFrame      &&
		!window.msRequestAnimationFrame)
			return window.setTimeout(fn, delay);

	var start = new Date().getTime(),
		handle = new Object();

	function loop(){
		var current = new Date().getTime(),
		delta = current - start;

		delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
	};

	handle.value = requestAnimFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
	window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
	window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value)   :
	window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
	window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
	window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) :
	clearTimeout(handle);
};


/**
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestInterval = function(fn, delay) {
	if( !window.requestAnimationFrame       &&
		!window.webkitRequestAnimationFrame &&
		!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
		!window.oRequestAnimationFrame      &&
		!window.msRequestAnimationFrame)
			return window.setInterval(fn, delay);

	var start = new Date().getTime(),
		handle = new Object();

	function loop() {
		var current = new Date().getTime(),
			delta = current - start;

		if(delta >= delay) {
			fn.call();
			start = new Date().getTime();
		}

		handle.value = requestAnimFrame(loop);
	};

	handle.value = requestAnimFrame(loop);
	return handle;
}

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
	window.clearRequestInterval = function(handle) {
	window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
	window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
	window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) :
	window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
	window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
	window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
	clearInterval(handle);
};

/* jshint ignore:end */



(function($, window, undefined) {
	'use strict';

	var TITOOLBOX = window.TITOOLBOX = window.TITOOLBOX || {};

	// Detect whether device supports orientationchange event, otherwise fall back to
	// the resize event.
	TITOOLBOX.orientationEvent = function() {
		var supportsOrientationChange = 'onorientationchange' in window;
		return supportsOrientationChange ? 'orientationchange' : 'resize';
	};

	// Transition event name
	// $(selector).one(TITOOLBOX.transEndEventName(), function(e) {});
	TITOOLBOX.transEndEventName = function() {
		var transEndEventNames = {
				'WebkitTransition' : 'webkitTransitionEnd',
				'MozTransition'    : 'transitionend',
				'OTransition'      : 'oTransitionEnd otransitionend',
				'msTransition'     : 'MSTransitionEnd',
				'transition'       : 'transitionend'
			},
			transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];

		// Android 4.1.2 hotfix (Samsung S3)
		if (navigator.userAgent.toLowerCase().indexOf('android 4.1') !== -1) {
			transEndEventName = 'webkitTransitionEnd';
		}

		return transEndEventName;
	};

})(jQuery, window);
