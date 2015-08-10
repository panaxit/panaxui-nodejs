<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Cards
	-->

	<xsl:template match="*" mode="cards">
		{
			<xsl:if test="@totalRecords">
				"totalItems": <xsl:value-of select="@totalRecords"/>
			</xsl:if>
		}
	</xsl:template>

</xsl:stylesheet>