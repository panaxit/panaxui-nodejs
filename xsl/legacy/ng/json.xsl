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
	xmlns:custom="http://www.panaxit.com/custom"
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
	<xsl:include href="xsl/ng/pxgrid.xsl" />
	<xsl:include href="xsl/ng/pxform.xsl" />
	<xsl:include href="xsl/ng/pxcards.xsl" />
	<xsl:include href="xsl/ng/px-ag-grid.xsl" />

	<!-- 
		Output settings
	-->
	<xsl:output omit-xml-declaration="yes" method="text" indent="no" />
	<xsl:strip-space elements="*"/>

	<!-- 
		JSON Grammar helpers
	-->
	<xsl:template match="@*" mode="json.pair">
		<xsl:if test="position()&gt;1">,</xsl:if> "<xsl:value-of select="local-name(.)"/>":<xsl:apply-templates select="." mode="json.string"/>
	</xsl:template>

	<xsl:template match="@*" mode="json.string">
		"<xsl:value-of select="."/>"
	</xsl:template>

	<xsl:template match="@*[string(number(.))='NaN']" mode="json.value">
		"<xsl:value-of select="."/>"
	</xsl:template>

	<!-- 
		Root element
	-->
	<xsl:template match="/">
		<xsl:apply-templates select="*[@dataType='table'][1]" mode="entity" />
	</xsl:template>

	<!-- 
		Table
	-->
	<xsl:template match="*" mode="entity">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			<!--
				catalog (entity) metadata
			-->
			<xsl:apply-templates select="." mode="metadata" />,

			<!--
					data model
					<px:data>
			-->
			"model": <xsl:apply-templates select="." mode="model" />,

			<!--
					fields
					<px:fields> + <px:layout>
			-->
			<xsl:choose>
				<!--
						pxgrid.xsl
				-->
				<xsl:when test="@controlType='gridView'">
					"fields": <xsl:apply-templates select="." mode="pxgrid" />
				</xsl:when>
				<!--
						pxcards.xsl
				-->
				<xsl:when test="@controlType='cardsView'">
					"fields": <xsl:apply-templates select="." mode="pxcards" />
				</xsl:when>
				<!-- 
						pxform.xsl 
				-->
				<xsl:when test="@controlType='formView'">
					"fields": <xsl:apply-templates select="." mode="pxform" />
				</xsl:when>
				<!--
						pxgrid.xsl + pxform.xsl
				-->
				<xsl:when test="@controlType='masterDetail'">
					"fields": {
						"grid": <xsl:apply-templates select="." mode="pxgrid" />,
						"form": <xsl:apply-templates select="." mode="pxform" />
					}
				</xsl:when>
			</xsl:choose>
		}
	</xsl:template>

	<!-- 
		Catalog Metadata
	-->
	<xsl:template match="*" mode="metadata">
		"catalog": {
			<!-- Custom attributes -->
			<xsl:if test="@*[namespace-uri()='http://www.panaxit.com/custom']">
				"customAttrs": {
					<xsl:apply-templates select="@*[namespace-uri()='http://www.panaxit.com/custom']" mode="json.pair"/>
				},
			</xsl:if>
			<!-- Catalog Attributes -->
			"dbId": "<xsl:value-of select="@dbId"/>",
			"catalogName": "<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>",
			"schemaName": "<xsl:value-of select="@Table_Schema"/>",
			"tableName": "<xsl:value-of select="@Table_Name"/>",
			"mode": "<xsl:value-of select="@mode"/>",
			"controlType": "<xsl:value-of select="@controlType"/>",
			"lang": "<xsl:value-of select="@xml:lang"/>",
			<xsl:if test="@primaryKey">
				"primaryKey": "<xsl:value-of select="@primaryKey"/>",
			</xsl:if>
			<xsl:if test="@identityKey">
				"identityKey": "<xsl:value-of select="@identityKey"/>",
			</xsl:if>
			<xsl:if test="@foreignReference">
				"foreignReference": "<xsl:value-of select="@foreignReference"/>",
			</xsl:if>
			<!-- Pagination Attributes -->
			<xsl:if test="@totalRecords">
				"totalItems": <xsl:value-of select="@totalRecords"/>,
			</xsl:if>
			<xsl:if test="@pageSize">
				"pageSize": <xsl:value-of select="@pageSize"/>,
			</xsl:if>
			<xsl:if test="@pageIndex">
				"pageIndex": <xsl:value-of select="@pageIndex"/>,
			</xsl:if>
			<!-- Data Access Metadata Attributes -->
			"metadata": {
				<xsl:apply-templates 
					select="@supportsInsert|@supportsUpdate|@supportsDelete|@disableInsert|@disableUpdate|@disableDelete" 
					mode="json.pair"/>
			}
		}
	</xsl:template>

</xsl:stylesheet>