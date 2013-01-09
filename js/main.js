/**
 * jQuery controllers and helpers for a university project of a webdoc.
 * Last edit: December 2012
 *
 * @author Benjamin Menant <dev@menant-benjamin.fr>
 */

(function($) {

  var $video_wrapper = $('#video-wrapper');

  /**
   * ADDITIONAL CONTENT LOADER
   * Load additional content (experts, bonus, credits, etc).
   *
   * @param {String} _contentName  The name of the file to request.
   */
  $.fn.additionalContentLoader = function (_contentName) {
    var _fragmentedContent = _contentName.indexOf('-')
      , _fileName = _fragmentedContent > 0
                  ? _contentName.substring(0, _fragmentedContent)
                  : _contentName
      , _path = 'fragments/' + _fileName + '.html'
      , $hook = $('#additional-content-wrapper')
          .addClass('loading')
          .removeClass('hidden');

    $hook.children('div')
      .empty()
      .load(_path, function () {
        $hook.removeClass('loading');
        document.location.hash = '#' + _contentName;
      });
  };

  /**
   * SECONDARY ELEMENTS CONTROLLER
   * Hide useless elements when a video is playing.
   * Keep a look at user action to display back these elements.
   *
   * @param {String} _action Hide or show elements?
   *//*
  $.fn.secondaryElementsController = function (_action) {
    var _hide_again
        // jQuery objects
      , $body = $('body')
      , $secondaryElements = $('header, footer, #additional-content-wrapper')
        // Helpers
      , hide = function () { $secondaryElements.addClass('opacity-zero'); }
      , show = function () { $secondaryElements.removeClass('opacity-zero'); }
        // Event handlers
      , mousemove_body_handler = function (evt) {
          // Mouse moves somewhere else than the videos?
          // Ok, show all!
          if (!$video_wrapper.is(evt.target)
          &&  !jQuery.contains($video_wrapper[0], evt.target)) {
            window.clearTimeout(_hide_again);
            show();
            _hide_again = window.setTimeout(hide, 1000);
          }
        }
      , click_body_handler = function (evt) {
          // Clicks somewhere else than the videos?
          // Ok, show all and stop the hidder stuff!
          if (!$video_wrapper.is(evt.target)
          &&  !jQuery.contains($video_wrapper[0], evt.target)) {
            window.clearTimeout(_hide_again);
            $body
              .off('mousemove', mousemove_body_handler)
              .off('click', click_body_handler);
            show();
          }
        };

    switch (_action) {
      case 'hide':
        hide();
        $body
          .on('mousemove', mousemove_body_handler)
          .on('click', click_body_handler);
        return;
      case 'show':
      default:
        if (jQuery.isNumeric(_hide_again)) window.clearTimeout(_hide_again);
        $body
          .off('mousemove', mousemove_body_handler)
          .off('click', click_body_handler);
        show();
        return;
    }
  };*/

  /**
   * VIDEO CONTROLS DISPLAY
   * Hide timeline on user idle.
   * Keep a look at user action to display back the controls.
   *
   * @param {String} _action Hide or show elements?
   */
  $.fn.videoControlsDisplay = function (_action) {
    var _hide_again = 0
      , _webkit_fix = 0
      , $this = this
      , $controls = $('div.video-controls', $this)
        // Helpers
      , hide = function () {
          $controls.addClass('opacity-zero');
          $this.addClass('no-cursor');
        }
      , show = function () {
          $controls.removeClass('opacity-zero');
          $this.removeClass('no-cursor');
        }
        // Event handlers
      , mousemove_video_handler = function (evt) {
          if (++_webkit_fix > 2) {
            _webkit_fix = 0;
            // show controls
            window.clearTimeout(_hide_again);
            show();
            _hide_again = window.setTimeout(hide, 2000);
          }
        }
      , mouseenter_controls_handler = function (evt) {
          $this.off('mousemove', mousemove_video_handler);
          window.clearTimeout(_hide_again);
          show();
        }
      , mouseleave_controls_handler = function (evt) {
          window.clearTimeout(_hide_again);
          _hide_again = window.setTimeout(hide, 2000);
          $this.on('mousemove', mousemove_video_handler);
        };
    switch (_action) {
      case 'hide':
        hide();
        $this.on('mousemove', mousemove_video_handler);
        $controls
          .on('mouseleave focusout', mouseleave_controls_handler)
          .on('mouseenter focusin', mouseenter_controls_handler);
        return;
      case 'show':
      default:
        if (jQuery.isNumeric(_hide_again)) window.clearTimeout(_hide_again);
        $this.off('mousemove', mousemove_video_handler);
        $controls
          .off('mouseleave focusout', mouseleave_controls_handler)
          .off('mouseenter focusin', mouseenter_controls_handler);
        show();
        return;
    }
  };

  /**
   * VIDEO INFO CONTROLLER
   * Show video info and listen click to play video.
   *
   * @param {Boolean} _opening  Do we open or close this stuff?
   */
  $.fn.videoInfoControl = function (_opening) {
    var $this = this
      , $info = $('div.video-info', $this)
      , click_play_handler = function (evt) {
          $this.videoControl('play');

          evt.preventDefault();
          evt.stopPropagation();
        };

    if (_opening) {
      $info.removeClass('hidden');
      $this.on('click', 'a.play', click_play_handler);
    }
    else {
      $info.addClass('hidden');
      $this.off('click', 'a.play', click_play_handler);
    }
  };

  /**
   * VIDEO CONTROLLER
   * Look for each video element inside the given jQuery Object
   * and execute provided action.
   *
   * @param {String}  _action     Do we 'play' or 'stop' the video?
   *                              'pause' or 'replay'?
   *                              Toggle 'fullscreen'?
   * @param {Boolean} _start_from Start from actual position, or from given _position.
   * @param {Integer} _time       Time to start from (0 by default).
   */
  $.fn.videoControl = function (_action, _start_from, _time) {
    var $this   = this
      , $poster = $('div.video-poster', $this)
      , $video  = $('video', $this);

    $video.each(function() {
      var videoElt    = this
        , _start_time = 0
        , $article = $(videoElt).parentsUntil('#video-wrapper', 'article');

      if (_start_from) {
        _start_time = jQuery.isNumeric(_time)
                    // Start from the given time
                    ? _time
                    // Start from the current time
                    : videoElt.currentTime;
      }

      switch (_action) {
        case 'play':
          // Kick out the info…
          $article.videoInfoControl(false);
          // Drop out the poster…
          $poster.addClass('hidden');
          // Play…
          videoElt.currentTime = _start_time;
          videoElt.play();
          // Do not disturb!
          //$.fn.secondaryElementsController('hide');
          $this.videoControlsDisplay('hide');
          $article
            .videoControlsMenu('start')
            .videoControlsTimeline('start');
          break;
        case 'replay':
          // Play…
          videoElt.currentTime = _start_time;
          videoElt.play();

          // Force the control button to 'play'
          $article.videoControlsMenu('reset');
          break;
        case 'stop':
          // Please, disturb…
          //$.fn.secondaryElementsController('show');
          // Kick out the info…
          $article.videoInfoControl(false);
          // Get back the poster…
          $poster.removeClass('hidden');
          // Stop playing!
          videoElt.pause();
          $article
            .videoControlsMenu('stop')
            .videoControlsTimeline('stop');
          break;
        case 'pause':
          // Stop playing!
          videoElt.pause();
          break;
        case 'fullscreen':
          // allready fullscreen, cancel it
          if (document.fullscreen
          ||  document.mozFullScreen
          ||  document.webkitFullScreen
          ||  document.webkitIsFullScreen
          || (document.fullscreenElement && document.fullscreenElement !== null)) {
            if (document.cancelFullscreen) {
              document.cancelFullscreen();
            } else if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            }
            break;
          }
          // else, request fullscreen
          if ($article[0].requestFullscreen) {
            $article[0].requestFullscreen();
          } else if ($article[0].mozRequestFullScreen) {
            $article[0].mozRequestFullScreen();
          } else if ($article[0].webkitRequestFullScreen) {
            $article[0].webkitRequestFullScreen();
          }
          break;
        default:
          console.log('VideoController, action unknown: ' + _action );
          break;
      }
    });

    return this;
  };


  /**
   * VIDEO MENU
   * Five videos, five sliding panes. Click to open and play.
   *
   */
  $(function() {
    var
      // Event handlers
      cols_click_handler = function (evt) {
        //evt.preventDefault();

        var _id = this.id.charAt(this.id.length - 1)
          , $col = $('#video-col-' + _id, $video_wrapper)
          , $columns = $('div.column', $video_wrapper);

        if (!$col.hasClass('opened-column')) {
          // Stop all videos
          $video_wrapper.videoControl('stop');
          // Show video info
          $(this).videoInfoControl(true);

          // Open choosen video
          $col
            .addClass('opened-column')
            .removeClass('closed-column');
          // Close others
          $columns
            .not($col)
            .addClass('closed-column')
            .removeClass('opened-column');
        }
      };

      $video_wrapper.on('click', 'article', cols_click_handler);
  });

  /**
   * INNER VIDEO MENU
   * Propose two videos at the end of the video, a replay button,
   * and a countdown timer before the next video starts.
   *
   */
  $(function () {
    var related_videos_selector = 'div.related-videos'
      , autostart_next_video
      , videos_end_handler = function (evt) {
          var $target = $(evt.target)
            , $related_videos = $target.next(related_videos_selector)
                .removeClass('hidden');

          autostart_next_video = window.setTimeout(function () {
            var $next = $target.parents('article').next();
            if ($next.length > 0) {
              $next.trigger('click');
            }
            else {
              $('#video-1').trigger('click');
            }
          }, 9000);
        }
      , videos_play_handler = function (evt) {
          var $target = $(evt.target)
            , $related_videos = $target.next(related_videos_selector)
                .addClass('hidden');
        }
      , related_links_click_handler = function (evt) {
          window.clearTimeout(autostart_next_video);

          var _hash = evt.currentTarget.hash
            , _class = evt.currentTarget.className;
          switch (_class) {
            case 'replay':
              $(_hash).videoControl('replay', true, 0);
            case 'another':
              $(_hash).trigger('click');
              break;
            case 'expert':
              $.fn.additionalContentLoader('experts');
              return;
          }
          evt.preventDefault();
          evt.stopPropagation();
        };

    $('video', $video_wrapper)
      .on('ended', videos_end_handler)
      .on('play', videos_play_handler);

    $video_wrapper.on('click', related_videos_selector + ' a', related_links_click_handler);

  });

  /**
   * INNER VIDEO CONTROLS MENU
   * Fullscreen, play/pause button
   *
   * @param {Boolean} Set or unset eventlistener
   */
$.fn.videoControlsTimeline = function (_action) {
  var $this = this
    , $controls = $('div.video-controls', $this)
      // Helpers
      // Event handlers
    , click_timeline_handler = function (evt) {
        var $target = $(evt.target)
          , _time = $target.data('sequence-time');

        $this.videoControl('replay', true, _time);

        evt.preventDefault();
        evt.stopPropagation();
      };

  // event listeners
  switch (_action) {
    case 'start':
      $controls.on('click', 'ol a', click_timeline_handler);
      return $this;

    case 'stop':
    default:
      $controls.off();
      return $this;
  }
};

  /**
   * INNER VIDEO CONTROLS MENU
   * Fullscreen, play/pause button
   *
   * @param {Boolean} Set or unset eventlistener
   */
$.fn.videoControlsMenu = function (_action) {
  var $this = this
    , $controls = $('div.video-controls', $this)
    , $playpause_button = $('a.play-pause', $controls)
      // Helpers
    , toggle_playpause_button = function (_playing) {
        if (_playing === true) {
          $playpause_button
            .addClass('play')
            .removeClass('pause')
            .text('pause');
        }
        else {
          $playpause_button
            .addClass('pause')
            .removeClass('play')
            .text('lecture');
        }
      }
      // Event handlers
    , click_fullscreen_handler = function (evt) {
        $this.videoControl('fullscreen');

        evt.preventDefault();
        evt.stopPropagation();
      }
    , click_playpause_handler = function (evt) {
        var _playing = $playpause_button.hasClass('pause');
        if (_playing) {
          $this.videoControl('replay', true);
        }
        else {
          $this.videoControl('pause');
        }
        toggle_playpause_button(_playing);

        evt.preventDefault();
        evt.stopPropagation();
      };

  switch(_action) {
    case 'start':
      toggle_playpause_button(true);
      $controls
        .on('click', 'a.play-pause', click_playpause_handler)
        .on('click', 'a.fullscreen', click_fullscreen_handler);
      return $this;

    case 'reset':
      toggle_playpause_button(true);
      return $this;

    case 'stop':
    default:
      $controls.off();
      toggle_playpause_button(false);
      return $this;
  }
};

  /**
   * MAIN MENU CONTROLLER
   *
   * @todo Cast subsection and load corresponding section
   */
  $(function() {
    var
      // Menu helper
      menu_controller = function (_hash) {
        var _cleaned_hash = _hash.replace(/^#\/?/,'');
        console.log(_cleaned_hash);
        switch (_cleaned_hash) {

          // Load bonus content
          case 'experts-podo':
          case 'experts-psy':
          case 'experts':
          case 'makingoff':
          case 'credits':
          case 'flickr':
            console.log('+' + _cleaned_hash);
            $('article', $video_wrapper).videoControl('stop');
            $('div.column', $video_wrapper).removeClass('closed-column opened-column');
            $.fn.additionalContentLoader(_cleaned_hash);
            return false;

          // Open video pane
          case 'video-1':
          case 'video-2':
          case 'video-3':
          case 'video-4':
          case 'video-5':
            $('#' + _cleaned_hash).trigger('click');
            return true;

          // Stop & reset the video panes
          case 'top':
          default:
            $('article', $video_wrapper).videoControl('stop');
            $('div.column', $video_wrapper).removeClass('closed-column opened-column');
            // It could also start the first video…
            // $('#video-1').trigger('click');
            return false;
        }
      },

      // Menu event Handler
      menu_click_handler = function (evt) {
        var _hash = evt.target.hash.substr(1);
        if(menu_controller(_hash)) {
          evt.preventDefault();
          evt.stopPropagation();
        }
      },

      // Menu & Event Listener
      $menu = $('#primary-menu, footer nav')
        .on('click', 'a', menu_click_handler);

    // Autoload content from URL hash
    menu_controller(document.location.hash);
  });

  /**
   * AFFIX MENU
   * (thanks to Twitter Bootstrap jQuery plugin)
   */
  $(function() {
    var $menu = $('#primary-menu').affix({offset: 96});
  });

  /**
   * Smooth Scroll
   * (thanks to )
   */
  $(function() {
    $(window).on('hashchange', function(event) {
      var tgt = location.hash.replace(/^#\/?/,'');
      if ( document.getElementById(tgt) ) {
        $.smoothScroll({
          scrollTarget: '#' + tgt,
          offset: -32,
          speed: 200
        });
      }
    });
    $(window).trigger('hashchange');
  });

  /**
   * Share the love
   */
  $(function() {
    var _hostname = document.location.protocol + '//' + document.location.hostname + document.location.pathname
      , _hostname_trim = _hostname.replace(/index\.html/,'')
      , _hostname_encoded = encodeURIComponent(_hostname_trim)
      , $footer = $('footer ul')
      , $fb = $('li.facebook > a', $footer).attr('href', 'http://www.facebook.com/sharer.php?s=100&p[title]=Chauss%E2%80%99%20ton%20univers%2C%20un%20documentaire%20Web%20marche%20sur%20la%20t%C3%AAte%20des%20sportifs&p[summary]=Le%20webdocumentaire%20%C2%ABChauss%E2%80%99ton%20univers%C2%BB%20est%20un%20projet%20universitaire%20r%C3%A9alis%C3%A9%20par%20dix%20%C3%A9tudiants%20en%20master%20multim%C3%A9dia%20%C3%A0%20l%E2%80%99ISIC%20(Institut%20des%20Sciences%20de%20l%E2%80%99Information%20et%20de%20la%20Communication)%20%C3%A0%20Bordeaux%203.%20Le%20principal%20sujet%20de%20ce%20webdocumentaire%20s%E2%80%99articule%20autour%20de%20la%20relation%20qu%E2%80%99entretient%20un%20sportif%20de%20haut%20niveau%20avec%20sa%20chaussure%20de%20sport.%20%C2%ABChauss%E2%80%99ton%20univers%C2%BB%20est%20un%20webdocumentaire%20constitu%C3%A9%20de%20vid%C3%A9os%20de%20sportifs%20en%20action%20et%20d%E2%80%99interviews%20de%20sportifs%20(pr%C3%A9cis%C3%A9ment%20dans%20le%20football%2C%20la%20danse%2C%20le%20rugby%2C%20la%20boxe%2C%20le%20roller)%20qui%20racontent%20leur%20exp%C3%A9rience%20avec%20leur%20chaussure%3A%20comment%20ils%20les%20ont%20choisi%2C%20comment%20ils%20les%20entretiennent%2C%20s%E2%80%99ils%20les%20recyclent%20ou%20non%E2%80%A6%20Des%20questions%20principalement%20ax%C3%A9es%20sur%20le%20c%C3%B4t%C3%A9%20affectif%20du%20sportif%20avec%20ses%20chaussures.%20Enfin%2C%20des%20s%C3%A9quences%20plus%20th%C3%A9oriques%20o%C3%B9%20des%20experts%20s%E2%80%99expriment%20sur%20ce%20sujet%20(pr%C3%A9cis%C3%A9ment%20un%20podologue%20et%20une%20psychanalyste).&p[url]=' + _hostname_encoded)
    , $twttr = $('li.twitter > a', $footer).attr('href', 'https://twitter.com/intent/tweet?text=Chauss%E2%80%99%20ton%20univers%2C%20un%20documentaire%20Web%20marche%20sur%20la%20t%C3%AAte%20des%20sportifs%E2%80%AF!&url=' + _hostname_encoded);
  });

})(jQuery);
