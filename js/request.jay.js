var Jay = (function(Jay, $, undefined) {

	Jay.request = {};


	Jay.request.nxtGet = function(server, request, options, callback) {
		var addr = server+":7876/nxt?requestType="+request+"&"+Jay.convert.objectToPost(options);
		$.post()

	}

	return NRS;
}(NRS || {}, jQuery));
