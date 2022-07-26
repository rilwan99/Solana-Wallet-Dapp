import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { Connection } from '@solana/web3.js'
import { getPythClusterApiUrl, getPythProgramKeyForCluster, PythCluster } from '@pythnetwork/client/lib/cluster'
import { PriceStatus, PythHttpClient } from '@pythnetwork/client'


export const PriceFeed: FC = () => {

    const SOLANA_CLUSTER_NAME: PythCluster = 'mainnet-beta'
    const connection = new Connection(getPythClusterApiUrl(SOLANA_CLUSTER_NAME))
    const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME)

    async function runQuery(token: String): Promise<void> {
        const pythClient = new PythHttpClient(connection, pythPublicKey)
        const data = await pythClient.getData()

        for (const symbol of data.symbols) {
            const price = data.productPrice.get(symbol)

            if (price.price && price.confidence) {
                // tslint:disable-next-line:no-console
                console.log(`${symbol}: $${price.price} \xB1$${price.confidence}`)
            } else {
                // tslint:disable-next-line:no-console
                console.log(`${symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
            }
        }
    }

    runQuery('USDC/USD')


    return (
        <div>
            <div className={styles.standard}>
                <h2>
                    Prices
                </h2>

            </div>
        </div >
    )
}