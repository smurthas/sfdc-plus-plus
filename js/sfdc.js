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

function gotoTab(tab) {
  document.location = $('#' + tab + '_Tab').children().attr('href').slice(0, -2);
}

function createNew(type) {
  document.location = $('#createNewMenu').find('.' + type + 'Mru').attr('href');
}

// g l → go to my leads
Mousetrap.bind('g l', function() { gotoTab('Lead'); });

// c l → create new lead
Mousetrap.bind('c l', function() { createNew('lead'); });

// g a → go to my accounts
Mousetrap.bind('g a', function() { gotoTab('Account'); });

// c a → create new account
Mousetrap.bind('c a', function() { createNew('account'); });

// g c → go to my contacts
Mousetrap.bind('g c', function() { gotoTab('Contact'); });

// c c → create new contact
Mousetrap.bind('c c', function() { createNew('contact'); });

// g o → go to my opporunities
Mousetrap.bind('g o', function() { gotoTab('Opportunity'); });

// c o → create new opportunity
Mousetrap.bind('c o', function() { createNew('opportunity'); });

// g r → go to reports
Mousetrap.bind('g r', function() { gotoTab('report'); });


// c t → create new task
Mousetrap.bind('c t', function() { createNew('task'); });

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

