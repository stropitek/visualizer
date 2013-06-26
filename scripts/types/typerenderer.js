
define(['jquery', 'util/domdeferred'], function($) {

	var functions = {};


	functions.string = {};
	functions.string.toscreen = function(def, val) {
		def.resolve(val);	
	}
		
	functions.matrix = {};
	functions.matrix.toscreen = function(def, val) {
		def.resolve(val);
	}

	functions.number = {};
	functions.number.toscreen = function(def, val) {
		def.resolve(val);
	}

	functions.chemical = {};
	functions.chemical.toscreen = function(def, val) {
		CI.DataType.getValueFromJPath(source, "element.iupac.0.value").done(def.resolve);
	}

	functions.picture = {};
	functions.picture.toscreen = function(def, val) {
		def.resolve('<img src="' + CI.DataType.getValueIfNeeded(val) + '" />')
	}

	functions.gif = functions.picture;
	functions.jpeg = functions.picture;
	functions.jpg = functions.picture;
	functions.png = functions.picture;


	functions.mol2d = {};
	functions.mol2d.toscreen = function(def, molfile, options, highlights, box) {
		
		var id = BI.Util.getNextUniqueId();
		DOMDeferred.progress(function(dom) {
			
			// Find the dom in here
			if($("#" + id, dom).length == 0)
				return;

			var canvas = new ChemDoodle.ViewerCanvas(id, 100, 100);

			canvas.specs.backgroundColor = "transparent";
			canvas.specs.bonds_width_2D = .6;
			canvas.specs.bonds_saturationWidth_2D = .18;
			canvas.specs.bonds_hashSpacing_2D = 2.5;
			canvas.specs.atoms_font_size_2D = 10;
			canvas.specs.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
			canvas.specs.atoms_displayTerminalCarbonLabels_2D = true;

			var molLoaded = ChemDoodle.readMOL(molfile.value);
			molLoaded.scaleToAverageBondLength(14.4);
			canvas.loadMolecule(molLoaded);

			CI.RepoHighlight.listen(molfile._highlight, function(value, commonKeys) {

				if($("#" + id, dom).length == 0)
					return;

				var commonKeys2 = {};
				var atoms;

				// commonkeys: ['A', 'B'];
				for(var i = commonKeys.length - 1; i >= 0; i--) {
					atoms = molfile._atoms[commonKeys[i]]; // [0, 1, 15, 12]
					if(!atoms)
						continue;

					for(var j = atoms.length - 1; j >= 0; j--) {

						molLoaded.atoms[atoms[j]].isHover = value;
					}
				}

				for(var i = 0; i < molLoaded.atoms.length; i++) {
					canvas._domcanvas.width = canvas._domcanvas.width; // Erase canvas
					molLoaded.atoms[i].drawChildExtras = true;
				}

				canvas.repaint();

			}, true, box.id || 0);
		});

		def.resolve('<canvas id="' + id + '"></canvas>');
	}

	functions.mol3d = {};
	functions.mol3d.toscreen = function(def, molfile) {

		var id = BI.Util.getNextUniqueId();
		CI.Util.DOMDeferred.progress(function(dom) {

			if($("#" + id, dom).length == 0)
				return;

			var mg = new ChemDoodle.MolGrabberCanvas3D(id, 600, 400);
			mg.specs.projectionWidthHeightRatio_3D = 600 / 400;
			mg.specs.set3DRepresentation('Stick');
			mg.setSearchTerm('penicillin');
			mg.handle = null;
			mg.timeout = 15;
			mg.startAnimation = ChemDoodle._AnimatorCanvas.prototype.startAnimation;
			mg.stopAnimation = ChemDoodle._AnimatorCanvas.prototype.stopAnimation;
			//mg.isRunning = ChemDoodle._AnimatorCanvas.prototype.isRunning;
			mg.dblclick = ChemDoodle.RotatorCanvas.prototype.dblclick;
			mg.nextFrame = function(delta){
				var matrix = [];
				mat4.identity(matrix);
				var change = delta/1000;
			        var increment = Math.PI/15;
				mat4.rotate(matrix, increment*change, [ 1, 0, 0 ]);
				mat4.rotate(matrix, increment*change, [ 0, 1, 0 ]);
				mat4.rotate(matrix, increment*change, [ 0, 0, 1 ]);
				mat4.multiply(this.rotationMatrix, matrix);
			}
			
			mg.startAnimation();
		});

		def.resolve('<canvas id="' + id + '"></canvas>');
	}

	functions.jcamp = {};
	functions.jcamp.hexToRgb = function(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		    r: parseInt(result[1], 16),
		    g: parseInt(result[2], 16),
		    b: parseInt(result[3], 16)
		} : null;
	}
	functions.id = 0;
	functions.cache = [];

	functions.jcamp.fromdom = function(dom, value, opts, highlights, box) {
		var spectra;
		if(dom.length == 0)
			return;
		if(!dom.data('spectra')) {

			var spectra = new ChemDoodle.OverlayCanvas(dom.attr('id'), opts.width || 300, opts.height || 150);
			spectra.CIOnRepaint(function() {
				var h = [], zones = dom.data('zones'), all = dom.data('allspectras');
				
				if(spectra._highlights) {

					for(var i in spectra._highlights) {
						if(spectra._highlights[i] == 1) {

 							for(var j in zones) {
 								if(zones[j][i])
									h.push({zone: zones[j][i], color: all[j].plots_color });
							}
						}
					}
				}

				var mem = this.spectrum.memory;
				var context = this._domcanvas.getContext('2d');
				for(var i = 0, l = h.length; i < l; i++) {
					var x1 = this.spectrum.getTransformedX(h[i].zone[0], {}, mem.width, mem.offsetLeft);
					var x2 = this.spectrum.getTransformedX(h[i].zone[1], {}, mem.width, mem.offsetLeft);
				    context.beginPath();
				    context.rect(x1, 0, x2 - x1, mem.height);
				    var color = hexToRgb(h[i].color);

				    if(color == null || color.r == 0 && color.g == 0 && color.b == 0)
				    	color = {r: 222, g: 205,  b: 59};
				    context.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)";
				 	context.fill();
				}
			});

			spectra.CIOnMouseMove(function(e) {
				var zones = dom.data('zones');
				spectra._highlights = spectra._highlights || {};
				var mem = this.spectrum.memory;
				var x = e.offsetX;
				var x1 = this.spectrum.getInverseTransformedX(x);
				var min, max, j = 0;

				for(var k in zones) {
					for(var i in zones[k]) {
						min = Math.min(zones[k][i][0], zones[k][i][1]);
						max = Math.max(zones[k][i][0], zones[k][i][1]);

						if(min < x1 && max > x1) {

							if(!spectra._highlights[i]) {
								CI.RepoHighlight.set(i, 1);
							}

						} else if(spectra._highlights[i] == 1) {
							CI.RepoHighlight.set(i, 0);
						}
					}
				}
			});
			 

			dom.data('spectra', spectra);
			spectra.specs.plots_showYAxis = true;
			//spectra.specs.plots_flipXAxis = false;
			if(!opts) opts = {};
				
			spectra.specs.plots_flipXAxis =  opts.flipX || false;
			spectra.specs.plots_flipYAxis =  opts.flipY || false;
		//	spectra.specs.plots_color = opts.plotcolor || 'black';

		} else {
			spectra = dom.data('spectra');
		}

		// THIS PART IS SPECIFIC TO THE JCAMP
		var spectraid = opts.spectraid;

		if(!dom.data('allspectras'))
			dom.data('allspectras', {});



		if(!dom.data('zones'))
			dom.data('zones', {});

		if(!dom.data('allspectrasid'))
			dom.data('allspectrasid', {});

		var allspectras = dom.data('allspectras');
		var allspectrasid = dom.data('allspectrasid');
		var allzones = dom.data('zones');

/*		if(value._cacheId && CI.Type.jcamp.cache[value._cacheId]) {
			allspectras[spectraid] = CI.Type.jcamp.cache[value._cacheId];

		} else {*/
			allspectras[spectraid] = ChemDoodle.readJCAMP(value.value);
			functions.jcamp.cache.push(allspectras[spectraid]);
			value._cacheId = functions.jcamp.id;
			functions.id++;

			if(functions.jcamp.cache.length == 100) {
				functions.jcamp.cache.splice(0, 1);
				functions.jcamp.id--;
			}
	//	}
		
		allspectras[spectraid].plots_color = opts.plotcolor;
  		allspectras[spectraid].continuous = opts.continuous || false;

		if(allspectrasid[spectraid] == undefined) {
	  		var id = spectra.addSpectrum(allspectras[spectraid]);
			allspectrasid[spectraid] = id;
			spectra.getXMaxBound();
			spectra.repaint();
		} else if(allspectrasid[spectraid] == -1) {
			spectra.loadSpectrum(allspectras[spectraid]);
			spectra.getXMaxBound();
			spectra.repaint();
			CI.RepoHighlight.kill(box.id + "_"  + spectraid)
		} else {
			spectra.overlaySpectra[allspectrasid[spectraid]] = allspectras[spectraid];
			CI.RepoHighlight.kill(box.id + "_"  + spectraid)
		}

		allzones[spectraid] = value._zones;


		CI.RepoHighlight.listen(highlights, function(value, commonKeys) {
			spectra._highlights = spectra._highlights || {};
			for(var i = 0; i < commonKeys.length; i++) 
				spectra._highlights[commonKeys[i]] = value;
			spectra.repaint();
		}, true, box.id + "_"  + spectraid);
	}

	functions.jcamp.toscreen =function(def, value, args, highlights, box) {
		if(args.dom)
			return def.resolve(CI.Type.jcamp.doFromDom(args.dom, value, args, highlights, box));
		var id = BI.Util.getNextUniqueId();
		CI.Util.DOMDeferred.progress(function(dom) { 
			CI.Type.jcamp.doFromDom($("#" + id, dom), value, args, highlights, box); 
		});

		def.resolve('<canvas id="' + id + '"></canvas>');
	}

	functions.mf = {};
	functions.mf.toscreen = function(dev, value) {
		return def.resolve(CI.DataType.getValueIfNeeded(value).replace(/\[([0-9]+)/g,"[<sup>$1</sup>").replace(/([a-zA-Z)])([0-9]+)/g,"$1<sub>$2</sub>").replace(/\(([0-9+-]+)\)/g,"<sup>$1</sup>"));
	}
	function.boolean = {};
	functions.boolean.toscreen = function(def, value) {
		if(value)
			def.resolve('<span style="color: green;">&#10004;</span>');
		else
			def.resolve('<span style="color: red;">&#10008;</span>');
	}
});