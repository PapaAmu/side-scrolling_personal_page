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

    	// Keyboard shortcuts.
		if (settings.keyboardShortcuts.enabled)
    (function() {

      $wrapper

        // Prevent keystrokes inside excluded elements from bubbling.
          .on('keypress keyup keydown', settings.excludeSelector, function(event) {

            // Stop propagation.
              event.stopPropagation();

          });

      $window

        // Keypress event.
          .on('keydown', function(event) {

            var scrolled = false;

            switch (event.keyCode) {

              // Left arrow.
                case 37:
                  $document.scrollLeft($document.scrollLeft() - settings.keyboardShortcuts.distance);
                  scrolled = true;
                  break;

              // Right arrow.
                case 39:
                  $document.scrollLeft($document.scrollLeft() + settings.keyboardShortcuts.distance);
                  scrolled = true;
                  break;

              // Page Up.
                case 33:
                  $document.scrollLeft($document.scrollLeft() - $window.width() + 100);
                  scrolled = true;
                  break;

              // Page Down, Space.
                case 34:
                case 32:
                  $document.scrollLeft($document.scrollLeft() + $window.width() - 100);
                  scrolled = true;
                  break;

              // Home.
                case 36:
                  $document.scrollLeft(0);
                  scrolled = true;
                  break;

              // End.
                case 35:
                  $document.scrollLeft($document.width());
                  scrolled = true;
                  break;

            }

            // Scrolled?
              if (scrolled) {

                // Prevent default.
                  event.preventDefault();
                  event.stopPropagation();

                // Stop link scroll.
                  $bodyHtml.stop();

              }

          });

    })();

    // Scroll wheel.
		if (settings.scrollWheel.enabled)
    (function() {

      // Based on code by @miorel + @pieterv of Facebook (thanks guys :)
      // github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
        var normalizeWheel = function(event) {

          var	pixelStep = 10,
            lineHeight = 40,
            pageHeight = 800,
            sX = 0,
            sY = 0,
            pX = 0,
            pY = 0;

          // Legacy.
            if ('detail' in event)
              sY = event.detail;
            else if ('wheelDelta' in event)
              sY = event.wheelDelta / -120;
            else if ('wheelDeltaY' in event)
              sY = event.wheelDeltaY / -120;

            if ('wheelDeltaX' in event)
              sX = event.wheelDeltaX / -120;

          // Side scrolling on FF with DOMMouseScroll.
            if ('axis' in event
            &&	event.axis === event.HORIZONTAL_AXIS) {
              sX = sY;
              sY = 0;
            }

          // Calculate.
            pX = sX * pixelStep;
            pY = sY * pixelStep;

            if ('deltaY' in event)
              pY = event.deltaY;

            if ('deltaX' in event)
              pX = event.deltaX;

            if ((pX || pY)
            &&	event.deltaMode) {

              if (event.deltaMode == 1) {
                pX *= lineHeight;
                pY *= lineHeight;
              }
              else {
                pX *= pageHeight;
                pY *= pageHeight;
              }

            }

          // Fallback if spin cannot be determined.
            if (pX && !sX)
              sX = (pX < 1) ? -1 : 1;

            if (pY && !sY)
              sY = (pY < 1) ? -1 : 1;

          // Return.
            return {
              spinX: sX,
              spinY: sY,
              pixelX: pX,
              pixelY: pY
            };

        };

      // Wheel event.
        $body.on('wheel', function(event) {

          // Disable on <=small.
            if (breakpoints.active('<=small'))
              return;

          // Prevent default.
            event.preventDefault();
            event.stopPropagation();

          // Stop link scroll.
            $bodyHtml.stop();

          // Calculate delta, direction.
            var	n = normalizeWheel(event.originalEvent),
              x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
              delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
              direction = x > 0 ? 1 : -1;

          // Scroll page.
            $document.scrollLeft($document.scrollLeft() + (delta * direction));

        });

    })();


