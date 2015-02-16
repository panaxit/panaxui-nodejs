<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:str="http://exslt.org/str"
	extension-element-prefixes="str"
>

<xsl:include href="views/model.xsl" />

<xsl:include href="views/panaxPanel.xsl" />

<!-- GridView -->
<xsl:include href="views/gridView.xsl" />
<xsl:include href="gridview/column.xsl" />
<xsl:include href="gridview/column.renderer.xsl" />

<!-- CardView -->
<xsl:include href="views/cardView.xsl" />

<!-- FormView -->
<xsl:include href="views/formView.xsl" />
<xsl:include href="formView/control.xsl" />
<xsl:include href="formView/text.xsl" />
<xsl:include href="formView/checkbox.xsl" />
<xsl:include href="formView/file.xsl" />
<xsl:include href="formView/datetime.xsl" />
<xsl:include href="formView/radio.xsl" />
<xsl:include href="formView/color.xsl" />
<xsl:include href="formView/combobox.xsl" />
<xsl:include href="formView/junctionTable.xsl" />

<xsl:include href="views/formView.filters.xsl" />



	<xsl:template mode="field_id" match="*">
		<xsl:value-of select="concat('field_', name(.), '_', generate-id(.))"/>
	</xsl:template>

</xsl:stylesheet>