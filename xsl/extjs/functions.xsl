<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:math="http://exslt.org/math"
	xmlns:set="http://exslt.org/sets"
    xmlns:date="http://exslt.org/dates-and-times"
    xmlns:str="http://exslt.org/strings"
	extension-element-prefixes="math set date str"
	xmlns:px="urn:panax">
<xsl:import href="functions/date.xsl" />
<!--<xsl:import href="EXSLT/math/math.xsl" />-->
<!-- <xsl:import href="EXSLT/set/set.xsl" /> -->
<!-- <xsl:import href="EXSLT/str/str.xsl" /> -->

<msxsl:script language="JavaScript" implements-prefix="str">
<![CDATA[
function escapeApostrophe(sText){ var sNewText=sText; return sNewText.replace(/\'/gi, "\\'");}
function escapeString(sText){ var sNewText=sText; return sNewText.replace(/([\'\\\n])/gi, "\\$1");}
]]>
</msxsl:script>

<xsl:template name="currentMode">
<xsl:for-each select="ancestor-or-self::*[@mode!='inherit' and @mode!='hidden']"><xsl:sort select="number(boolean(@forceMode))" order="descending" /><xsl:sort select="number(boolean(@mode='readonly'))" order="descending" /><xsl:sort select="position()" data-type="number" order="ascending" /><xsl:if test="position()=1"><xsl:value-of select="@mode"/></xsl:if></xsl:for-each>
</xsl:template>

<xsl:template name="getGroupName"><xsl:param name="key" /><xsl:value-of select="@*[name(.)=$key]|self::*[not(@*[name(.)=$key])]/preceding-sibling::*[@*[name(.)=$key]][1]/@*[name(.)=$key]"/></xsl:template>

<xsl:template name="getHeadOfGroup"><xsl:param name="key" /><xsl:param name="scope" select=".|preceding-sibling::*" />
<xsl:variable name="closestGroupNode" select="
self::*[not(@*[name(.)=$key])]/preceding-sibling::*[@fieldId=$scope/@fieldId][@*[name(.)=$key]][1] |
self::*[@*[name(.)=$key]]"/>
<xsl:variable name="headOfGroup" select="$closestGroupNode[string(@*[name(.)=$key])=string(preceding-sibling::*[1]/@*[name(.)=$key])]/preceding-sibling::*[@fieldId=$scope/@fieldId][string(@*[name(.)=$key])!=string(preceding-sibling::*[1]/@*[name(.)=$key])][1]|$closestGroupNode"/>
<xsl:value-of select="generate-id($headOfGroup)"/>
</xsl:template>

<xsl:template match="px:data/px:dataRow/*|px:fields/*" mode="contiguousFields">
	<xsl:param name="referenceNode" select="current()" />
	<xsl:param name="referenceAttribute" />
	<xsl:param name="direction" select="'forward'"/>
	<xsl:choose>
	<xsl:when test="$direction='forward'"><xsl:variable name="nextDifferentNode" select="$referenceNode/following-sibling::*[key('visibleFields',@fieldId)][@*[name(.)=$referenceAttribute]][string(@*[name(.)=$referenceAttribute])!=string($referenceNode/@*[name(.)=$referenceAttribute])][1]"/>
	<xsl:value-of select="count($referenceNode|$referenceNode/following-sibling::*[key('visibleFields',@fieldId)])-count($nextDifferentNode|$nextDifferentNode/following-sibling::*[key('visibleFields',@fieldId)])"/></xsl:when>	
	<xsl:otherwise><xsl:variable name="nextDifferentNode" select="$referenceNode/preceding-sibling::*[key('visibleFields',@fieldId)][string(@*[name(.)=$referenceAttribute])!=string($referenceNode/@*[name(.)=$referenceAttribute])][1]"/>
	<xsl:value-of select="count($referenceNode|$referenceNode/preceding-sibling::*)-count($nextDifferentNode|$nextDifferentNode/preceding-sibling::*)"/></xsl:otherwise>
</xsl:choose>
</xsl:template>


<xsl:template name="translateTemplate">
	<xsl:param name="inputString"/>
	<xsl:param name="nodes"/>
	<xsl:choose>
		<xsl:when test="contains($inputString, '[')">
			<xsl:call-template name="removeSpecials">
				<xsl:with-param name="inputString">
					<xsl:value-of select="substring-before($inputString, '[')" />
				</xsl:with-param>
			</xsl:call-template>
			<xsl:variable name="token"><xsl:value-of select="substring-before(substring-after($inputString, '['), ']')" /></xsl:variable>
			<xsl:value-of select="$nodes[name(.)=$token]//@text" />
			<xsl:call-template name="translateTemplate">
				<xsl:with-param name="inputString" select="substring-after($inputString, ']')"/>
				<xsl:with-param name="nodes" select="$nodes"/>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:choose>
				<xsl:when test="$inputString = ''">
					<xsl:text></xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of disable-output-escaping="yes" select="$inputString"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- Round -->
<msxsl:script language="JavaScript" implements-prefix="math">
<![CDATA[
function round(fNumber, iDecimals){ return Math.round(fNumber*Math.pow(10, iDecimals))/Math.pow(10, iDecimals);}
]]>
</msxsl:script>


<xsl:template name="formatCurrency">
	<xsl:param name="currency"/>
	<xsl:param name="decimals" select="2"/>
	<xsl:param name="format" select="'$#,##0.00###;($#,##0.00###)'"/>
	<xsl:choose>
		<xsl:when test="string(number($currency))!='NaN' and string(number($currency))!='Infinity' and string(number($currency))!='-Infinity'"><xsl:value-of select="format-number(round(number($currency)*math:power(10,$decimals)) div math:power(10,$decimals), $format)"/></xsl:when>	
		<xsl:otherwise></xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="formatPercent">
	<xsl:param name="percent"/>
	<xsl:param name="decimals" select="2"/>
	<xsl:choose>
		<xsl:when test="string(number($percent))!='NaN' and string(number($percent))!='Infinity' and string(number($percent))!='-Infinity'"><xsl:value-of select="concat(format-number((round(number($percent)*math:power(10,$decimals)) div math:power(10,$decimals)), '##0.00###'), '%')"/></xsl:when>	
		<xsl:otherwise></xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="formatDate">
	<xsl:param name="format" select="'long'" />
	<xsl:param name="date-time" select="'07/08/2010'" />
	<xsl:variable name="month" select="number(substring($date-time, 4, 2))" />
	<xsl:choose>
		<xsl:when test="$format='long'">
			<xsl:value-of select="substring($date-time, 1, 2)"/> de 
			<xsl:choose>
				<xsl:when test="$month=1">Enero</xsl:when>	
				<xsl:when test="$month=2">Febrero</xsl:when>	
				<xsl:when test="$month=3">Marzo</xsl:when>	
				<xsl:when test="$month=4">Abril</xsl:when>	
				<xsl:when test="$month=5">Mayo</xsl:when>	
				<xsl:when test="$month=6">Junio</xsl:when>	
				<xsl:when test="$month=7">Julio</xsl:when>	
				<xsl:when test="$month=8">Agosto</xsl:when>	
				<xsl:when test="$month=9">Septiembre</xsl:when>	
				<xsl:when test="$month=10">Octubre</xsl:when>	
				<xsl:when test="$month=11">Noviembre</xsl:when>	
				<xsl:when test="$month=12">Diciembre</xsl:when>	
				<xsl:otherwise>Error!</xsl:otherwise>
			</xsl:choose> de <xsl:value-of select="substring($date-time, 7, 4)"/>
		</xsl:when>	
		
		<xsl:otherwise>Formato <xsl:value-of select="$format"/> no encontrado!</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="removeSpecials">
	<xsl:param name="inputString"/>
	<xsl:call-template name="replace">
		<xsl:with-param name="inputString" select="$inputString"/>
		<xsl:with-param name="searchText" select="'\n'"/>
		<xsl:with-param name="replaceBy"><xsl:value-of select="$cr"/></xsl:with-param>
	</xsl:call-template>
</xsl:template>

<xsl:template name="replace">
	<xsl:param name="inputString"/>
	<xsl:param name="searchText"/>
	<xsl:param name="replaceBy"/>
	<xsl:choose>
		<xsl:when test="contains($inputString, $searchText)">
			<xsl:value-of disable-output-escaping="yes" select="substring-before($inputString, $searchText)"/>
			<xsl:value-of disable-output-escaping="yes" select="$replaceBy"/>
			<xsl:call-template name="replace">
				<xsl:with-param name="inputString" select="substring-after($inputString, $searchText)"/>
				<xsl:with-param name="searchText" select="$searchText"/>
				<xsl:with-param name="replaceBy" select="$replaceBy"/>
			</xsl:call-template>
		</xsl:when>
	<xsl:otherwise>
		<xsl:choose>
			<xsl:when test="$inputString = ''">
				<xsl:text></xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of disable-output-escaping="yes" select="$inputString"/>
				<xsl:text> </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- http://lavbox.blogspot.com/2008/05/xsl-template-to-split-to-string.html -->
<xsl:template name="SplitText">
	<xsl:param name="inputString"/>
	<xsl:param name="delimiter"/>
	<xsl:choose>
		<xsl:when test="contains($inputString, $delimiter)">
		<xsl:value-of select="substring-before($inputString,$delimiter)"/>
		<xsl:text disable-output-escaping = "no">&#13;</xsl:text>
		<xsl:call-template name="SplitText">
		<xsl:with-param name="inputString" select="substring-after($inputString,$delimiter)"/>
		<xsl:with-param name="delimiter" select="$delimiter"/>
		</xsl:call-template>
		</xsl:when>
	<xsl:otherwise>
		<xsl:choose>
			<xsl:when test="$inputString = ''">
				<xsl:text></xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$inputString"/>
				<xsl:text> </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="join" >
	<xsl:param name="nodes" select="''"/>
	<xsl:param name="separator" select="','"/>
	<xsl:param name="order" select="'ascending'"/>
	<xsl:choose>
	<xsl:when test="$order='ascending' or $order='descending' ">
		<xsl:for-each select="$nodes">
			<xsl:sort select="." order="{$order}" />
			<xsl:call-template name="join.nodes"><xsl:with-param name="separator" select="$separator"/></xsl:call-template>
		</xsl:for-each>
	</xsl:when>	
	<xsl:otherwise>
		<xsl:for-each select="$nodes">
			<xsl:call-template name="join.nodes"><xsl:with-param name="separator" select="$separator"/></xsl:call-template>
		</xsl:for-each>
	</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template name="join.nodes" >
	<xsl:param name="separator"/>
	<xsl:choose>
		<xsl:when test="position() = 1">
		  	<xsl:value-of select="."/>
		</xsl:when>
		<xsl:otherwise>
		  	<xsl:value-of select="concat($separator, .) "/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

</xsl:stylesheet>