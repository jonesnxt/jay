var Jay = (function(Jay, $, undefined) {
	Jay.verify = {};

	//ugly but necesarry side function, ill put it somewhere else later, or not...
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

	Jay.verify.alive = function() {


	}
	
	Jay.verify.run = function() {
		var host = getParameterByName('host');
		var hop = getParameterByName('hop');

		// get the metadata sent to us from the GET data
		for(var a=0;a<Jay.verify.filelist.length;a++)
		{
			$("#loadframe").attr("src", ("http://"+host+Jay.verify.filelist[a]));
			$("#loadframe").load(function() {
				alert(this.sandbox.toString())
			})
		}

	}
	
	Jay.verify.filelist = ["/index.php"]; // many more files here later
	return Jay;
}(Jay || {}, jQuery));