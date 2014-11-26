var Jay = (function(Jay, $, undefined) {

	Jay.request = {};


	Jay.request.getRandomNxtNodes = function(amount, dontinclude=null) {
		var allnodes = Jay.conf.getAttribute("nxtnodes");
		var randnodes = [];
		for(var a=0; a<amount; a++)
		{
			var node = allnodes[Math.ceil(Math.random() * allnodes.length)-1];
			for(var b=0; b<randnodes.length;b++)
			{
				if(node == randnodes[b])
				{
					a--;
					continue;
				}
			}
			if(dontinclude != null)
			{
				for(var b=0; b<dontinclude.length;b++)
				{
					if(node == dontinclude[b])
					{
						a--;
						continue;
					}
				}
			}
			randnodes.push(node);
		}
		return randnodes;
	}

	Jay.request.nxt = function(request, options, callback) {
		// get my 3 random servers, hope they don't collude (:
		var nodes = Jay.request.getRandomNxtNodes(3);
		var addr = ":7876/nxt?requestType="+request+"&"+$.param(options);

		$.when($.getJSON(nodes[0]+addr), $.getJSON(nodes[1]+addr), $.getJSON(nodes[2]+addr))
			.then(function(node1, node2, node3) {
				// ok, so now we have data on three nodes, lets hash and compare.
				var responses = [];
				responses.push(Jay.crypto.sha256(node1), Jay.crypto.sha256(node2), Jay.crypto.sha256(node3));
				if(responses[0] == responses[1] && responses[0] == responses[2])
				{
					// all nodes match, were done here, a speedy exit (:
					callback(node1);
				}
				else 
				{
					// begin the edge cases, lets call two more friends to see where they side here...
					var morenodes = Jay.request.getRandomNxtNodes(2, nodes);
					$.when($.getJSON(morenodes[0]+addr), $.getJSON(morenodes[1]+addr))
						.then(function(morenode1, morenode2) {
							

						}, function() {
							// so much that can go wrong...
							
						});
				}

			}, function() {
				// on failure

			});

	}


	Jay.request.nxtGet = function(server, request, options) {
		var addr = server+":7876/nxt?requestType="+request+"&"+Jay.convert.objectToPost(options);
		$.post()
	}

	Jay.request.send = function(url, callback);

	return Jay;
}(Jay || {}, jQuery));
