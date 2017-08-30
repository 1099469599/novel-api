import errorConfig from './apiErrorConfig';

/**
 * 自定义Api异常
 */

class ApiError extends Error {
  // 构造方法
  constructor(errorName) {
    super();
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    let errorInfo = errorConfig[errorName];
    if (!errorInfo) errorInfo = errorConfig.UNKNOW_ERROR;

    this.name = errorName;
    this.code = errorInfo.code;
    this.message = errorInfo.message;
  }
}

export default ApiError;
