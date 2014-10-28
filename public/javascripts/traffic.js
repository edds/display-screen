(function(){
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.matrix === 'undefined'){ root.matrix = {} }

  var traffic = {
    $el: false,
    startDate: false,

    endpoint: function(offset){
      var date = new Date(traffic.startDate),
          start, end;

      date.setDate(date.getDate() - offset);
      end = date.toPerformanceString();
      date.setDate(date.getDate() - 1);
      start = date.toPerformanceString();

      return "https://www.performance.service.gov.uk/data/government/realtime?sort_by=_timestamp%3Adescending"
            +"&start_at="+ start +"&end_at="+ end;
    },
    pointsToArray: function(data){
      var i, _i,
          date = new Date(traffic.startDate),
          dates = [],
          dataByTime = {},
          key,
          values = [];

      // find all the minutes we need
      for(i=0,_i=60*24; i<_i; i++){
        date.setMinutes(date.getMinutes() - 1);
        dates.push(date.getHours() +":"+ date.getMinutes());
      }

      // turn the data points into a time key object
      for(i=0, _i=data.length; i<_i; i++){
        date = new Date(data[i]._timestamp);
        key = date.getHours() +":"+ date.getMinutes();
        dataByTime[key] = parseInt(data[i].unique_visitors, 10);
      }

      // create an array of the data in the right order
      for(i=0,_i=dates.length; i<_i; i++){
        if(dataByTime[dates[i]]){
          values.push(dataByTime[dates[i]]);
        } else {
          // fill missing minutes, don't fill more than two though
          if(values.length && values[values.length-1] !== values[values.length-2]){
            values.push(values[values.length-1]);
          } else {
            values.push(0);
          }
        }
      }
      return values.reverse();
    },
    parseTrendline: function(data){
      var i, _i,
          j, _j,
          total,
          values,
          trend = [];

      for(j=0, _j=data.length; j<_j; j++){
        data[j] = traffic.pointsToArray(data[j]);
      }

      for(i=0, _i=data[0].length; i<_i; i++){
        total = 0,
        values = 0;
        for(j=0, _j=data.length; j<_j; j++){
          if(data[j][i]){
            values = values + 1;
            total = total + data[j][i];
          }
        }
        if(values === 0){
          trend.push(0);
        } else {
          trend.push( total / values );
        }
      }
      return trend;
    },
    parseResponse: function(data, past1, past2, past3){
      var counts = [],
          i, _i,
          trend = traffic.parseTrendline([past1[0].data, past2[0].data, past3[0].data]);

      traffic.$el.html('<h1>' + root.matrix.numberWithCommas(data[0].data[0].unique_visitors) + '</h1>');
      counts = traffic.pointsToArray(data[0].data);
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
      traffic.startDate = new Date();
      $.when(
        $.ajax({ dataType: 'json', url: traffic.endpoint(0) }),
        $.ajax({ dataType: 'json', url: traffic.endpoint(7) }),
        $.ajax({ dataType: 'json', url: traffic.endpoint(14) }),
        $.ajax( { dataType: 'json', url: traffic.endpoint(21) })
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
