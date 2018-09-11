import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';

class ToolBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hexoRoot:window.localStorage.hexoRoot
    }
  }
  chooseHexoRoot = ()=>{
    app.send('chooseDir',{
      callback:'chooseDirCallback'
    })
    app.once('chooseDirCallback',(event, data)=>{
      data = JSON.parse(data)
      if (data.flag){
        window.localStorage.hexoRoot = data.data
        this.setState({
          hexoRoot:window.localStorage.hexoRoot
        })
      }else{
        alert(data.message)
      }
    })
  }

  render() {
    return (<div className="tool-bar">
      <div className="tools">
        <i className="fa fa-folder-open-o" aria-hidden="true" onClick={this.chooseHexoRoot} title="选择博客路径"></i>
        <i className="fa fa-plus" aria-hidden="true" title="新建文章"></i>
        <i className="fa fa-cloud-upload" aria-hidden="true" title="发布"></i>
      </div>
      <span>
        当前博客路径：{this.state.hexoRoot ? this.state.hexoRoot:alert("请先选择博客路径！")}
      </span>
    </div>)
  }
}

export default ToolBar