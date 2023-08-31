import { Notify } from 'vant'
import Compressor from 'compressorjs'
export default {
  /**
   * 
   * @param {年份} year 
   * @returns 返回是否为闰年的函数
   */
  isRunyear(year) { 
    let flag = false
    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
      flag = true
    }
    return flag
  },
  /**
   * 
   * @param {月份} val 
   * @returns 返回月份天数
   */
  getMonthDays(val){
    let year = val.getFullYear()
    let month = val.getMonth() + 1
    let days31 = [1,3,5,7,8,10,12]
    let days30 = [4,6,9,11]
    let isRun = this.isRunyear(year)
    if(days31.includes(month)){
      return 31
    } else if(days30.includes(month)){
      return 30
    } else if(isRun){
      return 29
    } else {
      28
    }
  },
  // 补零
  replenish(s) {
    return s < 10 ? '0' + s : s
  },
  /**
   * 
   * @param {时间数据，不限格式，但必须是时间数据} val 
   * @returns 返回时分秒 hh:mm:ss
   */
  dataHms(val){
    let hours= val ? this.replenish(new Date(val).getHours()) : this.replenish(new Date().getHours())
    let min = val ? this.replenish(new Date(val).getMinutes()) : this.replenish(new Date().getMinutes())
    let second = val ? this.replenish(new Date(val).getSeconds()) :this.replenish(new Date().getSeconds())
    let time = hours + ':' + min + ':' + second
    return time
  },
  /**
   * 
   * @param {时间数据，不限格式，但必须是时间数据} val 
   * @param {传入时间分隔符对象,} format:{year:'年',month:'月'}
   * @returns 'YYYY年MM月DD'
   */
  monthDay(val,format) {
    let iDate = new Date(val)
    let newDate = iDate.getFullYear() + (format ? format.year : '/') + (this.replenish(iDate.getMonth() + 1)) + (format ? format.month : '/') + this.replenish(iDate.getDate())
    return val ? newDate : ''
  },
  /**
   * 返回年月日
   * @param {传入时间} val 
   * @returns 'YYYY/MM/DD'
   */
  yearMonthDay(val) {
    let iDate = new Date(val)
    let newDate = iDate.getFullYear() + '/' + (this.replenish(iDate.getMonth() + 1)) + '/' + this.replenish(iDate.getDate())
    return val ? newDate : ''
  },
  /**
   * 返回前n个月的日期
   * @param {传入时间} val 
   * @param {传入时间的前n个月} n 
   * @returns 'YYYY/MM/DD'
   */
  withMonthDay(val,n){
    let iDate = new Date(val)
    let newDate = iDate.getFullYear() + '/' + (this.replenish(iDate.getMonth() + 1 - n)) + '/' + this.replenish(iDate.getDate())
    return val ? newDate : ''
  },
  /**
   * 返回年列表
   * @param {决定返回年列表的长度，由近及远} y 
   * @returns 
   */
  setOptions(y){
    let year = new Date().getFullYear()
    let arr = [{ text: year, value: year }]
    for(let i=y;i<year;i++) {
      arr.unshift({ text: i, value: i })
    }
    return {year,arr}
  },
  /**
   * 
   * @param {传入需要获取路径上字段名} name 
   * @returns name对应的值
   */
  getQueryString(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const result = window.location.search.substring(1).match(reg);
    if (result != null) {
      return decodeURIComponent(result[2]);
    }
    return null;
  },
  getUrlKey(name) {
    return decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
  },
  /**
   * 
   * @param {传入需要复制的数据} value 
   * @param {传入复制成功后的回调方法} callBack 
   */
  doCopy (value,callBack) {
    let textArea = document.createElement('textarea')
    textArea.setAttribute('readonly','readonly')
    textArea.value = value
    document.body.appendChild(textArea)
    textArea.select()
    navigator.clipboard.readText().then(res=>{
      callBack(res)
      document.body.removeChild(textArea)
      return res
    })
},
  /**
   * 回到顶部
   */
  backTop() {
    let timer = setInterval(() => {
      var top = document.body.scrollTop || document.documentElement.scrollTop
      var speed = top / 4
      if (document.body.scrollTop != 0) {
        document.body.scrollTop -= speed
      } else {
        document.documentElement.scrollTop -= speed
      }
      if (top == 0) {
        clearInterval(timer)
      }
    }, 30)
  },
  /**
   * 
   * @param {传入字符} obj 
   * @returns 判断字符是否为空
   */
  isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 
   * @returns 返回屏幕的宽高
   */
  getViewportSize(){
    return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
  },
  /**
   * 
   * @param {传入图片路径} url 
   * @returns 返回文件是否是图片
   */
  getType (url) {
    let name = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
    let reg = new RegExp()
    return reg.test(/\.(png|jpe?g|svg|webp|gif)$/)
  },
  /**
   * 
   * @param {传入金额} money 
   * @returns 返回数字金额转化成人民币的中文
   */
  numberToChinese(money) {
    //汉字的数字
    const cnNums = new Array(0,1,2,3,4,5,6,7,8,9);
    //基本单位
    const cnIntRadice = new Array("", "十", "百", "千");
    //对应整数部分扩展单位
    const cnIntUnits = new Array("", "万", "亿", "兆");
    //对应小数部分单位
    const cnDecUnits = new Array("角", "分", "毫", "厘");
    //整型完以后的单位
    const cnIntLast = "元";
    //最大处理的数字
    const maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = "";
    //分离金额后用的数组，预定义
    var parts;
    if(!money) return 
    if (money >= maxNum) return
    //转换为字符串
    money = money.toString();
    if (money.indexOf(".") == -1) {
      integerNum = money;
      decimalNum = "";
    } else {
      parts = money.split(".");
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      var zeroCount = 0;
      var IntLen = integerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = integerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == "0") {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          //归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q];
        }
      }
      chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != "") {
      let decLen = decimalNum.length;
      for (let i = 0; i < decLen; i++) {
        let n = decimalNum.substr(i, 1);
        if (n != "0") {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (chineseStr == "") {
      chineseStr += cnNums[0] + cnIntLast;
    }
    return chineseStr;
  },
  /**
   * 
   * @returns 返回当前页面环境：iOS/Android/PC
   */
  judgeClient() {
    let client = '';
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
      client = 'iOS';
    } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
      client = 'Android';
    } else {
      client = 'PC';
    }
    return client;
  },
  /**
   * 
   * @returns 返回当前页面:微信WX/企业微信QW
   */
  judgeMobile(){
    if(/micromessenger/i.test(navigator.userAgent)){
      return 'WX'
    } else if(/wxwork/i.test(navigator.userAgent)){
      return 'QW'
    }
  },
  /**
   * 
   * @param {文件数据} file 
   * @param {回调函数} callBack 
   * 压缩图片
   */
  compressFile(file,callBack){
    new Compressor(file, {
      quality: 0.6,
      success(result) {
        callBack(result)
      },
      error(err) {
        Notify({ type: 'warning', message: err.message })
      }
    })
  }
}