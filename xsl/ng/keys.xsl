<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Keys: px:fields 
	-->
	<xsl:key name="fields" match="px:fields//*[@fieldId][not(namespace-uri(.)='urn:panax')]" use="@fieldId" />
	<xsl:key name="fields" match="px:fields/*" use="@fieldId" />

	<!-- 
		Keys: px:data 
	-->
	<xsl:key name="data" match="px:data/px:dataRow//*" use="@fieldId" />

</xsl:stylesheet>