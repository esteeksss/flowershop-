let activeTab = "catalog";

function showToast(msg, type) {
    const toast = document.createElement("div");
    toast.innerText = msg;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = type === "error" ? "#e91e63" : "#4caf50";
    toast.style.color = "white";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "40px";
    toast.style.zIndex = "1000";
    toast.style.fontWeight = "bold";
    toast.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Функция для рендера футера (подвала) - с правильными ссылками
function renderFooter() {
    return `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-section">
                    <h3><i class="fas fa-seedling"></i> FlowerBloom</h3>
                    <p>Магазин свежих цветов с доставкой по всему городу. Дарим радость и красоту каждый день!</p>
                    <div class="social-links">
                        <a href="https://i.pinimg.com/736x/74/7b/5d/747b5dfdb4d953410757a75930d7f9ca.jpg" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
                        <a href="https://i.pinimg.com/736x/62/9d/2d/629d2dee283627dfa28014fbceca8642.jpg" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-vk"></i></a>
                        <a href="https://i.pinimg.com/736x/8e/f2/ad/8ef2ad531bc6df5f9abe4dfc6fb0a73a.jpg" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-telegram"></i></a>
                        <a href="https://i.pinimg.com/736x/45/75/1a/45751a7b3ec960c11bfcd53a028b3820.jpg" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>
                        <a href="https://i.pinimg.com/736x/d3/52/32/d35232c20884aeda9503cbd44ae8fd8d.jpg" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4><i class="fas fa-map-marker-alt"></i> Адрес</h4>
                    <p>г. Пенза, ул. Цветочная, д. 15</p>
                    <p>м. Арбатская, выход №4</p>
                    <p>Ежедневно: 09:00 - 21:00</p>
                </div>
                
                <div class="footer-section">
                    <h4><i class="fas fa-phone-alt"></i> Контакты</h4>
                    <p><i class="fas fa-phone"></i> +7 (495) 123-45-67</p>
                    <p><i class="fab fa-whatsapp"></i> +7 (999) 123-45-67</p>
                    <p><i class="fas fa-envelope"></i> info@flowerbloom.ru</p>
                </div>
                
                <div class="footer-section">
                    <h4><i class="fas fa-info-circle"></i> Информация</h4>
                    <p><i class="fas fa-truck"></i> Доставка по городу</p>
                    <p><i class="fas fa-credit-card"></i> Оплата онлайн</p>
                    <p><i class="fas fa-gift"></i> Подарочные сертификаты</p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>© 2026 FlowerBloom - Магазин цветов. Все права защищены. | <a href=" " target="_blank">Коденфициально</a></p>
            </div>
        </footer>
    `;
}

function renderApp() {
    const container = document.getElementById("appContainer");
    const navLinks = document.getElementById("navLinks");
    const userWidget = document.getElementById("userWidget");

    if (!isLoggedIn()) {
        container.innerHTML = renderAuthForm();
        navLinks.innerHTML = "";
        userWidget.innerHTML = "";
        attachAuthEvents();
        return;
    }

    const user = getCurrentUser();
    const cartCount = user?.cart?.length || 0;
    
    navLinks.innerHTML = `
        <button class="nav-btn ${activeTab === 'catalog' ? 'active-tab' : ''}" data-tab="catalog">🌸 Каталог</button>
        <button class="nav-btn ${activeTab === 'cart' ? 'active-tab' : ''}" data-tab="cart">🛒 Корзина (${cartCount})</button>
        <button class="nav-btn ${activeTab === 'favorites' ? 'active-tab' : ''}" data-tab="favorites">❤️ Избранное (${user.favorites?.length || 0})</button>
        <button class="nav-btn ${activeTab === 'orders' ? 'active-tab' : ''}" data-tab="orders">📦 Заказы (${user.orders?.length || 0})</button>
        <button class="nav-btn ${activeTab === 'profile' ? 'active-tab' : ''}" data-tab="profile">👤 Профиль</button>
    `;
    
    userWidget.innerHTML = `
        <div class="user-info">
            <i class="fas fa-user-circle"></i>
            <span>${user.name}</span>
            <button class="logout-btn" id="logoutBtn">🚪 Выйти</button>
        </div>
    `;

    let mainContent = "";
    if (activeTab === "catalog") mainContent = renderCatalog(user);
    else if (activeTab === "cart") mainContent = renderCart(user);
    else if (activeTab === "favorites") mainContent = renderFavorites(user);
    else if (activeTab === "orders") mainContent = renderOrders(user);
    else if (activeTab === "profile") mainContent = renderProfile(user);
    
    // 🔥 ФУТЕР ТОЛЬКО НА ГЛАВНОЙ (КАТАЛОГ) 🔥
    if (activeTab === "catalog") {
        container.innerHTML = mainContent + renderFooter();
    } else {
        container.innerHTML = mainContent;
    }
    
    // Навигация по кнопкам
    document.querySelectorAll("[data-tab]").forEach(btn => {
        btn.onclick = () => {
            activeTab = btn.dataset.tab;
            renderApp();
        };
    });
    
    // Выход из аккаунта
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            logout();
            activeTab = "catalog";
            currentSearchTerm = "";
            currentSortType = "default";
            renderApp();
        };
    }
    
    // ЛОГОТИП - ВОЗВРАТ НА ГЛАВНУЮ
    const logoBtn = document.getElementById("logoBtn");
    if (logoBtn) {
        logoBtn.onclick = () => {
            activeTab = "catalog";
            currentSearchTerm = "";
            currentSortType = "default";
            renderApp();
            showToast("🏠 Добро пожаловать в главный каталог!", "success");
        };
    }
    
    // Привязываем события для текущей вкладки
    if (activeTab === "catalog") attachCatalogEvents(user);
    else if (activeTab === "cart") attachCartEvents(user);
    else if (activeTab === "favorites") attachFavEvents(user);
    else if (activeTab === "orders") attachOrdersEvents(user);
    else if (activeTab === "profile") attachProfileEvents(user);
}

// Запуск приложения
initDB();
renderApp();