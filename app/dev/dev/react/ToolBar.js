import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';
import AddArticle from './AddArticle'
import moment from 'moment'

class ToolBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      model: null,
      domain: window.localStorage.domain ? window.localStorage.domain : ''
    }
  }

  addArticle = () => {
    if (this.props.rootDir) {
      this.setState({
        model: 'addA'
      })
    }
    else {
      alert("请选择正确的hexo博客路径！")
      return false
    }
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

  handleOk = (data) => {
    let articleContent = `---\ntitle: ${data.value}\ncategories: ${data.currentSort}\ndate: ${moment().format("YYYY-MM-DD HH:mm:ss")}\ntags: [${data.currentTag}]\nkeywords: [gitment,hexo,next]\n---`
    app.once('createFileCallback', (event, data) => {
      if (data.flag) {
        this.props.reloadArticleArr(this.props.rootDir)
      }
      else {
        alert(data.message)
      }
    })
    app.send('createFile', {
      url: this.props.rootDir + '/source/_posts/' + moment().format('YYYY-MM-DD') + '-' + data.value + '.md',
      content: articleContent,
      callback: 'createFileCallback'
    })
    this.setState({
      model: null
    })
  }

  closeModal = () => {
    this.setState({
      model: null
    })
  }

  domainConfig = () => {
    this.setState({
      model: 'addD'
    })
  }

  setDomain = () => {
    window.localStorage.domain = this.state.domain
    this.setState({
      model: null
    })
  }

  domainChange = (e) => {
    this.setState({
      domain: e.target.value
    })
  }

  render() {
    return (<div className="tool-bar">
      <div className="tools">
        <span onClick={this.chooseHexoRoot}>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
          <span>博客路径</span>
        </span>
        <span onClick={this.domainConfig}>
          <i className="fa fa-link" aria-hidden="true"></i>
          <span>配置域名</span>
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
                  hexoRoot={this.props.rootDir}
                  show={this.state.model === 'addA'}
                  closeModal={this.closeModal} modalName="新增文章"
                  placeholder="文章标题" key="modal"/>
      <Modal onOk={this.setDomain}
             title="配置域名"
             visible={this.state.model === 'addD'}
             onCancel={this.closeModal}>
        <Input type="text" onChange={this.domainChange} value={this.state.domain}/>
      </Modal>
    </div>)
  }
}

export default ToolBar