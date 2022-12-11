const db = require("../config/DB");
const orderController = require("../controllers/orderController");

function sz(p) {
    if (p.length < 4) return 1;
    if (1000 <= p && p < 5000) return 5;
    if (5000 <= p && p < 10000) return 10;
    if (10000 <= p && p < 50000) return 50;
    if (50000 <= p && p < 100000) return 100;
    if (100000 <= p && p < 500000) return 500;
    if (500000 <= p) return 1000;
}

const getPrices = async (cb) => {
    var sql = "SELECT stock_code, NOW FROM today_prices;";
    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
        cb(rows);
    });
};

const autoOrder = async () => {
    getPrices((rows) => {
        rows.forEach(elm => {
            var q = Math.random().toFixed(1)*300 + 10;
            var tick = sz(elm.NOW) * (Math.round(Math.random().toFixed(1)*10) - 5);
            orderController.limitOrder("orderbot", elm.stock_code, q, Math.round(Math.random()), elm.NOW + tick, () => {
                
            });
        });
    });
}

const auto = async () => {
    autoOrder();
    console.log("order");
}

module.exports = auto;