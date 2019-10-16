const sql = require('../../sql/mysql');
const moment = require('moment');
moment.locale('zh-cn');
exports.insertarticle = async (ctx, next) => {
    let articleCon = ctx.request.body;
    let user = await sql.findUsersByName(ctx.session.phone);
    let article_date = new Date(); //2015-12-20 10:01:00
    // console.log(articleCon, article_date, user[0].user_id);
    let article_views = 0,
        article_comment_count = 0,
        article_like_count = 0;
    if (articleCon.article_content) {
        try {
           let findClassify = await sql.findClassify(articleCon.classify);
           let insertTag = await sql.insertTag([articleCon.tag_name, articleCon.tag_description, articleCon.tag_another_name]);
           let sqlArticleContent = await sql.insertArticle([user[0].user_id, articleCon.article_title, articleCon.article_content, article_views, article_comment_count, article_date, article_like_count]);
           if (sqlArticleContent.affectedRows == 1 && insertTag.affectedRows == 1 && findClassify[0].class_id) {
               await sql.insert_tag_article([insertTag.insertId, sqlArticleContent.insertId]); //标签文章关系表
               await sql.insert_classify_articles([findClassify[0].class_id, sqlArticleContent.insertId]);//分类文章关系表
               ctx.body = {
                   code: 1,
                   data: sqlArticleContent
               }
           }else{
               ctx.body = {
                   code: 1,
                   data: null,
                   msg:'数据出错'
               }
           }
        } catch (err) {
            ctx.body = {
                code: 1,
                data: err,
                msg:'插入数据出错'
            }
        }  
    }
}

exports.getarticlelist = async (ctx, next) => {
     let pageMessage = ctx.request.body;
     if (pageMessage.pageNum && pageMessage.pageSize) {
        let articleList = await sql.findArticleList(pageMessage.pageNum, pageMessage.pageSize);
        let totalPages = await sql.findArticleNum();
        let num = totalPages[0]['COUNT(*)'];
        articleList.map((item,index)=>{
            // console.log(item);
            //item.time = moment(item.article_date).format('YYYY-MM-DD HH:mm:ss');
            item.time = moment(item.article_date).startOf('day').fromNow();
            return item;
        })
        ctx.body = {
            code: 1,
            data: {
                articleList,
                totalPages: num
            },
        }
     }else{
         ctx.body = {
             code: 1,
             data: null,
             msg: '参数有误'
         }
     }
    
    //ctx.session.phone
    //let user_id = ctx.request.body.user_id;
    /* if (user_id) {
        let articleList = await sql.findArticleList(1, 2);
        
        ctx.body = {
            code: 1,
            data: articleList,
        }
    }else{
        ctx.body = {
            code: 0,
            data: {},
            msg: '数据有误'
        }
    } */
    
}