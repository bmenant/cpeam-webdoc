$(function() {
  var
    // Functions declarations
    click_cols_handler = function (evt) {
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
    // DOM elements declarations
    $video_wrapper = $('#video-wrapper'),
    $cols = $('article', $video_wrapper)
      .click(click_cols_handler);
});
