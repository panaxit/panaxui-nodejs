IF NOT EXISTS (
SELECT  schema_name
FROM    information_schema.schemata
WHERE   schema_name = 'TestSchema' ) 

BEGIN
EXEC sp_executesql N'CREATE SCHEMA TestSchema'
END

/****** Object:  Table [TestSchema].[Pais]    Script Date: 30/06/2015 10:18:51 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[Pais](
	[Id] [nchar](2) NOT NULL,
	[Pais] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_Paises] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [TestSchema].[CONTROLS_Basic]    Script Date: 30/06/2015 10:18:51 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_Basic](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ShortTextField] [nvarchar](255) NULL,
	[IntegerReq] [int] NOT NULL,
	[Float] [float] NULL,
	[Combobox] [nchar](2) NULL,
	[RadioGroup] [int] NULL,
	[Boolean] [bit] NULL,
	[Money] [money] NULL,
	[Timestamp] [timestamp] NULL,
	[Date] [date] NULL,
	[Datetime] [datetime] NULL,
	[Time] [time](7) NULL,
	[LongText] [text] NULL CONSTRAINT [DF_CONTROLS_Basic_LongText]  DEFAULT ('default loooong text'),
 CONSTRAINT [PK_CONTROLS_Basic] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [TestSchema].[CONTROLS_NestedForm]    Script Date: 30/06/2015 10:18:51 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_NestedForm](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TextLimit10Chars] [nchar](10) NULL,
 CONSTRAINT [PK_CONTROLS_NestedForm] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [TestSchema].[CONTROLS_NestedGrid]    Script Date: 30/06/2015 10:18:51 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_NestedGrid](
	[Id] [int] NOT NULL,
	[TextLimit255] [nvarchar](255) NULL,
 CONSTRAINT [PK_CONTROLS_NestedGrid] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [TestSchema].[CONTROLS_Basic]  WITH CHECK ADD  CONSTRAINT [FK_CONTROLS_Basic_Pais] FOREIGN KEY([Combobox])
REFERENCES [TestSchema].[Pais] ([Id])
GO
ALTER TABLE [TestSchema].[CONTROLS_Basic] CHECK CONSTRAINT [FK_CONTROLS_Basic_Pais]
GO
ALTER TABLE [TestSchema].[CONTROLS_NestedGrid]  WITH CHECK ADD  CONSTRAINT [FK_CONTROLS_NestedGrid_CONTROLS_NestedForm] FOREIGN KEY([Id])
REFERENCES [TestSchema].[CONTROLS_NestedForm] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [TestSchema].[CONTROLS_NestedGrid] CHECK CONSTRAINT [FK_CONTROLS_NestedGrid_CONTROLS_NestedForm]
GO
EXEC sys.sp_addextendedproperty @name=N'displayText', @value=N'Pais' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'Pais'
GO
EXEC sys.sp_addextendedproperty @name=N'${table}[@controlType="gridView"]/${column}/@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'ShortTextField'
GO
EXEC sys.sp_addextendedproperty @name=N'@tab', @value=N'General' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'ShortTextField'
GO
EXEC sys.sp_addextendedproperty @name=N'@tabPanel', @value=N'General' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'ShortTextField'
GO
EXEC sys.sp_addextendedproperty @name=N'${table}[@controlType="gridView"]/${column}/@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'IntegerReq'
GO
EXEC sys.sp_addextendedproperty @name=N'@controlType', @value=N'combobox' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'Combobox'
GO
EXEC sys.sp_addextendedproperty @name=N'@controlType', @value=N'radiogroup' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'RadioGroup'
GO
EXEC sys.sp_addextendedproperty @name=N'@moveBefore', @value=N'Combobox' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'RadioGroup'
GO
EXEC sys.sp_addextendedproperty @name=N'@tab', @value=N'Otros' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'Money'
GO
EXEC sys.sp_addextendedproperty @name=N'[CONTROLS_Grid]@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_NestedGrid'
GO
EXEC sys.sp_addextendedproperty @name=N'[CONTROLS_Grid]scaffold', @value=N'true' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_NestedGrid'
GO

/* Mock Data Loading  */
INSERT INTO [TestSchema].[Pais] (Id, Pais) VALUES ('MX', 'Mexico')

DECLARE @cnt INT = 0;
WHILE @cnt < 42
BEGIN
	INSERT INTO [TestSchema].[CONTROLS_Basic] (ShortTextField, IntegerReq) 
	VALUES ('A Test '+CAST(@cnt AS VARCHAR), @cnt);
	SET @cnt = @cnt + 1;
END;