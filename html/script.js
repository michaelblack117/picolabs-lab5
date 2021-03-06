$(document).ready(function(){

  /*********************************** HELPER FUNCTIONS ********************************************************
  **************************************************************************************************************/

  //params is a map
  var addParams = function(baseURL, params){
    if(!params){
      return baseURL;
    }

    var url = baseURL + '?';
    $.each(params, function(key, value){
      url += `&${key}=${value}`
    });

    return url;
  }

  //attrs is a map
  var buildEventURL = function(eci, eid, domain, type, attrs){
    var baseURL =  `${config.protocol}${config.server_host}/sky/event/${eci}/${eid}/${domain}/${type}`;
    return addParams(baseURL, attrs)
  }

  //params is a map
  var buildQueryURL = function(eci, rid, funcName, params){
    var baseURL =  `${config.protocol}${config.server_host}/sky/cloud/${eci}/${rid}/${funcName}`;
    return addParams(baseURL, params);
  }

  /******************************* END HELPER FUNCTIONS ***********************************************************
  *****************************************************************************************************************/


  /*********************************** FUNCTION DECLARATIONS ******************************************************
  *****************************************************************************************************************/
  var retrieveCurrentTemp = function(){
    $.ajax({
      url: buildQueryURL(config.default_eci, config.temp_store_rid, config.temperature_func),
      dataType: "json",
      success: function(json){
        console.log("Retrieved Current Temperature: ", json);

        var values = Object.values(json);
        var temperature = values[values.length-1];

        $("#currentTemp").html(`<p>${temperature}</p>`);

      },
      error: function(error){
        console.error("Error retrieving current temperature: ", error);
      }
    });
  };//end retrieveCurrentTemp Note: you can also use the "retrieveCurrentTemp" to also get your recent temperatures

  var setViolationLogs = function(){
    $.ajax({
      url: buildQueryURL(config.default_eci, config.temp_store_rid, config.violation_func),
      dataType: "json",
      success: function(json){
        console.log("Retrived violation logs: ", json);

        var timestamps = Object.keys(json);
        var temperatures = Object.values(json);

        for (var i = 0; i < timestamps.length; i++) {
          var time = timestamps[i];
          var temp = temperatures[i];
          $("#violationLogs").html(`<p>${time}: ${temp}</p>`);
        }
      },
      error: function(error){
        console.error("Error retrieving violation logs: ", error);
      }
    });
  };//end violationLogs



  /******************************* END FUNCTION DECLARATIONS ******************************************************
  *****************************************************************************************************************/




  //load initial data
  retrieveCurrentTemp();
  setViolationLogs();

  //BEGIN BUTTON SETUP
  $('#tempRefresh').click(function(e){
    e.preventDefault();
    retrieveCurrentTemp();
  });

  //END BUTTON SETUP


});
