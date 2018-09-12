import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';
import AddArticle from './AddArticle'

class ToolBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      model: null
    }
  }

  addArticle = () => {
    this.setState({
      model: 'addA'
    })
  }
  chooseHexoRoot = () => {
    app.send('chooseDir', {
      callback: 'chooseDirCallback'
    })
    app.once('chooseDirCallback', (event, data) => {
      data = JSON.parse(data)
      if (data.flag) {
        this.props.changeRootDir(data.data)
      } else {
        alert(data.message)
      }
    })
  }

  handleOk = (data)=>{
    console.log(data)
    this.setState({
      model:null
    })
  }

  closeModal = ()=>{
    this.setState({
      model:null
    })
  }

  render() {
    return (<div className="tool-bar">
      <div className="tools">
        <span onClick={this.chooseHexoRoot}>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
          <span>博客路径</span>
        </span>
        <span onClick={this.addArticle}>
          <i className="fa fa-plus" aria-hidden="true" title="新建文章"></i>
          <span>新建文章</span>
        </span>
        <span>
          <i className="fa fa-thumb-tack" aria-hidden="true" title="分类管理"></i>
          <span>分类管理</span>
        </span>
        <span>
          <i className="fa fa-tags" aria-hidden="true" title="标签管理"></i>
          <span>标签管理</span>
        </span>
        <span>
          <i className="fa fa-cloud-upload" aria-hidden="true" title="发布"></i>
          <span>发布</span>
        </span>
      </div>
      <span>
        当前博客路径：{this.props.rootDir ? this.props.rootDir : null}
      </span>
      <AddArticle ref="groupModal"
                  onOk={this.handleOk}
                  show={(this.state.model === 'addA') ? true : false}
                  closeModal={this.closeModal} modalName="新增分组"
                  placeholder="新分组名称" key="modal"/>
    </div>)
  }
}

export default ToolBar