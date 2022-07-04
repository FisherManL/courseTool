
import { type } from 'os'
import path from 'path'
import { reactive } from 'vue'
import { createStore } from 'vuex'
import util from '../util/util'

const configPath = "./config/data.json"


interface Student {
    name: string
}
interface StudentInformation {
    [x: number]: Student
}
export interface Config {
    init_student: boolean
    init_student_group: boolean
    students: StudentInformation
    studentsGroup: StudentInformation[]
}
let config: Config =
    reactive({
        init_student: false,
        init_student_group: false,
        students: [],
        studentsGroup: []
    })

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            config
        }
    },
    getters: {
        config(state) {
            return state.config
        }
    },
    mutations: {
        enableInit(state) {
            state.config.init_student = true
            util.writeFile(configPath, state.config)
        },
        enableInitGroup(state) {
            state.config.init_student_group = true
            util.writeFile(configPath, state.config)
        },
        importStudent(state, students: { name: string }[]) {
            state.config.students = students
            state.config.init_student = true
            state.config.studentsGroup = []
            state.config.init_student_group = false
            util.writeFile(configPath, state.config)

        },
        groupStudent(state, studentsGp: StudentInformation[]) {
            state.config.studentsGroup = studentsGp
            state.config.init_student_group = true
            util.writeFile(configPath, state.config)

        },
        initInformation(state, config: Config) {
            state.config = config
            util.writeFile(configPath, state.config)

        }
    }
})








await util.readFile(configPath).then(async (value) => {
    if (value != false) {
        await store.commit("initInformation", value)
        console.log("初始化加载配置:" + JSON.stringify(config))
    }
})
export default store