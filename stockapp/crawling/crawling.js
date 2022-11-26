const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

module.exports = {
    KOSPI200: function(req, res, next) {
        var kospi200 = [];
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
    }

}