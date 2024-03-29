var shift_table_string = '';
var on_receive_flag = 0;


var days_of_week = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
var shift_times = ['8:00AM - 11:00AM', '11:00AM - 2:00PM', '2:00PM - 5:00PM'];

document.getElementById('shift_table').innerHTML += '<thead><tr>';
for (var i = 0; i < days_of_week.length + 1; i++) {
  if (i == 0) {
    shift_table_string += '<th id="days_cell" class="mdl-data-table__cell--non-numeric">' + '</th>';
  } else {
    shift_table_string += '<th id="days_cell" class="mdl-data-table__cell--non-numeric">' + days_of_week[i - 1] + '</th>';
  }
}

shift_table_string += '</tr></thead>';

var shift_id = 0;

for (var i = 0; i < shift_times.length; i++) {
  shift_table_string += '<tr id="row_' + (i) + '"><td class="shift_times_cell">' + shift_times[i] + '</td>';
  for (var j = 0; j < days_of_week.length; j++) {
    shift_table_string += '<td class="employer_shift_cell" id="shift_cell' + String(shift_id) + '">' + '' + '</td>';
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

//var pref_array = [];
//var heat_array = [];
//var name_array = [];
var shift_assignments = [];

function onRetrieve() {
  if (!on_receive_flag) {
    var pref_array = [];
    var names = [];
    firebase.database().ref('User').orderByKey().on("child_added", function (user_shift_data_object) {
      console.log(user_shift_data_object.val());
      var employee_shift_pref = user_shift_data_object.val();
      for (var j = 0; j < employee_shift_pref.no_of_shift; j++) {
        var templist = [];
        for (var i = 0; i < days_of_week.length * shift_times.length; i++) {
          templist.push(Number(employee_shift_pref.shift_data[i].credits));
        }
        names.push(employee_shift_pref.user);
        pref_array.push(templist);

      }
      shift_assignments = findShifts(pref_array);
      displayShifts(pref_array, names);

      for (var m = 0; m < days_of_week.length * shift_times.length; m++) {
        console.log(m);
        var cell = document.getElementById("shift_cell" + String(m));
        cell.className = "employer_shift_cell";
      }


      var heat_array_aux = [];
      for (var k = 0; k < days_of_week.length * shift_times.length; k++) {
        heat_array_aux.push(Number(employee_shift_pref.shift_data[k].credits))
      }
      heat_array.push(heat_array_aux);

    });

    on_receive_flag = 1;
    document.getElementById('submit_button').innerText = 'generate heatmap';

    return (pref_array)
  } else {
    onHeatmap();
    on_receive_flag = 0;
    document.getElementById('submit_button').innerText = 'get timetable';
  }
}

function onHeatmap() {
  var heat_array = [];
  firebase.database().ref('User').orderByKey().on("child_added", function (user_shift_data_object) {
    console.log(user_shift_data_object.val());
    var employee_shift_pref = user_shift_data_object.val();
    var heat_array_aux = [];
    for (var k = 0; k < days_of_week.length * shift_times.length; k++) {
      heat_array_aux.push(Number(employee_shift_pref.shift_data[k].credits))
    }
    heat_array.push(heat_array_aux);
  });
  displayHeat(heat_array); // this does not work yet.
}

function findShifts(my_array) {
  return (MunkresAlgorithm(my_array));
}

function displayShifts(my_array, name_array) {
  for (var i = 0; i < days_of_week.length * shift_times.length; i++) {
    index = shift_assignments[i];
    console.log("shift_cell" + String(index[1]));
    var cell = document.getElementById("shift_cell" + String(index[1]))
    var name = name_array[index[0]]
    var weighting = " <br\>(" + String(Math.round(my_array[index[0]][index[1]] * 100) / 100) + ")";
    cell.innerHTML = name + weighting;
  }
}

function maxList(my_array) {
  var max = 0
  for (var i = 0; i < my_array.length; i++) {
    if (my_array[i] > max) {
      max = my_array[i];
    }
  }
  return max
}

function displayHeat(my_array) {
  var heat = heatmap(my_array);
  var heat_N = [];

  max_heat = maxList(heat);
  //console.log(max_heat);
  
  if (max_heat > 0) {
    for (var i = 0; i < heat.length; i++) {
      var val = heat[i]*5/max_heat;
      console.log(val);
      if (val == 0) {
        heat_N.push(1);
      } else {
        if (val < 1.5) {
          heat_N.push(2);
        } else {
          heat_N.push(Math.round(val));
        }
      }
    }
  }
  for (var i = 0; i < days_of_week.length * shift_times.length; i++) {
    console.log(i);
    var cell = document.getElementById("shift_cell" + String(i))
    
    cell.className = "heat" + String(heat_N[i]);
    cell.innerHTML = String(heat[i]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  }
  console.log(heat_N);
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