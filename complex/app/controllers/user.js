var User = require('../models/user')

// signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  })
}

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  })
}


//用户注册
exports.signup = function(req, res) {
	// req.query
	// req.params
	var _user = req.body.user;
	//是不是重复增加
	User.findById({
		name: _user.name
	}, function(err, user) {
		if (user) {
			return res.redirect('/signin')
		}
		var user = new User(_user)
		user.save(function(err, user) {
			if (err) {
				console.log(err)
			}
			res.redirect('/admin/userlist')
		})
	})
}
  
//用户登录
exports.signin = function(req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password
	console.log(name,password)
	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err)
		}
		//用户不存在
		if (!user) {
			return res.redirect('/signin')
		}
		//用户存在,验证密码
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}
			if (isMatch) {
				//保存登陆成功会话
				req.session.user = user
				return res.redirect('/')
			} else {
				return res.redirect('./signin')
			}
		})
	})
}

//用户列表
exports.userlist =  function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err)
		}
		res.render('userlist', {
			title: '用户列表',
			users: users
		})
	})
}

//退出销毁session
exports.logout =  function(req, res) {
	delete req.session.user
	delete app.locals.user
	res.redirect('/')
}



//用户权限管理
//中间件
exports.signinRequired = function(req, res, next) {
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user
  console.log(222222,user)
  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}