(async function() {
    //验证是否有登录，若没登录跳转到登录页面，如果有登录，获取登录信息
    //1.验证是否存在登录信息
    const resp = await API.profile();
    const user = resp.data; //用户的登录信息
    if (!user) {
        alert("未登录或登录已过期，请重新登录!");
        location.href = "./login.html";
        return;
    }

    //需要的DOM
    const doms = {
        loginId: $(".aside-account"),
        nickname: $(".aside-name"),
        close: $(".close"),
        chatContainer: $(".chat-container"),
        txtMsg: $("#txtMsg"),
        msgContainer: $(".msg-container"),
    };

    // console.log(doms);
    // 下面的代码环境，一定是登录状态

    //设置用户信息
    function setUserInfo() {
        doms.nickname.innerText = user.nickname; //设置昵称
        doms.loginId.innerText = user.loginId; //设置用户名
    }
    setUserInfo();
    //注销事件
    doms.close.addEventListener("click", function() {
        API.loginOut();
        location.href = "./login.html";
    });

    //根据消息对象 将其添加到页面
    //给我一个消息对象，添加到聊天窗口

    //  content: "女生的年龄是不能随便说的，知道不",
    //   createdAt: 1657548804582,
    //   from: null,
    //   to: "zhc",
    function addChat(chatInfo) {
        const div = $$$("div");
        div.classList.add("chat-item");
        if (chatInfo.from) {
            div.classList.add("me");
        }

        const img = $$$("img");
        img.className = "chat-avatar";
        img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

        const content = $$$("div");
        content.className = "chat-content";
        content.innerText = chatInfo.content;

        const data = $$$("div");
        data.className = "chat-date";
        data.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(data);

        doms.chatContainer.appendChild(div);
    }

    //将chatInfo.createdAt转化为0000-00-00 00:00:00 格式
    function formatDate(timestamp) {
        const data = new Date(timestamp); // 根据时间戳得到一个日期对象
        const year = data.getFullYear();
        const month = (data.getMonth() + 1).toString().padStart(2, "0");
        //.toString()将当前数字转换为字符串返回
        //.padStart(2, "0")将当前的字符串按照指定的字符在字符串开始位置填充到指定的位数，返回填充后的字符串
        const day = data.getDay().toString().padStart(2, "0");
        const hour = data.getHours().toString().padStart(2, "0");
        const minute = data.getMinutes().toString().padStart(2, "0");
        const second = data.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    //加载历史记录
    async function loadHistory() {
        const resp = await API.getHistory();
        for (const item of resp.data) {
            addChat(item);
        }
        scrollBottom();
    }
    await loadHistory();

    //让聊天区域的滚动条滚动到底部
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    //发送消息事件
    doms.msgContainer.addEventListener("submit", function(e) {
        e.preventDefault();
        sendChat();
    });

    //点击发送即可发送消息的事件
    async function sendChat() {
        //从字符串的两端删除空白字符，返回新字符串
        const content = doms.txtMsg.value.trim();
        //判断输入的内容是否为空
        if (!content) {
            return;
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(), // 得到一个当前日期对象
            content,
        });
        // 当用户点击发送时，情况输入框内容
        doms.txtMsg.value = "";
        scrollBottom();
        const resp = await API.sendChat(content);
        addChat({
            from: null,
            to: user.loginId,
            ...resp.data,
        });
        scrollBottom();
    }
    // window.sendChat = sendChat;浏览器调试
})();