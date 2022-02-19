import React from "react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {Button} from "../../input/Button";
import * as nearAPI from "near-api-js";
import styles from "../../home/SignInButton.scss";

const {connect, keyStores, WalletConnection} = nearAPI;
let wallet = null;
let near = null;
let walletConnected = false;
let nearAccount = "Wallet Connected";

async function connectNear() {
    const config = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    // connect to NEAR
    near = await connect(config)
    wallet = new WalletConnection(near);
    console.log('check wallet')
    if (wallet.isSignedIn()) {
        console.log('connected')
        walletConnected = true
        nearAccount = wallet.getAccountId()
    }
}

async function connectWallet() {
    wallet.requestSignIn(
        "learnverse.testnet", // contract requesting access
        "LearnVerse", // optional
        "https://mylearnverse.com/", // optional
        "https://mylearnverse.com/" // optional
    );
}

async function viewWallet() {
    window.location.href = "https://learnverse.space/#/wallet"
}

export function WalletButton({mobile}) {
    connectNear()
    return (
        <>
            {!walletConnected && (
                <Button className={mobile ? styles.mobileSignIn : styles.SignInButton} thick preset="signin"
                        onClick={connectWallet}>
                    <FormattedMessage id="wallet-connect-button" defaultMessage="Connect Wallet"/>
                </Button>
            )}
            {walletConnected && (
                <Button className={mobile ? styles.mobileSignIn : styles.SignInButton} onClick={viewWallet}>
                    {nearAccount}
                </Button>
            )}
        </>
    );
}

WalletButton.propTypes = {
    mobile: PropTypes.bool
};
