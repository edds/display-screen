(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var content = {
    pages: [],
    $el: false,

    endpoint: function(){
      return "https://www.performance.service.gov.uk/data/govuk/trending?limit=15&sort_by=percent_change:descending";
    },
    parseResponse: function(data){
      var i, _i, title;

      content.pages = [];
      for(i=0,_i=data.data.length; i<_i; i++){
        if(data.data[i].pageTitle.indexOf(' - ') > -1){
          title = data.data[i].pageTitle.split(' - ').slice(0,-1).join(' - ');
        } else {
          title = data.data[i].pageTitle.split(' | ').slice(0,-1).join(' - ');
        }
        content.pages.push({
          title: title,
          displayHits: root.matrix.numberWithCommas(data.data[i].week2),
          percentageUp: root.matrix.numberWithCommas(Math.round(data.data[i].percent_change)) + "%"
        });
      }

      content.displayResults();
    },
    displayResults: function(){
      matrix.template(content.$el, 'content-results', { pages: content.pages.slice(0,10) });
    },
    init: function(){
      content.$el = $('#content');

      content.reload();
      window.setInterval(content.reload, 60e3 * 60 * 3); // refresh every 3 hours
    },
    reload: function(){
      var endpoint = content.endpoint();

      $.ajax({ dataType: 'json', url: endpoint, success: content.parseResponse});
    }
  };

  root.matrix.content = content;
}).call(this);
