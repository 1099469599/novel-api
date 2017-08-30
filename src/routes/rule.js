import Router from 'koa-router';
import { add } from '../controllers/rule';

const router = new Router({
  prefix: '/novel'
});

router
  .post('/', async (ctx) => {
    const res = await add(ctx.request.body);
    ctx.body = res;
  })
  .get('/chapter', async (ctx) => {
    const res = await getAllChapters(ctx.query);
    ctx.body = res;
  });

export default router;
