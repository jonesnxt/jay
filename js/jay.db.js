var Jay = (function(Jay, $, undefined) {

	Jay.db = {};
	Jay.db.meta = {};
	Jay.db.database = {};

	Jay.db.createTable = function(tablename, rows)
	{
		if(typeof(Jay.db.meta[tablename]) !== undefined) Jay.error.fatal("Failed to create table \"" + tablename +"\", already exists");

		Jay.db.database[tablename] = array();
		Jay.db.meta[tablename] = rows;
	}

	Jay.db.insert = function(tablename, data)
	{
		if(typeof(Jay.db.meta[tablename]) === undefined)
			Jay.error.fatal("Table \"" + tablename + "\" doesn't exist");
		//if(Jay.db.meta[tablename].length !== data.length) 
		//	Jay.error.fatal("Table \""+tablename+"\" has " + Jay.db.meta[tablename].length+" rows, given "+data.length);

		Jay.db.database[tablename].push(data);
	}

	Jay.db.select = function(tablename, index, value)
	{
		if(typeof(Jay.db.meta[tablename]) === undefined)
			Jay.error.fatal("Table \"" + tablename + "\" doesn't exist");
		if($.inArray(index, Jay.db.meta[tablename] === -1)
			Jay.error.fatal("Table \"" + tablename + "\" doesn't have index \""+index+"\""); 

		for(var a=0;a<Jay.db.database[tablename].length;a++)
		{
			if(Jay.db.database[tablename][a][index] == value) return Jay.db.database[tablename][a];
		}
		return false;
	}

	Jay.db.exists = function(tablename,)
	{
		if(typeof(Jay.db.meta[tablename]) === undefined) return false;
		return true;
	}

	return Jay;
}(Jay || {}, jQuery));