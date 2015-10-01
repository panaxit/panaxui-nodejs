<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>
	<!-- 
		Model (px:data)
	-->

	<!--
		Regular Tables
	-->

	<xsl:template match="px:dataRow" mode="model.table">
		<xsl:variable name="primaryKey" select="../../@primaryKey" />
		<xsl:variable name="identityKey" select="../../@identityKey" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			<!-- "rowNumber": "<xsl:value-of select="@rowNumber"/>", -->
			<xsl:if test="@primaryValue">
				"<xsl:value-of select="$primaryKey"/>": "<xsl:value-of select="@primaryValue"/>",
			</xsl:if>
			<xsl:if test="@identity">
				"<xsl:value-of select="$identityKey"/>": "<xsl:value-of select="@identity"/>",
			</xsl:if>
			<xsl:apply-templates select="*" mode="model.table.pair" />
		}
	</xsl:template>

	<xsl:template match="*" mode="model.table.pair">
		<xsl:variable name="dataType" select="key('fields',@fieldId)/@dataType" />
		<xsl:variable name="controlType" select="key('fields',@fieldId)/@controlType" />
		<xsl:variable name="relationshipType" select="key('fields',@fieldId)/@relationshipType" />
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
					"<xsl:value-of select="@value"/>"
				</xsl:if>
			</xsl:when>
			<xsl:when test="$dataType='foreignTable'">
				<xsl:if test="$relationshipType='hasOne'">
					<xsl:apply-templates select="*[1]/px:data/px:dataRow" mode="model.table" />
				</xsl:if>
				<xsl:if test="$relationshipType='hasMany'">
					[<xsl:apply-templates select="*[1]/px:data/px:dataRow" mode="model.table" />]
				</xsl:if>
			</xsl:when>
			<xsl:when test="$dataType='junctionTable'">
				<xsl:if test="$relationshipType='hasMany'">
					[<xsl:apply-templates select="*[1]/px:data/px:dataRow" mode="model.junction" />]
				</xsl:if>
			</xsl:when>
			<!-- strings -->
			<xsl:otherwise>
				"<xsl:value-of select="@value"/>"
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!--
		Junction Tables
	-->

	<xsl:template match="px:dataRow" mode="model.junction">
		<xsl:variable name="primaryKey" select="../../@primaryKey" />
		<xsl:variable name="identityKey" select="../../@identityKey" />
		<xsl:variable name="foreignReference" select="../../@foreignReference" />
		<xsl:variable name="foreignPrimaryValue" select="../../../../@primaryValue" />
		<xsl:variable name="foreignIdentity" select="../../../../@identity" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			<!-- "rowNumber": "<xsl:value-of select="@rowNumber"/>", -->
			<xsl:if test="@primaryValue">
				"<xsl:value-of select="$primaryKey"/>": "<xsl:value-of select="@primaryValue"/>",
			</xsl:if>
			<xsl:if test="@identity">
				"<xsl:value-of select="$identityKey"/>": "<xsl:value-of select="@identity"/>",
			</xsl:if>
			<xsl:if test="$foreignReference and ($foreignIdentity or $foreignPrimaryValue)">
				"<xsl:value-of select="$foreignReference"/>": "<xsl:value-of select="$foreignIdentity"/>",
				"<xsl:value-of select="$foreignReference"/>": "<xsl:value-of select="$foreignPrimaryValue"/>",
			</xsl:if>
			<xsl:apply-templates select="*" mode="model.junction.pair" />
		}
	</xsl:template>

	<xsl:template match="*" mode="model.junction.pair">
		<xsl:variable name="dataType" select="key('fields',@fieldId)/@dataType" />
		<xsl:variable name="controlType" select="key('fields',@fieldId)/@controlType" />
		<xsl:variable name="relationshipType" select="key('fields',@fieldId)/@relationshipType" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		"<xsl:value-of select="name()"/>":
		<xsl:choose>
			<xsl:when test="$dataType='foreignKey'">
				<xsl:if test="$relationshipType='belongsTo' and $controlType='default'">
					{
						"value": "<xsl:value-of select="@value"/>",
						"text": "<xsl:value-of select="@text"/>"
					}
				</xsl:if>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>