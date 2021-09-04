<template>
  <el-container>
    <el-header style="text-align: right; height: 60px; font-size: 12px; background-color: rgba(238,241,246)">
      <i class="el-icon-setting"></i>
    </el-header>
    <el-container style="height: 800px;">
      <el-aside width="200px" style="background-color: rgba(238,241,246)">
        <el-menu
            default-active="1">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>LPL</template>
            <el-menu-item-group>
              <el-menu-item index="1-1">RNG</el-menu-item>
              <el-menu-item index="1-2">FPX</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    // HelloWorld
  }
}
</script>
<style>
  .el-icon-setting{
    font-size: 26px;
    line-height: 60px;
  }
</style>
