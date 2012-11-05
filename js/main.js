/**
 * jQuery controllers and helpers for a university project of a webdoc.
 * Last edit: October 2012
 *
 * @author Benjamin Menant <dev@menant-benjamin.fr>
 */

(function($) {

  var $video_wrapper = $('#video-wrapper');

  /**
   * ADDITIONAL CONTENT LOADER
   *
   * @param {String} _contentName  The name of the file to request.
   */
  $.fn.additionalContentLoader = function (_contentName) {
    var _path = 'fragments/' + _contentName + '.html'
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
   * Keeps a look at user action to display back these elements.
   *
   * @param {String} _action Hide or show elements?
   */
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
  }

  /**
   * VIDEO CONTROLLER
   * Looks for each video element inside the given jQuery Object
   * and execute provided action.
   *
   * @param {String}  _action Do we 'play' or 'stop' the video?
   * @param {Integer} _time   Time to start from (0 by default).
   */
  $.fn.videoControl = function (_action, _time) {
    var $this   = this
      , $poster = $('div.video-poster', $this)
      , $video  = $('video', $this);

    $video.each(function() {
      var videoElt = this;

      switch (_action) {
        case 'play':
          // Drop out the poster…
          $poster.addClass('hidden');
          // Play…
          videoElt.currentTime = jQuery.isNumeric(_time) ? _time : 0;
          videoElt.play();
          // Do not disturb!
          $.fn.secondaryElementsController('hide');
          break;
        case 'stop':
          // Please, disturb…
          $.fn.secondaryElementsController('show');
          // Get back the poster…
          $poster.removeClass('hidden');
          // Stop playing!
          videoElt.pause();
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
   * Proposes two videos at the end of the video
   *
   */
  $(function () {
    var videos_end_handler = function (evt) {
          var $target = $(evt.target)
            , $related_videos = $target.next('div.related-videos')
                .removeClass('hidden');
        }
      , videos_play_handler = function (evt) {
          var $target = $(evt.target)
            , $related_videos = $target.next('div.related-videos')
                .addClass('hidden');
        };

    // DOM elements & Event listeners
    $('video', $video_wrapper)
      .on('ended', videos_end_handler)
      .on('play', videos_play_handler);
  });

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
          case 'contres-pieds':
          case 'bonus':
          case 'credits':
            $.fn.additionalContentLoader(_hash);
            return;

          // Stop & reset the video panes
          case 'top':
          default:
            $('article', $video_wrapper).videoControl('stop');
            $('div.column', $video_wrapper).removeClass('closed-column opened-column');
            // It could also start the first video…
            // $('#video-cell-1').trigger('click');
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
