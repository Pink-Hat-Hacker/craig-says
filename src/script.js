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

let renderQuote = () => {
    $("#quotes_list").prepend(`
        <div class="card">
            <div class="card-header">
                Quote
            </div>
            <div class="card-body">
                <blockquote class="blockquote mb-0">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
                </blockquote>
            </div>
        </div>
    `);
}

let renderPage = () => {
    $("body").html(`
        <div class="header-title">
            <img id="eggman" src="../assets/EGGMAN.png">
            <h1>Craig says ... </h1>
        </div>
    `)
}