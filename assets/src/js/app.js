/*
	Markup-based means of executing JavaScript on page load (using jQuery)

	How to use:

	Add this to your <body>
	<body id="myapp" data-controller="module" data-action="action1 action2">

	Replace "myapp" to match what you put as 
	the body ID (use something meaningful and short for the project)

	Replace "MYAPP" to match what you put as the body ID (but capitalized)
*/

(function($, window, document, undefined){

	'use strict';

	var MYAPP = window.MYAPP = window.MYAPP || {};

	MYAPP.util = {
		exec: function(controller, action) {
			var ns = MYAPP,
			act = (action === undefined) ? 'init' : action;

			if (controller !== '' && ns[controller] && typeof ns[controller][act] === 'function') {
				ns[controller][act]();
			}
		},
		init: function() {
			var el = document.getElementById('myapp'), // Update the body ID here
			controller = el.getAttribute('data-controller'),
			actions = el.getAttribute('data-action');

			MYAPP.util.exec('common');
			MYAPP.util.exec(controller);

			// do all the actions too.
			$.each(actions.split(/\s+/), function(i, action){
				MYAPP.util.exec(controller, action);
			});
		}
	};


	// Common to the whole app/site
	MYAPP.common = (function() {
		var moduleVariable = '';
		var privateFunction = function() {};
		var init = function() {
			console.log('common.init');
		};

		return {
			init: init
		};
	})();


	// Example module for the homepage
	MYAPP.module = (function() {
		var moduleVariable = '';
		var privateFunction = function() {};
		var init = function() { console.log('module.init'); };
		var action1 = function() { console.log('module.action1'); };
		var action2 = function() { console.log('module.action2'); };

		return {
			init: init,
			action1: action1,
			action2: action2
		};
	})();


})(jQuery, window, document);

$(document).ready(MYAPP.util.init);
