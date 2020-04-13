<template>
	<section>
		<!--工具条-->
		<el-col :span="240" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref='search'>
				<el-form-item  label="发送者" prop="senderName">
					<el-input v-model="filters.senderName" ></el-input>
				</el-form-item>
				<el-form-item  label="接收者" prop="receiverName">
					<el-input v-model="filters.receiverName" ></el-input>
				</el-form-item>
				<el-form-item  label="具体讯息" prop="message">
					<el-input v-model="filters.message" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getChats">查询</el-button>
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
		<el-table :data="chats" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="120">
			</el-table-column>
			<el-table-column prop="senderName" label="发送者" width="180">
			</el-table-column>
			<el-table-column prop="receiverName" label="接收者" width="180">
			</el-table-column>
			<el-table-column prop="message" label="具体讯息" width="180">
			</el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="200" :formatter="formatter">
			</el-table-column>
			<!-- <el-table-column label="操作" width="100">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
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
	import { getChatListPage} from '../../api/api';

	export default {
		data() {
			return {
				filters: {   //搜索栏
					senderName: '',
					receiverName: '',
					message: ''
				},
				chats: [], //列表数据
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
				this.getChats();  //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage){
			    this.page.currentPage = currentPage;
				this.getChats(); //点击第几页
			},
			//日期转换
			formatter(row, column) {
				var originDate = Date.parse(row.createtime);
				var date = new Date(originDate);
				return date.toLocaleString();
			},
			//获取聊天记录列表
			getChats() {
				let page = this.page;
				let body = this.filters;
				this.listLoading = true;
				getChatListPage(page,body).then((res) => {
					this.listLoading = false;
					if(res.data.code === 1){
						this.total = res.data.data.total;
						this.chats = res.data.data.records;
					}else{
						alert(res.data.msg);
					}
					
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
			//重置搜索框
			reset(){
				this.$refs.search.resetFields()
			},
			//删除
			// handleDel: function (index, row) {
			// 	this.$confirm('确认删除该记录吗?', '提示', {
			// 		type: 'warning'
			// 	}).then(() => {
			// 		this.listLoading = true;
			// 		let para = row.id;
			// 		deleteComment(para).then((res) => {
			// 			this.listLoading = false;
			// 			this.$message({
			// 				message: '删除成功',
			// 				type: 'success'
			// 			});
			// 			this.getComments();
			// 		});
			// 	}).catch((error) => {
   //                   this.listLoading = false;
   //                   if(error.response.status === 405){
   //                   	alert(error.response.data.data);
   //                   	this.$router.push({ path: '/login' });
   //                   }else{
   //                   	alert(error.response.data.data);
   //                   }
			// 	});
			// },
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getChats();
		}
	}

</script>

<style scoped>

</style>