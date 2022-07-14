//封装全部通用方法
var API = (function() {
    const BASE_URL = "https://study.duyiedu.com"; //定义常量
    const TOKEN_KEY = "token"; //服务端生成的一串字符串，作为客户端进行请求的一个标识。(令牌)
    //封装get方法
    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY); // 根据键，读取本地保存的值
        if (token) {
            headers.authorization = `Bearer ${token}`; //一个HTTP安全请求首部，包含了客户端提供给服务器 便于对其自身进行认证的数据。
        }
        // fetch会返回一个Promise，该Promise会在接收完响应头后变为fulfilled
        return fetch(BASE_URL + path, { headers }); //无论是`XHR`还是`Fetch`，它们都是实现ajax的技术手段，只是API不同。
    }
    //封装post方法
    function post(path, bodyObj) {
        const headers = {
            "Content-Type": "application/json", //描述请求体使用的格式
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            headers,
            method: "POST", //请求方法
            body: JSON.stringify(bodyObj), // 将对象或数组转换为JSON搁置
            // JSON.parse(jsonString);  将JSON格式的字符串转换为对象或数组
        });
    }
    //定义注册的方法
    async function reg(userInfo) {
        const resp = await post("/api/user/reg", userInfo);
        return await resp.json(); // 用json的格式解析即将到来的响应体，返回Promise，解析完成后得到一个对象
    }
    //定义登录的方法
    async function login(loginInfo) {
        const resp = await post("/api/user/login", loginInfo);
        const result = await resp.json(); // 用json的格式解析即将到来的响应体，返回Promise，解析完成后得到一个对象
        if (result.code === 0) {
            // 登录成功
            // 将响应头中的token保存起来（localStorage）
            const token = resp.headers.get("authorization");
            localStorage.setItem(TOKEN_KEY, token);
        }
        return result;
    }
    //定义账号验证的方法
    async function exists(loginId) {
        const resp = await get("/api/user/exists?loginId=" + loginId);
        return await resp.json(); // 用json的格式解析即将到来的响应体，返回Promise，解析完成后得到一个对象
    }
    //定义当前登录的用户信息的方法
    async function profile() {
        const resp = await get("/api/user/profile");
        return await resp.json(); // 用json的格式解析即将到来的响应体，返回Promise，解析完成后得到一个对象
    }
    //定义发送消息的方法
    async function sendChat(content) {
        const resp = await post("/api/chat", {
            content,
        });
        return await resp.json(); // 用json的格式解析即将到来的响应体，返回Promise，解析完成后得到一个对象
    }
    //定义获取聊天记录的方法
    async function getHistory() {
        const resp = await get("/api/chat/history");
        return await resp.json(); // 用json的格式解析即将到来的响应体，返回Promise，解析完成后得到一个对象
    }

    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }
    //把函数返回，使得其他的js文件能够使用这些函数
    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut,
    };
})();