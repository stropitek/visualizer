
requirejs.config({
	"baseUrl": "scripts/",
	"paths": {
		"jquery": "http://code.jquery.com/jquery-migrate-1.2.1",
		"jqueryui": "libs/jqueryui/jquery-ui.min",
		"forms": "libs/forms",
		"ckeditor": "libs/ckeditor/ckeditor"
	},

	"shim": {
		"jquery": ['libs/jquery/jquery'],
		"ckeditor": ["libs/ckeditor/adapters/jquery"],
		"libs/jqgrid/js/jqgrid": ["jquery", "libs/jqgrid/js/i18n/grid.locale-en"],
		"libs/jsmol/js/JSmolApplet": ["libs/jsmol/JSmol.min.nojq"],
		"jqueryui": ["jquery"]
/*
		"libs/jsmol/js/JSmolApplet": ["libs/jsmol/js/JSmolCore"],
		"libs/jsmol/js/JSmolApi": ["libs/jsmol/js/JSmolCore"],
		"libs/jsmol/js/JSmolControls": ["libs/jsmol/js/JSmolCore"],
		"libs/jsmol/js/j2sjmol": ["libs/jsmol/js/JSmolCore"],
		"libs/jsmol/js/JSmol": ["libs/jsmol/js/JSmolCore"],
		"libs/jsmol/js/JSmolThree": ["libs/jsmol/js/JSmolCore"],
		"libs/jsmol/js/JSmolGLmol": ["libs/jsmol/js/JSmolCore", "libs/jsmol/js/JSmolThree"]
		*/
	}
});

require(['jquery', 'main/entrypoint', 'main/header'], function($, EntryPoint, Header) {


	$(document).ready(function() {

		var title = $("#visualizer-title");
		var buttons = $("#visualizer-buttons");

		var entryPoint = EntryPoint.init(function() {

			Header.addButtons(buttons, EntryPoint.getDataHandler(), EntryPoint.getViewHandler(), EntryPoint.getData(), EntryPoint.getView());
			
			
			if(EntryPoint.getDataHandler())
				EntryPoint.getDataHandler().updateButtons();

			if(EntryPoint.getViewHandler())
				EntryPoint.getViewHandler().updateButtons();

			if(EntryPoint.getViewHandler())
				Header.makeHeaderEditable(title, EntryPoint.getView(), EntryPoint.getViewHandler());
			else
				Header.makeHeader(title, EntryPoint.getView());
		});

	});
});

/*			
			CI.WebWorker.create('jsonparser', './scripts/webworker/scripts/jsonparser.js');
			CI.WebWorker.create('getminmaxmatrix', './scripts/webworker/scripts/getminmaxmatrix.js');
			CI.WebWorker.create('computesprings', './scripts/webworker/scripts/computesprings.js');
			CI.WebWorker.create('googleVisualizationArrayToDataTable', './scripts/webworker/scripts/googleVisualizationArrayToDataTable.js');
*/