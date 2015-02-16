<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>

	<xsl:template match="*[@controlType='gridView' or @controlType='cardView']" mode="Viewcontroller">
		/**
		 * 
		 * [ViewController]: GridView
		 * 
		 */
		Ext.define('Panax.viewcontroller.<xsl:apply-templates select="." mode="modelName"/>', {
		    extend: 'Ext.app.ViewController',
		    alias: 'controller.<xsl:apply-templates select="." mode="modelName"/>',

		    /**
		     * Show formView window for record
		     * @param  {String} Record ID of Selected record
		     */
		    createPanaxWindow: function(record_id) {

				Ext.suspendLayouts();

	            /*
	            Add Panax Component
	             */
				this.panaxWindow = Ext.create('Panax.view.PanaxWindow', {
					title: ("<xsl:value-of select="@mode "/>" === "readonly") ? "Ver" : (record_id ? "Editar" : "Nuevo"),
					items: [
						Panax.core.PanaxComponent.getComponent({
							prefix: "Cache.app",
							dbId: "<xsl:value-of select="@dbId "/>",
							lang: "<xsl:value-of select="@xml:lang "/>",
							catalogName: "<xsl:value-of select="@Table_Schema "/>.<xsl:value-of select="@Table_Name "/>",
							mode: ("<xsl:value-of select="@mode "/>" === "readonly") ? "readonly" : (record_id ? "edit" : "insert"),
							controlType: "formView"
			            }, {
			                idValue: record_id ? record_id : null
			            })
					]
				});

	           	this.panaxWindow.show();

	           	Ext.resumeLayouts(true);
		    },

		    /**
		     * Edit record
		     * @param  {Object} button Clicked button
		     */
			onEditRecordClick: function(button) {
				var record = button.dataViewRecord ? button.dataViewRecord : button.getWidgetRecord();
				this.createPanaxWindow(record.data.id);
			},

			/**
			 * Add record
			 */
		    onAddRecordClick: function() {
		   		this.createPanaxWindow(null);
		    },

		    /**
		     * Remove record
		     */
		    onRemoveRecordClick: function() {
				var panaxformGrid = this.getView(),
					selection = panaxformGrid.getSelectionModel().getSelection()[0];

				selection.drop();
		    },

		    /**
		     * Refresh store
		     */
			onRefreshClick: function() {
				var panaxformGrid = this.getView(),
					store = panaxformGrid.getStore();

				store.reload();
			},

			/**
			 * Clear filters
			 */
		    onClearFiltersClick: function () {
		        // The "filters" property is added to the grid by gridfilters plugin
		        this.getView().filters.clearFilters();
		    },

		    /**
		     * Toggle Summary Row
		     * @param  {Object} widget Object that fired the event
		     * @param  {[type]} opts   [description]
		     */
		    onToggleSummary: function(item, e) {
		    	var grid = this.getView(),
		    		summaryBar = grid.getDockedItems('component[itemId=summaryBar]')[0];

		    	if(item.summaryType) {
		    		grid.viewConfig.summary.show = true;
		    		summaryBar.setVisible(true);
		    	} else {
		    		grid.viewConfig.summary.show = false;
		    		summaryBar.setVisible(false);
		    	}
		    },

		    /**
		     * Toggle Paging Toolbar
		     * @param  {Object} widget Object that fired the event
		     * @param  {[type]} opts   [description]
		     */
		    onTogglePagingToolbar: function(item, e) {
		    	var grid = this.getView(),
		    		store = grid.getStore(),
		    		pagingToolbar = grid.getDockedItems('component[reference=pagingtoolbar]')[0];

		    	if(item.pageSize) {
		    		pagingToolbar.show();
		    	} else {
		    		pagingToolbar.hide();
		    	}
		    	
	    		store.setPageSize(item.pageSize);
	    		store.reload();
		    },

		    /**
		     * Init
		     */
            init: function() {

            }
		});
	</xsl:template>

	<xsl:template match="*[@controlType='gridView' or @controlType='cardView']" mode="Viewmodel">		
	    stores: {
	    	panax_record: {
	    		model: '<xsl:apply-templates select="." mode="modelName"/>',
	    		autoLoad: false,
	    		autoSync: false,
	    		autoDestroy: true,
	    		session: true,
	    		pageSize: 10,
	    		remoteFilter: true
	    	}
	    }
	</xsl:template>

	<xsl:template match="*[@controlType='gridView' and @mode!='filters']" mode="PanaxPanel.MainControl">
	{
        xtype: 'panaxgrid',
        flex: 1,
	    controller: '<xsl:apply-templates select="." mode="modelName"/>',
        bind: '{panax_record<xsl:apply-templates select="." mode="storeBind"/>}',
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
        		show: true,
        		store: '{panax_record<xsl:apply-templates select="." mode="storeBind"/>}'
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