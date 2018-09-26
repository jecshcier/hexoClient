import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input, message} from 'antd';
import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/monokai.css'
import 'codemirror/lib/codemirror.css'


const imgArr = ['png', 'jpg', 'gif', 'jpeg']

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: null
    }
    this.values = ''
    this.message = '保存成功！'
  }

  componentDidMount = () => {
    console.log("============cm=============")
    this.values = this.props.content

    console.log(this.props.content)
    document.addEventListener("paste", (e) => {
      e.preventDefault();
      let cbd = e.clipboardData;
      let item = cbd.items[0];
      if (item.kind === "file") {
        let blob = item.getAsFile();
        console.log(blob);
        if (!blob) {
          return false;
        }
        window.URL = window.URL || window.webkitURL;
        let blobUrl = window.URL.createObjectURL(blob);
        this.setState({
          modal: 'loadC',
          clipboardImgUrl: blobUrl,
          clipboardImg: blob
        })
      }
    })
  }

  changeContent = (editor, data, value) => {
    this.props.changeContent(editor, data, value)
    this.values = value
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps)
    console.log(this.props.name)
    return true
  }

  saveArticle = () => {
    if (this.saveFlag){
      return message.warning('保存中……请不要重复保存～')
    }
    if (!this.props.name) {
      return message.warning('没有选择文件，不能保存')
    }
    this.saveFlag = true
    app.once('createFileCallback', (event, data) => {
      this.saveFlag = false
      if (data.flag) {
        message.success('保存成功');
      } else {
        message.error(data.message);
      }
    })
    app.send('createFile', {
      url: this.props.name,
      content: this.props.content,
      callback: 'createFileCallback'
    })

  }

  closeModal = () => {
    this.setState({
      modal: null
    })
  }
  loadClipboardImg = () => {
    this.setState({
      modal: null
    })
    let _this = this
    console.log(this.state.clipboardImg)
    let reader = new FileReader()
    reader.onload = function (evt) {
      console.log(evt.target.result)
      app.once('createImageCallback', (event, data) => {
        if (data.flag) {
          let url = `${window.localStorage.domain}/images/${_this.props.article}/${data.data}`
          _this.cm.replaceSelection(`![${data.data}](${url})\n`)
        } else {
          message.error("图片储存失败！");
        }
      })
      app.send('createImage', {
        url: _this.props.rootDir + '/source/images/' + _this.props.article,
        data: evt.target.result,
        callback: 'createImageCallback'
      })
    }
    reader.readAsDataURL(this.state.clipboardImg)
  }

  render() {
    return (<div className="editor-view">
      <div>
        <CodeMirror
          width="100%"
          height="100%"
          value={this.props.content}
          editorDidMount={editor => {
            this.cm = editor
          }}
          options={{
            mode: "markdown",
            theme: "monokai",
            lineWrapping: true
          }}
          ref="editor"
          onBeforeChange={(editor, data, value) => {
            this.changeContent(editor, data, value)
          }}
          onChange={(editor, data, value) => {
            // this.changeContent(editor, data, value)
          }}
          onKeyPress={(editor, event) => {
            console.log(event)
          }}
          onDrop={(editor, event) => {
            console.log("=================drop==============")
            console.log(event.dataTransfer.files)
            event.preventDefault()
            let files = Array.from(event.dataTransfer.files)
            files.forEach((el, index) => {
              let name = el.name.split('.')
              let pos = name[name.length - 1]
              pos = pos.toLowerCase()
              if (imgArr.indexOf(pos) !== -1) {
                console.log(el)
                app.once('copyFileCallback', (event, data) => {
                  if (data.flag) {
                    let url = `${window.localStorage.domain}/images/${this.props.article}/${el.name}`
                    editor.replaceSelection(`![${el.name}](${url})\n`)
                  }
                })
                app.send('copyFile', {
                  url: el.path,
                  targetUrl: this.props.rootDir + '/source/images/' + this.props.article,
                  name: el.name,
                  callback: 'copyFileCallback'
                })
              }
            })
          }}
        />
      </div>
      <div className="editor-bar">
        <span>
          <i className="fa fa-eye" aria-hidden="true" title="预览"></i>
          <span>预览</span>
        </span>
        <span>
          <i className="fa fa-floppy-o" aria-hidden="true"></i>
          <span onClick={this.saveArticle}>保存</span>
        </span>
      </div>
      <Modal onOk={this.loadClipboardImg}
             title="插入图片"
             visible={this.state.modal === 'loadC'}
             onCancel={this.closeModal}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <img src={this.state.clipboardImgUrl} alt="" style={{maxWidth: '100%', maxHeight: '300px'}}/>
        </div>
      </Modal>
    </div>)
  }
}

export default Editor