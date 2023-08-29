"use strict";

var APP = window.APP || {};

define(function($) {
	/**
	    @static
	    @description    Header
	    @example 		-
	*/

	APP.Page = (function ($) {
	    function init () {
			$("a + .slideup").prev().click(function() {
				alert("hejsa");
			});

	        return true
	    }

		function softload () {
			var loadSpeed = 400;

			$("#content").fadeOut(loadSpeed, function() {
				$(this).load('/meditate.html #content > *', function() {
					$(this).fadeIn(loadSpeed);
				});
			});
		}

	    return {
	    	init: init,
	    	softload: softload
	    };


	}(jQuery));

	return APP.Page;


});

