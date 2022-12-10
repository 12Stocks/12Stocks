const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const log = console.log;
const db = require('../config/DB');

var idx = 0;
var result = [];

// for(let i = 1; i < 21; i++) {
//     axios({
//         url: 'https://finance.naver.com/sise/entryJongmok.naver?&page=' + i,
//         method: 'GET',
//         responseType: 'arraybuffer',
//     })
//     .then(response => {
//         try {
//             let list = [];
//             const content = iconv.decode(response.data, 'EUC-KR');
//             const $ = cheerio.load(content);
//             const $bodyList = $("div.box_type_m table.type_1 tbody").children('tr');
            
//             $bodyList.each(function(i, elm) {
//                 let c_name = $(this).find('td.ctg').text();
//                 let link = $(this).find('td.ctg').find('a').attr('href');
//                 if(typeof(link) == 'string')
//                     link = link.split('=')[1];

//                 list[i] = {
//                     name : c_name, 
//                     code : link,
//                 };
//             });
    
//             const data = list.filter(n => n.code);
//             return data;
//         } catch(err) {
//             console.error(err);
//         }
//     })
//     .then(res => {
//         for(let j = 0; j < 10; j++) {
//             axios({
//                 url: 'https://navercomp.wisereport.co.kr/v2/company/c1010001.aspx?cmp_cd=' + res[j].code,
//                 method: 'GET',
//                 responseType: 'arraybuffer',
//             })
//             .then(response => {
//                 const content = response.data;
//                 const $ = cheerio.load(content);
//                 const $bodyList = $('div.body-section form#Form1 div#all_contentWrap div#contentWrap div#pArea div.PageContainer div.PageContentContainer').children('div#wrapper');

//                 let d = $($bodyList).find('div.all-width').find('div.cmp_comment').find('ul.dot_cmp').find('li').text().split('.')[0];
//                 let is = $($bodyList).find('div.wrapper-row').find('div.fl_le.half').find('div.body').find('table').find('tbody').find('tr')[6];

//                 result.push(
//                     {
//                         idx : idx,
//                         stock_code : res[j].code,
//                         c_name : res[j].name,
//                         c_description : d,
//                         issued_shares : Number($(is).children('td.num').text().trim().split('주')[0]
//                         .match(/[\d,]+/)[0]
//                         .replace(/,/g, '')),
//                     }
//                 );
//                 idx++;
                
//                 if(idx == 200) {
//                     for(let i = 0; i < 200; i++) {
//                         var code = result[i].stock_code;
//                         var name = result[i].c_name;
//                         var desc = result[i].c_description;
//                         var shares = result[i].issued_shares;

//                         const datas = [code, name, desc, shares, shares];

//                         db.query('INSERT INTO c_info VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE issued_shares = ?', datas);
//                     }
//                     log("successfully inserted !");
//                     db.end();
//                 }
//             });
//         }
//     });
// }

const KOSPI200 = async function() {
    return new Promise((resolve) => {
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
                        console.log(kospi200.length);
                        resolve(kospi200);
                    }
                } catch (err) {
                    console.error(err);
                }
            })
        }
    });
}

f = async () => {
    var arr = await KOSPI200();
    arr.forEach((elm, idx) => {
        var sql = "INSERT INTO today_prices VALUES(?, ?, CURRENT_TIMESTAMP()) ON DUPLICATE KEY UPDATE price = ?";
        db.query(sql, [elm.code, Number(elm.now_val.replace('\,', '')), Number(elm.now_val.replace('\,', ''))], (err, rows, fields) => {
            if(err) throw err;
            console.log(idx, "conmplete !");
        });
    });
};

setInterval(f, 10000);