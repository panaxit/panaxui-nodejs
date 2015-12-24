<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Grid Column Types
		http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef
	-->

	<!-- object -->
	<xsl:template mode="pxgrid.column.type" match="*[ 
		(@controlType='default')
		]">
		<xsl:text>object</xsl:text>
	</xsl:template>

	<!-- string  -->
	<xsl:template mode="pxgrid.column.type" match="*[ 
		(@controlType='default' or @controlType='email') and 
		(@dataType='varchar' or @dataType='nvarchar' or @dataType='nchar' or @dataType='char' or 
		@dataType='text')
		]">
		<xsl:text>string</xsl:text>
	</xsl:template>

	<!-- number -->
	<xsl:template mode="pxgrid.column.type" match="*[ 
		(@controlType='default') and
		(@dataType='int' or @dataType='tinyint' or @dataType='money' or @dataType='float') 
		]">
		<xsl:text>number</xsl:text>
	</xsl:template>

	<!-- boolean -->
	<xsl:template mode="pxgrid.column.type" match="*[ 
		(@controlType='default') and
		(@dataType='bit') 
		]">
		<xsl:text>boolean</xsl:text>
	</xsl:template>

	<!-- date -->
	<xsl:template mode="pxgrid.column.type" match="*[ 
		(@controlType='default') and
		(@dataType='date') 
		]">
		<xsl:text>date</xsl:text>
	</xsl:template>

	<!-- 
		ToDo: numberStr
	 -->

</xsl:stylesheet>