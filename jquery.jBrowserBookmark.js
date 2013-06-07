/*
 * jBrowserBookmark - Browser bookmark plugin for use with jQuery
 *
 * Copyright (c) 2010 Andrew Holgate
 *
 * Requirements: jQuery v1.1.3 and beyond.
 *
 * Project homepage:  http://plugins.jquery.com/project/jBrowserBookmark
 *
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */
(function ($) {

  /**
   * TODO: Fix parameters
   *
   * Main jBrowserBookmark function.
   *
   * @param {map} options
   *    plugin options
   * @param {string} lang
   *    language of the current page.
   */
  $.fn.jBrowserBookmark = function (options, lang) {

    // Plugin options

    var defaults = $.extend(opts = {
        language: {
          '': ['Press [key] + ', ' to bookmark this page.']
        },
        defaultLanguage: '', // Default language to use in case the lang parameter is absent.
        functionButton: ['CTRL', 'CMD']
        // Function key format: ['Windows key', 'Macintosh key']
      }, options);

    var docUrl = window.location.href; // Get current URL from the browser location.
    var docTitle = document.title; // Get the current title from the document.
    var browserName;

    // Assign name of the current client browser.
    browserName = getBrowser();

    // return value to allow for jQuery method chaining.

    return this.each(function () {
      $(this).click(function (e) {
        e.preventDefault(); // Prevent normal functionality of the element (like an href for an anchor).
        try {
          switch (browserName) {
          case 'konqueror':
          case 'firefox':
            window.sidebar.addPanel(docTitle, docUrl, '');
            break;
          case 'msie':
            window.external.AddFavorite(docUrl, docTitle);
            break;
          case 'opera':
            // Opera 11 and after no longer support adding bookmarks via JavaScript.
            if (versionOpera() < 11) {
              $(this).attr('rel', 'sidebar').attr('title', docTitle).attr('href', docUrl);
              break;
            } else {
              throw error;
            }
          default:
            // Throw and error for browsers that do not allow JS to add bookmarks.
            throw error;
          }
        }
        // Adding the browser bookmark failed so alert the user to add it manually.
        catch (error) {
          var hotkey = getHotkey(browserName);
          var alertText = getLanguageText();
          // Print alert using the correct language and browser bookmark hotkey.
          // In the case of a Macintosh computer, print the correct [key] (usually 'CMD' or 'COMMAND')
          if (/mac/.test(navigator.platform.toLowerCase() == 'mac')) {
            prefix = alertText[0].replace('[key]', opts.functionButton[1]);
          } else {
            prefix = alertText[0].replace('[key]', opts.functionButton[0]);
          }
          // Show alert box.
          alert(prefix + hotkey + alertText[1]);
        }
      });
    });

    /**
     * Get the name of the users browser.
     * 
     * @return {string}
     *   name of the browser
     */

    function getBrowser() {
      if ($.browser.msie) {
        return 'msie';
      }
      if ($.browser.mozilla) {
        return 'firefox';
      }
      if ($.browser.opera) {
        return 'opera';
      }
      if ($.browser.safari && /chrome/.test(navigator.userAgent.toLowerCase())) {
        return 'chrome';
      }
      if ($.browser.safari) {
        return 'safari';
      }
      if (/konqueror/.test(navigator.userAgent.toLowerCase())) {
        return 'konqueror';
      }
    }

    /**
     * Get the browsers key for adding the bookmark manually.
     *
     * @param {string} browserName
     * @return {string}
     *   hotkey to access browser bookmarks.
     */

    function getHotkey(browserName) {
      switch (browserName) {
      case 'konqueror':
        return 'B';
        break;
      case 'opera':
        // Opera prior to 9 used CONTROL + T for bookmarking.
        return (versionOpera() < 9) ? 'T' : 'D';
        break;
      default:
        return 'D';
        break;
      }
    }

    /**
     * Get correct language text to display in popup.
     *
     * Order:
     *   1) 'lang' parameter passed to the plugin.
     *   2) Browser language (if browser language matches a key in opts.language).
     *   3) opts.defaultLanguage option.

     * @return {array} strings
     *   language text to use in popup.
     */

    function getLanguageText() {
      var languageChosen;
      // lang parameter passed to the plugin.
      if (opts.language[lang] != undefined) {
        languageChosen = lang;
      } else {
        // Browser navigation language.
        if (opts.language[navigator.language.toLowerCase().substring(0, 2)] != undefined) {
          languageChosen = navigator.language.toLowerCase().substring(0, 2);
        } else {
          // opts.defaultLanguage option set in the plugin.
          if (opts.language[opts.defaultLanguage] != undefined)
            languageChosen = opts.defaultLanguage;
          // If opts.defaultLanguage is not valid, use the first key in the object.
          else {
            // Dirty code, but should usually return the first properties of the object.
            for (var i in opts.language) {
              languageChosen = i;
              break;
            }
          }
        }
      }
      return opts.language[languageChosen];
    }

    /**
     * Get the version of Opera.
     * 
     * @return {int}
     *   version number of Opera browser.
     */

    function versionOpera() {
      version = navigator.userAgent.substring(navigator.userAgent.toLowerCase().indexOf('version/') + 8);
      return parseInt(version.substring(0, version.indexOf('.')));
    }

  }; // End of $.fn.jBrowserBookmark
})(jQuery);
