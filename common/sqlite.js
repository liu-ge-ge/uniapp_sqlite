//创建数据库 有该数据库就打开，没有就创建

function openSqlite() {
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			name: 'systemIM', //数据库名称
			path: '_doc/systemIM', //数据库地址
			success(e) {
				resolve(e) //成功的回调
			},
			fail(e) {
				reject(e) //失败的回调
			}
		})
	})
}

//创建表 friends
// tableName string
//params object
/*
params {
	userNo:'TEXT',
	id:'INTEGER PRIMARY KEY AUTOINCREMENT',
	nick:'TEXT',
	avatar:'TEXT'
}

*/
function friendsSQL(tableName, params) {
	if (tableName.trim() === '' || typeof tableName !== 'string'){
		return new Promise(new Error('表名错误！'))
	} 
	console.log(returnIsObj(params),'params')
	if (!returnIsObj(params)) return new Promise(new Error('参数错误'))
	let str = ''
	let keys = Object.keys(params)
	keys.forEach(item => {
		str += item + ' ' + params[item] + ','
	})
	str = str.substr(0, str.length - 1)
	return new Promise((resolve, reject) => {
		//创建表格在executeSql方法里面写
		plus.sqlite.executeSql({
			name: 'systemIM',
			//表的创建或者打开
			sql: `create table if not exists ${tableName}(${str})`,
			success(e) {
				resolve(e)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

//向表格里面添加数据
function addFriendsFn(tableName,obj) {
	if(tableName.trim()==='')return new Promise(new Error('表明错误!'))
	//判断传递的参数是否格式正确
	if (returnIsObj(obj)) {
		
		let keys = Object.keys(obj)
		//判断有没有参数
		if (keys.length) {
			keys.forEach(item => {
				obj[item] = obj[item] || null
			})
			let {
				userNo,
				nick,
				avatar
			} = obj
			return new Promise((resolve, reject) => {
				plus.sqlite.executeSql({
					name: 'systemIM',
					sql: `INSERT INTO ${tableName}(${keys.join(',')}) VALUES("${userNo}","${nick}","${avatar}")`,
					success(e){
						resolve(e);
					}, 
					fail(e){
						reject(e);
					}
				})
			})
		} else {
			return new Promise((resolve, reject) => reject('添加的数据为空！'))
		}
	} else {
		return new Promise((resolve, reject) => reject('添加的数据格式不是对象！'))
	}

}

//查询数据库里面的数数据
function selectOrDeleteFriendsChatInfo(tableName,condition = {},params,type) {
	if (tableName.trim() === '' || typeof tableName !== 'string') return new Promise(new Error('表名错误！'))
	if (!returnIsObj(params)) return new Promise(new Error('参数错误'))
	if(type==='update' && ( !Object.keys(condition).length || !returnIsObj(condition) ))return new Promise(new Error('修改的参数错误'))
	let str = ''
	let keys = Object.keys(params)
	if(keys.length){
		keys.forEach(item=>{
			str+= item + '=' + params[item] + 'and '
		})		
	}
	str = str.substr(0,str.length-4)
	let sql = '';
	if(type === 'select'){
		if(str.trim() === ''){
			sql = `select * from ${tableName}`
		}else{
			sql = `select * from ${tableName} where ${str}`
		}
		
	}else if(type === 'delete'){
		sql = `delete from ${tableName} where ${str}`
	}else if(type === 'update'){
		let conKeys = Object.keys(condition)
		let str2 = ''
		conKeys.forEach(item=>{
		    str2 += item + '=' + condition[item] + ','
		})
		str2 = str2.substr(0,str2.length-1)
		if(str!==''){
			sql = `update ${tableName} set ${str2} where ${str}`
		}else{
			sql = `update ${tableName} set ${str2}`
		}
		
	}
	
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: 'systemIM',
			sql,
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}

//关闭数据库
function closeDB(name){
	return new Promise((resolve,reject)=>{
		plus.sqlite.closeDatabase({
			name,
			success(e) {
				resolve(e)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

//监听数据库是否开启
function isOpen(name,path){
	name = name || 'systemIM',
	path = path || '_doc/systemIM'
	//数据库打开了就返回true,否则返回false
	let open = plus.sqlite.isOpenDatabase({
		name,
		path
	})
	
	return open
}

function pullSQL(tableName,page,limit,type = 'asc'){
	
	return new Promise((resolve,reject) =>{
		plus.sqlite.selectSql({
			name:'pop',
			sql:`select * from ${tableName} order by list ${type} limit ${limit} offset ${(page-1)*limit}`,
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}





function returnIsObj(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}


export{
	openSqlite,
	friendsSQL,
	addFriendsFn,
	selectOrDeleteFriendsChatInfo,
	closeDB,
	isOpen,
	pullSQL
}