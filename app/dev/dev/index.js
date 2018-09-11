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
      content: ''
    }
  }

  changeCurrentArticle = (article) => {
    app.send('readFileContent', {
      fileUrl: article,
      callback: 'readFileContentCallback'
    })
    app.once('readFileContentCallback', (event, data) => {
      data = JSON.parse(data)
      if (data.flag) {
        this.setState({
          current: article,
          content: data.data
        })
      } else {
        alert(data.message)
      }
    })
  }

  changeRootDir = (hexoRoot) => {
    this.setState({
      hexoRoot: hexoRoot
    })
  }

  changeEditorContent = (content)=>{
    this.setState({
      content:content
    })
  }

  render() {
    return [
      <ToolBar key="toolBar" rootDir={this.changeRootDir}/>,
      <div className="user-view" key="userView">
        <ArticleList key="list" changeCurrentArticle={this.changeCurrentArticle}/>
        <Editor key="edit" name={this.state.current} content={this.state.content} changeContent={this.changeEditorContent}/>
      </div>
    ]
  }

}


ReactDOM.render(
  <Main/>,
  document.getElementById('main')
)