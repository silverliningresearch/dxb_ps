var quota_data;
var interview_data;
var today_flight_list;
var this_month_flight_list;
var daily_plan_data;
var removed_ids_data;

var currentMonth;
var currentDate;
var nextDate;
var download_time;

var total_quota;
var total_completed;
var total_completed_percent;

var total_quota_completed;
var report_version = 1;
/************************************/
function initCurrentTimeVars() {
  var d = new Date();
      
  var month = '' + (d.getMonth() + 1); //month start from 0;
  
  var day = '' + d.getDate();
  var year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  currentMonth =[month,year].join('-')
  currentDate = [day, month,year].join('-');
  
  //next day
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  var tomorrowMonth = '' + (tomorrow.getMonth() + 1); //month start from 0;
  var tomorrowDay = '' + tomorrow.getDate();
  var tomorrowYear = tomorrow.getFullYear();

  if (tomorrowMonth.length < 2) 
  tomorrowMonth = '0' + tomorrowMonth;
  if (tomorrowDay.length < 2) 
  tomorrowDay = '0' + tomorrowDay;
  nextDate  = [tomorrowDay, tomorrowMonth, tomorrowYear].join('-');

  //return [day, month,year].join('-');
  if (document.getElementById('year_month') && document.getElementById('year_month').value.length > 0)
  {
    if (document.getElementById('year_month').value != "current-month")
    {
      currentMonth = document.getElementById('year_month').value;
    }
  }
  console.log("currentMonth: ", currentMonth);
  
}

function notDeparted(flight_time) {
  var current_time = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Dubai', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;

  var result = (flight_time_value > current_time_value);

  return (result);
}

function prepareInterviewData() {
  var flight_list_temp  = JSON.parse(DXB_Departures_Flight_List_Raw);
  
  initCurrentTimeVars();	

  //prepare flight list
  //empty the list
  today_flight_list = [];
  today_flight_list.length = 0;
  
  this_month_flight_list  = [];
  this_month_flight_list.length = 0;
  
  const excluded_airlines = ["Flydubai"];
  const excluded_Airplane = ["737-", "A320", "A321"];

  for (i = 0; i < flight_list_temp.length; i++) {
    let flight = flight_list_temp[i];
    //currentMonth: 02-2023
    //flight.Date: 08-02-2023

    //only get today & not departed flight
    if (((currentDate == flight.Date) && notDeparted(flight.Time))
        || (nextDate == flight.Date)
        )
    { 
      flight.Date_Time = flight.Date.substring(6,10) + flight.Date.substring(3,5) + flight.Date.substring(0,2) + flight.Time;
      //flight.Date_Time = flight.Time;
      if (flight["Airplane type"] == "A320neo")
      {
        print("ABC");
      }
      if (!excluded_airlines.includes(flight.Airline) && !excluded_Airplane.includes(flight["Airplane type"].substring(0,4)))
      {
        today_flight_list.push(flight);
      }
    }
			   
  }
    
  console.log("today_flight_list:", today_flight_list)
}
