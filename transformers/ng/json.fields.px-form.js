/*
Helpers
 */
var _attr = require('../helpers').attr
var _el = require('../helpers').el
var $keys = require('../helpers').$keys

/*
Transformers
 */
var _Metadata = require('./json.metadata.js')
var _PxGrid = require('./json.fields.px-grid')
var _PxCards = require('./json.fields.px-cards')
var _PxAgGrid = require('./json.fields.px-ag-grid')

/*
Main namespace
 */
var _Main = exports

/*
Process PxForm Fields
 */
_Main.transform = function(Entity) {
  var Layout = _el.get(Entity, 'px:layout')

  return _Main.layout(Layout)
}

_Main.layout = function(Layout) {
  var result = []
  var Children = _el.find(Layout, '*')

  if (Children) {
    result = _Main.fields(Children)
  }

  return result
}

_Main.fields = function(Fields) {
  var fields = []

  Fields.forEach(function(Field) {
    var name = _el.name(Field)

    switch (name) {
      case 'field':
        fields.push(_Main.field(Field))
        break
      case 'tabPanel':
        fields.push(_Main.tabPanel(Field))
        break
      case 'fieldContainer':
        fields.push(_Main.fieldSet(Field))
        break
      default:
        fields.push({})
        break
    }
  })

  return fields
}

_Main.fieldSet = function(Field) {
  var Fields = _el.find(Field, '*')

  return {
    fieldGroup: _Main.fields(Fields),
    // ToDo: orentation = horizontal / vertical (see cascaded)
  }
}

_Main.tabPanel = function(TabPanel) {
  var Tabs = _el.find(TabPanel, 'px:tab')

  return {
    type: 'tabpanel',
    data: {
      tabs: _Main.tabs(Tabs),
    },
  }
}

_Main.tabs = function(Tabs) {
  var tabs = []

  Tabs.forEach(function(Tab) {
    tabs.push(_Main.tab(Tab))
  })

  return tabs
}

_Main.tab = function(Tab) {
  var Children = _el.find(Tab, '*')

  return {
    type: 'tab',
    title: _attr.val(Tab, 'name'),
    fields: _Main.fields(Children),
  }
}

_Main.field = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId')
  var FieldMetadata = $keys.Fields[fieldId]
  var dataType = _attr.val(FieldMetadata, 'dataType')
  var Entity,
    field,
    referencesItself,
    isIdentity,
    isNullable,
    length,
    ParentEntity,
    ParentEntityMode

  if (dataType === 'foreignKey') {
    Entity = _el.get(FieldMetadata, '*[1]')
    referencesItself = Entity && _attr.val(Entity, 'referencesItself') || undefined
    if (referencesItself && referencesItself === 'true') {
      /*
      Foreign Key to self-ref table = Junction Table
       */
      field = _Main.fieldJunctionTable(Field)
    } else {
      /*
      Foreign Key to regular table
       */
      field = _Main.fieldForeignKey(Field)
    }
  } else if (dataType === 'foreignTable') {
    field = _Main.fieldForeignTable(Field)
  } else if (dataType === 'junctionTable') {
    field = _Main.fieldJunctionTable(Field)
  } else {
    field = _Main.fieldRegular(Field)
  }

  if (field.templateOptions) {
    isIdentity = _attr.val(FieldMetadata, 'isIdentity')
    isNullable = _attr.val(FieldMetadata, 'isNullable')
    length = _attr.val(FieldMetadata, 'length')
    ParentEntity = _el.get(FieldMetadata, '../..')
    ParentEntityMode = _attr.val(ParentEntity, 'mode')

    if (!!(isIdentity && isIdentity === '1')) {
      field.templateOptions.hide = true
    }
    if (ParentEntityMode && ParentEntityMode === 'readonly') {
      field.templateOptions.disabled = true
    }
    if (isNullable && isNullable === '0') {
      field.templateOptions.required = true
    }
    if (length) {
      field.templateOptions.maxLength = parseInt(length, 10)
    }
  }

  return field
}

_Main.fieldRegular = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId')
  var FieldMetadata = $keys.Fields[fieldId]
  var fieldName = _attr.val(FieldMetadata, 'fieldName')
  var headerText = _attr.val(FieldMetadata, 'headerText')

  return {
    key: fieldName, // _el.name(FieldMetadata)
    type: _Main.type(FieldMetadata),
    templateOptions: {
      label: headerText || '',
      placeholder: '',
    },
    data: {},
  }
}

_Main.fieldForeignKey = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId')
  var FieldMetadata = $keys.Fields[fieldId]
  var controlType = _attr.val(FieldMetadata, 'controlType')
  var fieldName = _attr.val(FieldMetadata, 'fieldName')
  var headerText = _attr.val(FieldMetadata, 'headerText')
  var Data

  var field = {
    key: fieldName, // _el.name(FieldMetadata)
    type: _Main.type(FieldMetadata),
    templateOptions: {
      label: headerText || '',
      placeholder: '',
    },
    data: {},
  }

  field.templateOptions.options = _Main.options(FieldMetadata)
  if (controlType === 'default' || controlType === 'combobox') {
    Data = _el.get($keys.Data[fieldId], '*[1]')
    field.templateOptions.params = _Main.params(_el.get(FieldMetadata, '*[1]'), Data)
    field.className = 'flex-1'
    // ToDo: Template headerText
    field = {
      className: 'display-flex',
      //"label": headerText
      fieldGroup: _Main.cascaded(_el.get(FieldMetadata, '*[1]/*[1]'), _el.get(Data, '*[1]'), [field]),
    }
  }

  return field
}

//async_select
// ToDo: panel wrapper, headerText from parent FieldMetadata
_Main.cascaded = function(FieldMetadata, Data, cascaded) {
  var headerText, Child

  if (FieldMetadata) {
    headerText = _attr.val(FieldMetadata, 'headerText')
    cascaded = [{
      className: 'flex-1',
      key: _el.name(FieldMetadata),
      type: 'async_select',
      /*
      formState as model tells angular-formly to treat the field only as ui support,
      not part of regular model
      https://github.com/formly-js/angular-formly/issues/299
      */
      model: 'formState',
      templateOptions: {
        label: headerText || '',
        placeholder: '',
        options: _Main.options(FieldMetadata),
        params: _Main.params(FieldMetadata, Data),
      },
    }].concat(cascaded)
    Child = _el.get(FieldMetadata, '*[1]')
    if (Child) {
      cascaded = _Main.cascaded(Child, _el.get(Data, '*[1]'), []).concat(cascaded)
    }
  }
  return cascaded
}

_Main.options = function(FieldMetadata) {
  var options = []
  var controlType = _attr.val(FieldMetadata, 'controlType')
  var Rows

  if (controlType === 'radiogroup') {
    Rows = _el.find(FieldMetadata, 'px:data/*[@value and @text]')
    Rows.forEach(function(Row) {
      options.push({
        name: _attr.val(Row, 'text'),
        value: _attr.val(Row, 'value'),
      })
    })
  }

  return options
}

_Main.params = function(FieldMetadata, Data) {
  var Parent = _el.get(FieldMetadata, 'parent::*[1]')
  var Child = _el.get(FieldMetadata, '*[1]')
  var foreignKey = _attr.val(FieldMetadata, 'foreignKey')
  var foreignValue

  var result = {
    catalogName: '[' + _attr.val(FieldMetadata, 'Table_Schema') + ']' + '.' +
      '[' + _attr.val(FieldMetadata, 'Table_Name') + ']',
    valueColumn: _attr.val(FieldMetadata, 'dataValue'),
    textColumn: _attr.val(FieldMetadata, 'dataText'),
    dependantEntity: _el.name(Parent),
  }

  if (Child && Data && foreignKey) {
    foreignValue = _attr.val(Data, 'foreignValue')
    result.foreignEntity = _el.name(Child)
    result.foreignKey = foreignKey
    result.foreignValue = foreignValue
  }

  return result
}

_Main.fieldForeignTable = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId')
  var FieldMetadata = $keys.Fields[fieldId]
  var Entity = _el.get(FieldMetadata, '*[1]')
  var relationshipType = _attr.val(FieldMetadata, 'relationshipType')
  var controlType = _attr.val(FieldMetadata, 'controlType')
  var fieldName = _attr.val(FieldMetadata, 'fieldName')
  var headerText = _attr.val(FieldMetadata, 'headerText')

  var field = {
    key: fieldName, // _el.name(FieldMetadata)
    type: _Main.type(FieldMetadata),
    templateOptions: {
      label: headerText || '',
      placeholder: '',
    },
    data: {},
  }

  if (relationshipType === 'hasOne') {
    field.data.fields = _Main.transform(Entity)
    field.data.metadata = _Metadata.transform(Entity)
  } else if (relationshipType === 'hasMany') {
    switch (controlType) {
      case 'formView':
      default:
        field.data.fields = _Main.transform(Entity)
        break
      case 'gridView':
        field.data.fields = _PxGrid.transform(Entity)
        break
      case 'cardsView':
        field.data.fields = _PxCards.transform(Entity)
        break
      case 'default':
      case 'fileTemplate':
        field.data.fields = {}
        break
    }
    field.data.metadata = _Metadata.transform(Entity)
  }

  return field
}

_Main.fieldJunctionTable = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId')
  var FieldMetadata = $keys.Fields[fieldId]
  var Entity = _el.get(FieldMetadata, '*[1]')
  var relationshipType = _attr.val(FieldMetadata, 'relationshipType')
  var controlType = _attr.val(FieldMetadata, 'controlType')
  var fieldName = _attr.val(FieldMetadata, 'fieldName')
  var headerText = _attr.val(FieldMetadata, 'headerText')
  var minSelections,
    maxSelections

  var field = {
    key: fieldName, // _el.name(FieldMetadata)
    type: _Main.type(FieldMetadata),
    templateOptions: {
      label: headerText || '',
      placeholder: '',
    },
    data: {},
  }

  if (relationshipType === 'belongsTo') {
    /*
    dataType == 'foreignKey'
    rendered as junction Table
     */
    field.data.fields = _PxAgGrid.fields([Field])
  } else {
    /*
    dataType == 'junctionTable'
     */
    switch (controlType) {
      case 'default':
      case 'gridView':
      default:
        field.data.fields = _PxAgGrid.transform(Entity)
        break
    }
  }
  field.data.metadata = _Metadata.transform(Entity)

  // @minSelections & @maxSelections
  if (relationshipType === 'hasMany') {
    // 1:N
    minSelections = _attr.val(FieldMetadata, 'minSelections')
    if (minSelections && !isNaN(parseInt(minSelections, 10))) {
      field.templateOptions.minSelections = parseInt(minSelections, 10)
    }
    maxSelections = _attr.val(FieldMetadata, 'maxSelections')
    if (maxSelections && !isNaN(parseInt(maxSelections, 10))) {
      field.templateOptions.maxSelections = parseInt(maxSelections, 10)
    }
  } else {
    // - 'hasOne' 1:1 (has unique key)
    // - 'belongsTo'
    field.templateOptions.maxSelections = 1
  }

  return field
}

_Main.type = function(FieldMetadata) {
  var dataType = _attr.val(FieldMetadata, 'dataType')

  switch (dataType) {
    default: return _Main.regularFieldsTypes(FieldMetadata)
    case 'foreignKey':
      return _Main.foreignKeyTypes(FieldMetadata)
    case 'foreignTable':
      return _Main.foreignTableTypes(FieldMetadata)
    case 'junctionTable':
      return _Main.junctionTableTypes(FieldMetadata)
  }
}

_Main.regularFieldsTypes = function(FieldMetadata) {
  var dataType = _attr.val(FieldMetadata, 'dataType')
  var controlType = _attr.val(FieldMetadata, 'controlType')
  var length = _attr.val(FieldMetadata, 'length')

  switch (controlType) {
    case 'email':
      return 'email'
    case 'password':
      return 'password'
    case 'color':
      return 'color'
    case 'picture':
      return 'picture'
    case 'file':
      return 'file'
    default:
      return 'default'
    case 'radiogroup':
      return 'radio'
    case 'combobox':
      return 'select'
    case 'default': {
      switch (dataType) {
        case 'char':
          return 'input'
        case 'varchar':
        case 'nvarchar':
        case 'nchar':
        case 'text': {
          if (!length || parseInt(length, 10) <= 255) {
            return 'input'
          } else {
            return 'textarea'
          }
        }
        case 'int':
        case 'tinyint':
        case 'float':
          return 'number'
        case 'money':
          return 'money'
        case 'date':
          return 'date'
        case 'time':
          return 'time'
        case 'datetime':
          return 'datetime'
        case 'bit':
          return 'checkbox'
        default:
          return 'default'
      }
    }
  }
}

_Main.foreignKeyTypes = function(FieldMetadata) {
  var controlType = _attr.val(FieldMetadata, 'controlType')
  var Entity = _el.get(FieldMetadata, '*[1]')
  var referencesItself = Entity && _attr.val(Entity, 'referencesItself') || undefined

  if (referencesItself && referencesItself === 'true') {
    /*
    Foreign Key to self-ref table = Junction Table
     */
    return 'junction'
  } else {
    /*
    Foreign Key to regular table
     */
    switch (controlType) {
      default:
      case 'combobox':
        return 'async_select'
      case 'radiogroup':
        return 'radio'
    }
  }
}

_Main.foreignTableTypes = function(FieldMetadata) {
  var relationshipType = _attr.val(FieldMetadata, 'relationshipType')
  var controlType = _attr.val(FieldMetadata, 'controlType')

  switch (relationshipType) {
    default:
    case 'hasOne': {
      switch (controlType) {
        case 'default':
        case 'formView':
          return 'form'
        case 'fileTemplate':
          return 'template'
        default:
          return 'default'
      }
    }
    case 'hasMany': {
      switch (controlType) {
        case 'default':
        case 'gridView':
          return 'grid'
        case 'cardsView':
          return 'cards'
        case 'fileTemplate':
          return 'template'
        case 'formView':
          return 'form'
        default:
          return 'default'
      }
    }
  }
}

_Main.junctionTableTypes = function(FieldMetadata) {
  var relationshipType = _attr.val(FieldMetadata, 'relationshipType')
  var controlType = _attr.val(FieldMetadata, 'controlType')

  switch (relationshipType) {
    default:
    case 'hasMany': {
      switch (controlType) {
        case 'default':
        case 'gridView':
        default:
          return 'junction'
      }
    }
  }
}
