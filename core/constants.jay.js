
var Jay = (function(Jay, $, undefined) {

	Jay.oneNXT = 100000000;
	Jay.jsonDef = JSON.parse("{\"error\":\"Default JSON string\"}");
	
	Jay.typePayment = 0;
	Jay.typeMessaging = 1;
	Jay.typeAsset = 2;
	Jay.typeMarketplace = 3;
	Jay.typeAccountControl = 4;

	Jay.subtypeOrdinaryPayment = 0;
	Jay.subtypeArbitraryMessage = 0;
	Jay.subtypeAliasAssignment = 1;
	Jay.subtypePollCreation = 2;
	Jay.subtypeVoteCasting = 3;
	Jay.subtypeHubAnnouncement = 4;
	Jay.subtypeAccountInfo = 5;
	Jay.subtypeAliasSell = 6;
	Jay.subtypeAliasBuy = 7;
	Jay.subtypeAssetIssuance = 0;
	Jay.subtypeAssetTransfer = 1;
	Jay.subtypeAskOrderPlacement = 2;
	Jay.subtypeBidOrderPlacement = 3;
	Jay.subtypeAskOrderCancellation = 4;
	Jay.subtypeBidOrderCancellation = 5;
	Jay.subtypeGoodsListing = 0;
	Jay.subtypeGoodsDelisting = 1;
	Jay.subtypePriceChange = 2;
	Jay.subtypeQuantityChange = 3;
	Jay.subtypePurchase = 4;
	Jay.subtypeDelivery = 5;
	Jay.subtypeFeedback = 6;
	Jay.subtypeRefund = 7;
	Jay.subtypeBalanceLeasing = 0;

	Jay.transactionVersion = 1;

	Jay.epoch = new Date(2013, 11, 24, 12, 0, 0, 0).UTC();

	return NRS;
}(NRS || {}, jQuery));