/**
    @static
    @description    Video
    @example 		-
*/

"use strict";


var APP = window.APP || {};	

define(function($) {
	APP.Video = function ($) {

	    function init (element) {
	    	$(".videolisting li").each(function() {
	    		$(this).click(function(e) {
	    			e.preventDefault();
	    			var video = $("a", this).attr("href");
	    			$(this).addClass("selected").siblings().removeClass("selected");
	    			$('.video iframe').attr("src", video);
	    		})
	    	});
	    }

		//Public functions
	    return {
	    	init: init
	    };

	}(jQuery);

	return APP.Video;


});

