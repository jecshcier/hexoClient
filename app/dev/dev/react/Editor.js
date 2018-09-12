import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';
import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/monokai.css'
import 'codemirror/lib/codemirror.css'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  componentDidMount = () => {
    // console.log(this.refs.editor)
    // const cm = this.refs.editor
    // const cm = this.refs.editor.getCodeMirror();
    // const { width, height } = this.props;
    // // set width & height
    // cm.setSize(width, height);
  }

  changeContent = (editor, data, value)=>{
    this.props.changeContent(editor, data, value)
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps)
    console.log(this.props.name)
    return true
  }

  render() {
    return (<div className="editor-view">
      <div>
        <CodeMirror
          width="100%"
          height="100%"
          value={this.props.content}
          options={{
            mode:"markdown",
            theme:"monokai",
            lineWrapping:true
          }}
          ref="editor"
          onBeforeChange={(editor, data, value) => {
            this.changeContent(editor, data, value)
          }}
          onChange={(editor, data, value) => {
            // this.changeContent(editor, data, value)
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
          <span>保存</span>
        </span>
      </div>
    </div>)
  }
}

export default Editor