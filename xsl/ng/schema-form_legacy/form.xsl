<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Form field includes
	-->
	<xsl:include href="form.field.type.xsl" />
	<xsl:include href="form.field.titleMap.xsl" />
	<xsl:include href="form.field.options.xsl" />
	<xsl:include href="form.field.colorFormat.xsl" />

	<!-- 
		Form (px:layout)
	-->

	<xsl:template match="*" mode="form">
		[
			<xsl:apply-templates select="px:layout/*" mode="form" />
		]
	</xsl:template>

	<xsl:template match="px:tabPanel" mode="form">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"type": "tabs",
			"tabs": [
				<xsl:apply-templates select="px:tab" mode="form" />
			]
		}
	</xsl:template>

	<xsl:template match="px:tab" mode="form">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"title": "<xsl:value-of select="@name"/>",
			"items": [
				<xsl:apply-templates select="*" mode="form" />
			]
		}
	</xsl:template>

	<xsl:template match="px:field" mode="form">
		<xsl:variable name="field" select="key('fields',@fieldId)" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"key": "<xsl:value-of select="$field/@fieldName"/>",
			<xsl:if	test="$field/@isIdentity='1'">
				"condition": "false",
			</xsl:if>
			<!-- ToDo: "type": @controlType!='default' @dataType @FIELDS! -->
			"type": "<xsl:apply-templates select="$field" mode="form.field.type" />",
			"placeholder": " ",
			"titleMap": [
				<xsl:apply-templates select="$field" mode="form.field.titleMap" />
			],
			<xsl:apply-templates select="$field" mode="form.field.colorFormat" />
			"options": {
				<xsl:apply-templates select="$field" mode="form.field.options" />
			}
		}
	</xsl:template>

</xsl:stylesheet>