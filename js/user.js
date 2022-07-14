// 用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
    /**
     * 构造器
     * @param {String} txtId 文本框的Id
     * @param {Function} validatorFunc 传入要验证函数
     * 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，
     * 函数的返回值为验证的错误消息，若没有返回，则表示无错误
     */
    constructor(txtId, validatorFunc) {
        this.input = $("#" + txtId);
        this.p = this.input.nextElementSibling; //获取该dom下一个兄弟元素
        this.validatorFunc = validatorFunc; //把该方法保存起来
        // 生成失去焦点的事件
        this.input.onblur = () => {
            this.validate();
        };
    }

    /**
     * 验证，成功返回true，失败返回false
     */
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            // 有错误，就填充p的文本内容
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = "";
            return true;
        }
    }

    /**
     * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
     * @param {FieldValidator[]} validators
     */
    //用静态方法
    static async validate(...validators) {
        //'...'为展开运算符
        const proms = validators.map((v) => v.validate()); //数组映射，传入一个函数，映射数组中的每一项
        const results = await Promise.all(proms); ///返回一个任务(并返回一个Promise解析为输入 Promise 结果数组的单个)
        //任务数组全部成功则成功,任何一个失败则失败
        return results.every((r) => r); //检测数组中的元素是否都满足某个条件，都满足返回true，
        //只要有一个不满足返回false,参数，第一个参数是回调函数，第二个是数值对象(改变函数中的this指向),返回值true和false;
    }
}
// 验证账号规则
// const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
//   if (!val) {
//     return "请填写账号";
//   }
//   const resp = await API.exists(val);
//   if (resp.data) {
//     // 账号已存在
//     return "该账号已被占用，请重新选择一个账号名";
//   }
// });
// 验证昵称规则
// const nicknameValidator = new FieldValidator("txtNickname", function (val) {
//   if (!val) {
//     return "请填写昵称";
//   }
// });