
CI.Saver = function() {
	this.busy = false;
	this.lastScript;
	this.setTimeout();
}



CI.Saver.prototype = {

	setLatestScript: function(script) {
		this.lastScript = JSON.stringify(script);
	},

	doSave: function(urlSave) {
		
		var self = this;
	/*	if(this.busy) {
			this.redoAfterSave = true;
			return;
		}*/
		this.busy = true;
		var script = JSON.stringify(Entry.structure);
/*
		if(this.lastScript == script) {
			self.setTimeout();
			this.busy = false;
			return $.Deferred().resolve();
		}
*/
	//	$("#visualizer-saver").html('Visualization saving...');
		
		this.lastScript = script;
		return $.post(urlSave, {content: script}, function() {
//			var dateNow = new Date();
//			self.busy = false;

//			$("#visualizer-saver").html('Visualization saved (' + self.num(dateNow.getHours()) + ":" + self.num(dateNow.getMinutes()) + ":" + self.num(dateNow.getSeconds()) + ")");
/*			if(self.redoAfterSave) {
				self.redoAfterSave = false;
				self.doSave();
			}
			self.redoAfterSave = false;
*/
//			self.setTimeout();
		});
	},

	setTimeout: function() {
		this.timeout = window.setTimeout($.proxy(this.doSave, this), 10000);
	},

	num: function(val) {
		return (val + "").length == 1 ? '0' + val : val;
	}
}


