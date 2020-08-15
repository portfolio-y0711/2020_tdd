<html>
    <title>To-Do lists</title>
    <body>
        <h1>Start new To-Do lists</h1>
        <form action="/lists/new" method="post">
            <input type="hidden" name="_csrf" value="{{{csrfToken}}}">  
            <input type="text" name="item_text" id="id_new_item" placeholder="작업 아이템 입력">
        </form>
    </body>
</html>
