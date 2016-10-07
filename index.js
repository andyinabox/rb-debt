var $ = require('jquery-browserify');
var _ = require('lodash');
var columnTpl = require('./column.hbs');

// https://developers.google.com/gdata/samples/spreadsheet_sample?csw=1
// http://stackoverflow.com/questions/2924563/access-google-apps-public-spreadsheet-via-javascript
var url = "https://spreadsheets.google.com/feeds/cells/134DTw4sCgMuNVZEYUdvhYN_09uEQq4kfNxWUgEeB2Eg/od6/public/values?alt=json-in-script&callback=?";


$.getJSON(url).then(dataLoaded);


function dataLoaded(data) {
	var entries = data.feed.entry;
	var columns = [];
	_(entries).each(function(entry) {
		var col = entry.gs$cell.col-1;
		var row = entry.gs$cell.row-1;
		var val = entry.content.$t;

		columns[col] = columns[col] || [];
		columns[col][row] = val;
	});

	render(columns);
}

function render(columns) {
	console.log(columns);

	var colData1 = {
		header: columns[0].shift(),
		columns: columns[0]
	}

	var colData2 = {
		header: columns[1].shift(),
		columns: columns[1]
	}

	var columnEl1 = document.createElement('div');
	columnEl1.id = 'col1';
	columnEl1.className = 'column';
	columnEl1.innerHTML = columnTpl(colData1);

	var columnEl2 = document.createElement('div');
	columnEl2.id = 'col2';
	columnEl2.className = 'column';
	columnEl2.innerHTML = columnTpl(colData2);

	document.body.appendChild(columnEl1);
	document.body.appendChild(columnEl2);

}