
shift_table_string = '';


var days_of_week = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
var shift_times = ['8:00AM - 12:00PM', '10:00PM - 2:00PM', '12:00PM - 4:00PM', '2:00PM - 6:00PM'];

document.getElementById('shift_table').innerHTML += '<thead><tr>';
for (var i = 0; i < days_of_week.length+1; i++) {
  if (i == 0) {
    shift_table_string += '<th id="days_cell" class="mdl-data-table__cell--non-numeric">' + '</th>';
  } else {
    shift_table_string += '<th id="days_cell" class="mdl-data-table__cell--non-numeric">' + days_of_week[i-1] + '</th>';
  }
}

shift_table_string += '</tr></thead>';

var shift_id = 0;

for (var i = 0; i < shift_times.length; i++) {
  shift_table_string += '<tr id="row_' + (i) + '"><td class="shift_times_cell">' + shift_times[i] + '</td>';
  for (var j = 0; j < days_of_week.length; j++) {
    shift_table_string += '<td class="shift_cell" id="shift_cell' + String(shift_id) + '">' + 'Testies' + '</td>';
    shift_id += 1;
  }
  shift_table_string += '</tr>';
}


document.getElementById('shift_table').innerHTML = shift_table_string;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCllerIGsbDSRfbkXKBfQvMLnHqC_vUZwI",
  authDomain: "prefers-12cd2.firebaseapp.com",
  databaseURL: "https://prefers-12cd2.firebaseio.com",
  projectId: "prefers-12cd2",
  storageBucket: "prefers-12cd2.appspot.com",
  messagingSenderId: "412064070833"
};
firebase.initializeApp(config);

var pref_array = [];

function onRetrieve() {
  firebase.database().ref('User').orderByKey().on("child_added", function (user_shift_data_object) {
    console.log(user_shift_data_object.val());
      var employee_shift_pref = user_shift_data_object.val();
      var templist = [];
      for (var i = 0; i < days_of_week.length * shift_times.length; i++) {
        for (var j = 0; j < employee_shift_pref.no_of_shift; j++) {
          templist.push(Number(employee_shift_pref.shift_data[i].credits));
        }
      }
      pref_array.push(templist);

      MunkresAlgorithm(pref_array);
  });
}

function displayShifts() {
  var name_array = ["Chang", "Chang", "Chang", "Chang", "Chang", "Chang", "Chang",
                    "Collins", "Collins", "Collins", "Collins", "Collins", "Collins", "Collins",
                    "Billy", "Jeff", "Jeff", "Jeff", "Jeff", "Jeff", "Jeff",
                    "Jeff", "Jeff", "Jeff", "Jeff", "Jeff", "Jeff", "Jeff"];
  var my_array = random_array();
  var shift_assignments = MunkresAlgorithm(my_array);
  var final_shifts = new Array(28);

  for (var i = 0; i < 28; i++) {
    index = shift_assignments[i];
    console.log("shift_cell" + String(index[1]));
    document.getElementById("shift_cell" + String(index[1])).innerHTML = name_array[index[0]] + " (" + String(Math.round(my_array[index[0]][index[1]] * 100) / 100) + ")";
    final_shifts[index[1]] = index[0];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  }
}

function random_array() {
  var my_array = [];
  for (var i = 0; i < 28; i++) {
    my_array.push([]);
    for (var j = 0; j < 28; j++) {
      my_array[i].push(Math.random());
    }
  }
  return my_array;
}

