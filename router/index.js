const Router = require('koa-router');
const router = new Router();
const loginModule = require('../modules/loginModule');
const userinfoModule = require('../modules/userinfoModule');
const classList = require('../modules/article/class');
const contentModule = require('../modules/article/content');
const classModule = require('../modules/class');
/* router.get("/*", async (ctx, next) => {
    await ctx.render('/index')
}); */

router.get("/*", async (ctx, next) => {
    console.log(ctx);
    await ctx.render('/index');
});

/*
//使用ejs渲染页面 
router.get('/home', async (ctx) => {
    let title = '你好ejs';
    let list = ['哈哈', '嘻嘻', '看看', '问问'];
    let content = "<h2>这是一个h2</h2>";
    let num = 10;
    await ctx.render('page/index', {
      data: {
          title,
          list,
          content,
          num,
      }
    });
}); */

router.post('/*', async (ctx, next) => {
   
    if (ctx.body&&ctx.body.loginMiss) {
        ctx.body =  {
            code: -1,
            data:{
                lose: true
            },
            msg: "登录已失效,请重新登录"
        };
    }else{
        await next();
    }
})

router.post('/login', loginModule.login);

router.post('/register', loginModule.register);

// router.post('/userinfo', userinfoModule.userinfo);

router.post('/class-list', classList.classlist);

router.post('/insertarticle', contentModule.insertarticle);

router.post('/getarticlelist', contentModule.getarticlelist);

router.post('/loginStatus', loginModule.loginStatus);

router.post('/get-article-details', contentModule.getArticleDetails);

router.post('/to-follow', contentModule.follow);

router.post('/classify-list', classModule.classlist);

router.post('/classify-tag-list', classModule.classifyTagList);

router.post('/send-view', contentModule.sendView);

router.post('/get-user-data', userinfoModule.getUserData);

router.post('/update-user-sign', userinfoModule.updateUserSign);

router.post('/userinfo-by-id', userinfoModule.userinfoById);

router.post('/find-article-id', contentModule.findArticleId);

router.post('/update-articleinfo', contentModule.updateArticleinfo);

module.exports = router;