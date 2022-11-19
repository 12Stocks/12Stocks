
module.exports = function (app) {
    // TODO : 암호화 하여 관리자들도 볼 수 없도록 해야함
    var authData = {
        username: 'team12',
        password: '1234',
    };

    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function (req, res, next) {
        res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.currentUser = req.user;
        next();
    });

    // login이 성공했을 때, session store에 저장하는 기능
    passport.serializeUser(function (user, done) {
        if(user)
        {
            // 2번째 인자로 사용자 식별자를 받음, session data의 passport안에 user의 값으로 들어감
            console.log('serializeUser', user);
            done(null, user.username);
        }
    });

    // login되었을 때 page에 방문마다 cb가 호출됨
    // 데이터가 저장되어있는 authData에서 사용자의 실제 데이터를 조회하여 가져옴
    // id로 user의 식별자가 주입되고 이 id값으로 데이터베이스를 조회
    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser', id);
        done(null, authData); // authData가 request.user로 전달됨
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'uname',
            passwordField: 'psw'
        },
        function (username, password, done) {
            console.log('LocalStrategy', username, password);
            if (username === authData.username) {
                if (password === authData.password) {
                    return done(null, authData);
                    // authData는 serialize user의 cb함수의 첫번째인자로 주입됨
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));
    return passport;
}
