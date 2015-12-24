<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
>
<xsl:output method="text" omit-xml-declaration="yes"/>

	<xsl:template match="/">
	[
		<xsl:if test="(string(/options/@allowNulls)='true' or string(/options/@value)='') and string(/options/@searchText)=''">
			<xsl:text>{ "value":null , "label":"- -" }</xsl:text>
		</xsl:if>
		<!-- <xsl:if test="options/@enableInsert=1">
			{ text: '[Actualizar...]', id: Panax.REFRESH },
			{ text: '[Otro...]', id: Panax.NEW }
		</xsl:if> -->
		<xsl:apply-templates select="options/option" mode="options" />
	]
	</xsl:template>

	<xsl:template match="*" mode="options">
		,{
			"label": "<xsl:value-of select="@text" />", 
			"value": "<xsl:value-of select="@value" />"
		}
	</xsl:template>

</xsl:stylesheet>