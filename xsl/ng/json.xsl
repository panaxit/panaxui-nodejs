<?xml version="1.0" encoding="UTF-8" ?>
<!-- 
	Panax Transformer to JSON
	For AngularJS flavor
	Author: Benjamin Orozco <benoror@gmail.com> 
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

	<!-- 
		Imports & Includes
	-->
	<xsl:import href="xsl/ng/global_variables.xsl" />
	<xsl:import href="xsl/ng/keys.xsl" />
	<xsl:include href="xsl/ng/model.xsl" />	
	<xsl:include href="xsl/ng/grid.xsl" />
	<xsl:include href="xsl/ng/form.xsl" />

	<!-- 
		Output settings
	-->
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
		<xsl:apply-templates select="*" mode="table" />
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
				"schemaName": "<xsl:value-of select="@Table_Schema"/>",
				"tableName": "<xsl:value-of select="@Table_Name"/>",
				"mode": "<xsl:value-of select="@mode"/>",
				"controlType": "<xsl:value-of select="@controlType"/>",
				<xsl:if test="@primaryKey">
					"primaryKey": "<xsl:value-of select="@primaryKey"/>",
				</xsl:if>
				<xsl:if test="@identityKey">
					"identityKey": "<xsl:value-of select="@identityKey"/>",
				</xsl:if>
				"lang": "<xsl:value-of select="@xml:lang"/>"
			},
			"metadata": {
				<xsl:apply-templates 
					select="@supportsInsert|@supportsUpdate|@supportsDelete|@disableInsert|@disableUpdate|@disableDelete" 
					mode="json.pair"/>
			},

			<!--
					data model
			-->
			<!-- <px:data> model.xsl -->
			"model": [ <xsl:apply-templates select="px:data/*" mode="model" /> ],
			<!--
					ui-grid
			-->
			<xsl:if test="@controlType='gridView'">
				<!-- <px:layout> + <px:fields> grid.xsl -->
				"grid": <xsl:apply-templates select="." mode="grid" />
			</xsl:if>
			<!-- 
				angular-formly 
			-->
			<xsl:if test="@controlType='formView'">
				<!-- <px:layout> + <px:fields> form.xsl -->
				"form": <xsl:apply-templates select="." mode="form" />
			</xsl:if>
		}
	</xsl:template>

</xsl:stylesheet>