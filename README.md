# Лабораторая работа №4.
## Взаимодействие с базой данных по средствам объектной модели доступа
В этой лабораторной работе мы напишем объектную модель для коллекций базы MongoDB, что позволит удобно и понятно создавать документы коллекций, а также иметь строгое описание хранимых сущностей.

## 1. Подготовка окружения
Установим __Mongoosejs__ в наше приложение.

__Mongoosejs__ - это ORM-модуль для MongoDB, позволяющий вам использовать объектные модели в своем приложении для работы с данными.

В первой части лабораторной работы необходимо подключить модуль __Mongoosejs__ к нашему приложению и с помощью него подключиться к базе данных.

1.1 Подключение модуля

Подключение __Mongoosejs__ аналогично подключению модуля __mongodb__, с которым вы работали в лабораторной работе №3. Нужно выполнить следующую последовательность действий:

1. С помощью _npm install_ установить пакет [mongoose](https://www.npmjs.com/package/mongoose) и добавьте его в зависимости в package.json.
2. Закомментируйте все строки в файле _db\index.js_ (там, где мы описывали методы для подключения к базе данных).
3. В файле _db\index.js_ с помощью CommonJS импортируйте объект mongoose (аналогично тому, как мы импортировали _MongoClient_ в предыдущей лабораторной работе).
4. Создайте метод _connect_ и экспортируйте его:

```javascript
module.exports = {
  connect(url) {
    return mongoose.connect(url, {
      useMongoClient: true,
    })
    .then(db => (_db = db))
    .catch(err => Promise.reject(err));
  }
};
```

5. Создайте методы _getInstance_ и _getCollection_, аналогичные созданным ранее в лабораторной работе №3.
6. Запустите приложение. Убедитесь, что все работает так, как работало в результате выполнения лабораторной работы №3.

## Схемы, типы, модели
Всё в Mongoose начинается описания схемы. Каждая схема по своей сути привязывается к MongoDB коллекции и описывает модель хранимых в ней документов. Модели представляют собой объекты, собранные конструктором схемы. Экземпляры этих моделей представляют собой документы, которые могут быть сохранены и извлечены из нашей базы данных.

- создаём схему для коллекции с использованием типов
- создаём модель, пробуем сохранить в коллекции
- проверям что всё сделали правильно и пробуем получить сохранённый документ из бд
- имплементим в логику приложения нашу схему и запросы на получение документов из коллекции
- кастомные методы, кастомные квери - ??? 

## Валидация
Валидация - это проверка некоего объекта на удовлетворение определенным требованиям.

В __Mongoosejs__ валидация реализована с помощью __middleware__ (так называемого "промежуточного программного обеспечения"). Проверка объекта на соответствие заданным требованиям будет происходить после начала сохранения. Если валидация будет провалена (объект не удовлетворяет требованиям), то в коллбек метода сохранения будет передана ошибка. Также валидация может быть проведена вручную с помощью методов _validate(callback)_ или _validateSync()_. Подробнее об этом можно прочитать [здесь](http://mongoosejs.com/docs/validation.html).

__Mongoosejs__ поддерживает встроенную валидацию. Для чисел это минимальное и максимальное значение, для строк - максимальная и минимальная длина, а также проверка на регулярные выражения. 

Реализуем в нашем приложении валидацию следующих полей: 
- Название: не должно быть пустым;
- Автор: фамилия и имя не должны быть пустыми, должны состоять только из букв и символов __-__, __'__;
- Стоимость: не должна быть отрицательной и превышать 10000.
- Все поля должны быть обязательными.

1. Добавьте к схеме книги поля валидации _required_ и _type_. Тип полей можно посмотреть в файле _mock.js_. Например:

```javascript
    var book = new Schema({
      name: {
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

3. Добавьте проверку на длину и на содержащиеся символы для полей "author.firstName" и "author.lastName". Для проверки символов используйте регулярные выражения (TODO).
4.Добавьте проверку на минимальное и максимальное значение для поля "cost" (аналогично пункту 1, но с параметрами min и max).
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
        },
      }
    });
```

Придумайте любую валидацию для любого поля и реализуйте ее с помощью параметра validate.

7. Добавьте проверку на валидацию в сервисы, где данные отправляются в базу данных (_validate(callback)_ или _validateSync()_ или в коллбек для метода 'save').
8. Попытайтесь с помощью веб-интерфейса добавить книги, которые не смогут пройти валидацию (например, с пустым названием или отрицательной стоимостью). Проверьте результат.
