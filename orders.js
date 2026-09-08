function createOrder(user, flowerId) {
    const flower = FLOWERS.find(f => f.id === flowerId);
    const orders = user.orders || [];
    const newOrder = {
        id: Date.now(),
        items: [{ name: flower.name, price: flower.price, quantity: 1, image: flower.image }],
        total: flower.price,
        itemsText: flower.name,
        date: new Date().toLocaleString('ru-RU'),
        status: "Оформлен"
    };
    orders.unshift(newOrder);
    user.orders = orders;
    updateUser(user);
    showToast(`🎉 "${flower.name}" заказан!`, "success");
    renderApp();
}

function deleteOrder(user, orderId) {
    const orders = user.orders || [];
    const orderToDelete = orders.find(o => o.id === orderId);
    const filteredOrders = orders.filter(o => o.id !== orderId);
    user.orders = filteredOrders;
    updateUser(user);
    showToast(`❌ Заказ от ${orderToDelete?.date} удалён`, "info");
    renderApp();
}

function renderOrders(user) {
    const orders = user?.orders || [];
    if (orders.length === 0) {
        return `<div class="empty-msg"><i class="fas fa-box-open"></i> У вас пока нет заказов</div>`;
    }
    return `
        <h2><i class="fas fa-truck"></i> История заказов (${orders.length})</h2>
        <div class="items-list">
            ${orders.map(order => `
                <div class="list-item">
                    <div style="flex:1;">
                        <div style="display:flex; gap:15px; align-items:flex-start; flex-wrap:wrap;">
                            ${order.items && order.items.length > 0 ? order.items.map(item => `
                                <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                                    <img src="${item.image}" width="50" height="50" style="border-radius:10px; object-fit:cover;">
                                    <div>
                                        <strong>${item.name}</strong><br>
                                        <span style="color:#e91e63;">${item.price.toLocaleString()} ₽</span>
                                        <span style="color:#666;"> x ${item.quantity}</span>
                                    </div>
                                </div>
                            `).join('') : `
                                <div>
                                    <strong>${order.itemsText || 'Заказ'}</strong><br>
                                    <span style="color:#e91e63;">${order.total?.toLocaleString() || 0} ₽</span>
                                </div>
                            `}
                        </div>
                        <div style="margin-top:10px;">
                            <small style="color:#999;">📅 ${order.date}</small>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <span style="background:#4caf50; padding:4px 15px; border-radius:20px; color:white;">✅ ${order.status}</span>
                        <button class="delete-order-btn" data-id="${order.id}" style="background:#e91e63; color:white; border:none; padding:5px 12px; border-radius:20px; cursor:pointer;">
                            🗑️ Удалить
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function attachOrdersEvents(user) {
    document.querySelectorAll(".delete-order-btn").forEach(btn => {
        btn.onclick = () => {
            const orderId = parseInt(btn.dataset.id);
            if (confirm("Вы уверены, что хотите удалить этот заказ?")) {
                deleteOrder(user, orderId);
            }
        };
    });
}