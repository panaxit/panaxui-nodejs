<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Fields Options
	-->

 	<xsl:template mode="fields.options" match="*">
		<xsl:param name="data" />
 		<xsl:choose>
 			<!-- radio -->
 			<xsl:when test="ancestor-or-self::*[
 					@dataType='foreignKey' and
 					(@controlType='radiogroup')]">
 				<xsl:apply-templates select="." mode="fields.options.radio"/>
 			</xsl:when>
 			<!-- async_select -->
 			<xsl:when test="self::*[
 					@dataType='foreignKey' and
 					(@controlType='default' or @controlType='combobox')]">
 				<xsl:apply-templates select="*[1]" mode="fields.options.async_select">
	 				<xsl:with-param name="data" select="$data" />
	 			</xsl:apply-templates>
 			</xsl:when>
 			<!-- cascaded -->
 			<xsl:when test="ancestor::*[
 					@dataType='foreignKey' and
 					(@controlType='default' or @controlType='combobox')]">
 				<xsl:apply-templates select="." mode="fields.options.async_select">
	 				<xsl:with-param name="data" select="$data" />
	 			</xsl:apply-templates>
 			</xsl:when>
 		</xsl:choose>
 	</xsl:template>

	<!--
		radio
	 -->	
 	<xsl:template match="*" mode="fields.options.radio">
		"options": [
			<xsl:apply-templates select="px:data/*[@value and @text]" mode="fields.options.radio" />
		]
	</xsl:template>

	<xsl:template match="*[@value and @text]" mode="fields.options.radio">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"value": "<xsl:value-of select="@value"/>",
			"name": "<xsl:value-of select="@text"/>"
		}
	</xsl:template>

	<!--
		async_select
		+ 
		cascaded
	 -->	
	 <!-- 
	 	ToDo: REFACTOR: 
	 	Remove use of $data here 
	 	and in fields.xsl 
	 	from keys.xsl 
	 -->
 	<xsl:template match="*" mode="fields.options.async_select">
		<xsl:param name="data" />
		"options": [],
		"params": {
			"catalogName": "<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>",
			"valueColumn": "<xsl:value-of select="@dataValue"/>",
			"textColumn": "<xsl:value-of select="@dataText"/>",
			<xsl:if test="@foreignKey!='' and *[1]">
				"foreignEntity": "<xsl:value-of select="name(*[1])"/>",
				"foreignKey": "<xsl:value-of select="@foreignKey"/>",
				"foreignValue": "<xsl:value-of select="$data/@foreignValue"/>",
				<!-- "filters": "[<xsl:value-of select="$data/@foreignKey"/>='<xsl:value-of select="$data/@foreignValue"/>']", -->
			</xsl:if>
			"dependantEntity": "<xsl:value-of select="name(parent::*[1])"/>"
		}
	</xsl:template>

</xsl:stylesheet>