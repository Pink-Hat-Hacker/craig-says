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
 * Updates User Credentials/Details
 * 
 * takes in the information from HTML fields
 * sends to database
 * changes credtentials
 */
function updateUserDetails () {
    var newUserName = document.getElementById("new_user_field").value;
    var newUserPass = document.getElementById("new_pass_field").value;
    const user = firebase.auth().currentUser;

    user.updateEmail(newUserName).then(() => {
        //Update Successful
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage + " " + errorCode);
    });
    user.updatePassword(newUserPass).then(() => {
        // Update successful.
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage + " " + errorCode);
    });
    logout();
}

/**
 * Change User Credentials
 * 
 * Page that allows admin to change their
 * username
 * password
 * 
 * uses updateUserDetails
 */
let renderChangeUserDetails = () => {
    $("body").html(`
        <div style="display:flex; justify-content:center;">
            <div class="change-credentials">
                <h2> CRAIG SAYS CHANGE EMAIL &/|| PASSWORD</h2>
                <div style="display:flex; justify-content:center;">
                    <div class="remake-login-fields">
                        <input type="username" placeholder="username" id="new_user_field"/>
                        <input type="password" placeholder="password" id="new_pass_field"/>
                    </div>
                </div>
                <button style="width: 50%;" onclick="updateUserDetails()"> Update </button>
                <br>
                <p style="color: #53514d"> - nvm - </p>
                <button style="width: 50%;" onclick="renderPage()"> Back </button>
            </div>
        </div>
    `);
}

/**
 * Submit the Quote
 * 
 * takes in the information from the textarea
 * creates a quote object
 * sends this reference to the database
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
 * Render Quote
 * 
 * makes a quote box using the object and uuid passed in
 * if admin, can delete a quote
 * 
 * delete checks uuid that matches the quote
 * deletes the HTML element as well as the database entry
 */
let renderQuote = (tObj, uuid) => {
    var user = firebase.auth().currentUser;
    $("#quotes_list").prepend(`
        <blockquote class="card" data-uuid="${uuid}">
            <h3>${tObj.content}</h3>
            <cite>
                ~ Craig
            </cite>
            <p><small class="text-muted">Revealed at ${tObj.timestamp}</small></p>
            <div class="delete-button-${uuid}"></div>
        </blockquote>
    `);
    if (user) {
        $('.delete-button-'+uuid).prepend(`<button id="deletebutton" delete-data-uuid="${uuid}"><img src="assets/trash.png"></button>`);
    }
    $("#deletebutton").off("click");
    $("#deletebutton").on("click", (evt) => {
        let quoteID = $(evt.currentTarget).attr("delete-data-uuid");
        $("blockquote[data-uuid=" + quoteID + "]").remove();
        let quoteIdRef = firebase.database().ref("posts/" + quoteID);
        quoteIdRef.remove();
        console.log(uuid + " has been removed");
        //location.reload();
    });
}

/**
 * Render Admin page
 * 
 * Page is only available to admins
 * Has logout, change credentials, delete, and text area
 */
let renderPage = () => {
    $("body").html(`
        <div class="split left">
            <div class="centered">
                <div class="header-title">
                    <div class="header-title-content">
                        <img id="eggman" src="assets/EGGMAN.png">
                        <h1>Craig says ... </h1>
                    </div>
                    <div class="header-title-logout">
                        <button onclick="logout()">LOGOUT</button>
                        <button onclick="renderChangeUserDetails()">CHANGE LOGIN INFO</button>
                    </div>
                </div>

                <!--Main Quote Creation Box-->
                <div class="container">
                    <textarea id="post" name="post" placeholder="so..."></textarea>
                    <br><br>
                    <button class="main-post-btn" onclick="submitPost()"> REVEAL THOUGHTS </button>
                </div>
            </div>
        </div>

        <div class="split right">
            <div class="centered">
                <!-- Quotes -->
                <div class="quotes">
                    <div id="quotes_list">

                    </div>
                </div>
            </div>
        </div>
    `);

    // Grabs quotes from database and sends to RenderQuote
    let quoteRef = firebase.database().ref("/posts/");
    quoteRef.on("child_added", (ss)=>{
        let tObj = ss.val();
        renderQuote(tObj, ss.key);
    });
}

/**
 * Login Page
 * 
 * asks for credentials 
 * Only Admins can enter renderPage
 * Guests can press Enter as guest egg for renderGuestPage
 */
let renderLogin = () => {
    $("body").html(`
        <div style="display:flex; justify-content:center;">
            <div class="login">
                <img src="assets/EGGMAN.png"/>
                <h2> CRAIG SAYS LOGIN</h2>
                <div style="display:flex; justify-content:center;">
                    <div class="login-fields">
                        <input type="username" placeholder="username" id="user_field"/>
                        <input type="password" placeholder="password" id="pass_field"/>
                    </div>
                </div>
                <button onclick="login()"> Are you Craig? </button>
                <p> - OTHERWISE - </p>
                <button onclick="renderGuestPage()"> Enter as Guest Egg </button>
            </div>
        </div>
    `);
}

/**
 * Guest page
 * 
 * renders Quotes on page
 * Does not have a textarea for quote creation
 * Does not have logout, change login, or delete buttons
 */
function renderGuestPage() {
    $("body").html(`
        <div class="header-title">
            <div class="header-title-content">
                <img id="eggman" src="assets/EGGMAN.png">
                <h1>Craig says ... </h1>
            </div>
        </div>

        <!-- Quotes -->
        <div class="quotes">
            <div id="quotes_list">

            </div>
        </div>
    `);

    // Grabs quotes from database and sends to RenderQuote
    let quoteRef = firebase.database().ref("/posts/");
    quoteRef.on("child_added", (ss)=>{
        let tObj = ss.val();
        renderQuote(tObj, ss.key);
    });
}

firebase.auth().onAuthStateChanged(user => {
    if (!user){
        renderLogin();
    } else {
        var user_email = firebase.auth().currentUser;
        renderPage(user, user_email.email);
    }
})