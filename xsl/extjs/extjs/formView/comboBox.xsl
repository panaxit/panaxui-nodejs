<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">

	<xsl:template mode="control.config.insertEnabled" match="*[(@controlType='ajaxDropDownList' or @controlType='selectBox' or @controlType='default' and ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='default' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='ajaxDropDownList' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='selectBox')]" priority="-1"><xsl:choose><xsl:when test="@supportsInsert='1' and not(string(@disableInsert)='true')">true</xsl:when><xsl:otherwise>false</xsl:otherwise></xsl:choose></xsl:template>

	<xsl:template mode="control.config.editEnabled" match="*[(@controlType='ajaxDropDownList' or @controlType='selectBox' or @controlType='default' and ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='default' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='ajaxDropDownList' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='selectBox')]" priority="-1"><xsl:choose><xsl:when test="@supportsUpdate='1' and not(string(@disableEdit)='true')">true</xsl:when><xsl:otherwise>false</xsl:otherwise></xsl:choose></xsl:template>

	<xsl:template mode="control.config.deleteEnabled" match="*[(@controlType='ajaxDropDownList' or @controlType='selectBox' or @controlType='default' and ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='default' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='ajaxDropDownList' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='selectBox')]" priority="-1"><xsl:choose><xsl:when test="@supportsDelete='1' and not(string(@disableDelete)='true')">true</xsl:when><xsl:otherwise>false</xsl:otherwise></xsl:choose></xsl:template>

	<xsl:template mode="control.config.refreshEnabled" match="*[(@controlType='ajaxDropDownList' or @controlType='selectBox' or @controlType='default' and ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='default' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='ajaxDropDownList' or ancestor-or-self::*[@dataType='foreignKey'][1]/@controlType='selectBox')]" priority="-1"><xsl:choose><xsl:when test="@disableRefresh='true'">false</xsl:when><xsl:otherwise>true</xsl:otherwise></xsl:choose></xsl:template>

	<xsl:template match="*[@controlType='combobox' or (@controlType='default' and @dataType='foreignKey')]" mode="formView.control">
	        xtype: 'fieldcontainer'
	        , fieldLabel: '<xsl:value-of select="@headerText" />'
			, layout: 'vbox'
	        , items: [
	        	<xsl:apply-templates select="*" mode="formView.control.comboBox"/>
	        	<xsl:if test="count(//*)>1">
	        		<xsl:apply-templates select="*[1]" mode="formView.control.comboBox.selected"/>
	        	</xsl:if>
	        ]
	</xsl:template>

	<xsl:template match="*" mode="formView.control.comboBox">
		<xsl:variable name="foreignElement">
			<xsl:apply-templates select="*[not(name(.)='items')][string(@mode)!='none']" mode="field_id"/>
		</xsl:variable>
		<xsl:variable name="dependant">
			<xsl:for-each select="ancestor::*[1][not(@dataType='foreignKey')][not(name(.)='items')][string(@mode)!='none']"><xsl:apply-templates select="." mode="field_id"/></xsl:for-each>
		</xsl:variable>
		<xsl:apply-templates select="*" mode="formView.control.comboBox"/>
		<xsl:if test="*">,</xsl:if>
		{
	        xtype: 'fieldcontainer'
			, layout: 'hbox'
	        , items: [{
				xtype: 'ajaxcombobox'
				, name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>'
		        <xsl:if test="(parent::*[@dataText and @dataValue]) or (child::*[@dataText and @dataValue])">
		        	, fieldLabel: '<xsl:value-of select="@headerText" />'
		        </xsl:if>
				//, emptyText: '<xsl:value-of select="@headerText"/>'
	 			, itemId: "<xsl:apply-templates select="." mode="field_id"/>"
				, reference: "<xsl:apply-templates select="." mode="field_id"/>"
				, publishes: 'value'
				, bind: {
				<xsl:if test="parent::*[1]/@dataType='foreignKey'">
					value: '{<xsl:apply-templates select="." mode="bindName"/>}',
				</xsl:if>
				<xsl:if test="$foreignElement!=''">
					filters: "[<xsl:value-of select="@foreignKey" />]='{<xsl:value-of select="$foreignElement"/>.value}'"
				</xsl:if>
				}
				, store: {
					model: "<xsl:apply-templates mode="catalogName" select="."/>",
					proxy: {
						type: 'panax_catalogproxy',
						extraParams: {
							catalogName: "<xsl:value-of select="@Table_Schema" />.<xsl:value-of select="@Table_Name" />",
							dataValue: "<xsl:value-of select="@dataValue"/>",
							dataText: "<xsl:value-of select="@dataText"/>",
							lang: "<xsl:value-of select="@xml:lang"/>",
							orderBy: "<xsl:value-of select="@orderBy"/>",
							sortDirection: "<xsl:value-of select="@sortDirection"/>",
							OptNew: "<xsl:apply-templates select="." mode="control.config.insertEnabled"/>"
						}
					},
					pageSize: 0,
					remoteFilter: true
				}
				<!-- READONLY -->
				<xsl:call-template name="control.readOnly" />
			}, {
				xtype: 'button',
				icon: null,
				glyph: 42,
				ui: 'default-toolbar',
		        menu: [{
		            text:'ToDo 1'
		        },{
		            text:'ToDo 2'
		        },{
		            text:'ToDo 3'
		        }]
				<!-- EDITABLE/READONLY -->
				<xsl:call-template name="control.readOnly" />
			}]
		}
	</xsl:template>

	<xsl:template match="*" mode="formView.control.comboBox.selected">
		<!-- , {
			fieldLabel: ' ',
			xtype: 'displayfield',
			bind: {
				value: '{<xsl:apply-templates select="." mode="field_id"/>.value}'
			}
		} -->
	</xsl:template>

	<!-- <xsl:template match="*[@controlType='combobox' or (@controlType='default' and @dataType='foreignKey')]//*" mode="formView.control.OLD.COMBOBOX">
		<xsl:param name="name">
			<xsl:choose>
				<xsl:when test="@name"><xsl:value-of select="@name"/></xsl:when>
				<xsl:when test="../@foreignKey and @primaryKey"><xsl:value-of select="ancestor::*[@Column_Name][1]/@Column_Name"/>_<xsl:value-of select="count(ancestor::*[@Column_Name][1]/descendant::*[not(name(.)='px:data')])-1"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="../@Column_Name"/></xsl:otherwise>
			</xsl:choose>
		</xsl:param>
		<xsl:variable name="dependant">
			<xsl:for-each select="ancestor::*[1][not(@dataType='foreignKey')][not(name(.)='items')][string(@mode)!='none']"><xsl:apply-templates select="." mode="field_id"/></xsl:for-each>
		</xsl:variable>
		<xsl:variable name="foreignTable">
			<xsl:value-of select="*[not(name(.)='items')][string(@mode)!='none']/@Table_Name" />
		</xsl:variable>
		<xsl:variable name="foreignElement">
			<xsl:apply-templates select="*[not(name(.)='items')][string(@mode)!='none']" mode="field_id"/>
		</xsl:variable>

		<xsl:apply-templates select="*" mode="formView.control"/>

		<xsl:if test="*">,</xsl:if>
		{
	        xtype: 'fieldcontainer'
			, layout: 'hbox'
	        , items: [{
				xtype: 'combobox'
				, name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>'
		        , queryMode: 'remote'
		        , queryParam: false
		        //, queryMode: 'local'
		        //, queryCaching: 'false' //Temporalmente siempre hacer la llamada Ajax al catalogo
		        //, triggerAction: 'all'
				, editable: false
				//, typeAhead: true
				//, editable: true
				//, forceSelection: true 
		        <xsl:if test="(parent::*[@dataText and @dataValue]) or (child::*[@dataText and @dataValue]) ">
		        	, fieldLabel: '<xsl:value-of select="@headerText" />'
		        </xsl:if>
				//, emptyText: '<xsl:value-of select="@headerText"/>'
				<xsl:if test="@enforceConstraint">, enforceConstraint: Boolean(<xsl:value-of select="@enforceConstraint"/>)</xsl:if> -->
				<!-- , settings: 
					catalogName: "<xsl:value-of select="@Table_Schema" />.<xsl:value-of select="@Table_Name" />",
					filters: "<xsl:value-of select="@filters" />",
					dataValue: "<xsl:value-of select="@dataValue" />",
					dataText: "<xsl:value-of select="@dataText" />", 
					orderBy: "<xsl:value-of select="@orderBy" />",
					primaryKey: "<xsl:value-of select="@primaryKey" />",
					foreignKey: "<xsl:value-of select="@foreignKey" />",/*<xsl:value-of select="name(.)"/>*/
					<xsl:if test="@orderBy">orderBy: "<xsl:value-of select="@orderBy"/>",</xsl:if>
					foreignTable: "<xsl:value-of select="*[not(name(.)='items')][string(@mode)!='none']/@Table_Name" />",	
					foreignElement: "<xsl:apply-templates select="*[not(name(.)='items')][string(@mode)!='none']" mode="field_id"/>",
					dependants: [<xsl:for-each select="ancestor::*[1][not(@dataType='foreignKey')][not(name(.)='items')][string(@mode)!='none']">"<xsl:apply-templates select="." mode="field_id"/>",</xsl:for-each>undefined],
					<xsl:apply-templates select="." mode="control.config"/>
				} -->
				<!-- , insertEnabled: <xsl:apply-templates select="." mode="control.config.insertEnabled"/>
				, editEnabled: <xsl:apply-templates select="." mode="control.config.editEnabled"/>
				, deleteEnabled: <xsl:apply-templates select="." mode="control.config.deleteEnabled"/>
				, refreshEnabled: <xsl:apply-templates select="." mode="control.config.refreshEnabled"/> -->
	 			<!-- , itemId: "<xsl:apply-templates select="." mode="field_id"/>"
				, reference: "<xsl:apply-templates select="." mode="field_id"/>"
				, valueNotFoundText: "valueNotFound"
				, displayField: 'text'
				, valueField: 'id' -->
				<!-- , bind: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}' -->
				<!-- , bind: {
					<xsl:choose>
						<xsl:when test="parent::*[@dataType='foreignKey']">
						selection: '{<xsl:apply-templates select="." mode="bindName"/>}'
						</xsl:when>
						<xsl:otherwise>
						value: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
						</xsl:otherwise>
					</xsl:choose>
				}
				, publishes: 'value' -->
				<!-- , bind: {					
					value: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
					<xsl:if test="$foreignElement!=''">
					, filters: {
						property: '<xsl:value-of select="@foreignKey" />',
						value: '{<xsl:value-of select="$foreignElement"/>.value}'
					}
					</xsl:if>
				} -->
				<!-- , store: { -->
					<!-- type: 'ajaxdropdown', -->
					<!-- model: "<xsl:apply-templates mode="catalogName" select="."/>",
					proxy: {
						type: 'panax_catalogproxy',
						extraParams: {
							catalogName: "<xsl:value-of select="@Table_Schema" />.<xsl:value-of select="@Table_Name" />",
							dataValue: "<xsl:value-of select="@dataValue"/>",
							dataText: "<xsl:value-of select="@dataText"/>",
							lang: "<xsl:value-of select="@xml:lang"/>",
							orderBy: "<xsl:value-of select="@orderBy"/>",
							sortDirection: "<xsl:value-of select="@sortDirection"/>",
							OptNew: "<xsl:apply-templates select="." mode="control.config.insertEnabled"/>"
						}
					},
					pageSize: 0,
					remoteFilter: true
				} -->
	  			<!-- , listeners: {
		  			<xsl:if test="$foreignElement!=''">
						focus: function(me, event, eOpts) {
							var store = me.getStore();
							var oProxy = store.getProxy();

							//itemId useful here
							var foreignElement = Ext.ComponentQuery.query('#<xsl:value-of select="$foreignElement"/>')[0],
							fkValue = foreignElement.value?foreignElement.value:"";
							oProxy.extraParams.filters = "[<xsl:value-of select="@foreignKey" />]='" + fkValue + "'";

							if(store.isLoaded()) {
								debugger;
								store.reload();
								//store.load();
							}
						}, 
					</xsl:if>
					<xsl:if test="$dependant!=''">
					change: function(me, newValue, oldValue, eOpts) {
						var dependant = Ext.ComponentQuery.query('#<xsl:value-of select="$dependant"/>')[0];
						debugger;
						if(oldValue!=newValue || !newValue) {
							//dependant.select(null);
							dependant.setValue(null, true);
						}
					}
					</xsl:if>
				} -->
				<!-- READONLY -->
				<!-- <xsl:call-template name="control.readOnly" />
			}, {
				xtype: 'button',
				icon: null,
				glyph: 42,
		        menu: [{
		            text:'Menu Item 1'
		        },{
		            text:'Menu Item 2'
		        },{
		            text:'Menu Item 3'
		        }] -->
				<!-- EDITABLE/READONLY -->
				<!-- <xsl:call-template name="control.readOnly" />
			}]
		}
	</xsl:template> -->

</xsl:stylesheet>


