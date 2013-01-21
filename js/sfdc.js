function gotoTab(tab) {
  document.location = $('#' + tab + '_Tab').children().attr('href').slice(0, -2);
}

function createNew(type) {
  document.location = $('#createNewMenu').find('.' + type + 'Mru').attr('href');
}
var index = -1;
function changeRows(offset) {
  var table = $('#ext-gen12');
  var rows = table.find('.x-grid3-row');
  if (!rows || !rows.length) return;
  if (index+offset >= rows.length) return;
  if (index+offset < 0) return;
  index += offset;
  var row = $(rows[index]);
  var a = $(row.find('table').find('td')[3]).find('a');
  a.focus();
}

var mappings = {
  'Navigation': {
    '/': {
      description: 'Move focus to search bar',
      handler: function() { $('#phSearchInput').focus(); return false; }
    },
    'j': {
      description: 'Next row',
      handler: changeRows.bind(null, 1)
    },
    'k': {
      description: 'Previous row',
      handler: changeRows.bind(null, -1)
    },
    '?': {
      description: 'Show/Hide help',
      handler: showHelp
    }
  },
  'Editing': {
    'e': {
      description: 'Edit current item',
      handler: function() { $('input[title="Edit"]').click(); }
    },
    'o': {
      description: 'Change owner of current item',
      handler: function() {
        var a = $('a:contains("Change")')[0];
        document.location = $(a).attr('href');
      }
    },
    'c l': {
      description: 'Create a new lead',
      handler: createNew.bind(null, 'lead')
    },
    'c a': {
      description: 'Create a new account',
      handler: createNew.bind(null, 'account')
    },
    'c o': {
      description: 'Create a new opportunity',
      handler: createNew.bind(null, 'lead')
    },
    'c c': {
      description: 'Create a new contact',
      handler: createNew.bind(null, 'contact')
    },
    'c t': {
      description: 'Create a new task',
      handler: createNew.bind(null, 'task')
    },
    'l c': {
      description: 'Log a call',
      handler: function() { $('input[title="Log A Call"]').click(); }
    }
  },
  'Jumping': {
    'g l': {
      description: 'Go to My Leads',
      handler: gotoTab.bind(null, 'Lead')
    },
    'g a': {
      description: 'Go to My Accounts',
      handler: gotoTab.bind(null, 'Account')
    },
    'g o': {
      description: 'Go to My Opportunites',
      handler: gotoTab.bind(null, 'Opportunity')
    },
    'g r': {
      description: 'Go to My Reports',
      handler: gotoTab.bind(null, 'Report')
    },
    'g c': {
      description: 'Go to My Contacts',
      handler: gotoTab.bind(null, 'Contact')
    }
  }
};

for (var section in mappings) {
  for(var k in mappings[section])
  Mousetrap.bind(k, mappings[section][k].handler);
}


var help;
function showHelp() {
  if ($("#sfdc-ks").length > 0) {
    if ($("#sfdc-ks").is(":visible")) return $("#sfdc-ks").hide();
    else return $("#sfdc-ks").show();
  }
  console.log('building help!');
  var html = '<div id="sfdc-ks"><div id="title">Keyboard Shortcuts!</div>';
  html += '<table id="outer-table"><tr>';

  var columns = ['<td class="sfdc-ks-col">', '<td class="sfdc-ks-col">'];

  var col = 1;
  for (var sectionTitle in mappings) {
    col = (col+1) % 2;
    var section = mappings[sectionTitle];
    columns[col] += '<table><tr><th></th><th>' + sectionTitle + '</th></tr>';
    for (var shortcut in section) {
      columns[col] += buildRow(shortcut, section[shortcut].description);
    }
    columns[col] += '</table>';
  }
  columns[0] += '</td>';
  columns[1] += '</td>';
  html += columns.join('');
  html += '</tr></table></div>';
  console.error('html', html);
  $('body').append(html);
}

function buildRow(shortcut, description) {
  var spl = shortcut.split(' ');
  var str = '<tr>' + '<td><span class="yellow">' + spl[0] + '</span>';
  if (spl[1]) str += ' then <span class="yellow">' + spl[1] + '</span>';
  str += ':</td><td>' + description + '</td></tr>';
  return str;
}

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


