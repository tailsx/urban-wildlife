var getMatches = function (data) {
    var cats = [];
    data.forEach(function (item) {
        item.category.forEach(function (it) {
            // Note that in a final soluton you'd want to de-dupe the category items
            cats.push(it);
        });
    });
    return cats;
};

var nbaTeams = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('apiVersion'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: 'http://data.canadensys.net/vascan/api/0.1/search.json?q=%QUERY'
});
 
var nhlTeams = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('team'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: '../data/nhl.json'
});

var species = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'http://data.canadensys.net/vascan/api/0.1/search.json?q=%QUERY',
        rateLimitWait : 600,
        filter: function (species) {
            // Map the remote source JSON array to a JavaScript array
            return $.map(species.results, function (s) {
                var test = [];
                s.matches.forEach(function (it) {
                    test.push({
                        value: it.scientificName
                    });
                });
                return test;
            });
        }
    }
});

nbaTeams.initialize();
nhlTeams.initialize();
species.initialize();
 
$('#canadensys .typeahead').typeahead({
  highlight: true
}, {
    displayKey: 'value',
    source: species.ttAdapter()
});

/*$('#multiple-datasets .typeahead').typeahead({
  highlight: true
},
{
  name: 'nba-teams',
  displayKey: 'apiVersion',
  source: nbaTeams.ttAdapter(),
  templates: {
    header: '<h3 class="league-name">NBA Teams</h3>'
  }
},
{
  name: 'nhl-teams',
  displayKey: 'team',
  source: nhlTeams.ttAdapter(),
  templates: {
    header: '<h3 class="league-name">NHL Teams</h3>'
  }
});*/