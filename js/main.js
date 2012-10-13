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
        });
  };

  /**
   * VIDEO MENU
   *
   */
  $(function() {
    var
      // Event handlers
      cols_click_handler = function (evt) {
        var
          _id = this.id.charAt(this.id.length - 1),
          $col = $('#video-col-' + _id, $video_wrapper)
            .addClass('opened-column')
            .removeClass('closed-column'),
          $columns = $('div.column', $video_wrapper)
            .not($col)
            .addClass('closed-column')
            .removeClass('opened-column');
      };
      // DOM elements
      $video_wrapper = $('#video-wrapper')
        .on('click', 'article', cols_click_handler);
  });

  /**
   * VIDEO CONTROLLER
   *
   */
  $(function() {
    console.log('video controller');
  });

  /**
   * MAIN MENU CONTROLLER
   *
   * @todo Add URL detection
   */
  $(function() {
    console.log('main menu controller');
    var
      // Event handlers
      menu_click_handler = function (evt) {
        console.log (evt);
        var _hash = evt.target.hash.substr(1);

        // CONTROLLER
        switch (_hash) {

          // Load bonus content
          case 'bonus':
          case 'credits':
            $.fn.additionalContentLoader(_hash);
            break;

          // Play all videos from the start
          case 'top':
          default:
            break;
        }
      },

      // DOM elements
      $menu = $('#primary-menu')
        .on('click', 'a', menu_click_handler);
  });

})(jQuery);
