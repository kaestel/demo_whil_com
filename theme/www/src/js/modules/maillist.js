/**
    @static
    @description    Mailsignup
    @example 		-
*/

"use strict";


var APP = window.APP || {};	

define(function($) {
	APP.Mailsignup = function ($) {
		var maillist = ".maillist",
			emailinput = ".signup_email";

	    function init (element) {
			APP.handleLabel($(emailinput));

			$(emailinput).on("keypress", function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) {
					APP.Mailsignup.submitMailForm($(this).parents(maillist).find(emailinput).val(), $(this).parents(maillist));
				}
			});

			$("input[type=submit]").click(function(e) {
				e.preventDefault();
				APP.Mailsignup.submitMailForm($(this).parents(maillist).find(emailinput).val(), $(this).parents(maillist));
			});

			$(".error a").click(function(e) {
				e.preventDefault();
				$(this).parents(maillist).children(".signup").show().siblings().hide();
			});

	    }

		function submitMailForm (email, $form) {
			$form.find(emailinput).addClass("loading");
			$.ajax({
				url: $(maillist).attr("data-service"),	
				type: 'POST',
				dataType: "jsonp",
				data: {
					container: $(maillist).attr("data-container"),
					key: $(maillist).attr("data-key"),
					email: email
				},
				success: function(res) {
					$form.find(emailinput).removeClass("loading");
					if (!res.Error) {
						if ($form) {
							$form.find(".receipt").show().siblings().hide();
						}
					} else {
						if ($form) {
							$form.find(".error").show().siblings().hide();
						}
					}
				}
			});
		}

		//Public functions
	    return {
	    	init: init,
	    	submitMailForm: submitMailForm
	    };

	}(jQuery);

	return APP.Mailsignup;


});

