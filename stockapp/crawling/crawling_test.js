const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const log = console.log;
const db = require('../config/DB');

const autoCrawler = async function(cb) {
    var codes = [];
    for (let i = 1; i < 21; i++) {
        axios({
            url: 'https://finance.naver.com/sise/entryJongmok.naver?&page=' + i,
            method: 'GET',
            responseType: 'arraybuffer',
        })
        .then(response => {
            try {
                const content = iconv.decode(response.data, 'EUC-KR');
                const $ = cheerio.load(content);
                const $bodyList = $("div.box_type_m table.type_1 tbody").children('tr');

                $bodyList.each(function (idx, elm) {
                    let link = $(this).find('td.ctg').find('a').attr('href');
                    if (typeof (link) == 'string') {
                        link = link.split('=')[1];
                        codes.push(link);
                    }
                });
                if(codes.length == 200) {
                    console.log("codes", codes.length);
                    cb(codes);
                }
            } catch (err) {
                console.error(err);
            }
        })
    }
};
    
const getInfo = async function(codes, cb) {
    var info = [];
    for(var i = 0; i < codes.length; i++) {
        await axios({
            url: 'https://finance.naver.com/item/main.naver?code=' + codes[i],
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
                
                info.push({
                    stock_code: codes[i],
                    STK_NAME : name,
                    NOW : Number(now.replace('\,', '')),
                    C_PRC : Number(closed.replace('\,', '')),
                    CHG : Number($(chg).text().replace('\,', '')),
                    CHGP : $(ud).text() + $(chgp).text(),
                    O_PRC : Number(open.replace('\,', '')),
                    H_PRC : Number(high.replace('\,', '')),
                    L_PRC : Number(low.replace('\,', '')),
                    VAL : Number(val.replace('\,', ''))
                })
                if(info.length == 200) {
                    console.log(info.length);
                    cb(info);
                }
                
            } catch (err) {
                console.error(err);
            }
        });
    }
};
    
const tp = async () => {
    autoCrawler((codes) => {
        getInfo(codes, (info) => {
            var sql = "INSERT INTO today_prices VALUES(?, ?, DATE_FORMAT(CURRENT_TIMESTAMP(), \"%Y-%m-%d %H:%m\"), ?, ?, ?, ?, ?, ?, ?, ?)";
            var sql2 = " ON DUPLICATE KEY UPDATE DT = DATE_FORMAT(CURRENT_TIMESTAMP(), \"%Y-%m-%d %H:%m\"), NOW = ?, C_PRC = ?, CHG = ?, CHGP = ?, O_PRC = ?, H_PRC = ?, L_PRC = ?, VAL = ?;";
            for(var i = 0; i < info.length; i++) {
                db.query(sql+sql2, [info[i].stock_code, info[i].STK_NAME, info[i].NOW, info[i].C_PRC, info[i].CHG, info[i].CHGP, info[i].O_PRC,
                    info[i].H_PRC, info[i].L_PRC, info[i].VAL, info[i].NOW, info[i].C_PRC, info[i].CHG, info[i].CHGP, info[i].O_PRC,
                    info[i].H_PRC, info[i].L_PRC, info[i].VAL], (err, row, fields) => {
                    if(err) throw err;
                });
            };
        });
    });
};

module.exports = tp;

