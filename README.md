# Лабораторая работа №4
## Взаимодействие с базой данных посредством объекной модели доступа
В этой лабораторной работе мы напишем объектную модель для коллекций базы __MongoDB__, что позволит удобно и понятно создавать документы коллекций, а также иметь строгое описание хранимых сущностей.

## 1. Подготовка

В [лабораторной работе №3](https://github.com/eugrdn/RSREU-training_Integration/) вы создали базу данных и подключили её с помощью __Node.js__ драйвера __Mongodb__ в наше приложение "Библиотека".

### 1.1. Подготовка проекта

Так как в данной работе мы используем результат предыдущей, то нам необходимо выполнить [аналогичные действия](https://github.com/eugrdn/RSREU-training_Integration/#Шаг-zero----Подготовка-проекта) для установки зависимостей и старта проекта. Выполните установку зависимостей:

```powershell
> npm install
```

### 1.2. Запуск базы данных

Давайте запустим сервер базы данных как вы это уже делали в [лабораторной работе №2](https://github.com/DairoGrey/rgrtu-lab2-mongo#221-%D0%97%D0%B0%D0%BF%D1%83%D1%81%D0%BA).

Базу данных со всеми коллекциями из предыдущих заданий вы можете найти в папке проекта — _mongo_data.zip_. Распакуйте файлы БД в папку проекта. Остаётся только запустить __mongod__. Выполните следующую команду в консоли в папке проекта. Обратите внимание, что _mongo_data_ - каталог с распакованными данными в директории проекта, а _mongod.exe_ - исполняемый файл __mongod__, который был установлен на предыдущей лабораторной работе:

 ```powershell
 mongodb> .\bin\mongod.exe --dbpath ..\..\mongo_data\
 ```

Готово — сервер базы данных ожидает подключения по адресу `http://localhost:27017`. Проверить подключение вы можете с помощью уже знакомого вам __Robomongo__. 

Запустите проект и проверьте загрузку книг библиотеки по адресу [http://localhost:8080](http://localhost:8080).

### 1.3. Подключание модуля Mongoose

__Mongoosejs__ — это ORM-модуль для __MongoDB__, позволяющий вам использовать объектные модели в своем приложении для работы с данными.

Подключим модуль __Mongoosejs__ к нашему приложению и с помощью него получим доступ к базе данных.
Подключение __Mongoosejs__ аналогично подключению модуля __MongoDB__, с которым вы работали в лабораторной работе №3. Нужно выполнить следующую последовательность действий:

1. С помощью _npm install_ установить пакет [mongoose](https://www.npmjs.com/package/mongoose) и добавьте его в зависимости в _package.json_.
2. Откройте файл _db\index.js_, где мы описывали методы для подключения к БД и запроса коллекций.
3. С помощью [CommonJS](http://requirejs.org/docs/commonjs.html) подхода импортируйте объект `mongoose` (аналогично тому, как мы импортировали зависимости в предыдущих лабораторных работах).
4. Измените метод _connect_ и экспортируйте его:
```javascript
connect(url, callback) {
  return mongoose.connect(url, {
    useMongoClient: true,
    promiseLibrary: global.Promise
  }, callback);
}
```
Опции _useMongoClient_ и _promiseLibrary_ добавлены для использования современного способа соединения с базой данных и для использования стандартных промисов. В __Mongoosejs__ они введены для обеспечения обратной совместимости со старыми версиями библиотеки.

5. Методы _getInstance_ и _getCollection_ нам не пригодятся, работу с коллекциями заменят схемы.

## 2. Схемы и типы
Всё в __Mongoosejs__ начинается описания схемы. Каждая схема по своей сути привязывается к __MongoDB__ коллекции и описывает модель хранимых в ней документов. Документацию по использованию схем можно найти  [здесь](http://mongoosejs.com/docs/guide.html). Основным преимуществом такого подхода является возможность описания типов полей документа. Все возможные для использования типы доступны в документации [здесь](http://mongoosejs.com/docs/schematypes.html). 

1. Создадим в нашем проекте новую папку под названием _schemas_.
2. Создадим первую схему для описания структуры хранимых объектов книг.

Для этого в новосозданной папке добавим новый файл _books.schema.js_ и опишем в нём схему. Для этого нам необходимо выяснить какие поля будут содержать наши будущие документы __MongoDB__ коллекции _books_. Например, поле _title_ будет содержать строку текста, значит мы опишем её тип в схеме как _String_. Начнём и опишем все поля для этой схемы: 
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema({
  title:  String
  //опишите остальные поля самостоятельно
});

module.exports = booksSchema;
```
Для описания остальных полей и их типов вы можете посмотреть на данные в БД через __Robomongo__ или воспользоваться [файлами моделей](https://github.com/eugrdn/RSREU-training_Integration/tree/lab-start/models) лабораторной работы №3.

3. Далее по такому же принципу опишите схемы для категорий и фильтров.

## 3. Модели и документы
 Модели __Mongoosejs__ представляют собой объекты, собранные конструктором схемы ([страница документации](http://mongoosejs.com/docs/models.html)). Экземпляры же этих моделей - это документы, которые могут быть сохранены и извлечены из нашей базы данных ([документы mongoose](http://mongoosejs.com/docs/documents.html)).
 
 1. Для того чтобы перейти на использование схем в нашем приложении, нам необходимо модифицировать созданный в лабораторной работе №3 сервисы.
 
 Для этого откроем сервис книг _books.service.js_  и заменим 
```javascript
const bookCol = require('../db/index').getCollection('books');
```
 на
 ```javascript
const Book = mongoose.model('book', booksSchema);
```
Стоит обратить внимание на первый аргумент: __Mongoosejs__ при создании или использовании существующих коллекций приводит их названия к нижнему регистру и множественному числу на основе переданного названия модели в единственном числе.

Также не забудьте импортировать используемые модули: `mongoose` и `booksSchema`.

2. Теперь мы готовы работать с моделью коллекции книг и имеем на неё ссылку в нашем файле.

2.1. Перепишем метод _getAllBooks_ с использованием модели. С методами модели можно познакомиться в [документации](http://mongoosejs.com/docs/api.html#model_Model).
Итак, тело метода:
```javascript
return bookCol.find({}).toArray(callback);
```
примет вид
```javascript
return Book.find({}, callback);
```

2.2. Перепишем остальные методы сервиса. Помимо уже использованного метода конструктора модели `find` вам понадобятся: `create`, `update` и `remove`.

3. Сделаем аналогичные действия с остальными сервисами.

4. Если в предыдущих пунктах всё сделано правильно, то к настоящему моменты мы должны получить рабочий вариант приложения, поведение будет таким же как и в лабораторной работе №3.
 
## 4. Валидация
Валидация - это проверка некоего объекта на удовлетворение определенным требованиям.

В __Mongoosejs__ валидация реализована с помощью __middleware__ (так называемого "промежуточного программного обеспечения"). Проверка объекта на соответствие заданным требованиям будет происходить после начала сохранения. Если валидация будет провалена (объект не удовлетворяет требованиям), то в коллбек метода сохранения будет передана ошибка. Также валидация может быть проведена вручную с помощью методов _validate(callback)_ или _validateSync()_. Подробнее об этом можно прочитать [здесь](http://mongoosejs.com/docs/validation.html).

__Mongoosejs__ поддерживает встроенную валидацию. Для чисел это минимальное и максимальное значение, для строк - максимальная и минимальная длина, а также проверка на регулярные выражения. 

Реализуем в нашем приложении валидацию следующих полей: 
- Название: не должно быть пустым;
- Автор: фамилия и имя не должны быть пустыми, должны состоять только из букв и символов __-__, __'__;
- Стоимость: не должна быть отрицательной и превышать 10000.
- Все поля должны быть обязательными.

1. Добавьте к названию книги поля валидации _required_ и _type_. Например:

```javascript
    var book = new Schema({
      title: {
        type: String,
        required: true
      }
    });
```

2. Добавьте проверку на минимальную длину для поля "title" (название). Например:
```javascript
    var book = new Schema({
      title: {
        type: String,
        minlength: 1,
        required: true
      }
    });
```

3. Добавьте проверку на длину для полей "author.firstName" и "author.lastName". Сделайте так, чтобы имя и фамилия автора считались невалидными, если они содержат цифры (используйте регулярное выражение [^0-9]), например:
```javascript
    var book = new Schema({
      title: {
        type: String,
        match: /[^0-9]/ // Для валидации регулярным выражением, используйте поле match как указано в примере.
      }
    });
```

4. Добавьте проверку на минимальное и максимальное значение для поля "cost" (с параметрами min и max).
5. Добавьте сообщения о провале валидации для каждого валидируемого поля. Сообщение является элементом массива, передаваемого в параметр валидации. Например:

```javascript
    var book = new Schema({
      name: {
        type: String,
        required: [true, 'Сообщение о провале валидации']
      }
    });
```

6. Mongoosejs также позволяет создавать собственные валидаторы. Например:

```javascript
    var book = new Schema({
      name: {
        type: String,
        required: [true, 'Сообщение о провале валидации'],
        validate: {
          validator: function(v) {
            return true; //Валидация всегда пройдена
          },
          message: 'Валидация провалена!'
        }
      }
    });
```

Придумайте любую валидацию для любого поля и реализуйте ее с помощью параметра validate.

8. Попытайтесь с помощью веб-интерфейса добавить книги, которые не смогут пройти валидацию (например, с пустым названием или фамилией автора с цифрами). Проверьте, была ли добавлена книга. Обратите внимание на вывод консоли Node.js (в терминале VS Code).
