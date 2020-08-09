<html>
    <title>To-Do lists</title>
    <body>
        <h1>Your To-Do lists</h1>
        <form action="/" method="post">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            <input type="text" name="item_text" id="id_new_item" placeholder="작업 아이템 입력">
        </form>
        <table id="id_list_table">
            <tr>
                <td>1: {{ item_text }}</td>
            </tr>
        </table>
    </body>
</html>
