/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var $_keys = require('../helpers').$keys;

/*
Transformers
 */
var _Catalog = require('./json.catalog.js');
var _PxGrid = require('./json.fields.px-grid');
var _PxCards = require('./json.fields.px-cards');
var _PxAgGrid = require('./json.fields.px-ag-grid');

/*
Main namespace
 */
var _Main = exports;

/*
Process PxForm Fields
 */
_Main.Transform = function(Entity) {
	var Layout = _el.get(Entity, 'px:layout');

	return _Main.Layout(Layout);
};

_Main.Layout = function(Layout) {
  var result = [];

	var Children = _el.find(Layout, '*');
  if(Children) result = _Main.Fields(Children);

	return result;
};

_Main.Fields = function(Fields) {
	var fields = [];
	Fields.forEach(function (Field, index) {
		var name = _el.name(Field);
		switch(name) {
			case 'field':
				fields.push(_Main.Field(Field));
				break;
			case 'tabPanel':
				fields.push(_Main.TabPanel(Field));
				break;
      case 'fieldContainer':
        fields.push(_Main.FieldSet(Field));
        break;
			default:
				fields.push({});
				break;
		};
	});
	return fields;
};

_Main.FieldSet = function(Field) {
  var Fields = _el.find(Field, '*');
  return {
    "fieldGroup": _Main.Fields(Fields)
    // ToDo: orentation = horizontal / vertical (see cascaded)
  };
};

_Main.TabPanel = function(TabPanel) {
	var Tabs = _el.find(TabPanel, 'px:tab');
	return {
		"type": "tabpanel",
    "data": {
      "tabs": _Main.Tabs(Tabs)
    }
	};
};

_Main.Tabs = function(Tabs) {
	var tabs = [];
	Tabs.forEach(function (Tab, index) {
		tabs.push(_Main.Tab(Tab));
	});
	return tabs;
};

_Main.Tab = function(Tab) {
	var Children = _el.find(Tab, '*');
	return {
		"type": "tab",
		"title": _attr.val(Tab, 'name'),
		"fields": _Main.Fields(Children)
	};
};

_Main.Field = function(Field) {
	var fieldId = _attr.val(Field, 'fieldId');
	var Metadata = $_keys['Fields'][fieldId];
  var dataType = _attr.val(Metadata, 'dataType');

  if(dataType === 'foreignKey') {
    field = _Main.Field_ForeignKey(Field);
  } else if (dataType === 'foreignTable') {
    field = _Main.Field_ForeignTable(Field);
  } else if (dataType === 'junctionTable') {
    field = _Main.Field_JunctionTable(Field);
  } else {
    field = _Main.Field_Regular(Field);
  }

  if(field.templateOptions) {
    var isIdentity = _attr.val(Metadata, 'isIdentity');
    var isNullable = _attr.val(Metadata, 'isNullable');
    var length = _attr.val(Metadata, 'length');
    var ParentEntity = _el.get(Metadata, '../..');
    var ParentEntityMode = _attr.val(ParentEntity, 'mode');
  
    if(!!(isIdentity && isIdentity === '1'))
      field.templateOptions.hide = true;
    if(ParentEntityMode && ParentEntityMode === 'readonly')
      field.templateOptions.disabled = true;
    if(isNullable && isNullable === '0')
      field.templateOptions.required = true;
    if(length)
      field.templateOptions.maxLength = parseInt(length);
  }

  return field;
};

/**
 * Regular Field
 */

_Main.Field_Regular = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId');
  var Metadata = $_keys['Fields'][fieldId];
  var fieldName = _attr.val(Metadata, 'fieldName');
  var headerText = _attr.val(Metadata, 'headerText');

  var field = {
    "key": fieldName, // _el.name(Metadata)
    "type": _Main.Type(Metadata),
    "templateOptions": {
      "label": headerText || '',
      "placeholder": ""
    },
    "data": {}
  };

  return field;
}

/**
 * Foreign Key Field
 */

_Main.Field_ForeignKey = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId');
  var Metadata = $_keys['Fields'][fieldId];
  var controlType = _attr.val(Metadata, 'controlType');
  var fieldName = _attr.val(Metadata, 'fieldName');
  var headerText = _attr.val(Metadata, 'headerText');

  var field = {
    "key": fieldName, // _el.name(Metadata)
    "type": _Main.Type(Metadata),
    "templateOptions": {
      "label": headerText || '',
      "placeholder": ""
    },
    "data": {}
  };

  field.templateOptions.options = _Main.Options(Metadata);
  if(controlType === 'default' || controlType === 'combobox') {
    var Data = _el.get( $_keys['Data'][fieldId], '*[1]');
    field.templateOptions.params = _Main.Params(_el.get(Metadata, '*[1]'), Data);
    field.className = 'flex-1';
    // ToDo: Template headerText
    field = {
      "className": "display-flex",
      //"label": headerText
      "fieldGroup": _Main.Cascaded(_el.get(Metadata, '*[1]/*[1]'), _el.get(Data, '*[1]'), [field])
    };
  }

  return field;
};

/*
async_select
ToDo: panel wrapper, headerText from parent Metadata
 */
_Main.Cascaded = function(Metadata, Data, cascaded) {
  if(Metadata) {
    var headerText = _attr.val(Metadata, 'headerText');
    cascaded = [{
      "className": "flex-1",
      "key": _el.name(Metadata),
      "type": "async_select",
      /*
      formState as model tells angular-formly to treat the field only as ui support,
      not part of regular model
      https://github.com/formly-js/angular-formly/issues/299 
      */
      "model": "formState",
      "templateOptions": {
        "label": headerText || '',
        "placeholder": "",
        "options": _Main.Options(Metadata),
        "params":  _Main.Params(Metadata, Data)
      }
    }].concat(cascaded);
    var Child = _el.get(Metadata, '*[1]');
    if(Child) {
      cascaded = _Main.Cascaded(Child, _el.get(Data, '*[1]'), []).concat(cascaded);
    }
  }
  return cascaded;
}

_Main.Options = function(Metadata) {
  var options = [];
  var controlType = _attr.val(Metadata, 'controlType');

  if(controlType === 'radiogroup') {
    var Rows = _el.find(Metadata, 'px:data/*[@value and @text]');
    Rows.forEach(function (Row, index) {
      options.push({
        "name": _attr.val(Row, 'text'),
        "value": _attr.val(Row, 'value')
      });
    });
  }

  return options;
};

_Main.Params = function(Metadata, Data) {
  var Parent = _el.get(Metadata, 'parent::*[1]');
  var Child = _el.get(Metadata, '*[1]');
  var foreignKey = _attr.val(Metadata, 'foreignKey');

  var result = {
    'catalogName': _attr.val(Metadata, 'Table_Schema') + '.' + _attr.val(Metadata, 'Table_Name'),
    'valueColumn': _attr.val(Metadata, 'dataValue'),
    'textColumn': _attr.val(Metadata, 'dataText'),
    'dependantEntity': _el.name(Parent)
  };

  if(Child && Data && foreignKey) {
    var foreignValue = _attr.val(Data, 'foreignValue');
    result["foreignEntity"] = _el.name(Child);
    result["foreignKey"] = foreignKey;
    result["foreignValue"] = foreignValue;
  }

  return result;
};

/**
 * Foreign Table Field
 */

_Main.Field_ForeignTable = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId');
  var Metadata = $_keys['Fields'][fieldId];
  var Entity = _el.get(Metadata, '*[1]');
  var relationshipType = _attr.val(Metadata, 'relationshipType');
  var controlType = _attr.val(Metadata, 'controlType');
  var fieldName = _attr.val(Metadata, 'fieldName');
  var headerText = _attr.val(Metadata, 'headerText');

  var field = {
    "key": fieldName, // _el.name(Metadata)
    "type": _Main.Type(Metadata),
    "templateOptions": {
      "label": headerText || '',
      "placeholder": ""
    },
    "data": {}
  };

  if(relationshipType === 'hasOne') {
    field.data.fields  = _Main.Transform(Entity);
    field.data.catalog = _Catalog.Transform(Entity);
  } else if(relationshipType === 'hasMany') {
    switch(controlType) {
      case 'default':
      case 'formView':
      default:
        field.data.fields  = _Main.Transform(Entity);
        break;
      case 'gridView':
        field.data.fields = _PxGrid.Transform(Entity);
        break;
      case 'cardsView':
        field.data.fields = _PxCards.Transform(Entity);
        break;
    }
    field.data.catalog = _Catalog.Transform(Entity);
  }

  return field;
};

/**
 * Junction Table Field
 */

_Main.Field_JunctionTable = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId');
  var Metadata = $_keys['Fields'][fieldId];
  var Entity = _el.get(Metadata, '*[1]');
  var relationshipType = _attr.val(Metadata, 'relationshipType');
  var controlType = _attr.val(Metadata, 'controlType');
  var fieldName = _attr.val(Metadata, 'fieldName');
  var headerText = _attr.val(Metadata, 'headerText');

  var field = {
    "key": fieldName, // _el.name(Metadata)
    "type": _Main.Type(Metadata),
    "templateOptions": {
      "label": headerText || '',
      "placeholder": ""
    },
    "data": {}
  };

  // @minSelections & @maxSelections
  var minSelections = _attr.val(Metadata, 'minSelections');
  if(minSelections && !isNaN(parseInt(minSelections)))
    field.templateOptions.minSelections = parseInt(minSelections);
  var maxSelections = _attr.val(Metadata, 'maxSelections');
  if(maxSelections && !isNaN(parseInt(maxSelections)))
    field.templateOptions.maxSelections = parseInt(maxSelections);

  if(relationshipType === 'hasMany') {
    switch(controlType) {
      case 'default':
      case 'gridView':
      default:
        field.data.fields = _PxAgGrid.Transform(Entity);
        break;
    }
    field.data.catalog = _Catalog.Transform(Entity);
  }

  return field;
};

/**
 * Types
 */

_Main.Type = function(Metadata) {
  var dataType = _attr.val(Metadata, 'dataType');

  switch(dataType) {
    default:
      return _Main.regularFieldsTypes(Metadata);
    case 'foreignTable':
      return _Main.foreignTableTypes(Metadata);
    case 'junctionTable':
      return _Main.junctionTableTypes(Metadata);
  }
};

_Main.regularFieldsTypes = function(Metadata) {
  var dataType = _attr.val(Metadata, 'dataType');
  var controlType = _attr.val(Metadata, 'controlType');
  var length = _attr.val(Metadata, 'length');

  switch(controlType) {
    case 'email':
      return 'email';
    case 'password':
      return 'password';
    case 'color':
      return 'color';
    case 'picture':
    case 'file':
      return 'file';
    default:
      return 'default';
    case 'radiogroup': {
      switch(dataType) {
        case 'foreignKey':
          return 'radio';
        default:
          return 'radio';
      }
    }
    case 'combobox': {
      switch(dataType) {
        case 'foreignKey':
          return 'async_select';
        default:
          return 'async_select';
      }
    }
    case 'default': {
      switch(dataType) {
        case 'char':
          return 'input';
        case 'varchar':
        case 'nvarchar':
        case 'nchar':
        case 'text': {
          if(!length || parseInt(length)<=255)
            return 'input';
          else
            return 'textarea';
        }
        case 'int':
        case 'tinyint':
        case 'float':
          return 'number';
        case 'money':
          return 'money';
        case 'date':
          return 'date';
        case 'time':
          return 'time';
        case 'datetime':
          return 'datetime';
        case 'bit':
          return 'checkbox';
        case 'foreignKey':
          return 'async_select';
        default:
          return 'default';
      }
    }
  }
};

_Main.foreignTableTypes = function(Metadata) {
  var relationshipType = _attr.val(Metadata, 'relationshipType');
  var controlType = _attr.val(Metadata, 'controlType');

  switch(relationshipType) {
    default:
    case 'hasOne': {
      switch(controlType) {
        case 'default':
        case 'formView':
        default:
          return 'form';
      }
    }
    case 'hasMany': {
      switch(controlType) {
        case 'default':
        case 'gridView':
        default:
          return 'grid';
        case 'cardsView':
          return 'cards';
        case 'formView':
          return 'form';
      }
    }
  }
};

_Main.junctionTableTypes = function(Metadata) {
  var relationshipType = _attr.val(Metadata, 'relationshipType');
  var controlType = _attr.val(Metadata, 'controlType');

  switch(relationshipType) {
    default:
    case 'hasMany': {
      switch(controlType) {
        case 'default':
        case 'gridView':
        default:
          return 'junction';
      }
    }
  }
};