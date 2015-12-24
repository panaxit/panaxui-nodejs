<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Includes
	-->
	<!-- <xsl:include href="px-ag-grid.column.type.xsl" /> -->

	<!-- 
		Fields (columnDefs) (px:fields + px:layout)
	-->

	<xsl:template match="*" mode="px-ag-grid">
		[
			<xsl:apply-templates select="px:layout//px:field" mode="px-ag-grid.column" />
		]
	</xsl:template>

	<xsl:template match="px:field" mode="px-ag-grid.column">
		<xsl:variable name="field" select="key('fields',@fieldId)" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"field": "<xsl:value-of select="$field/@fieldName"/>",
			"headerName": "<xsl:value-of select="$field/@headerText"/>"
		}
	</xsl:template>

</xsl:stylesheet>