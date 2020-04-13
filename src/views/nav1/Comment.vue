<template>
	<section>
		<!--工具条-->
		<el-col :span="240" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref='search'>
				<el-form-item  label="用户名" prop="username">
					<el-input v-model="filters.username" ></el-input>
				</el-form-item>
				<el-form-item  label="帖子内容" prop="invContent">
					<el-input v-model="filters.invContent" ></el-input>
				</el-form-item>
				<el-form-item  label="评论内容" prop="comContent">
					<el-input v-model="filters.comContent" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getComments">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  v-on:click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<br/>
		<br/>
		<!-- <el-form>
			<el-form-item>
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</el-form-item>
		</el-form> -->

		<!--列表-->
		<el-table :data="comments" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="120">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="180">
			</el-table-column>
			<el-table-column prop="invContent" label="帖子内容" width="180">
			</el-table-column>
			<el-table-column prop="comContent" label="评论内容" width="180">
			</el-table-column>
			<el-table-column prop="comLaud" label="点赞数" width="180">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="200" :formatter="formatter">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination
			        @size-change="handleSizeChange"
			        @current-change="handleCurrentChange"
			        :current-page="this.page.currentPage"
			        :page-sizes="[5, 10, 20, 40]"
			        :page-size="this.page.pageSize"        
			        layout="total, sizes, prev, pager, next, jumper"
			        :total="total" 
					style="float:right;">    
			</el-pagination>
		</el-col>

	
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	//import NProgress from 'nprogress'
	import { getCommentListPage, deleteComment} from '../../api/api';

	export default {
		data() {
			return {
				filters: {   //搜索栏
					username: '',
					invContent: '',
					comContent: ''
				},
				comments: [], //列表数据
				total: 0, //分页
				page: {
					currentPage: 1,
					pageSize: 10
				},
				listLoading: false, //列表加载
				sels: [],//列表选中列

			

			}
		},
		methods: {
			//分页
			handleSizeChange: function (size) {
			    this.page.pageSize = size;
				this.getComments();  //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage){
			    this.page.currentPage = currentPage;
				this.getComments(); //点击第几页
			},
			//日期转换
			formatter(row, column) {
				var originDate = Date.parse(row.createTime);
				var date = new Date(originDate);
				return date.toLocaleString();
			},
			//获取评论列表
			getComments() {
				let page = this.page;
				let body = this.filters;
				this.listLoading = true;
				//NProgress.start();
				getCommentListPage(page,body).then((res) => {
					this.listLoading = false;
					if(res.data.code === 1){
						this.total = res.data.data.total;
						this.comments = res.data.data.records;
					}else{
						alert(res.data.msg);
					}
					
					//NProgress.done();
				}).catch((error) => {
					this.listLoading = false;
					if(error.response.status === 405){
						alert(error.response.data.data);
						this.$router.push({ path: '/login' });
					}else{
						alert(error.response.data.data);
					}
				  })
				;
				
			},
			//重置搜索框
			reset(){
				this.$refs.search.resetFields()
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = row.id;
					deleteComment(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getComments();
					});
				}).catch((error) => {
                     this.listLoading = false;
                     if(error.response.status === 405){
                     	alert(error.response.data.data);
                     	this.$router.push({ path: '/login' });
                     }else{
                     	alert(error.response.data.data);
                     }
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			// batchRemove: function () {
			// 	var ids = this.sels.map(item => item.id).toString();
			// 	this.$confirm('确认删除选中记录吗？', '提示', {
			// 		type: 'warning'
			// 	}).then(() => {
			// 		this.listLoading = true;
			// 		//NProgress.start();
			// 		let para = { ids: ids };
			// 		batchRemoveUser(para).then((res) => {
			// 			this.listLoading = false;
			// 			//NProgress.done();
			// 			this.$message({
			// 				message: '删除成功',
			// 				type: 'success'
			// 			});
			// 			this.getTopics();
			// 		});
			// 	}).catch(() => {

			// 	});
			// }
		},
		mounted() {
			this.getComments();
		}
	}

</script>

<style scoped>

</style>