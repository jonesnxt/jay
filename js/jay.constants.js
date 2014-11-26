
var Jay = (function(Jay, $, undefined) {

	Jay.constants = {};

	Jay.constants.oneNXT = 100000000;
	Jay.constants.jsonDef = JSON.parse("{\"error\":\"Default JSON string\"}");
	
	Jay.constants.typePayment = 0;
	Jay.constants.typeMessaging = 1;
	Jay.constants.typeAsset = 2;
	Jay.constants.typeMarketplace = 3;
	Jay.constants.typeAccountControl = 4;

	Jay.constants.constants.subtypeOrdinaryPayment = 0;
	Jay.constants.subtypeArbitraryMessage = 0;
	Jay.constants.subtypeAliasAssignment = 1;
	Jay.constants.subtypePollCreation = 2;
	Jay.constants.subtypeVoteCasting = 3;
	Jay.constants.subtypeHubAnnouncement = 4;
	Jay.constants.subtypeAccountInfo = 5;
	Jay.constants.subtypeAliasSell = 6;
	Jay.constants.subtypeAliasBuy = 7;
	Jay.constants.subtypeAssetIssuance = 0;
	Jay.constants.subtypeAssetTransfer = 1;
	Jay.constants.subtypeAskOrderPlacement = 2;
	Jay.constants.subtypeBidOrderPlacement = 3;
	Jay.constants.subtypeAskOrderCancellation = 4;
	Jay.constants.subtypeBidOrderCancellation = 5;
	Jay.constants.subtypeGoodsListing = 0;
	Jay.constants.subtypeGoodsDelisting = 1;
	Jay.constants.subtypePriceChange = 2;
	Jay.constants.subtypeQuantityChange = 3;
	Jay.constants.subtypePurchase = 4;
	Jay.constants.subtypeDelivery = 5;
	Jay.constants.subtypeFeedback = 6;
	Jay.constants.subtypeRefund = 7;
	Jay.constants.subtypeBalanceLeasing = 0;

	Jay.constants.transactionVersion = 1;

	Jay.constants.epoch = new Date(2013, 11, 24, 12, 0, 0, 0).UTC();

	Jay.constants.quorumDefault = 3;

	return Jay;
}(Jay || {}, jQuery));