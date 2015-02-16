<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>

	<xsl:template match="*[@controlType='formView']" mode="Viewcontroller">
		/**
		 * 
		 * [ViewController]: FormView
		 * 
		 */
		Ext.define('Panax.viewcontroller.<xsl:apply-templates select="." mode="modelName"/>', {
		    extend: 'Ext.app.ViewController',
		    alias: 'controller.<xsl:apply-templates select="." mode="modelName"/>',

		    /**
		     * Init
		     */
		    init: function() {
		    }
		});
	</xsl:template>

	<xsl:template match="*[@controlType='formView']" mode="Viewmodel">		
		stores:{
		    panax_store: {
		        model: '<xsl:apply-templates select="." mode="modelName"/>',
		        autoLoad: false,
		        autoSync: false,
		        autoDestroy: true,
		        session: true,
	            pageSize: 10
		    }
		},

	    formulas: {
	    	panax_record: {
	    		get: function(get) {
	    			var store = get('panax_store'),
	    				record = store.first();

	    			if(!record) {
	    				store.insert(0, {});
	    				record = store.first();
	    			}

	    			return record;
	    		}
	    	}
	    	// Hacky fix
	    	// Generate Formulas for each radiogroup, combobox
	    	// (http://extjs.eu/ext-examples/#bind-rg2model)
	    	<xsl:for-each select="//*[@controlType='radiogroup' or (@controlType='combobox' or (@controlType='default' and @dataType='foreignKey'))]">
			, <xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>: {
				bind: {
					bindTo: '{panax_record}'
					, deep: true
				}
				<xsl:choose>
				<xsl:when test="@controlType='radiogroup'">
					, get: function(record) {
						var val = record &amp;&amp; record.isModel ? record.get('<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>') : null;
						return val ? {<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>:val} : null;
					}
					, set: function(value) {
						var val = Ext.isObject(value) ? value.<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/> : value;
						this.get('panax_record').set('<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>', val);
					}
				</xsl:when>
				<xsl:otherwise>
					, get: function(record) {
						var val = record &amp;&amp; record.isModel ? record.get('<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>') : null;
						return !record.dirty ? record._<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/> : val;
					}
					, set: function(value) {
						var record = this.get('panax_record');
						//record._<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/> = value;
						record.set('<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>', value);
					}
				</xsl:otherwise>
				</xsl:choose>
			}
	    	</xsl:for-each>
	    }
	</xsl:template>

	<xsl:template match="*[@controlType='formView' and @mode!='filters']" mode="PanaxPanel.MainControl">
	{
    	xtype: 'panaxform',
	    controller: '<xsl:apply-templates select="." mode="modelName"/>',
    	items: [
			<xsl:apply-templates select="." mode="Form.Layout"/>
    	]
    }
	</xsl:template>

	<xsl:template mode="Form.Layout" match="*[px:layout]">
		<xsl:apply-templates select="px:layout/*" mode="formView"/>
	</xsl:template>

	<xsl:template mode="formView" match="px:tabPanel">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			xtype:'tabpanel',
			flex: 1,
			layout: {
		        type: 'vbox',
		        align: 'stretch',
		    },
			activeTab: 0,
			border: false,
			autoScroll: true,
	        items: [<xsl:apply-templates select="px:tab" mode="formView"/>]
		}
	</xsl:template>

	<xsl:template mode="formView" match="px:tab">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
	        title: '<xsl:value-of select="@name" />',
			border: false,
			autoScroll: true,
			bodyPadding: '10 0 0 0',
			flex: 1,
			layout: {
		        type: 'vbox',
		        align: 'stretch',
		    },
	        items: [<xsl:apply-templates select="*" mode="formView.dataField"/>]
		}
	</xsl:template>

	<xsl:template match="px:fieldContainer" mode="formView.dataField">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
	        xtype: 'fieldcontainer',
	        fieldLabel: '<xsl:value-of select="@name" />',
	        layout: 'hbox',
	        defaults: {
	            hideLabel: 'true'
	        },
	        items: [<xsl:apply-templates select="*" mode="formView.dataField"/>]
		}
	</xsl:template>

	<xsl:template match="px:fieldSet" mode="formView.dataField">
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
	        xtype: 'fieldset',
	        title: '<xsl:value-of select="@name" />',
	        items: [<xsl:apply-templates select="*" mode="formView.dataField"/>]
		}
	</xsl:template>
	
	<xsl:template match="px:layout//px:field" mode="formView">
		<xsl:if test="position()&gt;1">,</xsl:if>
		<xsl:apply-templates select="." mode="formView.dataField" />
	</xsl:template>
	
	<xsl:template match="px:layout//px:field" mode="formView.dataField">
		<xsl:param name="item" select="key('fields', @fieldId)"/>
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			fieldLabel: '<xsl:value-of select="$item/@headerText"/>'
			, <xsl:apply-templates select="$item" mode="formView.dataField" />
		}
	</xsl:template>
	
	<xsl:template match="px:fields/*[@dataType!='junctionTable' and @dataType!='foreignTable']" mode="formView.dataField">
		<xsl:apply-templates select="." mode="formView.control" />
	</xsl:template>



	
	<xsl:template match="px:fields/*[@dataType='foreignTable']" mode="formView.dataField">
		<xsl:apply-templates select="." mode="formView.foreignTable" />
	</xsl:template>

	<xsl:template match="*[@relationshipType='hasOne']" mode="formView.foreignTable">
		<xsl:if test="position()&gt;1">,</xsl:if>
	        xtype: 'fieldset'
			, title: '<xsl:value-of select="@headerText"/>'
			, flex: 1
			, layout: {
		        type: 'vbox',
		        align: 'stretch',
		    }
	        , items: [
	        	<xsl:apply-templates select="." mode="Form.Layout"/>
	        ]
	</xsl:template>

	<xsl:template match="*[@relationshipType='hasMany']" mode="formView.foreignTable">
		<xsl:if test="position()&gt;1">,</xsl:if>
	        xtype: 'fieldset'
			, title: '<xsl:value-of select="@headerText"/>'
			, flex: 1
			, layout: {
		        type: 'vbox',
		        align: 'stretch',
		    }
	        , items: [
	        	<xsl:apply-templates select="." mode="PanaxPanel.MainControl" />
	        ]
	</xsl:template>

	<xsl:template match="px:fields/*[@dataType='junctionTable']" mode="formView.dataField">
		<xsl:apply-templates select="." mode="formView.junctionTable" />
	</xsl:template>

	<xsl:template match="*" mode="formView.junctionTable">
		<xsl:if test="position()&gt;1">,</xsl:if>
	        xtype: 'fieldset'
			, title: '<xsl:value-of select="@headerText"/>'
			, flex: 1
			, layout: {
		        type: 'vbox',
		        align: 'stretch',
		    }
	        , items: [{
	        	<xsl:apply-templates select="." mode="junctionTable.MainControl" />
	        }]
	</xsl:template>


</xsl:stylesheet>