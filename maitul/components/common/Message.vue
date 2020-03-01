<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-27 09:09:07
 * @LastEditTime: 2020-03-01 10:26:12
 * @LastEditors: Xuannan
 -->
<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item v-if="showName">
        <a-input
        size='large'
        v-decorator="['name']"
        placeholder="Please input your name"
        >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
    </a-form-item>
    <a-form-item v-if="showPhone">
        <a-input
        size='large'
        v-decorator="['contact']"
        placeholder="Please input your phone"
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
                        message: 'Please input the correct email'
                    },
                    { 
                        required: true, 
                        message: 'Please input your email!' 
                    }
                ] }
        ]"
        placeholder="Please input your email"
        >
            <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
        </a-input>
    </a-form-item>
    <a-form-item>
        <a-textarea
        placeholder="Please input your message"
        v-decorator="['info']"
        :autosize="{ minRows: 2, maxRows: 2 }"
        />
    </a-form-item>
    <a-form-item>

      <a-button type="primary" size="large" html-type="submit" class="floatLeft">
        Inquiry Now
      </a-button>
      <div class="floatRight">
        <div class="email ">

            <a v-if="webconfig.email" :href="'mailto:'+webconfig.email">
                <span>Email:{{webconfig.email}}</span> 
            </a>
        </div>
        <div style="font-size:1.2rem;">
            <Contact/>
        </div>
      </div>
    </a-form-item>
  </a-form>
</template>

<script>
import {mapState} from 'vuex'
import Contact from './Contact.vue'
export default {
    name: 'Message',
    components:{Contact},
    data() {
        return {
        form: this.$form.createForm(this, { name: Math.random().toString(36).substr(2) }),
        };
    },
    methods: {
        handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
            if (!err) {
                this.$store.dispatch('_message', values)
                .then(res=>{
                    if(res.status===200){
                        this.$message.success('Thank you for your message.');
                    }
                    else{
                        this.$message.error('Failed, please try again.');
                    }
                })
                .catch(err=>{
                    this.$message.error('Failed, please try again.');
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
    computed:{
      ...mapState(["webconfig"]),
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