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