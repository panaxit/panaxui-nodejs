<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Schema Property Types
	-->

	<xsl:template match="*" mode="schema.property.type">
		<xsl:choose>
			<xsl:when test="@dataType='nvarchar' or @dataType='nchar'">
				<xsl:text>string</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='text'">
				<xsl:text>string</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='int'">
				<xsl:text>integer</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='float' or @dataType='money'">
				<xsl:text>number</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='bit'">
				<xsl:text>boolean</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='date' or @dataType='datetime' or @dataType='time'">
				<xsl:text>string</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>string</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>