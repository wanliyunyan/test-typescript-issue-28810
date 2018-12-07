import BasicLayout from "../layouts/BasicLayout";


import Home from "../routes/Home/Index";


const data = [
  {
    component: BasicLayout,
    layout: "BasicLayout",
    name: "主页模板",
    path: "",
    children: [
      {
        name: "首页",
        icon: "home",
        path: "/home",
        auth: false,
        component: Home,
        url: "assets/svg/syicon.svg",
        urlNew: "assets/svg/syicon2.svg"
      },
    ]
  }
];

export function getNavData() {
  return data;
}

export type navType = Array<{
  name: string;
  exact?: boolean;
  icon?: string;
  path: string;
  auth: boolean;
  url?: string;
  urlNew: string;
  component: any;
}>;

export default data;
