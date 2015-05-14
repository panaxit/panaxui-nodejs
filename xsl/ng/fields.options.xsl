<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Fields Options
	-->

	<!--
		radio
	 -->	
 	<xsl:template mode="fields.options" match="*[(@controlType='radiogroup')]">
		"options": [
			<xsl:apply-templates select="px:data/*[@value and @text]" mode="fields.options.radio" />
		]
	</xsl:template>

	<xsl:template match="*" mode="fields.options.radio">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"value": "<xsl:value-of select="@value"/>",
			"name": "<xsl:value-of select="@text"/>"
		}
	</xsl:template>

	<!--
		async_select
	 -->	
 	<xsl:template mode="fields.options" match="*[(@controlType='default' or @controlType='combobox')]">
		<xsl:variable name="child" select="*[1]" />
		"options": [],
		"params": {
			"catalogName": "<xsl:value-of select="$child/@Table_Schema"/>.<xsl:value-of select="$child/@Table_Name"/>",
			"valueColumn": "<xsl:value-of select="$child/@dataValue"/>",
			"textColumn": "<xsl:value-of select="$child/@dataText"/>"
		}
	</xsl:template>

</xsl:stylesheet>