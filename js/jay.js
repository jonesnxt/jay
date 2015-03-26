// lets start this shit up

var Jay = {};
	"use strict";
	Jay.commonNodes = ["69.163.40.132","jnxt.org","nxt.noip.me","23.88.59.40","162.243.122.251"];

	Jay.requestType;
	Jay.requestTypes = {};
	Jay.requestTypes.singleNode = 0;
	Jay.requestTypes.multiNode = 1;
	Jay.requestTypes.autoNode = 2;
	Jay.txType;
	Jay.singleNode;
	Jay.isTestnet = false;
	Jay.init = function(node)
	{
		if(typeof(node) == "string")
		{
			Jay.requestType = Jay.requestTypes.singleNode;
			Jay.singleNode = node;
		}
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

	Jay.epoch = 1234


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
	var a = 1 + (1 << 5);
	console.log(5 >> 1);
	var pos = 4;
	console.log((a >> pos)%2);
});