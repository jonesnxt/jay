var Jay = (function(Jay, $, undefined) {

	Jay.crypto = {};

	Jay.crypto.sha256 = function(digest) {
		SHA256_init();
		SHA256_write(digest);
		var hash = SHA256_finalize();
		return converters.byteArrayToHexString(hash);
	}
	

	return Jay;
}(Jay || {}, jQuery));