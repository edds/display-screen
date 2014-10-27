(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var traffic = {
    $el: false,

    endpoint: function(offset){
      var date = new Date(),
          start, end;

      date.setDate(date.getDate() - offset);
      end = date.toPerformanceString();
      date.setDate(date.getDate() - 1);
      start = date.toPerformanceString();

      return "https://www.performance.service.gov.uk/data/government/realtime?sort_by=_timestamp%3Adescending"
            +"&start_at="+ start +"&end_at="+ end;
    },
    parseTrendline: function(data){
      var i, _i,
          j, _j,
          newSeries, newData = [],
          dates = {},
          key, date,
          total,
          values,
          trend = [];

      for(j=0, _j=data.length; j<_j; j++){
        newSeries = {};
        for(i=0, _i=data[j].data.length; i<_i; i++){
          date = new Date(data[j].data[i]._timestamp);
          key = date.getHours() +":"+ date.getMinutes();
          newSeries[key] = parseInt(data[j].data[i].unique_visitors, 10);
          dates[key] = 1;
        }
        newData.push(newSeries);
      }

      dates = Object.keys(dates).reverse();

      for(i=0, _i=dates.length; i<_i; i++){
        total = 0,
        values = 0;
        for(j=0, _j=newData.length; j<_j; j++){
          if(newData[j][dates[i]]){
            values = values + 1;
            total = total + newData[j][dates[i]];
          }
        }
        trend.push( total / values );
      }
      return trend;
    },
    parseResponse: function(data, past1, past2, past3, past4){
      var counts = [],
          i, _i,
          trend = traffic.parseTrendline([past1[0], past2[0], past3[0], past4[0]]);

      traffic.$el.html('<h1>' + root.matrix.numberWithCommas(data[0].data[0].unique_visitors) + '</h1>');
      for(i=0,_i=data[0].data.length; i<_i; i++){
        counts.unshift(parseInt(data[0].data[i].unique_visitors, 10));
      }
      if(typeof traffic.sparkline === 'undefined'){
        traffic.sparkline = root.matrix.sparklineGraph('#traffic-count-graph',
              { data: counts,
                trend: trend,
                points: traffic.points,
                height: 120,
                width: traffic.$graphEl.width()
              });
      }
      traffic.sparkline.update(counts, trend, "Traffic over the past 24 hours, with trend of the same period for the past 4 weeks");
    },
    init: function(){
      traffic.$el = $('#traffic-count');
      traffic.$graphEl = $('#traffic-count-graph');

      traffic.reload();
      window.setInterval(traffic.reload, 20e3);
    },
    reload: function(){
      $.when(
        $.ajax({ dataType: 'json', url: traffic.endpoint(0) }),
        $.ajax({ dataType: 'json', url: traffic.endpoint(7) }),
        $.ajax({ dataType: 'json', url: traffic.endpoint(14) }),
        $.ajax( { dataType: 'json', url: traffic.endpoint(21) }),
        $.ajax( { dataType: 'json', url: traffic.endpoint(28) })
      ).then(traffic.parseResponse);
    }
  };

  Date.prototype.toPerformanceString = function() {
    function pad(number) {
      if ( number < 10 ) {
        return '0' + number;
      }
      return number;
    }
    var extraHour = this.getTimezoneOffset() < 0 ? -1 : 0;
    return this.getUTCFullYear() +
      '-' + pad( this.getUTCMonth() + 1 ) +
      '-' + pad( this.getUTCDate() ) +
      'T' + pad( this.getUTCHours() ) +
      ':' + pad( this.getUTCMinutes() ) +
      ':' + pad( this.getUTCSeconds() ) +
      'Z';
  };

  root.matrix.traffic = traffic;
}).call(this);
