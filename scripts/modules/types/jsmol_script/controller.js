define(['modules/defaultcontroller'], function(Default) {
	
	function controller() {};
	controller.prototype = $.extend(true, {}, Default, {

		configurationSend: {
			
			events: {
				onActionSent: {
					label: 'Send the JSMol script',
					description: 'On button click'
				}
			},
			
			rels: {
				'jsmolscript': {
					label: 'JSMol Script',
					description: 'Return the current script'
				}
				
			}

			/*
			'element': {
					label: 'Row',
					description: 'Returns the selected row in the list'
				
			*/
		},
		
		// Called by view
		onButtonClick:function(){
			var obj = {type: 'jsmolscript', value: this.module.getConfiguration().script};
			this.sendAction('jsmolscript', obj);
		},
		
		configurationReceive: {

			"script":{
				type:['string','text'],
				label:"Script text"
			},

			"iseditable":{
				type:['boolean','text'],
				label:"Is editable boolean"
			},
			
			"btnvalue": {
				type: ['string'],
				label: 'Button text',
				description: ''
			}
		},
		
		
		moduleInformations: {
			moduleName: 'Script Action'
		},
		

		doConfiguration: function(section) {
			
			return {
				groups: {
					'module': {
						config: {
							type: 'list'
						},

						fields: [

							{
								type: 'text',
								name: 'btnvalue',
								title: 'Button text'
							},

							{
								type: 'Checkbox',
								options: { 'allow': 'Show the script editor'},
								name: 'iseditable',
								title: 'Display editor'
							},

							{
								type: 'JScode',
								name: 'script',
								title: 'Script'
							}
						]
					}
				}
			}
			
		},
		
		doFillConfiguration: function() {
			
			var defaultbtnvalue = this.module.getConfiguration().btnvalue || "Execute script";
			var defaultscript = this.module.getConfiguration().script || "";
			var defaultiseditable = this.module.getConfiguration().iseditable || "allow" ;

			return {
				groups: {
					module: [{
						btnvalue: [defaultbtnvalue],
						script: [defaultscript],
						iseditable: [defaultiseditable],
					}]
				}
			}
			
		},
		
		
		doSaveConfiguration: function(confSection) {

			var group = confSection[0].module[0];
			var btnvalue = group.btnvalue[0];
			var script = group.script[0];
			var iseditable = group.iseditable[0];

			this.module.definition.configuration = {
				btnvalue: btnvalue,
				script: script,
				iseditable: iseditable,
			};
			
		}

		
	});

	return controller;
});