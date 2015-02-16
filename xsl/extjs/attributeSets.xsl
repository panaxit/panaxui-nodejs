<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
>

<xsl:template match="*" mode="dataField.defaults">
	
</xsl:template >

<xsl:attribute-set name="dataTable.Default">
	<xsl:attribute name="mode"><xsl:value-of select="@mode"/></xsl:attribute>
	<xsl:attribute name="id"><xsl:value-of select="@Table_Name"/>_<xsl:value-of select="generate-id(.)"/></xsl:attribute>
	<xsl:attribute name="db_table_name"><xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/></xsl:attribute>
	<xsl:attribute name="db_identity_key"><xsl:value-of select="@identityKey"/></xsl:attribute>
	<xsl:attribute name="db_primary_key"><xsl:value-of select="@primaryKey"/></xsl:attribute>
<!-- 	<xsl:attribute name="ondblclick">
    	<xsl:choose>
		    <xsl:when test="@mode='filters'">showModal(escapeHTML(createFilterXML()));</xsl:when>
		    <xsl:otherwise>showModal(escapeHTML(createUpdateXML()));</xsl:otherwise>
	    </xsl:choose>
	</xsl:attribute> -->
</xsl:attribute-set>

<xsl:attribute-set name="dataField">
  <xsl:attribute name="isSubmitable">false</xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="gridView.datatable.tr">
	<xsl:attribute name="onmouseover">$(this).addClass('highlight')</xsl:attribute>
	<xsl:attribute name="onmouseout">$(this).removeClass('highlight')</xsl:attribute>
	<xsl:attribute name="class">dataRow <xsl:if test="@rowNumber mod 2 = 1">alt</xsl:if></xsl:attribute>
	<xsl:attribute name="id"><xsl:value-of select="ancestor::*[@dataType='table'][1]/@Table_Name"/>_<xsl:value-of select="generate-id(.)"/></xsl:attribute>
	<xsl:attribute name="db_identity_value"><xsl:choose><xsl:when test="@identity!=''"><xsl:value-of select="@identity"/></xsl:when><xsl:otherwise>NULL</xsl:otherwise></xsl:choose></xsl:attribute>
	<xsl:attribute name="db_primary_value"><xsl:choose><xsl:when test="@primaryValue!=''"><xsl:value-of select="@primaryValue"/></xsl:when><xsl:otherwise>NULL</xsl:otherwise></xsl:choose></xsl:attribute>

</xsl:attribute-set>

<xsl:attribute-set name="gridView.datatable.table">
	<xsl:attribute name="class">dataTable gridView Table_<xsl:value-of select="@Table_Name"/></xsl:attribute>
	<xsl:attribute name="mode"><xsl:value-of select="@mode"/></xsl:attribute>
	<xsl:attribute name="id"><xsl:value-of select="@Table_Name"/>_<xsl:value-of select="generate-id(.)"/></xsl:attribute>
	<xsl:attribute name="primary_table"><xsl:if test="ancestor-or-self::*[@dataType='table'][2]"><xsl:value-of select="ancestor-or-self::*[@dataType='table'][2]/@Table_Name"/>_<xsl:value-of select="generate-id(ancestor-or-self::*[@dataType='table'][2])"/></xsl:if></xsl:attribute>
	<xsl:attribute name="db_table_name"><xsl:value-of select="@Table_Schema"/>.<xsl:value-of select="@Table_Name"/></xsl:attribute>
	<xsl:attribute name="db_identity_key"><xsl:value-of select="@identityKey"/></xsl:attribute>
	<xsl:attribute name="db_primary_key"><xsl:value-of select="@primaryKey"/></xsl:attribute>
	<xsl:attribute name="db_foreign_key"><xsl:if test="../@foreignReference!=''"><xsl:value-of select="../@foreignReference"/></xsl:if></xsl:attribute>
	<xsl:attribute name="rules">groups</xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="formView.datatable.table" use-attribute-sets="gridView.datatable.table">
	<xsl:attribute name="class">dataTable formView Table_<xsl:value-of select="@Table_Name"/></xsl:attribute>
	<xsl:attribute name="rules"></xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="query.parameters">
          <xsl:attribute name="catalogName"><xsl:value-of select="@Table_Name"/></xsl:attribute>
          <xsl:attribute name="pageIndex">DEFAULT</xsl:attribute>
          <xsl:attribute name="pageSize">DEFAULT</xsl:attribute>
          <xsl:attribute name="viewMode">DEFAULT</xsl:attribute>
          <xsl:attribute name="mode">DEFAULT</xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="gridView.datatable.table.tbodyGroup">
	<xsl:attribute name="class">data<xsl:choose>
	<xsl:when test="@headerText"> Group_<xsl:value-of select="@tableGroup"/></xsl:when>
	<xsl:when test="*/@groupByColumn"> Group_<xsl:call-template name="replace">
		<xsl:with-param name="inputString" select="*[@groupByColumn='true']/@value"/>
		<xsl:with-param name="searchText" select="' '"/>
		<xsl:with-param name="replaceBy">_</xsl:with-param></xsl:call-template></xsl:when>
	<xsl:otherwise></xsl:otherwise>
</xsl:choose>
	</xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="datePicker.calendar">
  <xsl:attribute name="src">../../../../Images/Controls/Calendar/calendar.png</xsl:attribute>
  <xsl:attribute name="class">datePicker</xsl:attribute>
  <xsl:attribute name="width">16</xsl:attribute>
  <xsl:attribute name="alt">Escoge una fecha</xsl:attribute>
<xsl:attribute name="onclick">displayCalendar(document.all[this.sourceIndex-1],'dd/mm/yyyy',this)</xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="attachment" use-attribute-sets="imageButton">
	<xsl:attribute name="class">uploader</xsl:attribute>
	<xsl:attribute name="height">20</xsl:attribute>
	<xsl:attribute name="width">20</xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="imageButton">
	<xsl:attribute name="class">imageButton</xsl:attribute>
	<xsl:attribute name="height">25</xsl:attribute> 
	<xsl:attribute name="width">25</xsl:attribute> 
	<xsl:attribute name="enabled">true</xsl:attribute> 
	<xsl:attribute name="oncontextmenu">return false;</xsl:attribute>
	<xsl:attribute name="src">../../../../Images/Buttons/btn_Empty.png</xsl:attribute> 
</xsl:attribute-set>

<xsl:attribute-set name="commandButton" use-attribute-sets="imageButton">
	<xsl:attribute name="class">commandButton</xsl:attribute>
	<xsl:attribute name="catalogName"><xsl:value-of select="concat(ancestor-or-self::*[@dataType='table'][1]/@Table_Schema, '.', ancestor-or-self::*[@dataType='table'][1]/@Table_Name)"/></xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="commandButtons.insert" use-attribute-sets="commandButton">
	<xsl:attribute name="command">insert</xsl:attribute>
	<xsl:attribute name="width">18</xsl:attribute>
	<xsl:attribute name="src">../../../../Images/Buttons/btn_Insert.png</xsl:attribute> 
	<xsl:attribute name="alt">Nuevo registro</xsl:attribute> 
	<xsl:attribute name="viewMode">DEFAULT</xsl:attribute>
	<xsl:attribute name="fullPath"><xsl:value-of select="/*/@fullPath"/></xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="commandButtons.edit" use-attribute-sets="commandButton">
	<xsl:attribute name="command">edit</xsl:attribute>
	<xsl:attribute name="width">18</xsl:attribute>
	<xsl:attribute name="src">../../../../Images/Buttons/btn_Edit.png</xsl:attribute> 
	<xsl:attribute name="alt">Editar registro</xsl:attribute> 
	<xsl:attribute name="viewMode">DEFAULT</xsl:attribute>
	<xsl:attribute name="fullPath"><xsl:value-of select="/*/@fullPath"/></xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="commandButtons.delete" use-attribute-sets="commandButton">
	<xsl:attribute name="command">delete</xsl:attribute>
	<xsl:attribute name="width">18</xsl:attribute>
	<xsl:attribute name="src">../../../../Images/Buttons/btn_Delete.png</xsl:attribute> 
	<xsl:attribute name="alt">Borrar registro</xsl:attribute> 
	<xsl:attribute name="viewMode">DEFAULT</xsl:attribute>
</xsl:attribute-set>

<xsl:attribute-set name="login.logo">
	<xsl:attribute name="src">../../../../Images/Logos/logo.gif</xsl:attribute> 
	<xsl:attribute name="height">80</xsl:attribute> 
</xsl:attribute-set>

<xsl:attribute-set name="buttons.button">
	<xsl:attribute name="class">Button</xsl:attribute>
	<xsl:attribute name="width">26</xsl:attribute>
	<xsl:attribute name="height">26</xsl:attribute>
	<xsl:attribute name="standByOpacity">100</xsl:attribute>
</xsl:attribute-set>

</xsl:stylesheet>