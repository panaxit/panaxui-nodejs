<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Form Field Options
	-->

	<xsl:template match="*[@dataType='foreignKey']" mode="form.field.options">
		<xsl:variable name="child" select="*[1]" />
		"http_get": {
			"url": "/api/options",
			"parameter": {
				"params": {
					"gui": "ng",
					"array": true,
					"catalogName": "<xsl:value-of select="$child/@Table_Schema"/>.<xsl:value-of select="$child/@Table_Name"/>",
					"valueColumn": "<xsl:value-of select="$child/@dataValue"/>",
					"textColumn": "<xsl:value-of select="$child/@dataText"/>"
				}
			}
		}
	</xsl:template>

</xsl:stylesheet>