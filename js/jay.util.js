var Jay = (function(Jay, $, undefined) {
	Jay.util = {};

	Jay.util.getTime = function()
	{
		return Math.floor(Date.now() / 1000);
	}

	Jay.util.getNxtTime = function()
	{
		return Jay.util.getTime() - Jay.constants.epoch;
	}
	
	return Jay;
}(Jay || {}, jQuery));