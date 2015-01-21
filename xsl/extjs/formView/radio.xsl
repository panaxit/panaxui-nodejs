<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">

	<xsl:template match="*[@controlType='radiogroup' and @dataType='foreignKey']" mode="formView.control">
		xtype: 'radiogroup'
		, columns: 1
		, vertical: true
		, layout: 'anchor'
		, bind: {
			value: '{<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>}'
		}
		, defaults: {
			name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>'
		}
		, items: [<xsl:apply-templates select="px:data/*" mode="selector.option"/>]
		<!-- EDITABLE/READONLY -->
		<xsl:call-template name="control.readOnly" />
	</xsl:template>

	<xsl:template match="*[@controlType='radiogroup']/px:data/*[@value]" mode="selector.option" priority="-1">
		<xsl:if test="position()&gt;1">,</xsl:if>
		<xsl:apply-templates mode="radioGroup.option" select="."/>
	</xsl:template>

	<xsl:template match="*[@controlType]/px:data/*[not(@value)]" mode="radioGroup.option" priority="-1">
		/*radioGroup.option no está definido*/
	</xsl:template>

	<xsl:template match="*[@controlType]/px:data/*" mode="radioGroup.option" priority="-1">
		{ 
			boxLabel: '<xsl:value-of select="@text"/>'
			, inputValue: '<xsl:value-of select="@value"/>' 
		}
	</xsl:template>

</xsl:stylesheet>


