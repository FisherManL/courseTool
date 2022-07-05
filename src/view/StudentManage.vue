<template>
  <el-container>
    <el-row class="basic">
      <el-col :span="12">
        <h1>学生名单</h1>
        <el-divider></el-divider>
        <el-result
          class="student"
          v-if="!config.init_student"
          icon="warning"
          title="学生信息未导入"
          sub-title="学生信息未导入，请导入"
        >
          <template #extra>
            <el-row style="width: inherit">
              <el-col :span="12">
                <el-input
                  label="选择导入文件"
                  type="file"
                  v-model="fileModel"
                  accept=".xls,.xlsx"
                  id="fileinput"
                  capture
                ></el-input>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" @click="importStudent"
                  >导入</el-button
                >
              </el-col>
            </el-row>
          </template>
        </el-result>
        <div v-else class="student">
          <el-row style="width: inherit">
            <el-col :span="12">
              <el-input
                label="选择导入文件"
                type="file"
                v-model="fileModel"
                accept=".xls,.xlsx"
                id="fileinput"
                capture
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="importStudent"
                >重新导入</el-button
              >
            </el-col>
          </el-row>
          <el-table
            class="student"
            :data="config.students"
            stripe
            :border="true"
            :highlight-current-row="true"
            style="width: 100%"
          >
            <el-table-column
              class="stu_name"
              prop="name"
              label="姓名"
              align="center"
            />
          </el-table>
        </div>
      </el-col>

      <el-col :span="12">
        <h1>分组管理</h1>
        <el-divider></el-divider>
        <el-input-number
          v-model="groupNum"
          :min="1"
          :max="config.students.length == 0 ? 1 : config.students.length"
        />

        <el-button
          type="primary"
          size="large"
          id="startGroup"
          @click="group(config.students, groupNum, config.studentsGroup)"
          >开始分组</el-button
        >
        <el-row class="show-group">
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
      </el-col>
    </el-row>
  </el-container>
</template>
<script lang="ts">
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { type } from "os";
import { reactive, ref, defineComponent } from "vue";
import store from "../store";
import util from "../util/util";

function groupFunction(students: {}[], gpnumber: number, ans: {}[][]) {
  ans.splice(0, ans.length);
  const copyStudents = Array.from(students);
  const radomStudents: {}[] = [];
  while (copyStudents.length > 0) {
    let randomIndex: number = Math.floor(Math.random() * copyStudents.length);
    radomStudents.push(copyStudents[randomIndex]);
    copyStudents.splice(randomIndex, 1);
  }
  let singleNum = Math.floor(students.length / gpnumber);
  for (let i = 0; i < gpnumber; i++) {
    let temp: {}[] = [];
    for (let j = 0; j < singleNum; j++) {
      temp.push(radomStudents[i * singleNum + j]);
    }
    ans.push(temp);
  }
  if (singleNum * gpnumber < radomStudents.length) {
    let current = singleNum * gpnumber;
    let index = ans.length - 1;
    while (current < radomStudents.length) {
      ans[index--].push(radomStudents[current]);

      current += 1;
    }
  }
  return ans;
}

export default defineComponent({
  setup() {
    const groupNum = ref(1);
    const config = store.getters.config;

    const groupResult: { name: string }[][] = reactive([]);
    const file = ref<File | null>();
    const fileModel = ref();

    const importStudent = () => {
      const file_html = document.getElementById(
        "fileinput"
      )! as HTMLInputElement;
      if (file_html.files == null || file_html.files.length < 1) {
        ElMessage.warning("请先选择导入的xlsx文件");
        return;
      }
      const fileContent = file_html.files[0];
      if (config.init_student) {
        ElMessageBox.confirm(
          "学生名单已存在，导入会清空所有信息，是否需要重新导入?",
          "Warning",
          {
            confirmButtonText: "导入",
            cancelButtonText: "取消导入",
            type: "warning",
          }
        ).then(() => {
          util
            .readExcelFile(fileContent, 0)
            .then((value: any) => {
              if (value == null || value.length < 1) {
                ElMessage.error("导入文件为空或格式不正确");
              } else {
                store.commit("importStudent", value);
                ElMessage.success("导入数据成功");
              }
            })
            .catch((error) => {
              ElMessage.error("错误：" + error);
            });
        });
      } else {
        util
          .readExcelFile(fileContent, 0)
          .then((value) => {
            store.commit("importStudent", value);
            ElMessage.success("导入数据成功");
          })
          .catch((error) => {
            ElMessage.error("错误：" + error);
          });
      }
    };

    const startGroup = (
      studentInformation: {}[],
      gpnumber: number,
      result: {}[][]
    ) => {
      if (studentInformation == null || studentInformation.length <= 0) {
        ElMessage.error("学生信息不存在");
        return false;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "分组中",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        groupFunction(studentInformation, gpnumber, result);
        store.commit("enableInitGroup");
      } finally {
        loading.close();
      }
    };
    const group = (
      studentInformation: {}[],
      gpnumber: number,
      result: {}[][]
    ) => {
      if (!config.init_student) {
        ElMessage.warning("学生名单尚未导入，请先在左侧导入");
        return;
      }
      if (!config.init_student_group) {
        ElMessageBox.confirm(
          "分组名单已存在，是否需要重新分组,分组数为【" + gpnumber + "】?",
          "Warning",
          {
            confirmButtonText: "分组",
            cancelButtonText: "取消分组",
            type: "warning",
          }
        )
          .then(() => {
            startGroup(studentInformation, gpnumber, result);
          })
          .catch(() => {
            ElMessage({
              type: "error",
              message: "取消分组",
            });
          });
      } else {
        startGroup(studentInformation, gpnumber, result);
      }
    };

    return {
      config,
      group,
      groupResult,
      groupNum,
      importStudent,
      file,
      fileModel,
    };
  },
});
</script>
<style lang="scss" scoped>
.basic {
  width: 100%;
  height: 100%;
}
.stu_name {
  width: inherit;
}
#startGroup {
  width: inherit;
  margin: 20px;
}
.show-group {
  width: inherit;
  margin-left: 150px;
  margin-top: 50px;

  div {
    margin: 15px;
    min-width: 200px;
    text-align: center;
    letter-spacing: 5px;
  }
}
.student {
  margin-top: 50px;
}
</style>