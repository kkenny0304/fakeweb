// script.js

// ===== 1. 多國語言文字對照表 =====
const translations = {
    zh: {
        title:       "CUBE 網路銀行",
        idLabel:     "身分證字號",
        idPlaceholder: "請輸入身分證字號",
        userIdLabel: "用戶代號",
        userIdPlaceholder: "請輸入6至12位用戶代號英數混合",
        pwdLabel:    "網銀密碼",
        pwdPlaceholder: "請輸入6至16位密碼英數混合",
        rememberMe:  "記住我",
        resetLink:   "申請／重設網銀密碼",
        loginButton: "登入",
        // … 既有項目 …
        subCard:    "晶片金融卡登入",
        subOpen:    "我要開戶",
        subFAQ:     "常見問題",
        navAnnounce:"公告訊息",
        navFriendly:"友善個人網銀",
        navContact: "聯絡我們",
        navService: "服務據點",
        browse:     "瀏覽器建議",
        insurance:  "存款保險",
        copyright:  "©國泰世華商業銀行股份有限公司"
    },
    en: {
        title:       "CUBE Online Banking",
        idLabel:     "ID Number",
        idPlaceholder: "Enter your ID number",
        userIdLabel: "User ID",
        userIdPlaceholder: "Enter 6–12 alphanumeric characters",
        pwdLabel:    "Password",
        pwdPlaceholder: "Enter 6–16 alphanumeric characters",
        rememberMe:  "Remember me",
        resetLink:   "Apply/Reset password",
        loginButton: "Log In",
        subCard:    "Card Login",
        subOpen:    "Open Account",
        subFAQ:     "FAQ",
        navAnnounce:"Announcements",
        navFriendly:"Friendly IB",
        navContact: "Contact Us",
        navService: "Branches",
        browse:     "Browser Tips",
        insurance:  "Deposit Insurance",
        copyright:  "©Cathay United Bank Co., Ltd."
    }
};

// ===== 2. 切換語言函式 =====
function switchLanguage(lang) {
    // 更新文字
    document.querySelectorAll("[data-text]").forEach(el => {
        const key = el.getAttribute("data-text");
        el.innerText = translations[lang][key];
    });
    // 更新 placeholder
    document.querySelectorAll("[data-placeholder]").forEach(el => {
        const key = el.getAttribute("data-placeholder");
        el.placeholder = translations[lang][key];
    });
}

// ===== 3. 身分證驗證函式 =====
function validateTWID(id) {
    // 格式檢查：首碼英、次碼1或2、後面8碼數字
    if (!/^[A-Z][12]\d{8}$/.test(id)) return false;

    // 英文字母對應數值表（跳過 I、O）
    const map = {
        A:10,B:11,C:12,D:13,E:14,F:15,
        G:16,H:17,J:18,K:19,L:20,M:21,
        N:22,P:23,Q:24,R:25,S:26,T:27,
        U:28,V:29,X:30,Y:31,W:32,Z:33
    };

    const n1 = map[id[0]];
    // 首碼拆成兩位：十位＊1 + 個位＊9
    let total = Math.floor(n1/10)*1 + (n1%10)*9;

    // 第3–9碼的權重：8,7,6,5,4,3,2,1
    const weights = [8,7,6,5,4,3,2,1];
    for (let i = 0; i < weights.length; i++) {
        total += Number(id[i+1]) * weights[i];
    }

    // 計算檢查碼
    const checkDigit = (10 - (total % 10)) % 10;
    return checkDigit === Number(id[9]);
}
document.addEventListener("DOMContentLoaded", () => {
    // 3.1 語言切換
    const langSelector = document.getElementById("language");
    switchLanguage(langSelector.value);
    langSelector.addEventListener("change", e => switchLanguage(e.target.value));

    // 3.2 表單、欄位、錯誤提示
    const form        = document.getElementById("loginForm");
    const idInput     = document.getElementById("idNumber");
    const idError     = document.getElementById("idError");
    const userIdInput = document.getElementById("userId");
    const userIdError = document.getElementById("userIdError");

    form.addEventListener("submit", e => {
        const idVal   = idInput.value.trim().toUpperCase();
        const uidVal  = userIdInput.value.trim();

        // 3.2.1 身分證檢查
        if (!validateTWID(idVal)) {
            e.preventDefault();
            idInput.classList.add("invalid");
            idError.textContent = "身分證字號錯誤";
            return;   // 不再往下檢查
        }

        // 3.2.2 用戶代號檢查：6–12碼，英數混合
        const uidRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{6,12}$/;
        if (!uidRegex.test(uidVal)) {
            e.preventDefault();
            userIdInput.classList.add("invalid");
            userIdError.textContent = "用戶代號錯誤";
            return;
        }

        // 驗證都通過，表單就會送出
    });

    // 3.3 輸入時清除錯誤樣式
    idInput.addEventListener("input", () => {
        idInput.classList.remove("invalid");
        idError.textContent = "";
    });
    userIdInput.addEventListener("input", () => {
        userIdInput.classList.remove("invalid");
        userIdError.textContent = "";
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // … 你原本的程式碼 …

    // 1. 取得「記住我」勾選框
    const rememberMe = document.getElementById("rememberMe");

    // 2. 監聽 change 事件
    rememberMe.addEventListener("change", function(e) {
        if (this.checked) {
            // 3. 跳出確認警示
            const ok = confirm(
                "您勾選了「記住我」，這將在此裝置上保存您的帳號，可能會增加安全風險，確定要繼續嗎？"
            );
            // 4. 如果按取消，就把他取消勾選
            if (!ok) {
                this.checked = false;
            }
        }
    });
});

// ===== 4. DOMContentLoaded：綁定事件 =====
document.addEventListener("DOMContentLoaded", () => {
    // 4.1 語言切換監聽
    const langSelector = document.getElementById("language");
    switchLanguage(langSelector.value);
    langSelector.addEventListener("change", e => {
        switchLanguage(e.target.value);
    });


    // 4.2 表單驗證
    const form    = document.getElementById("loginForm");
    const idInput = document.getElementById("idNumber");
    const idError = document.getElementById("idError");

    form.addEventListener("submit", e => {
        const val = idInput.value.trim().toUpperCase();
        if (!validateTWID(val)) {
            e.preventDefault();                     // 阻擋送出
            idInput.classList.add("invalid");       // 紅框提示
            idError.textContent = "身分證字號錯誤"; // 固定錯誤訊息
        }
    });

    // 4.3 輸入時移除錯誤樣式
    idInput.addEventListener("input", () => {
        idInput.classList.remove("invalid");
        idError.textContent = "";
    });
});

