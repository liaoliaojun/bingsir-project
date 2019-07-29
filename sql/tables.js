
//网站管理
const options = `create table if not exists options(
    option_id INT NOT NULL AUTO_INCREMENT COMMENT '选项ID',
    option_name VARCHAR(20) NOT NULL COMMENT '选项名称',
    option_values LONGTEXT NOT NULL COMMENT '选项值',
    PRIMARY KEY (option_id),
    KEY option_name(option_name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;`   
//用户表
const users = `create table if not exists users(
    user_id INT NOT NULL AUTO_INCREMENT COMMENT '用户id',
    user_name varchar(20) NOT NULL COMMENT '用户名',
    user_password varchar(30) NOT NULL COMMENT '密码',
    user_email varchar(20) NOT NULL COMMENT '用户邮箱',
    user_profile_photo varchar(255) NOT NULL COMMENT '用户头像',
    user_level varchar(20) NOT NULL COMMENT '用户等级',
    user_rights varchar(20) NOT NULL COMMENT '用户权限',
    user_registration_time datetime NOT NULL COMMENT '用户注册时间',
    user_telephone_number int NOT NULL COMMENT '用户手机号',
    user_nickname varchar(20) NOT NULL COMMENT '用户昵称',
    PRIMARY KEY(user_id),
    KEY user_name(user_name),
    KEY user_nickname(user_nickname),
    KEY user_email(user_email),
    KEY user_telephone_number(user_telephone_number)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;`
//用户好友
const friends = `create table if not exists friends(
    friends_id INT NOT NULL AUTO_INCREMENT COMMENT '好友id',
    user_id INT NOT NULL COMMENT '用户id',
    friends_note varchar(20) NOT NULL COMMENT '好友备注',
    friends_status varchar(20) NOT NULL COMMENT '好友状态',
    PRIMARY KEY(friends_id),
    KEY user_id(user_id),
    foreign key(user_id) references users(user_id)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;`
//博文表
const articles = `create table if not exists articles(
    article_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    article_title text NOT NULL,
    article_content longtext NOT NULL,
    article_views INT NOT NULL,
    article_comment_count int NOT NULL,
    article_date datetime NOT NULL,
    article_like_count INT NOT NULL,
    PRIMARY KEY(article_id),
    KEY user_id(user_id)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;`
//评论表
const comments = `create table if not exists comments(
    comment_id INT NOT NULL AUTO_INCREMENT,
    article_id INT NOT NULL COMMENT '当前评论文章id',
    uid INT NOT NULL COMMENT '发表用户',
    comment_like_count INT NOT NULL COMMENT '点赞数',
    comment_content text NOT NULL COMMENT '评论内容',
    comment_date datetime NOT NULL,
    comment_parent_id INT NOT NULL COMMENT '当前评论谁',
    PRIMARY KEY(comment_id),
    foreign key(article_id) references articles(article_id)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8;`
const classify = `create table if not exists classify(
    class_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(20) not null,
    class_description VARCHAR(60) not null,
    class_another_name VARCHAR(20) not null,
    class_parent_id INT not null,
    KEY class_parent_id(class_parent_id)
)ENGINE = InnoDB  DEFAULT CHARSET = utf8;`
const classify_articles = `create table if not exists classify_articles(
    
)`
module.exports  ={
    options,
    users,
    friends,
    articles,
    comments
}