;(function($, window, undefined){

    /*jshint validthis: true */
    "use strict";

    // *** Plugin namespace ***
    var namespace = ".ioflex.jquery.listview";

    function appendItems(items){

    }

    function executeSearch(filter){
        if(this.searchFilter !== filter){
            this.searchFilter = filter;
            // TODO: Load data
        }
    }

    function findSearch(selector){
        const searchField = (this.$search) ? this.$search.find(selector) : $();
        return searchField;
    }

    function renderSearch(){
        if(this.options.search === true){
            const css = this.options.css,
                  selector = getCssSelector(css.search)
        }
    }

    /**
     * ListView public class definition.
     * @class ListView
     * @constructor
     * @param {String} element the corresponding DOM element.
     * @param {Object | String} options the options to override default settings.
     * @chainable ?
     * @since 1.0.0
     */
    const ListView = function(element, options){
        this.$element = $(element);
        this.items = [];
        this.options = $.extend(true, {}, Grid.defaults, this.element.data(), options);
        this.$origin = this.$element.clone();
        this.$search = null;
        this.searchFilter = "";
        this.templates = this.options.templates;
        this.total = 0;
        this.xqr = null;
    }

    /**
     * ListView default options.
     * @since 1.0.0
     */
    ListView.defaults = {

        /**
         * Defines whether the data shall be loaded via an asynchronous HTTP (Ajax) request.
         * @property ajax
         * @type boolean
         * @default false
         * @for defaults
         * @since 1.0.0
         */
        ajax: false,

        /**
         * Ajax request settings that shall be used for server-side communication.
         * All settings except data, error, success can be overridden.
         * For the full list of settings go to http://api.jquery.com/jQuery.ajax/
         * 
         * @property ajaxSettings
         * @type {Object}
         * @for defaults
         * @since 1.0.0
         */
        ajaxSettings: {
            cache: false,
            method: "GET",
            url: ""
        },

        /**
         * Contains all css classes.
         * 
         * @property css
         * @type {Object}
         * @for defaults
         * @since 1.0.0
         */
        css: {
            card: {
                base: "io-card",
                body: "io-card-body"
            },
            center: "text-center",
            left: "text-left",
            right: "text-right",
            search: "io-search"
        },

        /**
         * A dictionary of formatters.
         * 
         * @property formatters
         * @type {Object}
         * @for defaults
         * @since 1.0.0
         */
        formatters: {},

        /**
         * Function that handles list view item click events.
         * @property itemClickHandler
         * @type function
         * @param {Object} event 
         * @for defaults
         * @since 1.0.0
         */
        itemClickHandler: function(event){
            // TODO: Figure out how to get item reference.
            event.preventDefault();
            alert("Item clicked");
        },

        /**
         * Transforms the JSON request object in whatever way is needed 
         * on the server-side implementation.
         * @property requestHandler
         * @type {Function}
         * @param {JSON} request 
         * @default function(request) { return request; }
         * @for defaults
         * @since 1.0.0
         */
        requestHandler: function(request) { return request; },

        /**
         * Transforms the response object into the expected JSON response object.
         * @property responseHandler
         * @type {Function}
         * @param {JSON} response 
         * @default function(response) { return response; }
         * @for defaults
         * @since 1.0.0
         */
        responseHandler: function(response) { return response; },

        /**
         * Defines whether or not to display the search input element
         * above the listview.
         * @property search
         * @type {Boolean}
         * @for defaults
         * @since 1.0.0
         */
        search: true,

        /**
         * Defines the search settings.
         * @property searchSettings
         * @type {Object}
         * @for defaults
         * @since 1.0.0
         */
        searchSettings: {
            delay: 250,
            characters: 1
        },

        /**
         * Defines the html templates for elements used by the plugin.
         * @property templates
         * @type {Object}
         * @for defaults
         * @since 1.0.0
         */
        templates: {
            search: `<input class="{{css.search}}" placeholder="Search..."/>`,
            item: `<div class="{{css.card.base}}{{ctx.bg}}"><div class="{{css.card.body}}">{{ctx.content}}</div></div>`
        }
    };

    /**
     * Removes all items for the ListView.
     * 
     * @method clear
     * @chainable
     * @since 1.0.0
     */
    ListView.prototype.clear = function(){
        let removedItems = $.extend([], this.items);
        this.items = [];
        this.total = 0;
        // TODO: Load data
        this.$element.trigger(`cleared${namespace}`, [removedItems]);
        return this;
    }

    /**
     * Removes the control functionality completely and transforms
     * the current state to the initial html state.
     * 
     * @method destroy
     * @chainable
     * @since 1.0.0
     */
    ListView.prototype.destroy = function(){
        // TODO: Optimize to ensure complete initial state is restored.
        $(window).off(namespace);

        if(this.options.search === true){
            this.$search.remove();
        }

        this.$element.before(this.$origin).remove();
        return this;
    }

    /**
     * Gets the total number of list view items.
     * 
     * @method getTotal
     * @return {Number} the total row count.
     * @since 1.0.0
     */
    ListView.prototype.getTotal = function(){
        return this.total;
    }

    /**
     * Resets the state and reloads rows.
     * 
     * @method refresh
     * @chainable
     * @since 1.0.0
     */
    ListView.prototype.refresh = function(){
        // TODO: Load data
        return this;
    }

    /**
     * Searches in all items for a specific phrase.
     * 
     * @method search
     * @param {String} filter The search filter to use.
     * @chainable
     * @since 1.0.0
     */
    ListView.prototype.search = function(filter){
        filter = filter || "";

        if(this.searchFilter !== filter){
            let selector = getCssSelector(this.options.css.search);
            $(selector).val(filter);
        }

        executeSearch.call(this, filter);

        return this;
    }

    const old = $.fn.iolistview;

    $.fn.iolistview = function(option){
        let args = Array.prototype.slice.call(arguments, 1),
            returnValue = null,
            elements = this.each(function(index){
                const $base = $(this),
                        instance = $base.data(namespace),
                        options = typeof option === "object" && option;

                if(!instance && option === "destroy"){
                    return;
                }

                if(!instance){
                    $base.data(namespace, (instance = new ListView(this, options)));
                    init.call(instance);
                }

                if(typeof option === "string"){
                    
                    if(option.indexOf("get") === 0 && index === 0){
                        returnValue = instance[option].apply(instance, args);
                    }else if(option.indexOf("get") !== 0){
                        return instance[option].apply(instance, args);
                    }
                }
            });

            return (typeof option === "string" && option.indexOf("get") === 0) ? returnValue : elements;
    };

    $.fn.iolistview.Constructor = ListView;

    $.fn.iolistview.noConflict = function(){
        $.fn.iolistview = old;
        return this;
    };

})(jQuery, window);