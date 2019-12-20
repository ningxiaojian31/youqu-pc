<template>
	<section>
		<!--工具条-->
		<el-col :span="240" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref='search'>
				<el-form-item  label="话题名" prop="topName">
					<el-input v-model="filters.topName" ></el-input>
				</el-form-item>
				<el-form-item  label="话题备注" prop="topNote">
					<el-input v-model="filters.topNote" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getTopics">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  v-on:click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-form>
			<el-form-item>
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</el-form-item>
		</el-form>

		<!--列表-->
		<el-table :data="topics" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="120">
			</el-table-column>
			<el-table-column prop="topName" label="话题名" width="180">
			</el-table-column>
			<el-table-column prop="topNote" label="话题备注" width="180">
			</el-table-column>
			<el-table-column prop="topImage" label="话题图片" width="180">
				<template slot-scope="scope">     
					   <el-popover
					       placement="right"
					       title=""
					       trigger="click">
					       <img :src="scope.row.topImage" min-width="300px" height="300px"/>
					       <img slot="reference" :src="scope.row.topImage" :alt="scope.row.topImage" style="max-height: 70px;max-width: 70px">
					      </el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="200" :formatter="formatter">
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="话题名">
					<el-input v-model="editForm.topName" :min="0" :max="200"></el-input>
				</el-form-item>
				<el-form-item label="话题备注">
					<el-input v-model="editForm.topNote" :min="0" :max="200"></el-input>
				</el-form-item>
				<el-form-item>
					<template slot-scope="scope">
					     <img :src="editForm.topImage"  min-width="70" height="70" />
					</template>
				</el-form-item>
				<el-upload
				  class="upload-demo"
				  :action=url
				  limit="1"
				  :on-remove="function (res, file,fileList) { return handleRemove(res, file,2)}"
				  :on-success="function (res, file,fileList) { return handleSuccess(res, file, fileList,2)}"
				  :on-change="function (res, file,fileList) { return handleChange(res, file,2)}"
				  :file-list="fileList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				 </el-upload>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				
				<el-form-item label="话题名">
					<el-input v-model="addForm.topName" :min="0" :max="200"></el-input>
				</el-form-item>
				<el-form-item label="话题备注">
					<el-input v-model="addForm.topNote" :min="0" :max="200"></el-input>
				</el-form-item>
				<el-upload
				  class="upload-demo"
				  :action=url
				  limit="1"
				  :on-remove="function (res, file,fileList) { return handleRemove(res, file,1)}"
				  :on-success="function (res, file,fileList) { return handleSuccess(res, file, fileList,1)}"
				  :on-change="function (res, file,fileList) { return handleChange(res, file,1)}"
				  :file-list="fileList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	//import NProgress from 'nprogress'
	import { getTopicListPage, deleteTopic, saveTopic,uploadURL } from '../../api/api';

	export default {
		data() {
			return {
				url: `${uploadURL}/qiniu/file/upload`,//文件上传路径
				fileList: [],//上传的文件列表
				filters: {   //搜索栏
					topName: '',
					topNote: '',
					topImage: ''
				},
				topics: [], //列表数据
				total: 0, //分页
				page: {
					currentPage: 1,
					pageSize: 10
				},
				listLoading: false, //列表加载
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					topName: '',
					topNote: '',
					topImage: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					topName: '',
					topNote: '',
					topImage: ''
				}

			}
		},
		methods: {
			//分页
			handleSizeChange: function (size) {
			    this.page.pageSize = size;
				this.getTopics();  //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage){
			    this.page.currentPage = currentPage;
				this.getTopics(); //点击第几页
			},
			//日期转换
			formatter(row, column) {
				var originDate = Date.parse(row.createTime);
				var date = new Date(originDate);
				return date.toLocaleString();
			},
			// 文件上传
			handleSuccess(res, file, fileList,sign) {
				if(res.code === 1){
					//更新图片地址
					switch (sign){
						case 1:
							this.addForm.topImage = res.data; //新增
							break;
						case 2:
							this.editForm.topImage = res.data; //编辑
							break;
					}
					
				}else{
					alert("上传失败");
				}
				
			},
			handleChange(file, fileList,sign) {
				//只展示一张图
				if(fileList !== null){
					this.fileList = fileList.splice(0,1);
				} 
			},
			handleRemove(file, fileList,sign) {
				//清空图片路径
				switch (sign){
					case 1:
						this.addForm.topImage = ''; //新增
						break;
					case 2:
						this.editForm.topImage = ''; //编辑
						break;
				}
				
			},
			
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//获取话题列表
			getTopics() {
				let page = this.page;
				let body = this.filters;
				this.listLoading = true;
				//NProgress.start();
				getTopicListPage(page,body).then((res) => {
					this.listLoading = false;
					if(res.data.code === 1){
						this.total = res.data.data.total;
						this.topics = res.data.data.records;
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
					//NProgress.start();
					let para = row.id;
					deleteTopic(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getTopics();
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					topName: '',
					topNote: '',
					topImage: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = this.editForm;
							saveTopic(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getTopics();
							}).catch((error) => {
								this.listLoading = false;
								if(error.response.status === 405){
									alert(error.response.data.data);
									this.$router.push({ path: '/login' });
								}else{
									alert(error.response.data.data);
								}
							
							  });
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = this.addForm;
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							saveTopic(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getTopics();
							}).catch((error) => {
								this.listLoading = false;
								if(error.response.status === 405){
									alert(error.response.data.data);
									this.$router.push({ path: '/login' });
								}else{
									alert(error.response.data.data);
								}
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getTopics();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getTopics();
		}
	}

</script>

<style scoped>

</style>