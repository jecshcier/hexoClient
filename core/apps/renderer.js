/**
 * 渲染进程
 * author:chenshenhao
 * createTime:2017.4.5
 * updateTime:2017.8.14
 */
const electron = require('electron')
const shell = electron.shell
const app = electron.ipcRenderer
const BrowserWindow = electron.remote.BrowserWindow
const fs = require('fs')
const path = require('path')
const config = require(path.resolve(__dirname, '../../app/config'));
const staticUrl = config.staticUrl

console.log(staticUrl)

onload = () => {
  const urlBtn = document.getElementById("urlBtn")
  let publicUrl = ''
  urlBtn.addEventListener('click', () => {
    app.send('chooseDir', {
      callback: 'chooseDirCallback'
    })
    app.once('chooseDirCallback', function(event, mess) {
      console.log(mess)
      mess = JSON.parse(mess)
      if (mess.flag) {
        publicUrl = mess.data
        console.log(mess.data)
        alert(mess.data)
      }
    })
  })
}