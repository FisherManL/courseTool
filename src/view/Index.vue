<template>
  <el-container align="middle" justify="center">
    <el-row>
      <el-col :span="24">
        <el-result
          v-if="!config.init_student || !config.init_student_group"
          icon="warning"
          title="分组信息未初始化"
          sub-title="请先初始化学生信息并分组"
        >
          <template #extra>
            <el-button type="warning" @click="toStuManage"
              >跳转去分组管理</el-button
            >
          </template>
        </el-result>
        <div v-else class="stuGroupArea">
          <h1>学生分组</h1>
          <el-divider></el-divider>
          <el-row class="stuGroup">
            <el-card
              shadow="hover"
              class="box-card"
              v-for="(group, index) in config.studentsGroup"
              :key="index"
            >
              <template #header>
                <div class="card-header">
                  <span>第{{ index + 1 }}组</span>
                </div>
              </template>

              <div
                class="studentInformation"
                v-for="(stu, index) in group"
                :key="index"
              >
                {{ stu["name"] }}
              </div>
            </el-card>
          </el-row>
        </div>
      </el-col>
      <el-col :span="24">
        <el-calendar v-model="date" />
      </el-col>
    </el-row>
  </el-container>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import router from "../router";
import store from "../store";
export default defineComponent({
  setup() {
    const date = ref(new Date());
    const toStuManage = () => {
      router.push({ path: "/groupManage" });
    };
    const config = store.getters.config;
  
    return {
      date,
      config,
      toStuManage,
    };
  },
});
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  font-weight: bold;
  color: red;
  font-size: 20px;
  letter-spacing: 10px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 300px;
  letter-spacing: 5px;
  
}
.studentInformation {
  font-size: 15px;
  font-style: normal;
  margin: 5px;
}
.stuGroupArea {
  text-align: center;
  width: 100%;
  user-select: none;
  div {
    margin-top: 20px;
  }
  .stuGroup {
    align-content: center;
    text-align: center;
    justify-content: space-around;
    align-items: center;
  }
}
</style>