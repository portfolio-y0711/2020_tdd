<html>
    <title>To-Do lists</title>
    <link rel="stylesheet" href="css/bootstrap.min.css" media="screen">
    <link rel="stylesheet" href="base.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <body>
        <div class="container">
            <nav class="navbar navbar-default" role="navigation">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Superlists</a>
                    {{#user.email}}
                        <ul class="nav navbar-nav navbar-left">
                            <li>
                                <a href="/lists/{{ user.email }}">My lists</a>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                            <li class="navbar-text">Logged in as
                                {{ user.email }}</li>
                            <li>
                                <a href="/accounts/logout">Log out</a>
                            </li>
                        </ul>
                    {{/user.email}}

                    {{ ^user.email }}
                    <form class="navbar-form navbar-right" method="POST" action="/accounts/send_login_email">
                        <span>Enter email to log in:</span>
                        <input class="form-control" name="email" type="text"/>
                        <input type="hidden" name="_csrf" value="{{{ csrfToken }}}">
                    </form>
                {{/user.email}}
            </div>
        </nav>

        {{#message}}
            <div class="row">
                <div class="col-md-12">
                    ​<div class="alert alert-success">{{ message }}</div>
                    <!--
                    {{#success}}
                    {{/success}}
                    {{#warning}}
                        ​<div class="alert alert-danger">{{ message }}</div>
                    {{/warning}}
                    -->
                </div>
            </div>
        {{/message}}

        <div class="row">
            <div class="col-md-6 col-md-offset-3 jumbotron">
                <h1 class="text-center">Start new To-Do lists</h1>
                <form action="/lists/new" method="post">
                    <input class="form-control input-lg" type="text" name="item_text" id="id_new_item" placeholder="작업 아이템 입력">
                    <input type="hidden" name="_csrf" value="{{{ csrfToken }}}">
                    <div class="form-group has-error">
                        <div class="help-block">
                            {{#form.errors}}
                                {{ form.text.errors }}
                            {{/form.errors}}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </body>
</html>
