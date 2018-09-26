import React from "react";
import {Tree, Button, Radio, Icon, Tag, Modal, Input, Select} from 'antd';
import _ from 'lodash'

import 'antd/lib/modal/style/css'
import 'antd/lib/input/style/css'
import 'antd/lib/select/style/css'
import 'antd/lib/tag/style/css'
import 'antd/lib/message/style/css'



const Option = Select.Option

class AddArticle extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    this.state = {
      value: '',
      sortArr: null,
      tagsArr: null,
      currentSort: null,
      currentTag: []
    }
    this.tagColorArr = ["pink", "red", "orange", "green", "cyan", "blue", "purple"]
  }

  changeSortAndTagsArr = () => {
    let tagsArr = []
    let sortArr = []
    let getInfoOk = false
    app.once('getTagsCallback', (event, data) => {
      if (data.flag) {
        console.log(data.data)
        tagsArr = data.data
        if (getInfoOk) {
          this.setState({
            tagsArr: tagsArr,
            sortArr: sortArr
          })
        }
        getInfoOk = true
      }
    })
    app.once('getSortsCallback', (event, data) => {
      if (data.flag) {
        console.log(data.data)
        sortArr = data.data
        if (getInfoOk) {
          this.setState({
            tagsArr: tagsArr,
            sortArr: sortArr
          })
        }
        getInfoOk = true
      }
    })
    app.send('getFolders', {
      callback: 'getTagsCallback',
      dirPath: this.props.hexoRoot + '/source/tags',
      type: 'tags'
    })
    app.send('getFolders', {
      callback: 'getSortsCallback',
      dirPath: this.props.hexoRoot + '/source/categories',
      type: 'sorts'
    })
  }

  componentDidMount() {
    this.changeSortAndTagsArr()
  }

  componentDidUpdate() {
    console.log("render")
    let _this = this
    window.requestAnimationFrame(function () {
      if (_this.props.show === true) {
        _this.textInput.current.input.focus()
      }
    })
  }

  modalHandleOk = () => {
    if(this.state.currentSort && this.state.currentTag.length && this.state.value){
      this.props.onOk({
        value: this.state.value,
        currentSort: this.state.currentSort,
        currentTag: this.state.currentTag
      })
      this.setState({
        value: '',
        currentSort: null,
        currentTag: []
      })
    }
    else{
      alert("信息不完整")
    }
  }

  modalHandleCancel = () => {
    this.setState({
      value: '',
      currentSort: null,
      currentTag: []
    })
    this.props.closeModal()
  }

  changeInputValue = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  addTags = (e) => {
    console.log("添加tag")
    let currentTag = this.state.currentTag
    currentTag.push(e.target.getAttribute('data-name'))
    this.setState({
      currentTag: Array.from(new Set(currentTag))
    })
  }

  delTag = (tagName) => {
    console.log("删除tag")
    let tags = this.state.currentTag.filter(tag=>tag !== tagName)
    this.setState({
      currentTag:tags
    },()=>{
      console.log(this.state.currentTag)
    })
  }

  chooseSort = (value,option)=>{
    this.setState({
      currentSort:value
    })
  }


  render() {
    return <Modal
      title={this.props.modalName}
      visible={this.props.show}
      onOk={this.modalHandleOk}
      onCancel={this.modalHandleCancel}
    >
      <Input ref={this.textInput} type="text" onChange={this.changeInputValue} value={this.state.value}
             placeholder={this.props.placeholder}/>
      <Select defaultValue="请选择分类" style={{marginTop:'10px'}} onSelect={this.chooseSort}>
        {
          this.state.sortArr ? Object.values(this.state.sortArr).map((el, index) => {
            return <Option key={el.fileName} value={el.fileName}>{el.fileName}</Option>
          }) : null
        }
      </Select>
      <div style={{marginTop:'10px'}}>
        <div>
          <span>标签</span>
          {
            this.state.currentTag.length ? this.state.currentTag.map((el, index) => {
              return <Tag style={index === 0 ? {marginLeft:'5px'}:null} closable data-name={el} afterClose={()=>{this.delTag(el)}} key={el} value={el}>{el}</Tag>
            }) : null
          }
        </div>
        <div style={{marginTop:'10px'}}>
          {
            this.state.tagsArr ? Object.values(this.state.tagsArr).map((el, index) => {
              let colorNum = index % 7
              return <Tag color={this.tagColorArr[colorNum]} data-name={el.fileName} key={el.fileName}
                          onClick={this.addTags} value={el.fileName}>{el.fileName}</Tag>
            }) : null
          }
        </div>
      </div>
    </Modal>
  }
}

export default AddArticle