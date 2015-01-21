<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">

	<!-- NUMBER -->
	<xsl:template mode="formView.control" match="*[ 
		(@dataType='nchar') and 
		(@controlType='color') ]">
			xtype: 'colorfield',
			name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>',
			emptyText: '<xsl:value-of select="@fieldName"/>',
			bind: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}',
			enforceMaxLength: true
			<!-- EDITABLE/READONLY -->
			<xsl:call-template name="control.readOnly" />
	</xsl:template>

</xsl:stylesheet>