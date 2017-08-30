import Router from 'koa-router';
import novel from './novel'

const router = new Router({
    prefix: '/api'
});

router.use(novel.routes());

module.exports = router;
