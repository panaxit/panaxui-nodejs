<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
{
	"collection": [
		<xsl:apply-templates select="*" mode="cd" />
	]
}
</xsl:template>

<xsl:template match="cd" mode="cd">
	<xsl:if test="position()&gt;1">,</xsl:if> { "title": "<xsl:value-of select="title" />", "artist": "<xsl:value-of select="artist" />" }
</xsl:template>

</xsl:stylesheet>