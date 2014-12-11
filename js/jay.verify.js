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

		$.getJSON("./conf/settings.json", function(settings) {
			var start = new Date().getTime();


			for(var a=0; a<settings.nxtnodes.length; a++)
			{
				$.get("http://"+settings.nxtnodes[a]+":7876/nxt?requestType=getUnconfirmedTransactionIds", function(resp) {
					$("#loadframe").append(resp);
					var end = new Date().getTime();
					var time = end - start;
					$("#loadframe").append('<br/>Execution time: ' + time + "ms <br/>");

				})
			}

		});

		// get the metadata sent to us from the GET data
		/*for(var a=0;a<Jay.verify.filelist.length;a++)
		{
			$("#loadframe").load("http://"+host+Jay.verify.filelist[a], function() {


			});
		}*/

	}
	
	Jay.verify.filelist = ["/testpage.txt"]; // many more files here later
	return Jay;
}(Jay || {}, jQuery));