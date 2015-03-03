<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Include: Form field types 
	-->
	<xsl:include href="form.field.type.xsl" />	

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
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"key": "<xsl:value-of select="@fieldName"/>",
			<!-- "condition": "false"  <! - -  // ToDo: Show hide based on @isPrimaryKey Or other args in @FIELDS -->
			<!-- ToDo: "type": @controlType!='default' @dataType @FIELDS! -->
			"type": "<xsl:apply-templates select="key('fields',@fieldId)" mode="form.field.type" />"
		}
	</xsl:template>

</xsl:stylesheet>