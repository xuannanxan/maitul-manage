<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-27 09:09:07
 * @LastEditTime: 2020-03-31 12:38:26
 * @LastEditors: Xuannan
 -->
<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item v-if="showName">
        <a-input
        size='large'
        v-decorator="['name']"
        :placeholder="$t('lang.message.name')"
        >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
    </a-form-item>
    <a-form-item v-if="showPhone">
        <a-input
        size='large'
        v-decorator="['contact']"
        :placeholder="$t('lang.message.phone')"
        >
            <a-icon slot="prefix" type="phone" style="color: rgba(0,0,0,.25)" />
        </a-input>
    </a-form-item>
    <a-form-item>
        <a-input
        size='large'
        v-decorator="[
        'email', 
        { rules: [ {
                        type: 'email',
                        message: $t('lang.message.errorEmail')
                    },
                    { 
                        required: true, 
                        message: $t('lang.message.noEmail')
                    }
                ] }
        ]"
        :placeholder="$t('lang.message.email')"
        >
            <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
        </a-input>
    </a-form-item>
    <a-form-item>
        <a-textarea
        style="font-size:16px"
        :placeholder="$t('lang.message.message')"
        v-decorator="['info', { initialValue: '' }]"
        :autosize="{ minRows: 2, maxRows: 2 }"
        />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" size="large" html-type="submit" class="floatLeft" :loading="loading">
        {{$t("lang.message.inquiry")}}
      </a-button>
      <div class="floatRight">
        <div class="email ">
            <a v-if="webconfig.email" :href="'mailto:'+webconfig.email">
                <span>Email:{{webconfig.email}}</span> 
            </a>
        </div>
        <div style="font-size:1.2rem;">
            <contact-btn/>
        </div>
      </div>
    </a-form-item>
  </a-form>
</template>

<script>
import {mapState} from 'vuex'
import ContactBtn from './ContactBtn.vue'
export default {
    name: 'Message',
    components:{ContactBtn},
    data () {
        return {
            visible: false,
            webconfig: this.$store.state.webconfig,
            form: this.$form.createForm(this, { name: Math.random().toString(36).substr(2) }),
            loading: false,
      }
    },
    methods: {
        handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
            if (!err) {
                this.loading=true;
                this.$store.dispatch('_message', values)
                .then(res=>{
                    if(res.status===200){
                        this.$message.success('Thank you for your message.');
                        this.loading=false;
                    }
                    else{
                        this.$message.error('Failed, please try again.');
                        this.loading=false;
                    }
                })
                .catch(err=>{
                    this.$message.error('Failed, please try again.');
                    this.loading=false;
                })
                this.form.resetFields(); 
            }
        });
        },
    },
    props:{
        showPhone: {
            type: Boolean,
            default: false
        },
        showName: {
            type: Boolean,
            default: false
        },
    },
};
</script>
<style lang="less" scoped>
    .email{
        font-size: 1.2rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.55);
      }
      a{
        color: rgba(0, 0, 0, 0.55);
        :hover{
          color: #00cccc;
        }
      }
</style>