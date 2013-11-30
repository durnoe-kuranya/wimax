(function (undefined) {

    // APP OBJECT =================================================================================

    var app = function () {

        var author = '@rike',
			$body = $('body'),
			doIntro = false,
			has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

        /* 	APP.DATAHANDLER -----------------------------------------------------------------------
			handles the loading & distribution of data
		*/
        var dataHandler = function () {

            var isLoading = false,

			init = function () {

			    // loadData( endpoints.wineList, 'html', ui.manageBottles.init );

			},

			loadData = function (_endpoint, _dataType, _handler) {

			    // handler for routing data requests & responses.
			    // _endpoint is where to get the data from, _dataType is specified in case we need it (at present we don't), and _handler is the method to pass the returned data to on success

			    isLoading = true;
			    $.ajax({
			        //url			: _endpoint + '?modifier=' + scriptUtils.randRange(0,10000),
			        url: _endpoint + '?ajax=true',
			        //dataType	: _dataType,
			        //async		: false,
			        success: function (returnedData) {

			            // if success, return data to the specified handler function
			            isLoading = false;
			            ui.loader.hideLoader();
			            _handler(returnedData);

			        },
			        error: function (e) {

			            // else something dun went wrong
			            isLoading = false;
			            handleError(e);

			        }
			    });

			},

			handleError = function (e) {

			    // handle error from a data load
			    if (console.error) console.error("oops - error was " + e.status + ": " + e.statusText);

			};

            return { init: init, loadData: loadData }

        }();

        /* 	APP.URLHANDLER ------------------------------------------------------------------------
			
		*/
        var urlHandler = function () {

            var initialUrl = window.location.toString(),
				replaceStateAvail = ('replaceState' in window.history),

			init = function () {

			    if (replaceStateAvail) window.addEventListener("popstate", popHandler);

			    actionUrl();

			},

			updateUrl = function (_url) {

			    _url = _url.replace('#', '/');

			    (replaceStateAvail) ? history.pushState({ url: _url }, null, _url) : window.location.hash = '!' + _url;

			},

			popHandler = function (e) {

			    if (e.state) actionUrl();

			},

			actionUrl = function () {

			    var url = window.location.toString(),
					initialPath,
					isDynamic;

			    if (window.location.toString().indexOf('#!') > 0) {
			        // is hashbang
			        initialPath = url.split('!')[1];
			    }
			    else {
			        // is history API
			        initialPath = window.location.pathname.toString();
			    };

			    isDynamic = initialPath.indexOf('.aspx') > 0;

			    if (initialPath != '/') {
			        if (isDynamic) {
			            app.pageManager.setState('loading', initialPath);
			        }
			        else {
			            app.pageManager.setState('static', '#' + initialPath.replace('/', ''));
			        }
			        return true;
			    }
			    else {
			        pageManager.setState('grid');
			        return false;
			    }

			};

            return { init: init, updateUrl: updateUrl, actionUrl: actionUrl }

        }();

        /* 	APP.PAGEMANAGER -----------------------------------------------------------------------
			handles the loading & distribution of data
		*/
        var pageManager = function () {

            var currentState = '',
				possibleStates = ['intro', 'grid', 'menu', 'loading', 'project', 'play', 'profile', 'static'],

			init = function () {

			    //console.log("pageManager.init()");

			},

			getState = function () {

			    return currentState;

			},

			setState = function (_newState, _url) {

			    // check state is valid
			    if (possibleStates.indexOf(_newState) === -1) {
			        // if not, report error
			        pageStateError(_newState + ' is not a valid Page State.');
			    }
			    else {

			        $('.viewport').scrollTop(0);

			        // if so, update the body class
			        $body
						.removeClass(currentState)
						.addClass(_newState);

			        // set current state
			        currentState = _newState;

			        // hide any open content
			        ui.contentHandler.hideContent();

			        // hide the info pop on the grid
			        ui.spreadEm.hideInfo();

			        // take any actions required for this state
			        switch (currentState) {

			            case 'intro':
			                ui.intro.init();
			                break;

			            case 'loading':
			                //
			                if (!Modernizr.touch) {
			                    ui.doReveal();
			                    ui.spreadEm.expand();
			                }
			                ui.loader.showLoader();
			                setTimeout(function () { dataHandler.loadData(_url, 'html', ui.contentHandler.populate) }, 1000);
			                break;

			            case 'grid':
			                //
			                ui.doReveal();
			                setTimeout(function () { ui.spreadEm.retract() }, 500);
			                setTimeout(ui.killReveal, 1000);
			                break;

			            case 'menu':
			                //
			                break;

			            case 'project':
			                // 
			                setTimeout(ui.killReveal, 500);
			                break;

			            case 'static':
			                // 
			                if (!Modernizr.touch) {
			                    ui.spreadEm.expand();
			                    ui.doReveal();
			                }
			                ui.contentHandler.showContent($(_url));
			                setTimeout(ui.killReveal, 1000);
			                break;

			            default:
			                pageStateError('No handler in switch for state "' + _newState + '"');
			                break;
			        }

			    }

			},

			addState = function (_stateToAdd) {

			    $body.addClass(_stateToAdd);

			},

			removeState = function (_stateToRemove) {

			    $body.removeClass(_stateToRemove);

			},

			pageStateError = function (_msg) {

			    if (console.error) console.error("Page State Error: " + _msg);

			};

            return { init: init, getState: getState, setState: setState, addState: addState, removeState: removeState }

        }();

        function init() {

            if (screen.width > 400) {
                if (has3d) $('body').addClass('do3d');
                if (!Modernizr.touch) $('body').addClass('doItemPerspective');

                dataHandler.init();
                pageManager.init();
                urlHandler.init();

                // embed google map on 'find us' page
                $('.map').append('<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.co.nz/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=27+Sale+Street+Freemans+Bay+Auckland&amp;ie=UTF8&amp;hq=&amp;hnear=27+Sale+St,+Auckland,+1010,+Auckland&amp;t=p&amp;ll=-36.848891,174.755874&amp;spn=0.01202,0.018239&amp;z=15&amp;iwloc=&amp;output=embed"></iframe>');

                ui.init();
            }
            else {
                // mobile specific additions
                $('head').append('<meta name="viewport" content="width=device-width">');
                $('.showreel').append('<iframe id="vimeoplayer" src="http://player.vimeo.com/video/52658261?api=1&amp;player_id=vimeoplayer&amp;title=0&amp;byline=0&amp;portrait=0" width="280" height="157" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
            }

            //( doIntro ) ? pageManager.setState( 'intro' ) : pageManager.setState( 'grid' );

        }

        return { init: init, dataHandler: dataHandler, pageManager: pageManager, urlHandler: urlHandler }

    }(ui);

    // UI OBJECT ==================================================================================

    var ui = function (app, events) {

        var author = "@rike",
			$mainGrid = $('.main-grid'),
			$items = $mainGrid.find('a'),
			$menuBtn = $('.show-menu'),
			$viewPort = $('.viewport'),
			$siteNav = $('.site-menu'),
			$siteNavItems = $siteNav.find('a'),
			$fullNav = $('.full-nav'),
			$loading = $('.loading'),
			infoTimeout = null,
			menuOpen = false;

        /* 	UI.INTRO ----------------------------------------------------------------------------
			Does the 'play' introduction animation
		*/

        var intro = function () {

            var arr_classes = ['p', 'l', 'a', 'y', ''],
				arr_out = [[4, 6, 7, 12, 14, 15, 16, 18, 19, 20], [2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16], [1, 4, 6, 7, 14, 15, 18, 19], [2, 3, 6, 7, 9, 12, 13, 14, 16, 17, 19, 20]],
				int_tick = null,
				int_length = 500,
				currClass = -1,

			init = function () {

			    int_tick = setInterval(tick, int_length)

			},

			tick = function () {

			    // increment currClass
			    currClass++;

			    // remove previous intro class (e.g. for class 'l' remove class 'p' )
			    if (arr_classes[currClass - 1]) $mainGrid.removeClass(arr_classes[currClass - 1]);

			    // set current intro class
			    $mainGrid.addClass(arr_classes[currClass]);

			    // kill set styles
			    $items.attr('style', '');

			    // kill the interval if we have reached the end, my friend
			    if (currClass === arr_classes.length - 1) {
			        clearInterval(int_tick);
			        app.pageManager.setState('grid')
			        return false;
			    }

			    // randomly position items we are not using for this letter
			    for (var i = 0; i < arr_out[currClass].length; i++) {
			        $('.grid-' + arr_out[currClass][i]).css(getRandomOutPoint());
			    };

			},

			getRandomOutPoint = function () {

			    // returns a random outpoint for hidden items

			    var t = scriptUtils.randRange(0, 100),
					l = scriptUtils.randRange(0, 100);

			    return { top: t + '%', left: l + '%' };

			};

            return { init: init }

        }();

        var spreadEm = function () {

            var frag_itemInfo = '<div class="item-info"><h2><span>type:</span>Item title here</h2></div>',
				$itemInfo = null,
				screenHalfway = $('body').width() / 2,

			init = function () {

			    $('.viewport').append(frag_itemInfo);
			    $itemInfo = $('.item-info');
			    $itemInfo.data({ $title: $itemInfo.find('h2') });

			},

			expand = function () {

			    $items.not($(this)).each(getRandomPoint);

			},

			retract = function () {

			    clearTimeout(infoTimeout);
			    $items.each(killRandomPoint);

			},

			getRandomPoint = function () {

			    var maxDepth = -3000,
					minDepth = -500,
					translateXRange = screen.width / 3,
					translateZDist = scriptUtils.randRange(maxDepth, minDepth),
					opacity = 1 - (translateZDist / maxDepth),
					blur = (translateZDist / maxDepth) * 3,
					css = {
					    '-webkit-transform': 'translateZ(' + translateZDist + 'px)'
                                                        + 'rotateY(' + scriptUtils.randRange(-45, 45) + 'deg)'
                                                        + 'translateX(' + scriptUtils.randRange(0 - translateXRange, translateXRange) + 'px)',
					    '-webkit-transition-delay': scriptUtils.randRange(0, 100) + 'ms',
					    '-webkit-transition-duration': 300 + scriptUtils.randRange(0, 1000) + 'ms',
					    'opacity': opacity,
					    '-webkit-filter': 'blur( ' + blur + 'px ) saturate(20%)'
					};

			    $(this).css(css);

			},

			killRandomPoint = function () {

			    $(this).attr('style', '');

			},

			setInfo = function ($item) {

			    if ($item.length === undefined) $item = $(this);

			    var l = 0,
					t = Math.floor($item.offset().top),
					classes = 'item-info open';

			    if ($item.offset().left < screenHalfway) {
			        l = Math.ceil($item.offset().left) + $item.width();
			    }
			    else {
			        l = Math.ceil($item.offset().left) - 310;
			        classes += ' alt';
			    }

			    $itemInfo
					.attr('class', classes)
					.addClass($item.attr('data-type'))
					.data().$title.html('<span>' + $item.attr('data-type') + '</span>' + $item.attr('data-title'))
						.end()
					.css({ top: t, left: l });

			},

			hideInfo = function () {
			    if ($itemInfo) $itemInfo.removeClass('open')
			};

            return { init: init, expand: expand, retract: retract, setInfo: setInfo, hideInfo: hideInfo }

        }();

        var contentHandler = function () {

            var $content = $('.content'),
				$staticContent = $('.static-content'),
				$siteMenu = $('.site-menu'),
				iframe = null,
    			player = null,
				$vidHolder = null,
				$imgHolder = null,
				$capInd = null,
				$cycler = null,
				cycling = false,
				$vidImgSwitch = null,
				$imgInds = null,
				$imgNxt = null,
				$imgPrv = null,

			init = function () {

			    $content
					.on('click', '.switch .vid', showVideo)
					.on('click', '.switch .img', showImages);

			},

			populate = function (_data) {

			    // data received from loader

			    // set pagestate
			    app.pageManager.setState('project');

			    // clear the content and append the new data
			    $content
					.empty()
					.append(_data);

			    if ($cycler) $cycler.cycle('destroy');
			    cycling = false;

			    // set components
			    $vidHolder = $('.vid-holder');
			    $imgHolder = $('.img-holder');
			    $imgInds = $imgHolder.find('.inds');
			    $cycler = $imgHolder.find('.cycler');
			    $imgNxt = $imgHolder.find('.nxt');
			    $imgPrv = $imgHolder.find('.prv');

			    iframe = $('#vimeoplayer')[0];
			    if (iframe) {
			        player = $f(iframe);
			        player.addEvent('ready', function () {
			            //console.log("ready");
			        });
			    }

			    $vidImgSwitch = $('.switch');

			    $imgInds.on('click', function () { return false; });

			    // hide nxt / prv by default
			    $imgNxt.hide();
			    $imgPrv.hide();

			    // configure UI accordingly
			    if ($imgHolder.length) {
			        // add indicators & setup cycle for image rotator (if more than 1 image)
			        var $images = $imgHolder.find('img');
			        if ($images.length > 1) {
			            cycling = true;
			            $images.each(function (i) {

			                $imgInds.append('<a href="">' + i + '</a>');

			            });

			            // set up cycling on them
			            $cycler.cycle(
							{
							    timeout: 5000,
							    speed: 1000,
							    after: onSlideAfter,
							    before: onSlideBefore,
							    startingSlide: 0
							}
						);

			            // set up interaction behaviours on rotator
			            $cycler
							.on('mouseenter', function () {
							    $cycler.cycle('pause');
							    $imgHolder
									.addClass('paused')
									.addClass('show-cap');
							})
							.on('mouseleave', function () {
							    $cycler.cycle('resume');
							    $imgHolder
									.removeClass('paused')
									.removeClass('show-cap');
							})
							.on('click', function () {
							    $cycler.cycle('next');
							});

			            $('.cap-ind')
							.on('click', function () {
							    $cycler.cycle('next');
							})

			            // check for caption on first item
			            setTimeout(function () { checkForCaption(0); }, 500);

			            // swipe transitions
			            $imgHolder.touchwipe({
			                wipeLeft: function () {
			                    $cycler.cycle('prev');
			                    return false;
			                },
			                wipeRight: function () {
			                    $cycler.cycle('next');
			                    return false;
			                },
			                min_move_x: 20,
			                preventDefaultEvents: true
			            });

			            $imgHolder.append('<div class="cap-ind"></div>');
			            $capInd = $imgHolder.find('.cap-ind');

			            $imgNxt
							.show()
							.on('click', function () { $cycler.cycle('next'); return false; });

			            $imgPrv
							.show()
							.on('click', function () { $cycler.cycle('prev'); return false; });

			        }

			        if (!$vidHolder.length) {
			            $imgHolder.addClass('media-in');
			            $vidImgSwitch.hide();
			        }
			    }
			    if ($vidHolder.length) {
			        // we have a video, make it active
			        $vidHolder.addClass('media-in');
			        // if we don't ALSO have an image rotator, hide the switch
			        if (!$imgHolder.length) {
			            $vidImgSwitch.hide();
			        }
			        else {
			            // however if there is an img rotator as well, pause it.
			            if (cycling) $cycler.cycle('pause');
			            // and move it offscreen
			            $imgHolder.addClass('media-out');
			        }
			    }
			    else {
			        // NO video available - handling for profile page
			        //$('.profile').addClass( 'no-vid' );
			    }

			    // show the page	
			    showContent($content);

			},

			onSlideAfter = function (currSlideElement, nextSlideElement, options, forwardFlag) {

			    // highlight the relavent indicator
			    $imgInds
					.find('a')
						.removeClass('selected')
						.eq(options.currSlide)
							.addClass('selected');

			},

			onSlideBefore = function (currSlideElement, nextSlideElement, options, forwardFlag) {

			    checkForCaption(options.nextSlide);

			},

			checkForCaption = function (_which) {

			    var caption = $imgHolder.find('img').eq(_which).attr('data-caption');

			    if (caption != '' && caption != undefined) {
			        $imgHolder.addClass('has-caption')
			        if ($capInd) $capInd.text(caption);
			    }
			    else {
			        $imgHolder.removeClass('has-caption')
			    }

			},

			showContent = function ($contentItem) {

			    $contentItem
					.removeClass('fast')
					.addClass('in');

			    setTimeout(function () {
			        $contentItem.addClass('open');
			        // add class to z-index copy above the media, so links & selection are active
			        setTimeout(function () {
			            $contentItem.addClass('copy-active');
			        }, 500);
			    }, 750);

			},

			hideContent = function () {

			    $content.addClass('fast');
			    $staticContent.addClass('fast');

			    $content.removeClass('in open copy-active');
			    $staticContent.removeClass('in open');

			    setTimeout(function () {
			        $content.removeClass('fast');
			        $staticContent.removeClass('fast');
			    }, 500);

			},

			showVideo = function () {

			    if (cycling) $cycler.cycle('pause');
			    $content.find('.switch .vid').addClass('active');
			    $content.find('.switch .img').removeClass('active');
			    $('.vid-holder')
					.removeClass('media-out')
					.addClass('media-in')
			    $('.img-holder')
					.removeClass('media-in')
					.addClass('media-out');

			    return false;

			},

			showImages = function () {

			    player.api('pause');

			    if (cycling) $cycler.cycle('resume');
			    $content.find('.switch .img').addClass('active');
			    $content.find('.switch .vid').removeClass('active');
			    $('.img-holder')
					.removeClass('media-out')
					.addClass('media-in')
			    $('.vid-holder')
					.removeClass('media-in')
					.addClass('media-out');

			    return false;

			},

			killVideo = function () {

			    if (player) player.api('pause');

			};

            return { init: init, populate: populate, showContent: showContent, hideContent: hideContent, killVideo: killVideo }

        }();

        var loader = function () {

            var showLoader = function () {
                $loading.addClass('open');
            },

			hideLoader = function () {
			    $loading.removeClass('open');
			};

            return { showLoader: showLoader, hideLoader: hideLoader }

        }();

        var doReveal = function () {

            $siteNav.addClass('reveal');

        };

        var killReveal = function () {

            $siteNav.removeClass('reveal');

        };

        function init() {

            spreadEm.init();
            contentHandler.init();

            // set up behaviours for showing the menu

            if (!Modernizr.touch) {
                $menuBtn
                    .on('mouseenter', function () {
                        app.pageManager.addState('menu');
                        menuOpen = true;
                    })
                    .on('mouseleave', function () {
                        app.pageManager.removeState('menu');
                        menuOpen = false;
                    });
            }
            else {

                $menuBtn.on('click', function () {
                    app.pageManager.addState('menu');
                    menuOpen = true;
                });
                $(window).touchwipe({
                    wipeLeft: function () {
                        if (menuOpen) {
                            app.pageManager.removeState('menu');
                        }
                        return false;
                    },
                    min_move_x: 20,
                    preventDefaultEvents: true
                });

            }

            // apply perspective to content for non-touch devices
            if (!Modernizr.touch) {
                $('.content').addClass('perspective');
            }

            // set up interactions on the main grid items (NOT for iOs - performs poorly)
            if (!Modernizr.touch) {
                $mainGrid
					.on('mouseover', '.grid .main-grid a', spreadEm.expand)
					//.on('mouseover', '.grid .main-grid a', spreadEm.setInfo)

					.on('mouseover', '.grid .main-grid a', function () {
					    var $item = $(this);
					    infoTimeout = setTimeout(function () { spreadEm.setInfo($item) }, 500);
					})

					.on('mouseout', '.grid .main-grid a', spreadEm.retract)
					.on('mouseout', '.grid .main-grid a', spreadEm.hideInfo);
            }

            $mainGrid
				.on('click', '.grid .main-grid a', function () {

				    clearTimeout(infoTimeout);
				    spreadEm.hideInfo();
				    spreadEm.retract();
				    $siteNavItems.removeClass('selected');
				    app.pageManager.setState('loading', $(this).attr('href'));
				    return false;

				});

            // set up interactions for the top site nav
            $siteNav
				.on('click', '.home', function () {

				    app.pageManager.setState('grid');
				    $siteNavItems.removeClass('selected');
				    return false;

				})
				.on('click', 'a:not(.home)', function () {

				    app.pageManager.setState('static', $(this).attr('href'));
				    $siteNavItems.removeClass('selected');
				    $(this).addClass('selected');
				    return false;

				});

            // set up interactions for the full side nav
            $fullNav
				.on('click', '.home', function () {

				    app.pageManager.setState('grid');
				    $siteNavItems.removeClass('selected');
				    return false;

				})
				.on('click', 'a:not(.home)', function () {

				    if (!$(this).hasClass('bby')) {
				        app.pageManager.setState('loading', $(this).attr('href'));
				        $siteNavItems.removeClass('selected');
				        return false;
				    }

				});

            // set up URL behaviours for all <a> tags
            $('a')
				.on('click', function () {

				    if (!$(this).hasClass('bby')) {
				        app.urlHandler.updateUrl($(this).attr('href'));
				        contentHandler.killVideo();
				    }

				});

            $('.content').on('scroll', function () {

                ($(this).scrollTop() > 45) ? $siteNav.addClass('big-reveal') : $siteNav.removeClass('big-reveal');

            });

            // handling for internal linking within the site - give tags rel="internal"
            $('.content').on('click', 'a', function () {

                if ($(this).attr('rel') === 'internal') {
                    app.urlHandler.updateUrl($(this).attr('href'));
                    app.pageManager.setState('loading', $(this).attr('href'));
                    return false;
                }

            });

        }

        return { init: init, intro: intro, contentHandler: contentHandler, loader: loader, spreadEm: spreadEm, doReveal: doReveal, killReveal: killReveal }

    }(app);

    window.bby_app = app;

})();