const errorTypes = require("../constants/error-types.js")

const errorHandler = (error, ctx) => {
    let message, status;
    switch (error.message) {
        case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
            status = 400; // Bad request
            message = "用户名或者密码不能为空~";
            break;
        case errorTypes.USER_ALREADY_EXISTS:
            status = 409; // conflict
            message = "用户名已经存在~";
            break
        case errorTypes.USER_NOT_EXISTS:
            status = 400;
            message = "用户名不存在~";
            break
        case errorTypes.PASSWORD_IS_INCORRECT:
            status = 400;
            message = "密码是错误的~";
            break
        case errorTypes.UNAUTHORIZATION:
            status = 401;
            message = "无效的token~"
            break
        case errorTypes.UNPERMISSION:
            status = 401;
            message = "您不具备操作的权限~"
            break
        default:
            status = 404;
            message = "NOT FOUND...";
            break
    }

       ctx.body = {
           status,
           message
       }
}

module.exports = errorHandler