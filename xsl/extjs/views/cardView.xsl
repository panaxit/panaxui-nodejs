<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>

	<xsl:template match="*[@controlType='cardView']" mode="PanaxPanel.MainControl">
	{
		xtype: 'dataview-multisort',
	    controller: '<xsl:apply-templates select="." mode="modelName"/>',
        items: [
 			{
	            xtype: 'dataview-multisort-items',
	            bind: {
	            	store: '{panax_record<xsl:apply-templates select="." mode="storeBind"/>}'
	            },
	            listeners: {
	            	refresh: function(me, eOpts) {
		                var records = me.store.data.items;

		                for(var i = 0; i &lt; records.length; i++){

		                	var record = records[i],
		                    	data = Ext.Object.merge(record.getData(), record.getAssociatedData()),
			                    renderTo = me.getEl().select('#dataview-multisort-item-' + data.id).elements[0];

		                    var button1 = new Ext.ComponentMgr.create({
		                        xtype: 'panel',
		                        layout: {
		                        	type: 'hbox',
		                        	align: 'stretch'
	                        	},
		                        renderTo: renderTo,
							    title: <xsl:call-template name="cardView.data.field"><xsl:with-param name="field" select="@titleField" /></xsl:call-template>,
		                        width: "100%",
		                        height: "100%",
		                        border: false,
							    items: [{
							    	xtype: 'image',
							    	flex: 4,
							    	src: "/SINCO/FilesRepository/Test/" + <xsl:call-template name="cardView.data.field"><xsl:with-param name="field" select="@iconField" /></xsl:call-template>,
							    	border: false
							    }, {
							    	xtype: 'component',
							    	flex: 7,
							    	margin: 8,
							    	// ToDo: Fix (escape) Security hole: Code Injection
							    	html: <xsl:call-template name="cardView.data.field"><xsl:with-param name="field" select="@descriptionField" /></xsl:call-template>
							    }],
							    buttons: [{
							        dataViewRecord: records[i],
							        handler: 'onEditRecordClick',
							        scope: me.up('dataview-multisort').getController(),
					                <xsl:choose>
						                <xsl:when test="/*[1]/@mode='readonly' or @mode='readonly'">
						                    glyph: 105, //Readonly
							        		text: 'Ver',
						                </xsl:when>
						                <xsl:otherwise>
						                    glyph: 47, //Edit
							        		text: 'Editar',
						                </xsl:otherwise>
					                </xsl:choose>
							    }]
		                    });
		                }
	            	}
	            }
 			}
        ],
		tbar: {
			//autoScroll: true,
            items: [{
                xtype: 'tbtext',
                text: 'Ordenar:',
                reorderable: false
            }, {
				<xsl:call-template name="cardView.selectedFields"/>
            }]
        }
	}
	</xsl:template>

    <xsl:template name="cardView.selectedFields">
    	<xsl:variable name="limit" select="10"/>
		<xsl:for-each select="px:layout//px:field[key('fields', @fieldId)/@dataType!='junctionTable' and key('fields', @fieldId)/@dataType!='foreignTable'][position()&lt;=$limit]">
			<xsl:variable name="item" select="key('fields', @fieldId)"/>
			<xsl:if test="position()&gt;1">}, {</xsl:if>
			dataIndex: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)" />'
			, text: '<xsl:value-of select="$item/@headerText" />'
		</xsl:for-each>
    </xsl:template>

    <xsl:template name="cardView.data.field">
    	<xsl:param name="field" />
    	<xsl:variable name="value" select="translate($field, $uppercase, $smallcase)" />
    	<xsl:choose>
	    	<xsl:when test="$value!=''">data.<xsl:value-of select="$value" /></xsl:when>
	    	<xsl:otherwise>undefined</xsl:otherwise>
    	</xsl:choose>
    </xsl:template>

</xsl:stylesheet>