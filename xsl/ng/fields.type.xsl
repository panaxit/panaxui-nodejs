<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Fields Types
		https://github.com/formly-js/angular-formly-templates-bootstrap
	-->

	<!-- default -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default')
		]">
		<xsl:text>input</xsl:text>
	</xsl:template>

	<!-- text -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default' or @controlType='email') and 
		(@dataType='varchar' or @dataType='nvarchar' or @dataType='nchar' or @dataType='char') and 
		(not(@length) or @length&lt;=255)
		]">
		<xsl:text>input</xsl:text>
	</xsl:template>

	<!-- textarea -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default' or @controlType='email') and 
		(@dataType='nvarchar' or @dataType='nchar' or @dataType='text') and 
		(@length&gt;255) ]">
		<xsl:text>textarea</xsl:text>
	</xsl:template>

	<!-- number -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default') and
		(@dataType='int' or @dataType='tinyint' or @dataType='money' or @dataType='float') 
		]">
		<xsl:text>input</xsl:text>
	</xsl:template>

	<!-- password -->
	<xsl:template mode="fields.type" match="*[ 
		@controlType='password'
		]">
		<xsl:text>password</xsl:text>
	</xsl:template>

	<!-- checkbox -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default') and
		(@dataType='bit') 
		]">
		<xsl:text>checkbox</xsl:text>
	</xsl:template>

	<!-- radio -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='radiogroup') and
		(@dataType='foreignKey') 
		]">
		<xsl:text>radio</xsl:text>
	</xsl:template>

	<!-- select -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default' or @controlType='combobox') and
		(@dataType='foreignKey') 
		]">
		<xsl:text>async_select</xsl:text>
	</xsl:template>

	<!-- 
		Custom
		http://docs.angular-formly.com/v6.4.0/docs/custom-templates
	-->
	<!-- 
		ToDo:
			datepicker
			colorpicker
			time
			datetime
			file
			picture
			junctionTable
				grid
				multiselector

	 -->

</xsl:stylesheet>