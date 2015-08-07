<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Grid includes
	-->
	<xsl:include href="grid.column.type.xsl" />

	<!-- 
		Grid (px:layout)
	-->

	<xsl:template match="*" mode="grid">
		{
			<xsl:if test="@totalRecords">
				"totalItems": <xsl:value-of select="@totalRecords"/>,
			</xsl:if>
			"columnDefs": <xsl:apply-templates select="." mode="grid.columnDefs" />
		}
	</xsl:template>

	<xsl:template match="*" mode="grid.columnDefs">
		[
			<xsl:apply-templates select="px:layout//px:field" mode="grid.column" />
		]
	</xsl:template>

	<xsl:template match="px:field" mode="grid.column">
		<xsl:variable name="field" select="key('fields',@fieldId)" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"field": "<xsl:value-of select="$field/@fieldName"/>",
			"displayName": "<xsl:value-of select="$field/@headerText"/>",
			<!-- ToDo: Not necesary to include type?
			...Add this only if the grid guessing is not to your satisfaction...
			http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef#type -->
			"type": "<xsl:apply-templates select="$field" mode="grid.column.type" />"
			<!-- ToDo: http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef -->
		}
	</xsl:template>

</xsl:stylesheet>