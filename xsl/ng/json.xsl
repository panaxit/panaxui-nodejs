<?xml version="1.0" encoding="UTF-8" ?>
<!-- 
	Panax Transformer to JSON Schema
	For AngularJS flavor (angular-schema-form)
	Author: Benjamin Orozco <benoror@gmail.com> 
	JSON Grammar: http://json.org/
	JSON Schema: http://json-schema.org/
-->
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
	xmlns:session="urn:session"
	xmlns:custom="urn:custom"
	xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px"
	>
	<xsl:import href="xsl/ng/global_variables.xsl" />
	<xsl:output omit-xml-declaration="yes" method="text" indent="no" />
	<xsl:strip-space elements="*"/>

	<!-- 
		JSON Grammar helpers
	-->

	<xsl:template match="@*" mode="json.pair">
		<xsl:if test="position()&gt;1">,</xsl:if> "<xsl:value-of disable-output-escaping="yes" select="local-name(.)"/>":<xsl:apply-templates select="." mode="json.string"/>
	</xsl:template>

	<xsl:template match="@*" mode="json.string">
		"<xsl:value-of select="." disable-output-escaping="no"/>"
	</xsl:template>

	<xsl:template match="@*[string(number(.))='NaN']" mode="json.value">
		"<xsl:value-of select="." disable-output-escaping="no"/>"
	</xsl:template>

	<!-- 
		Root element
	-->

	<xsl:template match="/">
		<xsl:apply-templates select="*" mode="table"></xsl:apply-templates>
	</xsl:template>

	<!-- 
		Table
	-->

	<xsl:template match="*[@dataType='table']" mode="table">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"total": "<xsl:value-of select="@totalRecords"/>",
			"catalog": {
				"dbId": "<xsl:value-of select="@dbId"/>",
				"catalogName": "<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>",
				"mode": "<xsl:value-of select="@mode"/>",
				"controlType": "<xsl:value-of select="@controlType"/>",
				"lang": "<xsl:value-of select="@xml:lang"/>"
			},
			"metadata": {
				<xsl:apply-templates 
					select="@supportsInsert|@supportsUpdate|@supportsDelete|@disableInsert|@disableUpdate|@disableDelete" 
					mode="json.pair"/>
			},
			"schema": <xsl:apply-templates select="*" mode="schema"></xsl:apply-templates>,
			"form": <xsl:apply-templates select="*" mode="form"></xsl:apply-templates>,
			"model": <xsl:apply-templates select="*" mode="model"></xsl:apply-templates>
		}
	</xsl:template>

	<!-- 
		Schema (px:fields)
	-->

	<xsl:template match="px:fields" mode="schema">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"type": "object",
			"title": "<xsl:value-of select="parent::*/@Table_Name"/>",
			"properties": {
				<xsl:apply-templates select="*" mode="schema.property"></xsl:apply-templates>
			}
		}
	</xsl:template>

	<xsl:template match="*" mode="schema.property">
		<xsl:if test="position()&gt;1">,</xsl:if>
		"<xsl:value-of select="@fieldId"/>": {
			"type": "<xsl:apply-templates select="." mode="schema.property.type"></xsl:apply-templates>",
			"title": "<xsl:value-of select="@headerText"/>"
			<!-- "description": "<xsl:value-of select="@headerText"/>" -->
			<!-- @length -->
			<!-- @isNullable -->
			<!-- "minLength" -->
			<!-- "enum" -->
			<!-- "readonly" -->
		}
	</xsl:template>

	<xsl:template match="*" mode="schema.property.type">
		<xsl:choose>
			<xsl:when test="@dataType='nvarchar' or @dataType='nchar'">
				<xsl:text>string</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='text'">
				<xsl:text>string</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='int'">
				<xsl:text>integer</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='float' or @dataType='money'">
				<xsl:text>number</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='bit'">
				<xsl:text>boolean</xsl:text>
			</xsl:when>
			<xsl:when test="@dataType='date' or @dataType='datetime' or @dataType='time'">
				<xsl:text>string</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>string</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- 
		Form (px:layout)
	-->

	<xsl:template match="px:layout" mode="form">
		[
			<xsl:apply-templates select="*" mode="form"></xsl:apply-templates>
		]
	</xsl:template>

	<xsl:template match="px:tabPanel" mode="form">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"type": "tabs",
			"tabs": [
				<xsl:apply-templates select="px:tab" mode="form"></xsl:apply-templates>
			]
		}
	</xsl:template>

	<xsl:template match="px:tab" mode="form">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"title": "<xsl:value-of select="@name"/>",
			"items": [
				<xsl:apply-templates select="*" mode="form"></xsl:apply-templates>
			]
		}
	</xsl:template>

	<xsl:template match="px:field" mode="form">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"key": "<xsl:value-of select="@fieldId"/>"
			<!-- "condition": "false"  <! - -  // ToDo: Show hide based on @isPrimaryKey Or other args in @FIELDS -->
			<!-- ToDo: "type": @controlType!='default' @dataType @FIELDS! -->
		}
	</xsl:template>

	<!-- 
		Model (px:data)
	-->

	<xsl:template match="px:data" mode="model">
		[
			<xsl:apply-templates select="*" mode="model"></xsl:apply-templates>
		]
	</xsl:template>

	<xsl:template match="px:dataRow" mode="model">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"rowNumber": "<xsl:value-of select="@rowNumber"/>",
			<xsl:apply-templates select="*" mode="model.dataField"></xsl:apply-templates>
		}
	</xsl:template>

	<xsl:template match="*" mode="model.dataField">
		<xsl:if test="position()&gt;1">,</xsl:if>
		"<xsl:value-of select="@fieldId"/>": "<xsl:value-of select="@value"/>"
		<!-- 
			ToDo: JSON value can be string, or number, boolean, etc. 
			According to @FIELDS
			See json.org 
		-->
	</xsl:template>

</xsl:stylesheet>