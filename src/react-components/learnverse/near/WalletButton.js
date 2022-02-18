import React from "react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {Button} from "../../input/Button";
import * as nearAPI from "near-api-js";

async function connectWallet() {
    const {connect, keyStores, WalletConnection} = nearAPI;
    const config = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };

    // connect to NEAR
    const near = await connect(config)
    // create wallet connection
    const wallet = new WalletConnection(near);
    console.log('check wallet')
    console.log(wallet.isSignedIn())
    if (wallet.isSignedIn()) {
        this.connected = true
        console.log('connected')
    }
    const signIn = () => {
        wallet.requestSignIn(
            "learnverse.testnet", // contract requesting access
            "LearnVerse", // optional
            "https://mylearnverse.com/", // optional
            "https://mylearnverse.com/" // optional
        );
    };
    signIn();
}

export function WalletButton({mobile}) {
    return (
        <Button thick preset="signin" onClick={connectWallet}>
            <FormattedMessage id="sign-in-button" defaultMessage="Connect Wallet"/>
        </Button>
    );
}

WalletButton.propTypes = {
    mobile: PropTypes.bool
};
