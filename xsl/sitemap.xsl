<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	>

<!-- <xsl:import href="extjs.xsl" /> -->

<!-- <xsl:include href="../custom/templates/mapSite.xsl" />  -->

<xsl:output method="html" omit-xml-declaration="yes"/> 

<xsl:template match="/">
	<xsl:apply-templates select="siteMap" />
</xsl:template>

<xsl:template match="/siteMap" priority="-1">
    <xsl:text>{success:true, data:[</xsl:text>
	<xsl:apply-templates select="siteMapNode[string(@showInMenu)!='false']" />
	<xsl:text>]}</xsl:text>
</xsl:template>

<xsl:template match="siteMapNode[string(@showInMenu)='false']" priority="-1">
</xsl:template>

<xsl:template match="@*" mode="mapSite">, <xsl:value-of select="name(.)"/>:<xsl:value-of select="."/></xsl:template>

<xsl:template match="@*" mode="mapSite.string">, <xsl:value-of select="name(.)"/>:"<xsl:value-of select="."/>"</xsl:template>

<xsl:template match="siteMapNode[string(@showInMenu)!='false']" priority="-1">
	<xsl:variable name="rootPath" select="/*/@rootPath"/>
	<xsl:if test="position()&gt;1">,</xsl:if>
	{
		text: "<xsl:value-of select="normalize-space(@title)"/>"

		<xsl:apply-templates select="@expanded|@expandable" mode="mapSite" />

		<xsl:apply-templates select="@catalogName|@mode|@url|@pageSize|@description|@controlType|@mode|@pk|@icon|@iconCls|@id|@filters" mode="mapSite.string" />

		<xsl:choose>
			<xsl:when test="@id">
				, children: [
					<xsl:apply-templates select="siteMapNode[string(@showInMenu)!='false']" />
				]
			</xsl:when>
			<xsl:when test="siteMapNode[string(@showInMenu)!='false']">
				, id: encodeURI("<xsl:value-of select="normalize-space(@title)"/>")
				, children: [
					<xsl:apply-templates select="siteMapNode[string(@showInMenu)!='false']" />
				]
				<xsl:call-template name="siteMapNode.icon" />
			</xsl:when>
			<xsl:otherwise>
				, id: "!<xsl:value-of select="@controlType"/>/<xsl:value-of select="@mode"/>/<xsl:value-of select="@catalogName"/><xsl:if test="@pk!=''">/<xsl:value-of select="@pk"/></xsl:if>"
				, leaf: true
				, lang: '<xsl:value-of select="ancestor-or-self::*[@xml:lang][1]/@xml:lang"/>'
				<xsl:call-template name="siteMapNode.icon" />
			</xsl:otherwise>
		</xsl:choose>
	}
<!-- 	<xsl:element name="LI">
	<xsl:attribute name="style">cursor:hand;</xsl:attribute>
	<xsl:attribute name="onclick"><xsl:if test="script">with (window.parent) {<xsl:value-of select="script"/>}</xsl:if> <xsl:if test="@target">top.frames('<xsl:value-of select="@target"/>').</xsl:if>location.href="<xsl:choose>
	<xsl:when test="@url"><xsl:value-of select="@url"/><xsl:if test="not(contains(@url, '?'))">?</xsl:if></xsl:when><xsl:when test="not(@catalogName)">Menus.asp?Path=<xsl:value-of select="$rootPath"/><xsl:for-each select="ancestor-or-self::*[not(position()=last() and string($rootPath)!='')]">/<xsl:value-of select="name(.)"/><xsl:if test="@title">[@title='<xsl:value-of select="@title"/>']</xsl:if></xsl:for-each></xsl:when>	
	<xsl:otherwise>../Templates/request.asp?catalogName=<xsl:value-of select="@catalogName"/><xsl:for-each select="@mode|@filters|@pageSize">&amp;<xsl:value-of select="name(.)"/>=<xsl:value-of select="."/></xsl:for-each>
</xsl:otherwise>
</xsl:choose><xsl:for-each select="parameters/parameter">&amp;<xsl:value-of select="@name"/>=<xsl:value-of select="."/></xsl:for-each>"</xsl:attribute>
	<a href="#"><span><xsl:value-of select="normalize-space(@title)"/></span></a>
	</xsl:element> -->
</xsl:template>

<xsl:template name="siteMapNode.icon">	
	<xsl:choose>
		<xsl:when test="@categoryType='bookmarks'">
			, icon: '/SINCO/resources/images/bookmark.png'
			, iconCls: 'spotlight'
		</xsl:when>
		<xsl:otherwise>
			<xsl:choose>
				<xsl:when test="@controlType='gridView'">
					, iconCls: 'grids'
				</xsl:when>
				<xsl:when test="@controlType='formView' and @mode='filters'">
					, iconCls: 'form-forumsearch'
				</xsl:when>
				<xsl:when test="@controlType='formView' and @mode!='filters'">
					, iconCls: 'navigation-tabs'
				</xsl:when>
				<xsl:when test="@controlType='cardView'">
					, iconCls: 'dataview-multisort'
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="//siteMapNode[@rootPath]" priority="-1">
	<ul id="crumbs">
		<xsl:for-each select="ancestor::*"><li><a class="subTitle"><xsl:attribute name="href">Menus.asp?Path=<xsl:for-each select="ancestor-or-self::*">/<xsl:value-of select="name(.)"/><xsl:if test="@title">[@title='<xsl:value-of select="normalize-space(@title)"/>']</xsl:if></xsl:for-each>
</xsl:attribute><xsl:value-of select="@title"/></a></li></xsl:for-each>
		<li><label class="subTitle"><xsl:value-of select="@title"/></label></li>
	</ul><br/>
	<label class="title">MENUS:</label><br/>
	<xsl:apply-templates select="*" />
</xsl:template>


</xsl:stylesheet>
