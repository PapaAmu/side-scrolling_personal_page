/*
  Author : Themba Real Lukhele
  Email : realthemba@gmail.com
  Organisation : Siyamuza 
*/
(function($) {

	// Settings.
		var settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: true,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// Scroll wheel.
				scrollWheel: {

					// If true, enables scrolling via the scroll wheel.
						enabled: true,

					// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
						factor: 1

				},
			// Scroll zones.
      scrollZones: {

        // If true, enables scrolling via scroll zones on the left/right edges of the scren.
          enabled: true,

        // Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
          speed: 15

      },

    // Dragging.
      dragging: {

        // If true, enables scrolling by dragging the main wrapper with the mouse.
          enabled: true,

        // Sets the momentum factor. Must be a value between 0 and 1 (lower = less momentum, higher = more momentum, 0 = disable momentum scrolling).
          momentum: 0.875,

        // Sets the drag threshold (in pixels).
          threshold: 10

      },

    // If set to a valid selector , prevents key/mouse events from bubbling from these elements.
      excludeSelector: 'input:focus, select:focus, textarea:focus, audio, video, iframe',

    // Link scroll speed.
      linkScrollSpeed: 1000

  };

// Vars.
  var	$window = $(window),
    $document = $(document),
    $body = $('body'),
    $html = $('html'),
    $bodyHtml = $('body,html'),
    $wrapper = $('#wrapper');

// Breakpoints.
  breakpoints({
    xlarge:   [ '1281px',  '1680px' ],
    large:    [ '981px',   '1280px' ],
    medium:   [ '737px',   '980px'  ],
    small:    [ '481px',   '736px'  ],
    xsmall:   [ '361px',   '480px'  ],
    xxsmall:  [ null,      '360px'  ],
    short:    '(min-aspect-ratio: 16/7)',
    xshort:   '(min-aspect-ratio: 16/6)'
  });

// Play initial animations on page load.
  $window.on('load', function() {
    window.setTimeout(function() {
      $body.removeClass('is-preload');
    }, 100);
  });

// Tweaks/fixes.

  // Mobile: Revert to native scrolling.
    if (browser.mobile) {

      // Disable all scroll-assist features.
        settings.keyboardShortcuts.enabled = false;
        settings.scrollWheel.enabled = false;
        settings.scrollZones.enabled = false;
        settings.dragging.enabled = false;

      // Re-enable overflow on body.
        $body.css('overflow-x', 'auto');

    }

  // IE: Various fixes.
    if (browser.name == 'ie') {

      // Enable IE mode.
        $body.addClass('is-ie');

      // Page widths.
        $window
          .on('load resize', function() {

            // Calculate wrapper width.
              var w = 0;

              $wrapper.children().each(function() {
                w += $(this).width();
              });
            // Apply to page.
              $html.css('width', w + 'px');

          });

    }

		// Polyfill: Object fit.
    if (!browser.canUse('object-fit')) {

      $('.image[data-position]').each(function() {

        var $this = $(this),
          $img = $this.children('img');

        // Apply img as background.
          $this
            .css('background-image', 'url("' + $img.attr('src') + '")')
            .css('background-position', $this.data('position'))
            .css('background-size', 'cover')
            .css('background-repeat', 'no-repeat');

        // Hide img.
          $img
            .css('opacity', '0');

      });

    }
