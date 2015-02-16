<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">

	<!-- SHORT STRINGS -->
	<xsl:template mode="formView.control" match="*[ 
		(@controlType='default' or @controlType='password' or @controlType='email') and 
		(@dataType='varchar' or @dataType='nvarchar' or @dataType='nchar' or @dataType='char') and 
		(not(@length) or @length&lt;=255) ]">
			xtype: 'textfield',
			name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>',
			emptyText: '<xsl:value-of select="@fieldName"/>',
			bind: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
			<xsl:if test="@controlType='password'">
				, inputType: 'password'
			</xsl:if>
			<xsl:if test="@controlType='email'">
				, vtype: 'email'
			</xsl:if>
			<!-- MAX LENGTH -->
			<xsl:call-template name="control.maxLength" />
			<!-- EDITABLE/READONLY -->
			<xsl:call-template name="control.readOnly" />
	</xsl:template>

	<!-- LONG STRINGS -->
	<xsl:template mode="formView.control" match="*[ 
		(@dataType='nvarchar' or @dataType='nchar' or @dataType='text') and 
		(@controlType='default') and 
		(@length&gt;255) ]">
			xtype: 'textarea',
			name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>',
			emptyText: '<xsl:value-of select="@fieldName"/>',
			bind: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
			<!-- MAX LENGTH -->
			<xsl:call-template name="control.maxLength" />
			<!-- EDITABLE/READONLY -->
			<xsl:call-template name="control.readOnly" />
	</xsl:template>

	<!-- NUMBER -->
	<xsl:template mode="formView.control" match="*[ 
		(@dataType='int' or @dataType='tinyint') and 
		(@controlType='default') ]">
			xtype: 'numberfield',
			name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>',
			emptyText: '<xsl:value-of select="@fieldName"/>',
			bind: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
			<!-- EDITABLE/READONLY -->
			<xsl:call-template name="control.readOnly" />
	</xsl:template>

	<!-- MONEY -->
	<xsl:template mode="formView.control" match="*[ 
		(@dataType='money' or @dataType='float') and
		(@controlType='default') ]">
			//xtype: 'currencyfield',
			xtype: 'numberfield',
			hideTrigger: true,
	       	allowDecimals: true,
	        decimalPrecision: 2,
			name: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>',
			emptyText: '<xsl:value-of select="@fieldName"/>',
			bind: '{panax_record.<xsl:apply-templates select="." mode="bindName"/>}'
			<!-- EDITABLE/READONLY -->
			<xsl:call-template name="control.readOnly" />
	</xsl:template>

</xsl:stylesheet>