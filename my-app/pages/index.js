import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { Contract, providers } from 'ethers';
import Web3Modal from 'web3modal';
import styles from '../styles/Home.module.scss';
import Navbar from '../component/common/Navbar/Navbar';
import Button from '../component/shared/Button/Button';
import { abi, WHITELIST_CONTRACT_ADDRESS } from '../constant';

export default function Home() {
    const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
    const [walletConnected, setWalletConnected] = useState(false);
    const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    const [loading, setLoading] = useState(false);

    const web3ModalRef = useRef();

    const getProviderOrSigner = async (needSigner = false) => {
        try {
            const provider = await web3ModalRef.current.connect();
            const web3Provider = new providers.Web3Provider(provider);

            const { chainId } = await web3Provider.getNetwork();

            if (chainId !== 4) {
                window.alert('change the network to rinkeby');
                throw new Error('change the network to rinkeby');
            }

            if (needSigner) {
                const signer = web3Provider.getSigner();
                return signer;
            }
            return web3Provider;
        } catch (error) {
            console.error(error);
        }
    };

    const checkIfAddressIsWhitelisted = async () => {
        try {
            const signer = await getProviderOrSigner(true);
            const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

            const address = signer.getAddress();
            const _joinedWhitelist = await whitelistContract.whiteListedAddresses(address);
            setJoinedWhitelist(_joinedWhitelist);
        } catch (error) {
            console.error(error);
        }
    };

    const getNumberOfWhitelisted = async () => {
        try {
            const provider = await getProviderOrSigner();
            const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);

            const _numOfWhitelistedAddress = await whitelistContract.numAddressWhitelisted();
            setNumOfWhitelisted(_numOfWhitelistedAddress);
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
            checkIfAddressIsWhitelisted();
            getNumberOfWhitelisted();
        } catch (error) {
            console.error(error);
        }
    };

    const addAddressToWhitelist = async () => {
        try {
            const signer = await getProviderOrSigner(true);
            const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

            const tx = await whitelistContract.addAddressToWhitelist();
            setLoading(true);
            tx.wait();
            setLoading(false);

            await getNumberOfWhitelisted();
            setJoinedWhitelist(true);
        } catch (error) {
            console.log(error);
        }
    };

    const renderButton = () => {
        if (walletConnected) {
            if (joinedWhitelist) {
                return <div style={{fontSize: '1.5rem', color: '#1500ff'}}>Thanks for joining the Whitelist!</div>;
            } else if (loading) {
                return <Button label='Loading' disabled={true} />;
            } else {
                return <Button label='Join the whitelist' onClick={() => addAddressToWhitelist()} />;
            }
        } else {
            return <Button label='Connect your wallet' onClick={() => connectWallet()} />;
        }
    };

    useEffect(() => {
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: 'rinkeby',
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
        }
    }, [walletConnected]);
    return (
        <>
            <Head>
                <title> Whitelist Dapp</title>
                <meta name='description' content='whitelits-Dapp' />
            </Head>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.heading}>
                    <h1>Welcome to Crypto Devs!</h1>
                    <p>
                        Its an NFT collection for devlopers in crypto. <br /> {numOfWhitelisted} have already joined Whitelist
                    </p>
                    {renderButton()}
                </div>
                <div className={styles.img}>
                    <img src='/crypto-devs.svg' alt='crypto devs' />
                </div>
            </main>
        </>
    );
}
