const db = require('../config/DB');
const MAX_POST_LENGTH = 2;
const PAGE_WINDOW_LENGTH = 3;

module.exports = { 
    MAX_POST_LENGTH: MAX_POST_LENGTH,
    PAGE_WINDOW_LENGTH: PAGE_WINDOW_LENGTH,
    CreatePost: function(board_id, post_title, post_content, author_id, cb) {
        var sql = "INSERT INTO posts (board_id, post_id, post_title, post_content, author_id, reg_date) " 
                + "VALUES(?, COALESCE((SELECT post_id FROM(SELECT MAX(post_id) as post_id FROM posts WHERE board_id = ? GROUP BY board_id) as tmp), 0) + 1, " 
                + "?, ?, ?, CURRENT_TIMESTAMP);";
        var params = [board_id, board_id, post_title, post_content, author_id];
        db.query(sql, params, function(err, result) {
            if(err) throw err;
            console.log("글 작성 성공");
            cb();
        })
    },
    CreateComment: function (board_id, post_id, author_id, comment_content, cb) {
        var sql = "INSERT INTO comments (board_id, post_id, author_id, comment_content, reg_date) "
                + "VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP);";
        var params = [board_id, post_id, author_id, comment_content];
        db.query(sql, params, function (err, result) {
            if (err) throw err;
            console.log("댓글 작성 성공");
            cb();
        })
    },
    GetBoardInfo: function(board_id, cb) {
        var sql = "SELECT * FROM board WHERE board_id = ?;";
        db.query(sql, [board_id], function (err, result) {
            if (err) throw err;
            cb(result);
        })
    },
    GetTotalPostNum(board_id, cb) {
        var sql = "SELECT count(*) as total_post_num FROM posts WHERE board_id = ?;";
        db.query(sql, [board_id], function (err, result) {
            if (err) throw err;
            cb(result[0].total_post_num);
        })
    },
    // page_num starts with the index 1
    GetPostListByPage: function (board_id, current_page_num, cb) {
        this.GetTotalPostNum(board_id, function (total_post_num) {
            var sql = "SELECT post_id, post_title, reg_date, hit FROM posts WHERE board_id = ? ORDER BY post_id DESC LIMIT ?, ?;";
            var remain_post_num = total_post_num % MAX_POST_LENGTH;
            var max_page_num;

            if(total_post_num) max_page_num = Math.floor(total_post_num / MAX_POST_LENGTH) + (remain_post_num == 0 ? 0 : 1);
            else max_page_num = 1;

            var page_num = Math.min(current_page_num, max_page_num);
            var start_index = (page_num - 1) * MAX_POST_LENGTH;

            var page_post_num;
            if(page_num == max_page_num) {
                if (remain_post_num == 0 && total_post_num != 0) page_post_num = MAX_POST_LENGTH;
                else if (remain_post_num == 0 && total_post_num == 0) page_post_num = 0;
                else page_post_num = total_post_num % MAX_POST_LENGTH;
            } else {
                page_post_num = MAX_POST_LENGTH;
            }

            db.query(sql, [board_id, start_index, start_index + page_post_num], function (err, postList) {
                if (err) throw err;
                cb(postList, page_post_num, max_page_num);
            })
        })
    },
    GetPostData: function (board_id, post_id, cb) {
        var sql = "SELECT * FROM posts WHERE board_id = ? AND post_id = ?";
        db.query(sql, [board_id, post_id], function (err, postData) {
            if (err) throw err;
            cb(postData);
        })
    },
    IsMyPost: function (board_id, post_id, user_id, cb) {
        var sql = "SELECT author_id FROM posts WHERE board_id = ? AND post_id = ?";
        db.query(sql, [board_id, post_id], function (err, result) {
            if (err) throw err;
            if (result[0].author_id == user_id) cb(true);
            else cb(false);
        })
    },
    EditMyPost: function (board_id, post_id, edited_title, edited_content, cb) {
        var sql = "UPDATE posts SET post_title = ?, post_content = ?, reg_date = CURRENT_TIMESTAMP " 
                + "WHERE board_id = ? AND post_id = ?;";
        var params = [edited_title, edited_content, board_id, post_id];
        db.query(sql, params, function (err, result) {
            if (err) throw err;
            console.log("게시글 수정 성공");
            cb();
        })
    },
    DeleteMyPost: function (board_id, post_id, cb) {
        var sql = "DELETE FROM posts WHERE board_id = ? AND post_id = ?;";
        var params = [board_id, post_id];
        db.query(sql, params, function (err, result) {
            if (err) throw err;
            console.log("게시글 삭제 성공");
            cb();
        })
    },
    Hit: function(board_id, post_id, cb) {
        var sql = "UPDATE posts SET hit = hit + 1 WHERE board_id = ? AND post_id = ?;";
        var params = [board_id, post_id];
        db.query(sql, params, function (err, result) {
            if (err) throw err;
            console.log("조회수 증가");
            cb();
        })
    },
    GetComments: function (board_id, post_id, cb) {
        var sql = "SELECT author_id, comment_content, reg_date FROM comments WHERE board_id = ? AND post_id = ?;";
        var params = [board_id, post_id];
        db.query(sql, params, function (err, result) {
            if (err) throw err;
            console.log("댓글 조회");
            cb(result);
        })
    }
}