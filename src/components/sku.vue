<template>
    <div>
        <el-form-item v-for="(title,index) in titles" :label="title">
            <el-tag :key="index"
                    v-for="(option,j) in options[index]"
                    class="tag"
                    type="primary"
                    :closable="true"
                    :close-transition="false"
                    @close="delOption(index,j)"
            >
                {{option}}
            </el-tag>
            <el-button class="button-new-tag" size="small" @click="showInput(index)">添加{{title}}</el-button>
        </el-form-item>
        <el-table
                :data="tableData"
                @selection-change="selsChange"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="skuId"
                    label="skuId"
                    width="80"
            >
            </el-table-column>
            <el-table-column
                    v-for="(title,index) in titles"
                    :label="title"
                    :prop="title"
                    width="120"
                    :filters="filters(index)"
                    :filter-method="filterOption"
            >
            </el-table-column>
            <el-table-column
                    label="库存"
                    prop="stock"
                    width="70"
            >
            </el-table-column>
            <el-table-column
                    label="价格"
                    prop="price"
                    width="70"
            >
            </el-table-column>
            <el-table-column
                    label="图片"
                    prop="picsList"
                    width="70"
            >
                <template scope="scope">
                    <img :src="scope.row.picsList[0]" alt="" v-if="scope.row.picsList.length" width="50"
                         height="50" style="margin-right:5px;vertical-align: middle;padding: 5px 0">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button
                            size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click.native="batchEdit" style="margin-top:20px" :disabled="btnStatus">批量修改
        </el-button>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form label-width="70px" :rules="editFormRules" ref="editForm" :model="editForm">
                <el-form-item label="skuId">{{editForm.skuId}}</el-form-item>
                <el-form-item label="库存" prop="stock">
                    <el-input v-model.number="editForm.stock" style="width: 120px"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model.number="editForm.price" style="width: 120px"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="picsList"
                              v-if="tableData[editForm.index]&&tableData[editForm.index].picsList&&tableData[editForm.index].picsList.length > 0">
                    <img :src="item" v-for="(item,i) in tableData[editForm.index].picsList"
                         width="148" height="148" @click="handleRemove(i)"
                         style="margin-right:10px">
                    <el-upload
                            action="http://120.26.106.144:8888/home/uploadimg"
                            list-type="picture-card"
                            :headers="sessionId"
                            :on-success="handleSuccess"
                            :multiple="true"
                            :before-upload="beforeUpload"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <!--批量编辑页面-->
        <el-dialog title="编辑" v-model="batchEditFormVisible" :close-on-click-modal="false">
            <el-form label-width="70px" :rules="editFormRules" ref="batchEditForm" :model="editForm">
                <el-form-item label="库存" prop="stock">
                    <el-input v-model.number="editForm.stock" style="width: 120px"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model.number="editForm.price" style="width: 120px"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="picsList">
                    <el-upload
                            action="http://120.26.106.144:8888/home/uploadimg"
                            list-type="picture-card"
                            :headers="{'sessionId':sessionId}"
                            :on-success="handleSuccess"
                            :multiple="true"
                            :before-upload="beforeUpload"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="batchEditFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="batchEditSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import _ from 'lodash'

    const SKU_SEP = ','
    export default {
        props: {
            sku: {
                tpye: Object,
                default () {
                    return {}
                }
            },
            sessionId: {
                type: String,
                default: ''
            }
        },
        watch: {
            'tableData' ()  {
                this.$emit('sendTableData', this.tableData)
            }
        },
        data () {
            return {
                btnStatus: true, //批量删除按钮
                sels: [], //列表选中列
                titles: this.sku.titles,
                options: this.sku.options,
                editFormVisible: false,
                batchEditFormVisible: false,
                editForm: {
                    skuID: '',
                    stock: 0,
                    price: 0,
                    picsList: [],
                    index: 0
                },
                editFormRules: {
                    stock: [
                        {required: true, message: '库存不能为空'},
                        {type: 'number', message: '库存必须为数字值'}
                    ],
                    price: [
                        {required: true, message: '价格不能为空'},
                        {type: 'number', message: '价格必须为数字值'}
                    ]
                },
            }
        },
        computed: {
            /**
             * 获取属性的key
             * {"手机版本":{'32G':0,'64G':1,'128G':2,'32G/64G':3}}
             * @return {{}}
             */
            keys () {
                let keys = {}
                let symbol = 0
                for (let i in this.titles) {
                    let option = {}
                    for (let j in this.options[i]) {
                        option[this.options[i][j]] = symbol++
                    }
                    keys[this.titles[i]] = option
                }
                return keys
            },
            paths() {
                let arr = this.titles.map((v, k) => this.options[k].map((l, k) => [this.keys[v][l], l, v,]))
                let path = [], paths = {}, len = arr.length
                let func = (arr, n) => {
                    for (let i of arr[n]) {
                        path.push(i)
                        if (n !== len - 1) {
                            func(arr, n + 1)
                        } else {
                            paths[path.map(v=>v[0]).sort().join(SKU_SEP)] = {
                                symbols: path.map(v=>v[0]),
                                values: path.map(v=>v[1]),
                                titles: path.map(v=>v[2]),
                            }
                        }
                        path.pop()
                    }
                }
                func(arr, 0)
                return paths
            },
            tableData () {
                let res = []
                for (let i in this.paths) {
                    let path = this.paths[i]
                    let arr = {
                        skuId: path.symbols.join(SKU_SEP),
                        stock: 999,
                        price: 1000,
                        picsList: []
                    }
                    this.titles.forEach((item, index) => {
                        arr[item] = path.values[index]
                    })
                    res.push(arr)
                }
                return res
            }
        },
        methods: {
            delOption (index, j) {
                this.options[index].splice(j, 1)
            },
            //添加标签
            showInput(index) {
                this.$prompt(`请添加${this.titles[index]}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value}) => {
                    this.options[index].push(value)
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    })
                })
            },
            //删除skuid
            handleDelete(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.tableData.splice(index, 1)
                }).catch(() => {

                });
            },
            handleEdit(index, row) {
                this.editFormVisible = true
                this.editForm.skuId = row.skuId
                this.editForm.stock = row.stock
                this.editForm.price = row.price
                this.editForm.picsList = row.picsList
                this.editForm.index = index
            },
            //编辑
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.tableData[this.editForm.index].stock = this.editForm.stock
                            this.tableData[this.editForm.index].price = this.editForm.price
                            this.tableData[this.editForm.index].picsList = this.editForm.picsList
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            })
                            this.editFormVisible = false
                            this.$nextTick(() => {
                                this.$refs['editForm'].resetFields()
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '取消输入'
                            })
                        })
                    }
                })
            },
            beforeUpload (file) {
                const fileType = ['image/jpeg', 'image/gif', 'image/png']
                const isLt2M = file.size / 1024 / 1024 < 2;
                let flag = false

                fileType.forEach((item) => {
                    if (file.type === item) {
                        flag = true
                    }
                })
                if (!flag) {
                    this.$message.error('上传头像图片只能是 JPG,GIF,PNG 格式!')
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return flag && isLt2M
            },
            handleSuccess(response, file, fileList) {
                if (response.code === 200) {
                    this.editForm.picsList.push(response.data.url)
                }
            },
            handleRemove(i) {
                this.tableData[this.editForm.index].picsList.splice(i, 1)
            },
            filters (index) {
                let res = []
                this.options[index].forEach((item) => {
                    res.push({
                        text: item,
                        value: item
                    })
                })
                return res
            },
            filterOption (value, row) {
                for (let i in row) {
                    if (row[i] === value) {
                        return row
                    }
                }
            },
            selsChange (sels) {
                this.sels = sels
                this.sels.length > 1 ? this.btnStatus = false : this.btnStatus = true
            },
            batchEdit () {
                this.batchEditFormVisible = true
                this.editForm.price = 0
                this.editForm.stock = 0
                this.$nextTick(() => {
                    this.$refs['batchEditForm'].resetFields()
                })
            },
            batchEditSubmit () {
                this.$refs.batchEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.sels.map((item) => {
                                this.tableData.map((table) => {
                                    if (item['skuId'] === table['skuId']) {
                                        if (this.editForm.price) {
                                            table['price'] = this.editForm.price
                                        }
                                        if (this.editForm.stock) {
                                            table['stock'] = this.editForm.stock
                                        }
                                        if (this.editForm.picsList.length) {
                                            table['picsList'] = this.editForm.picsList
                                        }
                                    }
                                })
                            })
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            })
                            this.batchEditFormVisible = false
                            this.$nextTick(() => {
                                this.$refs['batchEditForm'].resetFields()
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '取消输入'
                            })
                        })
                    }
                })
            }
        },
        mounted () {
            this.$emit('sendTableData', this.tableData)
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .tag {
        margin-right: 10px;
    }

    .previewDialog {
        z-index: 2003;
    }
</style>