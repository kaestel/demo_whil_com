"use strict";

var APP = window.APP || {};

define(function($) {
	/**
	    @static
	    @description    Social
	    @example 		-
	*/


	APP.Social = (function ($) {
		var _this = this;

	    function init () {
	    	APP.Social.fb = APP.Social.fb || {
	    		caption: "World of Whil"
	    	} //Placeholder for Facebook APP details

	    	$("meta").each(function() {
	    		var prop = $(this).attr("property");
	    		var type;

	    		if (prop) {
		    		if (prop.indexOf("og:")  > -1) {
		    			type = "og";
		    		} else if (prop.indexOf("fb:") > -1) {
		    			type = "fb";
		    		}

		    		if (type) {
		    			APP.Social.fb[$(this).attr("property").split(type + ":")[1]] = $(this).attr("content");
		    		}
	    		}
	    	});

	    	var $twitterShare = $(".social.twitter a"),
		    	$twitter = $("div.twitter"),
		    	$facebook = $(".social.facebook"),
		    	$pinterest = $(".social.pinterest a"),
		    	$share = $(".social.share a"),
		    	$disqus = $("div.disqus");

		    var popup =  {
		    	specs: 'height=450 width=550 top=' + ($(window).height()/2 - 225) +' left=' + (($(window).width()/2)-275) + ' toolbar=0 location=0 menubar=0 directories=0 scrollbars=0'
		    }
		    
		    // Twitter integration
			if ($twitter.length) {

		    	APP.Social.twitter = APP.Social.twitter || {
		    		username: $twitter.attr("data-id")
		    	}

				$(".all_tweets a", $twitter).attr("href", "https://www.twitter.com/" + APP.Social.twitter.username).attr("target", "_blank");

				$("ul.actions a", $twitter).attr("href", "https://twitter.com/intent/user?screen_name=" + APP.Social.twitter.username).attr("target", "_blank");

				$('div.twitterfeed ul').remove();
				
				require(["lib/jquery/jquery.jtweetsanywhere-1.3.1.min", "lib/jquery/pretty"], function(twitter, prettydate) {
				    $('div.twitterfeed').addClass("loading").jTweetsAnywhere({
				        username: APP.Social.twitter.username,
				        count: 3,
				        tweetDecorator: function(feed, options) {
							var tweet = feed.text + " ";

							var combinedRegex = /@\w+|(?:https?|ftp):\/\/.*?\..*?(?=\W?\s)/gi,
							    container = $("<span/>");

							var result, prevLastIndex = 0;
								combinedRegex.lastIndex = 0;

							while((result = combinedRegex.exec(tweet))) {
							    // Append the text coming before the matched entity
							    container.append($('<span/>').text(tweet.slice(prevLastIndex, result.index)));
							    if(result[0].slice(0, 1) == "@") {
							        // Twitter username was matched
							        container.append($('<a/>')
							            // .slice(1) cuts off the first character (i.e. "@")
							            .attr('href', 'http://twitter.com/' + encodeURIComponent(result[0].slice(1)))
							            .text(result[0])
							        );
							    } else {
							        // URL was matched
							        container.append($('<a/>')
							            .attr('href', result[0])
							            .text(result[0])
							        );
							    }
							    // prevLastIndex will point to the next plain text character to be added
							    prevLastIndex = combinedRegex.lastIndex;
							}
							// Append last plain text part of tweet
							container.append($('<span/>').text(tweet.slice(prevLastIndex)));

							$(".twitterfeed").removeClass("loading");

							var dateString = prettyDate(feed.created_at),
								html = '<li><div class="timestamp">' + dateString + '</div>' +	
							    '<div class="tweet"><a href="https://www.twitter.com/' + feed.user.screen_name + '" class="name" target="_blank">@' + feed.user.name + '</a> ' + container.html() + '</div></li>';
							return html;
					    }
				    });
		    	});	
			}

			$twitterShare.click(function(event) {
				event.preventDefault()
				window.open('https://twitter.com/share?url=' + document.location.href + '&text=' + encodeURI("Share Whil on Twitter"), 'twitterwindow', popup.specs);
			});

			if ($disqus.length) {
				$disqus.empty().append("<div id='disqus_thread' />");
				
	            /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
				var disqus_developer = 1; // developer mode is on
	            var disqus_shortname = 'whil'; // required: replace example with your forum shortname

	            /* * * DON'T EDIT BELOW THIS LINE * * */
	            (function() {
	                var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	                dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
	                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	            })();
			}

			$pinterest.click(function(event) {
				event.preventDefault();
			    var e = $("<script />")
			    	.attr("type"," text/javascript")
			    	.attr("charset","UTF-8")
			    	.attr("src","http://assets.pinterest.com/js/pinmarklet.js?r=" + Math.random()*99999999);
			    $("body").append(e);
			});

			$facebook.hover(function(event) {
				APP.handleDropdown(".options", this, event)
			});
			
			$facebook.find(".share a").click(function(event) {
				event.preventDefault();
				
				var shareParams = {
					app_id: APP.Social.fb.app_id,
					description: APP.Social.fb.description, 
					picture: APP.Social.fb.image,
					name: APP.Social.fb.title,
  					caption: APP.Social.fb.caption,
					redirect_uri: document.location.href, 
					link: APP.Social.fb.url, 
					display: "popup"
				}

				window.open('http://www.facebook.com/dialog/feed?' + $.param(shareParams), 'facebookwindow', popup.specs);	
			});

			//Load Facebook async
			(function(d, s, id) {
			  var js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return;
			  js = d.createElement(s); js.id = id;
			  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=" + APP.Social.fb.app_id;
			  fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
	    }

	    return {
	    	init: init
	    };


	}(jQuery));

	return APP.Social;


});

