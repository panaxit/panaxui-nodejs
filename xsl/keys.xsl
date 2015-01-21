<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

<xsl:key name="visibleFields" match="px:fields/*[not(@dataType='identity')][not(@autoGenerateField='false')][not(@controlType='tab')][not(@mode='hidden' or @mode='none' or @controlType='hiddenField')]|px:fields/*[not(@dataType='identity')][not(@autoGenerateField='false')][not(@controlType='tab')][not(@mode='hidden' or @mode='none' or @controlType='hiddenField')]" use="@fieldId" />
<xsl:key name="visibleTabs" match="px:data/px:dataRow/*[@controlType='tab'][not(@mode='hidden' or @mode='none') and not(ancestor::*[@dataType='table' and @mode='insert'])]" use="@fieldId" />

<xsl:key name="requiredFields" match="px:fields/*[ancestor-or-self::*[@dataType][not(@dataType='identity')]][boolean(@isRequired)=1 or string(@isRequired)='true' or number(@isNullable)=0]" use="generate-id()" />

<xsl:key name="oneToOne" match="*[@dataType='foreignTable' and @relationshipType='hasOne']" use="@fieldId" />

<xsl:key name="junctionField" match="*[@dataType='junctionTable' and @controlType='default']/*/px:fields/*[@isPrimaryKey=1]" use="@fieldId" />

<xsl:key name="junctionSelfReferenced" match="*[@dataType='junctionTable' and @controlType='default']/*/px:fields/*[@isPrimaryKey=1 and */@referencesItself='true']" use="@fieldId" />

<xsl:key name="groupTabPanel" match="px:fields/*[@groupTabPanel]" use="@groupTabPanel" />
<xsl:key name="groupTabPanel" match="px:fields/*[@groupTabPanel]" use="concat(generate-id(),'::',@groupTabPanel)" />
<xsl:key name="groupTabPanel" match="px:fields/*[not(@groupTabPanel)]" use="concat(generate-id(),'::',preceding-sibling::*[@groupTabPanel][1]/@groupTabPanel)" />

<xsl:key name="groupTabPanel" match="px:fields/*[@subGroupTabPanel]" use="@subGroupTabPanel" />
<xsl:key name="subGroupTabPanel" match="px:fields/*[@subGroupTabPanel]" use="concat(generate-id(),'::',@subGroupTabPanel)" />
<xsl:key name="subGroupTabPanel" match="px:fields/*[not(@subGroupTabPanel)]" use="concat(generate-id(),'::',preceding-sibling::*[@subGroupTabPanel][1]/@subGroupTabPanel)" />

<xsl:key name="portlet" match="px:fields/*[@portlet]" use="@portlet" />
<xsl:key name="portlet" match="px:fields/*[@portlet]" use="concat(generate-id(),'::',@portlet)" />
<xsl:key name="portlet" match="px:fields/*[not(@portlet)]" use="concat(generate-id(),'::',preceding-sibling::*[@portlet][1]/@portlet)" />

<xsl:key name="tabPanel" match="px:fields/*[@tabPanel]" use="@tabPanel" />
<xsl:key name="tabPanel" match="px:fields/*[@tabPanel]" use="concat(generate-id(),'::',@tabPanel)" />
<xsl:key name="tabPanel" match="px:fields/*[not(@tabPanel)]" use="concat(generate-id(),'::',preceding-sibling::*[@tabPanel][1]/@tabPanel)" />

<xsl:key name="fieldSet" match="px:fields/*[@fieldSet]" use="@fieldSet" />
<xsl:key name="fieldSet" match="px:fields/*[@fieldSet]" use="concat(generate-id(),'::',@fieldSet)" />
<xsl:key name="fieldSet" match="px:fields/*[not(@fieldSet)]" use="concat(generate-id(),'::',preceding-sibling::*[@fieldSet][1]/@fieldSet)" />

<!-- <xsl:key name="fieldContainer" match="px:fields/*[@fieldContainerEnd]" use="@fieldContainerEnd" />
<xsl:key name="fieldContainer" match="px:fields/*[@fieldContainer]" use="concat(generate-id(),'::',@fieldContainer)" />
<xsl:key name="fieldContainer" match="px:fields/*[@fieldContainerEnd]" use="concat(generate-id(),'::',@fieldContainerEnd)" />
<xsl:key name="fieldContainer" match="px:fields/*[not(@fieldContainer)]" use="concat(generate-id(),'::',preceding-sibling::*[@fieldContainer][1]/@fieldContainer)" /> -->

<xsl:key name="readonlyField" match="px:fields/*[ancestor-or-self::*[@mode!='inherit'][1]/@mode='readonly']" use="generate-id(.)" />
<xsl:key name="readonlyField" match="px:data/px:dataRow/*[ancestor-or-self::*[@mode!='inherit'][1]/@mode='readonly']" use="generate-id(.)" />

<xsl:key name="fields" match="px:fields//*[@fieldId][not(namespace-uri(.)='urn:panax')]" use="@fieldId" />
<xsl:key name="fields" match="px:fields/*" use="@fieldId" />

<xsl:key name="fieldContainer" match="px:fieldContainer" use="*/@fieldId" />
<xsl:key name="fieldContainer" match="px:field[not(name(..)='px:fieldContainer')]" use="@fieldId" />
<xsl:key name="container" match="px:layout|px:layout//*" use="*/@fieldId" />
<xsl:key name="container" match="px:layout//*[not(name='px:field')]" use="generate-id()" />
<xsl:key name="container" match="px:layout//*[px:field]|px:layout[px:field]" use="generate-id(px:field)" />
<xsl:key name="table" match="*[@dataType='table']" use="px:fields/*/@fieldId"/>

<!-- <xsl:key name="table" match="*[@dataType='table']" use="generate-id(//*[generate-id(current())=generate-id(ancestor::*[@dataType='table'][1])])"/> -->

</xsl:stylesheet>