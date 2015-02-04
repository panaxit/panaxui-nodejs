<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	xmlns:sitemap="http://www.panaxit.com/sitemap"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	>
	<xsl:output method="text" omit-xml-declaration="yes"/> 
	<xsl:strip-space elements="*"/>
	
	<xsl:template match="/sitemap:root">
		[
		<xsl:apply-templates select="sitemap:*" />
		]
	</xsl:template>
	
	<xsl:template match="@*" mode="mapSite">, "<xsl:value-of select="name(.)"/>":<xsl:value-of select="."/></xsl:template>
	
	<xsl:template match="@*" mode="mapSite.string">, "<xsl:value-of select="name(.)"/>":"<xsl:value-of select="."/>"</xsl:template>
	
	<xsl:template match="sitemap:*">
		<xsl:if test="position()&gt;1">,</xsl:if>{
		"text": "<xsl:value-of select="normalize-space(@title)"/>"
		
		<xsl:apply-templates select="@expanded|@expandable" mode="mapSite" />
		
		<xsl:apply-templates select="@catalogName|@mode|@url|@pageSize|@description|@controlType|@mode|@pk|@icon|@iconCls|@id|@filters" mode="mapSite.string" />
		
		<xsl:choose>
			<xsl:when test="name()='menu'">
				<!-- , "id": encodeURI("<xsl:value-of select="normalize-space(@title)"/>") -->
				, "id": "<xsl:value-of select="normalize-space(@title)"/>"
				, "children": [
				<xsl:apply-templates select="*"/>
				]
				<xsl:call-template name="siteMapNode.icon" />
			</xsl:when>
			<xsl:otherwise>
				, "id": "!<xsl:value-of select="@controlType"/>/<xsl:value-of select="@mode"/>/<xsl:value-of select="@catalogName"/><xsl:if test="@pk!=''">/<xsl:value-of select="@pk"/></xsl:if>"
				, "leaf": true
				, "lang": "<xsl:value-of select="ancestor-or-self::*[@xml:lang][1]/@xml:lang"/>"
			</xsl:otherwise>
		</xsl:choose>
		}
	</xsl:template>
	
	<xsl:template name="siteMapNode.icon">	
		<xsl:choose>
			<xsl:when test="@categoryType='bookmarks'">
				, "icon": "/SINCO/resources/images/bookmark.png"
				, "iconCls": "spotlight"
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="@controlType='gridView'">
						, "iconCls": "grids"
					</xsl:when>
					<xsl:when test="@controlType='formView' and @mode='filters'">
						, "iconCls": "form-forumsearch"
					</xsl:when>
					<xsl:when test="@controlType='formView' and @mode!='filters'">
						, "iconCls": "navigation-tabs"
					</xsl:when>
					<xsl:when test="@controlType='cardView'">
						, "iconCls": "dataview-multisort"
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	
</xsl:stylesheet>
