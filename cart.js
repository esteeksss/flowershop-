// Корзина (хранится в объекте user как cart: [])
function addToCart(user, flowerId) {
    const flower = FLOWERS.find(f => f.id === flowerId);
    if (!flower) return;
    
    let cart = user.cart || [];
    const existingItem = cart.find(item => item.id === flowerId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        showToast(`🛒 ${flower.name} добавлен ещё раз!`, "success");
    } else {
        cart.push({ 
            id: flower.id, 
            name: flower.name, 
            price: flower.price, 
            image: flower.image, 
            quantity: 1 
        });
        showToast(`🛒 ${flower.name} добавлен в корзину!`, "success");
    }
    
    user.cart = cart;
    updateUser(user);
    renderApp();
}

function removeFromCart(user, flowerId) {
    let cart = user.cart || [];
    cart = cart.filter(item => item.id !== flowerId);
    user.cart = cart;
    updateUser(user);
    showToast("🗑️ Товар удалён из корзины", "info");
    renderApp();
}

function updateCartQuantity(user, flowerId, newQuantity) {
    let cart = user.cart || [];
    const item = cart.find(item => item.id === flowerId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(user, flowerId);
        } else {
            item.quantity = newQuantity;
            user.cart = cart;
            updateUser(user);
            renderApp();
        }
    }
}

function getCartTotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

function checkout(user) {
    const cart = user.cart || [];
    if (cart.length === 0) {
        showToast("Корзина пуста! Добавьте цветы.", "error");
        return;
    }
    
    // Создаём ОДИН заказ на всю корзину, а не по одному на каждый товар
    const totalAmount = getCartTotal(cart);
    const itemsList = cart.map(item => `${item.name} x${item.quantity || 1}`).join(", ");
    
    const newOrder = {
        id: Date.now(),
        items: cart.map(item => ({ 
            name: item.name, 
            price: item.price, 
            quantity: item.quantity || 1,
            image: item.image 
        })),
        total: totalAmount,
        itemsText: itemsList,
        date: new Date().toLocaleString('ru-RU'),
        status: "Оформлен"
    };
    
    // Добавляем заказ к существующим
    const existingOrders = user.orders || [];
    user.orders = [newOrder, ...existingOrders];
    
    // Очищаем корзину
    user.cart = [];
    updateUser(user);
    
    showToast(`🎉 Заказ оформлен! Сумма: ${totalAmount.toLocaleString()} ₽`, "success");
    renderApp();
}

function renderCart(user) {
    const cart = user?.cart || [];
    
    if (cart.length === 0) {
        return `<div class="empty-msg"><i class="fas fa-shopping-cart"></i> Корзина пуста<br>Добавьте цветы из каталога!</div>`;
    }
    
    const total = getCartTotal(cart);
    
    return `
        <h2><i class="fas fa-shopping-cart"></i> Моя корзина (${cart.length} товаров)</h2>
        <div class="items-list">
            ${cart.map(item => `
                <div class="list-item">
                    <div style="display:flex; gap:15px; align-items:center;">
                        <img src="${item.image}" width="70" height="70" style="border-radius:10px; object-fit:cover;">
                        <div>
                            <strong>${item.name}</strong><br>
                            <span style="color:#e91e63;">${item.price.toLocaleString()} ₽</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button class="cart-qty-btn" data-id="${item.id}" data-change="-1" style="background:#fce4ec; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer;">-</button>
                        <span style="min-width:30px; text-align:center;"><strong>${item.quantity || 1}</strong></span>
                        <button class="cart-qty-btn" data-id="${item.id}" data-change="1" style="background:#fce4ec; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer;">+</button>
                        <button class="remove-cart-btn" data-id="${item.id}" style="background:#e91e63; color:white; border:none; padding:5px 12px; border-radius:20px; cursor:pointer;">Удалить</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="background:white; border-radius:20px; padding:1.5rem; margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
            <div>
                <strong style="font-size:1.2rem;">Итого: ${total.toLocaleString()} ₽</strong>
            </div>
            <button id="checkoutBtn" style="background:#4caf50; color:white; border:none; padding:12px 30px; border-radius:30px; font-size:1rem; cursor:pointer; font-weight:bold;">
                🛍️ Оформить заказ
            </button>
        </div>
    `;
}

function attachCartEvents(user) {
    // Кнопки изменения количества
    document.querySelectorAll(".cart-qty-btn").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const change = parseInt(btn.dataset.change);
            const cart = user.cart || [];
            const item = cart.find(i => i.id === id);
            if (item) {
                const newQty = (item.quantity || 1) + change;
                updateCartQuantity(user, id, newQty);
            }
        };
    });
    
    // Кнопки удаления из корзины
    document.querySelectorAll(".remove-cart-btn").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(user, id);
        };
    });
    
    // Кнопка оформления заказа
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            checkout(user);
        };
    }
}