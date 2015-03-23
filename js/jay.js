// lets start this shit up

var Jay = function(n) 
{
	"use strict";
	Jay.commonNodes = ["69.163.40.132","jnxt.org","nxt.noip.me","23.88.59.40","162.243.122.251"];

	this.requestType;
	Jay.requestTypes = {};
	Jay.requestTypes.singleNode = 0;
	Jay.requestTypes.multiNode = 1;
	Jay.requestTypes.autoNode = 2;
	this.txType;
	this.singleNode;
	this.isTestnet = false;
	this.init = function(node)
	{
		if(typeof(node) == "string")
		{
			this.requestType = Jay.requestTypes.singleNode;
			this.singleNode = node;
		}
	}

	this.resolveNode = function(nodeName)
	{
		var name = "http://";
		name += nodeName;
		if(this.isTestnet) name += ":6876";
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


	this.pad = function(length, val) 
	{
    	var array = [];
    	for (var i = 0; i < length; i++) 
    	{
        	array[i] = val;
    	}
    	return array;
	}

	this.positiveByteArray = function(byteArray)
	{
		return converters.hexStringToByteArray(converters.byteArrayToHexString(byteArray));
	}

	this.rsToBytes = function(rs)
	{
		var rec = new NxtAddress();
		rec.set(rs);
		var recip = (new BigInteger(rec.account_id())).toByteArray().reverse();
		if(recip.length == 9) recip = recip.slice(0, 8);
		while(recip.length < 8) recip = recip.concat(this.pad(1, 0));
		return recip;
	}
	this.numberToBytes = function(num)
	{
		var bytes = (new BigInteger((num*100000000).toString())).toByteArray().reverse();
		if(bytes.length == 9) bytes = bytes.slice(0, 8);
		while(bytes.length < 8) bytes = bytes.concat(this.pad(1, 0));
		return bytes;
	}

	this.createTrfBytes = function(type, subtype, recipient, amount, fee, attachment, appendages)
	{
		var trf = [];
		trf.push(Jay.TRFVersion);
		trf.push(type);
		trf.push(subtype + Jay.transactionVersion << 4);
		trf = trf.concat(this.rsToBytes(recipient));
		trf = trf.concat(this.numberToBytes(amount));
		trf = trf.concat(this.numberToBytes(fee));
		if(appendages == undefined) trf = trf.concat([0,0,0,0]);
		else trf = trf.concat(appendages.flags);
		if(attachment != undefined) trf = trf.concat(attachment);
		if(appendages != undefined) trf = trf.concat(this.combineAppendages(appendages));
		return this.positiveByteArray(trf);
	}

	this.createTrf = function(type, subtype, recipient, amount, fee, attachment, appendages)
	{
		var trfBytes = this.createTrfBytes(type, subtype, recipient, amount, fee, attachment, appendages);
		return this.finishTrf(trfBytes);
	}

	this.bytesToBigInteger = function(bytes)
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

	this.base62_encode = function(bytes) 
	{
		var value = this.bytesToBigInteger(bytes);
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

	this.finishTrf = function(trfBytes)
	{
		return "TX_" + this.base62_encode(trfBytes);
	}

	this.sendMoney = function(recipient, amount, appendages)
	{
		return this.createTrf(Jay.types.payment, Jay.subtypes.ordinaryPayment, recipient, amount, 1, undefined, appendages);
	}

	this.arbitraryMessage = function(recipient, message, appendages)
	{
		var appendage = this.addAppendage(undefined, Jay.appendages.message, message);
		return this.createTrf(Jay.types.messaging, Jay.subtypes.arbitraryMessage, recipient, 0, 1, undefined, appendage);
	}

	this.aliasAssignment = function(alias, data, appendages)
	{
		var attachment = [];
		attachment.push(alias.length)
		attachment = attachment.concat(converters.stringToByteArray(alias));
		attachment = attachment.concat(this.wordBytes(data.length));
		attachment = attachment.concat(converters.stringToByteArray(data));
		return this.createTrf(Jay.types.messaging, Jay.subtypes.aliasAssignment, Jay.genesisRS, 0, 1, attachment, appendages);
	}



	this.wordBytes = function(word)
	{
		return [(word%256), Math.floor(word/256)];
	}

	this.addAppendage = function(appendages, newAppendage, newAppendageData)
	{
		var flags;
		if(appendages != undefined)
		{
			flags = converters.byteArrayToSignedInt32(appendages.flags);
		}
		flags += newAppendage;

		if(newAppendage == Jay.appendages.message)
		{
			var data = [];
			data.push(Jay.transactionVersion);
			data = data.concat(this.wordBytes(newAppendageData.length));
			data = data.concat(converters.stringToByteArray(newAppendageData));
			appendages.message = data;
		}
		/*else if(newAppendage == Jay.appendages.encryptedMessage)
		{
			var data = [];
			data.push(Jay.transactionVersion);
			data = data.concat(this.wordBytes(newAppendageData.length));
			data = data.concat(converters.stringToByteArray(newAppendageData);
			appendages.encryptedMessage = data;
		}*/
		/*else if(newAppendage == Jay.appendages.encryptedMessageToSelf)
		{
			var data = [];
			data.push(Jay.transactionVersion);
			data = data.concat(this.wordBytes(newAppendageData.length));
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
	}

	this.combineAppendages = function(appendages)
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

	this.init(n);
};

$(document).ready(function() {



	//document.write((new Jay()).sendMoney("NXT-RJU8-JSNR-H9J4-2KWKY",100));
});