<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>

	<xsl:template match="*" mode="gridView.column.renderer">
		//var assoc = metaData.record.<xsl:apply-templates select="." mode="bindName"/>;
		//return assoc.data.text;
		return Ext.isObject(value)?value[this.displayField]:value;
	</xsl:template>

	<xsl:template match="*[@dataType='junctionTable' or @dataType='foreignTable']/*/px:fields/*" mode="gridView.foreignTable.tr.items">'+function(){var field=obj.<xsl:value-of select="@fieldName"/>; field=Ext.isObject(field)?(Ext.isObject(field.value)?field.value.text:field.value):field;return  Ext.isDate(field)? Ext.util.Format.date(field):field; }()+' - </xsl:template>

	<xsl:template match="*[@dataType='junctionTable' or @dataType='foreignTable']" mode="gridView.column.renderer"><xsl:text disable-output-escaping="yes"><![CDATA[ 
			var html=''
			Ext.Array.each(value, function(obj, index, thisArray) {
				html += '<li>]]></xsl:text><xsl:apply-templates select="*/px:fields/*[key('visibleFields',@fieldId)]" mode="gridView.foreignTable.tr.items"/><xsl:text disable-output-escaping="yes"><![CDATA[ </li>'
			 });
			if (html) html='<ol>'+html+'</ol>'
			return html;
	]]></xsl:text></xsl:template>

	<xsl:template match="*[@dataType='time']" mode="gridView.column.renderer">
		return (Ext.isObject(value)? value["text"]:
				value?Panax.util.lPad(value.split(':')[0], 2, '0')+':'+Panax.util.lPad(value.split(':')[1], 2, '0')+' Hrs.':
				''
				);
	</xsl:template>

	<xsl:template match="*[@dataType='bit']" mode="gridView.column.renderer">
		return (value==true? 'Si' : '');
	</xsl:template>

	<xsl:template match="*[@dataType='date']" mode="gridView.column.renderer">
		return Ext.util.Format.dateRenderer('d/m/Y')(value);
	</xsl:template>

	<xsl:template match="*[@dataType='datetime' or @dataType='smalldatetime']" mode="gridView.column.renderer">
		return Ext.util.Format.dateRenderer('d/m/Y - H:m:s')(value);
	</xsl:template>

	<xsl:template match="*[@dataType='foreignKey']" mode="gridView.column.renderer">
		value=Ext.isArray(value)?value[0]:value;
		return Ext.isObject(value)?value["text"]:value;
	</xsl:template>

	<xsl:template match="*[@dataType='float' or @dataType='money' or @dataType='smallmoney' or (@dataType='float' or @dataType='decimal') and (@format='Money' or @format='money')]" mode="gridView.column.renderer">
		return value!=null? Ext.util.Format.usMoney(value):null;
	</xsl:template>

	<xsl:template match="*[@controlType='image']" mode="gridView.column.renderer">
	    return Ext.DomHelper.markup({
	        tag : "img",
	        src: "../../../../"+value,<!-- + (value == 4 ? 'tick' : 'cross') + '.png'-->
			width: 100
	    });
	</xsl:template>
	
	<xsl:template match="*[@allowNegatives='true'][@controlType='numericField' or @controlType='default' and (@dataType='int' or @dataType='tinyint' or (@dataType='float' or @dataType='decimal') and not(@format) or @dataType='real')]" mode="gridView.column.renderer">
		<xsl:text disable-output-escaping="yes"><![CDATA[ 
			if (value > 0) {
				return '<span style="color:green;">' + value + '</span>';
			} else if (value < 0) {
				return '<span style="color:red;">' + value + '</span>';
			}
			return value;
		]]></xsl:text>
	</xsl:template>

	<xsl:template match="*[@controlType='rangeSelector' or @controlType='RangeSelector']" mode="gridView.column.renderer"><xsl:text disable-output-escaping="yes"><![CDATA[ 
			return Array(Math.ceil(rating) + 1).join('&#x272D;');
	]]></xsl:text></xsl:template>

</xsl:stylesheet>