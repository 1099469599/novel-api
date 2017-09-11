const rp = require('request-promise').defaults({ simple: false });;
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
import { parse as urlParse, resolve as urlResolve } from 'url';
import { Rule } from '../models';
import ApiError from '../errors/ApiError';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
};

const getRealUrl = (opt) => {
  return new Promise((resolve, reject) => {
    rp.get(opt.url, { followRedirect: false }, (error, response) => {
      if (response.statusCode === 302) {
        resolve({ ...opt, url: response.headers['location'] });
      } else {
        console.log('error');
        reject(error);
      }
    });
  });
}

export async function search({ wd, pn }) {
  let res = await rp.get('https://www.baidu.com/s',
    {
      qs: { wd, pn },
      headers
    }
  );
  const $ = cheerio.load(res);
  const encryptItems = [];
  $('.result.c-container h3 a').each((index, item) => {
    encryptItems.push({ title: $(item).text(), url: $(item).attr('href') });
  });
  const items = await Promise.all(encryptItems.map(item => getRealUrl(item)));
  return items;
}

export async function getAllChapters({ url }) {
  const host = urlParse(url).host;
  const rule = await Rule.findOne({ host });
  if (!rule) throw new ApiError('RULE_NOT_EXIST');;
  const { chapter, encoding } = rule;

  let res = await rp.get(url, { encoding: null, headers });
  res = iconv.decode(Buffer.from(res), encoding);
  const $ = cheerio.load(res);
  const chapters = [];
  eval(chapter).each((index, item) => {
    chapters.push({ title: $(item).text(), url: urlResolve(url, $(item).attr('href')) });
  });
  return chapters;
}

export async function getContent({ url }) {
  const host = urlParse(url).host;
  const rule = await Rule.findOne({ host });
  if (!rule) return { message: '规则不存在' };

  const { content, encoding } = rule;
  let res = await rp.get(url, { encoding: null });
  res = iconv.decode(Buffer.from(res), encoding);
  const $ = cheerio.load(res);

  return eval(content).text();
}
