<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Schema Property Formats
	-->

	<xsl:template match="*" mode="schema.property.format">
		<xsl:choose>
			<xsl:when test="@dataType='date' or @dataType='datetime' or @dataType='time'">
				<xsl:text>date</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='px:color'">
				<xsl:text>color</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>