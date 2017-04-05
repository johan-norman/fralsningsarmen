var google = google || {};
	google.mfj = google.mfj || {};

(function($){
	
	/**
	 * 
	 * Constructor
	 * 
	 */
	
	/*
		/messages/json/?since=1234556&limit=10
		/messages/json/?since=1234556&limit=10&geocoded=1
		if you omit geocoded, it gets all messages
		if you included geocoded, it limits to geocoded messages (for the map, for example)
	 */
	
	google.mfj.MessageBubble = function( element ) {
		
		var self = this;
		
		/*
		 * Setup members
		 */
		
		this.textmsg = ''
		
		this.element = $(element);
		
		this.originalHeightOpen = 0;
		this.originalHeightClosed = 0;
		
		this.translatedHeightOpen = 0;
		this.translatedHeightClosed = 0;
		
		// An empty block for computing truncation
		
		this.empty = $("<div>").css("display", "block");
		
		// Check whether we can do css3 transitions
		
		this.csstransitions = $("html").hasClass( "csstransitions" );
		
		this.dom = {
			textmsg: $(".textmsg", this.element),
			dot: $(".dot", this.element),
			text: $(".text", this.element)
		};
		
		// Create some closures for callbacks
		
		this._onMouseClick = function(event){ self.onMouseClick(event); };
		this._onMouseOver = function(event){ self.onMouseOver(event); };
		this._onMouseOut = function(event){ self.onMouseOut(event); };
		
		this._appear = function(){ self.appear(); };
		this._update = function(){ self.update(); };
		
		// Store timeout ids
		
		this.delay = {
			update: null,
			show: null,
			hide: null
		};
		
		/*
		 * Initialise
		 */
		
		this.element.bind( "mouseenter", this._onMouseOver );
		this.element.bind( "mouseleave", this._onMouseOut );
		this.element.bind( "click", this._onMouseClick );
		
		this.textmsg = this.dom.textmsg.html();
		
		// this.truncate( this.textmsg, this.dom.textmsg, 2 );
		
		// If CSS3 can't handle animations, roll our own
		if( this.csstransitions !== true ) {
			this.initContentSlide();
		}
		
		// Allow jQuery access to the Class state & methods
		this.element.data( "MessageBubble", this );
		this.element.data( "locked", false );
	}
	
	/**
	 * 
	 * Public Methods
	 * 
	 */
	
	// Plays the message appear effect
	
	google.mfj.MessageBubble.prototype.appear = function( time ) {
		
		var self = this;
		
		if( typeof(time) === "undefined" ) {
			time = 500;
		}
		
		this.element.css("visibility", "visible");
		
		this.dom.text.stop().delay(time).animate({
			
			opacity: 1
			
		}, time * 0.5, function() {
			
			self.dom.dot.attr("style", '');
		});
		
		if( this.csstransitions === true ) {
			this.setTransition( this.dom.dot, "transform", time, "cubic-bezier(0.230, 1.000, 0.320, 1.000)");
			this.setScale( this.dom.dot, 1 );
			
		} else {
			
			this.dom.dot.stop().animate({
				opacity: 1
			}, time, "easeOutQuad");
		}
		
		setTimeout(function(){
			self.element.addClass( "enabled" );
		}, time + 200);
	};
	
	// Plays the message disappear effect
	
	google.mfj.MessageBubble.prototype.disappear = function( time ) {
		
		var self = this;
		
		if( typeof(time) === "undefined" ) {
			time = 500;
		}
		
		if( time === 0 ) {
			this.element.css("visibility", "hidden");
		}

		this.element.removeClass( "enabled" );
	};
	
	// Expands the message and reveals text / author
	
	google.mfj.MessageBubble.prototype.open = function() {
		
		// this.truncate( this.original, this.dom.original, 3 );
		// this.truncate( this.translated, this.dom.translated, 3 );
		
		if( this.csstransitions !== true ) {
			this.dom.author.stop().animate({
				opacity: 1
			}, 150);
		}
	};
	
	// Contracts the message and hides text / author
	
	google.mfj.MessageBubble.prototype.close = function() {
		
		// this.truncate( this.original, this.dom.original, 2 );
		// this.truncate( this.translated, this.dom.translated, 2 );
		
		if( this.csstransitions !== true ) {
			this.dom.author.stop().animate({
				opacity: 0
			}, 150);
		}
	};
	
	// Gets new content from service using ajax
	
	google.mfj.MessageBubble.prototype.refresh = function( data ) {
		
		if( typeof(data) === "undefined" ) {
			return;
		}
		
		/* data ==
		author: String
		id: int
		lang: String
		lat: String
		lng: String
		location: String
		text: String
		text_ja: String
		timestamp: int
		*/
		
		this.id = data.id;
		this.author = data.author;
		this.location = data.location;
		this.original = data.text;
		this.translated = data.text_ja;
		this.timestamp = data.timestamp;
		
		this.disappear();
		
		clearTimeout( this.delay.update );
		clearTimeout( this.delay.show );
		
		this.delay.update = setTimeout( this._update, 1200 );
		this.delay.show = setTimeout( this._appear, 1200 );
	};
	
	/**
	 * 
	 * Private Methods
	 * 
	 */
	
	google.mfj.MessageBubble.prototype.initContentSlide = function() {
		
		var self = this;
		
		this.originalHeightClosed = this.dom.original.height();
		this.translatedHeightClosed = this.dom.translated.height();
		
		// Open on mouseenter
		
		this.dom.lower.bind("mouseenter", function(){
			
			if( self.element.hasClass("enabled") !== true ) {
				return;
			}
			
			// If we don't yet know it, grab the hover height
			
			if( self.originalHeightOpen === 0 ) {
				self.originalHeightOpen = self.dom.original.height();
				self.dom.original.height( self.originalHeightClosed );
			}
			
			self.dom.original.stop().animate({
				height: self.originalHeightOpen
			}, 250, "easeInOutQuad");
		});
		
		this.dom.translated.bind("mouseenter", function(){
			
			if( self.element.hasClass("enabled") !== true ) {
				return;
			}
			
			if( self.translatedHeightOpen === 0 ) {
				self.translatedHeightOpen = self.dom.translated.height();
				self.dom.translated.height( self.translatedHeightClosed );
			}
			
			self.dom.translated.stop().animate({
				height: self.translatedHeightOpen
			},  250, "easeInOutQuad");
		});
		
		// Close on mouseleave
		
		this.dom.lower.bind("mouseleave", function(){
			
			self.dom.original.stop().animate({
				height: self.originalHeightClosed
			},  250, "easeInOutQuad");
		});
		
		this.dom.translated.bind("mouseleave", function(){
			
			self.dom.translated.stop().animate({
				height: self.translatedHeightClosed
			},  250, "easeInOutQuad");
		});
	};
	
	google.mfj.MessageBubble.prototype.update = function() {
		//this.element.attr( "href", "/messages/" + this.id );
		
		this.dom.original.textmsg( this.textmsg );
		
	};
	
	google.mfj.MessageBubble.prototype.truncate = function( text, container, numLines ) {	
		
		// Check the cache so we don't recompute
		if( typeof( this.index[ text + numLines ] ) !== "undefined" ) {
			container.html( this.index[ text + numLines ] );
			return;
		}
		
		this.empty.css({
			
			"line-height": container.css( "line-height" ),
			"font-family": container.css( "font-family" ),
			"text-align": container.css( "text-align" ),
			"font-size": container.css( "font-size" ),
			"width": container.css( "width" )
			
		});
		
		$("body").append( this.empty );
		this.empty.text( text );
		
		var lineHeight = parseInt( container.css( "line-height" ), 10 );
		var max = lineHeight * numLines;
		var i = text.length;
		
		while( this.empty.height() > max && --i ) {
			this.empty.text( text.substr(0,i) );
		}
		
		var output;
		
		if(i !== text.length) {
			output = this.index[ text + numLines ] = text.substr(0,i-3) + "&hellip;";
		} else {
			output = text;
		}
		
		this.index[ text + numLines ] = output;
		container.html( output );
		this.empty.remove();
	};
	
	google.mfj.MessageBubble.prototype.setTransition = function( element, prop, time, ease ) {
		
		prop = prop || "all";
		time = time || "250";
		ease = ease || "ease-in-out";
		
		var v = (prop === "transform");
		
		var trans = prop + " " + time + "ms " + ease;
		
		element.css({
			"-webkit-transition": v ? "-webkit-" + trans : trans,
			"-moz-transition": v ? "-moz-" + trans : trans,
			"-o-transition": v ? "-o-" + trans : trans,
			"transition": trans
		});
	};
	
	google.mfj.MessageBubble.prototype.setScale = function( element, scale ) {
		
		var trans = "scale(" + scale + ")";
		
		element.css({
			"-webkit-transform": trans,
			"-moz-transform": trans,
			"-o-transform": trans,
			"transform": trans
		});
	};
	
	/**
	 * 
	 * Event Handlers
	 * 
	 */
	
	google.mfj.MessageBubble.prototype.onMouseClick = function( event ) {
		//this.refresh();
	};
	
	google.mfj.MessageBubble.prototype.onMouseOver = function( event ) {
		
		if( this.element.hasClass("enabled") !== true ) {
			return;
		}
		
		this.element.data( "locked", true );
		this.open();
	};
	
	google.mfj.MessageBubble.prototype.onMouseOut = function( event ) {
		
		if( this.element.hasClass("enabled") !== true ) {
			return;
		}
		
		this.element.data( "locked", false );
		this.close();
	};
	
	/**
	 * Bind to jQuery
	 */
	
	$.fn.messageBubble = function(){
		return this.each(function(){
			(new google.mfj.MessageBubble(this));
		});
	}
	
})(jQuery);