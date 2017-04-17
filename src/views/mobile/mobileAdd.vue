<template>
    <el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit"
             style="margin:20px;width:80%;min-width:500px;" class="form" :rules="rules">
        <h2 class="title">销售属性</h2>
        <el-form-item label="手机名称" prop="name">
            <el-input v-model="form.name" placeholder="请填写手机名称"></el-input>
        </el-form-item>
        <el-form-item label="活动详情" prop="detail">
            <el-input type="textarea" v-model="form.desc" placeholder="请填写一句话活动详情"></el-input>
        </el-form-item>
        <el-form-item label="产品服务">
            <el-checkbox-group v-model="checkList">
                <el-checkbox :label="item.title" v-for="(item,index) in mobileServices"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <sku :sku="sku" @sendTableData="reTableData"></sku>
        <h2 class="title">基础信息</h2>
        <el-form-item label="品牌">
            <el-select v-model="form.brand" placeholder="请选择品牌">
                <el-option :label="item.label" :value="item.value" v-for="item in brand"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="手机型号" prop="model">
            <el-input v-model="form.model" placeholder="请填写手机型号"></el-input>
        </el-form-item>
        <el-form-item label="手机尺寸">
            <el-input v-model="form.pSize" placeholder="手机尺寸-单位(mm)-(例:147*122*133mm)">
                <template slot="append">mm</template>
            </el-input>
        </el-form-item>
        <el-form-item label="电池容量">
            <el-input v-model="form.mha" placeholder="电池容量-(例:1000mha)">
                <template slot="append">mHA</template>
            </el-input>
        </el-form-item>
        <el-form-item label="手机重量">
            <el-input v-model="form.weight" placeholder="手机重量-(例:100g)">
                <template slot="append">g</template>
            </el-input>
        </el-form-item>
        <h2 class="title">屏幕</h2>
        <el-form-item label="屏幕尺寸">
            <el-select v-model="form.fSize" placeholder="请选择尺寸">
                <el-option :label="item.label" :value="item.value" v-for="item in fSize"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分辨率">
            <el-select v-model="form.dpi" placeholder="请选择分辨率">
                <el-option :label="item.label" :value="item.value" v-for="item in dpi"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="显示技术">
            <el-select v-model="form.display" placeholder="请选择显示技术">
                <el-option :label="item.label" :value="item.value" v-for="item in display"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="制造工艺">
            <el-select v-model="form.make" placeholder="请选择制造工艺">
                <el-option :label="item.label" :value="item.value" v-for="item in make"></el-option>
            </el-select>
        </el-form-item>
        <h2 class="title">容量</h2>
        <el-form-item label="运行内存">
            <el-select v-model="form.ram" multiple filterable allow-create placeholder="请选择运行内存(多选)">
                <el-option :label="item.label" :value="item.value" v-for="item in ram"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="机身内存">
            <el-select v-model="form.rom" multiple filterable allow-create placeholder="请选择机身内存(多选)">
                <el-option :label="item.label" :value="item.value" v-for="item in rom"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
    </el-form>
</template>

<script type="text/ecmascript-6">
    import * as mobile from 'config/mobile'
    import sku from 'components/sku'
    import _ from 'lodash'

    export default {
        data() {
            return {
                //产品服务
                mobileServices: mobile.mobileServices,
                brand: mobile.brand,
                fSize: mobile.fSize,
                dpi: mobile.dpi,
                display: mobile.display,
                make: mobile.make,
                ram: mobile.ram,
                rom: mobile.rom,
                sku: mobile.sku,
                checkList: [],
                form: {
                    name: '',
                    desc: '',
                    brand: 'meizu',
                    model: '',
                    pSize: '',
                    mha: '',
                    weight: '',
                    fSize: '4.7in',
                    dpi: '2560*1400',
                    display: 'Super AMOLED',
                    make: 'On-cell',
                    ram: '',
                    rom: '',
                    sku: [],
                    services: []
                },
                rules: {
                    name: [
                        {required: true, message: '请输入手机名称', trigger: 'blur'},
                        {max: 50, message: '长度在25个字符以内', trigger: 'blur'}
                    ],
                    detail: [
                        {max: 100, message: '长度在50个字符以内', trigger: 'blur'}
                    ],
                    model: [
                        {required: true, message: '请输入手机型号', trigger: 'blur'},
                    ]
                }
            }
        },
        computed: {
            services () {
                this.form.services = []
                this.mobileServices.forEach((item, index) => {
                    this.checkList.forEach((check) => {
                        if (item.title === check) {
                            this.form.services.push(this.mobileServices[index])
                        }
                    })
                })
                return this.form.services
            }
        },
        methods: {
            onSubmit () {
                let para = Object.assign({}, this.form);
                console.log(para)
            },
            reTableData (tableData) {
                this.form.sku = tableData
            }
        },
        components: {
            sku
        },
        watch: {
            'services' () {
                console.log(this.form.services)
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .form {
        .title {
            font-size: 14px;
        }
    }
</style>