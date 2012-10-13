/**
 * jQuery controllers and helpers for a university project of a webdoc.
 * Last edit: October 2012
 *
 * @author Benjamin Menant <dev@menant-benjamin.fr>
 */

(function($) {

  /**
   * ADDITIONAL CONTENT LOADER
   *
   * @param {String} _contentName  The name of the file to request.
   * @todo Add a loading image, and smooth effect
   */
  $.fn.additionalContentLoader = function (_contentName) {
    var
      _path = 'fragments/' + _contentName + '.html',
      $hook = $('#dynamic-content-wrapper')
        .addClass('loading')
        .removeClass('hidden')
        .load(_path, function () {
          $hook.removeClass('loading');
          document.location.hash = '#' + _contentName;
        });
  };


  /**
   * VIDEO CONTROLLER
   * Looks for each video element inside the given jQuery Object
   * and execute provided action.
   *
   * @param {String} _action  Do we 'play' or 'stop' the video?
   */
  $.fn.videoControl = function (_action) {
    var $video = $('video', this);

    $video.each(function() {
      var videoElt = this;

      switch (_action) {
        case 'play':
          videoElt.currentTime = videoElt.initialTime;
          videoElt.play();
          break;
        case 'stop':
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
        evt.preventDefault();

        var
          _id = this.id.charAt(this.id.length - 1),
          $col = $('#video-col-' + _id, $video_wrapper),
          $columns = $('div.column', $video_wrapper);

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
      },
      // DOM elements & Event Listeners
      $video_wrapper = $('#video-wrapper')
        .on('click', 'article', cols_click_handler);
  });

  /**
   * MAIN MENU CONTROLLER
   *
   */
  $(function() {
    var
      // Menu helper
      menu_controller = function (_hash) {
        switch (_hash) {

          // Load bonus content
          case 'bonus':
          case 'credits':
            $.fn.additionalContentLoader(_hash);
            return;

          // Play all videos from the start
          case 'top':
          default:
            return;
        }
      },

      // Menu event Handler
      menu_click_handler = function (evt) {
        var _hash = evt.target.hash.substr(1);
        menu_controller(_hash);
      },

      // Menu & Event Listener
      $menu = $('#primary-menu')
        .on('click', 'a', menu_click_handler);

    // Autoload content from URL hash
    menu_controller(document.location.hash.substr(1));
  });

})(jQuery);
