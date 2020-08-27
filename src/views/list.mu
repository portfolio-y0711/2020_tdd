<html>
    <title>To-Do lists</title>
    <link rel="stylesheet" href="../css/bootstrap.min.css" media="screen">
    <link rel="stylesheet" href="../base.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <body>
        <div class="container">
            <div class="col-md-6 col-md-offset-3 jumbotron">
                <h1 class="text-center">Your To-Do lists</h1>
                <form action="/lists/{{ id }}/add_item" method="post">
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
                <table id="id_list_table" class="table table-striped">
                    {{#items}}
                        <tbody>
                            <tr>
                                <td>{{ index }}:
                                    {{ text }}</td>
                            </tr>
                        </tbody>
                    {{/items}}
                    <!--
                    {{#list.owner}}
                        <p>List owner: <span id="id_list_owner">{{list.owner.email}}</span><p>
                    {{/list.owner}}
                    -->
                </table>
            </div>
            <!--
            <div class="row">
                <div class="col-md-6 col-md-offset-3">
                    <div class="row">
                        <div class="col-md-6">
                            <h3>Shared with</h3>
                            <ul>
                                {{#list.shared_with.all}}
                                    <li class="list-sharee">{{ sharee.email }}</li>
                                {{/list.shared_with.all}}
                            </ul>
                        </div>
                        <div class="col-md-3">
                            <h3>Share this list:</h3>
                            <form class="form-inline" method="POST" action="/lists/{{ list_id }}/share">
                            <input name="sharee" placeholder="your-friend@example.com"/>
                            <input type="hidden" name="_csrf" value="{{{ csrfToken }}}">
                            </form>
                            <h3>Shared with</h3>
                            <ul>
                                {{#list.shared_with.all}}
                                    <li class="list-sharee">{{sharee.email}}</li>
                                {{/list.shared_with.all}}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            -->
        </div>
    </body>
</html>
