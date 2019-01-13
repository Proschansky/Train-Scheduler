var login = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    messagingSenderId: config.messagingSenderId
  };
  
  firebase.initializeApp(login);