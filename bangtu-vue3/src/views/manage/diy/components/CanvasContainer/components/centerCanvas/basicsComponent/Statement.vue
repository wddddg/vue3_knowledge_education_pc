<template>
    <div>
        <div class="logo_item">
            <div>{{props.componentContent.copyright}}</div>
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
let props =  defineProps(['componentContent'])

</script>
<style lang="less" scoped>
.title{
    text-align: center;
    margin-bottom: 20px;
}
.logo_item{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
     margin: 0 10px;
     border-radius: 10px;
     color: #ccc;
    font-size: 15px;
}

</style>