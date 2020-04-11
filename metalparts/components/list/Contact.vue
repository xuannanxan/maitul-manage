<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-11 23:35:29
 * @LastEditTime: 2020-03-29 20:44:35
 * @LastEditors: Xuannan
 -->
<template>
      <a-row v-if="data.length">
        <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
          <div class="main">        
            <div  v-html="data[0].content"></div>         
          </div>
        </a-col>
        <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <div class="main">
                <Message :showName="true"  :showPhone="true"/>
            </div>
        </a-col>
      </a-row>
</template>
<script>
    import Message from '@/components/common/Message.vue'
    export default {
        name: 'Contact',
        components:{Message},
        props:{
                data: {
                    type: Array,
                    default: ()=>[]
                },
            }
    }
</script>