<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>

	<xsl:template match="*" mode="modelName">
		<xsl:variable name="ancestorTable" select="ancestor::*[@dataType='table'][1]"/>
		<xsl:if test="$ancestorTable"><xsl:apply-templates select="$ancestorTable" mode="modelName"/>.</xsl:if><xsl:value-of select="@dbId"/>.<xsl:value-of select="@xml:lang"/>.<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>.<xsl:value-of select="translate(@mode, $uppercase, $smallcase)"/>.<xsl:value-of select="@controlType"/>
	</xsl:template>

	<xsl:template match="*" mode="catalogName">
		<xsl:value-of select="concat(@Table_Schema,'.',@Table_Name, '_', generate-id(.))"/>
	</xsl:template>

	<!-- ToDo: Duplicated func with bindName template. Except DOTS positions, FIX -->
	<xsl:template match="*" mode="storeBind">
		<xsl:variable name="foreignTable" select="ancestor::*[@dataType='foreignTable' or @dataType='junctionTable'][1]"/>
		<xsl:variable name="nested" select="@dataType='foreignTable' or @dataType='junctionTable'"/>
		<xsl:if test="$foreignTable"><xsl:apply-templates select="$foreignTable" mode="storeBind"/></xsl:if><xsl:if test="$nested">.</xsl:if><xsl:value-of select="translate(@Column_Name, $uppercase, $smallcase)"/>
	</xsl:template>

	<!-- ToDo: Change mode name to controlBind -->
	<xsl:template match="*" mode="bindName">
		<xsl:variable name="foreignTable" select="ancestor::*[@dataType='foreignTable'][1]"/>
		<xsl:variable name="inForeignKey" select="ancestor::*[@dataType='foreignKey'][1]"/>
		<xsl:variable name="foreignKey" select="parent::*[@dataType='foreignKey']"/>

		<!-- 	 PSEUDOCODE:

			if inForeignKey
				if foreignKey
					rec(foreignKey) + $foreignKey/@Column_Name
				else
					rec(parent) + @Name
			elsif foreignTable
				$foreignTable/@Column_Name + @Column_Name
			else
				@Column_Name 
		-->

		<xsl:choose>
			<xsl:when test="$inForeignKey">
				<xsl:choose>
					<xsl:when test="$foreignKey">
						<xsl:apply-templates select="$foreignKey" mode="bindName"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:apply-templates select=".." mode="bindName"/>.<xsl:value-of select="translate(@Name, $uppercase, $smallcase)"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$foreignTable">
				<xsl:value-of select="translate($foreignTable/@Column_Name, $uppercase, $smallcase)"/>.<xsl:value-of select="translate(@Column_Name, $uppercase, $smallcase)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="translate(@Column_Name, $uppercase, $smallcase)"/>
			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>

	<xsl:template match="*" mode="Model.field.mapping">
		<xsl:value-of select="translate(ancestor-or-self::*[@Column_Name][1]/@Column_Name, $uppercase, $smallcase)"/>
		<xsl:choose>
			<xsl:when test="@dataType='identity'"> </xsl:when>
			<xsl:when test="not(@Column_Name)"> <xsl:for-each select="ancestor::*[@Column_Name][1]/descendant::*[not(name(.)='px:data')][not(@Column_Name) and not(../@Column_Name)]">.parent</xsl:for-each> </xsl:when>
			<xsl:when test="@dataType='junctionTable' or (@dataType='foreignTable' and @relationshipType='hasMany')">["data"]</xsl:when>
			<xsl:when test="@dataType='junctionTable' or (@dataType='foreignTable' and @relationshipType='hasOne')"></xsl:when>
			<xsl:otherwise>["value"]</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="px:fields/*|px:fields/*[@dataType='foreignKey']//*[@primaryKey][not(name(.)='px:data')]" mode="Model.fields">
		<xsl:variable name="parentAssociation" select="ancestor::*[@dataType='foreignTable'][1]"/>
		<xsl:variable name="dependantAssociation" select="*[@Name!='px:data'][1]"/>

		<xsl:if test="position()&gt;1">, </xsl:if>
		{
		name:'<!--<xsl:if test="$parentAssociation"><xsl:value-of select="$parentAssociation/@Column_Name"/>.</xsl:if>--><xsl:value-of select="translate(ancestor-or-self::*[@Column_Name][1]/@Column_Name, $uppercase, $smallcase)"/><!-- <xsl:if test="not(@Column_Name)">_<xsl:value-of select="count(ancestor::*[@Column_Name][1]/descendant::*[not(name(.)='px:data')])-1"/></xsl:if> -->'
		, mapping:'<xsl:apply-templates select="." mode="Model.field.mapping"/>'
		<xsl:if test="@dataType='foreignTable' and @relationshipType='hasOne' and ../../@controlType!='gridView'">
			/******HAS-ONE Foreign-Table ASSOC*******/
			, reference: '<xsl:apply-templates select="$dependantAssociation" mode="modelName"/>'
			, unique: true
		</xsl:if>
<!-- 		<xsl:if test="@dataType='foreignTable' and @relationshipType='hasMany' and ../../@controlType!='gridView'">
			/******DEPENDANT Has-Many ASSOC*******/
			/***
			, reference: '<xsl:apply-templates select="$dependantAssociation" mode="modelName"/>'
			***/
		</xsl:if> -->
		<xsl:if test="@dataType='foreignKey' and (@controlType='default' or @controlType='combobox') and not(ancestor::*[@dataType='junctionTable']) and not(ancestor::*[@controlType='gridView'])">
			/******HAS-ONE Foreign-Key ASSOC*******/
			, reference: '<xsl:apply-templates select="$dependantAssociation" mode="catalogName"/>'
			, unique: true
		</xsl:if>
		<xsl:choose>
			<xsl:when test="@dataType='bit'">
				, type: 'boolean'
			</xsl:when>
			<xsl:when test="@dataType='date' or @dataType='datetime' or @dataType='smalldatetime' or @dataType='timestamp'">
				, type: 'date'
				, dateFormat: 'Y/m/d H:i:s'
			</xsl:when>
			<xsl:when test="@dataType='time'">
				, type: 'date'
				, dateFormat: 'H:i'
			</xsl:when>
			<xsl:when test="@dataType='float' or @dataType='money' or @dataType='smallmoney' or @dataType='float' or @dataType='decimal'">
				, type: 'float', minValue: 0
			</xsl:when>
			<xsl:when test="@dataType='identity' or @dataType='int' or @dataType='smallint' or @dataType='tinyint'">
				, type: 'int', minValue: 0 /*no esta funcionando*/
			</xsl:when>
			<xsl:otherwise>
				/*<xsl:value-of select="@dataType"/>*/
			</xsl:otherwise>
		</xsl:choose>
		<!-- <xsl:if test="@isPrimaryKey=1 or @mode='readonly' or ancestor::*[@dataType='junctionTable']"> -->
		<xsl:if test="@mode='readonly'">
			, persist: false
		</xsl:if>
		//, useNull: true
		}
		<!-- <xsl:if test="*[not(name(.)='px:data')]/*"><xsl:apply-templates select="*[not(name(.)='px:data')]" mode="Model.fields"/></xsl:if> -->
	</xsl:template>

	<xsl:template match="*" mode="Model.catalog">
		<xsl:variable name="dependantAssociation" select="*[@Name!='px:data'][1]"/>
		Ext.define("Panax.model.<xsl:apply-templates mode="catalogName" select="."/>", {
		    extend: 'Panax.model.SchemaBase',

		    fields: [
		    	{ name: 'text' }, 
	    		<xsl:if test="$dependantAssociation">
		    	{ 
					/******DEPENDANT Cascaded ASSOC*******/
		    		name: '<xsl:value-of select="translate($dependantAssociation/@Name, $uppercase, $smallcase)" />'
		    		, mapping: 'fk' 
					, reference: '<xsl:apply-templates select="$dependantAssociation" mode="catalogName"/>'
					, unique: true
		    	}, 
	    		</xsl:if>
		    	{ name: 'children' }, 
		    	{ name: 'metaData' }
		    ]
		});

	</xsl:template>

	<xsl:template match="*" mode="Model.childModels">
		<!-- foreigTable -->
		<xsl:for-each select="px:fields/*[@dataType='foreignTable']">
			<xsl:apply-templates select="*[@Name!='px:data']" mode="Model"/>
		</xsl:for-each>
		<!-- junctionTable -->
		<xsl:for-each select="px:fields/*[@dataType='junctionTable']">
			<xsl:apply-templates select="*[@Name!='px:data']" mode="Model"/>
			<!-- <xsl:apply-templates select="*[@Name!='px:data']" mode="Model.childModels"/> -->
		</xsl:for-each>
		<!-- foreignKey -->
		<xsl:for-each select="px:fields/*[@dataType='foreignKey' and (@controlType='combobox' or @controlType='default')]">
			/***** Model.catalog [<xsl:value-of select="@dataType" />, <xsl:value-of select="@controlType" />]:  <xsl:value-of select="descendant::*[@Name!='px:data']/@Name" /> *****/
			<xsl:apply-templates select="descendant::*[@Name!='px:data']" mode="Model.catalog"/>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match="*" mode="Model">

		<xsl:variable name="parentAssociation" select="ancestor::*[(@dataType='foreignTable' or @dataType='junctionTable') and @relationshipType='hasMany'][1]" />

		<!-- Define child Models first -->
		<xsl:apply-templates select="." mode="Model.childModels"/>

		<!-- Then define main Model -->
		/***** Model [<xsl:value-of select="@dataType" />, <xsl:value-of select="@controlType" />]:  <xsl:value-of select="@Name" /> *****/
		Ext.define("Panax.model.<xsl:apply-templates select="." mode="modelName"/>", {
			extend: 'Panax.model.Base'
            , proxy: {
            	type: 'panax_proxy',
            	settings: {
			        catalogName: '<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>'
					, identityKey: "<xsl:value-of select="@identityKey"/>"
		            , primaryKey: ["<xsl:value-of select="@primaryKey"/>"]
		            , mode: "<xsl:value-of select="translate(@mode, $uppercase, $smallcase)"/>"
		            , lang: "<xsl:value-of select="@xml:lang"/>"
		            , output: 'json'
            	}
            }
		    <xsl:if test="@identityKey!=''">
		    	, idProperty: '<xsl:value-of select="translate(@identityKey, $uppercase, $smallcase)" />'
		    	//, clientIdProperty: '<xsl:value-of select="translate(@identityKey, $uppercase, $smallcase)" />'
		    </xsl:if>
<!-- 		    /*, primaryKeys: '<xsl:value-of select="@primaryKey" />'*/
 -->
<!-- 		    <xsl:for-each select="px:fields/*[@dataType='junctionTable' and @relationshipType='hasMany']/*">
				/******MANY-TO-MANY juntionTable ASSOC*******/
				/***
				, manyToMany: {
					'<xsl:value-of select="translate(@Name, $uppercase, $smallcase)" />': {
						type: '<xsl:apply-templates select="." mode="modelName"/>',
						role: '<xsl:value-of select="translate(@Name, $uppercase, $smallcase)" />',
						field: '',
						right: {
							field: '',
							role: '<xsl:value-of select="translate(../../../@Name, $uppercase, $smallcase)" />'
						}
					}
				}
				***/
			</xsl:for-each>
 -->
<!-- 			<xsl:if test="$parentAssociation">
				/*** PARENT Belongs-To ASSOC ***/
				/***
				, belongsTo : {
					model: '<xsl:apply-templates select="$parentAssociation/ancestor::*[@dataType='table'][1]" mode="modelName"/>'
					, name: '<xsl:value-of select="translate(@Name, $uppercase, $smallcase)" />'
					, associationKey: '<xsl:value-of select="translate(@Name, $uppercase, $smallcase)" />'
				}
				***/
			</xsl:if> -->

		    , fields: [
			    <xsl:if test="@identityKey!=''">
			    	{ name: '<xsl:value-of select="translate(@identityKey, $uppercase, $smallcase)" />' },
			    </xsl:if>
	    		{ name:'rowNumber', type: 'int', persist: false },
		    	<xsl:if test="ancestor::*[@dataType='junctionTable']">
		    		{ name:'checked', type: 'bool', submitValue: false },
		    		<!-- , { name: 'expanded', defaultValue: true } TODO: poder ligar campos de la tabla con estas propiedades -->
				</xsl:if>
				<xsl:if test="$parentAssociation">
					/*** PARENT Belongs-To (hasMany) Foreign-Key ASSOC ***/
					// http://goo.gl/nif9bI
					// https://fiddle.sencha.com/#fiddle/djf
					{
						name: '<xsl:value-of select="translate($parentAssociation/@foreignReference, $uppercase, $smallcase)" />',
						reference: {
							type: '<xsl:apply-templates select="$parentAssociation/ancestor::*[@dataType='table'][1]" mode="modelName"/>'
							//, association: ''
							, role: '<xsl:value-of select="translate($parentAssociation/ancestor::*[@dataType='table'][1]/@Name, $uppercase, $smallcase)" />'
							, inverse: '<xsl:value-of select="translate(@Name, $uppercase, $smallcase)" />'
						}
					},
				</xsl:if>
<!-- 					{
						name: "<xsl:value-of select="translate(@identityKey, $uppercase, $smallcase)" />",
						mapping: "<xsl:value-of select="@identityKey" />"
					}, -->
			
<!--  and not(@dataType='foreignTable' and @relationshipType='hasMany')
 -->			
				<xsl:apply-templates select="px:fields/*[(@isIdentity!='1' or not(@isIdentity))]" mode="Model.fields"/>
			]
			, validators: {}
<!-- 			, init: function() {
				<xsl:apply-templates select="." mode="Model.ProxyExtraParams"/>
			}
 --><!-- 			<xsl:if test="ancestor::*[1][@dataType='foreignTable' or @dataType='foreignKey']">
				, belongsTo: "<xsl:apply-templates select="ancestor::*[@dataType='table'][1]" mode="modelName"/>"
			</xsl:if> -->
			<!--<xsl:if test="px:fields/*[@dataType='junctionTable' or @dataType='foreignTable']">
				, associations: [
					<xsl:for-each select="px:fields/*[@dataType='junctionTable' or @dataType='foreignTable']">
						<xsl:if test="position()&gt;1">,</xsl:if>
						{ 
							type: '<xsl:choose><xsl:when test="@relationshipType='hasOne' and @dataType='foreignTable'"><xsl:value-of select="@relationshipType"/></xsl:when><xsl:otherwise>hasMany</xsl:otherwise></xsl:choose>'
							, model: "<xsl:apply-templates select="*" mode="modelName"/>"
							, name: "<xsl:value-of select="@Column_Name"/>"
							, tableName: '<xsl:value-of select="*/@Table_Schema"/>.<xsl:value-of select="*/@Table_Name"/>'
							, primaryKey: "<xsl:value-of select="*/@primaryKey"/>"
							, identityKey: '<xsl:value-of select="*/@identityKey"/>'
							, foreignKey: "<xsl:value-of select="@foreignReference"/>"
							, associationKey: "<xsl:value-of select="@Column_Name"/>"
							, reader: { type: 'json', root: 'data' }
						}
					</xsl:for-each>
				]
			</xsl:if>-->
		});

	</xsl:template>

<!-- 	<xsl:template match="*" mode="Model.ProxyExtraParams">
		var oProxy = this.getProxy();
		oProxy.setExtraParams({
	        catalogName: '<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>'
			, identityKey: "<xsl:value-of select="@identityKey"/>"
            , primaryKey: ["<xsl:value-of select="@primaryKey"/>"]
            , mode: "<xsl:value-of select="translate(@mode, $uppercase, $smallcase)"/>"
            , lang: "<xsl:value-of select="@xml:lang"/>"
            , output: 'json'
			//, filters: "[Id]=11"
		});
	</xsl:template>
 -->
</xsl:stylesheet>