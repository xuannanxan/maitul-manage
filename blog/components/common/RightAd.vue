<template>
        <div class="right-ad" :style="{ backgroundImage:'url('+ad.img+')'}" >
            <a-button type="link" :href="ad.url" target="_blank">{{ad.name}}</a-button>
        </div>
</template>
<script>
    export default {
        name: 'Author',
        props:["ad"]
    };
</script>

<style lang="less"  scoped>
    .right-ad{
    height: 6rem;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 0.3rem;
    a {
        margin-top: 3.8rem;
    }
    };
</style>