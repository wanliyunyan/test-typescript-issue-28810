import {
  Button,
  Icon,
  InputItem,
  List,
  Modal,
  NavBar,
  NoticeBar,
  TextareaItem,
  WingBlank
} from "antd-mobile";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import queryString from "query-string";
import { createForm, createFormField } from "rc-form";
import * as React from "react";
import { INPUT_MAX_LENGTH, LIMIT_MIN } from "../../common/constant";

import { formatSearch, objectAddValue } from "../../utils/utils";
import { Spin } from "src/components/Spin/Index";

const { Item } = List;
const { alert } = Modal;

interface IProps {
  dispatch?: any;
  location?: any;
  form: any;
  formData?: any;
  saveForm?: any;
  company?: any;
  submitLoading?: boolean;
  loan: {
    detailData?: any;
    detailPageLoading?: boolean;
  };
  applyLoan: {
    template?: Array<{
      lrrDm?: string;
      lrrq?: string;
      mbid1?: string;
      cd1?: string;
      mrz?: string;
      name?: string;
      sfbl?: string;
      sjly?: string;
      sjlylx?: string;
      sxm?: string;
      sxtxlx?: string;
      uuid?: string;
      xgrDm?: string;
      xgrq?: string;
      xh?: string;
      yxbz?: string;
      zzjy?: string;
      extendInfo?: any;
    }>;
    submitLoading?: boolean;
  };
}
@connect(state => {
  return {
    applyLoan: state.applyLoan,
    loan: state.loan,
    loading: state.loading.effects
  };
})
@createForm({
  mapPropsToFields(props) {
    const data: any = {};

    const {
      applyLoan: { formData }
    } = props;

    Object.keys(formData).forEach(key => {
      data[key] = createFormField({
        ...formData[key],
        value: formData[key].value
      });
    });

    return data;
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: "applyLoan/formDataSave",
      payload: fields
    });
  }
})
@Spin()
export default class Index extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
  }

  public handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, location } = this.props;
    const search = formatSearch(location.search);
    let flag = false
    form.validateFields((error, values) => {
      if (error) {
        const arr = Object.keys(error);
        for(const key of arr){
          for(const err of error[key].errors){
            alert('', err.message);
            flag = true;
            break;
          }
          if(flag){
            break;
          }
        }
      } else {
        dispatch({
          type: "applyLoan/formDataSave",
          payload: objectAddValue(values)
        });
        dispatch(
          routerRedux.push({
            pathname: "/blank/applyProtocol",
            search: queryString.stringify({
              ...search,
              ...values
            })
          })
        );
      }
    });
  };

  public renderRex = item => {
    return item.zzjy
      ? [
          {
            required: item.sfbl === "Y",
            message: "请输入" + item.name
          },
          {
            pattern: item.zzjy ? eval(item.zzjy) : null, //  此处没有办法，不得不使用eval
            message: `${item.name}格式错误`
          }
        ]
      : [
          {
            required: item.sfbl === "Y",
            message: "请输入" + item.name
          }
        ];
  };

  public render() {
    const {
      applyLoan: { template },
      loan: { detailData, detailPageLoading }
    } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <NavBar
          icon={<Icon type="left" />}
          onLeftClick={() => window.history.back()}
          mode="dark"
        >填写申请信息</NavBar>
        <NoticeBar
          mode="closable"
          marqueeProps={{
            loop: true,
            style: { padding: "0 7.5px" },
            text:
              "在提交贷款信息时请确保已经进行企业认证，若没有进行企业认证,请到个人中心认证后再申请贷款."
          }}
        />
        <List>
          <Item>
            <InputItem
              {...getFieldProps("dkje", {
                rules: [
                  {
                    required: true,
                    message: "请输入正确的贷款金额"
                  }
                ]
              })}
              onBlur={(value) => {
                if(Number(value)>Number(detailData.zgje / 10000)){
                  alert("",`贷款金额不能大于${detailData.zgje / 10000}`)
                }else if(Number(value)<LIMIT_MIN){
                  alert("",`贷款金额不能小于${LIMIT_MIN}万元`)
                }
              }}
              labelNumber={7}
              type={"money"}
              placeholder={"请输入贷款金额"}
            >
              贷款金额(万元)
            </InputItem>

            <InputItem
              {...getFieldProps("sqrlxdh", {
                rules: [
                  {
                    required: true,
                    message: "请输入正确的电话号码",
                    whitespace: true
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: "手机号格式错误"
                  }
                ]
              })}
              labelNumber={7}
              placeholder={"请输入申请人电话"}
              maxLength={INPUT_MAX_LENGTH.MOBILE}
            >
              申请人电话
            </InputItem>

            <InputItem
              {...getFieldProps("dksqqx1", {
                rules: [
                  {
                    required: true,
                    message: "请填写贷款期限"
                  },
                  {
                    min: 1
                  },
                  {
                    max: Number(detailData.dkzq)
                  }
                ]
              })}
              onBlur={(value) => {
                if(Number(value)>Number(detailData.dkzq)){
                  alert("",`贷款期限不能大于${detailData.dkzq}个月`)
                }else if(Number(value)<LIMIT_MIN){
                  alert("",`贷款期限不能小于${LIMIT_MIN}个月`)
                }
              }}
              type={"number"}
              labelNumber={7}
              placeholder={"请输入申贷款期限"}
            >
              申请期限(月)
            </InputItem>

            <TextareaItem
              {...getFieldProps("dkly", {
                rules: [
                  {
                    required: true,
                    message: "请输入申请理由"
                  }
                ]
              })}
              title="贷款理由"
              count={300}
              rows={5}
              labelNumber={7}
              placeholder={"请输入贷款理由"}
            />

            <WingBlank>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                loading={detailPageLoading}
              >
                提交
              </Button>
            </WingBlank>
          </Item>
        </List>
      </div>
    );
  }
}
