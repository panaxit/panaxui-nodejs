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
	<xsl:template mode="fields.type" match="*">
		<xsl:text>default</xsl:text>
	</xsl:template>

	<!-- text -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default' or @controlType='email') and 
		(@dataType='varchar' or @dataType='nvarchar' or @dataType='nchar' or @dataType='char') and 
		(not(@length) or @length&lt;=255)
		]">
		<xsl:text>input</xsl:text>
	</xsl:template>

	<!-- email -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='email')
		]">
		<xsl:text>email</xsl:text>
	</xsl:template>

	<!-- password -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='password')
		]">
		<xsl:text>password</xsl:text>
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
		(@dataType='int' or @dataType='tinyint' or @dataType='float') 
		]">
		<xsl:text>number</xsl:text>
	</xsl:template>

	<!-- money -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default') and
		(@dataType='money') 
		]">
		<xsl:text>money</xsl:text>
	</xsl:template>

	<!-- password -->
	<xsl:template mode="fields.type" match="*[ 
		@controlType='password'
		]">
		<xsl:text>password</xsl:text>
	</xsl:template>

	<!-- date -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default') and
		(@dataType='date') 
		]">
		<xsl:text>date</xsl:text>
	</xsl:template>

	<!-- time -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default') and
		(@dataType='time') 
		]">
		<xsl:text>time</xsl:text>
	</xsl:template>

	<!-- datetime -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default') and
		(@dataType='datetime') 
		]">
		<xsl:text>datetime</xsl:text>
	</xsl:template>

	<!-- color -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='color')
		]">
		<xsl:text>color</xsl:text>
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

	<!-- file -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='file' or @controlType='picture')
		]">
		<xsl:text>file</xsl:text>
	</xsl:template>

	<!-- async_select -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default' or @controlType='combobox') and
		(@dataType='foreignKey') 
		]">
		<xsl:text>async_select</xsl:text>
	</xsl:template>

	<!-- ui-select -->
	<xsl:template mode="fields.type" match="*[ 
		(@controlType='default') and
		(@dataType='foreignTable') and
		(@relationshipType='hasMany')
		]">
		<xsl:text>ui-grid</xsl:text>
	</xsl:template>

	<!-- 
		ToDo:
			picture
			junctionTable
				grid
				multiselector
	 -->

</xsl:stylesheet>