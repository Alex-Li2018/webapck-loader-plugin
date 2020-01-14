const loaderUtils = require('loader-utils');
const fs = require('fs');
// const fsPromises = fs.promises;

const toString = Object.prototype.toString;
function isType (type) {
    return function(obj) {
        return toString.call(obj) === `[object ${type}]`;
    }
}
const isArray = isType('Array');
const isObject = isType('Object');
const isString = isType('String');

function checkReplaceTxtParams(replaceTxt) {
    return isString(replaceTxt);
}

module.exports = function(content) {
    
    // get loader options
    const options = loaderUtils.getOptions(this);
    // 异步回调函数
    const asyncCallback = this.async();

    // if JSON File
    if (options.jsonFile) {
        let { jsonFile: fileUrl } = options;
        if(!fs.existsSync(fileUrl)) {
            this.emitError(new Error('file path is wrong!'));
        }
        // 读取内容
        fs.readFile(fileUrl, 'utf8', (err, data) => {
            if (err) this.emitError(new Error(err));
    
            let replaceRules = JSON.parse(data);
            // if Object
            if (isObject(replaceRules)) {
                let { rule, replaceTxt } = replaceRules;
                // 校验是否是字符串
                if (!checkReplaceTxtParams(replaceTxt)) {
                    this.emitError(new Error('replaceTxt must be String!'));
                    asyncCallback(null, content);
                }
                // 替换值
                content = content.replace(eval(rule), replaceTxt);
                // 异步返回
                asyncCallback(null, content);
            }
            // if Array
            if (isArray(replaceRules)) {
                
                replaceRules.forEach(_ => {
                    if (!checkReplaceTxtParams(_.replaceTxt)) {
                        this.emitError(new Error('replaceTxt must be String!'));
                        asyncCallback(null, content);
                    }
                    content = content.replace(eval(_.rule), _.replaceTxt);
                });
                // 异步返回结果
                asyncCallback(null, content);
            }
        });
        // return content;
    } else if (isObject(options.replaceRules)) {
        // if Object
        let { rule, replaceTxt } = options.replaceRules;
        // 校验是否是字符串
        if (!checkReplaceTxtParams(replaceTxt)) {
            this.emitError(new Error('replaceTxt must be String!'));
            return content;
        }
        // 替换值
        content = content.replace(rule, replaceTxt);

        // 同步返回结果
        this.callback(null, content);
        // return content;

    } else if (isArray(options.replaceRules)) {
        // if Array
        options.replaceRules.forEach(_ => {
            if (!checkReplaceTxtParams(_.replaceTxt)) {
                this.emitError(new Error('replaceTxt must be String!'));
                return content;
            }
            content = content.replace(_.rule, _.replaceTxt);
        });

        // 同步返回结果
        this.callback(null, content);
        // return content;
    }
}