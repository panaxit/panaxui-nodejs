<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Grid includes
	-->
	<xsl:include href="pxgrid.column.type.xsl" />

	<!-- 
		Grid (px:layout)
	-->

	<xsl:template match="*" mode="pxgrid">
		{
			"columnDefs": <xsl:apply-templates select="." mode="pxgrid.columnDefs" />
		}
	</xsl:template>

	<xsl:template match="*" mode="pxgrid.columnDefs">
		[
			<xsl:apply-templates select="px:layout//px:field" mode="pxgrid.column" />
		]
	</xsl:template>

	<xsl:template match="px:field" mode="pxgrid.column">
		<xsl:variable name="field" select="key('fields',@fieldId)" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"field": "<xsl:value-of select="$field/@fieldName"/>",
			"displayName": "<xsl:value-of select="$field/@headerText"/>",
			<!-- ToDo: Not necesary to include type?
			...Add this only if the grid guessing is not to your satisfaction...
			http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef#type -->
			"type": "<xsl:apply-templates select="$field" mode="pxgrid.column.type" />"
			<!-- ToDo: http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef -->
		}
	</xsl:template>

</xsl:stylesheet>