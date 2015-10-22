if object_id('[TestSchema].[CONTROLS_Basic]', 'U') is not null
begin
	exec('drop table [TestSchema].[CONTROLS_Basic]');
	exec [$Ver:Beta_12].clearCache '[TestSchema].[CONTROLS_Basic]';
end

if object_id('[TestSchema].[CONTROLS_NestedGrid]', 'U') is not null
begin
	exec('drop table [TestSchema].[CONTROLS_NestedGrid]');
	exec [$Ver:Beta_12].clearCache '[TestSchema].[CONTROLS_NestedGrid]';
end

if object_id('[TestSchema].[CONTROLS_NestedForm]', 'U') is not null
begin
	exec('drop table [TestSchema].[CONTROLS_NestedForm]');
	exec [$Ver:Beta_12].clearCache '[TestSchema].[CONTROLS_NestedForm]';
end

if object_id('[TestSchema].[Pais]', 'U') is not null
begin
	exec('drop table [TestSchema].[Pais]');
	exec [$Ver:Beta_12].clearCache '[TestSchema].[Pais]';
end
