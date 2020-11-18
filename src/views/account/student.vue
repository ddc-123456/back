<template>
  <div class="app-container">
    <el-header>

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
        <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                   @click="handleDownload">
          导出
        </el-button>
        <el-popover
          placement="top-start"
          title="关于导入excel"
          width="200"
          trigger="hover"
          style="margin-left: 10px">
          <div><span>导入的文件必须已一定的模板格式</span><a href="http://10.18.5.173:8080/bsmstu/writeModel"
                                              style="color: lightskyblue">
            下载模板</a></div>
          <el-button slot="reference" :loading="downloadLoading" class="filter-item" type="primary"
                     icon="el-icon-upload2"
                     @click="handleUpload">
            导入
          </el-button>
        </el-popover>
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
    </el-header>
    <el-container>
      <el-aside>
        <el-tree :data="classTree" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" node-key="id" :default-expanded-keys="[1]"
                 style="margin:20px 0"></el-tree>
      </el-aside>
      <el-main style="min-width: 534px">
        <el-table
          ref="multipleTable"
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
            label="学号"
            prop="stu_id"/>

          <el-table-column
            width="120px" align="center"
            label="姓名"
            prop="stu_name"/>

          <el-table-column
            width="50px" align="center"
            label="性别"
            prop="stu_sex"/>

          <el-table-column
            min-width="150px" align="center"
            label="院系"
            prop="t_department"/>

          <el-table-column
            width="100px" align="center"
            label="出生年月"
            prop="stu_birthday"/>

          <el-table-column
            width="150px" align="center"
            label="入学年份"
            prop="year_of_enrolme"/>

          <!--          <el-table-column-->
          <!--            width="150px" align="center"-->
          <!--            label="密码"-->
          <!--            prop="stu_pwd"/>-->

          <el-table-column
            width="150px" align="center"
            label="专业"
            prop="specialtyName"/>


          <el-table-column
            width="180px" align="center"
            label="班级"
            prop="class_name"/>

          <!--          <el-table-column-->
          <!--            width="150px" align="center"-->
          <!--            label="邮箱"-->
          <!--            prop="t_email"/>-->

          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
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
        <el-pagination
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :page-size="pagesize"
          :current-page="currentPage"
          :total="total"
          :page-count="pageCount"
          background/>
      </el-main>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="form" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">

        <el-form-item label="学号:" prop="stu_id">
          <el-input v-model="temp.stu_id"/>
        </el-form-item>

        <el-form-item label="姓名:" prop="stu_name">
          <el-input v-model="temp.stu_name"/>
        </el-form-item>

        <el-form-item label="性别:" prop="stu_sex">
          <el-radio v-model="temp.stu_sex" label="男"></el-radio>
          <el-radio v-model="temp.stu_sex" label="女"></el-radio>
        </el-form-item>

        <el-form-item label="院系:" prop="t_department">
          <el-select v-model="temp.t_department" @change="departmentSelect">
            <el-option v-for="item in selection_list.department_list" :key="item.dep_id" :label="item.t_department"
                       :value="item.t_department"></el-option>
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="专业:" prop="stu_specialty">-->
        <!--          <el-select v-model="temp.stu_specialty" @change="specialtySelect">-->
        <!--            <el-option v-for="item in selection_list.specialty_list" :key="item.specialty_id" :label="item.specialty"-->
        <!--                       :value="item.specialty"></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <el-form-item label="班级:" prop="class_name">
          <el-select v-model="temp.class_name">
            <el-option v-for="item in selection_list.class_list" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出生年月:" prop="stu_birthday">
          <el-date-picker
            v-model="temp.stu_birthday"
            value-format="yyyy-MM"
            type="month"
            placeholder="请选择出生年份">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="入学年份:" prop="year_of_enrolme">
          <el-date-picker
            v-model="temp.year_of_enrolme"
            value-format="yyyy"
            type="year"
            placeholder="请选择入学">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="密码:" prop="stu_pwd">
          <el-input v-model="temp.stu_pwd"/>
        </el-form-item>


        <!--    <el-form-item label="邮箱:">
              <el-input v-model="temp.t_email"/>
            </el-form-item>-->

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
    deleteArticle,
    fetchStuSelectionList,
    updateArticle,
    deleteArticleMore,
    exportExcel,
    batchExport,
    fetchStuList,
    fetchStu,
    createStuArticle,
    updateStuArticle,
    deleteStuArticle,
    deleteStuArticleMore, batchStuExport
  } from "@/api/article";


  export default {
    name: "student",
    data() {
      return {
        list: [],
        currentPage: 1,
        pagesize: 0,
        total: 0,
        pageCount: 0,
        multipleSelection: [],
        classTree: [],
        class: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        temp: {
          stu_id: 0,
          stu_pwd: '',
          stu_name: '',
          stu_sex: '',
          stu_birthday: '',
          class_name: '',
          t_department: '',
          year_of_enrolme: '',
          stu_specialty: ''
        },
        title: '',
        importance: '',
        tags: [],
        timestamp: '',
        selection_list: {
          department_list: [],
          class_list: [],
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        importanceOptions: [
          {
            value: 'stu_id',
            label: '学号'
          }, {
            value: 'stu_name',
            label: '姓名'
          }, {
            value: 'stu_sex',
            label: '性别'
          }/*, {
            value: 't_department',
            label: '院系'
          }*/, /*{
            value: 't_birthday',
            label: '出生年月'
          }, */{
            value: 'year_of_enrolme',
            label: '入学年份'
          }, {
            value: 'specialtyName',
            label: '专业'
          }, {
            value: 'class_name',
            label: '班级'
          }/*, {
            value: 't_email',
            label: '邮箱'
          }*/
        ],
        rules: {
          stu_id: [
            {required: true, message: '请输入学生学号,应由10位数字组成', trigger: 'change', min: 10, max: 10},
          ],
          stu_name: [
            {required: true, message: '请输入学生姓名', trigger: 'blur'},
          ],
          stu_sex: [
            {required: true, message: '请输入学生性别', trigger: 'blur'},
          ],
          t_department: [
            {required: true, message: '请输入院系', trigger: 'blur'},
          ],
          stu_birthday: [
            {required: true, message: '请输入学生生日', trigger: 'blur'},
          ],
          year_of_enrolme: [
            {required: true, message: '请输入学生入学年份', trigger: 'blur'},
          ],
          stu_pwd: [
            {required: false, message: '请输入学生密码', trigger: 'change'},
          ],
          class_name: [
            {required: true, message: '请选择学生班级', trigger: 'change'}
          ]

        },
        downloadLoading: false,
        uploadLoading: false
      }
    },
    methods: {
      getClass() {
        fetchStuList().then(res => {
          this.classTree = res.message
          this.classTree[0].id = 1
          console.log(this.classTree);
        })
      },
      handleNodeClick(data) {
        if (data.children === null) {
          this.class = data.name
          this.getList({classes: this.class})
        }
      },
      getList(data) {
        fetchStu(data).then(res => {
          this.list = res.message
          this.total = res.listQuery.total
          this.currentPage = res.listQuery.pageNum
          this.pagesize = res.listQuery.pagesize
          this.pageCount = res.listQuery.pages
        })
      },
      getSelectionList() {
        fetchStuSelectionList().then(res => {
          const list = res.message
          this.class = list[0].classes[0]
          this.selection_list.class_list = list[0].classes
          this.selection_list.department_list = list
          /*          this.selection_list.education_list = list.education
                    this.selection_list.station_list = list.station*/
        })
      },
      resetTemp() {
        this.temp = {
          stu_id: '',
          stu_pwd: '',
          stu_name: '',
          stu_sex: '',
          stu_birthday: '',
          year_of_enrolme: '',
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
        deleteStuArticle(row).then(res => {
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
            createStuArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList({classes: this.class})
            })
          }
        })
      },
      updateData() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateStuArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.stu_id === this.temp.stu_id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList({classes: this.class})
            })
          }
        })
      },
      handleCurrentChange(currentPage) {
        const query = Object.assign([], this.tags)
        this.getList({page: currentPage, classes: this.class, query})
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
        a.href = `http://10.18.5.173:8080/bsmstu/writeExcel`
        a.click()
        this.downloadLoading = false
      },

      uploadChange(data) {

        let file = data.target.files[0]
        if (!file) return

        let formData = new FormData()
        formData.append('excel', file)

        batchStuExport(formData).catch(err => {
          console.log(err);
        })
      },
      handleUpload() {
        this.$refs.upload.click();
      },
      handleDeleteMore() {
        deleteStuArticleMore(this.multipleSelection).then(res => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList({classes: this.class})
          this.$refs.multipleTable.clearSelection();
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getRowKeys(row) {
        return row.stu_id
      },
      departmentSelect(value) {
        if (value === '') {
          return this.$message.error('服务器未知错误')
        }

        for (let item of this.selection_list.department_list) {
          if (item.t_department === value) {
            this.selection_list.class_list = item.classes
            this.temp.class_name = item.classes[0]
            break
          }
        }
      },
      specialtySelect() {

      }
    },
    created() {
      this.getSelectionList()
      this.getList({page: this.currentPage, query: this.tags})
      this.getClass()
    }
  }
</script>

<style scoped>
</style>
