<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:px="urn:panax"
    xmlns:str="http://exslt.org/strings"
	xmlns="http://www.w3.org/TR/xhtml1/strict"
	exclude-result-prefixes="px">
	<xsl:strip-space elements="*"/>
	
	<xsl:template match="*" mode="gridView.column">
		<xsl:if test="position()&gt;1">,</xsl:if>
    	{
		dataIndex: '<xsl:value-of select="translate(@fieldName, $uppercase, $smallcase)"/>',
        flex: 1,
        text: '<xsl:value-of select="@headerText"/>',
		// bind: {
		// 	data: '{<xsl:apply-templates select="." mode="bindName"/>}'
		// },
		renderer: function (value, metaData) { 
			<xsl:apply-templates select="." mode="gridView.column.renderer"/>
		},
		<xsl:if test="@dataType='float' or @dataType='money' or @dataType='smallmoney' or @dataType='float' or @dataType='decimal' or @dataType='identity' or @dataType='int' or @dataType='smallint' or @dataType='tinyint'">
			summaryType: 'sum',
			summaryRenderer: function(value, summaryData, dataIndex) {
				<xsl:apply-templates select="." mode="gridView.column.renderer"/>
			},
		</xsl:if>
        filter: {
        	<xsl:choose>
				<xsl:when test="@dataType='bit'">
	                type: 'boolean'
				</xsl:when>
				<xsl:when test="@dataType='date' or @dataType='datetime' or @dataType='smalldatetime'">
	                type: 'date'
				</xsl:when>
				<xsl:when test="@dataType='float' or @dataType='money' or @dataType='smallmoney' or @dataType='float' or @dataType='decimal' or @dataType='identity' or @dataType='int' or @dataType='smallint' or @dataType='tinyint'">
	                type: 'number'
				</xsl:when>
				<xsl:when test="@dataType='nvarchar'">
	                type: 'string',
	                itemDefaults: {
	                    emptyText: 'Search for...'
	                }
				</xsl:when>
				<xsl:otherwise>
	                //{} = true //use dataIndex first then fallback to column type
	                //type: 'list' // Use the unique field values for the pick list
				</xsl:otherwise>
        	</xsl:choose>
        }
        // <xsl:if test="@isPrimaryKey=1">
        // 	hidden: true
        // </xsl:if>
        }
	</xsl:template>

</xsl:stylesheet>