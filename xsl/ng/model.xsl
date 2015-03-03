<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>
	<!-- 
		Model (px:data)
	-->

	<xsl:template match="*" mode="model">
		[
			<xsl:apply-templates select="px:data/*" mode="model" />
		]
	</xsl:template>

	<xsl:template match="px:dataRow" mode="model">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"rowNumber": "<xsl:value-of select="@rowNumber"/>",
			<xsl:apply-templates select="*" mode="model.pair" />
		}
	</xsl:template>

	<xsl:template match="*" mode="model.pair">
		<xsl:variable name="fieldName" select="key('fields',@fieldId)/@fieldName" />
		<xsl:variable name="dataType" select="key('fields',@fieldId)/@dataType" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		"<xsl:value-of select="$fieldName"/>":
		<xsl:choose>
			<xsl:when test="$dataType='int' or $dataType='float' or $dataType='money'">
				<xsl:value-of select="@value"/>
			</xsl:when>
			<xsl:when test="$dataType='bit'">
				<xsl:if test="@value='1'">true</xsl:if>
				<xsl:if test="@value!='1'">false</xsl:if>
			</xsl:when>
			<xsl:when test="$dataType='date' or $dataType='datetime' or $dataType='time'">
				"<xsl:value-of select="@value"/>"
			</xsl:when>
			<xsl:otherwise>
				"<xsl:value-of select="@value"/>"
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>