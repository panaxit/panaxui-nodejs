var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var _keyIndex = require('../helpers').keyIndex;

/*
Keys & Indexes
 */
var $_FieldsIndex;

/*
Main entry point
 */
var _Main = exports;

_Main.Transform = function(Entity) {
	var Layout = _el.get(Entity, 'px:layout');

	$_FieldsIndex = _keyIndex(Entity, "px:fields/*|px:fields//*[@fieldId][not(namespace-uri(.)='urn:panax')]", 'fieldId');

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
@fieldContainer (fieldGroup)
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
	return {
		"key": _attr.val(Metadata, 'fieldName'), // _el.name(Metadata)
		"type": _Main.Type(Metadata),
		"templateOptions": {
			"label": _attr.val(Metadata, 'headerText') || '',
			"placeholder": ""
		},
		"data": {}
	};
};

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