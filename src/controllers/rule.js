import url from 'url';
import { Rule } from '../models';
import rules from '../config/rules';

export async function add(rule) {
  rule.host = url.parse(rule.url).host;
  const res = await Rule.create(rule);
  return res;
}

export async function init() {
  const count = await Rule.count();
  if (count === 0) {
    await Promise.all(rules.map(item => add(item)));
  }
}
