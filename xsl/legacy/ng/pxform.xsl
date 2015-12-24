<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Form includes
	-->
	<xsl:include href="pxform.fields.xsl" />

	<!-- 
		Form (px:layout)
	-->

	<xsl:template match="*" mode="pxform">
		[
			<xsl:if test="px:layout/px:tabPanel">
				<xsl:apply-templates select="px:layout/px:tabPanel" mode="pxform" />,
			</xsl:if>
			<xsl:apply-templates select="px:layout" mode="fieldset" />
		]
	</xsl:template>

	<!-- 
		Fieldset
	-->
	<xsl:template match="*" mode="fieldset">
		{
			"type": "fieldset",
			<xsl:apply-templates select="." mode="fields" />
		}
	</xsl:template>

	<!-- ToDo: -->
	<!-- 
		@fieldContainer (fieldGroup)
		.orentation = horizontal 
	-->

	<!-- 
		TabPanels -> Tabs 
	-->

	<xsl:template match="px:tabPanel" mode="pxform">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"type": "tabPanel",
			"tabs": [
				<xsl:apply-templates select="px:tab" mode="pxform" />
			]
		}
	</xsl:template>

	<xsl:template match="px:tab" mode="pxform">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"type": "tab",
			"title": "<xsl:value-of select="@name"/>",
			<xsl:apply-templates select="." mode="fields" />
		}
	</xsl:template>

</xsl:stylesheet>