/*
 * jQuery.ajaxMultiQueue - A queue for multiple concurrent ajax requests
 * (c) 2013 Amir Grozki
 * Dual licensed under the MIT and GPL licenses.
 *
 * Based on jQuery.ajaxQueue
 * (c) 2011 Corey Frang
 *
 * Requires jQuery 1.5+
 */
(function($) {
	$.ajaxMultiQueue = function(n) {
		return new MultiQueue(~~n);
	};

	function MultiQueue(number) {
		var queues, i,
			current = 0;

		if (!queues) {
			queues = new Array(number);

			for (i = 0; i < number; i++) {
				queues[i] = $({});
			}
		}

		function queue(ajaxOpts) {
			var jqXHR,
				dfd = $.Deferred(),
				promise = dfd.promise();

			queues[current].queue(doRequest);
			current = (current + 1) % number;

			function doRequest(next) {
				if (ajaxOpts.currentPage && ajaxOpts.currentPage != NRS.currentPage) {
					next();
				} else if (ajaxOpts.currentSubPage && ajaxOpts.currentSubPage != NRS.currentSubPage) {
					next();
				} else {
					jqXHR = $.ajax(ajaxOpts);

					jqXHR.done(dfd.resolve)
						.fail(dfd.reject)
						.then(next, next);
				}
			}

			return promise;
		};

		return {
			queue: queue
		};
	}

})(jQuery);

var Jay = {};

	Jay.commonNodes = ["69.163.40.132","jnxt.org","nxt.noip.me","23.88.59.40","162.243.122.251"];

	Jay.msTimeout = 1000;

	Jay.requestMethods = {};
	Jay.requestMethods.single = 0;
	Jay.requestMethods.fastest = 1;
	Jay.requestMethods.validate = 2;
	Jay.requestMethods.cautious = 3;
	Jay.requestMethods.default = Jay.requestMethods.validate;
	Jay.requestMethod = Jay.requestMethods.default;

	Jay.req = $.ajaxMultiQueue(6);

	Jay.singleNode;
	Jay.bestNodes = [];
	Jay.isTestnet = false;

	Jay.queue = function(node, parameters, onSuccess, onFailure)
	{
		var obj = {};
		obj.url = Jay.resolveNode(node) + "?requestType="+parameters["requestType"];
		obj.beforeSend = function(jqxhr, settings) {
			jqxhr.node = node;
			jqxhr.parameters = parameters;
		};
		obj.method = 'POST';
		obj.success = onSuccess;
		if(onFailure != undefined) obj.error = onFailure;
		else obj.error = onSuccess;
		obj.timeout = Jay.msTimeout;
		Jay.req.queue(obj);
	}

	Jay.setNode = function(nodeName)
	{
		Jay.singleNode = nodeName;
	}

	Jay.setRequestMethod = function(requestMethod)
	{
		Jay.requestMethod = requestMethod;
	}

	Jay.resolveNode = function(nodeName)
	{
		var name = "http://";
		name += nodeName;
		if(Jay.isTestnet) name += ":6876";
		else name += ":7876";
		name += "/nxt";
		return name;
	}

	Jay.nodeScan = function(complete)
	{
		var counter = 0;
		for(var a=0;a<Jay.commonNodes.length;a++)
		{
			Jay.queue(Jay.commonNodes[a], {"requestType":"getTime"}, function(resp, status, xhr) {
				if(status == "success")
				{
					Jay.bestNodes.push(xhr.node);
				}
				counter++;
				if(counter == Jay.commonNodes.length)
				{
					complete();
				}
			});
		}
	}

	Jay.request = function(requestType, parameters, onSuccess, onFailure, requestMethod)
	{
		if(requestMethod == undefined) requestMethod = Jay.requestMethod;
		parameters["requestType"] = requestType;

		if(requestMethod == Jay.requestMethods.single)
		{

			if(Jay.singleNode == undefined) var useNode = Jay.commonNodes[0];
			else var useNode = Jay.commonNodes[0];
			Jay.queue(useNode, parameters, onSuccess, onFailure);
		}
		else if(requestMethod == Jay.requestMethods.fastest)
		{
			if(Jay.bestNodes.length == 0)
			{
					Jay.nodeScan(function() {
						console.log(Jay.bestNodes);
						Jay.queue(Jay.bestNodes[0], parameters, onSuccess, onFailure);
					});
			}
			else
			{
				Jay.queue(Jay.bestNodes[0], parameters, onSuccess, onFailure);
			}
		}
	}

	Jay.types = {};
	Jay.subtypes = {};

	Jay.oneNxt = 100000000;	
	Jay.types.payment = 0;
	Jay.types.messaging = 1;
	Jay.types.asset = 2;
	Jay.types.marketplace = 3;
	Jay.types.accountControl = 4;
	Jay.types.monetarySystem = 5;

	Jay.subtypes.ordinaryPayment = 0;
	Jay.subtypes.arbitraryMessage = 0;
	Jay.subtypes.aliasAssignment = 1;
	Jay.subtypes.pollCreation = 2;
	Jay.subtypes.voteCasting = 3;
	Jay.subtypes.hubAnnouncement = 4;
	Jay.subtypes.accountInfo = 5;
	Jay.subtypes.aliasSell = 6;
	Jay.subtypes.aliasBuy = 7;
	Jay.subtypes.assetIssuance = 0;
	Jay.subtypes.assetTransfer = 1;
	Jay.subtypes.askOrderPlacement = 2;
	Jay.subtypes.bidOrderPlacement = 3;
	Jay.subtypes.askOrderCancellation = 4;
	Jay.subtypes.bidOrderCancellation = 5;
	Jay.subtypes.goodsListing = 0;
	Jay.subtypes.goodsDelisting = 1;
	Jay.subtypes.priceChange = 2;
	Jay.subtypes.quantityChange = 3;
	Jay.subtypes.purchase = 4;
	Jay.subtypes.delivery = 5;
	Jay.subtypes.feedback = 6;
	Jay.subtypes.refund = 7;
	Jay.subtypes.balanceLeasing = 0;
	Jay.subtypes.currencyIssuance = 0;
	Jay.subtypes.reserveIncrease = 1;
	Jay.subtypes.reserveClaim = 2;
	Jay.subtypes.currencyTransfer = 3;
	Jay.subtypes.exchangeOffer = 4;
	Jay.subtypes.exchangeBuy = 5;
	Jay.subtypes.exchangeSell = 6;
	Jay.subtypes.currencyMinting = 7;
	Jay.subtypes.currencyDeletion = 8;

	Jay.appendages = {};
	Jay.appendages.none = 0;
	Jay.appendages.message = 1;
	Jay.appendages.encryptedMessage = 2;
	Jay.appendages.publicKeyAnnouncement = 4;
	Jay.appendages.encryptedMessageToSelf = 8;
	Jay.appendages.phasedTransaction = 16;


	Jay.transactionVersion = 1;
	Jay.TRFVersion = 1;
	Jay.genesisRS = "NXT-MRCC-2YLS-8M54-3CMAJ";

	Jay.epoch = 1385294400;

	Jay.getNxtTime = function()
	{
		return Math.floor(Date.now() / 1000) - Jay.epoch;
	}


	Jay.pad = function(length, val) 
	{
    	var array = [];
    	for (var i = 0; i < length; i++) 
    	{
        	array[i] = val;
    	}
    	return array;
	}

	Jay.positiveByteArray = function(byteArray)
	{
		return converters.hexStringToByteArray(converters.byteArrayToHexString(byteArray));
	}

	Jay.rsToBytes = function(rs)
	{
		var rec = new NxtAddress();
		rec.set(rs);
		var recip = (new BigInteger(rec.account_id())).toByteArray().reverse();
		if(recip.length == 9) recip = recip.slice(0, 8);
		while(recip.length < 8) recip = recip.concat(Jay.pad(1, 0));
		return recip;
	}

	function byteArrayToBigInteger(byteArray, startIndex) {
		var value = new BigInteger("0", 10);
		var temp1, temp2;
		for (var i = byteArray.length - 1; i >= 0; i--) {
			temp1 = value.multiply(new BigInteger("256", 10));
			temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
			value = temp2;
		}

		return value;
	}

	Jay.bytesToRs = function(bytes)
	{
		var accid = (byteArrayToBigInteger(bytes)).toString();
		var rec = new NxtAddress();
		rec.set(accid);
		return rec.toString();
	}

	Jay.numberToBytes = function(num)
	{
		var bytes = (new BigInteger((num).toString())).toByteArray().reverse();
		if(bytes.length == 9) bytes = bytes.slice(0, 8);
		while(bytes.length < 8) bytes = bytes.concat(Jay.pad(1, 0));
		return bytes;
	}

	Jay.createTrfBytes = function(type, subtype, recipient, amount, fee, attachment, appendages)
	{
		var trf = [];
		trf.push(Jay.TRFVersion);
		trf.push(type);
		trf.push((subtype) + (Jay.transactionVersion << 4));
		trf = trf.concat(Jay.rsToBytes(recipient));
		trf = trf.concat(Jay.numberToBytes(amount*Jay.oneNxt));
		trf = trf.concat(Jay.numberToBytes(fee*Jay.oneNxt));
		if(appendages == undefined) trf = trf.concat([0,0,0,0]);
		else trf = trf.concat(appendages.flags);
		if(attachment != undefined) trf = trf.concat(attachment);
		if(appendages != undefined) trf = trf.concat(Jay.combineAppendages(appendages));
		return Jay.positiveByteArray(trf);
	}

	Jay.createTrf = function(type, subtype, recipient, amount, fee, attachment, appendages)
	{
		var trfBytes = Jay.createTrfBytes(type, subtype, recipient, amount, fee, attachment, appendages);
		return Jay.finishTrf(trfBytes);
	}

	Jay.bytesToBigInteger = function(bytes)
	{
		var bi = new BigInteger("0");
		for(var a=0; a<bytes.length; a++)
		{
			bi = bi.multiply(new BigInteger("256"));
			//var term = (new BigInteger(bytes[a].toString())).multiply(multiplier);
			bi = bi.add(new BigInteger(bytes[a].toString()));

		}
		return bi;
	}

	Jay.base62_encode = function(bytes) 
	{
		var value = Jay.bytesToBigInteger(bytes);
	    var buf = "";
	    while ((new BigInteger("0")).compareTo(value) < 0) {
	      	var divRem = value.divideAndRemainder(new BigInteger("62"));
	      	var remainder = divRem[1].intValue();
	      
	      	if (remainder < 10) 
	     	{
	        	buf += String.fromCharCode(remainder + '0'.charCodeAt(0));
	      	}
	      	else if (remainder < 10 + 26) 
	     	{
	      		buf += String.fromCharCode(remainder + 'A'.charCodeAt(0) - 10);
	      	} 
	      	else 
	      	{
	        	buf += String.fromCharCode(remainder + 'a'.charCodeAt(0) - 10 - 26);
	      	}
	      
	      	value = divRem[0];
	    }
	    buf = buf.split("").reverse().join("");
	    return buf;
	  }

	Jay.finishTrf = function(trfBytes)
	{
		return "TX_" + Jay.base62_encode(trfBytes);
	}

	Jay.sendMoney = function(recipient, amount, appendages)
	{
		return Jay.createTrf(Jay.types.payment, Jay.subtypes.ordinaryPayment, recipient, amount, 1, undefined, appendages);
	}

	Jay.sendMessage = function(recipient, message, appendages)
	{
		var appendage = Jay.addAppendage(Jay.appendages.message, message, appendages);
		return Jay.createTrf(Jay.types.messaging, Jay.subtypes.arbitraryMessage, recipient, 0, 1, undefined, appendage);
	}

	Jay.setAlias = function(alias, data, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment.push(alias.length)
		attachment = attachment.concat(converters.stringToByteArray(alias));
		attachment = attachment.concat(Jay.wordBytes(data.length));
		attachment = attachment.concat(converters.stringToByteArray(data));
		return Jay.createTrf(Jay.types.messaging, Jay.subtypes.aliasAssignment, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.setAccountInfo = function(name, description, description, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment.push(name.length);
		attachment = attachment.concat(converters.stringToByteArray(name));
		attachment = attachment.concat(Jay.wordBytes(description.length));
		attachment = attachment.concat(converters.stringToByteArray(data));
		return Jay.createTrf(Jay.types.messaging, Jay.subtypes.accountInfo, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.sellAlias = function(alias, price, recpipient, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attechment.push(alias.length);
		attachment = attachment.concat(converters.stringToByteArray(alias));
		attachment = attachment.concat(Jay.numberToBytes(price*oneNxt));
		if(recipient == undefined || recipient == "anyone" || recipient == "") return Jay.createTrf(Jay.types.messaging, Jay.subtypes.aliasSell, [0,0,0,0,0,0,0,0], 0, 1, attachment, appendages);
		return Jay.createTrf(Jay.types.messaging, Jay.subtypes.aliasSell, recipient, 0, 1, attachment, appendages);
	}

	Jay.buyAlias = function(alias, amount, seller, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment.push(alias.length);
		attachment = attachment.concat(converters.stringToByteArray(alias));
		return Jay.createTrf(Jay.types.messaging, Jay.subtypes.aliasBuy, recipient, amount, 1, attachment, appendages);
	}

	Jay.issueAsset = function(name, description, quantity, decimals, appendages)
	{
		var attachment = [];
		attachment.push(transactionVersion);
		attachment.push(name.length);
		attachment = attachment.concat(converters.stringToByteArray(name));
		attachment = attachment.concat(Jay.wordBytes(description.length));
		attachment = attachment.concat(converters.stringToByteArray(description));
		attachment = attachment.concat(Jay.numberToBytes(quantity*Math.pow(10,decimals)));
		attachment.push(decimals);
		return Jay.createTrf(Jay.types.asset, Jay.subtypes.assetIssuance, Jay.genesisRS, 0, 1000, attachment, appendages);
	}

	Jay.transferAsset = function(recipient, assetId, quantityQNT, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(assetId));
		attachment = attachment.concat(Jay.numberToBytes(quantityQNT));
		return Jay.createTrf(Jay.types.asset, Jay.subtypes.assetTransfer, recipient, 0, 1, attachment, appendages);
	}

	Jay.placeAskOrder = function(assetId, quantityQNT, price, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(assetId));
		attachment = attachment.concat(Jay.numberToBytes(quantityQNT));
		attachment = attachment.concat(Jay.numberToBytes(price*Jay.oneNxt));
		return Jay.createTrf(Jay.types.asset, Jay.subtypes.askOrderPlacement, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.placeBidOrder = function(assetId, quantityQNT, price, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(assetId));
		attachment = attachment.concat(Jay.numberToBytes(quantityQNT));
		attachment = attachment.concat(Jay.numberToBytes(price*Jay.oneNxt));
		return Jay.createTrf(Jay.types.asset, Jay.subtypes.bidOrderPlacement, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.cancelAskOrder = function(orderId, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(orderId));
		return Jay.createTrf(Jay.types.asset, Jay.subtypes.askOrderCancellation, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.cancelBidOrder = function(orderId, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(orderId));
		return Jay.createTrf(Jay.types.asset, Jay.subtypes.bidOrderCancellation, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.dgsListing = function(name, description, tags, quantity, price, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.wordBytes(name.length));
		attachment = attachment.concat(converters.stringToByteArray(name));
		attachment = attachment.concat(Jay.wordBytes(description.length));
		attachment = attachment.concat(converters.stringToByteArray(description));
		attachment = attachment.concat(Jay.wordBytes(tags.length));
		attachment = attachment.concat(converters.stringToByteArray(tags));
		attachment = attachment.concat(converters.int32ToBytes(quantity));
		attachment = attachment.concat(Jay.numberToBytes(price*Jay.oneNxt));
		return Jay.createTrf(Jay.types.marketplace, Jay.subtypes.goodsListing, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.dgsDelisting = function(itemId, appendages)
	{
		var attachmetn = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(itemId));
		return Jay.createTrf(Jay.types.marketplace, Jay.subtypes.goodsDelisting, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.dgsPriceChange = function(itemId, newPrice, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(itemId));
		attachment = attachment.concat(Jay.numberToBytes(newPrice*Jay.oneNxt));
		return Jay.createTrf(Jay.types.marketplace, Jay.subtypes.priceChange, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.dgsQuantityChange = function(itemId, deltaQuantity, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(itemId));
		attachment = attachment.concat(converters.int32ToBytes(deltaQuantity));
		return Jay.createTrf(Jay.types.marketplace, Jay.subtypes.quantityChange, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.dgsPurchase = function(itemId, quantity, price, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion)
		attachment = attachment.concat(Jay.numberToBytes(itemId));
		attachment = attachment.concat(converters.int32ToBytes(quantity));
		attachment = attachment.concat(Jay.numberToBytes(price*Jay.oneNxt));
		return Jay.createTrf(Jay.types.marketplace, Jay.subtypes.purchase, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.dgsDelivery = function(itemId, discount)
	{
		var attachment = [];
	}

	Jay.dgsFeedback = function(itemId, feedback, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(itemId));
		appendages = Jay.addAppendage(Jay.appendages.arbitraryMessage, feedback, appendages);
		return Jay.createTrf(Jay.types.marketplace, Jay.subtypes.feedback, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.dgsRefund = function(purchaseId, refundAmount, appendages)
	{
		var attachment = [];
		attachment.push(transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(purchaseId));
		attachment = attachment.concat(Jay.numberToBytes(refundAmount*Jay.oneNxt));
		return Jay.createTrf(Jay.types.marketplace, Jay.subtypes.refund, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.leaseBalance = function(recipient, duration, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.wordBytes(duration));
		return Jay.createTrf(Jay.types.accountControl, Jay.subtypes.balanceLeasing, recipient, 0, 1, attachment, appendages);
	}

	Jay.currencyReserveIncrease = function(currencyId, amountPerUnit, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(currencyId));
		attachment = attachment.concat(amountPerUnit*Jay.oneNxt);
		return Jay.createTrf(Jay.types.monetarySystem, Jay.subtypes.reserveIncrease, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.transferCurrency = function(recipient, currencyId, amountQNT, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(currencyId));
		attachment = attachment.concat(Jay.numberToBytes(amountQNT));
		return Jay.createTrf(Jay.types.monetarySystem, Jay.subtyes.currencyTransfer, recipient, 0, 1, attachment, appendages)
	}

	Jay.currencyMint = function(currencyId, nonce, units, counter, appendages)
	{
		var attachment = [];
		attachment.push(Jay.transactionVersion);
		attachment = attachment.concat(Jay.numberToBytes(currencyId));
		attachment = attachment.concat(Jay.numberToBytes(nonce));
		attachment = attachment.concat(Jay.numberToBytes(units));
		attachment = attachment.concat(Jay.numberToBytes(counter));
		return Jay.createTrf(Jay.types.monetarySystem, Jay.subtypes.currencyMinting, Jay.genesisRS, 0, 1, attachment, appendages);
	}

	Jay.wordBytes = function(word)
	{
		return [Math.floor(word%256), Math.floor(word/256)];
	}

	Jay.addAppendage = function(newAppendage, newAppendageData, appendages)
	{
		var flags;
		if(appendages != undefined)
		{
			flags = converters.byteArrayToSignedInt32(appendages.flags);
		}
		else 
		{
			appendages = {};
			flags = 0;
		}

		flags += newAppendage;

		if(newAppendage == Jay.appendages.message)
		{
			var data = [];
			data.push(Jay.transactionVersion);
			data = data.concat(Jay.wordBytes(newAppendageData.length));
			data.push(0);
			data.push(128);
			data = data.concat(converters.stringToByteArray(newAppendageData));
			appendages.message = data;
		}
		/*else if(newAppendage == Jay.appendages.encryptedMessage)
		{
			var data = [];
			data.push(Jay.transactionVersion);
			data = data.concat(Jay.wordBytes(newAppendageData.length));
			data = data.concat(converters.stringToByteArray(newAppendageData);
			appendages.encryptedMessage = data;
		}*/
		/*else if(newAppendage == Jay.appendages.encryptedMessageToSelf)
		{
			var data = [];
			data.push(Jay.transactionVersion);
			data = data.concat(Jay.wordBytes(newAppendageData.length));
			data = data.concat(converters.stringToByteArray(newAppendageData);
			appendages.encryptedMessageToSelf = data;
		}*/
		if(newAppendage == Jay.appendages.publicKeyAnnouncement)
		{
			var data = [];
			data.push(Jay.transactionVersion);
			data = data.concat(converters.hexStringToByteArray(newAppendageData));
			appendages.publicKeyAnnouncement = data;
		}
		appendages.flags = converters.int32ToBytes(flags);
		return appendages;
	}

	Jay.combineAppendages = function(appendages)
	{
		var data = [];
		if(appendages.message != undefined)
		{
			data = data.concat(appendages.message);
		}		
		if(appendages.encryptedMessage != undefined)
		{
			data = data.concat(appendages.encryptedMessage)
		}
		if(appendages.encryptedMessageToSelf != undefined)
		{
			data = data.concat(appendages.encryptedMessageToSelf)
		}
		if(appendages.publicKeyAnnouncement != undefined)
		{
			data = data.concat(appendages.publicKeyAnnouncement);
		}
		return data;
	}

$(document).ready(function() {

document.write(Jay.sendMessage("NXT-RJU8-JSNR-H9J4-2KWKY","yes", Jay.addAppendage(Jay.appendages.publicKeyAnnouncement, "3a74c6848c01a0d7deb2eda978366ad29e366dc3fdea11868a06cc2677139213")));
document.write("<br/>" + Jay.placeBidOrder("17435996739008103286", 100, 10.25));

	//document.write((new Jay()).sendMoney("NXT-RJU8-JSNR-H9J4-2KWKY",100));

	Jay.setRequestMethod(Jay.requestMethods.fastest);
	Jay.request("getTime", {}, function(data, a, b) {
	 	console.log(JSON.stringify(data));
	});
});