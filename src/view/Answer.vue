<template>
  <el-container align="middle" justify="center">
    <el-row class="answer">
      <el-col v-if="!config.init_student">
        <el-result
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
      </el-col>
      <el-col v-else>
        <div class="choseAnswer">
          <h1>随机抽取</h1>
          <el-switch
            v-model="autoStop"
            size="large"
            active-text="自动选择"
            inactive-text="手工停止选择"
          />
          <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
            >抽取人数</span
          >
          <el-input-number
            :min="1"
            :max="config.students.length <= 1 ? 1 : config.students.length"
            v-model="answerNum"
          />

          <el-divider></el-divider>
          <el-button
            :autofocus="true"
            size="large"
            type="primary"
            round
            class="startButton"
            @click="start"
            >{{ buttonName }}</el-button
          >
          <div class="showName">
            {{
              answerNames!=null && answerNames.length > 0 && name == ""
                ? answerNames.toString()
                : name
            }}
          </div>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import store from "../store";
import router from "../router";

export default defineComponent({
  setup() {
    const config = store.getters.config;
    const autoStop = ref(false);
    const answerNum = ref(1);
    const name = ref("");
    const answerNames = ref<string[]>([]);
    const buttonName = ref("开始");
    const is_start = ref(false);


    const toStuManage = () => {
      router.push({ path: "/groupManage" });
    };
    const Sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const choose = async () => {
      if (autoStop.value == false) {
        is_start.value = !is_start.value;
        if (is_start.value == true) {
          buttonName.value = "结束";
          answerNames.value = [];
        } else {
          buttonName.value = "开始";
        }
        while (true) {
          let randomIndex: number = Math.floor(
            Math.random() * config.students.length
          );
          name.value = config.students[randomIndex].name;
          await Sleep(80);

          if (
            answerNames.value.length < answerNum.value &&
            answerNames.value.indexOf(name.value) == -1
          )
            answerNames.value.push(name.value);
          if (!is_start.value && answerNames.value.length == answerNum.value) {
            name.value = "";
            break;
          }
        }
      } else {
        is_start.value = true;

        buttonName.value = "自动选择";
        answerNames.value = [];
        let startTime = Date.parse(new Date().toString())
        while (true) {
          let randomIndex: number = Math.floor(
            Math.random() * config.students.length
          );
          name.value = config.students[randomIndex].name;
          await Sleep(80);
        let currentTime = Date.parse(new Date().toString())
          if (
            answerNames.value.length < answerNum.value &&
            answerNames.value.indexOf(name.value) == -1
          )
            answerNames.value.push(name.value);
          if (answerNames.value.length == answerNum.value && currentTime-startTime>3000) {
            name.value = "";
            is_start.value = false;
            buttonName.value = "开始";
            break;
          }
        }
      }
    };
    const start = async () => {
      if (is_start.value == true && autoStop.value == true) return;
      choose();
    };
    return {
      config,
      toStuManage,
      autoStop,
      start,
      name,
      answerNum,
      buttonName,
      answerNames,
    };
  },
});
</script>>
<style lang="scss" scoped>
html,
body,
.answer {
  width: 100%;
  height: 100%;
  text-align: center;
}
.choseAnswer {
  text-align: center;
  width: 100%;
  user-select: none;
  span {
    margin: 30px;
  }
  h1{
    font-size: 30px;
  }
}
.startButton {
  width: 200px;
  height: 200px;
  font-size: 40px;
  margin-top: 100px;
}
.showName {
  margin-top: 100px;
  font-size: 30px;
  font-weight: 20px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: #409EFF;


}
</style>