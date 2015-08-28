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
		<xsl:call-template name="forms_loop" />
	</xsl:template>

	<xsl:template name="forms_loop">
		<xsl:param name="index" select="1" />
		<xsl:param name="total" select="count(px:data/*)" />

		<xsl:if test="$index&gt;1">,</xsl:if>
		<xsl:apply-templates select="." mode="form" />

    <xsl:if test="not($index = $total)">
        <xsl:call-template name="forms_loop">
            <xsl:with-param name="index" select="$index + 1" />
        </xsl:call-template>
    </xsl:if>
	</xsl:template>

	<xsl:template match="*" mode="form">
		[
			<xsl:if test="px:layout/px:tabPanel">
				<xsl:apply-templates select="px:layout/px:tabPanel" mode="form" />,
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

	<xsl:template match="px:tabPanel" mode="form">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"type": "tabPanel",
			"tabs": [
				<xsl:apply-templates select="px:tab" mode="form" />
			]
		}
	</xsl:template>

	<xsl:template match="px:tab" mode="form">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"type": "tab",
			"title": "<xsl:value-of select="@name"/>",
			<xsl:apply-templates select="." mode="fields" />
		}
	</xsl:template>

</xsl:stylesheet>