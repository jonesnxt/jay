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

	Jay.oneNXT = 100000000;	
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

	Jay.transactionVersion = 1;
	Jay.TRFVersion = 1;

	Jay.epoch = new Date(2013, 11, 24, 12, 0, 0, 0).UTC();

	this.createTrfBytes = function(type, subtype, recipient, amount, fee, flags, attachment, appendages)
	{
		var trf = [];
		trf.push(Jay.TRFVersion);
		trf.push(type);
		trf.push(subtype + version << 4);
		
	}

	this.sendMoney()
	

	this.init(n);
};

$(document).ready(function() {
	var jnxt = new Jay("jnxt.org");
	console.log(jnxt.resolveNode("jnxt.org"))
});