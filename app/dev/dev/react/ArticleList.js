import React from 'react'
import ReactDOM from 'react-dom'
import {Tree, Button, Radio, Icon, Modal, Input} from 'antd';

class ArticleList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      hexoRoot:window.localStorage.hexoRoot
    }
  }
  editArticle = (e)=>{
    this.props.changeCurrentArticle(e.target.getAttribute('data-path'))
  }

  componentDidMount(){
    if(this.state.hexoRoot){
      app.send('getFolderFiles',{
        callback:'getFolderFilesCallback',
        dirPath:this.state.hexoRoot +　'/source/_posts'
      })
      app.once('getFolderFilesCallback',(event, data)=>{
        data = JSON.parse(data)
        console.log(JSON.stringify(data.data))
        if (data.flag){
          console.log(data.data)
          this.setState({
            articleArr:data.data
          })
        }
      })
    }
  }

  render(){
    return (<ul className="articleList">
      {this.state.articleArr ? Object.values(this.state.articleArr).map((el,index)=>{
        return <li key={index} data-path={el.path} onClick={this.editArticle}>{el.fileName}</li>
      }):<li>暂无文章</li>}
    </ul>)
  }
}

export default ArticleList