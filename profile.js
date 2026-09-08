function renderProfile(user) {
    return `
        <div class="profile-card">
            <div class="profile-avatar"><i class="fas fa-user-circle"></i></div>
            <h2>${user.name}</h2>
            <p><i class="fas fa-envelope"></i> ${user.email}</p>
            <p><i class="fas fa-heart"></i> В избранном: ${user.favorites?.length || 0}</p>
            <p><i class="fas fa-shopping-bag"></i> Заказов: ${user.orders?.length || 0}</p>
            <hr style="margin: 20px 0;">
            <h3>✏️ Редактировать профиль</h3>
            <div class="form-group">
                <label>Имя</label>
                <input type="text" id="profileName" value="${user.name}">
            </div>
            <div class="form-group">
                <label>Новый пароль</label>
                <input type="password" id="profilePassword" placeholder="Оставьте пустым">
            </div>
            <button id="updateProfileBtn" class="btn-primary">Сохранить</button>
        </div>
    `;
}

function attachProfileEvents(user) {
    const updateBtn = document.getElementById("updateProfileBtn");
    if (updateBtn) {
        updateBtn.onclick = () => {
            const newName = document.getElementById("profileName").value.trim();
            const newPass = document.getElementById("profilePassword").value;
            
            if (!validateName(newName)) {
                showToast("Имя минимум 2 символа", "error");
                return;
            }
            if (newPass && !validatePassword(newPass)) {
                showToast("Пароль минимум 6 символов", "error");
                return;
            }
            
            user.name = newName;
            if (newPass) user.password = newPass;
            updateUser(user);
            showToast("Профиль обновлён!", "success");
            renderApp();
        };
    }
}