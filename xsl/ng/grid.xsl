<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Grid (px:layout)
	-->

	<xsl:template match="*" mode="grid">
		[
			<xsl:apply-templates select="px:layout//px:field" mode="grid.column" />
		]
	</xsl:template>

	<xsl:template match="px:field" mode="grid.column">
		<xsl:variable name="field" select="key('fields',@fieldId)" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"field": "<xsl:value-of select="$field/@fieldName"/>",
			"displayName": "<xsl:value-of select="$field/@headerText"/>"
			<!-- ToDo: http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef -->
		}
	</xsl:template>

</xsl:stylesheet>