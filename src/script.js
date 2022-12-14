// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZb51Z94WZFhVA36pGQ0-ghXyM47dfuxM",
    authDomain: "craig-says.firebaseapp.com",
    projectId: "craig-says",
    storageBucket: "craig-says.appspot.com",
    messagingSenderId: "1030182600492",
    appId: "1:1030182600492:web:eb134f469fbd83c871f689",
    measurementId: "G-XQ9W0VB35J"
};
const app = firebase.initializeApp(firebaseConfig);
var db = firebase.database();

/**
 * Firebase Authentication Functions
 * 
 * login() checks to see if user exists
 * signup() creates new user
 * logout() sets to no current user
 */
function login() {
    var userName = document.getElementById("user_field").value;
    var userPass = document.getElementById("pass_field").value;
    //window.alert(userName + " " + userPass);
    firebase.auth().signInWithEmailAndPassword(userName, userPass).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage + " " + errorCode);
    });
}
function signup() {
    var userName = document.getElementById("user_field").value;
    var userPass = document.getElementById("pass_field").value;
    firebase.auth().createUserWithEmailAndPassword(userName, userPass).then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage + " " + errorCode);
  });
}
function logout() {
    firebase.auth().signOut().then(function() {
          //signout success
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage + " " + errorCode);
    });
}

/**
 * Functionality Functions
 */
function submitPost() {
    var user = firebase.auth().currentUser;
    var myRef = firebase.database().ref().child("admin/" + user.uid + "/posts/").push();
    var postRef = firebase.database().ref("posts/").push();
    var timestamp = new Date();
    timestamp = timestamp.toLocaleString();
    var craigPost = document.getElementById("post").value;
    const myObj = {
        "content": craigPost,
        "timestamp": timestamp, 
        "authorID": user.uid,
        "author": {
            "email": user.email,
            "nickname": user.email.substring(0, user.email.indexOf('@'))
        }
    };
    postRef.set(myObj);
    myRef.set(myObj);
}
/**
 * Render HTML functions
 */
let renderQuote = (tObj, uuid) => {
    $("#quotes_list").prepend(`
        <blockquote class="card" data-uuid="${uuid}">
            <div class="card-header">
                Quote #${tObj.quoteNumber}
            </div>
            <p>${tObj.content}</p>
            <cite>
                ~ Craig
            </cite>
            <p><small class="text-muted">Revealed at ${tObj.timestamp}</small></p>
        </blockquote>
    `);
}

let renderPage = () => {
    $("body").html(`
        <div class="header-title">
            <div class="header-title-content">
                <img id="eggman" src="../assets/EGGMAN.png">
                <h1>Craig says ... </h1>
            </div>
            <div class="header-title-logout">
                <button onclick="logout()">LOGOUT</button>
            </div>
        </div>

        <!--Main Tweeting Box-->
        <div class="container">
            <textarea id="post" name="post" placeholder="so..." data-provide="markdown"></textarea>
            <br><br>
            <button class="main-post-btn" onclick="submitPost()"> REVEAL THOUGHTS </button>
        </div>
        <br>
        <hr> 

        <!-- Quotes -->
        <div class="quotes">
            <div id="quotes_list">

            </div>
        </div>
    `);

    //here we can do your bawks or all bawks switch
    let tweetRef = firebase.database().ref("/posts/");
    tweetRef.on("child_added", (ss)=>{
        let tObj = ss.val();
        renderQuote(tObj, ss.key);
    });
}


let renderLogin = () => {
    $("body").html(`
        <div style="display:flex; justify-content:center;">
            <div class="login">
                <img src="../assets/EGGMAN.png"/>
                <h2> CRAIG SAYS LOGIN</h2>
                <div style="display:flex; justify-content:center;">
                    <div class="login-fields">
                        <input type="username" placeholder="username" id="user_field"/>
                        <input type="password" placeholder="password" id="pass_field"/>
                    </div>
                </div>
                <button onclick="login()"> Are you Craig? </button>
                <p> - OTHERWISE - </p>
                <button onclick="signup()"> Enter as Guest Egg </button>
            </div>
        </div>
    `);
}

firebase.auth().onAuthStateChanged(user => {
    if (!user){
      renderLogin();
    } else {
      var user_email = firebase.auth().currentUser;
      renderPage(user, user_email.email);
    }
})