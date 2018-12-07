import { cloneDeep } from "lodash";
import navData, { navType } from "../common/nav";
import {
  PASSWORD_COUNT,
  PASSWORD_RULE_CHAR,
  PASSWORD_RULE_LOWER,
  PASSWORD_RULE_NUMBER,
  PASSWORD_RULE_UPPER
} from "../common/constant";

function getPlainNode(nodeList, parentPath = "") {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ""}`.replace(/\/+/g, "/");
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function getRouteData(path) {
  if (
    !navData.some(item => item.layout === path) ||
    !navData.filter(item => item.layout === path)[0].children
  ) {
    return null;
  }
  const dataList = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(dataList.children);
  return nodeList;
}

export const getAuthByPath = (menu: navType, path: string) => {
  const item = menu.filter(obj => obj.path === path);
  return item&&item.length>0?item[0].auth:false;
};
export const formatSearch = (se: any) => {
  if (typeof se !== "undefined") {
    se = se.substr(1); // 从起始索引号提取字符串中指定数目的字符
    var arr = se.split("&"), // 把字符串分割为字符串数组
      obj = {},
      newarr = [];
    arr.forEach(function(v, i){ // 数组遍历
      newarr = v.split("=");
      if(typeof obj[newarr[0]] === "undefined"){
        obj[newarr[0]] = newarr[1];
      }
    });
    return obj;
  }
};
/*export function getUrlParam(name) {
  // const after = window.location.hash.split("?")[1];
  const after = window.location.search.split("?")[1];
  if (after) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = after.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    } else {
      return null;
    }
  }
}*/

/**
 * @param param
 * @returns result
 *  为了适应表单，增加value
 */
export const objectAddValue = (param: any): any => {
  const result = { ...param };
  Object.keys(result).forEach(key => {
    result[key] = {
      value: result[key]
    };
  });
  return result;
};

/**
 * @param param
 * @returns array
 *  为数组增加key
 */
export const arrayAddKey = (param: object[] = []): object[] => {
  const array: object[] = [...param].filter(obj => obj);
  array.forEach((obj: any, index: number) => {
    obj.key = index + 1;
  });
  return array;
};

// 保留两位小数并且整数部分三位一个逗号分隔符的数字金钱标准表示法：
// 这里假设我们即不知道输入数字的整数位数，也不知道小数位数
/*将100000转为100,000.00形式*/
export const dealNumber = (param: number | string): string => {
  if (param && param !== "0") {
    let money = "";
    if (typeof param === "number") {
      money = `${param}`;
    } else {
      money = param;
    }
    const left = money.split(".")[0];
    let right = money.split(".")[1];
    right = right
      ? right.length >= 2
        ? "." + right.substr(0, 2)
        : "." + right + "0"
      : ".00";
    const temp = left
      .split("")
      .reverse()
      .join("")
      .match(/(\d{1,3})/g);
    return (
      (Number(money) < 0 ? "-" : "") +
      temp
        .join(",")
        .split("")
        .reverse()
        .join("") +
      right
    );
  } else if (param === 0 || param === "0") {
    // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    return "0.00";
  } else {
    return "";
  }
};

/**
 * @param password
 * @returns boolean
 *  校验密码规则
 */
export const checkPasswordRule = (password: string): boolean => {
  let num: number = 0;
  const array = [
    new RegExp(PASSWORD_RULE_NUMBER),
    new RegExp(PASSWORD_RULE_UPPER),
    new RegExp(PASSWORD_RULE_LOWER),
    new RegExp(PASSWORD_RULE_CHAR)
  ];

  array.forEach(rule => {
    if (rule.test(password)) {
      num += 1;
    }
  });

  return num >= PASSWORD_COUNT;
};

