/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global jQuery*/
/*global window*/
/*global navigator*/
/*global document*/
/*global CSSMatrix*/
/*global WebKitCSSMatrix*/
/*global MSCSSMatrix*/
/*global Hammer*/
/*global Sidebar*/

/**
 * @param {jQuery} $
 *
 * @typedef {Sidebar} Sidebar
 */
(function ($) {
    'use strict';

    /**
     * Check if is a mobile device.
     *
     * @returns {boolean}
     *
     * @private
     */
    function mobileCheck() {
        return Boolean(navigator.userAgent.match(/Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Opera Mini/i));
    }

    /**
     * Binding actions of keyboard.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Sidebar} Event.data The sidebar instance
     *
     * @private
     */
    function keyboardAction(event) {
        if (!event instanceof jQuery.Event || event.data.options.disabledKeyboard) {
            return;
        }

        var self = event.data,
            kbe = self.options.keyboardEvent;

        if (event.shiftKey === kbe.shiftKey
                && event.ctrlKey  === kbe.ctrlKey
                && event.altKey   === kbe.altKey
                && event.keyCode  === kbe.keyCode) {
            self.toggle(event);
        }
    }

    /**
     * Checks if the window width is wider than the minimum width defined in
     * options.
     *
     * @param {Sidebar} self The sidebar instance
     *
     * @returns {boolean}
     *
     * @private
     */
    function isOverMinWidth(self) {
        var scrollbarWidth = 'scrollbarWidth',
            isOver = false,
            $window = $(window),
            windowWidth = $window.innerWidth(),
            widthNoScroll,
            inner,
            outer;

        if ($('body').height() > $window.innerHeight()) {
            if (null === self.scrollbarWidth) {
                inner = document.createElement('div');
                outer = document.createElement('div');
                outer.style.visibility = 'hidden';
                outer.style.width = '100px';

                document.body.appendChild(outer);

                widthNoScroll = outer.offsetWidth;
                outer.style.overflow = 'scroll';
                inner.style.width = '100%';
                outer.appendChild(inner);

                self[scrollbarWidth] = widthNoScroll - inner.offsetWidth;

                outer.parentNode.removeChild(outer);
            }

            windowWidth += self[scrollbarWidth];
        }

        if (windowWidth >= self.options.minLockWidth) {
            isOver = true;
        }

        return isOver;
    }

    /**
     * Close the sidebar since external action.
     *
     * @param {Event} event The event
     *
     * @typedef {Sidebar} Event.data The sidebar instance
     *
     * @private
     */
    function closeExternal(event) {
        var self = event.data,
            $target = $(event.currentTarget.activeElement);

        if ((self.isLocked() && isOverMinWidth(self)) || $(event.target).parents('.' + self.options.classWrapper).size() > 0 || $target.parents('.' + self.options.classWrapper).size() > 0 || $target.hasClass('sidebar-swipe')) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        if (isOverMinWidth(self)) {
            self.close();

        } else {
            self.forceClose();
        }
    }

    /**
     * Close the sidebar or reopen the locked sidebar on window resize event.
     *
     * @param {Event} event The event
     *
     * @typedef {Sidebar} Event.data The sidebar instance
     *
     * @private
     */
    function onResizeWindow(event) {
        var self = event.data;

        if (isOverMinWidth(self) && self.isLocked()) {
            self.forceOpen();

            return;
        }

        closeExternal(event);
    }

    /**
     * Get the sidebar wrapper position.
     *
     * @param {jQuery} $target
     *
     * @returns {number} The Y axis position
     *
     * @private
     */
    function getWrapperPosition($target) {
        var transformCss = $target.css('transform'),
            transform = {e: 0, f: 0},
            reMatrix,
            match;

        if (transformCss) {
            if ('function' === typeof CSSMatrix) {
                transform = new CSSMatrix(transformCss);

            } else if ('function' === typeof WebKitCSSMatrix) {
                transform = new WebKitCSSMatrix(transformCss);

            } else if ('function' === typeof MSCSSMatrix) {
                transform = new MSCSSMatrix(transformCss);

            } else {
                reMatrix = /matrix\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/;
                match = transformCss.match(reMatrix);

                if (match) {
                    transform.e = parseInt(match[1], 10);
                    transform.f = parseInt(match[2], 10);
                }
            }
        }

        return transform.e;
    }

    /**
     * Cleans the hammer configuration on the wrapper element.
     *
     * @param {Sidebar} self The sidebar instance
     *
     * @private
     */
    function cleanHammer(self) {
        self.$wrapper.removeData('drap-start-position');
        self.$wrapper.css('-webkit-transition', '');
        self.$wrapper.css('transition', '');
        self.$wrapper.css('-webkit-transform', '');
        self.$wrapper.css('transform', '');
        self.$wrapper.removeClass(self.options.classOnDragging);
        delete self.dragStartPosition;
    }

    /**
     * Action of "on drag" hammer event.
     *
     * @param {Sidebar} self  The sidebar instance
     * @param {Event}   event The hammer event
     *
     * @private
     */
    function onDrag(self, event) {
        var dragStartPosition = 'dragStartPosition',
            horizontal;

        if (undefined !== self.hammerScroll) {
            self.hammerScroll.onDrag(event);
        }

        if ((Hammer.DIRECTION_LEFT !== event.gesture.direction && Hammer.DIRECTION_RIGHT !== event.gesture.direction)
                || (self.options.locked && isOverMinWidth(self))) {
            return;
        }

        if (undefined === self.dragStartPosition) {
            self[dragStartPosition] = getWrapperPosition(self.$wrapper);
        }

        horizontal = Math.round(self.dragStartPosition + event.gesture.deltaX);

        if ((Sidebar.POSITION_LEFT === self.getPosition() && horizontal > 0) || (Sidebar.POSITION_RIGHT === self.getPosition() && horizontal < 0)) {
            horizontal = 0;
        }

        self.$wrapper.addClass(self.options.classOnDragging);
        self.$wrapper.css('-webkit-transition', 'none');
        self.$wrapper.css('transition', 'none');
        self.$wrapper.css('-webkit-transform', 'translate3d(' + horizontal + 'px, 0px, 0px)');
        self.$wrapper.css('transform', 'translate3d(' + horizontal + 'px, 0px, 0px)');
    }

    /**
     * Action of "on drag end" hammer event.
     *
     * @param {Sidebar} self  The sidebar instance
     * @param {Event}   event The hammer event
     *
     * @private
     */
    function onDragEnd(self, event) {
        var closeGesture = Sidebar.POSITION_LEFT,
            openGesture = Sidebar.POSITION_RIGHT;

        if (undefined !== self.hammerScroll) {
            self.hammerScroll.onDragEnd(event);
        }

        cleanHammer(self);

        if (Math.abs(event.gesture.deltaX) <= (self.$wrapper.innerWidth() / 4)) {
            return;
        }

        if (Sidebar.POSITION_RIGHT === self.getPosition()) {
            closeGesture = Sidebar.POSITION_RIGHT;
            openGesture = Sidebar.POSITION_LEFT;
        }

        if (self.isOpen() && closeGesture === event.gesture.direction) {
            self.forceClose();

        } else if (openGesture === event.gesture.direction) {
            if (self.isOpen() && isOverMinWidth(self) && $.inArray(self.options.forceToggle, [true, 'always']) >= 0) {
                self.forceOpen();

            } else if (isOverMinWidth(self) && 'always' === self.options.forceToggle) {
                self.forceOpen();

            } else {
                self.open();
            }
        }
    }

    /**
     * Init the hammer instance.
     *
     * @param {Sidebar} self The sidebar instance
     *
     * @private
     */
    function initHammer(self) {
        if (!Hammer) {
            return;
        }

        var swipe = '$swipe',
            hammer = 'hammer',
            hammerScroll = 'hammerScroll';

        if ($.fn.hammerScroll) {
            self[hammerScroll] = $('.sidebar-scroller', self.$wrapper).hammerScroll({
                contentWrapperClass: 'sidebar-scroller-content',
                eventDelegated:      true,
                hammerStickyHeader:  self.options.sidebarStickyHeader,
                scrollbar:           self.options.hammerScrollbar,
                scrollbarInverse:    Sidebar.POSITION_RIGHT === self.options.position
            }).data('st.hammerscroll');
        }

        self[swipe] = $('<div id="sidebar-swipe' + self.guid + '" class="sidebar-swipe"></div>').appendTo(self.$element);
        self[swipe].on('mouseover', function (event) {
            event.stopPropagation();
            event.preventDefault();
        });

        self[hammer] = new Hammer(self.$element[0], {
            tap: false,
            transform: false,
            release: false,
            hold: false,
            swipe: false,
            drag_block_horizontal: true,
            drag_block_vertical: $.fn.hammerScroll,
            drag_lock_to_axis: false,
            drag_min_distance: 5
        })

            .on('drag', function (event) {
                onDrag(self, event);
            })
            .on('dragend', function (event) {
                onDragEnd(self, event);
            });
    }

    /**
     * Destroy the hammer configuration.
     *
     * @param {Sidebar} self The sidebar instance
     *
     * @private
     */
    function destroyHammer(self) {
        if (!Hammer) {
            return;
        }

        self.$swipe.off('mouseover');
        self.$element.remove(self.$swipe);
    }

    // SIDEBAR CLASS DEFINITION
    // ========================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this Sidebar
     */
    var Sidebar = function (element, options) {
        this.guid           = jQuery.guid;
        this.options        = $.extend({}, Sidebar.DEFAULTS, options);
        this.$element       = $(element);
        this.$toggle        = $('.' + this.options.classToggle, this.$element);
        this.$wrapper       = $('.' + this.options.classWrapper, this.$element);
        this.eventType      = mobileCheck() ? 'touchstart' : 'click';
        this.scrollbarWidth = null;
        this.hammer         = undefined;
        this.hammerScroll   = undefined;
        this.$swipe         = undefined;
        this.$element.attr('data-sidebar', 'true');

        var $findToggle;

        if (Sidebar.POSITION_RIGHT !== this.options.position) {
            this.options.position = Sidebar.POSITION_LEFT;

        } else {
            this.$element.addClass('sidebar-right');
        }

        if (this.$element.hasClass('sidebar-right')) {
            this.options.position = Sidebar.POSITION_RIGHT;
        }

        if (this.options.locked) {
            this.options.forceToggle = 'always';
            this.$element.css('-webkit-transition', 'none');
            this.$element.css('transition', 'none');
            this.$wrapper.css('-webkit-transition', 'none');
            this.$wrapper.css('transition', 'none');
            this.$element.addClass(this.options.classLocked);
            this.$element.addClass(this.options.classForceOpen);
            this.$wrapper.addClass(this.options.classOpen + '-init');
        }

        if (!mobileCheck() && this.options.openOnHover && null === this.options.toggleId) {
            this.$element.on('mouseover.st.sidebar' + this.guid, $.proxy(Sidebar.prototype.open, this));
            this.$element.on('mouseout.st.sidebar' + this.guid, $.proxy(Sidebar.prototype.close, this));
        }

        if (null !== this.options.toggleId) {
            $findToggle = $('#' + this.options.toggleId);

            if (1 === $findToggle.size()) {
                this.$toggle.remove();
                this.$toggle = $findToggle;
            }

        } else {
            this.$element.addClass('sidebar-togglable');
        }

        this.$toggle.on(this.eventType + '.st.sidebar' + this.guid, null, this, Sidebar.prototype.toggle);
        $(window).on('keyup.st.sidebar' + this.guid, null, this, keyboardAction);
        $(window).on('resize.st.sidebar' + this.guid, null, this, onResizeWindow);

        if (this.$wrapper.hasClass(this.options.classOpen + '-init')) {
            if (isOverMinWidth(this)) {
                this.$wrapper.addClass(this.options.classOpen);

            } else {
                this.$wrapper.removeClass(this.options.classOpen);
            }

            this.$wrapper.removeClass(this.options.classOpen + '-init');
        }

        if (this.$wrapper.hasClass(this.options.classOpen)) {
            $(document).on(this.eventType + '.st.sidebar' + this.guid, null, this, closeExternal);
        }

        if (this.options.sidebarStickyHeader && $.fn.stickyHeader && !$.fn.hammerScroll) {
            this.stickyHeader = $('.sidebar-scroller', this.$wrapper).stickyHeader().data('st.stickyheader');
        }

        initHammer(this);

        this.$element.css('-webkit-transition', '');
        this.$element.css('transition', '');
        this.$wrapper.css('-webkit-transition', '');
        this.$wrapper.css('transition', '');
        this.$wrapper.addClass('sidebar-ready');
    },
        old;

    /**
     * Defaults options.
     *
     * @type {object}
     */
    Sidebar.DEFAULTS = {
        classToggle:         'sidebar-toggle',
        classWrapper:        'sidebar-wrapper',
        classOpen:           'sidebar-open',
        classLocked:         'sidebar-locked',
        classForceOpen:      'sidebar-force-open',
        classOnDragging:     'sidebar-dragging',
        openOnHover:         false,
        forceToggle:         false,//false, true, 'always'
        locked:              false,
        position:            Sidebar.POSITION_LEFT,//left, right
        minLockWidth:        992,
        toggleId:            null,
        sidebarStickyHeader: false,
        hammerScrollbar:     true,
        disabledKeyboard:    false,
        keyboardEvent:       {
            ctrlKey:             true,
            shiftKey:            false,
            altKey:              true,
            keyCode:             'S'.charCodeAt(0)
        }
    };

    /**
     * Left position.
     *
     * @type {string}
     */
    Sidebar.POSITION_LEFT  = 'left';

    /**
     * Right position.
     *
     * @type {string}
     */
    Sidebar.POSITION_RIGHT = 'right';

    /**
     * Get sidebar position.
     *
     * @returns {string} The position (left or right)
     *
     * @this Sidebar
     */
    Sidebar.prototype.getPosition = function () {
        return this.options.position;
    };

    /**
     * Checks if sidebar is locked (always open).
     *
     * @returns {boolean}
     *
     * @this Sidebar
     */
    Sidebar.prototype.isLocked = function () {
        return this.options.locked;
    };

    /**
     * Checks if sidebar is locked (always open).
     *
     * @returns {boolean}
     *
     * @this Sidebar
     */
    Sidebar.prototype.isOpen = function () {
        return this.$wrapper.hasClass(this.options.classOpen);
    };

    /**
     * Checks if sidebar is fully opened.
     *
     * @return {boolean}
     *
     * @this Sidebar
     */
    Sidebar.prototype.isFullyOpened = function () {
        return this.$element.hasClass(this.options.classForceOpen);
    };

    /**
     * Force open the sidebar.
     *
     * @this Sidebar
     */
    Sidebar.prototype.forceOpen = function () {
        if (this.isOpen() && this.isFullyOpened()) {
            return;
        }

        this.$element.addClass(this.options.classForceOpen);
        this.open();
        this.$toggle.removeClass(this.options.classToggle + '-opened');
    };

    /**
     * Force close the sidebar.
     *
     * @this Sidebar
     */
    Sidebar.prototype.forceClose = function () {
        if (!this.isOpen() || (this.isLocked() && isOverMinWidth(this))) {
            return;
        }

        this.$element.removeClass(this.options.classForceOpen);
        this.close();
    };

    /**
     * Open the sidebar.
     *
     * @this Sidebar
     */
    Sidebar.prototype.open = function () {
        if (this.isOpen()) {
            return;
        }

        $('[data-sidebar=true]').sidebar('forceClose');
        this.$wrapper.addClass(this.options.classOpen);
        this.$toggle.addClass(this.options.classToggle + '-opened');
        $(document).on(this.eventType + '.st.sidebar' + this.guid, null, this, closeExternal);
    };

    /**
     * Close open the sidebar.
     *
     * @this Sidebar
     */
    Sidebar.prototype.close = function () {
        if (!this.isOpen() || (this.isFullyOpened() && isOverMinWidth(this))) {
            return;
        }

        this.$wrapper.removeClass(this.options.classOpen);
        this.$toggle.removeClass(this.options.classToggle + '-opened');
        $(document).off(this.eventType + '.st.sidebar' + this.guid, closeExternal);
    };

    /**
     * Toggle the sidebar ("close, "open", "force open").
     *
     * @param {jQuery.Event|Event} [event]
     *
     * @typedef {Sidebar} Event.data The sidebar instance
     *
     * @this Sidebar
     */
    Sidebar.prototype.toggle = function (event) {
        var self = (undefined !== event) ? event.data : this,
            $target,
            $parents;

        if (event) {
            $target = $(event.target);
            $parents = $target.parents('.' + self.options.classWrapper);
            event.stopPropagation();

            if ($target.hasClass(self.options.classToggle) || $target.parents('.' + self.options.classToggle).size() > 0) {
                event.preventDefault();
            }

            if ($parents.size() > 0 || $target.hasClass('sidebar-swipe')) {
                return;
            }
        }

        if (self.isOpen()) {
            if (self.isFullyOpened()) {
                self.forceClose();

            } else if (isOverMinWidth(self) && $.inArray(self.options.forceToggle, [true, 'always']) >= 0) {
                self.forceOpen();

            } else {
                self.close();
            }

        } else if (isOverMinWidth(self) && 'always' === self.options.forceToggle) {
            self.forceOpen();

        } else {
            self.open();
        }
    };

    /**
     * Destroy instance.
     *
     * @this Sidebar
     */
    Sidebar.prototype.destroy = function () {
        if (!mobileCheck()) {
            this.$element.off('mouseover.st.sidebar' + this.guid, $.proxy(Sidebar.prototype.open, this));
            this.$element.off('mouseout.st.sidebar' + this.guid, $.proxy(Sidebar.prototype.close, this));
        }

        $(document).off(this.eventType + '.st.sidebar' + this.guid, closeExternal);
        $(window).off('resize.st.sidebar' + this.guid, onResizeWindow);
        this.$toggle.off(this.eventType + '.st.sidebar' + this.guid, Sidebar.prototype.toggle);
        $(window).off('keyup.st.sidebar' + this.guid, keyboardAction);
        destroyHammer(this);

        if (undefined !== this.stickyHeader) {
            this.stickyHeader.destroy();
        }

        this.$element.removeData('st.sidebar');
    };


    // SIDEBAR PLUGIN DEFINITION
    // =========================

    function Plugin(option, value) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.sidebar'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                $this.data('st.sidebar', (data = new Sidebar(this, options)));
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    old = $.fn.sidebar;

    $.fn.sidebar             = Plugin;
    $.fn.sidebar.Constructor = Sidebar;


    // SIDEBAR NO CONFLICT
    // ===================

    $.fn.sidebar.noConflict = function () {
        $.fn.sidebar = old;

        return this;
    };


    // SIDEBAR DATA-API
    // ================

    $(window).on('load', function () {
        $('[data-sidebar="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}(jQuery));
