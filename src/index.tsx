import dva from "dva";
import createLoading from "dva-loading";
import createHistory from "history/createHashHistory";
import { hot } from "react-hot-loader";
import "./index.less";
import models from "./models";
import router from "./router";

const app = hot(module)(
  dva({
    history: createHistory()
  })
);

// 2. Plugins
app.use(createLoading());

// 3. Model
models.forEach(m => {
  app.model(m.default); // ts 导出格式包含default
});

// 4. Router
app.router(router);

// 5. Start
app.start("#root");
