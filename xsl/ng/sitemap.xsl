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
	
	<xsl:template match="@*" mode="mapSite.string"><xsl:if test="position()&gt;1">,</xsl:if> "<xsl:value-of select="name(.)"/>":"<xsl:value-of select="."/>"</xsl:template>
	
	<xsl:template match="sitemap:*">
		<xsl:if test="position()&gt;1">,</xsl:if>{
		"label": "<xsl:value-of select="normalize-space(@title)"/>"
		
		<xsl:apply-templates select="@expanded|@expandable" mode="mapSite" />
		
		,"data": {
				<xsl:apply-templates select="@catalogName|@mode|@url|@pageSize|@description|@controlType|@mode|@pk|@icon|@iconCls|@id|@filters" mode="mapSite.string" />
		}
		
		<xsl:choose>
			<xsl:when test="name()='menu'">
				, "children": [
				<xsl:apply-templates select="*"/>
				]
				<xsl:call-template name="siteMapNode.icon" />
			</xsl:when>
			<xsl:otherwise>
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
