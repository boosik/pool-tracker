import request from "request";

export default function getPoolLiquidity(poolId) {
    return new Promise((resolve, reject) => {
        request(`https://api-osmosis.imperator.co/pools/v2/${poolId}`, function(err, res, body) {
            if (err) {
                console.log("reject");
                return reject(err);
            }
            try {
                console.log("resolve");
                resolve(JSON.parse(body));
            } catch (e) {
                console.log("reject");
                reject(e);
            }
        })
    })
}