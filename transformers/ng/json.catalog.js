/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;

/*
Main namespace
 */
var _Main = exports;

/*
Process Catalog
 */
_Main.Transform = function(Entity) {
	var attrs = _el.customAttrs(Entity);

  var result = {
		/* Basic Catalog Metadata */
		"dbId": attrs['dbId'],
		"catalogName": attrs['Table_Schema'] + '.' + attrs['Table_Name'],
		"schemaName": attrs['Table_Schema'],
		"tableName": attrs['Table_Name'],
		"mode": attrs['mode'],
		"controlType": attrs['controlType'],
		"lang": attrs['lang']
	};

  /* Pagination _attributes */
  var totalRecords = parseInt(attrs['totalRecords']),
      pageSize = parseInt(attrs['pageSize']),
      pageIndex = parseInt(attrs['pageIndex']);

  if(!isNaN(totalRecords)) result["totalItems"] = totalRecords;
  if(!isNaN(pageSize)) result["pageSize"] = pageSize;
  if(!isNaN(pageIndex)) result["pageIndex"] = pageIndex;

  /* Keys & References */
  var primaryKey = attrs['primaryKey'],
      identityKey = attrs['identityKey'],
      foreignReference = attrs['foreignReference'];

  if(primaryKey) result['primaryKey'] = primaryKey;
  if(identityKey) result['identityKey'] = identityKey;
  if(foreignReference) result['foreignReference'] = foreignReference;

  /* Custom Attributes */
  if(Object.keys(attrs.customAttrs).length)
    result["customAttrs"] = attrs.customAttrs;

  /* Data Access Metadata */
  result["metadata"] = {
    "supportsInsert": attrs['supportsInsert'],
    "supportsUpdate": attrs['supportsUpdate'],
    "supportsDelete": attrs['supportsDelete'],
    "disableInsert": attrs['disableInsert'],
    "disableUpdate": attrs['disableUpdate'],
    "disableDelete": attrs['disableDelete']
  };

  return result;
};