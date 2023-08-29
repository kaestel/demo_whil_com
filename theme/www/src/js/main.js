/**!
	    This file is the main application file

	    Naming conventions:
	    functions                                   -   camelCase
	    global variables and constants              -   UPPERCASE
	    variables                                   -   camelCase
	    private variables                           -   _underscorePrefix
	    singleton-literals and prototype objects    -   PascalCase


	    Comment syntax for the entire project follows JSDoc http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
	    Further explanation:

	    @static         A module with this comment is considered static and should not be instantiated as instances. All public members are also static
	                    meaning that they can be accessed via Module.memberName and should not be instantiated as instances
	    @description    A description of the module, method or function
	    @property       A description of a property of an object: "{Type} propName description"
	    @param          A description of a function parameter: "{Type} paramName description".
	                    A paramname sorrounded by brackets [] means that it is optional: @param {Object} [extraArgs] blablabla
	                    If a param can be multiple types, a single pipe is used to seperate types eg: @param {String|Object} type blabla
	    @returns        The return value and type eg. @returns {returnType} description
*/

/**
    @static
    @description    Kicks off everything
    @dependencies   -
*/

"use strict";
var APP = window.APP || {};

/* Require JS config */
requirejs.config({
    baseUrl: '../../src/js',
    paths: {
        lib: '../../lib'
    }
});

APP.loadCSS = function(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

$("html").removeClass("not-ready");

require(["modules/header", "modules/page"], function(header, page) {
	if ($("html").is(".lt-ie9")) {
		require(["lib/jquery/jquery.pseudo"], function(beforeafter) {
			header.init();
		});	
	} else {
		header.init();
	}
});	

APP.browser = {};
APP.browser.useragent = $.browser;

APP.browser.isIE8 = $(".lt-ie9").length > 0;
APP.browser.isIE9 = $(".lt-ie10").length > 0;
APP.browser.isiPad = navigator.userAgent.match(/iPad/i) != null;

if (APP.browser.isiPad) {
	$("html").addClass("ipad");
}

if ($(".slider").length) {
	require(["modules/slider"], function(slider) {
		slider.init();
	});	
}

if ($("body.search, div.search").length) {
	require(["modules/search"], function(search) {
		search.init();
	});	
}

if ($(".videolisting").length) {
	require(["modules/video"], function(video) {
		video.init();
	});	
}

if ($(".social, div.twitter").length) {
	require(["modules/social"], function(social) {
		social.init();
	});	
}

if ($(".articlegrid, .boxes").length) {
	require(["modules/tiles"], function(tiles) {
		tiles.init($(".boxes").first());
	});	
}

if ($(".maillist").length) {
	require(["modules/maillist"], function(maillist) {
		maillist.init();
	});	
}

if ($("#footer").length) {
	require(["modules/footer"], function(footer) {
		footer.init();
	});	
}

APP.handleLabel = function(element, callback) {
	element.val(function() {
	    var $label = $("label[for='" + $(this).attr("id") + "']");
	    $(this).data("defaultValue", $label.text());
	    $label.hide()
	    return $(this).data("defaultValue")
	}).focus(function() {
	    if ($(this).val() == $(this).data("defaultValue")) {
	        $(this).val("").addClass("focus");
	    }
	}).blur(function() {
	    if ($(this).val() == "") {
	        $(this).val($(this).data("defaultValue")).removeClass("focus");
	        if (callback) {
	        	callback();
	        }
	    }
	});
}

APP.handleDropdown = function(element, trigger, event, callback) {
	if (event.type == "mouseenter") {

		clearTimeout(mouseoutTimer);

		$(trigger).siblings().find(element).hide();
		
		if (!$(element, trigger).is(":visible")) {
			$(trigger).addClass("hover");
			$(element, trigger).show();
			
			if (callback) {
				callback(element, trigger);
			}
		}
	} else if (event.type == "mouseleave") {
		var mouseoutTimer = setTimeout(function() {
			function _dropdownOut() {
				$(trigger).removeClass("hover");
				$(element, trigger).hide();
			}

			if (APP.browser.isIE8) {
				if (!$(element + ":hover").length) {
					_dropdownOut();
				}
			} else {
				if (!$(trigger).is(":hover")) {
					_dropdownOut();
				}
			}
		}, 1000);
	}
}

$(window).one("load", function(e) {
	APP._handleWindowOnLoad(e);
});

/**
    @description    Fires when all document content has finished loaded
*/
APP._handleWindowOnLoad = function (e) {
	//console.log("Window loaded", e);
}
