<template>
  <div class="app-container">

    <div class="filter-container">
      <el-tag v-for="(tag,index) in tags" :key="index" closable type="success" class="filter-item"
              style="margin-right: 5px" :disable-transitions="false" @close="handleClose(tag)">
        {{tag.title}}
      </el-tag>
      <el-input v-model="title" placeholder="请输入..." style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="importance" class="filter-item select" style="width: 90px" clearable>
        <el-option v-for="(item,index) in importanceOptions"
                   :label="item.label"
                   :value="item.value"
                   :key="index"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        添加
      </el-button>
      <!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                       @click="handleDownload">
              导出
            </el-button>
            <el-popover
              placement="top-start"
              title="关于导入excel"
              width="200"
              trigger="hover"
              style="margin-left: 10px">
              <div><span>导入的文件必须已一定的模板格式</span><a href="http://10.18.5.173:8080/bsm/writeModel" style="color: lightskyblue">
                下载模板</a></div>
              <el-button slot="reference" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload2"
                         @click="handleUpload">
                导入
              </el-button>
            </el-popover>-->
      <input type="file" ref="upload" style="display:none;" @change="uploadChange">

      <el-popconfirm
        style="padding-left: 10px"
        title='您确定要删除选中项吗'
        @onConfirm="handleDeleteMore">
        <el-button class="filter-item" type="danger" icon="el-icon-delete" slot="reference">
          删除
        </el-button>
      </el-popconfirm>
    </div>

    <div class="table-container" ref="tab">
      <div ref="elTab">
        <el-table
          :data="list"
          border
          fit
          highlight-current-row
          :row-key='getRowKeys'
          @selection-change="handleSelectionChange"
          style="width: 100%;">

          <el-table-column
            width="50px" align="center"
            :reserve-selection="true"
            type="selection"/>

          <el-table-column
            width="100px" align="center"
            label="序号"
            type="index">
            <template slot-scope="scope">
              {{ scope.$index + (currentPage - 1) * pagesize + 1 }}
            </template>
          </el-table-column>

          <el-table-column
            width="120px" align="center"
            label="学期"
            prop="term"/>

          <el-table-column
            width="250px" align="center"
            label="课程名称"
            prop="course_name"/>

          <el-table-column
            min-width="150px" align="center"
            label="开设专业"
            prop="specialtyName"/>

          <el-table-column
            width="100px" align="center"
            label="任课教师"
            prop="t_name"/>

          <el-table-column
            width="50px" align="center"
            label="学时"
            prop="class_hour"/>

          <el-table-column
            width="250px" align="center"
            label="授课计划"
            prop="teaching_plan"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <a :href='"http://10.18.5.173:8080/file/teaching_plan/"+scope.row.teaching_plan'
                 style="color: #3a8ee6;text-decoration: underline">{{scope.row.teaching_plan}}</a>
            </template>

          </el-table-column>

          <el-table-column
            width="100px" align="center"
            label="提交状态"
            prop="submit_state"
            :filters="[{ text: '未提交', value: '未提交' }, { text: '待审核', value: '待审核' }, { text: '未通过', value: '未通过' }, { text: '已提交', value: '已提交' }]"
            :filter-method="filterTag">
            <template slot-scope="scope">
              <el-tag :type="tagType(scope.row)">
                {{scope.row.submit_state}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            width="150px" align="center"
            label="提交时间"
            prop="submit_time"/>

          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next"
      :page-size="pagesize"
      :current-page="currentPage"
      :total="total"
      :page-count="pageCount"
      background
    ></el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close="dialogClose">

      <el-form ref="form" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">

        <el-form-item label="学期:" prop="term">
          <el-input v-model="temp.term"/>
        </el-form-item>

        <el-form-item label="课程名称:" prop="course_name">
          <el-input v-model="temp.course_name"/>
        </el-form-item>

        <el-form-item label="开设专业:" prop="specialtyName">
          <el-select v-model="temp.specialtyName" @change="specialtySelect">
            <el-option v-for="item in selection_list.specialty_list" :key="item.name" :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任课教师:" prop="t_name">
          <el-select v-model="temp.t_name" no-data-text="请先选择开设专业">
            <el-option v-for="item in selection_list.teacher_list" :key="item.name" :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学时:" prop="class_hour">
          <el-input v-model="temp.class_hour"/>
        </el-form-item>

        <el-form-item label="授课计划:" prop="teaching_plan">
          <span>{{temp.teaching_plan}}</span>
          <el-upload
            action="http://10.18.5.173:8080/courseplan/fileupload"
            :file-list="fileList"
            ref="upload"
            :limit="1"
            :data="{'data':tempStr}"
            accept=".doc,.docx"
            :auto-upload="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            name="upload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.doc,.docx文件，且不超过100mb</div>
          </el-upload>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    createArticle,
    updateArticle,
    exportExcel, batchExport
  } from "@/api/article";

  import {fetchList, fetchSelectionList, uploadFile, deleteArticle, deleteArticleMore} from "@/api/document";


  export default {
    name: "teacher",
    data() {
      return {
        list: [],
        fileList: [],
        currentPage: 1,
        pagesize: 0,
        total: 0,
        pageCount: 0,
        multipleSelection: [],
        temp: {
          term: 0,
          course_name: '',
          specialtyName: '',
          t_name: '',
          class_hour: '',
          teaching_plan: '',
        },
        title: '',
        importance: '',
        tags: [],
        timestamp: '',
        selection_list: {
          specialty_list: [],
          teacher_list: [],
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        importanceOptions: [
          {
            value: 'course_name',
            label: '课程名称'
          }, {
            value: 'specialtyName',
            label: '开设专业'
          }, {
            value: 't_name',
            label: '任课教师'
          }, /*{
            value: 't_department',
            label: '院系'
          },*/ /*{
            value: 't_birthday',
            label: '出生年月'
          }, */{
            value: 't_stationt_',
            label: '岗位'
          }, {
            value: 't_education',
            label: '学历'
          }, {
            value: 't_degree',
            label: '学位'
          },
          {
            value: 't_phone',
            label: '联系电话'
          }/*, {
            value: 't_email',
            label: '邮箱'
          }*/
        ],
        rules: {
          t_id: [
            {required: true, message: '请输入教师工号,应由10个数字组成', trigger: 'change', min: 10, max: 10},
          ],
          t_sex: [
            {required: true, message: '请输入教师性别', trigger: 'change'},
          ],
          t_department: [
            {required: true, message: '请输入院系', trigger: 'change'},
          ],
          t_birthday: [
            {required: true, message: '请输入教师生日', trigger: 'change'},
          ],
          t_stationt_: [
            {required: true, message: '请输入教师岗位', trigger: 'change'},
          ],
          t_education: [
            {required: true, message: '请输入教师学历', trigger: 'change'},
          ],
          t_degree: [
            {required: true, message: '请输入教师学位', trigger: 'change'},
          ],

        },
        downloadLoading: false,
        uploadLoading: false,
        hasFile: false
      }
    },
    methods: {
      getList(data) {
        fetchList(data).then(res => {
          this.list = res.message
          this.total = res.listQuery.total
          this.currentPage = res.listQuery.pageNum
          this.pagesize = res.listQuery.pageSize
          this.pageCount = res.listQuery.pages
        })
      },

      getSelectionList() {
        fetchSelectionList().then(res => {
          const list = res.message[0].children
          const arr = []

          this.selection_list.specialty_list = list
        })
      },

      specialtySelect(value) {
        if (value === '') {
          return this.$message.error('服务器未知错误')
        }
        for (let item of this.selection_list.specialty_list) {
          if (item.name === value) {
            this.selection_list.teacher_list = item.children
            break
          }
        }

      },

      resetTemp() {
        this.temp = {
          id: 0,
          term: '',
          course_name: '',
          specialtyName: '',
          t_name: '',
          class_hour: '',
          teaching_plan: '',
        }
      },

      handleUpdate(row) {
        this.temp = Object.assign({}, row) //ES6语法，用于对象合并
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      },

      handleDelete(row, index) {
        deleteArticle(row).then(res => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
          this.getList({page: this.currentPage})
        })
      },

      createData() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.upload.submit()
          }
        })
      },

      async updateData() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.hasFile)
              this.$refs.upload.submit()

            const formData = new FormData()
            formData.append('upload', '')
            formData.append('data', this.tempStr)

            uploadFile(formData).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
        this.getList({page: this.currentPage, query: this.tags})
        this.$refs.upload.clearFiles()
        this.dialogFormVisible = false
      },

      handleCurrentChange(currentPage) {
        const query = Object.assign([], this.tags)
        this.currentPage = currentPage
        this.getList({page: currentPage, query})
      },

      handleFilter() {
        if (this.title.length === 0 || this.importance.length === 0) {
          this.$message.warning("搜索类型、搜索内容均不能为空")
          return
        }
        const tagItem = {
          title: this.title,
          importance: this.importance
        }

        let result = this.tags.some(e => {
          if (e.title === tagItem.title) {
            if (e.importance === tagItem.importance) {
              return true
            }
          }
        });

        if (result) {
          this.$message.warning("搜索类型、搜索内容均不能为相同")
          return;
        }

        this.getList({query: this.tags})
        this.tags.push(tagItem)
        this.title = ''
        this.importance = ''
      },

      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.getList({query: this.tags})
      },

      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      },

      handleDownload() {
        this.downloadLoading = true
        let a = document.createElement('a')
        a.href = `http://10.18.5.173:8080/bsm/writeExcel`
        a.click()
        this.downloadLoading = false
      },

      uploadChange(data) {

        let file = data.target.files[0]
        if (!file) return

        let formData = new FormData()
        formData.append('excel', file)

        batchExport(formData).catch(err => {
          console.log(err);
        })
      },

      handleUpload() {
        this.$refs.upload.click();
      },

      handleDeleteMore() {
        deleteArticleMore(this.multipleSelection).then(res => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList({page: this.currentPage})
          this.$refs.multipleTable.clearSelection();
        })
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      getRowKeys(row) {

        return row.id
      },
      uploadSuccess() {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.getList({page: this.currentPage, query: this.tags})
      },
      uploadError() {
        this.$notify({
          title: '失败',
          message: '创建失败，文件格式不符或文件大于100mb',
          type: 'error',
          duration: 20000
        })
      },
      beforeUpload(file) {
        if (file) {
          this.hasFile = true
        }
      },
      dialogClose() {
        this.$refs.upload.clearFiles()
      },
      filterTag(value, row) {
        return row.submit_state === value;
      },
      tagType: function (row) {
        switch (row.submit_state) {
          case '已提交':
            return 'success';
          case '未提交':
            return 'info';
          case '待审核':
            return 'warning';
          case '未通过':
            return 'danger';
        }
      }

    },
    created() {
      this.getSelectionList()
      this.getList({page: this.currentPage, query: this.tags})
    },
    watch: {
      list: function () {
        this.$nextTick(() => {
          const size = this.$refs.tab
          const preSize = this.$refs.elTab
          size.style.height = preSize.clientHeight + 'px'
        })
      }
    },
    computed: {
      tempStr: function () {
        return JSON.stringify(this.temp)
      }
    }
  }
</script>

<style scoped>
  .table-container {
    transition: all 0.5s ease;
    width: 100%;
    overflow-y: hidden;
  }
</style>
