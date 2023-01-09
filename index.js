#!/usr/bin/env node

const { program } = require('commander')
const { md5File, md5CompareByDir, encodeFunc, decodeFunc} = require('./utils');
const moment = require('moment-timezone');

program.version('0.0.1')

program.option('-t, --timestamp [timestamp]', '将时间戳转换为时间')
program.option('-m, --md5File [file...]', '生成文件md5,支持多个')
program.option('-c, --compareMd5 [dir...]', '比较两个目录下所有同名文件md5')
program.option('-s, --str [str]', '字符串处理 base64 & urlencode')

program.parse(process.argv)

let options = program.opts()

//时间戳转中国、印度时区
if (options.timestamp) {
    let result_array = []
    //关注的时区
    let timezoneList = ["Asia/Shanghai", "Asia/Kolkata", "America/New_York"];

    let timestampRegExp = /^[0-9]*$/
    let dateRegExp = /\d+-\d+-\d+/g
    let datetimeRegExp = /\d+-\d+-\d+ \d+:\d+:\d+/g

    //如果是时间戳
    if (timestampRegExp.test(options.timestamp)) {
        let timestamp = options.timestamp * 1000; 
        const format = "zz YYYY-MM-DD HH:mm:ss"

        timezoneList.forEach(item => {
             result_array.push({
                title: moment(timestamp).tz(item).format(format),
                subtitle: item,
                arg: moment(timestamp).tz(item).format(format)
             })
        })
    }

    if(dateRegExp.test(options.timestamp) || datetimeRegExp.test(options.timestamp)) {
        timezoneList.forEach(item => {
            result_array.push({
               title: moment.tz(options.timestamp, item).unix(),
               subtitle: item + ' UNIX Timestamp',
               arg: moment.tz(options.timestamp, item).unix()
            })
       })
    }

    console.log(JSON.stringify({
        items: result_array
    }))
}

//生成多个文件md5值
if (options.md5File) {
    options.md5File.forEach(file => {
        console.log(md5File(file), file);
    });
}

//比较两个目录下，所有同名文件MD5值
if (options.compareMd5) {
    md5CompareByDir(options.compareMd5)
}

if (options.str) {
    let result_array = []

    let encode = encodeFunc(options.str)
    let decode = decodeFunc(options.str)
    
    for(let key in encode) {
        result_array.push({
            title: encode[key],
            subtitle: key,
            arg: encode[key]
         })
    }

    for(let key in decode) {
        result_array.push({
            title: decode[key],
            subtitle: key,
            arg: decode[key]
         })
    }

    console.log(JSON.stringify({
        items: result_array
    }))
}

