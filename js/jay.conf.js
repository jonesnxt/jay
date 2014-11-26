var Jay = (function(Jay, $, undefined) {

	Jay.conf = {};
	Jay.conf.settings = {};

	Jay.conf.init = function() {
		$.getJSON("../conf/settings.json", function(jsondata) {
			Jay.settings = JSON.parse(jsondata);
		});

	}

	Jay.conf.getAttribute = function(attribute) {
		var toeval = "Jay.conf.settings." + attribute;
		return eval(toeval);
	}

	return Jay;
}(Jay || {}, jQuery));