//电影模型
var Movie = require('../models/movie')
var _ = require('underscore')


export.detail = function() {
	//详情页面
	//通过id 获取详情页面的指定数据
	app.get('/admin/detail/:id', function(req, res) {
		var id = req.params.id
		Movie.findById(id, function(err, movie) {
			res.render('detail', {
				title: movie.title,
				movie: movie
			})
		})
	})
}


	//数据录入页面
	app.get('/admin/input', function(req, res) {
		res.render('input', {
			title: 'imooc 后台',
			movie: {
				title: '',
				doctor: '',
				country: '',
				year: '',
				poster: '',
				flash: '',
				summary: '',
				language: '',
			}
		})
	})

	//数据更新
	app.get('/admin/update/:id', function(req, res) {
		var id = req.params.id
		if (id) {
			Movie.findById(id, function(err, movie) {
				//查询到对应数据,显示出来
				res.render('input', {
					title: '后台更新页',
					movie: movie
				})
			})
		}
	})


	//通过后端录过的数据
	//1 新增
	//2 更新
	app.post('/admin/input/', function(req, res) {
		//获取表单的数据
		var id = req.body.movie._id;
		var movieObj = req.body.movie;
		var _moive
			//如果隐藏表单的id存在
			//证明是更新数据
			//否则是新增
		if (id !== 'undefined') {
			Movie.findById(id, function(err, movie) {
				if (err) {
					console.log(err)
				}
				_moive = _.extend(movie, movieObj)
				_moive.save(function(err, movie) {
					if (err) {
						console.log(err)
					}
					res.redirect('/admin/detail/' + id)
				})
			})
		} else {
			//新增
			_moive = new Movie({
				doctor: movieObj.doctor,
				title: movieObj.title,
				country: movieObj.country,
				language: movieObj.language,
				year: movieObj.year,
				flash: movieObj.flash,
				summary: movieObj.sunmmary
			})

			_moive.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				console.log('成功')
					//数据保存成功后,定位到显示页面
				res.redirect('/admin/detail/' + _moive._id)
			})
		}
	})


	//后台数据列表
	app.get('/admin/list', function(req, res) {
		Movie.fetch(function(err, movies) {
				res.render('list', {
					title: '列表',
					movies: movies
				})
			})
			// res.render('list', {
			// 	title: 'imooc 列表',
			// 	movies: [{
			// 		title    :'机器',
			// 		_id      :1,
			// 		doctor   :'机器',
			// 		country  :'美国',
			// 		year     :2014,
			// 		language :'机器',
			// 		flash    :'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
			// 	} ]
			// })
	})

	//删除功能
	app.delete('/admin/list', function(req, res) {
		var id = req.query.id
		if (id) {
			Movie.remove({
				_id: id
			}, function(err, movie) {
				if (err) {
					console.log(err)
				} else {
					res.json({
						success: 1
					})
				}
			})
		}
	