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
        <div><span>导入的文件必须已一定的模板格式</span><a href="http://10.18.1.41:8086/bsm/writeModel" style="color: lightskyblue">
          下载模板</a></div>
        <el-button slot="reference" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload2"
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
        label="工号"
        prop="t_id"/>

      <el-table-column
        width="120px" align="center"
        label="姓名"
        prop="t_name"/>

      <el-table-column
        width="50px" align="center"
        label="性别"
        prop="t_sex"/>

      <el-table-column
        min-width="150px" align="center"
        label="院系"
        prop="t_department"/>

      <el-table-column
        width="100px" align="center"
        label="出生年月"
        prop="t_birthday"/>

      <el-table-column
        width="150px" align="center"
        label="岗位"
        prop="t_stationt_"/>

      <el-table-column
        width="150px" align="center"
        label="学历"
        prop="t_education"/>

      <el-table-column
        width="150px" align="center"
        label="学位"
        prop="t_degree"/>

      <el-table-column
        width="150px" align="center"
        label="邮箱"
        prop="t_email"/>

      <el-table-column
        width="150px" align="center"
        label="联系电话"
        prop="t_phone"/>

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
    <el-pagination
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next"
      :page-size="pagesize"
      :current-page="currentPage"
      :total="total"
      :page-count="pageCount"
      background
    ></el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="form" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">

        <el-form-item label="工号:" prop="t_id">
          <el-input v-model="temp.t_id"/>
        </el-form-item>

        <el-form-item label="姓名:" prop="t_name">
          <el-input v-model="temp.t_name"/>
        </el-form-item>

        <el-form-item label="性别:" prop="t_sex">
          <el-radio v-model="temp.t_sex" label="男"></el-radio>
          <el-radio v-model="temp.t_sex" label="女"></el-radio>
        </el-form-item>

        <el-form-item label="院系:" prop="t_department">
          <el-select v-model="temp.t_department">
            <el-option v-for="item in selection_list.department_list" :key="item.dep_id" :label="item.t_department"
                       :value="item.t_department"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出生年月:" prop="t_birthday">
          <el-date-picker
            v-model="temp.t_birthday"
            value-format="yyyy-MM"
            type="month"
            placeholder="请选择出生年份">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="岗位:" prop="t_stationt_">
          <el-select v-model="temp.t_stationt_">
            <el-option v-for="item in selection_list.station_list" :key="item.station_id" :label="item.t_stationt_"
                       :value="item.t_stationt_"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学历:" prop="t_education">
          <el-select v-model="temp.t_education">
            <el-option v-for="item in selection_list.education_list" :key="item.education_id" :label="item.t_education"
                       :value="item.t_education"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学位:" prop="t_degree">
          <el-select v-model="temp.t_degree">
            <el-option v-for="item in selection_list.degree_list" :key="item.degree_id" :label="item.t_degree"
                       :value="item.t_degree"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱:">
          <el-input v-model="temp.t_email"/>
        </el-form-item>

        <el-form-item label="联系电话:">
          <el-input v-model="temp.t_phone"/>
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
    deleteArticle,
    fetchList,
    fetchSelectionList,
    updateArticle,
    deleteArticleMore,
    exportExcel, batchExport
  } from "@/api/article";


  export default {
    name: "teacher",
    data() {
      return {
        list: [],
        currentPage: 1,
        pagesize: 0,
        total: 0,
        pageCount: 0,
        multipleSelection: [],
        temp: {
          t_id: 0,
          t_name: '',
          t_sex: '',
          t_department: '',
          t_birthday: '',
          t_stationt_: '',
          t_education: '',
          t_degree: '',
          t_email: '',
          t_phone: ''
        },
        title: '',
        importance: '',
        tags: [],
        timestamp: '',
        selection_list: {
          department_list: [],
          station_list: [],
          education_list: [],
          degree_list: [],
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        importanceOptions: [
          {
            value: 't_id',
            label: '工号'
          }, {
            value: 't_name',
            label: '姓名'
          }, {
            value: 't_sex',
            label: '性别'
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
            {required: true, message: '请输入教师工号,应由10个数字组成', trigger: 'change',min:10,max:10},
          ],
          t_name: [
            {required: true, message: '请输入教师姓名', trigger: 'change'},
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
        uploadLoading: false
      }
    },
    methods: {
      getList(data) {
        fetchList(data).then(res => {
          this.list = res.message
          this.total = res.listQuery.total
          this.currentPage = res.listQuery.pageNum
          this.pagesize = res.listQuery.pagesize
          this.pageCount = res.listQuery.pages
        })
      },
      getSelectionList() {
        fetchSelectionList().then(res => {
          const list = res.message[0]
          this.selection_list.degree_list = list.degree
          this.selection_list.department_list = list.department
          this.selection_list.education_list = list.education
          this.selection_list.station_list = list.station
        })
      },
      resetTemp() {
        this.temp = {
          t_id: '',
          t_name: '',
          t_sex: '',
          t_department: '',
          t_birthday: '',
          t_stationt_: '',
          t_education: '',
          t_degree: '',
          t_email: '',
          t_phone: ''
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
            createArticle(this.temp).then(() => {
              // this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList({page: this.currentPage})
            })
          }
        })
      },
      updateData() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              // this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList({page: this.currentPage})
            })
          }
        })
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
        a.href = `http://10.18.1.41:8086/bsm/writeExcel`
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
        return row.t_id
      },

    },
    created() {
      this.getSelectionList()
      this.getList({page: this.currentPage, query: this.tags})
    }
  }
</script>

<style scoped>
</style>
