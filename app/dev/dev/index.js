import React from 'react'
import ReactDOM from 'react-dom'
// import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';
import ArticleList from './react/ArticleList'
import Editor from './react/Editor'
import ToolBar from "./react/ToolBar";

import './css/style.css'

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: null,
      content: '',
      hexoRoot: window.localStorage.hexoRoot,
      articleArr: null
    }
  }

  changeArticleArr = (hexoRoot) => {
    console.log("================change================")
    app.once('getFolderFilesCallback',(event, data)=>{
      if (data.flag){
        console.log(data.data)
        this.setState({
          articleArr:data.data
        })
      }
      else{
        if(hexoRoot){
          alert("请选择正确的hexo博客路径！")
          this.setState({
            hexoRoot:'',
            articleArr:null
          })
        }
      }
    })
    app.send('getFolderFiles',{
      callback:'getFolderFilesCallback',
      dirPath:hexoRoot +　'/source/_posts'
    })
  }

  changeCurrentArticle = (article,name) => {
    console.log("===============文章名称================")
    console.log(name)
    app.once('readFileContentCallback', (event, data) => {
      data = JSON.parse(data)
      if (data.flag) {
        this.setState({
          current: article,
          currentName:name,
          content: data.data
        })
      } else {
        alert(data.message)
      }
    })
    app.send('readFileContent', {
      fileUrl: article,
      callback: 'readFileContentCallback'
    })
  }

  changeRootDir = (hexoRoot) => {
    console.log(hexoRoot)
    this.setState({
      hexoRoot: hexoRoot
    })
    window.localStorage.hexoRoot = hexoRoot
    this.changeArticleArr(hexoRoot)
  }

  changeEditorContent = (editor, data, value) => {
    this.setState({
      content: value
    })
  }

  render() {
    console.log(this.state.hexoRoot)
    return [
      <ToolBar key="toolBar" rootDir={this.state.hexoRoot} changeRootDir={this.changeRootDir} reloadArticleArr={this.changeArticleArr}/>,
      <div className="user-view" key="userView">
        <ArticleList key="list" rootDir={this.state.hexoRoot} changeCurrentArticle={this.changeCurrentArticle}
                     articleArr={this.state.articleArr} changeArticleArr={this.changeArticleArr}/>
        <Editor key="edit" name={this.state.current} article={this.state.currentName} rootDir={this.state.hexoRoot} content={this.state.content}
                changeContent={this.changeEditorContent}/>
      </div>
    ]
  }

}


ReactDOM.render(
  <Main/>,
  document.getElementById('main')
)