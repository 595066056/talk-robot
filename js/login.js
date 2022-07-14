const loginIdValidator = new FieldValidator("txtLoginId", function(val) {
    if (!val) {
        return "请填入账号";
    }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", function(val) {
    if (!val) {
        return "请填写密码";
    }
});

const form = $(".user-form");

form.onsubmit = async function(e) {
    e.preventDefault();
    const result = await FieldValidator.validate(
        loginIdValidator,
        loginPwdValidator
    );
    if (!result) {
        return; // 验证未通过
    }
    const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象
    const data = Object.fromEntries(formData.entries());
    //.entries()获取对象属性名和属性值组成的数组
    //.fromEntries()将属性名和属性值的数组转换为对象
    const resp = await API.login(data);
    if (resp.code === 0) {
        alert("登录成功！点击确定，跳转到首页");
        location.href = "./index.html"; //获取或设置页面当前地址;(设置地址回导致页面跳转)
    } else {
        loginIdValidator.p.innerText = "账号或密码错误，请重新输入";
        loginPwdValidator.input.value = "";
    }
};