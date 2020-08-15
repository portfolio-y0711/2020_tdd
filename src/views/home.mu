<html>
    <title>To-Do lists</title>
    <link rel="stylesheet" href="css/bootstrap.min.css" media="screen">
    <link rel="stylesheet" href="base.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <body>
        <div class="container">
            <div class="col-md-6 col-md-offset-3 jumbotron">
                <div class="text-center">
                    <h1>Start new To-Do lists</h1>
                    <form action="/lists/new" method="post">
                        <p style="text-align: center;"></p>
                        <input type="hidden" name="_csrf" value="{{{ csrfToken }}}">
                        <input class="form-control input-lg" type="text" name="item_text" id="id_new_item" placeholder="작업 아이템 입력">
                    </form>
                </div>
            </div>
        </div>
    </body>
</html>
