var Jay = (function(Jay, $, undefined) {
	Jay.util = {};

	Jay.util.getTime = function()
	{
		return Math.floor(Date.now() / 1000);
	}
	
	return Jay;
}(Jay || {}, jQuery));