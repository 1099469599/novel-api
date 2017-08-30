import Router from 'koa-router';
import { search, getAllChapters, getContent } from '../controllers/novel';

const router = new Router({
  prefix: '/novel'
});

router
  .get('/', async (ctx) => {
    const res = await search(ctx.query);
    ctx.body = res;
  })
  .get('/chapter', async (ctx) => {
    const res = await getAllChapters(ctx.query);
    ctx.body = res;
  })
  .get('/content', async (ctx) => {
    const res = await getContent(ctx.query);
    ctx.body = res;
  });

export default router;
