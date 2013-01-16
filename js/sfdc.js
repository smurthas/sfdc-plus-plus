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


// l c → log a callk
Mousetrap.bind('l c', function() { $('input[title="Log A Call"]').click(); });

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

var SCID = '222e053e1ee3329a8f2bf395247dc443';
var autoCompURL = 'https://api.singly.com/friends/gcontacts'
var atok;

function addAutocomplete(suffix) {
  var first = '#name_first' + suffix + '2';
  var last  = '#name_last' + suffix + '2';
  var email = '#' + suffix;
  var phone;
  if (suffix === 'lea') email += '11';
  else if (suffix === 'con') {
    email += '15';
    phone = suffix + '10';
  }
  var selections = [];
  $(first).autocomplete({
    source: function(request, response) {
      //if (!atok) return;
      var q = $(first).val();
      $.getJSON(autoCompURL + '?access_token=' + atok + '&q=' + q, function(a) {
        selections = a;
        var ret = [];
        for (var i in a) {
          var first = a[i].name.split(' ')[0];
          var last = a[i].name.split(' ')[1];
          var val = a[i];
          val.label = a[i].name;
          val.value = first;
          val.last = last;
          ret.push(val);
        }
        response(ret);
      });
    },
    select: function(event, ui) {
      // set last name
      $(last).val(ui.item && ui.item.last);
      // set email
      $(email).val(ui.item && ui.item.email);

      if (phone) $(phone).val(ui.item.phone);
    },
    delay:100
  });

}

var authURL = 'https://api.singly.com/oauth/authenticate?client_id=' + SCID +
                '&redirect_uri=' + window.location.href +
                '&service=gcontacts&response_type=token';

function addGContactsLogo() {
  var html = '<a href="' + authURL + '">' +
  '<img src="http://assets.singly.com/service-icons/16px/gcontacts.png"></a>';
  $($('#AppBodyHeader').find('td.right')[0]).prepend(html);
}

$(function() {
  // check url hash for token
  if (window.location.hash &&
      window.location.hash.indexOf('#access_token=') === 0) {
    atok = window.location.hash.substring(14);
    localStorage.setItem('token', atok);
  } else {
    // check local storage for token
    atok = localStorage.getItem('token');
  }
  // add autocomp for leads
  addAutocomplete('lea');

  // add autocomp for contacts
  addAutocomplete('con');

  // ad the gcontacts auth logo in top right
  addGContactsLogo();
});


