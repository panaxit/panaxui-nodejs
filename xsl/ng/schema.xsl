<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Schema includes
	-->
	<xsl:include href="schema.property.type.xsl" />
	<xsl:include href="schema.property.format.xsl" />
	<xsl:include href="schema.property.pattern.xsl" />

	<!-- 
		Schema (px:fields)
	-->

	<xsl:template match="*" mode="schema">
		{
			<xsl:apply-templates select="px:fields" mode="schema" />
		}
	</xsl:template>

	<xsl:template match="px:fields" mode="schema">
		"type": "object",
		"title": "<xsl:value-of select="parent::*/@Table_Name"/>",
		"properties": {
			<xsl:apply-templates select="*" mode="schema.property" />
		}
	</xsl:template>

	<xsl:template match="*" mode="schema.property">
		<xsl:if test="position()&gt;1">,</xsl:if>
		"<xsl:value-of select="@fieldName"/>": {
			"title": "<xsl:value-of select="@headerText"/>",
			"type": "<xsl:apply-templates select="." mode="schema.property.type" />",
			"format": "<xsl:apply-templates select="." mode="schema.property.format" />",
			"pattern": "<xsl:apply-templates select="." mode="schema.property.pattern" />"
			<!-- "description": "<xsl:value-of select="@headerText"/>" -->
			<!-- @length -->
			<!-- @isNullable -->
			<!-- "minLength" -->
			<!-- "enum" -->
			<!-- "readonly" -->
		}
	</xsl:template>

</xsl:stylesheet>