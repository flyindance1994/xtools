const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const walkFile = (currentDirPath, files) => {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
    var filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile()) {
      files.add(dirent.name)
    } else if (dirent.isDirectory()) {
      walkFile(filePath, files);
    }
  });
}

const md5File = (file) => {
  const fileBuffer = fs.readFileSync(file);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);

  const hex = hashSum.digest('hex');
  return hex
}

const md5CompareByDir = (compareMd5) => {
  let filesA = new Set()
  let filesB = new Set()

  if (Object.keys(compareMd5).length !== 2) {
    console.error("ERROR:only 2 dir can be accepted")
    return
  }
  let dirA = compareMd5[0]
  let dirB = compareMd5[1]

  walkFile(dirA, filesA)
  if (filesA.size > 5000) {
    console.error("ERROR:Dir A size is larger than 5000")
    return
  }

  walkFile(dirB, filesB)
  if (filesB.size > 5000) {
    console.error("ERROR:Dir B size is larger than 5000")
    return
  }

  //先比较两边集合是否有缺
  let fileAnotinB = [];//存在于A，不存在于B
  let fileBnotinA = [];//存在于B，不存在于A
  let fileAandB = new Set();//二者共有，用于对比MD5
  filesA.forEach(file => {
    if (!filesB.has(file)) {
      fileAnotinB.push(file);
    } else {
      fileAandB.add(file);
    }
  });

  filesB.forEach(file => {
    if (!filesA.has(file)) {
      fileBnotinA.push(file);
    } else {
      fileAandB.add(file)
    }
  });

  if (fileAnotinB.length > 0) {
    console.log("dir A has, but not in dir B:")
    console.log(fileAnotinB)
  }

  if (fileBnotinA.length > 0) {
    console.log("dir B has, but not in dir A:")
    console.log(fileBnotinA)
  }


  let md5NotMatch = [];
  //再比较md5是否有不一致
  fileAandB.forEach(file => {
    let fileA = path.join(dirA, file)
    let fileB = path.join(dirB, file)
    let md5A = md5File(fileA)
    let md5B = md5File(fileB)
    if (md5A != md5B) {
      md5NotMatch.push({
        "md5A": md5A,
        "fileA": fileA,
        "md5B": md5B,
        "fileB": fileB
      });
    }
  })

  if (md5NotMatch.length > 0) {
    console.log("md5 result not match:")
    md5NotMatch.forEach(item => {
      console.log(item.md5A, item.fileA)
      console.log(item.md5B, item.fileB)
    })
  }
}

module.exports = { walkFile, md5File, md5CompareByDir }