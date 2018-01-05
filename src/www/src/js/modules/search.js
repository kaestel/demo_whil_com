/**
    @static
    @description    Search
    @example 		-
*/

"use strict";


var APP = window.APP || {};	

define(function($) {
	APP.Search = function ($) {
		var search = $("div.search");
		var searchStr = $("#search_string", search);

	    function init (element) {
	    	require(["lib/jquery/jquery-ui-1.8.24.custom.min"], function(jQueryUI) {
	    		
				var searchTerm;
				
				APP.handleLabel(searchStr);

				if ($("body").is(".search")) {
					$.urlParam = function(name){
					    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
					    if (results) {
					    	return results[1] || 0;
					    }
					}

					searchTerm = decodeURI($.urlParam('q'));

					if (!searchTerm) {
						APP.handleLabel($("#search_string", search), searchAnimOut);
					} else {
						searchAnimIn();
					}
				}

				var resultContainer = ".search .autocomplete";

				searchStr.autocomplete({
					delay: 300,
					close: function() {
						$(resultContainer).hide();
					},
					open: function() {
						$(resultContainer).show();
						$(".ui-autocomplete").css("top", "0");
					},
					source: function( request, response ) {
						searchStr.addClass("loading");
						$.ajax({
						    url: $(resultContainer).attr("data-service"),
							dataType: "jsonp",
							data: {
								amount: 8,
								term: request.term
							},
							success: function( data ) {
								if (data.Result.length) {
									$(resultContainer).show();
								} else {
									$(resultContainer).hide();
									//Tracking
									_gaq.push(['_trackEvent', 'Search', '0-result', searchStr.val(), 0, true]);
								}
								searchStr.removeClass("loading");
								response($.map(data.Result, function(item) {
									return {
										label: item,
										value: item
									}
								}));
							}
						});
					},
					appendTo: resultContainer,
					select: function(event, ui) {
						APP.Search.handleSearch($(this).val(), ui.item.label, $(this));
					}
				});

				search.on("click", "#search_button", function() {
					handleSearch($("#search_string").val(), $("#search_string").val());
					return false;
				});

				/* IPAD FIX */
				if (APP.browser.isiPad) {
					search.on("focus", "#search_string", function() {
						$("body").scrollTop(0);
						$("#header").removeClass("fixed");
					});
				}

				search.on("keyup", "#search_string", function(e) {
					if (!$(this).val().length) {
						$(resultContainer).hide();
					}
					if (e.keyCode == 13) {
						APP.Search.handleSearch($("#search_string").val(), $("#search_string").val());
					}
				});

				// search input animation
				function searchAnimOut() {
					if (!searchStr.is(":focus") && !$("#search_string:hover", search).length && !searchStr.val() == "" && (searchStr.val().length && searchStr.val() == searchStr.data("defaultValue"))) {
						search.removeClass("active");
						$(".field", search).stop().animate({
							width: "53px"
						}, APP.Header.animationSpeed, "easeOutQuart");
					}
				}

				function searchAnimIn() {
					search.addClass("active");
					$(".field", search).stop().animate({
						width: "320px"
					}, APP.Header.animationSpeed, "easeOutQuart");
				}

				search.bind("mouseenter", function() {
					searchAnimIn();
				}).bind("mouseleave", function() {
					searchAnimOut();;
				});

			});
	    }

		function handleSearch(string, result, element) {
			if (searchStr.val() != searchStr.data("defaultValue")) {
				if (element) {
					element.val(result);
	            }

				document.location.href = searchStr.attr("data-url") + "?q=" + encodeURI(result);
			}
		}

		//Public functions
	    return {
	    	init: init,
	    	handleSearch: handleSearch
	    };

	}(jQuery);

	return APP.Search;


});

