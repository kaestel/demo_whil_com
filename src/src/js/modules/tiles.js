/**
@static
@description    Tiles
@example 		-
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

define(function ($) {
    APP.Tiles = function ($) {
        function init() {
            var _this = this;

            if (document.location.href.indexOf("fade") >= 0) {
                APP.Tiles.fade = true;
            }

            require(["lib/jquery/jquery.scrollTo-1.4.3.1-min", "lib/jquery/jquery.backgroundpos.min"], function (scrollTo, backgroundpos) {

                _this.loadMore();

                $(".load-more").click(function () {
                    _this.loadMore();
                });


                $("#content").on("hover click", ".box", function (event) {
                    _tileHandler(this, event);
                });

                $(window).scroll(function () {
                    if (_this.ready && (window.innerHeight + $(window).scrollTop()) >= ($(document).height() - _this.buffer)) {
                        _this.loadMore();
                    }
                });
            });
        }

        function _tileHandler(elm, event) {
            var animSpeed = 600,
                easing = "easeOutExpo";

            if (event.type == "mouseenter") {
                //console.log("mouseover");
                //$elm.addClass("hover");
                if ($(elm).is(".image")) {
                    $(elm).children().stop().animate({ backgroundPosition: '0px ' + 0 + 'px' }, animSpeed, easing);
                    $(elm).find("p").stop().animate({ top: '0px'}, animSpeed, easing);
                } else {
                    $(elm).find(".category, h2, p").stop().animate({ color: "#222" }, animSpeed, easing);
                }
                $(elm).find("ul").stop().animate({ bottom: '20px'}, animSpeed, easing);

            } else if (event.type == "mouseleave") {
                if ($(elm).is(".image")) {
                    $(elm).children().stop().animate({ backgroundPosition: '0px ' + (-240) + 'px' }, animSpeed, easing);
                    $(elm).find("p").stop().animate({ top: '240px'}, animSpeed, easing);
                } else {
                    if (!APP.browser.isiPad) {
                        $(elm).find(".category, h2, p").stop().animate({ color: "#777" }, animSpeed, easing);
                    }
                }
                $(elm).find("ul").stop().animate({ bottom: '-20px'}, animSpeed, easing);
                //console.log("mouseout");
            } else if (event.type == "click") {
                if ($("a", this).is(":visible")) {
                    document.location.href = $(elm).find(".more a").attr("href");
                }
            }
        }


        function loadMore(rows) {
            var _this = this;

            if (_this.ready) {
                _this.ready = false;
            } else {
                return false;
            }

            rows = typeof rows === 'number' ? Math.max(0, rows) : 3;

            require(["lib/jquery/jquery.scrollTo-1.4.3.1-min", "lib/jquery/jquery-ui.min", "lib/jquery/jsrender-734d3bd"], function (scrollTo, jQueryUI, jsrender) {
                var articleGrid = $('.articlegrid');
                var container = articleGrid.data("container");
                var key = articleGrid.data("key");
                var service = articleGrid.data("service");
                var state = articleGrid.data("articlegridstate");
                if (!state) {
                    state = { offset: 0, end: false, cache: [] };
                    articleGrid.data("articlegridstate", state);
                }
                var template = $("#" + articleGrid.data("template"));

                var rowCountLimit = rows;
                var rowUnitCountLimit = 4;
                var maxUnitAmount = rowCountLimit * rowUnitCountLimit;
                var elementCount = 0;

                var completeAction = function () {
                    if (elementCount <= 0) {
                        if (!state.end || state.cache.length > 0) {
                            _this.ready = true;
                        } else {
                            _this.ready = false;
                            $(".load-more").hide();
                        }
                    }
                };

                var successAction = function () {
                    var structure = { 'rows': [] };

                    for (var rowCount = 0; rowCount < rowCountLimit; rowCount++) {
                        var rowUnitCount = 0;
                        var currentRow = { 'items': [] };

                        $.each(state.cache, function () {
                            if (rowUnitCount + this.Size <= rowUnitCountLimit) {
                                rowUnitCount += this.Size;
                                currentRow.items.push(this);
                            } else {
                                return false;
                            }
                        });

                        if (currentRow.items.length > 0) {
                            state.cache.splice(0, currentRow.items.length);
                            structure.rows.push(currentRow);
                        } else {
                            break;
                        }
                    }

                    if (structure.rows.length > 0) {
                        var html = template.render(structure);
                        var $container = template.before(html).prev();
                        
                        var elements = []; //Container for all elements

                        $(".horBoxes", $container).each(function (index, key) {
                            var $horBox = $(this);
                            var boxLength = $(".box", $horBox).length;
                            $horBox.children().each(function (index, key) {
                                elements.push($(this));
                            });
                        });

                        $container.css({ 'height': structure.rows.length * 241 + 'px' });

                        if (APP.browser.isiPad && $(window).scrollTop() > 0) {
                            $("body").scrollTo($("body").scrollTop() + structure.rows.length * 200, 300);
                        }

                        elementCount = elements.length;

                        $(elements).each(function (index, key) {
                            var element = $(this);
                            var baseSpeed = 300;
                            var extraSpeed = 100;

                            var origWidth = element.width();
                            var origHeight = element.height();
                            var easing = "easeInOutExpo";

                            var prestate = {
                                "margin-top": "-0px"
                            };

                            element.width(0).hide();

                            var timeToNext = baseSpeed + (index * extraSpeed);

                            var chainAnim = setTimeout(function () {
                                element.css(prestate).show().animate({
                                    width: origWidth,
                                    "margin-top": 0
                                }, baseSpeed, easing, function () {
                                    elementCount--;
                                    completeAction();
                                    if ((window.innerHeight + $(window).scrollTop()) >= ($(document).height() - _this.buffer)) {
                                        _this.loadMore();
                                    }
                                });

                            }, timeToNext, easing);

                        });
                    }
                };

                if (!state.end && state.cache.length < maxUnitAmount) {
                    $.ajax({
                        url: service,
                        data: { 'container': container, 'key': key, 'amount': maxUnitAmount - state.cache.length, 'offset': state.offset },
                        success: function (data) {
                            if (!data.Error && data.Result) {
                                $.merge(state.cache, data.Result.Articles);
                                state.offset = data.Result.Offset + data.Result.Articles.length;
                                state.end = data.Result.EndOfResults;
                                successAction();
                            }
                        },
                        complete: completeAction,
                        dataType: 'json',
                        async: true
                    });
                } else {
                    successAction();
                    completeAction();
                }
            });
        }

        //Public functions
        return {
            "init": init,
            "loadMore": loadMore,
            "buffer": 50
        };

    } (jQuery);

    APP.Tiles.ready = true;

    return APP.Tiles;
});	