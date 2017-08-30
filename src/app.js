// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
// process.env['https_proxy'] = 'http://127.0.0.1:8888';
// process.env['http_proxy'] = 'http://127.0.0.1:8888';

import Koa from 'Koa';
import cors from 'kcors';
import bodyParser from 'koa-bodyparser';
import routes from './routes';
import mongoose from './config/mongoose';
import { init } from './controllers/rule';
import responseFormat from './middlewares/responseFormat';

mongoose();

init();

const app = new Koa();
app.use(async (ctx, next) => {
  // 响应开始时间
  const start = new Date();
  // 响应间隔时间
  let ms;
  try {
    // 开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    // 记录响应日志
    // logger.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    // 记录异常日志
    // logger.ctxError(ctx, error, ms);
  }
});

app.use(cors({ credentials: true }));
app.use(bodyParser());
app.use(responseFormat('^/api'));
app.use(routes.routes());
app.on('error', (err, ctx) => {
  console.log(err)
  // logger.error('server error', err, ctx);
});
if (!module.parent) app.listen(3000);

export default app;
