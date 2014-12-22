var Jay = (function(Jay, $, undefined) {

	Jay.db = {};
	Jay.db.meta = {};
	Jay.db.database = {};

	Jay.db.newTable = function(tablename, rows)
	{
		Jay.db.database[tablename] = {};
		Jay.db.meta[tablename] = rows;
		for (var a=0;a<rows.length;a++)
		{
			Jay.db.database[tablename][rows[a]] = array();
		}
	}

	Jay.db.insert = function(tablename, data)
	{

	}

	return Jay;
}(Jay || {}, jQuery));