// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2q5P_Motk9Q1jzOZe-TE6_Tr00Cnw6zM",
  authDomain: "formify-33302.firebaseapp.com",
  projectId: "formify-33302",
  storageBucket: "formify-33302.appspot.com",
  messagingSenderId: "1050174460465",
  appId: "1:1050174460465:web:d4193f70b897f5af0ebb10",
  measurementId: "G-QLXR67MT4K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const db = firebase.firestore();

// Set up our register function
function register() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('full_name').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is out of Line!');
    return; // Don't continue running the code
  }
  if (!validate_field(full_name)) {
    alert('Full Name is Out of Line!');
    return;
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      const user = auth.currentUser;

      // Create User data
      const user_data = {
        email: email,
        full_name: full_name,
        last_login: Date.now()
      };

      // Add this user to Firestore Database
      db.collection('users').doc(user.uid).set(user_data)
        .then(function() {
          // Done
          alert('User Created!!');
        })
        .catch(function(error) {
          // Firestore will use this to alert of its errors
          console.error("Error writing document: ", error);
          alert(error.message);
        });
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      console.error("Error creating user: ", error);
      alert(error.message);
    });
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  return password.length >= 6;
}

function validate_field(field) {
  return field != null && field.length > 0;
}