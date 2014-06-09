define(['jquery', 'src/util/api', 'src/util/datatraversing'], function($, API, Traversing) {
	return {

		setModule: function(module) { this.module = module; },

		init: function() {
			this.initImpl( );
		},

		initImpl: function() {
			console.log( this );
			this.resolveReady();
		},

		inDom: function() {

		},

		sendAction: function(rel, value, event) {

			var actionsOut = this.module.actions_out(),
				i,
				jpath,
                actionname;

			if( ! actionsOut ) {
				return;
			}

			i = actionsOut.length - 1;
 
			for( ; i >= 0; i-- ) {

				if( actionsOut[i].rel == rel && ((event && event == actionsOut[i].event) || !event)) {

					actionname = actionsOut[ i ].name,
					jpath = actionsOut[ i ].jpath;	

					if(!jpath) {

						API.executeAction( actionname, value );
						API.doAction( actionname, value );

						continue;

					} else if(value.getChild) {

						value.getChild(jpath).done( function( returned ) {

							API.executeAction( actionname, returned );
							API.doAction( actionname, returned );

						});

					}
				}
			}
		},


		setVarFromEvent: function( event, rel, relSource, jpath, callback ) {

			var varsOut, i = 0, first;

			if( ! ( varsOut = this.module.vars_out() ) ) {
				return;
			}
			
			for( ; i < varsOut.length; i++ ) {
				
				if( varsOut[ i ].event == event  && ( varsOut[ i ].rel == rel || ! rel ) ) {

					if( first && callback ) {
						callback.call( this );
					}
					
					varsOut[ i ].jpath = varsOut[ i ].jpath || []; // Need not be undefined

					if( typeof varsOut[ i ].jpath == "string" ) {
						varsOut[ i ].jpath = varsOut[ i ].jpath.split('.');
						varsOut[ i ].jpath.shift();
					}

					API.setVar( varsOut[ i ].name, this.module.getVariableFromRel( relSource ), jpath.concat( varsOut[ i ].jpath ), varsOut[ i ].filter );
				}
			}
		},


		createDataFromEvent: function( event, rel, data ) {

			var varsOut, i = 0, first;

			if( ! ( varsOut = this.module.vars_out() ) ) {
				return;
			}
			
			for( ; i < varsOut.length; i++ ) {
				
				if( varsOut[ i ].event == event  && ( varsOut[ i ].rel == rel || ! rel ) ) {

					API.createData( varsOut[ i ].name, data, varsOut[ i ].filter );
				}
			}
		},

		"export": function() {},
        print: function() {},
		configurationStructure:  function() {},
		configFunctions: {},
		configAliases: {},
		events: {},
		variablesIn: [],

		resolveReady: function() {
			this.module._resolveController();
		}

	}
});
