#!/usr/bin/env node

const { program } = require('commander')
const moment = require('moment')
const { md5File, md5CompareByDir } = require('./utils');

program.version('0.0.1')

program.option('-t, --timestamp [timestamp]', '将时间戳转换为时间')
program.option('-m, --md5File [file...]', '生成文件md5,支持多个')
program.option('-c, --compareMd5 [dir...]', '比较两个目录下所有同名文件md5')

program.parse(process.argv)

let options = program.opts()

//时间戳转中国、印度时区
if (options.timestamp) {
    let cstTimestamp = options.timestamp;
    let istTimestamp = cstTimestamp - 60 * 60 * 2.5
    let result_array = []

    
    result_array.push({
        title: 'CST: ' + moment.unix(cstTimestamp).format('YYYY-MM-DD HH:mm:ss'),
        subtitle: cstTimestamp,
        arg: ''
    }, {
        title: 'IST: ' + moment.unix(istTimestamp).format('YYYY-MM-DD HH:mm:ss'),
        subtitle: istTimestamp,
        arg: ''
    })

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

