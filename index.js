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

	var header1 = columns[0].shift();
	var header2 = columns[1].shift();

	var colData1 = {
		columns: columns[0]
	}

	var colData2 = {
		columns: columns[1]
	}

	var $headers = $('<header>');
	$headers
		.attr('id', 'headers')
		.appendTo('body');

	$header1 = $('<div>')
		.addClass('cell')
		.addClass('header')
		.html(header1)
		.appendTo($headers);

	$header2 = $('<div>')
		.addClass('cell')
		.addClass('header')
		.html(header2)
		.appendTo($headers);

	var $column1 = $('<div>');
	$column1
		.attr('id', 'col1')
		.addClass('column')
		.html(columnTpl(colData1))
		.appendTo('body');

	var $column2 = $('<div>');
	$column2
		.attr('id', 'col2')
		.addClass('column')
		.html(columnTpl(colData2))
		.appendTo('body');

	$column1.scrollTop(($column1.find('.shim').height()/2)-($column1.height()/2));
	$column2.scrollTop(($column2.find('.shim').height()/2)-($column2.height()/2));

	var col1Scrolling = false;
	var col2Scrolling = false;
	var interval = 100;
	var intervalId;

	$column1.on('scroll', function(e) {
		var percent = $column1.height()/($column1.scrollTop() + ($column1.height()/2));
		var translation = $column2.find('.shim').height()*percent - ($column2.height());
		
		if(!col2Scrolling && percent !== Infinity) {
			$column2.scrollTop(translation);
			col1Scrolling = true;
			window.clearInterval(intervalId);
			intervalId = window.setInterval(function() { col1Scrolling = false }, interval);
		}
	});


	$column2.on('scroll', function(e) {
		var percent = $column2.height()/($column2.scrollTop() + ($column2.height()/2));
		var translation = $column1.find('.shim').height()*percent - ($column1.height());
		
		if(!col1Scrolling && translation !== Infinity) {
			$column1.scrollTop(translation);
			col2Scrolling = true;
			window.clearInterval(intervalId);
			intervalId = window.setInterval(function() { col2Scrolling = false }, interval);
		}
	});


}