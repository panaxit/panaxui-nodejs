<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Form Field Color Format
	-->

	<xsl:template match="*[@controlType='color']" mode="form.field.colorFormat">
		"colorFormat": "hex",
		"spectrumOptions": {
			"preferredFormat": "hex"
		},
	</xsl:template>

</xsl:stylesheet>