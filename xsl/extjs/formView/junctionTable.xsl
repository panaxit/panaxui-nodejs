<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>

	<xsl:template match="*[@controlType='gridView']" mode="junctionTable.MainControl">
		<xsl:apply-templates select="." mode="junctionTable.MainControl.grid"/>
		<!-- <xsl:apply-templates select="." mode="junctionTable.MainControl.multiselector"/> -->
	</xsl:template>

	<xsl:template match="*" mode="junctionTable.MainControl.multiselector">
		<xsl:variable name="dependant" select="px:fields/*[@dataType!='junctionTable' and @dataType!='foreignTable' and @isIdentity!=1][1]"/>

		xtype: 'multiselector',
		bind: '{panax_record<xsl:apply-templates select="." mode="storeBind"/>}',
        title: 'Multiselector',
        fieldName: '<xsl:value-of select="translate($dependant/@fieldName, $uppercase, $smallcase)"/>',
        fieldTitle: '<xsl:value-of select="$dependant/@headerText"/>',
        viewConfig: {
            deferEmptyText: false,
            emptyText: 'Sin seleccion'
        },
        search: {
            field: '<xsl:value-of select="translate($dependant/@fieldName, $uppercase, $smallcase)"/>',
            store: {
                model: 'Panax.model.<xsl:apply-templates select="$dependant" mode="modelName"/>',
                sorters: '<xsl:value-of select="translate($dependant/@fieldName, $uppercase, $smallcase)"/>'
            }
        }
	</xsl:template>

	<xsl:template match="*" mode="junctionTable.MainControl.grid">
        xtype: 'gridpanel',
	    //controller: '<xsl:apply-templates select="." mode="modelName"/>',
        bind: '{panax_record<xsl:apply-templates select="." mode="storeBind"/>}',
        // selType: 'checkboxmodel',
        // mode: 'MULTI',
        // allowDeselect: true,
        // checkOnly: true,
		multiSelect: true,
        height: 150,
        flex: 1,
        border: true,
        autoShow: true,
        autoRender: true,
    	listeners: {
    		beforereconfigure: function(me, store, columns, oldStore, oldColumns, eOpts) {
				if(!store) {
					store = oldStore;
				}
				store.each(function(record) {
					if(record.dirty) {				//MODFICADO
						if(!record.data.checked) {		// A FALSO
							record.dropped = true;			// SI BORRAR
							record.phantom = true;			// SI PERSISTIR
						} else {						// A VERDADERO
							record.dropped = false;			// NO BORRAR
							record.phantom = true;			// SI PERSISTIR
						}
					} else {						// NO MODIFICADO
						record.dropped = false;			// NO BORRAR
						record.phantom = false;			// NO PERSISTIR
					}
				}); 
    		}
    	},
        columns: [
	        {
	            xtype: 'checkcolumn',
                dataIndex: 'checked',
	            width: 44,
            	stopSelection: false,
            	listeners: {
            		checkchange: function(me, rowIndex, checked, eOpts) {
            			me.up('gridpanel').reconfigure();
            		}
            	}
	        },
		    <!-- ToDo: Columns order based on px:layout, not px:fields -->
 			<xsl:apply-templates select="px:fields/*[@dataType!='junctionTable' and @dataType!='foreignTable' and @isIdentity!=1]" mode="gridView.column"/>
        ]
	</xsl:template>

</xsl:stylesheet>