
define( [ ], function(  ) {

	var FieldConstructor = function() {};
	
	FieldConstructor.prototype.__makeDom = function() {
		
		var self = this,
			dom = $("<div />"),
			div = $( "<div></div>" )
					.addClass( 'form-field' )
					.appendTo( dom )
          .bind('click', function( event ) {
            console.log('toggle');
            self.toggleSelect( event );
          
          }).bind('click', function( event ) {
          
            event.stopPropagation();
            
          });
          
          

		this.div = div;
		this.fieldElement = div;
		this.dom = dom;
		
		return dom;
	};

	FieldConstructor.prototype.checkValue = function() {

		if( this.dom ) {
      console.log( this.value );
			if( ! ( this.value instanceof Array) ) {
        this.value = [ 0, 0, 0, 1 ];
				return;
			}
      this.div.html( "rgba(" + this.value.join( ',' ) + ")" );
		}
	}


	return FieldConstructor;
});