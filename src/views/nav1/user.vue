<template>
	<section>
		<!--工具条-->
		<el-col :span="240" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref='search'>
				<el-form-item  label="用户名" prop="username">
					<el-input v-model="filters.username" ></el-input>
				</el-form-item>
				<el-form-item  label="昵称" prop="nickname">
					<el-input v-model="filters.nickname" ></el-input>
				</el-form-item>
				<el-form-item  label="个性签名" prop="signature">
					<el-input v-model="filters.signature" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
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
		<el-table :data="users" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="120">
			</el-table-column>
			<el-table-column prop="image"  label="头像" width="180">
					<template slot-scope="scope">
						<el-popover
							placement="right"
							 title=""
							 trigger="click">
							 <img :src="scope.row.image" min-width="300px" height="300px"/>
							 <img slot="reference" :src="scope.row.image" :alt="scope.row.image" style="max-height: 70px;max-width: 70px">
						</el-popover>
					</template>
			</el-table-column>
			<!-- <el-table-column prop="image" label="头像" width="180"> -->
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="180">
			</el-table-column>
			<el-table-column prop="nickname" label="昵称" width="180">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="180" :formatter="formatSex">
			</el-table-column>
			<el-table-column prop="birthday" label="生日" width="180">
			</el-table-column>
			<el-table-column prop="signature" label="个性签名" width="180">
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
	import { getUserListPage, deleteUser} from '../../api/api';

	export default {
		data() {
			return {
				filters: {   //搜索栏
					username: '',
					nickname: '',
					signature: ''
				},
				users: [], //列表数据
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
			formatSex: function (row, column) {
					return row.sex == 1 ? '男' : row.sex == 2 ? '女' : '未知';
			},
			//分页
			handleSizeChange: function (size) {
			    this.page.pageSize = size;
				this.getUsers();  //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage){
			    this.page.currentPage = currentPage;
				this.getUsers(); //点击第几页
			},
			//日期转换
			formatter(row, column) {
				var originDate = Date.parse(row.createTime);
				var date = new Date(originDate);
				return date.toLocaleString();
			},
			//获取用户列表
			getUsers() {
				let page = this.page;
				let body = this.filters;
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(page,body).then((res) => {
					this.listLoading = false;
					if(res.data.code === 1){
						this.total = res.data.data.total;
						this.users = res.data.data.records;
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
					deleteUser(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
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
			
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>