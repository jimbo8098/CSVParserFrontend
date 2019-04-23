function MatchTable(name)
{
	thisTable = this;
	thisTable.TableName = name;
	thisTable.Div = document.getElementById(thisTable.TableName + "_Div");
	thisTable.Data = [];
	
	thisTable.GetRow = function(id)
	{
		for(var i = 0; i < thisTable.Data.length; i++)
		{
			if(thisTable.Data[i].ID = id)
			{
				return thisTable.Data[i];
			}
		}
		return false; //Nothing found
	}
	
	thisTable.MakeOptions = function(sampleData)
	{
		//var ColumnNames = Object.getOwnPropertyNames(sampleData);
		var ColumnNames =ParseSettings.Columns; //Bugfix to make sure the column order is maintained
		
		for(var iCol = 0; iCol < ColumnNames.length; iCol++)
		{
			//columns
					
			var tType;
			if(parseInt(column))
			{
				if(column.length == parseInt(column).toString().length)
				{
					tType = 1; //Was parsed as a number and had the same length after. Must be valid int.
				}
				else
				{
					tType = 0; //Has numbers but letters too or starts with a 0. Could happen with 1b or 001
				}
			}
			else
			{
				tType = 0; //Is not a number
			}
			
			var column = {
				Defaults:
				{
					Type: tType,
					Value: iCol
				},
				
				ColumnName: ColumnNames[iCol]
			};
			
			thisTable.AddOption(column.ColumnName,column.ColumnName,ColumnNames,column.Defaults);
			
		}
		
		
	}
	
	thisTable.AddOption = function(id,newProperty,newOptions,defaultSelections = null)
	{
		if(defaultSelections)
		{
			thisTable.Data.push({
				ID: id,
				Row: new MatchRow(id,thisTable.TableName),
				SelectedValue: defaultSelections.Value,
				DefaultValue: defaultSelections.Value,
				SelectedType: defaultSelections.Type,
				DefaultType: defaultSelections.Type
			});
			
		}
		else
		{
			thisTable.Data.push({
				ID: id,
				Row: new MatchRow(id,thisTable.TableName),
				SelectedValue: null
			});
		}
		thisTable.Data[thisTable.Data.length - 1].Row.AddDataObject(thisTable.Data[thisTable.Data.length - 1]);
		
		thisTable.Data[thisTable.Data.length - 1].Row.Property = newProperty;
		
		for(var i = 0; i < newOptions.length; i++)
		{
			thisTable.Data[thisTable.Data.length - 1].Row.AddAvailableOption(newOptions[i]);
		}
		thisTable.Data[thisTable.Data.length - 1].Row.GenerateHTML();
		thisTable.GenerateTable();
	}
	
	thisTable.GenerateTable = function()
	{
		thisTable.HTML =
			"<table id='" + thisTable.TableName + "' >"
				+ "<tr>"
					+ "<th>Assign Columns</th>"
				+ "</tr>"
				+ "<tr><td><br/></td></tr>";
				for(var i = 0; i < thisTable.Data.length; i++)
				{
					thisTable.HTML += thisTable.Data[i].Row.HTML;
				}
		thisTable.HTML +=
			"</table>";
		
		thisTable.Div.innerHTML = thisTable.HTML;
		
	}
	
	thisTable.AddDefaultsAndCallbacks = function()
	{
		for(var i = 0; i < thisTable.Data.length; i++)
		{
			document.getElementById(thisTable.Data[i].Row.RowName + "_Select").selectedIndex = thisTable.Data[i].DefaultValue;
			thisTable.Data[i].Row.TypeElement.selectedIndex = thisTable.Data[i].DefaultType;
			document.getElementById(thisTable.Data[i].Row.BoxElementID).addEventListener("change",thisTable.OptionChangeCallback,false);
		}
		
	}
	
	thisTable.OptionChangeCallback = function(event)
	{
		var ChangedRow = thisTable.GetRow(this.attributes.getNamedItem("data-row"));
		ChangedRow.SelectedValue = this.options[this.selectedIndex].value;
		thisTable.OptionsUpdated();
	}
	
	thisTable.GetProperty = function(id)
	{
		return thisTable.GetRow(id).SelectedValue;
	}
	
	thisTable.OptionsUpdated = function()
	{
		// A callback
		console.log("WARN: No callback set for update SQL");
		addStatus("WARN: No callback set for update SQL");
	}
	
}

function MatchRow(name,table)
{
	var thisRow = this;
	thisRow.RowName = name;
	thisRow.RowData = null;
	thisRow.Table = table;
	thisRow.BoxElementID = thisRow.RowName + "_Select";
	
	thisRow.BoxElement = function () 
	{
		return document.getElementById(thisRow.BoxElementID);
	}; //Return this on the fly
	
	thisRow.TypeElement = function()
	{
		return document.getElementById(thisRow.RowName + "_Type");
	}; 
	
	thisRow.Property = null;
	thisRow.SelectedValue = null;
	thisRow.AvailableValues = [];
	thisRow.ValueTypes = [ "string","int","nodisplay" ]
	thisRow.SelectedType = function()
	{
		return thisRow.TypeElement().options[thisRow.TypeElement().selectedIndex].innerHTML;
	};
	
	thisRow.HTML = null;
	
	thisRow.AddDataObject = function(data)
	{
		thisRow.RowData = data;
	}
	
	thisRow.AddAvailableOption = function(value)
	{
		thisRow.AvailableValues.push(value);
		thisRow.GenerateHTML();
	}
	
	thisRow.GenerateHTML = function()
	{
		thisRow.HTML = 
			"<tr>"
				+ "<td class='cell'>"
					+ thisRow.Property
				+ "</td>"
				+ "<td class = 'cell'>"
					+ "<select id='" + thisRow.RowName + "_Select' data-table='" + thisRow.Table + "' data-row='" + thisRow.RowName + "' >";
						for(var i = 0; i < thisRow.AvailableValues.length; i++)
						{
							thisRow.HTML += "<option data-value=" + i + " >" + thisRow.AvailableValues[i] + "</option>";
						}
					thisRow.HTML += "</select>"
				+ "</td>"
				+ "<td class = 'cell'>"
						+ "<select id='" + thisRow.RowName + "_Type' data-table='" + thisRow.Table + "' data-row='" + thisRow.RowName + "' >";
						for(var i = 0; i < thisRow.ValueTypes.length; i++)
						{
							thisRow.HTML += "<option data-value=" + i + " >" + thisRow.ValueTypes[i] + "</option>";
						}
						thisRow.HTML += "</select>"
				+ "</td>"
			+ "</tr>";
			
	}
	
	thisRow.AddChangeCallbacks = function()
	{
		thisRow.TypeElement.setattribute("onchange",thisRow.TypeChangeCallback());
	}
	
	thisRow.TypeChangeCallback = function()
	{
		thisRow.SelectedType = thisRow.TypeElement.selectedIndex;
	}
	
	thisRow.NewSelection = function()
	{
		console.log(document.getElementById(thisRow.RowName + "_Select").options[document.getElementById(thisRow.RowName + "_Select").selectedIndex]);
	}
	
	thisRow.GetSelection = function()
	{
		thisRow.SelectedValue = thisRow.BoxElement().options[thisRow.BoxElement().selectedIndex];
		return thisRow.SelectedValue;
	}
}

function CSVHandler(csvdata)
{
	thisHandler = this;
	thisHandler.CSV = csvdata;
	thisHandler.DataStartRow = null;
	thisHandler.HeadingRow = null;
	thisHandler.Columns = null;
	thisHandler.Data = [];
	
	thisHandler.SetDataStartRow = function(row)
	{
		thisHandler.DataStartRow = row;
		thisHandler.Data = []; //need to blank it before we proceed
		for(var i = row; i < thisHandler.CSV.length; i++)
		{
			thisRowData = {};
			for(var j = 0; j < thisHandler.Columns.length; j++)
			{
				thisRowData[thisHandler.Columns[j]] = thisHandler.CSV[i][j];
			}
			thisHandler.Data.push(thisRowData);
			
		}
		
		
	}
	
	thisHandler.SetHeadingRow = function(row)
	{
		thisHandler.HeadingRow = row;
		thisHandler.Columns = thisHandler.CSV[row];
	}
	
	thisHandler.GetColumns = function()
	{
		return thisHandler.Columns;
	}
	
	thisHandler.SetHeadingRow(0);
	thisHandler.SetDataStartRow(0);
	
}
