var airportsList;
var item_found;

function load_airports_list() {
  airportsList = JSON.parse(airport_list);

  for (i = 0; i < airportsList.length; i++) {
    airportsList[i].Show = airportsList[i].airport;
  }

  aui_init_search_list(airportsList);
  console.log("load_airport_code done!");
}

function save_airport_value(question, value) {
  console.log("question:", question);
  console.log("value:", value);

  if (question == "Core_Q11") {
    api.fn.answers({Core_Q11_ext:  value});

    api.fn.answers({Q11_Recoded:  value});
  }
  else if (question == "Core_Q13")
  {
    api.fn.answers({Core_Q13_ext:  value});
  }

  console.log("save_airport done!");
}

function show_airport_search_box(question) {
  load_airports_list();
  
  var defaultValue = "";
  if (question == "Core_Q11") {
    defaultValue = api.fn.answers().Core_Q11_ext;

  }
  else if (question == "Core_Q13")
  {
    defaultValue = api.fn.answers().Core_Q13_ext;
  }

  aui_show_external_search_box(question, defaultValue);
}

function hire_airport_search_box(question) {
  aui_hide_external_search_box();
}