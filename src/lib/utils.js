import querystring from 'querystring';

const ch = [ null, '一', '二', '三', '四', '五', '六', '七', '八', '九', ];

const chWeekDay = [ '日', '一', '二', '三', '四', '五', '六', '日', ];

const monthDay = [
    0,
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
];

/**
 * 是否是闰年
 */
export function isLeapYear(year) {
    if (year % 4 !== 0) {
        return false;
    }
    if (year % 400 === 0) {
        return true;
    }
    if (year % 100 === 0) {
        return false;
    }
    return true;
}

/**
 * 获得一个月有多少天
 *
 * @param {} year
 * @param {} month
 */
export function getMonthDay(year, month) {
    if (isLeapYear(year) && month === 2) {
        return 29;
    }
    return monthDay[month];
}

/**
 * 等待毫秒数
 */
export function wait(ms) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, ms);
    });
}

/**
 * 处理placeholder
 *
 * @param {} val
 * @param {} placeholder
 */
export function placeholder(val, placeholder, extra) {
    if (isUndef(val) || val === extra) {
        return placeholder;
    }
    return val;
}

/**
 * 获得querystring
 *
 * @return {object} 返回qs
 */
export function getQS() {
    const posInSearch = location.search.indexOf('?');
    return querystring.decode(location.search.substr(posInSearch + 1));
}

/**
 * 是否是null或者undefined
 *
 * @param {} v 参数
 *
 * @return {boolean}
 */
export function isUndef(v) {
    return v === null || v === undefined;
}

/**
 * 金额格式化，当存在小数时，将显示两位小数
 *
 * @param {} v 金额数据
 *
 * @return {string}
 */
export function currency(v) {
    if (isUndef(v)) {
        return v;
    }

    const result = String((v / 100).toFixed(2));
    const pos = result.indexOf('.00');
    if (pos !== -1) {
        return result.substr(0, pos);
    } else {
        return result;
    }
}

/**
 * 转换成中文
 */
export function toCh(v) {
    return isUndef(ch[v]) ? v : ch[v];
}

/**
 * 返回weekDay的中文
 *
 * @param {Date} v
 */
export function toChWeekDay(v, format) {
    if (isUndef(v)) {
        return v;
    }
    v = new Date(v.valueOf() + 8 * 3600 * 1000).getUTCDay();
    if (isUndef(chWeekDay[v])) {
        return v;
    }
    if (!isUndef(format)) {
        return format.replace(/d/g, chWeekDay[v]);
    } else {
        return chWeekDay[v];
    }
}

/**
 * 获得当前的时间
 *
 * @return {Date} 当天
 */
export function dateNow() {
    const utcDate = new Date(new Date().valueOf() + 8 * 3600000);
    return dateParse(`${utcDate.getUTCFullYear()}-${utcDate.getUTCMonth() + 1}-${utcDate.getUTCDate()} ${utcDate.getUTCHours()}:${utcDate.getUTCMinutes()}:${utcDate.getUTCSeconds()}`);
}

/**
 * 日期格式化
 *
 * @param {Date|Number} v UTC+08:00
 * @param {String} format 格式内容
 *
 * @return {string} 经过format的日期数据
 */
export function dateFormat(v, format) {
    const type = typeof v;
    if (isUndef(v) || (type !== 'number' && !(v instanceof Date)) || v === '') {
        return v;
    }
    // 使用默认的format
    if (!format) {
        format = 'Y-m-d';
    }
    if (typeof v === 'number') {
        v = new Date(v - 8 * 3600000);
    } else {
        v = new Date(v.valueOf() - 8 * 3600000);
    }

    format = format.replace('Y', v.getUTCFullYear());
    format = format.replace('m', _format(v.getUTCMonth() + 1));
    format = format.replace('d', _format(v.getUTCDate()));
    format = format.replace('H', _format(v.getUTCHours()));
    format = format.replace('i', _format(v.getUTCMinutes()));
    format = format.replace('s', _format(v.getUTCSeconds()));

    return format;
}

/**
 * 移动日期
 *
 * @param {Date} v 传入进来的日期
 * @param {} day
 */
export function dateOffset(v, day) {
    if (isUndef(v)) {
        return v;
    }
    return new Date(v.valueOf() + day * 86400000);
}

/**
 * 日期天数差距
 *
 * @param {} v 较小的日期
 * @param {} c 比较的日期
 *
 * @return {number} 差距天数，当差距小于1天的时候，将不进行处理
 */
export function dateDiff(v, c) {
    if (isUndef(v)) {
        return v;
    }
    return Math.floor((c.valueOf() - v.valueOf()) / 86400000);
}

/**
 * 日期文本解析
 *
 * @param {String} v 要求必须是 1. Y-m-d H:i:s 2. Y-m-d
 *
 * @return {Date} 解析后的日期 UTC+08:00
 */
export function dateParse(v) {
    if (isUndef(v) || v === '') {
        return v;
    }
    const chunk = v.split(' ');
    const date = chunk[0];
    const time = chunk[1];
    const dateChunk = date.split('-');
    const d = new Date();
    d.setUTCFullYear(dateChunk[0]);
    d.setUTCMonth(dateChunk[1] - 1);
    d.setUTCMonth(dateChunk[1] - 1);
    d.setUTCDate(dateChunk[2]);
    let hour = 0;
    let minute = 0;
    let second = 0;
    if (!isUndef(time)) {
        const timeChunk = time.split(':');
        hour = timeChunk[0];
        minute = timeChunk[1];
        second = timeChunk[2];
    }
    d.setUTCHours(hour);
    d.setUTCMinutes(minute);
    d.setUTCSeconds(second);
    d.setUTCMilliseconds(0);
    return new Date(d.valueOf() + 8 * 3600000);
}

/**
 * 获得当天的Date，要求北京时区
 *
 * @return {Date} 当天日期，UTC时间+8小时
 */
export function dateToday() {
    const utcDate = new Date(new Date().valueOf() + 8 * 3600000);
    return dateParse(`${utcDate.getUTCFullYear()}-${utcDate.getUTCMonth() + 1}-${utcDate.getUTCDate()} 00:00:00`);
}

/**
 * 某一天之后的第一个day
 *
 *  - 当是同一个day的时候会获取当天(默认行为)，当inclusive = false是，将会寻找下一周的同一day
 *
 * @param {} date 某一天的日期
 * @param {} day 周几
 * @param {} inclusive = true 是否包含当天
 */
export function dateNext(date, day, inclusive = true) {
    let offset = (day - date.getDay() + 7) % 7;
    if (!inclusive && offset === 0) {
        offset = 7;
    }
    return dateOffset(date, offset);
}

/**
 * 对于数字进行format操作
 */
export function _format(number) {
    if (number < 0) {
        return number;
    } else if (number < 10) {
        return '0' + number;
    } else {
        return number;
    }
}

export function camelCase(key) {
    return key.replace(/[-_][a-z0-9]/g, ch => ch.substr(1).toUpperCase());
}

export function snakeCase(key) {
    return key.replace(/[A-Z0-9]+/g, ch => ('_' + ch.toLowerCase()));
}

/**
 * 是否是某种类型
 */
export function isType(name) {
    return function(val) {
        return Object.prototype.toString.call(val) === `[object ${name}]`;
    };
}

export const isArray = Array.isArray || isType(name);
export const isString = isType('String');

/**
 * 会直接打乱原本的数组
 */
export function shuffle(items) {
    let i;
    let j;
    let k;
    const len = items.length;
    for (i = len - 1; i > 0; i--) {
        // 处理每个i
        j = Math.floor(Math.random() * (i + 1));
        // 随机生成的j
        k = items[i];
        items[i] = items[j];
        items[j] = k;
    }
    return items;
}