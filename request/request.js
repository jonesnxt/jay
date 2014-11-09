$.support.cors = true

function APIRequest(request, data, callback) {
		var fulldata = "requestType="+request+"&"+data;
		$.ajax({
			url: "http://127.0.0.1:9987/nxt",
			type: "post",
			crossDomain: true,
			dataType: 'json',
			data : fulldata,
			async: true,
			success: callback,
			error: function (jqXHR, textStatus, errorThrown)
			{
				alert("request error!");
			}
		});

}