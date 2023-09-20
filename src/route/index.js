// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList();

  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      }},
  })
  // ↑↑ сюди вводимо JSON дані
})


class User {

  static #list = [];
  
  constructor(email, login, password) {
    this.email = email;
    this.login = login; 
    this.password = password;
    this.id = new Date().getTime();
  }
  
  static add(user) {
    this.#list.push(user);
  }
  
  static getList() {
    return this.#list;
  }
  
  static getById(id) {
    return this.#list.find((user) => user.id === id)
  }
  
  static deleteById(id) {
    const index = this.#list.findIndex(
    (user) => user.id === id,
  )
  
  if (index !== -1) {
    this.#list.splice(index, 1)
    return true;
  } else {
    return false;
  }
  }
  
  static updateById(id, data) {
  const user = this.getById(id);
    
  if (user) {
    this.update(user, data)
  }
  }

  static update(user, { email }) {
    if (email) {
      user.email = email;
    }
  }

  static verifyPassword(password) {
    this.password === password;
  }

  }


// ================================================================

router.post('/user-create', function (req, res) {

  const { email, login, password } = req.body;

  const user = new User(email, login, password);

  User.add(user);

  console.log(User.getList());

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створенний'
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {

  const { id } = req.query;

  User.deleteById(Number(id));

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видаленний'
  })
})

// ================================================================

router.post('/user-update', function (req, res) {

  const { email, id, password} = req.body;

  const user = User.getById(Number(id));

  let result = false;

  if(User.verifyPassword(password)) {
    User.update (user, { email })
    result = true;
  }
  res.render('success-info', {
    style: 'success-info',
    info: 'Email оновленний'
  })
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
