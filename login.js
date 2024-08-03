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

// Set up our login function
function login() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is out of Line!');
    return; // Don't continue running the code
  }

  // Move on with Auth
  auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      const user = auth.currentUser;

      // Fetch user data from Firestore
      db.collection('users').doc(user.uid).get()
        .then(function(doc) {
          if (doc.exists) {
            const user_data = doc.data();
            console.log("User data:", user_data);
            alert('User Logged In!!');
          } else {
            console.log("No such document!");
            alert('No user data found!');
          }
        })
        .catch(function(error) {
          console.error("Error getting document:", error);
          alert(error.message);
        });
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      console.error("Error signing in:", error);
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