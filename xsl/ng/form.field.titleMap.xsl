<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Form Field TitleMap
	-->

	<xsl:template match="*[@dataType='foreignKey']" mode="form.field.titleMap">
		<xsl:apply-templates select="px:data/*[@value and @text]" mode="form.field.titleMap.data" />
	</xsl:template>

	<xsl:template match="*" mode="form.field.titleMap.data">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"value": "<xsl:value-of select="@value"/>",
			"name": "<xsl:value-of select="@text"/>"
		}
	</xsl:template>

</xsl:stylesheet>