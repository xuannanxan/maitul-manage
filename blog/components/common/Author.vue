<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-16 14:26:44
 * @LastEditTime: 2020-03-04 21:15:13
 * @LastEditors: Xuannan
 -->
<template>
        <div class='user-div'>
            <div> 
                <a-avatar :size="100" v-if="webconfig.blogAvatar" :src="webconfig.blogAvatar"/>
                <img class="weixin" v-else src="~/assets/images/user.png"/>
            </div>
            <div class="user-introduction">
                {{webconfig.blogAuthor}}
                <a-divider>社交账号</a-divider>
                <a-tooltip placement="topLeft" trigger="hover">
                    <template slot="title">
                        <span>{{webconfig.QQ}}</span>
                    </template>
                    <a-avatar :size="28" icon="qq"  class="account" />
                </a-tooltip>
                <a-popover placement="topRight" trigger="hover">
                    <template slot="content">
                        <div style="text-align: center;">
                            <img class="weixin" v-if="webconfig.weixin" :src="webconfig.weixin"/>
                            <img class="weixin" v-else src="~/assets/images/user.png"/>
                            <p >扫码关注</p>
                        </div>
                    </template>
                    <a-avatar :size="28" icon="wechat"  class="account"  />
                </a-popover>
            </div>
        </div> 
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'Author',
        created() {
            if(this.webconfig && Object.keys(this.webconfig).length > 0){
                this.spinning=false;
            } 
            setTimeout(()=>{
                this.spinning=false;
            },2000)
        },
        computed:mapState(["webconfig"])
    };
</script>

<style scoped>
    .user-div{
        text-align: center;
        padding: 1rem;
    }
    .user-div div{
        margin-bottom: 1rem;
    }
    .user-introduction{
        font-size:.8rem;
        color: #999;
    }
    .account{
        background-color: #999;
        margin-left: .5rem;
        margin-right: .5rem;
    }
    .weixin{
        max-width: 8rem;
    }
</style>