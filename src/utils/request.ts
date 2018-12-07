import { Modal, Toast } from "antd-mobile";
import axios from "axios";
import Cookies from "js-cookie";
const { alert } = Modal;

export const get = async <T = any>(
  url: string,
  options?: any,
  config?: any
): Promise<T> => request(url, { ...options, method: "get" }, config);

export const post = async <T = any>(
  url: string,
  options?: any,
  config?: any
): Promise<T> => request(url, { ...options, method: "post" }, config);

export const put = async <T = any>(
  url: string,
  options?: any,
  config?: any
): Promise<T> => request(url, { ...options, method: "put" }, config);

export const remove = async <T = any>(
  url: string,
  options?: any,
  config?: any
): Promise<T> => request(url, { ...options, method: "delete" }, config);

const request = async <T = any>(
  url: string,
  options: any,
  config: any
): Promise<T> => handleData(await fetch(url, options, config));

const fetch = (url: string, options: any, config: any) => {
  const { method = "get", param } = options;
  switch (method.toLowerCase()) {
    case "get":
      return axios.get(url, config);
    case "delete":
      return axios.delete(url, config);
    case "post":
      return axios.post(url, param, config);
    case "put":
      return axios.put(url, param, config);
    default:
      return axios(options);
  }
};

const handleData = (result: any): any => {
  if (result) {
    const { status, data } = result;
    if (status >= 200 && status < 300) {
      if (data.status === "10000") {
        return { ...data, success: true };
      } else {
        if (data.status !== "30002" && data.message) {
          alert("", data.message);
        }
        return { ...data, success: false };
      }
    }
    return { ...data, success: false };
  }
  return { success: false };
};

// 增加拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    alert("", "请求超时!");
    return Promise.resolve(err);
  }
);

axios.interceptors.response.use(
  result => {
    const {
      data: { status }
    } = result;

    if (status === "30005") {
      // 实名认证
      location.replace("#/person/qrCode");
    } else if (status === "30004") {
      // 企业授权
    } else if (status === "30002") {
      // location.replace("#/login");
      // Cookies.set("css_login_callback", location.href);
      sessionStorage.setItem("css_login_callback", window.location.href);
      // location.href = Cookies.get("css_ssoLoginUrl");
      location.href = sessionStorage.getItem("css_ssoLoginUrl")
    }
    return result;
  },
  err => {
    if (err && err.response) {
      const {
        response: { status, statusText }
      } = err;
      if (process.env.NODE_ENV === "development") {
        alert("", `${status}:${statusText}`);
      } else if (process.env.NODE_ENV === "production") {
        Toast.fail("系统繁忙，请稍后再试！");
      } else {
        Toast.fail("系统繁忙，请稍后再试！");
      }
      return Promise.resolve(err);
    }
  }
);
