<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Fields includes
	-->
	<xsl:include href="fields.type.xsl" />
	<xsl:include href="fields.options.xsl" />

	<!-- 
		Fields (px:layout + px:fields)
	-->

	<xsl:template match="*" mode="fields">
		"fields": [
			<xsl:apply-templates select="px:field" mode="fields" />
		]
	</xsl:template>

	<!-- ToDo: -->
	<!-- template: arbitriary html -->

	<xsl:template match="px:field" mode="fields">
		<xsl:if test="position()&gt;1">,</xsl:if>
		<xsl:apply-templates select="key('fields',@fieldId)" mode="fields.field" />
	</xsl:template>

	<!-- 
		Regular Fields
	-->

	<xsl:template match="*" mode="fields.field">
		{
			"className": "flex-1",
			"key": "<xsl:value-of select="@fieldName"/>",
			"type": "<xsl:apply-templates select="." mode="fields.type" />",
			"templateOptions": {
				<xsl:if	test="@dataType='foreignKey'">
					<xsl:apply-templates select="." mode="fields.options" />,
				</xsl:if>
				<xsl:if	test="@isIdentity='1'">
					"hide": true,
				</xsl:if>
				<xsl:if	test="/*[1]/@mode='readonly'">
					"disabled": true,
				</xsl:if>
				<xsl:if	test="@isNullable!='1'">
					"required": true,
				</xsl:if>
				<xsl:if	test="@defaultValue">
					"defaultValue": "<xsl:value-of select="@defaultValue"/>",
				</xsl:if>
				<xsl:if	test="@length">
					"maxLength": <xsl:value-of select="@length"/>,
				</xsl:if>
				"label": "<xsl:value-of select="@headerText"/>",
				"placeholder": ""
			},
			"data": {
			}
		}
	</xsl:template>

	<!-- 
		ToDo: Improve shared code & refactor transformations below 
	-->

	<!-- 
		foreignKey Fields
		(not: radios)
		(yes: select + cascaded)
	-->

	<xsl:template match="*[
			@dataType='foreignKey' and 
			(@controlType='default' or @controlType='combobox')]" mode="fields.field">
		<xsl:variable name="child" select="*[1]" />
		<xsl:variable name="data" select="key('data',@fieldId)/*[1]" />
    {
      "template": "<div><strong><xsl:value-of select="@headerText"/></strong></div>"
    },
		{
			"className": "display-flex",
			<!-- "templateOptions": {
				"label": "<xsl:value-of select="@headerText"/>"
			}, -->
			"fieldGroup": [
			<xsl:apply-templates select="$child/*[1]" mode="fields.cascaded">
				<xsl:with-param name="data" select="$data/*[1]" />
			</xsl:apply-templates>
			{
				"className": "flex-1",
				"key": "<xsl:value-of select="name()"/>",
				"type": "async_select",
				"templateOptions": {
					<xsl:apply-templates select="." mode="fields.options">
						<xsl:with-param name="data" select="$data" />
					</xsl:apply-templates>,
					<xsl:if	test="@isIdentity='1'">
						"hide": true,
					</xsl:if>
					<xsl:if	test="/*[1]/@mode='readonly'">
						"disabled": true,
					</xsl:if>
					<xsl:if	test="@isNullable!='1'">
						"required": true,
					</xsl:if>
					<xsl:if	test="@defaultValue">
						"defaultValue": "<xsl:value-of select="@defaultValue"/>",
					</xsl:if>
					<xsl:if	test="@length">
						"maxLength": <xsl:value-of select="@length"/>,
					</xsl:if>
					"label": "<xsl:value-of select="$child/@headerText"/>",
					"placeholder": ""
				}
			}]
		}
	</xsl:template>

	<xsl:template match="*" mode="fields.cascaded">
		<xsl:param name="data" />
		<xsl:apply-templates select="*[1]" mode="fields.cascaded">
			<xsl:with-param name="data" select="$data/*[1]" />
		</xsl:apply-templates>
		{
			"className": "flex-1",
			"key": "<xsl:value-of select="name()"/>",
			"type": "async_select",
			<!-- 
				formState as model tells angular-formly to treat the field only as ui support,
				not part of regular model
				https://github.com/formly-js/angular-formly/issues/299 
			-->
			"model": "formState",
			"templateOptions": {
				<xsl:apply-templates select="." mode="fields.options">
					<xsl:with-param name="data" select="$data" />
				</xsl:apply-templates>,
				<xsl:if	test="@isIdentity='1'">
					"hide": true,
				</xsl:if>
				<xsl:if	test="/*[1]/@mode='readonly'">
					"disabled": true,
				</xsl:if>
				<xsl:if	test="@isNullable!='1'">
					"required": true,
				</xsl:if>
				<xsl:if	test="@defaultValue">
					"defaultValue": "<xsl:value-of select="@defaultValue"/>",
				</xsl:if>
				<xsl:if	test="@length">
					"maxLength": <xsl:value-of select="@length"/>,
				</xsl:if>
				"label": "<xsl:value-of select="@headerText"/>",
				"placeholder": ""
			}
		},
	</xsl:template>

	<!-- 
		foreignTable (hasOne) 
	-->

	<xsl:template match="*[@dataType='foreignTable' and @relationshipType='hasOne']" mode="fields.field">
    {
      "template": "<strong><xsl:value-of select="@headerText"/></strong>"
    },
		{
			"className": "px-foreignTable panel panel-default panel-body display-flex",
			<!-- "model": "model.<xsl:value-of select="@fieldName"/>", -->
			"key": "<xsl:value-of select="@fieldName"/>",
			"fieldGroup": [
				<xsl:apply-templates select="*[1]/px:layout/*" mode="fields" />
			]
		}
	</xsl:template>

	<!-- 
		foreignTable (hasMany) 
	-->

	<xsl:template match="*[@dataType='foreignTable' and @relationshipType='hasMany']" mode="fields.field">
		{
			"className": "flex-1",
			"key": "<xsl:value-of select="@fieldName"/>",
			"type": "<xsl:apply-templates select="." mode="fields.type" />",
			"templateOptions": {
				"label": "<xsl:value-of select="@headerText"/>",
				"placeholder": ""
			}
		}
	</xsl:template>

</xsl:stylesheet>