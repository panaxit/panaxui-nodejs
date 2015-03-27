<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Schema Property Pattern
	-->

	<xsl:template match="*" mode="schema.property.pattern">
		<xsl:choose>
			<xsl:when test="@controlType='email'">
				<xsl:text>^\\S+@\\S+$</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>