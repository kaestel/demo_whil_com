/**
    @static
    @description    Slider
    @example 		-
*/

"use strict";

var APP = window.APP || {};	

define(function($) {
	APP.Slider = function ($) {

		var timer = {
			countdown: null,
			start: function() {
				//console.log("Counting down");
				clearTimeout(this.countdown);
				this.countdown = setTimeout(function() {
					//console.log("Next slide");
					$(".slider").flexslider("next"); //Next slide
				}, 4000);
			},
			pause: function() {
				//console.log("Timer pause");
				clearTimeout(this.countdown);
			},
			resume: function() {
				//console.log("Timer resume");
				APP.Slider.pause = false;
				APP.Slider.timer.start();
			},
			init: function() {
				//console.log("Timer initiate");
				$(".slider").parent().mouseenter(function() {
					APP.Slider.timer.pause();
				}).mouseleave(function() {
					APP.Slider.timer.resume();
				});

				APP.Slider.timer.start();
			}
		}

	    function init (element) {
			var _this = this;

			require(["lib/jquery/flexslider/jquery.flexslider-min", "lib/jquery/jquery.backgroundpos.min"], function(flexslider,bgpos) {
				APP.loadCSS("/lib/jquery/flexslider/flexslider.css");

				APP.Slider.sliderReady = true;

				var slideshowSpeed = 4000;

				function _updateIndexNav(index) {
					$(".splash .index dl").eq(index).addClass("active").siblings().removeClass("active");
					$(".splash .index dd").not($("dd").eq(index)).slideUp(500);

				    $(".splash .index dd").eq(index).slideDown(500);

					$(".splash .index").stop().animate({backgroundPosition: '0px ' + (APP.Slider.arrowPos[index]-359) + 'px'});
				}

				$(".slider").flexslider({
			        animation: "slide",
			        direction: "horizontal",
			        easing: 'easeInOutExpo',
			        slideshow: false,
			        slideshowSpeed: 99999999,
			        useCSS: false,
			        touch: true,
			        before: function(slider) {
			        	if (!APP.Slider.pause) {
							APP.Slider.timer.start();
						}
					},
					after: function(slider) {
						APP.Slider.sliderReady = true;
						_updateIndexNav(slider.currentSlide);
					},
			        start: function(slider){var $slides = $(".slider .slides li").not(".clone");
						if ($(".slider").parent("div:hover").length) {
							$(".slider").parent("div").one("mouseleave", function() {
								APP.Slider.timer.init();	
							});
						} else {
							APP.Slider.timer.init();	
						}	

			        	$slides.show();

			        	$slides.each(function(index,key) {
			        		var category 	= $("a", this).attr("data-category"),
				        		title 		= $("a", this).attr("data-title"),
				        		link 		= $("a", this).attr("href"),
				        		desc 		= $("a", this).attr("data-desc");

						    var $cloningElm = $(".splash .index dl:last");

						    if ($slides.length > 1 && (index + 1 ) !== $slides.length) {
						       $cloningElm.clone().insertAfter($cloningElm);
						    }

						    $(".category", $cloningElm).text(category);
						    $(".headline", $cloningElm).text(title);
						    $("p", $cloningElm).text(desc);
						    $(".actions .more a", $cloningElm).attr("href", link);
						    	
			        	});
			        	
			        	APP.Slider.arrowPos = [];
			        	
			        	$(".splash .index dl").each(function() {
			        		APP.Slider.arrowPos.push($("dt", this).position().top);
			        	});
			        	
						_updateIndexNav(slider.currentSlide);
			        }
			    });
					
			    $(".splash").on("click", ".index dl", function() {
					if ($(this).is(".active")) {
						document.location.href = $("a", $(this)).attr("href");
					} else {
						if (APP.Slider.sliderReady) {
							var index = $(this).prevAll("dl").length;

						    _updateIndexNav($(this).prevAll("dl").length);

					    	APP.Slider.pause = true;

					    	$(".flex-control-paging li").eq(index).children("a").trigger("click");
						}
					}
			    });
	    	});	
	    }

		function gotoFrame (frame) {
			$('.slider').flexslider(frame);
		}

		//Public functions
	    return {
	    	init: init,
	    	timer: timer,
	    	gotoFrame: gotoFrame
	    };

	}(jQuery);

	return APP.Slider;


});

