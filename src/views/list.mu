<html>
    <title>To-Do lists</title>
    <body>
        <h1>Your To-Do lists</h1>
        <form action="/lists/{{id}}/add_item" method="post">
            <input type="hidden" name="_csrf" value="{{{csrfToken}}}">
            <input type="text" name="item_text" id="id_new_item" placeholder="작업 아이템 입력">
        </form>
        <table id="id_list_table">
            {{#items}}
            <tr> <td>{{index}}: {{text}}</td> </tr>
            {{/items}}
        </table>
    </body>
</html>
