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
			"form": <xsl:apply-templates select="*" mode="form"></xsl:apply-templates>
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





	<!-- LEGACY - to be deleted - -->




	<!-- <xsl:template match="*[@dataType='table']" mode="json">
		"total": "<xsl:value-of select="@totalRecords"/>"
		, "catalog": {
		"dbId": "<xsl:value-of select="@dbId"/>"
		,"catalogName": "<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>"
		,"mode": "<xsl:value-of select="@mode"/>"
		,"controlType": "<xsl:value-of select="@controlType"/>"
		,"lang": "<xsl:value-of select="@xml:lang"/>"
		}
		,"metadata": {
			<xsl:apply-templates select="@supportsInsert|@supportsUpdate|@supportsDelete|@disableInsert|@disableUpdate|@disableDelete" mode="json"/>
		}
		, "data": [
		<xsl:apply-templates select="px:data/px:dataRow" mode="json" />
		]
	</xsl:template> -->

	<xsl:template match="*" mode="metadata">
		<!-- ,metaData:{id:"<xsl:value-of select="generate-id()"/>",<xsl:apply-templates select="@disableInsert|@disableUpdate|@disableDelete" mode="json"/> <xsl:apply-templates select="*[not(name(.)='px:data')]" mode="metadata"/>} -->
	</xsl:template>

	<xsl:template match="px:data/px:dataRow|px:fields" mode="json">
		<xsl:variable name="parentTable" select="ancestor::*[key('fields',@fieldId)/@dataType='foreignTable' or key('fields',@fieldId)/@dataType='junctionTable']"/>
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
		"rowNumber":"<xsl:value-of select="@rowNumber"/>"
		<!-- ,"readOnly":true -->
		<!-- Identity Key -->
		, "<xsl:value-of select="translate(ancestor::*[@dataType='table'][1]/@identityKey, $uppercase, $smallcase)"/>":<!-- {text:-->
		<xsl:choose>
			<xsl:when test="string(@identity)!=''">
				"<xsl:value-of select="@identity"/>"
			</xsl:when>
			<xsl:otherwise>null</xsl:otherwise>
		</xsl:choose>
		<!--Include Foreign Key-->
		<xsl:if test="$parentTable">
			, "<xsl:value-of select="translate(ancestor::*[@dataType='table'][1]/@foreignReference, $uppercase, $smallcase)"/>": "<xsl:value-of select="ancestor::*[@identity][1]/@identity"/>"
		</xsl:if>

		<xsl:if test="ancestor::*[key('fields',@fieldId)/@dataType='junctionTable']">
			<xsl:variable name="data" select="self::*[key('junctionSelfReferenced',*/@fieldId)]/../px:dataRow[*[key('junctionField',@fieldId)]/*/@foreignValue=current()/*[key('junctionField',@fieldId)]/@value]"/>
			<!-- <xsl:choose>
				<xsl:when test="$data">expanded:true</xsl:when>
				<xsl:otherwise>leaf:true</xsl:otherwise>
			</xsl:choose>
			,iconCls:'task' -->
			,"checked":
			<xsl:choose>
				<xsl:when test="string(@identity)!=''">true</xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="key('junctionSelfReferenced',*/@fieldId)">
				,"data":[<xsl:apply-templates select="$data" mode="json"/>]
			</xsl:if>
		</xsl:if>
		
		<xsl:choose>
			<xsl:when test="local-name()='fields'">
				<xsl:apply-templates select="*" mode="json">
					<xsl:with-param name="isPhantomRecord" select="true()"/>
				</xsl:apply-templates>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="*" mode="json"/>
			</xsl:otherwise>
		</xsl:choose>
		}<!-- [string(@value)!=''] -->
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*|px:fields/*" mode="json">
		<xsl:param name="isPhantomRecord" select="false()"/>,"<xsl:value-of disable-output-escaping="yes" select="translate(key('fields',@fieldId)/@Column_Name, $uppercase, $smallcase)"/>":<xsl:choose>
			<xsl:when test="$isPhantomRecord">{"value":null}</xsl:when>
			<xsl:when test="key('fields', @fieldId)/@dataType='foreignTable' or key('fields', @fieldId)/@dataType='junctionTable'">
				<xsl:apply-templates select="." mode="json.value"/>
			</xsl:when>
			<xsl:otherwise>
				{"value":<xsl:apply-templates select="." mode="json.value"/><xsl:if test="key('fields',@fieldId)/@dataType='date'">,"hidden":true</xsl:if><xsl:if test="1=0 or key('fields',@fieldId)/@mode='readonly' or key('readonlyField',generate-id(.))">,"readOnly":true</xsl:if><xsl:if test="px:data">
					,"data":[<xsl:apply-templates select="px:data/*[not(self::*[key('fields',@fieldId)/@referencesItself='true']) or self::*[key('fields',@fieldId)/@referencesItself='true'] and not(@foreignValue)]" mode="json.fk.data"/>]<xsl:apply-templates select="." mode="metadata"/>
				</xsl:if>}
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!--<xsl:template match="px:data/px:dataRow/*" mode="json.value">null</xsl:template>-->

	<xsl:template match="px:data/px:dataRow/*" mode="json.value">
		"<xsl:value-of disable-output-escaping="no" select="string(@value)"/>"
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[string(@value)='']" mode="json.value">
		<!--/*4*/-->""
	</xsl:template>

	<xsl:template match="*" mode="json.fkPair">
		{"id":"<xsl:value-of disable-output-escaping="yes" select="@value"/>,"text":"<xsl:choose>
			<xsl:when test="string(@value)!=''">
				<xsl:value-of disable-output-escaping="no" select="str:escapeApostrophe(string(@text))"/>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>"<xsl:choose>
			<xsl:when test="*[not(name(.)='px:data')]">
				,"fk":<xsl:apply-templates select="*[not(name(.)='px:data')]" mode="json.fkPair"/>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>}
	</xsl:template>

	<xsl:template match="*" mode="json.fk.data">
		<xsl:if test="position()&gt;1">,</xsl:if>{"id":"<xsl:value-of disable-output-escaping="yes" select="@value"/>","text":"<xsl:choose>
			<xsl:when test="string(@value)!=''">
				<xsl:value-of disable-output-escaping="no" select="str:escapeApostrophe(string(@text))"/>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>","fk":<xsl:choose>
			<xsl:when test="@foreignValue">
				"<xsl:value-of disable-output-escaping="yes" select="@foreignValue"/>"
			</xsl:when>
			<xsl:otherwise>null</xsl:otherwise>
		</xsl:choose><xsl:choose>
			<xsl:when test="*[not(name(.)='px:data')] or self::*[key('fields',@fieldId)/@referencesItself='true']/../*[@foreignValue=current()/@value]">
				,"data":[<xsl:apply-templates select="*|self::*[key('fields',@fieldId)/@referencesItself='true']/../*[@foreignValue=current()/@value]" mode="json.fk.data"/>],"expanded":true,"checked":false
			</xsl:when>
			<xsl:otherwise>,"leaf":true,"checked":false,"iconCls":"task</xsl:otherwise>
		</xsl:choose>,"metaData":{<xsl:apply-templates select="@custom:*" mode="json"/>}}
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)/@dataType='money' or key('fields',@fieldId)/@dataType='smallmoney' or key('fields',@fieldId)/@dataType='int' or key('fields',@fieldId)/@dataType='identity' or key('fields',@fieldId)/@dataType='float'][@value]" mode="json.value">
		<!--/*2*/--><!-- {text:-->"<xsl:value-of disable-output-escaping="yes" select="@value"/>"<!-- } -->
	</xsl:template>
	<!-- 
<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)/@controlType='monthpicker'][@value]" mode="json.value">{id:'<xsl:value-of disable-output-escaping="yes" select="@value"/>'}</xsl:template> -->
	<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)/@dataType='int' or key('fields',@fieldId)/@dataType='tinyint'][string(@value)!='']" mode="json.value">
		<!--/*3*/-->
		<!-- {text:-->
		<xsl:value-of disable-output-escaping="yes" select="@value"/>
		<!-- } -->
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)/@dataType='foreignKey' and (key('fields',@fieldId)/@controlType='default' or key('fields',@fieldId)/@controlType='selectBox' or key('fields',@fieldId)/@controlType='combobox')]" mode="json.value">
		<!--/*7*/-->
		<xsl:apply-templates select="." mode="json.fkPair"/>
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)/@dataType='foreignKey' and (key('fields',@fieldId)/@controlType='default' or key('fields',@fieldId)/@controlType='selectBox' or key('fields',@fieldId)/@controlType='combobox')][*[not(name(.)='px:data')]]" mode="json.value">
		<!--/*8*/-->
		<!-- '<xsl:value-of disable-output-escaping="yes" select="@value"/>' -->
		<xsl:apply-templates select="*[not(name(.)='px:data')]" mode="json.fkPair"/>
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)/@dataType='date' or key('fields',@fieldId)/@dataType='datetime' or key('fields',@fieldId)/@dataType='smalldatetime']" mode="json.value">
		<!--/*1*/-->
		<xsl:choose>
			<xsl:when test="string(@value)!=''">
				<!-- new Date('<xsl:value-of select="translate(@value,'-','/')"/>') -->
				"<xsl:value-of select="translate(@value,'-','/')"/>"
			</xsl:when>
			<xsl:otherwise>null</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<xsl:template match="*[key('junctionSelfReferenced',@fieldId)/@relationshipType='hasOne']/*/px:data/px:dataRow" mode="json.hasOne">
		<!-- /*hasone*/ -->
		<xsl:apply-templates select="*" mode="json"/>
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)[@dataType='foreignTable']]" mode="json.value">
		<!--/*5*/-->{"data":[<xsl:apply-templates select="*/px:data/px:dataRow" mode="json" />]}
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[key('junctionSelfReferenced',@fieldId)[@relationshipType='hasOne']]" mode="json.value">
		<xsl:choose>
			<xsl:when test="*/px:data/px:dataRow">
				<xsl:apply-templates select="*/px:data/px:dataRow[1]" mode="json" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="key('fields',@fieldId)/*/px:fields" mode="json" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="px:data/px:dataRow/*[key('oneToOne',@fieldId)]" mode="json.value">
		<!-- /*hasone*/ --><xsl:apply-templates select="*/px:data/px:dataRow" mode="json">
			<xsl:with-param name="isPhantomRecord" select="true()"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="px:data/px:dataRow/*[key('fields',@fieldId)[@dataType='junctionTable']]" mode="json.value">
		<!--/*6*/--><!-- {"text":".","children": -->{<xsl:if test="self::*[key('junctionSelfReferenced',@fieldId)/@relationshipType='hasOne']">
			"rowNumber":1<!-- /*hasOne*/ --><xsl:apply-templates select="self::*[key('junctionSelfReferenced',@fieldId)/@relationshipType='hasOne']/*/px:data/px:dataRow[1]" mode="json.hasOne">
				<xsl:sort select="number(boolean(../@identity))" order="descending"/>
			</xsl:apply-templates>,
		</xsl:if>"data":[<xsl:apply-templates select="*/px:data/px:dataRow[not(key('junctionSelfReferenced',*/@fieldId)) or key('junctionSelfReferenced',*/@fieldId) and *[key('junctionField',@fieldId)]/*[not(@foreignValue)] ]" mode="json" />]}<!-- } -->
	</xsl:template>

</xsl:stylesheet>