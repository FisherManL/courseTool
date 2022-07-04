
import { ElMessage } from 'element-plus';
import { Config } from '../store';
import * as XLSX from 'xlsx'
import { resolve } from 'path';


const fs = window.require("fs-extra")




const readFile = async (file: string) => {
    if (fs.existsSync(file)) {
        let content = fs.readJSON(file)
        return content.then((value: Config) => {
            return value
        }).catch((error: string) => {
            ElMessage.error("配置信息未初始化")
            return false
        }).finally(() => {

        })

    }
    else {
        ElMessage.error("配置信息未初始化")
        return false
    }

}
const writeFile = (file: string, data: Config) => {
    if (data == null || file == null)
        return

    fs.ensureFile(file).then(() => {
        fs.writeJSON(file, data).catch(() => {

            ElMessage({
                message: '保存配置失败，请以管理保员重新运行应用',
                type: 'warning',
                duration: 5000,
                center: true,
                showClose: true
            })
        })
    }).catch(() => {
        ElMessage({
            message: '应用安装在C盘下，请以管理员重新运行应用',
            type: 'warning',
            duration: 5000,
            center: true,
            showClose: true
        })
    })




}
function readFiletoBinary(file: File) {
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = ev => {
            resolve(ev.target?.result);
        }
    });

}

async function readExcelFile(file: File, sheetIndex: number) {
    let data = await readFiletoBinary(file);
    let workbook = XLSX.read(data, { type: 'binary' });
    let worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
    data = XLSX.utils.sheet_to_json(worksheet);
    return data;

}
export default {
    writeFile,
    readFile, readFiletoBinary, readExcelFile
}