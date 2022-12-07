var express = require('express')
var router = express.Router();
var auth = require('../lib/auth');
var forumController = require('../controllers/forumController');
const { post } = require('jquery');

router.get('/:item_code/post/:post_id', function (req, res) {
    var datas = {
        code: req.params.item_code
    }
    
    var board_id = req.params.item_code;
    var post_id = req.params.post_id;

    forumController.Hit(board_id, post_id, function () {
        forumController.GetPostData(board_id, post_id, function(postData) {
            if(postData.length > 0) {
                datas.postId = postData[0].post_id;
                datas.title = postData[0].post_title;
                datas.content = postData[0].post_content;
                datas.authorId = postData[0].author_id;
                datas.regDate = postData[0].reg_date;

                forumController.GetComments(board_id, post_id, function (comments) {
                    if (comments.length > 0) {
                        datas.comments = comments; 
                    } else { datas.comments = {}; }

                    if (auth.isOwner(req, res)) {
                        datas.userId = req.user.user_id;
                        forumController.IsMyPost(board_id, post_id, req.user.user_id, function (result) {
                            datas.disableUpdate = result ? "" : "disabled";
                            res.render('forums/post', datas);
                        })
                    }
                    else {
                        datas.userId = "userId";
                        datas.disableUpdate = "disabled";
                        res.render('forums/post', datas);
                    }
                })
            }
        })
    });
});

router.get('/:item_code/post/:post_id/edit', function (req, res) {
    var datas = {
        code: req.params.item_code
    }

    var board_id = req.params.item_code;
    var post_id = req.params.post_id;

    if (auth.isOwner(req, res)) {
        datas.userId = req.user.user_id;
        forumController.IsMyPost(board_id, post_id, req.user.user_id, function(result) {
            if(result) {
                forumController.GetPostData(board_id, post_id, function(postData) {
                    if (postData.length > 0) {
                        datas.postId = postData[0].post_id;
                        datas.title = postData[0].post_title;
                        datas.content = postData[0].post_content;
                        res.render('forums/edit', datas);
                    }
                })
            }
            else {
                res.redirect('/');
            }
        })
    }
    else {
        res.redirect('/auth/loginRequired');
    }
});

router.post('/:item_code/post/:post_id/edit_process', function (req, res) {
    var post = req.body;
    var edited_title = post.title;
    var edited_content = post.content;

    var board_id = req.params.item_code;
    var post_id = req.params.post_id;

    forumController.IsMyPost(board_id, post_id, req.user.user_id, function (result) {
        if (result) {
            forumController.EditMyPost(board_id, post_id, edited_title, edited_content, function() {
                res.redirect(`/forums/${req.params.item_code}/1`);
            })
        }
        else { // 내가 작성한 글이 아님
            res.redirect(`/forums/${req.params.item_code}/1`);
        }
    });
});

router.post('/:item_code/post/:post_id/delete_process', function (req, res) {
    var board_id = req.params.item_code;
    var post_id = req.params.post_id;

    forumController.IsMyPost(board_id, post_id, req.user.user_id, function (result) {
        if (result) {
            forumController.DeleteMyPost(board_id, post_id, function() {
                res.redirect(`/forums/${req.params.item_code}/1`);
            })
        } else { // 내가 작성한 글이 아님
            res.redirect(`/forums/${req.params.item_code}/1`);
        }
    });
});

router.get('/:item_code/create', function (req, res) {
    var datas = {
        code: req.params.item_code
    }
    
    if (auth.isOwner(req, res)) {
        datas.userId = req.user.user_id;
        res.render('forums/create', datas);
    } else {
        res.redirect('/auth/loginRequired');
    }
});

router.post('/:item_code/post/:post_id/create_comment', function (req, res) {
    var board_id = req.params.item_code;
    var post_id = req.params.post_id;

    var datas = {
        code: board_id
    }

    if (auth.isOwner(req, res)) {
        var post = req.body;
        datas.userId = req.user.user_id;
        datas.content = post.content;
        forumController.CreateComment(board_id, post_id, req.user.user_id, post.content, function() {
            res.redirect(`/forums/${board_id}/post/${post_id}`);
        })
    } else {
        res.redirect('/auth/loginRequired');
    }
});

router.post('/:item_code/post/:post_id/delete_comment', function (req, res) {
    var board_id = req.params.item_code;
    var post_id = req.params.post_id;

    var post = req.body;
    var comment_id = post.comment_id;

    if (auth.isOwner(req, res)) {
        forumController.IsMyComment(board_id, post_id, comment_id, req.user.user_id, function (result) {
            if(result) {
                forumController.DeleteComment(board_id, post_id, comment_id, function() {
                    res.redirect(`/forums/${board_id}/post/${post_id}`);
                })
            }
            else {
                res.send(`<script>
                alert('내가 작성한 댓글이 아닙니다.');
                location.href='/forums/${board_id}/post/${post_id}'; </script>`);
            }
        })
    } else {
        res.send(`<script>
        alert('로그인을해야 삭제할 수 있습니다.');
        location.href='/forums/${board_id}/post/${post_id}'; </script>`);
    }
});

router.post('/:item_code/create_process', function (req, res) {
    var post = req.body;
    var title = post.title;
    var content = post.content;
    forumController.CreatePost(req.params.item_code, title, content, req.user.user_id, function() {
        res.redirect(`/forums/${req.params.item_code}/1`);
    })  
});

router.get('/:item_code/:page_num', function (req, res) {
    var board_id = req.params.item_code;
    var current_page_num = parseInt(req.params.page_num);
    forumController.GetBoardInfo(board_id, function(result) {
        if (result.length > 0) {

            forumController.GetPostListByPage(board_id, current_page_num, function (postList, page_post_num, max_page_num) {
                
                var pageStartIndex, pageLastIndex;
                var pwl = forumController.PAGE_WINDOW_LENGTH;

                if (pwl < max_page_num) {
                    if(current_page_num + Math.floor(pwl / 2) >= max_page_num) {
                        pageLastIndex = max_page_num;
                        pageStartIndex = pageLastIndex - pwl + 1;
                    } else if (current_page_num - Math.floor(pwl / 2) <= 1) {
                        pageStartIndex = 1;
                        pageLastIndex = pwl;
                    } else {
                        pageStartIndex = current_page_num - Math.floor(pwl / 2);
                        pageLastIndex = current_page_num + Math.floor(pwl / 2);
                    }
                } else {
                    pageStartIndex = 1;
                    pageLastIndex = max_page_num;
                }

                var datas = {
                    code: result[0].board_id,
                    title: result[0].board_name,
                    pagePostNum: page_post_num,
                    postList: postList,
                    currentPage: current_page_num,
                    maxPageNum: max_page_num,
                    pageStartIndex: pageStartIndex,
                    pageLastIndex: pageLastIndex
                }

                if (auth.isOwner(req, res)) {
                    datas.userId = req.user.user_id;
                }

                res.render('forums/index', datas);
            });
        }
    })
});


module.exports = router;