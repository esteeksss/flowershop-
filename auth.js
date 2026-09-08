function validateEmail(email) {
    return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email);
}

function validatePassword(pwd) {
    return pwd.length >= 6;
}

function validateName(name) {
    return name.trim().length >= 2;
}

function renderAuthForm() {
    return `
        <div class="auth-container">
            <h2 id="formTitle">Вход</h2>
            <div id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="loginEmail" placeholder="test@mail.com">
                    <div class="error-msg" id="loginEmailError"></div>
                </div>
                <div class="form-group">
                    <label>Пароль</label>
                    <input type="password" id="loginPassword" placeholder="123456">
                    <div class="error-msg" id="loginPassError"></div>
                </div>
                <button id="loginBtn" class="btn-primary">Войти</button>
            </div>
            <div id="registerForm" style="display:none;">
                <div class="form-group">
                    <label>Имя</label>
                    <input type="text" id="regName" placeholder="Ваше имя">
                    <div class="error-msg" id="regNameError"></div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="regEmail" placeholder="example@mail.com">
                    <div class="error-msg" id="regEmailError"></div>
                </div>
                <div class="form-group">
                    <label>Пароль (мин. 6 символов)</label>
                    <input type="password" id="regPassword" placeholder="******">
                    <div class="error-msg" id="regPassError"></div>
                </div>
                <button id="registerBtn" class="btn-primary">Зарегистрироваться</button>
            </div>
            <div class="switch-auth" id="switchAuthBtn">Нет аккаунта? Зарегистрироваться</div>
        </div>
    `;
}

function attachAuthEvents() {
    let isLoginMode = true;
    const loginDiv = document.getElementById("loginForm");
    const regDiv = document.getElementById("registerForm");
    const title = document.getElementById("formTitle");
    const switchBtn = document.getElementById("switchAuthBtn");
    
    switchBtn.onclick = () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            loginDiv.style.display = "block";
            regDiv.style.display = "none";
            title.innerText = "Вход";
            switchBtn.innerText = "Нет аккаунта? Зарегистрироваться";
        } else {
            loginDiv.style.display = "none";
            regDiv.style.display = "block";
            title.innerText = "Регистрация";
            switchBtn.innerText = "Уже есть аккаунт? Войти";
        }
        document.querySelectorAll(".error-msg").forEach(el => el.innerText = "");
    };
    
    // ЛОГИН
    document.getElementById("loginBtn").onclick = () => {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        
        if (!validateEmail(email)) {
            document.getElementById("loginEmailError").innerText = "Неверный email";
            return;
        }
        
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            document.getElementById("loginPassError").innerText = "Неверный email или пароль";
            return;
        }
        setCurrentUser(email);
        showToast("✅ Вход выполнен!", "success");
        renderApp();
    };
    
    // РЕГИСТРАЦИЯ
    document.getElementById("registerBtn").onclick = () => {
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        let ok = true;
        
        document.getElementById("regNameError").innerText = "";
        document.getElementById("regEmailError").innerText = "";
        document.getElementById("regPassError").innerText = "";
        
        if (!validateName(name)) {
            document.getElementById("regNameError").innerText = "Имя минимум 2 символа";
            ok = false;
        }
        if (!validateEmail(email)) {
            document.getElementById("regEmailError").innerText = "Неверный email";
            ok = false;
        }
        if (!validatePassword(password)) {
            document.getElementById("regPassError").innerText = "Пароль минимум 6 символов";
            ok = false;
        }
        if (!ok) return;
        
        const users = getUsers();
        if (users.find(u => u.email === email)) {
            document.getElementById("regEmailError").innerText = "Email уже существует";
            return;
        }
        
        users.push({ 
            id: Date.now().toString(), 
            email, 
            password, 
            name, 
            favorites: [], 
            cart: [], 
            orders: [] 
        });
        saveUsers(users);
        setCurrentUser(email);
        showToast("✅ Регистрация успешна!", "success");
        renderApp();
    };
}