import 'dotenv/config';
import Web3 from "web3";

const {
    INSC_ADDRESS: addressToSend,
    INSC_DATA: dataToSend,
    RPC: rpc,
    FEE: feeToPay,
    PRIVATE_KEY: privateKey,
    REPEAT_COUNT: repeatCount,
    GAS_PRICE_GWEI: gasPriceEnv
} = process.env;

const web3 = new Web3(rpc);

const userWalletAccount = web3.eth.accounts.privateKeyToAccount(privateKey, true);

const tx = {
    to: addressToSend,
    from: userWalletAccount.address,
    data: dataToSend,
    value: web3.utils.toWei(feeToPay, 'ether')
};

try {
    const estimateGas = await web3.eth.estimateGas(tx);

    tx.gasLimit = web3.utils.toHex(String(Math.ceil(estimateGas * 1.5)));
    tx.gasPrice = web3.utils.toHex(web3.utils.toWei(gasPriceEnv, 'gwei'));

    console.log('tx Object');
    console.log(tx);
} catch (err) {
    console.log(err.toString());
}



for (let i = 0; i < parseInt(repeatCount); i++) {
    try {
        console.log(`Iteration: ${i+1}`);
        console.log(`Mint left: ${parseInt(repeatCount) - i}`);

        const signedTx = await userWalletAccount.signTransaction(tx);

        const {transactionHash} = signedTx;

        console.log(`Signed tx hash: ${transactionHash}`);
        console.log(`Explorer link: https://opbnbscan.com/tx/${transactionHash}`)
        console.log('Sending the transaction...');

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (err) {
        console.log(err.toString());
    }
}