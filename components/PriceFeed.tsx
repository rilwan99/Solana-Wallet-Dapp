import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'


export const PriceFeed: FC = () => {

    const [tokenList, setTokenList] = useState(0)

    //1. Import coingecko-api
    const CoinGecko = require('coingecko-api');

    //2. Initiate the CoinGecko API Client
    const CoinGeckoClient = new CoinGecko();

    async function getTokenList() {
        // Sending request using coingecko API
        const data = await CoinGeckoClient.coins.list()

        // Extracting id, name and symbol for all tokens listed
        // Returns array of objects with properties: id, name & symbol
        const coingeckoList = data.data

        // Filtering through array to find the desired token
        const requiredTokenObject = coingeckoList.find(element => element.symbol === "msol")
        // Finding the coingecko ID of the desired token
        const requiredTokenId = requiredTokenObject.id;

        // Fetching token information using coingecko API
        const tokenInfo = await CoinGeckoClient.coins.fetch(requiredTokenId, { tickers: false, community_data: false, developer_data: false, localization: false })
        // Retrieving market data of the desired token
        const priceInfo = tokenInfo.data.market_data

        // Fetching Price(USD) of the desired token
        const priceInfoUsd = priceInfo.current_price.usd
        console.log(JSON.stringify(priceInfoUsd))
        console.log(priceInfoUsd)
        setTokenList(priceInfoUsd)
    };

    return (
        <div>
            <div className={styles.standard}>
                <h2>
                    Prices
                </h2>
                <p>Token Price: {tokenList}</p>
                <button onClick={async () => await getTokenList()}>
                    Call Function
                </button>
            </div>
        </div >
    )
}