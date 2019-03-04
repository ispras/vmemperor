Задача: реализация подписок GraphQL на сложные объекты в нескольких таблицах GraphQL.

Вход: Информация о полях запроса как словарь.
Ключ

``` python
@dataclass
class FieldHeader:
      name : str
      table : Optional[str]
      is_list : bool
```

"ref" у нас идентификатор
```
 name:"ref",table:None, is_list: False  - простое поле  (строка или др.)
 name:"VIFs",table:"vifs",is_list: True - поле типа список, данные из таблицы vifs
```

Значение
словарь с запрошенными полями. Ключ: объект FieldHeader. Значение - подполя. Например имеем запрос



``` graphql
subscription VMInfo {
vms {
ref
name_label
VIFs {
ip
network {

}
}
}
}
```
Функция get_fields возвращает по объекту ResolveInfo весь запрос в таком виде
