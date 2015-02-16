<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">

	<xsl:template match="*[@controlType='file' and @dataType='nvarchar']" mode="formView.control">
    	xtype: 'filemanager'
    	<!-- xtype: 'filefield' -->
		, fieldLabel: '<xsl:value-of select="@fieldName"/>'
		, name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>'
		, bind: {
			value: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
		}
		<!-- EDITABLE/READONLY -->
		<xsl:call-template name="control.readOnly" />
	</xsl:template>

	<xsl:template match="*[@controlType='picture' and @dataType='nvarchar']" mode="formView.control">
    	xtype: 'imagemanager'
		, fieldLabel: '<xsl:value-of select="@fieldName"/>'
		, name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>'
		, value: null
		, defaultValue: '<xsl:value-of select="@text"/>'
		, enforceMaxLength: true
    	, parentFolder: "Test"
		, bind: {
			value: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
		}
		<!-- EDITABLE/READONLY -->
		<xsl:call-template name="control.readOnly" />
	</xsl:template>

</xsl:stylesheet>
