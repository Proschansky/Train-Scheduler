var login = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
  };

  firebase.initializeApp(login);

  var database = firebase.database();

$("#trainInfoBtn").on("click", function(event) {
    event.preventDefault(); 

    var trainName = $("#name").val().trim();
    var destination = $("#dest").val().trim();
    var frequency = $("#freq").val().trim();
    var initialTime = moment($("#initialTime").val().trim(), "hh:mm").subtract(1, "years").format("X");
        
    var currentTime = moment();
    console.log("CURRENT TIME: " +  moment(currentTime).format("hh:mm"));

    console.log(trainName);
    console.log(destination);
    console.log(initialTime);
    console.log(frequency);
    console.log(currentTime);

    var newTrain = {
        train: trainName,
        trainDest: destination,
        trainArrival: initialTime,
        everyMin: frequency
    };

    database.ref().push(newTrain);

}); 

database.ref().on("child_added", function(childSnapshot) {

        console.log(childSnapshot.val());
      
        var trainName = childSnapshot.val().train;
        var destination =childSnapshot.val().trainDest;
        var initialTime = childSnapshot.val().trainArrival;
        var frequency = childSnapshot.val().everyMin;

        var trainTime = moment(initialTime).format("hh:mm");
       
        var difference =  moment().diff(moment(trainTime),"minutes");

        var trainRemain = difference % frequency;
        console.log(trainRemain);

  
        var minRemain = frequency - trainRemain;
        console.log(minRemain);

   
        var nextArrival = moment().add(minRemain, "minutes").format('hh:mm');
        console.log(nextArrival);

        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
             frequency + "</td><td>" + nextArrival + "</td><td>" + minRemain + "</td></tr>");

});

  