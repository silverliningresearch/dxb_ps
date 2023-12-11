/************************************/
function CalculateAirportAirLineReport() {
  prepareInterviewData();
  CalculateDOOP(); //add DOOP to flight list
  var daily_plan_data_temp;
  daily_plan_data_temp = [];
  daily_plan_data_temp.length = 0;
  
  total_completed = 0;
  total_quota_completed = 0;

  //check what not belong to quota data
  var found_temp = 0;
  var not_in_quota_list =[];
  for (i = 0; i < interview_data.length; i++) 
  {
    total_completed = total_completed +   parseInt(interview_data[i].Completed_of_interviews);    
    found_temp = 0;
    for (j = 0; j < quota_data.length; j++) 
    {
      if (quota_data[j].quota_id.toUpperCase() == interview_data[i].quota_id.toUpperCase()) 
      { 
        found_temp = 1;
      }
    }
    if (found_temp==0) not_in_quota_list.push(interview_data[i]);
  }
  console.log("not_in_quota_list: ", not_in_quota_list);


  for (i = 0; i < quota_data.length; i++) {//airport_airline_report.length;
    row = quota_data[i];
    row.Completed = 0;

    for (j = 0; j < interview_data.length; j++) {
      if (row.quota_id.toUpperCase() == interview_data[j].quota_id.toUpperCase()) 
      { 
        row.Completed = row.Completed  + parseInt(interview_data[j].Completed_of_interviews);
      }
    }

    row.Difference = row.Completed -  row.Quota;
    row.Difference_percent =(100*(row.Difference/row.Quota)).toFixed(0);
    row.Prioritisation_score = row.Difference_percent*row.Difference/100;

    row.Completed_percent =(100*(row.Completed/row.Quota)).toFixed(0);

    //total_completed = total_completed + row.Completed;
        
    if ( row.Difference > 0) { //over quota
      total_quota_completed = total_quota_completed +row.Quota*1;
    }
    else { //<= 0
      if (row.Completed) {
        total_quota_completed = total_quota_completed + row.Completed*1;
      }
    }

  }

  for (i = 0; i < daily_plan_data.length; i++) {//airport_airline_report.length;
    row = daily_plan_data[i];
    for (j = 0; j < quota_data.length; j++) {
      if (row.quota_id.toUpperCase() == quota_data[j].quota_id.toUpperCase()) 
      {
        if ( quota_data[j].Difference < 0) {
          row.remaining_flights = quota_data[j].remaining_flights;
          row.Completed = quota_data[j].Completed;
          row.Completed_percent = quota_data[j].Completed_percent;
          row.Difference = quota_data[j].Difference;
          row.Difference_percent = quota_data[j].Difference_percent;
          row.Prioritisation_score = quota_data[j].Prioritisation_score;
          daily_plan_data_temp.push(row);
        }
      }
    }  
  }

  total_completed_percent = (100*(total_completed/total_quota)).toFixed(0);   
  daily_plan_data = [];
  daily_plan_data.length = 0;

 //sort decending
  daily_plan_data_temp.sort(function(a, b) {
    return parseFloat(b.Prioritisation_score) - parseFloat(a.Prioritisation_score);
  });

  for (i = 0; i < daily_plan_data_temp.length; i++) {
    row = daily_plan_data_temp[i];
    row.Priority = 0;
    daily_plan_data.push(row);
    if((i< daily_plan_data_temp.length*0.25) || (row.remaining_flights<=5))
    {
      row.Priority = 1;
    }
  }
}

function getDOOP(date) //"07-02-2023"
{
  var parts = date.split("-")
  var day = parts[0];
  var Month = parts[1];
  var Year = parts[2];

  const d = new Date();
  d.setDate(day);
  d.setMonth(Month-1); //month start from 0
  d.setYear(Year);

  return d.getDay(); //Sun: 0; Sat: 6
}

function isNotThePastDate(date) //"07-02-2023"
{
  var current_day_of_month =  new Date().getDate();
  var current_month =  new Date().getMonth() + 1;

  var parts = date.split("-")
  var flight_day = parseInt(parts[0]);
  var Month = parseInt(parts[1]);
  
  var result = (((flight_day >= current_day_of_month) && (Month==current_month)) || (Month>current_month));

  return (result);
}

function CalculateDOOP() {
  for (i = 0; i < quota_data.length; i++) {
    quota_data[i].doop = " ";
    quota_data[i].remaining_flights = 0;
    var mon =0;
    var tue =0;
    var wed =0;
    var thu =0;
    var fri =0;
    var sat =0;
    var sun =0;

    var remaining_flights = 0;
    for (j = 0; j < this_month_flight_list.length; j++) {
      if (quota_data[i].quota_id.toUpperCase() == this_month_flight_list[j].quota_id.toUpperCase()) 
      {
        //get remaining_flights
        if (isNotThePastDate(this_month_flight_list[j].Date)) {
          remaining_flights++;
        }

        switch (getDOOP( this_month_flight_list[j].Date)) {
          case 0:
            sun = "7";
            break;
          case 1:
            mon = "1";
            break;
          case 2:
            tue = "2";
            break;
          case 3:
            wed = "3";
            break;
          case 4:
            thu = "4";
            break;
          case 5:
            fri = "5";
            break;
          case 6:
            sat = "6";
            break;
          default:
            break;
        }
      }
    }
    quota_data[i].doop =[mon, tue, wed, thu, fri, sat, sun].join('');
    quota_data[i].remaining_flights = remaining_flights;
  }
}									 