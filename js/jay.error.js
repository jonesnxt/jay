var Jay = (function(Jay, $, undefined) {

	Jay.error = {};

	Jay.error.warning = function(message) {
		alert("Warning: " + message);

	}

	Jay.error.fatal = function(message) {
		alert("FATAL: " + message);
		var stopTheCode = 1/0;
		
	}

	Jay.error.info = function(message) {
		alert("INFO: "+message);

	}

	return Jay;
}(Jay || {}, jQuery));