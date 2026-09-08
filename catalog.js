let currentSearchTerm = "";
let currentSortType = "default";

// Функция открытия модального окна с описанием товара - делаем глобальной
window.openModal = function(flower, user) {
    console.log("openModal вызван", flower);
    
    // Удаляем старый модал, если есть
    const oldModal = document.getElementById("productModal");
    if (oldModal) oldModal.remove();
    
    const isFav = user?.favorites?.some(f => f.id === flower.id) || false;
    
    const modalHTML = `
        <div id="productModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-info-circle"></i> ${flower.name}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <img class="modal-img" src="${flower.image}" alt="${flower.name}" onerror="this.src='https://via.placeholder.com/300x220?text=Flower'">
                    <div class="modal-price">${flower.price.toLocaleString()} ₽</div>
                    <div class="modal-desc">
                        <p>${flower.desc}</p>
                        <p style="margin-top: 10px;"><strong>Артикул:</strong> FL-${flower.id}</p>
                        <p><strong>Доставка:</strong> по всему городу</p>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-fav-btn ${isFav ? 'active' : ''}" data-id="${flower.id}">
                            <i class="fas fa-heart"></i> ${isFav ? 'В избранном' : 'В избранное'}
                        </button>
                        <button class="modal-cart-btn" data-id="${flower.id}">
                            <i class="fas fa-shopping-cart"></i> В корзину
                        </button>
                        <button class="modal-order-btn" data-id="${flower.id}">
                            <i class="fas fa-bolt"></i> Купить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById("productModal");
    const closeBtn = modal.querySelector(".close-modal");
    
    // Закрытие по крестику
    closeBtn.onclick = () => {
        modal.remove();
    };
    
    // Закрытие по клику вне окна
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // Кнопка избранного в модалке
    const favBtn = modal.querySelector(".modal-fav-btn");
    favBtn.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(user, flower.id);
        setTimeout(() => {
            const isNowFav = user?.favorites?.some(f => f.id === flower.id);
            if (isNowFav) {
                favBtn.classList.add("active");
                favBtn.innerHTML = '<i class="fas fa-heart"></i> В избранном';
            } else {
                favBtn.classList.remove("active");
                favBtn.innerHTML = '<i class="fas fa-heart"></i> В избранное';
            }
            updateCatalogButtons(user);
        }, 50);
    };
    
    // Кнопка корзины в модалке
    const cartBtn = modal.querySelector(".modal-cart-btn");
    cartBtn.onclick = (e) => {
        e.stopPropagation();
        addToCart(user, flower.id);
        modal.remove();
    };
    
    // Кнопка покупки в модалке
    const orderBtn = modal.querySelector(".modal-order-btn");
    orderBtn.onclick = (e) => {
        e.stopPropagation();
        createOrder(user, flower.id);
        modal.remove();
    };
};

// Обновление кнопок в каталоге
function updateCatalogButtons(user) {
    const favIds = user?.favorites?.map(f => f.id) || [];
    document.querySelectorAll(".fav-btn").forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const isFav = favIds.includes(id);
        if (isFav) {
            btn.classList.add("active");
            btn.innerHTML = '<i class="fas fa-heart"></i> В избранном';
        } else {
            btn.classList.remove("active");
            btn.innerHTML = '<i class="fas fa-heart"></i> В избранное';
        }
    });
}

function renderCatalog(user) {
    let filteredFlowers = FLOWERS.filter(flower => 
        flower.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        flower.desc.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
    
    if (currentSortType === "price-asc") {
        filteredFlowers.sort((a, b) => a.price - b.price);
    } else if (currentSortType === "price-desc") {
        filteredFlowers.sort((a, b) => b.price - a.price);
    } else if (currentSortType === "name-asc") {
        filteredFlowers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSortType === "name-desc") {
        filteredFlowers.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    const favIds = user?.favorites?.map(f => f.id) || [];
    
    return `
        <h2><i class="fas fa-store"></i> Наш каталог цветов</h2>
        <div class="controls-bar">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔍 Поиск по названию..." value="${currentSearchTerm}">
            </div>
            <div class="sort-box">
                <select id="sortSelect">
                    <option value="default" ${currentSortType === "default" ? "selected" : ""}>📌 По умолчанию</option>
                    <option value="price-asc" ${currentSortType === "price-asc" ? "selected" : ""}>💰 Цена: по возрастанию</option>
                    <option value="price-desc" ${currentSortType === "price-desc" ? "selected" : ""}>💰 Цена: по убыванию</option>
                    <option value="name-asc" ${currentSortType === "name-asc" ? "selected" : ""}>🔤 Название: А-Я</option>
                    <option value="name-desc" ${currentSortType === "name-desc" ? "selected" : ""}>🔤 Название: Я-А</option>
                </select>
            </div>
        </div>
        <div class="results-count">🌸 Найдено: ${filteredFlowers.length} из ${FLOWERS.length}</div>
        <div class="catalog-grid">
            ${filteredFlowers.map(flower => `
                <div class="flower-card" data-id="${flower.id}" style="cursor: pointer;">
                    <img class="flower-img" src="${flower.image}" alt="${flower.name}" onerror="this.src='https://via.placeholder.com/300x220?text=Flower'">
                    <div class="flower-info">
                        <div class="flower-title" title="${flower.name}">${flower.name.length > 40 ? flower.name.substring(0, 40) + '...' : flower.name}</div>
                        <div class="flower-price">${flower.price.toLocaleString()} ₽</div>
                        <div class="card-actions">
                            <button class="fav-btn ${favIds.includes(flower.id) ? 'active' : ''}" data-id="${flower.id}">
                                <i class="fas fa-heart"></i> ${favIds.includes(flower.id) ? 'В избранном' : 'В избранное'}
                            </button>
                            <button class="cart-btn" data-id="${flower.id}">
                                <i class="fas fa-shopping-cart"></i> В корзину
                            </button>
                            <button class="order-btn" data-id="${flower.id}">
                                <i class="fas fa-bolt"></i> Купить
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        ${filteredFlowers.length === 0 ? '<div class="empty-msg">😔 Ничего не найдено</div>' : ''}
    `;
}

function attachCatalogEvents(user) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        
        newSearchInput.oninput = (e) => {
            currentSearchTerm = e.target.value;
            updateCatalogOnly(user);
        };
    }
    
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.onchange = (e) => {
            currentSortType = e.target.value;
            updateCatalogOnly(user);
        };
    }
    
    // Клик по карточке для открытия модального окна
    document.querySelectorAll(".flower-card").forEach(card => {
        // Убираем старый обработчик, чтобы не было дублирования
        card.removeEventListener('click', card._clickHandler);
        card._clickHandler = (e) => {
            // Если кликнули НЕ на кнопку
            if (!e.target.closest('.fav-btn') && !e.target.closest('.cart-btn') && !e.target.closest('.order-btn')) {
                const flowerId = parseInt(card.dataset.id);
                const flower = FLOWERS.find(f => f.id === flowerId);
                if (flower) {
                    window.openModal(flower, user);
                }
            }
        };
        card.addEventListener('click', card._clickHandler);
    });
    
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.removeEventListener('click', btn._favHandler);
        btn._favHandler = (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleFavorite(user, id);
        };
        btn.addEventListener('click', btn._favHandler);
    });
    
    document.querySelectorAll(".cart-btn").forEach(btn => {
        btn.removeEventListener('click', btn._cartHandler);
        btn._cartHandler = (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(user, id);
        };
        btn.addEventListener('click', btn._cartHandler);
    });
    
    document.querySelectorAll(".order-btn").forEach(btn => {
        btn.removeEventListener('click', btn._orderHandler);
        btn._orderHandler = (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            createOrder(user, id);
        };
        btn.addEventListener('click', btn._orderHandler);
    });
}

function updateCatalogOnly(user) {
    let filteredFlowers = FLOWERS.filter(flower => 
        flower.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        flower.desc.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
    
    if (currentSortType === "price-asc") {
        filteredFlowers.sort((a, b) => a.price - b.price);
    } else if (currentSortType === "price-desc") {
        filteredFlowers.sort((a, b) => b.price - a.price);
    } else if (currentSortType === "name-asc") {
        filteredFlowers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSortType === "name-desc") {
        filteredFlowers.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    const favIds = user?.favorites?.map(f => f.id) || [];
    
    const catalogGrid = document.querySelector(".catalog-grid");
    const resultsCount = document.querySelector(".results-count");
    
    if (catalogGrid) {
        catalogGrid.innerHTML = filteredFlowers.map(flower => `
            <div class="flower-card" data-id="${flower.id}" style="cursor: pointer;">
                <img class="flower-img" src="${flower.image}" alt="${flower.name}" onerror="this.src='https://via.placeholder.com/300x220?text=Flower'">
                <div class="flower-info">
                    <div class="flower-title" title="${flower.name}">${flower.name.length > 40 ? flower.name.substring(0, 40) + '...' : flower.name}</div>
                    <div class="flower-price">${flower.price.toLocaleString()} ₽</div>
                    <div class="card-actions">
                        <button class="fav-btn ${favIds.includes(flower.id) ? 'active' : ''}" data-id="${flower.id}">
                            <i class="fas fa-heart"></i> ${favIds.includes(flower.id) ? 'В избранном' : 'В избранное'}
                        </button>
                        <button class="cart-btn" data-id="${flower.id}">
                            <i class="fas fa-shopping-cart"></i> В корзину
                        </button>
                        <button class="order-btn" data-id="${flower.id}">
                            <i class="fas fa-bolt"></i> Купить
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        if (resultsCount) {
            resultsCount.innerHTML = `🌸 Найдено: ${filteredFlowers.length} из ${FLOWERS.length}`;
        }
        
        if (filteredFlowers.length === 0) {
            if (!document.querySelector(".empty-msg") && catalogGrid.parentNode) {
                const emptyMsg = document.createElement("div");
                emptyMsg.className = "empty-msg";
                emptyMsg.innerHTML = "😔 Ничего не найдено";
                catalogGrid.parentNode.appendChild(emptyMsg);
            }
        } else {
            const existingEmpty = document.querySelector(".empty-msg");
            if (existingEmpty) existingEmpty.remove();
        }
        
        // Привязываем события к новым элементам
        document.querySelectorAll(".flower-card").forEach(card => {
            card.removeEventListener('click', card._clickHandler);
            card._clickHandler = (e) => {
                if (!e.target.closest('.fav-btn') && !e.target.closest('.cart-btn') && !e.target.closest('.order-btn')) {
                    const flowerId = parseInt(card.dataset.id);
                    const flower = FLOWERS.find(f => f.id === flowerId);
                    if (flower) {
                        window.openModal(flower, user);
                    }
                }
            };
            card.addEventListener('click', card._clickHandler);
        });
        
        document.querySelectorAll(".fav-btn").forEach(btn => {
            btn.removeEventListener('click', btn._favHandler);
            btn._favHandler = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                toggleFavorite(user, id);
            };
            btn.addEventListener('click', btn._favHandler);
        });
        
        document.querySelectorAll(".cart-btn").forEach(btn => {
            btn.removeEventListener('click', btn._cartHandler);
            btn._cartHandler = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                addToCart(user, id);
            };
            btn.addEventListener('click', btn._cartHandler);
        });
        
        document.querySelectorAll(".order-btn").forEach(btn => {
            btn.removeEventListener('click', btn._orderHandler);
            btn._orderHandler = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                createOrder(user, id);
            };
            btn.addEventListener('click', btn._orderHandler);
        });
    }
}

function toggleFavorite(user, flowerId) {
    let favorites = user.favorites || [];
    const exists = favorites.some(f => f.id === flowerId);
    const flower = FLOWERS.find(f => f.id === flowerId);
    
    if (exists) {
        favorites = favorites.filter(f => f.id !== flowerId);
        showToast(`❌ ${flower.name} удалён из избранного`, "info");
    } else {
        favorites.push({ id: flower.id, name: flower.name, price: flower.price, image: flower.image });
        showToast(`❤️ ${flower.name} добавлен в избранное!`, "success");
    }
    user.favorites = favorites;
    updateUser(user);
    
    updateCatalogButtons(user);
    
    const favNavBtn = document.querySelector('[data-tab="favorites"]');
    if (favNavBtn) {
        favNavBtn.innerHTML = `❤️ Избранное (${favorites.length})`;
    }
}