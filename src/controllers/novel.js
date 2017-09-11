const rp = require('request-promise').defaults({ simple: false });;
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const debug = require('debug')('novel')
import fs from 'fs-extra';
import path from 'path';
import { parse as urlParse, resolve as urlResolve } from 'url';
import crypto from 'crypto';
import { Rule } from '../models';
import ApiError from '../errors/ApiError';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
};

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
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

export async function crawlerAllChapters({ rule, url }) {
  const { chapter, encoding } = rule;

  let res = await rp.get(url, { encoding: null, headers });
  res = iconv.decode(Buffer.from(res), encoding);
  // debug(res);
  const $ = cheerio.load(res);
  const chapters = [];
  eval(chapter).each((index, item) => {
    chapters.push({ title: $(item).text(), url: urlResolve(url, $(item).attr('href')) });
  });
  return chapters;
}

export async function getAllChapters({ url }) {
  const host = urlParse(url).host;
  const rule = await Rule.findOne({ host });
  if (!rule) throw new ApiError('RULE_NOT_EXIST');;

  const chapters = await crawlerAllChapters({ rule, url });

  return chapters;
}

async function crawlerContent({ rule, title, url, dir, retry = 0 }) {
  const filePath = path.join(dir, `${md5(url)}.txt`);
  if (dir) {
    if (fs.existsSync(filePath)) {
      return { title, url, content: fs.readFileSync(filePath, 'utf8') };
    }
  }
  const { content, encoding } = rule;
  let res = await rp.get(url, { encoding: null, headers });
  res = iconv.decode(Buffer.from(res), encoding);
  const $ = cheerio.load(res);

  res = eval(content).text();
  if (res) {
    if (dir) {
      fs.writeFileSync(filePath, res);
    }
  } else if (retry < 3) {
    retry += 1;
    res = await crawlerContent({ rule, url, dir, retry });
  }
  if (dir) {
    return { title, url, content: res };
  }
  return res;
}

export async function getContent({ url }) {
  const host = urlParse(url).host;
  const rule = await Rule.findOne({ host });
  if (!rule) return { message: '规则不存在' };

  const res = await crawlerContent({ rule, url });

  return res;
}


export async function download({ url }) {
  const host = urlParse(url).host;
  const rule = await Rule.findOne({ host });
  if (!rule) return { message: '规则不存在' };

  const dir = path.join('download', host, md5(url));
  fs.mkdirpSync(dir);

  const chapters = await crawlerAllChapters({ rule, url });

  const res = await Promise.all(chapters.map(item => crawlerContent({ rule, title: item.title, url: item.url, dir })));
  let content = '';
  res.forEach(item => {
    content += item.title + '\n' + item.content + '\n';
  });
  fs.writeFileSync('特战神医.txt', content);
  return res;
}

