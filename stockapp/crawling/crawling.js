const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const db = require("../config/DB");

module.exports = {
    KOSPI200: async function(req, res, next) {
        var kospi200 = [];
        for (let i = 1; i < 21; i++) {
            await axios({
                url: 'https://finance.naver.com/sise/entryJongmok.naver?&page=' + i,
                method: 'GET',
                responseType: 'arraybuffer',
            })
            .then(response => {
                try {
                    const content = iconv.decode(response.data, 'EUC-KR');
                    const $ = cheerio.load(content);
                    const $bodyList = $("div.box_type_m table.type_1 tbody").children('tr');

                    $bodyList.each(function (i, elm) {
                        let c_name = $(this).find('td.ctg').text();
                        let link = $(this).find('td.ctg').find('a').attr('href');
                        let now = $(this).find('td.number_2')[0];
                        let s = $(this).find('td.rate_down2').find('img').attr('alt') == "상승" ? 1 : 0;
                        let chg = $(this).find('td.rate_down2 span').text();
                        let chgp = $(this).find('td.number_2')[1];
                        let vol = $(this).find('td.number').text();
                        let trading_val = $(this).find('td.number_2')[2];
                        let total_val = $(this).find('td.number_2')[3];

                        if (typeof (link) == 'string')
                            link = link.split('=')[1];

                        kospi200.push({
                            name: c_name,
                            code: link,
                            now_val: $(now).text(),
                            s: s,
                            chg: chg.replace(/["\t", "\n"]/g, ''),
                            chgp: $(chgp).text().replace(/["\t", "\n"]/g, ''),
                            vol: vol,
                            trading_val: $(trading_val).text(),
                            total_val: $(total_val).text()
                        });
                    });

                    kospi200 = kospi200.filter(n => n.code);

                    if (kospi200.length == 200) {
                        req.kospi200 = kospi200;
                        next();
                    }
                } catch (err) {
                    console.error(err);
                }
            })
        }
    },

    ItemPrice: async function(req, res) {
        return new Promise(resolve => {
            axios({
                url: 'https://finance.naver.com/item/main.naver?code=' + req.params.item_code,
                method: 'GET',
                responseType: 'arraybuffer',
            })
            .then(response => {
                try {
                    const content = iconv.decode(response.data, 'EUC-KR');
                    const $ = cheerio.load(content);

                    const $now = $("#chart_area > div.rate_info > div > p.no_today > em").children("span")[0];
                    const $closed = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(1) > td.first > em").children("span")[0];
                    const $chg = $("#chart_area > div.rate_info > div > p.no_exday").children("em")[0];
                    const $chgp = $("#chart_area > div.rate_info > div > p.no_exday").children("em")[1];
                    const $open = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(2) > td.first > em").children("span")[0];
                    const $high = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(1) > td:nth-child(2) > em").children("span")[0];
                    const $low = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(2) > td:nth-child(2) > em:nth-child(2)").children("span")[0];
                    const $vol = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(1) > td:nth-child(3) > em").children("span")[0];
                    const $val = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(2) > td:nth-child(3) > em").children("span")[0];

                    let name = $("#middle > div.h_company > div.wrap_company > h2 > a").text();
                    let now = $($now).text();
                    let closed = $($closed).text();
                    let chg = $($chg).children("span")[1];
                    let ud = $($chgp).children("span")[0];
                    let chgp = $($chgp).children("span")[1];
                    let open = $($open).text();
                    let high = $($high).text();
                    let low = $($low).text();
                    let vol = $($vol).text();
                    let val = $($val).text();

                    var item_info = {
                        code: req.params.item_code,
                        name: name,
                        now: now,
                        closed: closed,
                        chg : $(chg).text(),
                        chgp : $(ud).text() + $(chgp).text() + '%',
                        open: open,
                        high: high,
                        low: low,
                        vol: vol,
                        val: val
                    }
                    console.log(item_info);
                    resolve(item_info);

                } catch (err) {
                    console.error(err);
                }
            })
        }) 
    },

    PriceByDay: async function (req, res, next) {
        var priceByDay = [];
        return new Promise(resolve => { 
            for (let i = 1; i < 31; i++) {
                axios({
                    url: `https://finance.naver.com/item/sise_day.naver?code=${req.params.item_code}&page=${i}`,
                    method: 'GET',
                    responseType: 'arraybuffer',
                    headers: {'User-agent': 'Mozilla/5.0'}
                })
                .then(response => {
                    try {
                        const content = iconv.decode(response.data, 'EUC-KR');
                        const $ = cheerio.load(content);

                        for(var i = 3; i < 8; i++) {
                            const $tr = $(`body > table.type2 > tbody > tr:nth-child(${i})`).children("td");
                            let trArr = [];

                            $tr.each(function (i, elm) {
                                trArr.push($(this).find('span').text().trim());
                            });
                            trArr.push($tr.find('img').attr('alt'));
                            priceByDay.push(trArr);
                        }

                        for (var i = 11; i < 16; i++) {
                            const $tr = $(`body > table.type2 > tbody > tr:nth-child(${i})`).children("td");
                            let trArr = [];

                            $tr.each(function (i, elm) {
                                trArr.push($(this).find('span').text().trim());
                            });
                            trArr.push($tr.find('img').attr('alt'));
                            priceByDay.push(trArr);
                        }

                        if(priceByDay.length == 300) {
                            
                        }

                        resolve();

                    } catch (err) {
                        console.error(err);
                    }
                })
            }
        });
    },
}