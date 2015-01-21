<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>

	<xsl:template match="*[@controlType='formView' and @mode='filters']" mode="PanaxPanel.MainControl">
	{
		xtype: 'panel',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [{
	    	xtype: 'panaxform',
		    controller: '<xsl:apply-templates select="." mode="modelName"/>',
		    title: 'Filtros',
	    	items: [
				<xsl:apply-templates select="." mode="Form.Layout"/>
	    	],
			buttons: [{
		    <!--     text: 'Reestablecer',
		        glyph: 115,
		        handler: function() {
		            this.up('form').getForm().reset();
					this.up('panaxpanel').getController().onFilter();
		        }
		    }, {
		    	xtype: 'tbfill'
		    }, { -->
				text: 'Filtrar'
                , glyph: 86
				, handler: function() {
					this.up('panaxpanel').getController().onFilter();
		        }
			}]
	    }, {
	    	xtype: 'panel',
	    	itemId: 'filters_results',
	    	flex: 1,
	    	title: 'Resultados',
	    	border: 1,
	    	layout: 'fit',
	    	items: [
	    		<!-- <xsl:call-template name="Filters.ResultsGrid"/> -->
	            /*
	            Get Panax Component
	             */
	            Panax.core.PanaxComponent.getComponent({
					prefix: "Cache.app",
					dbId: "<xsl:value-of select="@dbId "/>",
					lang: "<xsl:value-of select="@xml:lang "/>",
					catalogName: "<xsl:value-of select="@Table_Schema "/>.<xsl:value-of select="@Table_Name "/>",
					mode: "readonly",
					controlType: "gridView"
	            })
	    	]
		}]
	}
	</xsl:template>

	<xsl:template name="Filters.ResultsGrid">
	{
        xtype: 'panaxgrid',
	    <!-- controller: '<xsl:apply-templates select="." mode="modelName"/>', -->
        <!-- bind: '{panax_record<xsl:apply-templates select="." mode="storeBind"/>}', -->
        store: {
    		model: '<xsl:apply-templates select="." mode="modelName"/>',
            proxy: {
            	type: 'panax_proxy',
            	settings: {
			        catalogName: '<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>'
					, identityKey: "<xsl:value-of select="@identityKey"/>"
		            , primaryKey: ["<xsl:value-of select="@primaryKey"/>"]
		            , mode: "readonly"
		            , lang: "<xsl:value-of select="@xml:lang"/>"
            	}
            },
    		autoLoad: false,
    		autoSync: false,
    		autoDestroy: true,
    		<!-- session: true, -->
    		pageSize: 10,
    		remoteFilter: true
    	},
        columns: [
        	<xsl:if test="@mode!='readonly'">
	        {
	            xtype: 'widgetcolumn',
	            width: 44,
	            widget: {
	                xtype: 'button',
	                <xsl:choose>
		                <xsl:when test="/*[1]/@mode='readonly' or @mode='readonly'">
		                    glyph: 105, //Readonly
		                </xsl:when>
		                <xsl:otherwise>
		                    glyph: 47, //Edit
		                </xsl:otherwise>
	                </xsl:choose>
	                handler: 'onEditRecordClick'
	            }
	        },
		    </xsl:if>
		    <!-- ToDo: Columns order based on px:layout, not px:fields -->
 			<xsl:apply-templates select="px:fields/*[@dataType!='junctionTable' and @dataType!='foreignTable' and @isIdentity!=1]" mode="gridView.column"/>
        ],

        viewConfig: {
        	paging: {
        		show: false,
        		store: ''
        	},
			summary: {
				show: false
			}
			<xsl:if test="/*[1]/@mode='readonly' or @mode='readonly'">
				, isReadonly: true
			</xsl:if>
        }

	}
	</xsl:template>

</xsl:stylesheet>