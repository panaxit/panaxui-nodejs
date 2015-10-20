var libxmljs = require('libxslt').libxmljs;
var _ = require('lodash');

/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var _keyIndex = require('../helpers').keyIndex;

/*
Transformers
 */
var _Catalog = require('./json.catalog.js');

/*
Keys Indexes
 */
var $_FieldsIndex = {};
var $_DataIndex = {};

/*
Main entry point
 */
var _Main = exports;

_Main.Transform = function(Entity) {
	var Layout = _el.get(Entity, 'px:layout');

  // Extend key indexes progressively
  _.assign($_FieldsIndex, _keyIndex(Entity, "px:fields//*[@fieldId]", 'fieldId'));
  _.assign($_DataIndex, _keyIndex(Entity, "px:data/px:dataRow//*[@fieldId]", 'fieldId'));

	return _Main.Layout(Layout);
};

_Main.Layout = function(Layout) {
	var Children = _el.find(Layout, '*');
	return [_Main.FieldSet(Children)];
};

_Main.FieldSet = function(Fields) {
	return {
		"type": "fieldset",
		"fields": _Main.Fields(Fields)
	};
};

/*
ToDo:
@fieldContainer (fieldGroup?)
		.orentation = horizontal / vertical
 */

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
			default:
				fields.push({});
				break;
		};
	});
	return fields;
};

_Main.TabPanel = function(TabPanel) {
	var Tabs = _el.find(TabPanel, 'px:tab');
	return {
		"type": "tabPanel",
		"tabs": _Main.Tabs(Tabs)
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
		"name": _attr.val(Tab, 'name'),
		"fields": _Main.Fields(Children)
	};
};

_Main.Field = function(Field) {
	var fieldId = _attr.val(Field, 'fieldId');
	var Metadata = $_FieldsIndex[fieldId];
  var fieldName = _attr.val(Metadata, 'fieldName');
  var dataType = _attr.val(Metadata, 'dataType');
  var controlType = _attr.val(Metadata, 'controlType');
  var isIdentity = _attr.val(Metadata, 'isIdentity');
  var isNullable = _attr.val(Metadata, 'isNullable');
  var length = _attr.val(Metadata, 'length');
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

  if(!!(isIdentity && isIdentity === '1'))
    field.templateOptions.hide = true;
  // if(mode && mode === 'readonly')
  //   field.templateOptions.disabled = true;
  if(!(isNullable || isNullable !== '1'))
    field.templateOptions.required = true;
  if(length)
    field.templateOptions.maxLength = parseInt(length);

  if(dataType === 'foreignKey') {
    /*
    foreignKey
     */
    field.templateOptions.options = _Main.Options(Metadata);
    if(controlType === 'default' || controlType === 'combobox') {
      var Data = _el.get($_DataIndex[fieldId], '*[1]');
      field.templateOptions.params = _Main.Params(_el.get(Metadata, '*[1]'), Data);
      field.className = 'flex-1';
      // ToDo: Template headerText
      field = {
        "className": "display-flex",
        //"label": headerText
        "fieldGroup": _Main.Cascaded(_el.get(Metadata, '*[1]/*[1]'), _el.get(Data, '*[1]'), [field])
      };
    }
  } else if (dataType === 'foreignTable') {
    var relationshipType = _attr.val(Metadata, 'relationshipType');
    var Entity = _el.get(Metadata, '*[1]');
    /*
    foreignTable
     */
    if(relationshipType === 'hasOne') {
      /*
      hasOne
       */
      field.data = {
        "fields": _Main.Transform(Entity), //!!DANGER!! Overwrites Key Indexes
        "catalog": _Catalog.Transform(Entity)
      };
    } else if(relationshipType === 'hasMany') {
      /*
      hasMany
       */
       // ToDo
    }
  }

  return field;
};

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