"use strict";

var APP = window.APP || {};

define(function($) {
	/**
	    @static
	    @description    Footer
	    @example 		-
	*/

	APP.Footer = (function ($) {
	    function init () {
	    	function _toggleElements(anchor) {
				if (!anchor.next().is(":visible")) {
					$(".slideup").removeClass("expanded").slideUp();
					$(".slideup").parents("li").removeClass("expanded")
					anchor.next().slideDown(function() {
						$(this).parents("li").addClass("expanded");
					});
				} else {
					anchor.next().slideUp(function() {
						$(this).parents("li").removeClass("expanded");
					});
				}
	    	}
			$("a + .slideup").prev().click(function() {
				_toggleElements($(this));
			});
			
			//Tracking
			$("a[href^='mailto']").click(function() {
				_gaq.push(['_trackEvent', 'Contact', 'Mailto', $(this).attr("href").split("mailto:")[1], 0, true]);
			});

			$("a + .slideup .close").click(function() {
				_toggleElements($(this).parents("a + .slideup").prev());
			});

	        return true
	    }

	    return {
	    	init: init
	    };


	}(jQuery));

	return APP.Footer;


});

