import React, { Component } from 'react';
import { connect } from 'react-redux';
import BraftEditor from 'braft-editor';
import {  withRouter } from 'react-router-dom';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import { Input, Button, Row, Col, Popover, Tag, message, Modal} from 'antd';
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-php'
import api from '@/config/api';
import http from '@/config/http';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/code-highlighter.css'
import '@/static/style/classlist.less';
//https://github.com/margox/braft-extensions  代码高亮 use
const options = {
    syntaxs: [
        {
            name: 'JavaScript',
            syntax: 'javascript'
        }, {
            name: 'HTML',
            syntax: 'html'
        }, {
            name: 'CSS',
            syntax: 'css'
        }, {
            name: 'Java',
            syntax: 'java',
        }, {
            name: 'PHP',
            syntax: 'php'
        }
    ]
}
BraftEditor.use(CodeHighlighter(options ))
let lineStyle = {
    text_title:{
        margin: 0,
        padding: '18px',
        fontWeight: 700,
        color: '#000',
        border: 'none',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: '#F4F5F5'
    },
    header_img:{
        width: '150px'
    }
}
const { CheckableTag } = Tag;


class writeArticle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            editorState: BraftEditor.createEditorState(null),
            checked: true ,
            selectedTags:[],
            radioItem: '',
            inputVal:'',
            listdata:[],
            title:'',
            publishSign: false,
            visible: false,
            role_name:'',
            tag_id:'',
            class_id:'',
            article_id:''
        }
    }
    handleOk(){
        window.location.href = '/';
    }
    
    render() {
        const { editorState, radioItem} = this.state;
        
        const content = (
            <div style={{ width: '315px', padding: '15px' }}>
                <h3>发布文章</h3>
                <p>分类</p>
                <div className='listTag'>
                    {this.state.listdata.map(item => (
                        <CheckableTag
                            key={item}
                            checked={radioItem==item}
                            onChange={checked => this.handleChange(item, checked)}
                        >
                            {item}
                        </CheckableTag>
                    ))}
                </div>
                <p>标签</p>
                <Input placeholder="添加一个标签" value={this.state.inputVal} onChange={this.addTag.bind(this)}/>
                <Button type="primary" disabled={this.state.publishSign} block style={{ marginTop: '10px' }} onClick={this.publish.bind(this)}>确定并发布</Button>
            </div>
        );
        return (
            <div className="w1200">
                <Row>
                    <Col span={8}><img style={lineStyle.header_img} src={require("@/static/images/logo.png")} alt="" /></Col>
                    <Col span={8} offset={8}>
                        <div style={{marginTop:'10px'}}>
                            <Button style={{ marginRight: '10px' }} disabled> 切换为markdown编辑器</Button>
                            <Popover placement="bottom" content={content} trigger="click">
                                <Button>发布</Button>
                            </Popover>
                            <Button style={{ marginLeft: '10px' }} onClick={this.toHome.bind(this)}> 返回首页</Button>
                        </div>
                    </Col>
                </Row>
                <div style={{marginTop:'30px'}}>
                    <textarea value={this.state.title} onChange={this.addTitle.bind(this)} style={lineStyle.text_title} placeholder="请输入标题..."></textarea>
                    <BraftEditor
                        value={editorState}
                        onChange={this.handleEditorChange}
                        onSave={this.submitContent}
                        placeholder='请输入内容...'
                    />
                </div>
                <Modal
                    title="提示"
                    okText="返回首页"
                    zIndex = '9999'
                    cancelText="返回"
                    footer={[
                        <Button key="submit" type="primary"  onClick={this.handleOk}>
                            返回首页
                        </Button>
                    ]}
                    closable= {false}
                    visible={this.state.visible}
                    
                >
                    <p>感谢大佬支持,暂时不可以发布哦。</p>
                    <p>站主审核中。请稍后...</p>
                </Modal>
            </div>
        )
    }
    getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }
    toHome() {
        // this.props.history.push('/')
        window.location.href = '/';
    }
    componentWillMount(){
        http.post(api.userinfoById, { id: this.getQueryVariable('id')}, res => {
            // console.log(res)
            this.setState({
                role_name: res.result[0].role_name
            })
            if (res.result[0].role_name == 'write' || res.result[0].role_name == 'admin' ){
                this.setState({
                    visible: false
                })
            }else{
                this.setState({
                    visible: true
                })
            }
        }, err => {
            console.log(err);
        })
    }
    getArticleData(article_id){
        http.post(api.findArticleId, {article_id},res=>{
            console.log('res', res, res.tab[0].tag_name)
            const htmlContent = res.articleinfo[0].article_content
            // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
            this.setState({
                editorState: BraftEditor.createEditorState(htmlContent),
                title: res.articleinfo[0].article_title,
                radioItem: res.className[0].class_name,
                inputVal: res.tab[0].tag_name,
                tag_id: res.tab[0].tag_id,
                class_id: res.className[0].class_id,
                article_id: res.articleinfo[0].article_id
            })
        },err=>{
            console.log(err)
        })
    }
    componentDidMount() {
        // 假设此处从服务端获取html格式的编辑器内容
        // const htmlContent = await fetchEditorContent()
        http.post(api.classlist, {}, res => {
            let arr = [];
            for (let i = 0; i < res.classList.length; i++) {
                arr.push(res.classList[i].class_name);
            }

            this.setState({
                listdata: arr
            })
        }, err => {
            console.log(err);
        })
        if (this.getQueryVariable('article') != 'null') {
            this.getArticleData(this.getQueryVariable('article'))
        }
        
    }
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        console.log(htmlContent);
        //const result = await saveEditorContent(htmlContent)
    }
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    handleChange(tag, checked) {
        this.setState({
            radioItem: tag,
        })
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        // console.log('You are interested in: ', nextSelectedTags);
        this.setState({ selectedTags: nextSelectedTags });
    }
    addTag(event) {
        this.setState({
            inputVal: event.target.value,
        })
    }
    publish() {
        // console.log('radioItem', this.state.radioItem);
        if (this.state.role_name =='read'){
            this.setState({
                visible: true
            })
            this.setState({
                publishSign: true
            })
            return false;
        }

        if (this.state.inputVal == '' || this.state.radioItem == '') {
            message.info('添加一个标签或分类！')
            return false;
        }
        if (this.state.title == '' || this.state.editorState.toHTML() == '<p></p>') {
            message.info('标题和内容不能为空！')
            return false;
        }
        let obj;
        if (this.getQueryVariable('article') != 'null'){
            //修改
            obj = {
                'article_title': this.state.title,
                'article_content': this.state.editorState.toHTML(),
                'tag_name': this.state.inputVal.trim(),
                'classify': this.state.radioItem,
                'tag_id': this.state.tag_id,
                'class_id': this.state.class_id,
                'article_id': this.state.article_id
            }
            //console.log(obj)
            http.post(api.updateArticleinfo, obj,res=>{
                // console.log(res)
                this.setState({
                    publishSign: true
                })
                if (res.msg == 'success') {
                    //this.props.history.push('/')
                    message.info('修改成功,即将跳转到首页', 1, () => {
                        window.location.href = '/'
                    });
                }
            },err=>{
                console.log(err)
            })
        }else{
            obj = { 
                'article_title': this.state.title,
                'article_content': this.state.editorState.toHTML(),
                'tag_name': this.state.inputVal.trim(),
                'tag_description': '',
                'tag_another_name': '',
                'classify': this.state.radioItem
             }
            http.post(api.insertarticle, obj, res => {
                // console.log(res);
                this.setState({
                    publishSign: true
                })
                if (res.affectedRows === 1) {
                    //this.props.history.push('/')
                    message.info('添加成功,即将跳转到首页', 1, () => {
                        window.location.href = '/'
                    });
                }
            }, err => {
                console.log(err);
            })
        }
        
    }
    addTitle(e) {
        this.setState({
            title: e.target.value
        })
    }
}
function mapStateToProps(state) {
    return {

    };
}
export default withRouter(connect(
    mapStateToProps,
)(writeArticle)) ;
