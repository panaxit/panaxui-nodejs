<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>
	<!-- 
		Model (px:data)
	-->

	<xsl:template match="px:data" mode="model">
		[
			<xsl:apply-templates select="*" mode="model"></xsl:apply-templates>
		]
	</xsl:template>

	<xsl:template match="px:dataRow" mode="model">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"rowNumber": "<xsl:value-of select="@rowNumber"/>",
			<xsl:apply-templates select="*" mode="model.dataField"></xsl:apply-templates>
		}
	</xsl:template>

	<xsl:template match="*" mode="model.dataField">
		<xsl:if test="position()&gt;1">,</xsl:if>
		"<xsl:value-of select="@fieldId"/>": "<xsl:value-of select="@value"/>"
		<!-- 
			ToDo: JSON value can be string, or number, boolean, etc. 
			According to @FIELDS
			See json.org 
		-->
	</xsl:template>

</xsl:stylesheet>