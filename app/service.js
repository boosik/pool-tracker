import tokenMap from "./token_map.js";
import getPoolLiquidity from "./pool_query.js";
import {push} from "../dynamoDB/db.js";
import { workerData, parentPort } from "worker_threads";
import { targetConfig } from "../config/config.js";

// console.log(`workerData: ${String.fromCharCode.apply(String, workerData.data)}`);
const finalData = JSON.parse(String.fromCharCode.apply(String, workerData.data));
if (finalData.result.data) {
    const targetPools = targetConfig.target_pools;
    console.log(`message received, target pool: ${targetPools}, event pool: ${finalData.result.events['token_swapped.pool_id']}`)
    for (const i in targetConfig.target_pools) {
        const resultPoolIds = finalData.result.events['token_swapped.pool_id']
        const targetSwapped = resultPoolIds.includes(targetPools[i]);
        if (!targetSwapped) {
            continue;
        }

        const isTargetPool = (element) => element === targetPools[i];
        const targetIndex = resultPoolIds.findIndex(isTargetPool);

        const poolId = resultPoolIds[targetIndex];
        const swapInSplit = finalData.result.events['token_swapped.tokens_in'][targetIndex].split("ibc");
        const swapInAmount = swapInSplit[0];
        const swapInDenom = tokenMap[`ibc${swapInSplit[1]}`];

        const swapOutSplit = finalData.result.events['token_swapped.tokens_out'][targetIndex].split("ibc");
        const swapOutAmount = swapOutSplit[0];
        const swapOutDenom = tokenMap[`ibc${swapOutSplit[1]}`];

        getPoolLiquidity(poolId).then((result) => {
            console.log(result);
            push({
                pool_id: poolId,
                token_swapped_in: swapInAmount + swapInDenom,
                token_swapped_out: swapOutAmount + swapOutDenom,
                liquidity: [
                    {
                        name: result[0].symbol,
                        liquidity: result[0].amount
                    },
                    {
                        name: result[1].symbol,
                        liquidity: result[1].amount
                    }
                ]
            })
        })
    }
}

parentPort.postMessage({result: 'done'});
