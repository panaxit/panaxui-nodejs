<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">

	<!-- NOT IMPLEMENTED -->
	<xsl:template match="*" mode="formView.control">
		fieldLabel: '<xsl:value-of select="@fieldName"/>',
		xtype: 'displayfield',
        value: '<strong>NOT IMPLEMENTED</strong>: dataType:<xsl:value-of select="@dataType"/>, controlType:<xsl:value-of select="@controlType"/>, length:<xsl:value-of select="@length"/>'
	</xsl:template>

	<!-- READONLY -->
	<xsl:template name="control.readOnly">
		<xsl:if test="/*[1]/@mode='readonly' or @mode='readonly'">
			, readOnly: true
			//xtype: displayfield
		</xsl:if>
	</xsl:template>

	<!-- DISABLED -->
	<xsl:template name="control.disabled">
		<xsl:if test="/*[1]/@mode='readonly' or @mode='readonly'">
			, disabled: true
		</xsl:if>
	</xsl:template>

	<!-- MAX LENGTH -->
	<xsl:template name="control.maxLength">
		<xsl:if test="@length and (@length&gt;0)">
			, maxLength: <xsl:value-of select="@length"/>
			, enforceMaxLength: true
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>