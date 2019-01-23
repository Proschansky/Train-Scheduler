var config = {
  apiKey: "AIzaSyCOOe1SrT6KkfFGtxLJk9m7yLvxSJLf71c",
  authDomain: "trainscheduler-a351b.firebaseapp.com",
  databaseURL: "https://trainscheduler-a351b.firebaseio.com",
  projectId: "trainscheduler-a351b",
  storageBucket: "trainscheduler-a351b.appspot.com",
  messagingSenderId: "786332381840"
};

  firebase.initializeApp(config);

  // Set page to reload every thirty seconds in order to update.
function timedRefresh(timeoutPeriod) {
  setTimeout("location.reload(true);",timeoutPeriod);
}

window.onload = timedRefresh(30000);


// Create a variable to reference the database
    var database = firebase.database();

//Run Time  
    setInterval(function(startTime) {
        $("#timer").html(moment().format('hh:mm a'))
    }, 1000);

// Capture Button Click
    $("#add-train").on("click", function() {
        // Don't refresh the page!
        event.preventDefault();

  // Code in the logic for storing and retrieving the most recent train information
  var train = $("#trainname-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  var firstTime = $("#firsttime-input").val().trim();
  
  // Don't forget to provide initial data to your Firebase database. - set replaces old data
  //if you want to add more users than just the latest one, then use push
  //database.ref().set({
  var trainInfo = { 
    formtrain: train,
    formdestination: destination,
    formfrequency: frequency,
    formfirsttime: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
    //this is added so we can get most resent user so we can get most recent user to brower and to do this we need to change the listener  
  database.ref().push(trainInfo);

  console.log(trainInfo.formtrain);
  console.log(trainInfo.formdestination);
  console.log(trainInfo.formfrequency);
  console.log(trainInfo.formfirsttime);
  console.log(trainInfo.dateAdded);

  // Alert
  alert("Train was successfully added");

  // Clears all of the text-boxes
  $("#trainname-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#firsttime-input").val("");

});

// Firebase watcher + initial loader 
database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
  var train = childSnapshot.val().formtrain;
  var destination = childSnapshot.val().formdestination;
  var frequency = childSnapshot.val().formfrequency;
  var firstTime = childSnapshot.val().formfirsttime;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTime = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTime);

  //determine Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

  //get timer functioning
  $("#timer").text(currentTime.format("hh:mm a"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTime), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log("Remainder: " + tRemainder);

  //determine Minutes Away
  var minutesAway = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);

  //determine Next Train Arrival
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

  
  //want to push to table to add new train 
  //add new table row
  //add new train information into row
  // Add each train's data into the table row

  //adds back updated information
  $("#train-table").append("<tr><td>" + '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

  // var t = setTimeout(startTime, 500);

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});


//on click for deleting row if trash can is clicked
//this on click did not work, did some research and found another option
// $(".fa-trash").on("click", function() {
$("body").on("click", ".fa-trash", function() {
  $(this).closest("tr").remove(); 
  alert("delete button clicked");
});

function loadTrainInfo (){
  $("#train-table > tbody").empty();
  $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
}
document.onload = loadTrainInfo();
//I want to update time of minutesAway and nextArrival 
//I am not sure how to call the previous function and use the setInterval or setTimeout to update the time in that function, so once each train is called and time passes then this function empties the table body and pulls each train and redoes the math
// Update minutes away by triggering change in firebase children
function timeUpdater() {
  // empty tbody before appending new information
  $("#train-table > tbody").empty();
  
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {  

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTime = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTime);

  // Current Time
  var currentTime = moment();

  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
  $("#timer").html(h + ":" + m);

  $("#timer").text(currentTime.format("hh:mm a"));
  // Difference between the times
  var diffTime = moment().diff(moment(firstTime), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log("Remainder: " + tRemainder);

  //determine Minutes Away
  var minutesAway = frequency - tRemainder;
  console.log("MINUTES TIL TRAIN: " + minutesAway);

  //determine Next Train Arrival
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));

 //want to push to table to add new train 
  //add new table row
  //add new train information into row
  // Add each train's data into the table row
  $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  
  loadTrainInfo();
  

  setInterval(timeUpdater, 30000);

})};



// Create Error Handling

// function(errorObject) {
// console.log("The read failed: " + errorObject.code);
// }
