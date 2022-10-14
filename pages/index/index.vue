<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import {
		openSqlite,
		isOpen,
		friendsSQL,
		addFriendsFn,
		selectOrDeleteFriendsChatInfo
	} from '../../common/sqlite.js'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			openSqlite().then(res => {
				console.log(res,'数据库')
			}).catch(err => {
				console.log(err, 'err')
			})
			if (isOpen()) {
				console.log('打开了!')
				friendsSQL('friendsIM', {
					userNo: 'TEXT',
					id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
					nick: 'TEXT',
					avatar: 'TEXT'
				}).then(res => {
					console.log(res, '创建表')
					addFriendsFn('friendsIM', {
						userNo: 'kx123',
						nick: 'liugege真帅',
						avatar: 'https'
					}).then(res => {
						console.log(res, '添加数据成功')
						selectOrDeleteFriendsChatInfo('friendsIM',{},{},'select').then(res=>{
							console.log(res,'查询成功')
						})
						
					}).catch(err => {
						console.log(err, '添加数据失败')
					})
				}).catch(err => {
					console.log(err, 'create')
				})
			} else {
				console.log('失败')
			}
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
