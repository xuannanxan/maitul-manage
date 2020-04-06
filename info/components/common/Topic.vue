<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-04-05 19:47:57
 * @LastEditTime: 2020-04-05 20:00:59
 * @LastEditors: Xuannan
 -->
<!--
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-16 10:31:22
 * @LastEditTime: 2020-03-27 20:29:15
 * @LastEditors: Xuannan
 -->
<template>
    <a-card 
    size='small'
    :title="$t('lang.topic')" 
    :bordered="false" 
    :headStyle="{backgroundColor:'#f1f1f1',borderLeft:'4px solid #00cccc'}"
    style="background-color:#FAFAFA;">
        <Tags/>
    </a-card>
</template>
<script>
    import Tags from './Tags.vue'
    export default {
        name: 'Topic',
        components:{Tags},
        
    };
</script>
<style  lang="less" scoped>

</style>