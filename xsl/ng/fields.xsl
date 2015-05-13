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
		[
			<xsl:apply-templates select="px:layout//px:field" mode="fields" />
		]
	</xsl:template>

	<!-- ToDo: -->
	<!-- fieldgroup for: tabs/fieldsets	 -->
	<!-- template: arbitriary html -->

	<xsl:template match="px:field" mode="fields">
		<xsl:variable name="field" select="key('fields',@fieldId)" />
		<xsl:if test="position()&gt;1">,</xsl:if>
		{
			"key": "<xsl:value-of select="$field/@fieldName"/>",
			"type": "<xsl:apply-templates select="$field" mode="fields.type" />",
			"templateOptions": {
				<xsl:if	test="$field/@dataType='foreignKey'">
					<xsl:apply-templates select="$field" mode="fields.options" />,
				</xsl:if>
				<xsl:if	test="$field/@isIdentity='1'">
					"hide": true,
				</xsl:if>
				<xsl:if	test="$field/../../@mode='readonly'">
					"disabled": true,
				</xsl:if>
				<xsl:if	test="@isNullable!='1'">
					"required": true,
				</xsl:if>
				<xsl:if	test="@length">
					"maxLength": <xsl:value-of select="@length"/>,
				</xsl:if>
				"label": "<xsl:value-of select="$field/@headerText"/>",
				"placeholder": ""
			}
		}
	</xsl:template>

</xsl:stylesheet>