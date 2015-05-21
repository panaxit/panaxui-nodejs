<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>
	<!-- 
		Model (px:data)
	-->

	<xsl:template match="*" mode="model">
		[
			<xsl:apply-templates select="px:data/*" mode="model">
				<xsl:with-param name="primaryKey">
					<xsl:value-of select="px:fields/*[@isPrimaryKey='1'][1]/@fieldName"/>
				</xsl:with-param>
				<xsl:with-param name="identityKey">
					<xsl:value-of select="px:fields/*[@isIdentity='1'][1]/@fieldName"/>
				</xsl:with-param>
			</xsl:apply-templates>
		]
	</xsl:template>

	<xsl:template match="px:dataRow" mode="model">
		<xsl:param name="primaryKey" />
		<xsl:param name="identityKey" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			<!-- "rowNumber": "<xsl:value-of select="@rowNumber"/>", -->
			<xsl:if test="@primaryValue">
				"<xsl:value-of select="$primaryKey"/>": "<xsl:value-of select="@primaryValue"/>",
			</xsl:if>
			<xsl:if test="@identity">
				"<xsl:value-of select="$identityKey"/>": "<xsl:value-of select="@identity"/>",
			</xsl:if>
			<xsl:apply-templates select="*" mode="model.pair" />
		}
	</xsl:template>

	<xsl:template match="*" mode="model.pair">
		<xsl:variable name="dataType" select="key('fields',@fieldId)/@dataType" />
		<xsl:variable name="controlType" select="key('fields',@fieldId)/@controlType" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		"<xsl:value-of select="name()"/>":
		<xsl:choose>
			<xsl:when test="$dataType='int' or $dataType='float' or $dataType='money'">
				<xsl:if test="@value=''">null</xsl:if>
				<xsl:if test="@value!=''"><xsl:value-of select="@value"/></xsl:if>
			</xsl:when>
			<xsl:when test="$dataType='bit'">
				<xsl:if test="@value='1'">true</xsl:if>
				<xsl:if test="@value!='1'">false</xsl:if>
			</xsl:when>
			<xsl:when test="$dataType='date' or $dataType='datetime' or $dataType='time'">
				"<xsl:value-of select="@value"/>"
			</xsl:when>
			<xsl:when test="$dataType='foreignKey'">
				<xsl:if test="$controlType='radiogroup'">
					"<xsl:value-of select="@value"/>"
				</xsl:if>
				<xsl:if test="$controlType='default' or $controlType='combobox'">
					<!--{
						"value": -->"<xsl:value-of select="@value"/>"
						<!--"label": "<xsl:value-of select="@text"/>"-->
					<!--}-->
				</xsl:if>
			</xsl:when>
			<!-- strings -->
			<xsl:otherwise>
				"<xsl:value-of select="@value"/>"
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>