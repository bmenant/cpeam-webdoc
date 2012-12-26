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
          // show controls
          window.clearTimeout(_hide_again);
          show();
          _hide_again = window.setTimeout(hide, 2000);
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
          ||  document.webkitFullscreen) {
            if (document.cancelFullscreen) {
              document.cancelFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitCancelFullscreen) {
              document.webkitCancelFullscreen();
            }
            break;
          }
          // else, request fullscreen
          if ($article[0].requestFullscreen) {
            $article[0].requestFullscreen();
          } else if ($article[0].mozRequestFullScreen) {
            $article[0].mozRequestFullScreen();
          } else if ($article[0].webkitRequestFullscreen) {
            $article[0].webkitRequestFullscreen();
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
          // Play opening video
          $(this).videoControl('play');

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
        // @todo toggle button
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
        switch (_hash) {

          // Load bonus content
          case 'experts-podologie':
          case 'experts-psychologie':
          case 'experts':
          case 'makingoff':
          case 'credits':
            $.fn.additionalContentLoader(_hash);
            return;

          // Stop & reset the video panes
          case 'top':
          default:
            $('article', $video_wrapper).videoControl('stop');
            $('div.column', $video_wrapper).removeClass('closed-column opened-column');
            // It could also start the first video…
            // $('#video-1').trigger('click');
            return;
        }
      },

      // Menu event Handler
      menu_click_handler = function (evt) {
        var _hash = evt.target.hash.substr(1);
        menu_controller(_hash);
      },

      // Menu & Event Listener
      $menu = $('#primary-menu, footer nav')
        .on('click', 'a', menu_click_handler);

    // Autoload content from URL hash
    menu_controller(document.location.hash.substr(1));
  });

  /**
   * AFFIX MENU
   * (thanks to Twitter Bootstrap jQuery plugin)
   */
  $(function() {
    var $menu = $('#primary-menu').affix({offset: 96});
  });

})(jQuery);
