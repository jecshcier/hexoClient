import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, message, Modal, Input} from 'antd';
import AddArticle from './AddArticle'
import EditTags from './editTags'
import moment from 'moment'

class ToolBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: null,
      domain: window.localStorage.domain ? window.localStorage.domain : '',
      sortArr: [],
      tagsArr: [],
      keywordsArr: []
    }
  }

  loadTags = () => {
    return new Promise((resolve,reject)=>{
      if (this.props.rootDir) {
        app.once('readFileContentCallback', (event, data) => {
          data = JSON.parse(data)
          console.log(data)
          resolve(data)
        })
        app.send('readFileContent', {
          callback: 'readFileContentCallback',
          fileUrl: this.props.rootDir + '/hexo.config.js'
        })
      }
      else {
        reject("请选择正确的hexo博客路径！")
      }
    })

  }

  addArticle = async () => {
    let tagsArr = []
    let sortArr = []
    let keywordsArr = []
    let data
    try {
      data = await this.loadTags()
    } catch (err) {
      return message.error(err)
    }
    if (data.flag) {
      try {
        let result = JSON.parse(data.data)
        sortArr = result.categories
        tagsArr = result.tags
        keywordsArr = result.keywords
        this.setState({
          sortArr: sortArr,
          tagsArr: tagsArr,
          keywordsArr: keywordsArr,
          modal: 'addA'
        })
      } catch (err) {
        console.log(err)
        message.error("数据解析错误")
      }
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
    let articleContent = `---\ntitle: ${data.value}\ncategories: ${data.currentSort}\ndate: ${moment().format("YYYY-MM-DD HH:mm:ss")}\ntags: [${data.currentTag}]\nkeywords: [${data.currentKeywords}]\n---`
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
      modal: null
    })
  }

  closeModal = () => {
    this.setState({
      modal: null
    })
  }

  domainConfig = () => {
    this.setState({
      modal: 'addD'
    })
  }


  setDomain = () => {
    window.localStorage.domain = this.state.domain
    this.setState({
      modal: null
    })
  }

  domainChange = (e) => {
    this.setState({
      domain: e.target.value
    })
  }

  editTags = async () => {
    let tagsArr = []
    let sortArr = []
    let keywordsArr = []
    let data
    try {
      data = await this.loadTags()
    } catch (err) {
      return message.error(err)
    }
    if (data.flag) {
      try {
        let result = JSON.parse(data.data)
        sortArr = result.categories
        tagsArr = result.tags
        keywordsArr = result.keywords
        this.setState({
          sortArr: sortArr,
          tagsArr: tagsArr,
          keywordsArr: keywordsArr,
          modal: 'editT'
        })
      } catch (err) {
        console.log(err)
        message.error("数据解析错误")
      }
    }
  }

  changeArr=(type,data)=>{
    switch (type) {
      case 'sortArr':
        this.setState({
          sortArr:data
        })
        break
      case 'tagsArr':
        this.setState({
          tagsArr:data
        })
        break
      case 'keywordsArr':
        this.setState({
          keywordsArr:data
        })
        break
      default:
          break
    }
    this.setState({
      type:data
    })
  }

  deploy = ()=>{
    app.on('deployCallback',(event, data)=>{
      console.log(data)
    })
    app.send('deploy', {
      callback: 'deployCallback',
      url:this.props.rootDir
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
        <span onClick={this.editTags}>
          <i className="fa fa-tags" aria-hidden="true" title="标签管理"></i>
          <span>标签管理</span>
        </span>
        <span onClick={this.deploy}>
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
                  show={this.state.modal === 'addA'}
                  closeModal={this.closeModal} modalName="新增文章"
                  tagsArr={this.state.tagsArr}
                  sortArr={this.state.sortArr}
                  keywordsArr={this.state.keywordsArr}
                  placeholder="文章标题" key="modal"/>
      <Modal onOk={this.setDomain}
             title="配置域名"
             visible={this.state.modal === 'addD'}
             onCancel={this.closeModal}>
        <Input type="text" onChange={this.domainChange} value={this.state.domain}/>
      </Modal>
      <EditTags hexoRoot={this.props.rootDir}
                show={this.state.modal === 'editT'}
                closeModal={this.closeModal} modalName="编辑标签"
                tagsArr={this.state.tagsArr}
                sortArr={this.state.sortArr}
                keywordsArr={this.state.keywordsArr}
                changeArr={this.changeArr}
                key="tags_modal"/>
    </div>)
  }
}

export default ToolBar