import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';
import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/monokai.css'
import 'codemirror/lib/codemirror.css'
import moment from "moment";

const imgArr = ['png', 'jpg', 'gif', 'jpeg']

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.values = ''
  }

  componentDidMount = () => {
    console.log("============cm=============")
    console.log(this.cm.replaceSelection)

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
    app.once('createFileCallback', (event, data) => {
      if (data.flag) {
        alert("保存成功！")
      } else {
        alert(data.message)
      }
    })
    app.send('createFile', {
      url: this.props.name,
      content: this.values,
      callback: 'createFileCallback'
    })
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
                app.once('copyFileCallback',(event, data)=>{
                  if(data.flag){
                    console.log("==========复制成功=============")
                  }
                })
                app.send('copyFile',{
                  url:el.path,
                  targetUrl:this.props.rootDir + '/source/images/' + this.props.article,
                  name:el.name,
                  callback:'copyFileCallback'
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
    </div>)
  }
}

export default Editor