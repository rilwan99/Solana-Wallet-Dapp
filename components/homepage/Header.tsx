import { FC } from 'react'
import styles from '../../styles/Homepage.module.css'
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const Header: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/TableFi_Logo.svg" height={30} width={200} />
            <WalletMultiButton />
        </div>
    )
}