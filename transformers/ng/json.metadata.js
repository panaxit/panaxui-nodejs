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
Process _Metadata
 */
_Main.Transform = function(Entity) {
	var attrs = _el.customAttrs(Entity);
  var result = {};

  /* BasicMetadata */
  var dbId = attrs['dbId'],
      catalogName = '[' + attrs['Table_Schema'] + ']' + '.' + '[' + attrs['Table_Name'] + ']',
      schemaName = attrs['Table_Schema'],
      tableName = attrs['Table_Name'],
      mode = attrs['mode'],
      controlType = attrs['controlType'],
      lang = attrs['lang'];

  if(dbId) result['dbId'] = dbId;
  if(catalogName) result['catalogName'] = catalogName;
  if(schemaName) result['schemaName'] = schemaName;
  if(tableName) result['tableName'] = tableName;
  if(mode) result['mode'] = mode;
  if(controlType) result['controlType'] = controlType;
  if(lang) result['lang'] = lang;	
  
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

  /* Data Access FieldMetadata */
  result['permissions'] = {};

  var supportsInsert = attrs['supportsInsert'],
      supportsUpdate = attrs['supportsUpdate'],
      supportsDelete = attrs['supportsDelete'],
      disableInsert = attrs['disableInsert'],
      disableUpdate = attrs['disableUpdate'],
      disableDelete = attrs['disableDelete'];

  if(supportsInsert) result['permissions']['supportsInsert'] = supportsInsert;
  if(supportsUpdate) result['permissions']['supportsUpdate'] = supportsUpdate;
  if(supportsDelete) result['permissions']['supportsDelete'] = supportsDelete;
  if(disableInsert) result['permissions']['disableInsert'] = disableInsert;
  if(disableUpdate) result['permissions']['disableUpdate'] = disableUpdate;
  if(disableDelete) result['permissions']['disableDelete'] = disableDelete;

  return result;
};