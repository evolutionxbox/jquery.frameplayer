;(function ($, window, document, undefined) {
  'use strict';

  if($.fn.framePlayer) { return; }

  var
    consl = (window.console || false),

    defaults = {
      rate: 24,
      autoPlay: false,
      asyncPreload: false,
      repeat: false
    },

    utility = {
    },

    FramePlayer = function (element, options) {

      var
        $container = $(element),
        json,

        getFile = function (fileUrl) {
          $.ajax({
            dataType: 'json',
            url: fileUrl,
            beforeSend: function() {
              console.log('Loading: ' + fileUrl);
              // $container.html('<p>Loading...</p>');
            },
            success: function(jsonFile){
              json = jsonFile;

              if(options.autoPlay && !asyncPreload) {
                play();
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.error(jqXHR, textStatus, errorThrown);
            }
          });
        },

        play = function() {
          var img = $container.children('img'),
            i = -1,
            frameLimit = json.frames.length - 1;

          var updateFrame = setInterval(function() {
            if(i < frameLimit) {
              i++;
            } else {
              if(options.repeat) {
                i = 0;
              } else {
                clearInterval(updateFrame);
              }
            }

            img[0].src = json.frames[i];
          }, Math.round(1000 / options.rate))
        },

        playReverse = function() {
          var img = $container.children('img'),
              i = json.frames.length,
              frameLimit = 0;

          var updateFrame = setInterval(function() {
            if(i > frameLimit) {
              i--;
            } else {
              if(options.repeat) {
                i = json.frames.length;
              } else {
                clearInterval(updateFrame);
              }
            }

            img[0].src = json.frames[i];
          }, Math.round(1000 / options.rate));
        };

      options = $.extend({}, $.fn.framePlayer.options, options);

      // Add an image tag inside the container
      $container.html('<img>');

      // Get the json file
      if(!options.asyncPreload) {
        getFile($container.attr('data-vidsrc'));
      }

      return {
        getFile: getFile,
        play: play,
        playReverse: playReverse
      };
    },
    declareFramePlayer = function (options) {
      return this.each(function () {
        if(!$.data(this, 'framePlayer')) {
          $.data(this, 'framePlayer', new FramePlayer(this, options));
        }
      });
    };
  $.framePlayerUtility = utility;
  $.fn.framePlayer = declareFramePlayer;
  $.fn.framePlayer.options = defaults;
})($, window, document);
