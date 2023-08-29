"use strict";

var APP = window.APP || {};

define(function($) {
	/**
	    @static
	    @description    Header
	    @example 		-
	*/


	APP.Header = (function ($) {
	    function init () {
	    	require(["lib/jquery/jquery-ui-1.8.24.custom.min"], function(jQueryUI) {
				// inject logo
				$("#page").append('<div class="logo"><div class="text"></div><a href="/">home</a></div>');

				// handle scroll events
				$(window).bind("scroll", function() {
					var header = $("#header");
					
					if(window.pageYOffset > 30) {
						header.addClass("fixed");

						if (window.pageYOffset >= 61) {
							header.addClass("dropshadow");
						} else {
							header.removeClass("dropshadow");
						}
					} else {
						header.removeClass("fixed");
					}

					if(window.pageYOffset > 60) {
						var to_top = document.querySelector("#footer .top");
						to_top.className = "top show";
					}
					else {
						var to_top = document.querySelector("#footer .top");
						to_top.className = to_top.className.replace(/ show/, "");
					}
				});

				
				
				$("#navigation ul li").hover(function(event) {
					APP.handleDropdown("ul", this, event, function(element, trigger) {
						var $items = $("ul li", trigger);
						var iniHeight;
						var dropDown = {
							animationSpeed: 150
						}

						$("ul li", trigger).each(function(index, key) {
							iniHeight = iniHeight || $(this).height();

							$(this).css({
								height: 0,
								opacity: 0,
								left: "-50px"
							});

							setTimeout(function() {
								$items.eq(index).stop().animate({
									left: 0,
									opacity: 1,
									height: iniHeight + "px"
								}, dropDown.animationSpeed);
							}, dropDown.animationSpeed/6 * index, "easeOutQuart");
						});
					});
				});

				$("div.logo").hover(function() {
					$(".text", this).stop().css({"top": "81px"}).animate({
						top: "0px"
					}, 600, "easeOutQuart");
				}, function() {
					$(".text", this).stop().animate({
						top: "81px"
					}, 350, "easeInQuart");
				});

				var keys     = [];
				var konami  = '38,38,40,40,37,39,37,39,66,65';

				$(document).bind("keyup", function(e) {
				    keys.push( e.keyCode );
				    if ( keys.toString().indexOf( konami ) >= 0 ){
				        $("div.logo .text").addClass("konami");
				        keys = [];
				    }
				});
					
				$(window).resize(_handleToTop);

				function _handleToTop() {
					if ($(document).width() < 1185) {
						$("body").addClass("narrow");
					} else {

						$(".top").css({"right": ($("body").width()-$("#content").width())/4-($(".top").width()/2) + "px"});
						$("body").removeClass("narrow");
					}
				}

				_handleToTop();

				require(["lib/jquery/jquery.scrollTo-1.4.3.1-min"], function(scrollTo) {
					$(".top a").click(function(e) {
						$(window).scrollTo(0, 1000, {"easing": "easeInOutCubic"});
					});
				});

		        return true
	        });
	    }

	    return {
	    	init: init
	    };


	}(jQuery));

	return APP.Header;


});

