function renderFavorites(user) {
    const favorites = user?.favorites || [];
    if (favorites.length === 0) {
        return `<div class="empty-msg"><i class="far fa-heart"></i> Нет избранных цветов</div>`;
    }
    return `
        <h2><i class="fas fa-heart"></i> Мои любимые цветы (${favorites.length})</h2>
        <div class="items-list">
            ${favorites.map(fav => `
                <div class="list-item">
                    <div style="display:flex; gap:15px; align-items:center;">
                        <img src="${fav.image}" width="70" height="70" style="border-radius:10px; object-fit:cover;">
                        <div><strong>${fav.name}</strong><br><span style="color:#e91e63;">${fav.price.toLocaleString()} ₽</span></div>
                    </div>
                    <div>
                        <button class="remove-fav-btn" data-id="${fav.id}" style="background:#fce4ec; border:none; padding:8px 15px; border-radius:20px; cursor:pointer;">🗑️ Удалить</button>
                        <button class="order-from-fav" data-id="${fav.id}" style="background:#4caf50; color:white; border:none; padding:8px 15px; border-radius:20px; cursor:pointer;">🛒 Заказать</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function attachFavEvents(user) {
    document.querySelectorAll(".remove-fav-btn").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            user.favorites = user.favorites.filter(f => f.id !== id);
            updateUser(user);
            showToast("Удалено из избранного", "info");
            renderApp();
        };
    });
    
    document.querySelectorAll(".order-from-fav").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            createOrder(user, id);
        };
    });
}