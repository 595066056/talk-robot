// 验证账号规则
const loginIdValidator = new FieldValidator("txtLoginId", async function(val) {
    if (!val) {
        return "请填写账号";
    }
    const resp = await API.exists(val);
    if (resp.data) {
        // 账号已存在
        return "该账号已被占用，请重新选择一个账号名";
    }
});
// 验证昵称规则
const nicknameValidator = new FieldValidator("txtNickname", function(val) {
    if (!val) {
        return "请填写昵称";
    }
});
// 验证密码规则
const loginPwdValidator = new FieldValidator("txtLoginPwd", function(val) {
    if (!val) {
        return "请填写密码";
    }
});
// 再次验证密码规则
const loginPwdConfirmValidator = new FieldValidator(
    "txtLoginPwdConfirm",
    function(val) {
        if (!val) {
            return "请填写确认密码";
        }
        if (val !== loginPwdValidator.input.value) {
            return "两次密码不一致";
        }
    }
);

const form = $(".user-form");

form.onsubmit = async function(e) {
    e.preventDefault(); //阻止默认操作
    //w3c的方法是e.preventDefault()，IE则是使用e.returnValue = false
    const result = await FieldValidator.validate(
        loginIdValidator,
        nicknameValidator,
        loginPwdValidator,
        loginPwdConfirmValidator
    );
    if (!result) {
        return; // 验证未通过
    }
    // 获得一个对象，装有用户输入各个文本输入的数据
    const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象
    const data = Object.fromEntries(formData.entries());
    //.entries()获取对象属性名和属性值组成的数组
    //.fromEntries()将属性名和属性值的数组转换为对象
    //entries()方法将{a:1,b:1}变成[[a:1],[b:1]]
    //Object.fromEntries()方法将[[a:1],[b:1]]变成{a:1,b:1}
    //转换成{a:1,b:1}转到data里面
    const resp = await API.reg(data);
    if (resp.code === 0) {
        alert("注册成功，点击确定，跳转到登录页");
        location.href = "./login.html"; //获取或设置页面当前地址;(设置地址回导致页面跳转)
    }
};