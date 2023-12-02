var searchList = [];
var currentSearchList = [];
var currentValueOfSearchBox;
var currentSearchQuestion;
var item_found;

function aui_item_in_list_found(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          item_found = list[i];
          return true;
        }
      }
    }
  }
  //$('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function aui_init_search_list(sourceList) {
  searchList = [];
  searchList.length = 0;
  
  for (i = 0; i < sourceList.length; i++) {
    let item = sourceList[i];
    searchList.push(item);
  }

  console.log("init_search_list done!");
}

function aui_show_external_search_box(searchQuestion, defaultValue) {
  currentSearchQuestion = searchQuestion;
  currentValueOfSearchBox = defaultValue;

  if ($('.external-search-box').length) {
    $('.external-search-box').show('normal');
  }
  else
  {
    $('.rt-element.rt-text-container').append(`
      <div class="rt-form-group external-search-box">
        <div class="rt-semi-open-container dropdown-list">
            <sha-list-autocomplete>
              <sha-drop-down class="ng-untouched ng-pristine ng-valid">
                  <div >
                    <dx-drop-down-box  class="rt-drop-down-container dx-show-invalid-badge dx-dropdownbox dx-textbox dx-texteditor dx-show-clear-button dx-dropdowneditor-button-visible dx-editor-outlined dx-widget dx-texteditor-empty dx-dropdowneditor dx-dropdowneditor-field-clickable dx-dropdowneditor-active dropdown-list">
                      <input
                        placeholder=""
                        name="external-search-box-select2" id="external-search-box-select2"
                        class="ui-autocomplete-input rt-input-text" >
                    </dx-drop-down-box>
                  </div>
              </sha-drop-down>
            </sha-list-autocomplete>
        </div>
      </div>
  `);
  }

  console.log("currentValue: ", currentValueOfSearchBox);
  if (currentValueOfSearchBox) {
    if (currentValueOfSearchBox !== "") {
      $("#external-search-box-select2").val(currentValueOfSearchBox);
    }
  }

  $('.external-search-box #external-search-box-select2').autocomplete({
    minLength: 1,
    //delay: 500,
    source: function( request, response ) {
      var data = aui_update_current_search_list(request.term);
      response(data);
    },
    focus: function( event, ui ) {
      return false;
    },
    select: function( event, ui ) {
      $( "#external-search-box-select2" ).val(ui.item.Show);
      selected_handler(ui.item); //save select item
      return false;
    },
    change: function( event, ui ) {
      var entered_value = document.getElementById('external-search-box-select2').value;
      changed_handler(entered_value); //save select item
      return false;
    },    
    appendTo: '.dropdown-list'
  }).autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<div>" + item.Show + "</div>" )
        .appendTo( ul );
    };
  
  $('.external-search-box').show(); 

  $('.rt-btn.rt-btn-next').hide(); 
}

function aui_update_current_search_list(term){
  currentSearchList = [];
  currentSearchList.length = 0;

  var count = 0;

  for (i = 0; i < searchList.length; i++) {
    let item = searchList[i];
    if (item.Show.toLowerCase().includes(term.toLowerCase())) {
      currentSearchList.push(item);
      count++;
    }
    if (count > 19) {
      break;
    }
  }
  
  return currentSearchList;
}

function aui_hide_external_search_box() {
  $( ".external-search-box" ).autocomplete( "destroy" );
}

////////////////////////////////////////////
function selected_handler(val) {
  console.log('selected_handler: ', val);
  console.log('currentSearchQuestion: ', currentSearchQuestion);

  switch (currentSearchQuestion) {
    case "Flight_Number": //Flight number
      save_flight_value(currentSearchQuestion, val);
      $('.rt-btn.rt-btn-next').show(); 
      break;     

    default:
      break;         
  }
}

function changed_handler(val) {

  console.log('changed_handler: ', val);
  console.log('currentSearchQuestion: ', currentSearchQuestion);
  switch (currentSearchQuestion) {
    case "Core_Q11": //Final airport
    case "Core_Q13": //From  airport    
      save_airport_value(currentSearchQuestion, val);
      $('.rt-btn.rt-btn-next').show(); 
      break;     

    default:
      break;         
  }
}
