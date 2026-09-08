// Ваши цветы
const FLOWERS = [
    { id: 1, name: "Букет французских роз", price: 3634, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/52/1728908628_64547052.jpg", desc: "Роскошный букет премиальных французских роз" },
    { id: 2, name: "Белые хризантемы в крафт бумаге", price: 7740, image: "https://content3.flowwow-images.com/data/flowers/1000x1000/63/1683527546_1850163.jpg", desc: "Авторские красивые особенные букеты" },
    { id: 3, name: "Подсолнухи", price: 3887, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/64/1749442962_67814264.jpg", desc: "Яркий букет из подсолнухов 9 шт" },
    { id: 4, name: "Монобукет из голубой гортензии", price: 2975, image: "https://content2.flowwow-images.com/data/flowers/524x524/68/1753615973_20026268.jpg", desc: "Букет с вниманием к форме" },
    { id: 5, name: "Коробка с эустомой", price: 1990, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/41/1758718860_15794341.jpg", desc: "Элегантность и роскошь" },
    { id: 6, name: "Французская розовая роза", price: 3870, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/92/1728904019_41706192.jpg", desc: "Нежность и любовь" },
    { id: 7, name: "Воздушное облако с маттиолой", price: 3900, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/42/1719653620_77071142.jpg", desc: "Потрясающая композиция" },
    { id: 8, name: "Кустовые розы Бомбастик", price: 3192, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/25/1710838833_54506825.jpg", desc: "Букет белой эустомы" },
    { id: 9, name: "Сирень", price: 5733, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/02/1715231862_17402602.jpg", desc: "Нежный и изящный подарок" },
    { id: 10, name: "Голубая гортензия", price: 3366, image: "https://content2.flowwow-images.com/data/flowers/524x524/20/1730471638_76101820.jpg", desc: "Нежный букет в пастельных тонах" },
    { id: 11, name: "Розовая французская роза", price: 4890, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/79/1711019436_68070279.jpg", desc: "Нежный букет с ромашками" },
    { id: 12, name: "Монобукет Нежный зефир", price: 3500, image: "https://content2.flowwow-images.com/data/flowers/1000x1000/16/1766388859_79964016.jpg", desc: "Любимая цветочная классика" }
];


function initDB() {
    if (!localStorage.getItem("users")) {
        const defaultUsers = [
            { id: "1", email: "test@mail.com", password: "123456", name: "Анна", favorites: [], cart: [], orders: [] }
        ];
        localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem("currentUser")) {
        localStorage.setItem("currentUser", "");
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users"));
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
    const email = localStorage.getItem("currentUser");
    if (!email) return null;
    const users = getUsers();
    return users.find(u => u.email === email);
}

function setCurrentUser(email) {
    localStorage.setItem("currentUser", email || "");
}

function updateUser(updatedUser) {
    let users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) users[index] = updatedUser;
    saveUsers(users);
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function logout() {
    localStorage.setItem("currentUser", "");
}

// Экспортируем всё в глобальную область
window.FLOWERS = FLOWERS;
window.initDB = initDB;
window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.updateUser = updateUser;
window.isLoggedIn = isLoggedIn;
window.logout = logout;