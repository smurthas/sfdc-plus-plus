// / → focus on search bar
Mousetrap.bind('/', function() {
  $('#phSearchInput').focus();
  return false;
});

// e → edit current object
Mousetrap.bind('e', function() { $('input[title="Edit"]').click(); });

// o → change owner
Mousetrap.bind('o', function() {
  var a = $('a:contains("Change")')[0];
  document.location = $(a).attr('href');
});

// g l → go to my leads
Mousetrap.bind('g l', function() {
  document.location = $('#Lead_Tab').children().attr('href').slice(0, -2);
});

// g a → go to my accounts
Mousetrap.bind('g a', function() {
  document.location = $('#Account_Tab').children().attr('href').slice(0, -2);
});

// g c → go to my contacts
Mousetrap.bind('g c', function() {
  document.location = $('#Contact_Tab').children().attr('href').slice(0, -2);
});

// g o → go to my opporunities
Mousetrap.bind('g o', function() {
  document.location = $('#Opportunity_Tab').children().attr('href').slice(0, -2);
});

// g r → go to reports
Mousetrap.bind('g r', function() {
  document.location = $('#report_Tab').children().attr('href').slice(0, -2);
});

var index = -1;
Mousetrap.bind('j', function() {
  var table = $('#ext-gen12');
  var rows = table.find('.x-grid3-row');
  if (index >= rows.length-1) return;
  index++;
  var row = $(table.find('.x-grid3-row')[index]);
  var a = $(row.find('table').find('td')[3]).find('a');
  a.focus();
});

Mousetrap.bind('k', function() {
  var table = $('#ext-gen12');
  var rows = table.find('.x-grid3-row');
  if(index === 0) return;
  index--;
  var row = $(rows[index]);
  var a = $(row.find('table').find('td')[3]).find('a');
  a.focus();
});
