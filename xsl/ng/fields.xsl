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
		foreignKey Fields
		(not: radios)
		(yes: cascaded)
		ToDo: Refactor & clean repeated code blow
	-->

	<xsl:template match="*[@dataType='foreignKey' and (@controlType='default' or @controlType='combobox')]" mode="fields.field">
		<xsl:variable name="child" select="*[1]" />
    <!-- {
      "template": "<div><strong><xsl:value-of select="@headerText"/></strong></div>"
    }, -->
		{
			"className": "display-flex",
			"fieldGroup": [
			<xsl:apply-templates select="$child/*[1]" mode="fields.cascaded" />
			{
				"className": "flex-1",
				"key": "<xsl:value-of select="name()"/>",
				"type": "async_select",
				"templateOptions": {
					"options": [],
					"params": {
						"catalogName": "<xsl:value-of select="$child/@Table_Schema"/>.<xsl:value-of select="$child/@Table_Name"/>",
						<xsl:if test="$child/@foreignKey!='' and $child/@foreignValue!=''">
							"filters": "'<xsl:value-of select="$child/@foreignKey"/>=<xsl:value-of select="$child/@foreignValue"/>'",
						</xsl:if>
						"valueColumn": "<xsl:value-of select="$child/@dataValue"/>",
						"textColumn": "<xsl:value-of select="$child/@dataText"/>"
					},
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
			}]
		}
	</xsl:template>

	<xsl:template match="*" mode="fields.cascaded">
		<xsl:apply-templates select="*[1]" mode="fields.cascaded" />
		{
			"className": "flex-1",
			"key": "<xsl:value-of select="name()"/>",
			"type": "async_select",
			"templateOptions": {
				"options": [],
				"params": {
					"catalogName": "<xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/>",
					<xsl:if test="@foreignKey!='' and @foreignValue!=''">
						"filters": "'<xsl:value-of select="$child/@foreignKey"/>=<xsl:value-of select="$child/@foreignValue"/>'",
					</xsl:if>
					"valueColumn": "<xsl:value-of select="@dataValue"/>",
					"textColumn": "<xsl:value-of select="@dataText"/>"
				},
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

</xsl:stylesheet>