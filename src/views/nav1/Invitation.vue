<template>
	<section>
		<!--工具条-->
		<el-col :span="240" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref='search'>
				<el-form-item  label="帖子内容" prop="invContent">
					<el-input v-model="filters.invContent" ></el-input>
				</el-form-item>
				<el-form-item label="帖子类型">
					<el-select v-model="filters.invType" placeholder="请选择" width="150" clearable>
					    <el-option
					      v-for="item in options"
					      :key="item.key"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-form-item  label="话题" prop="topName">
					<el-input v-model="filters.topName" ></el-input>
				</el-form-item>
				<el-form-item  label="点赞数" prop="invLaud">
					<el-input v-model="filters.invLaud" ></el-input>
				</el-form-item>
				<el-form-item  label="分享数" prop="invShare">
					<el-input v-model="filters.invShare" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getInvitations">查询</el-button>
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
		<el-table :data="invitations" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="120">
			</el-table-column>
			<el-table-column prop="invContent" label="帖子内容" width="150">
			</el-table-column>
			<el-table-column prop="invType" label="帖子类型" width="150">
			</el-table-column>
			<!-- 这里留了个bug,因为不会遍历imge,只显示了一张图 -->
			<el-table-column prop="invImage"  label="帖子图片" width="150">
					<template slot-scope="scope">
							  <el-popover
							      placement="right"
							      title=""
							      trigger="click">
							      <img :src="scope.row.invImage" min-width="300px" height="300px"/>
							      <img slot="reference" :src="scope.row.invImage" :alt="scope.row.invImage" style="max-height: 70px;max-width: 70px">
							  </el-popover>
					</template>
			</el-table-column>
			<el-table-column prop="invVideo" label="帖子视频" width="150">
				<template slot-scope="scope">     
					   <el-popover
					       placement="right"
					       title=""
					       trigger="hover">
					       <video v-if="scope.row.invVideo !== ''" :src="scope.row.invVideo" controls="controls" min-width="300px" height="300px"/>
					       <video slot="reference" :src="scope.row.invVideo" :alt="scope.row.invVideo" style="max-height: 70px;max-width: 70px"/>
					    </el-popover>
				</template>
			
			</el-table-column> -->
			<!-- <el-table-column prop="invVideo" label="帖子视频" width="150">
			</el-table-column> -->
			<el-table-column prop="topName" label="话题" width="150">
			</el-table-column>
			<el-table-column prop="invLaud" label="点赞数" width="150">
			</el-table-column>
			<el-table-column prop="invShare" label="分享数" width="150">
			</el-table-column>
			<el-table-column prop="invStatusName" label="审核状态" width="150">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="200" :formatter="formatter">
			</el-table-column>
			<el-table-column label="操作" width="320">
				<template scope="scope">
					<el-button size="small" @click="handleCheckPass(scope.$index, scope.row)">审核通过</el-button>
					<el-button size="small" @click="handleCheckNoPass(scope.$index, scope.row)">审核不通过</el-button>
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
		<!-- <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
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
				  :headers="headers"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				 </el-upload>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog> -->

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				
				<el-form-item  label="帖子内容" prop="invContent">
					<el-input v-model="addForm.invContent" ></el-input>
				</el-form-item>
				<el-form-item label="帖子类型">
					<el-select v-model="addForm.invType" @change="selectType" placeholder="请选择" width="150" clearable>
					    <el-option
					      v-for="item in options"
					      :key="item.key"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="话题">
					<el-select v-model="addForm.topId" placeholder="请选择" width="150" clearable>
					    <el-option
					      v-for="item in topics"
					      :key="item.topName"
					      :label="item.topName"
					      :value="item.id">
					    </el-option>
					 </el-select>
				</el-form-item>
				<el-upload
				  v-show="showPicture"
				  class="upload-demo"
				  :action=url
				  :on-remove="function (res, file,fileList) { return handleRemove(res, file,1)}"
				  :on-success="function (res, file,fileList) { return handleSuccess(res, file, fileList,1)}"
				  :on-change="function (res, file,fileList) { return handleChange(res, file,1)}"
				  :file-list="fileList"
				  :headers="headers"
				  list-type="picture">
				  <el-button size="small" type="primary">图片上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png等图片文件，且不超过10MB</div>
				</el-upload>
				<el-upload
				  v-show="showVideo"
				  class="upload-demo"
				  :action=url
				  limit="1"
				  :on-remove="function (res, file,fileList) { return handleRemove(res, file,2)}"
				  :on-success="function (res, file,fileList) { return handleSuccess(res, file, fileList,2)}"
				  :on-change="function (res, file,fileList) { return handleChange(res, file,2)}"
				  :file-list="fileList"
				  :headers="headers"
				  list-type="picture">
				  <el-button size="small" type="primary">视频上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过100MB</div>
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
	import { getInvitationListPage, deleteInvitation, saveInvitation,uploadURL,getTopicListPage } from '../../api/api';

	export default {
		data() {
			return {
				headers: {token: JSON.parse(localStorage.getItem('user')).token}, //加token
				url: `${uploadURL}/other/qiniu/file/upload`,//文件上传路径
				fileList: [],//上传的文件列表
				filters: {   //搜索栏
					invContent: '',
					invType: null,
					invLaud: '',
					invShare: '',
					topName: ''
				},
				options: [{
				        key: '选项1',
				        label: '图片',
			            value: 1
				    }, {
				        key: '选项2',
				        label: '视频',
						value:2
				 }],
				topics: [],
				invitations: [], //列表数据
				showPicture: false, //图片视频控件的显示和隐藏
				showVideo: false,
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
					invContent: '',
					invType: null,
					topId: null,
					invImage: '',
					invVideo: '',
					userId: null,
				},
				user: null,

			}
		},
		created: function(){
			this.getUser();
		},
		methods: {
			//获取个人登录信息
			getUser: function(){
				this.user = localStorage.getItem('user');
			},
			//分页
			handleSizeChange: function (size) {
			    this.page.pageSize = size;
				this.getInvitations();  //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage){
			    this.page.currentPage = currentPage;
				this.getInvitations(); //点击第几页
			},
			//日期转换
			formatter(row, column) {
				var originDate = Date.parse(row.createTime);
				var date = new Date(originDate);
				return date.toLocaleString();
			},
			//选中图片、视频
			selectType: function(type){
				if(type !== null && type ===1){
					this.showPicture = true;
					this.showVideo = false;
				}else if(type !== null && type ===2){
					this.showPicture = false;
					this.showVideo = true;
				}else{
					this.showPicture = false;
					this.showVideo = false;
				}
			},
			// 文件上传(图片可多张，视频不可)
			handleSuccess(res, file, fileList,sign) {
				if(res.code === 1){
					//更新图片地址
					switch (sign){
						case 1:
						    if(this.addForm.invImage != null && this.addForm.invImage != undefined && this.addForm.invImage != ''){
								if(this.addForm.invImage.split(",").length < 3){
									this.addForm.invImage = this.addForm.invImage +','+res.data; //图片多张
								}else{
									fileList.splice(3,1);
									alert("最多只能上传三张照片");
								}
								
							}else{
								this.addForm.invImage = res.data;
							}
							break;
						case 2:
						    if(this.addForm.invVideo != '' && this.addForm.invVideo != undefined){
								fileList.splice(0,1);
							}
							this.addForm.invVideo = res.data; //视频唯一
							//alert("最多只能上传一个视频");
							break;
					}
					
				}else{
					alert("上传失败");
				}
				
			},
			handleChange(file, fileList,sign) {
				//只展示三张图
				// debugger;
				// if(fileList !== null && this.addForm.invImage.split(",").length > 2){
				// 	this.fileList = fileList.splice(0,3);
				// } 
			},
			handleRemove(file, fileList,sign) {
				//清空图片路径
				switch (sign){
					case 1:
						this.addForm.invImage = ''; //新增
						this.addForm.invVideo = '';
						this.fileList = null;
						break;
					case 2:
						this.editForm.invImage = ''; //编辑
						break;
				}
				
			},
			
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//获取帖子列表
			getInvitations() {
				let page = this.page;
				let body = this.filters;
				this.listLoading = true;
				//NProgress.start();
				getInvitationListPage(page,body).then((res) => {
					this.listLoading = false;
					if(res.data.code === 1){
						this.total = res.data.data.total;
						this.invitations = res.data.data.records;
						for(var item = 0; item < this.invitations.length; item ++){
							if(this.invitations[item].invType === 1){
								this.invitations[item].invType = '图片';
							    
								var temp = this.invitations[item].invImage.split(",");
								// 这里留了个bug,因为不会遍历imge,只显示了一张图
								this.invitations[item].invImage = temp[0];
							}else{
								this.invitations[item].invType = '视频';
							}
						}
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
			//获取话题列表
			getTopics() {
				let page ={
					currentPage: 1,
					pageSize: 100,
			    }
				let body = this.filters;
				//NProgress.start();
				getTopicListPage(page,body).then((res) => {
					if(res.data.code === 1){
						this.total = res.data.data.total;
						this.topics = res.data.data.records;
					}else{
						alert(res.data.msg);
					}
					
					//NProgress.done();
				}).catch((error) => {
					alert(error.response.data.data);
				  })
				;
				
			},
			//重置搜索框
			reset(){
				this.$refs.search.resetFields();
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = row.id;
					deleteInvitation(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getInvitations();
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
			//审核通过
			handleCheckPass: function(index,row){
				var para = {
					id: row.id,
					invStatus: 1
				}
				saveInvitation(para).then((res) => {
					this.$message({
						message: '审核成功',
						type: 'success'
					});
					this.getInvitations();
				}).catch((error) => {
					this.$message({
						message: '服务器出现异常啦',
						type: 'success'
					});
				});
			},
			//审核不通过
			handleCheckNoPass: function(index,row){
				var para = {
					id: row.id,
					invStatus: 2
				}
				saveInvitation(para).then((res) => {
					this.$message({
						message: '审核成功',
						type: 'success'
					});
					this.getInvitations();
				}).catch((error) => {
					this.$message({
						message: '服务器出现异常啦',
						type: 'success'
					});
				});
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
							saveInvitation(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getInvitations();
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
							this.addForm.userId = JSON.parse(this.user).id //个人id
							let para = this.addForm;
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							saveInvitation(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getInvitations();
								this.fileList = null;//置为null
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
						this.getInvitations();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getInvitations();
			this.getTopics();
		}
	}

</script>

<style scoped>

</style>