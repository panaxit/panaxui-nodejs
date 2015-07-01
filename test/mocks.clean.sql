if object_id('[TestSchema].[CONTROLS_Basic]', 'U') is not null
		exec('drop table [TestSchema].[CONTROLS_Basic]')

if object_id('[TestSchema].[CONTROLS_NestedGrid]', 'U') is not null
		exec('drop table [TestSchema].[CONTROLS_NestedGrid]')

if object_id('[TestSchema].[CONTROLS_NestedForm]', 'U') is not null
		exec('drop table [TestSchema].[CONTROLS_NestedForm]')

if object_id('[TestSchema].[Pais]', 'U') is not null
		exec('drop table [TestSchema].[Pais]')