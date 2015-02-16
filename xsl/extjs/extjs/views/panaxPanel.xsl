<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:str="http://exslt.org/str"
	extension-element-prefixes="str"
>
	<!-- First  table is the main panel-->
	<xsl:template match="*[1]" mode="PanaxPanel.MainPanel">
		/*************************
		 * PANAX MODELS
		 *************************/
		<xsl:apply-templates select="." mode="Model"/>

		/*************************
		 * PANAX VIEWCONTROLLERS
		 *************************/
		<xsl:apply-templates select="." mode="PanaxPanel.Viewcontroller"/>
		<xsl:apply-templates select="." mode="Viewcontroller"/>
		<xsl:apply-templates select="//*[@dataType='foreignTable' and @relationshipType='hasMany']" mode="Viewcontroller"/>

		/*************************
		 * PANAX MAIN-PANEL VIEW
		 *************************/
		Ext.define('Cache.app.<xsl:apply-templates select="." mode="modelName"/>', {
		    extend: 'Panax.view.PanaxPanel',
		    viewModel: {
		        <xsl:apply-templates select="." mode="Viewmodel"/>
		    },
		    controller: 'panaxpanel.<xsl:apply-templates select="." mode="modelName"/>',
		    // Create a session for this view
		    session: true,
		    config: {
		    	showStatusBar: ("<xsl:value-of select="@mode"/>"!="filters")?true:false,
		    	mode: '<xsl:value-of select="@mode"/>'
		    },
		    items: [
		    	<xsl:apply-templates select="." mode="PanaxPanel.MainControl"/>
		    ]
		});
	</xsl:template>

	<xsl:template match="*" mode="PanaxPanel.Viewcontroller">
		/**
		 * 
		 * [ViewController]: Main-Panel
		 * 
		 */
		Ext.define('Panax.viewcontroller.PanaxPanel.<xsl:apply-templates select="." mode="modelName"/>', {
		    extend: 'Ext.app.ViewController',
		    alias: 'controller.panaxpanel.<xsl:apply-templates select="." mode="modelName"/>',

		    /**
		     * Init
		     */
			init: function() {
				var multiStore = this.getStore("panax_record"),
					singleStore = this.getStore("panax_store"),
					view = this.getView(),
					idValue = view.config.idValue,
					filters = view.config.filters;

		    	/**
		    	 * Manually load store
		    	 */
		    	if(singleStore) { // formView
			    	if(idValue) {
						singleStore.load({ 
							params: { 
								filters: "[<xsl:value-of select="@identityKey"/>]="+idValue 
								// A.K.A. id: idValue
							}
						});
				    } else {
				    	// No record to load in store
				    	// Phantom record instead
				    }
		    	} else if(multiStore) { // gridView
					if (filters) {
						// OPEN BUG: http://www.sencha.com/forum/showthread.php?292780-5.0.1-Remote-filters-in-combo-with-gridfilter-plugin-ignores-autoLoad-false
						multiStore.load({
							params: {
								filters: filters
							}
						});
					} else {
						multiStore.load();
					}
		    	}

				/** ToDo: Catch listeners inline
			    	this.getStore("panax_record").on({
		                load: function(me, records, successful, eOpts) { 
		                    var response=Ext.JSON.decode(eOpts.getResponse().responseText); 
		                    if(successful) {
		                        if (response.callback) {
		                            response.callback();
		                        } else {
		                            if (response.message) {
		                                Ext.MessageBox.show({
		                                    title: 'MENSAJE DEL SISTEMA',
		                                    msg: response.message,
		                                    icon: Ext.MessageBox.INFO,
		                                    buttons: Ext.Msg.OK
		                                });
		                            }
		                        }
		                    } else {
		                        Ext.Msg.alert("Error de comunicación", "La conexión con el servidor falló, favor de intentarlo nuevamente en unos segundos.");
		                    }
		                },
		                write: function( store, operation, eOpts ) { 
		                    var response=Ext.JSON.decode(operation.getResponse().responseText); 
	                        if (response.callback) {
	                            response.callback();
	                        } else {
	                            if (response.message) {
	                                Ext.MessageBox.show({
	                                    title: 'MENSAJE DEL SISTEMA',
	                                    msg: response.message,
	                                    icon: Ext.MessageBox.INFO,
	                                    buttons: Ext.Msg.OK
	                                });
	                            }
	                        }
		                }
		                // update: function( me, record, operation, modifiedFieldNames, details, eOpts ) {
		                //     alert("update"); 	
		                // },
		                // remove: function( store, records, index, isMove, eOpts ) {
		                // 	alert("remove"); 	
		                // }
			    	});
			    **/
			},

		    /**
		     * Persist record(s)
		     */
			onSave: function() {
				var me = this,
					store = this.getStore("panax_record") || this.getStore("panax_store"),
					session = store.getSession(),
					changes = session.getChanges(),
					entityName = store.model.entityName,
					sMsg = "Cambios a realizar: <br/><br/>",
					iDel = 0;

				if (changes === null) {
					Ext.Msg.alert('No hay cambios', 'No se han realizado cambios');
				} else {

					if (changes[entityName] &amp;&amp; changes[entityName]["D"]) {
						iDel = changes[entityName]["D"].length;
						sMsg += "Se van a Borrar " + iDel + " registros<br/>"
					}

					Ext.Msg.show({
						title: 'Guardar Cambios?',
						message: sMsg,
						buttons: Ext.Msg.YESNO,
						icon: Ext.Msg.QUESTION,
						fn: function(btn) {
							if (btn === 'yes') {
								//ToDo: Session batch not persisting?
								session.getSaveBatch().start();
								//store.sync(); //Set AutoSync?
								store.reload(); //Set AutoSync?
							} else {}
						}
					});
				}
			},

		    /**
		     * Get filterString and display results
		     */
		    onFilter: function() {
				var me = this, 
					store = this.getStore("panax_record") || this.getStore("panax_store"), 
					record = store.getAt(0);

				// Change Proxy's API Ajax request scripts
		   		store.getProxy().api.create = "../server/scripts/<xsl:value-of select="@mode" />.asp";
		   		store.getProxy().api.update = "../server/scripts/<xsl:value-of select="@mode" />.asp";

		   		/*
		   		Force dirty/phantom record every time.
		   		ince it never really persists.
		   		 */
		   		record.dirty = true;
		   		record.phantom = true;
		   		
		   		// Get filterString and display results in new Window
				store.update({
					records: [record],
					callback: function(records, operation, success) {
						var response = Ext.JSON.decode(operation.getResponse().responseText);
						var resultsPanel = me.getView().down('#filters_results'),
							resultsStore = resultsPanel.down('panaxgrid').getStore();

						resultsStore.reload({
							params: {
								filters: response.filters
							}
						});
					}
				});
		    },
			
			/**
			 * Debug session
			 */
			onSessionChangeClick: function() {
				var changes = this.getView().getSession().getChanges();
				if (changes !== null) {
					new Ext.window.Window({
						autoShow: true,
						title: 'Session Changes',
						modal: true,
						maximizable: true,
						width: 600,
						height: 400,
						layout: 'fit',
						items: {
							xtype: 'textarea',
							value: JSON.stringify(changes, null, 4)
						}
					});
				} else {
					Ext.Msg.alert('No hay cambios', 'No se han realizado cambios');
				}
			},

			/**
			 * Debug store
			 */
			onInspectStoreClick: function() {
				var view = this.getView(),
					viewModel = view.getViewModel(),
					store = viewModel.get('panax_record') || viewModel.get('panax_store');

				debugger;

				console.log(store.associations);
				console.log(store.getAssociatedData());
				console.log('store changes:', store.getChanges());
			},

		});
	</xsl:template>

</xsl:stylesheet>