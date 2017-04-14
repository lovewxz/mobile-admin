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
        {{paths}}
    </div>
</template>

<script type="text/ecmascript-6">
    const SKU_SEP = ','
    export default {
        props: {
            sku: {
                tpye: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                titles: this.sku.titles,
                options: this.sku.options,
                inputVisible: false,
                inputValue: ''
            }
        },
        computed: {
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
                let arr = this.titles.map((v, k) => this.options[k].map((l, k) => [this.keys[v][l], l, v, ]))
                let path = [], paths = {}, len = arr.length
                let func = (arr, n) => {
                    for(let i of arr[n]) {
                        path.push(i)
                        if(n !== len - 1) {
                            func(arr, n + 1)
                        } else {
                            paths[path.map(v=>v[0]).sort().join(SKU_SEP)] = {
                                stock: 1,
                                price: 1,
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
            }
        },
        methods: {
            delOption (index, j) {
                this.options[index].splice(j, 1)
            },
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
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .tag {
        margin-right: 10px;
    }
</style>