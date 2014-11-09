
var Jay = (function(Jay, $, undefined) {

	Jay.nxtget = new function(node, name, options, callback)
	{
		$.json("http://"+node+":7876/nxt?requestType="+name+"&"+options, callback);

	}



	Jay.request = new function(name, options, callback) {



	}



	return NRS;
}(NRS || {}, jQuery));