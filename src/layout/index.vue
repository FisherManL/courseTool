<template>
  <el-header>
    <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      :router="true"
    >
      <el-menu-item index="/index">首页</el-menu-item>
      <el-menu-item index="/answer">点名</el-menu-item>
      <el-menu-item index="/groupManage">分组管理</el-menu-item>
      <el-menu-item index="/about">关于</el-menu-item>
    </el-menu>
  </el-header>

  <el-main>
    <el-scrollbar>
      <el-container> <router-view></router-view> </el-container
    ></el-scrollbar>
  </el-main>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    let activeIndex = "1";

    return {
      activeIndex,
    };
  },
});
</script>
<style lang="scss" scoped>
body,
html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  background: white;
}
.el-header {
  position: relative;
  width: 100%;
  height: 60px;
}
.el-main {
  position: absolute;
  left: 0px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
</style>