<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:px="urn:panax"
	>

	<!-- 
		Form Field Types (standard)
		https://github.com/Textalk/angular-schema-form/blob/development/docs/index.md#form-types
	-->

	<!-- default -->
	<xsl:template mode="form.field.type" match="*[ 
		(@controlType='default')
		]">
		<xsl:text>default</xsl:text>
	</xsl:template>

	<!-- text					input with type text -->
	<xsl:template mode="form.field.type" match="*[ 
		(@controlType='default' or @controlType='email') and 
		(@dataType='varchar' or @dataType='nvarchar' or @dataType='nchar' or @dataType='char') and 
		(not(@length) or @length&lt;=255)
		]">
		<xsl:text>text</xsl:text>
	</xsl:template>

	<!-- textarea			a textarea -->
	<xsl:template mode="form.field.type" match="*[ 
		(@controlType='default' or @controlType='email') and 
		(@dataType='nvarchar' or @dataType='nchar' or @dataType='text') and 
		(@length&gt;255) ]">
		<xsl:text>textarea</xsl:text>
	</xsl:template>

	<!-- number				input type number -->
	<xsl:template mode="form.field.type" match="*[ 
		(@controlType='default') and
		(@dataType='int' or @dataType='tinyint' or @dataType='money' or @dataType='float') 
		]">
		<xsl:text>number</xsl:text>
	</xsl:template>

	<!-- password			input type password -->
	<xsl:template mode="form.field.type" match="*[ 
		@controlType='password'
		]">
		<xsl:text>password</xsl:text>
	</xsl:template>

	<!-- checkbox			a checkbox -->
	<xsl:template mode="form.field.type" match="*[ 
		(@controlType='default') and
		(@dataType='bit') 
		]">
		<xsl:text>checkbox</xsl:text>
	</xsl:template>

	<!-- radiobuttons	radio buttons with bootstrap buttons -->
	<xsl:template mode="form.field.type" match="*[ 
		(@controlType='radiogroup') and
		(@dataType='foreignKey') 
		]">
		<xsl:text>radiobuttons</xsl:text>
	</xsl:template>

	<!-- ToDo: -->

	<!-- fieldset			a fieldset with legend -->

	<!-- section			just a div -->

	<!-- actions			horizontal button list, can only submit and buttons as items -->

	<!-- submit				a submit button -->

	<!-- button				a button -->

	<!-- radios				radio buttons -->

	<!-- radio				inline	radio buttons in one line -->

	<!-- help					insert arbitrary html -->

	<!-- tab					tabs with content -->

	<!-- array				a list you can add, remove and reorder -->

	<!-- tabarray			a tabbed version of array -->

	<!-- checkboxes		list of checkboxes -->

	<!-- 
		Third Party
		http://textalk.github.io/angular-schema-form/#third-party-addons 
	-->

	<!-- uiselect `insteadof` select				a select (single value) -->
	<!-- https://github.com/networknt/angular-schema-form-ui-select -->
	<xsl:template mode="form.field.type" match="*[ 
		(@controlType='default' or @controlType='combobox') and
		(@dataType='foreignKey') 
		]">
		<xsl:text>uiselect</xsl:text>
	</xsl:template>

	<!-- 
		ToDo:
			date
			time
			datetime
			color
			file
			picture
			junctionTable
				grid
				multiselector

	 -->

</xsl:stylesheet>