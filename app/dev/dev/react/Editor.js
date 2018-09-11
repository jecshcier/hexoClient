import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  componentDidMount = () => {
    if (this.props.name !== '' && this.props.name) {
      console.log(this.props.name)
    }
  }

  changeContent = (event)=>{
    this.props.changeContent(event.target.value)
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps)
    console.log(this.props.name)
    return true
  }

  render() {
    return (<div className="editor-view">
      <textarea className="editor" value={this.props.content} onChange={this.changeContent}></textarea>
    </div>)
  }
}

export default Editor