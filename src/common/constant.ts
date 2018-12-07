
export const LIMIT_MIN = 1; // 贷款额度下限;

// 最大输入长度
export const INPUT_MAX_LENGTH = {
  MOBILE: 11, // 手机
  ID: 18, // 身份证
  TAXPAYER_ID: 20, // 纳税人识别号
  CAPTCHA: 6, // 验证码
  USER_NAME: 30, // 用户姓名
  PASSWORD: 100 // 密码
};



export const PASSWORD_RULE_NUMBER = /\d/;
export const PASSWORD_RULE_UPPER = /[A-Z]/;
export const PASSWORD_RULE_LOWER = /[a-z]/;
export const PASSWORD_RULE_CHAR = /[\\`~/!/@/#/$/%/^/&/*/(/)\-/_/+/=/|/{/}\[\]/';/:/",/./?/</>]/;

export const PASSWORD_COUNT: number = 3;
