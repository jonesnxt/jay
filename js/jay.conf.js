var Jay = (function(Jay, $, undefined) {

	Jay.conf = {};
	Jay.conf.settings = {};

	Jay.conf.init = function(callback) {
		$.getJSON("./conf/settings.json", function(jsondata) {
			Jay.conf.settings = jsondata;
			callback();
		});

	}

	Jay.conf.getAttribute = function(attribute) {
		return Jay.conf.settings.nxtnodes;	

	}

	return Jay;
}(Jay || {}, jQuery));