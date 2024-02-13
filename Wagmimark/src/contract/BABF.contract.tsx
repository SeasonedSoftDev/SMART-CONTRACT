import Web3 from 'web3';
import { ethers } from 'ethers';
import BABF_abi from './BABF_1.abi.json';
import { getBigNumber } from '../lib/helper';
import { AbiItem, numberToHex, toWei } from 'web3-utils';
import { useState } from 'react';

const Win:any = window;

const web3js = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/83dc80d8a0ea430a86135e955f7bfdba'));
const tokenAddress = process.env.REACT_APP_TEST_TOKEN_1;
const walletAddress = process.env.REACT_APP_WALLET_1;
const privateKey = process.env.REACT_APP_WALLET_1_PRIVATEKEY;
const gasPrice = 100000;

async function getBABFBalance() {
    try {
        const token = new web3js.eth.Contract(BABF_abi as AbiItem[], tokenAddress); 
        const babfBalance = await token.methods.balanceOf(walletAddress).call();
        return babfBalance;
    } catch(error: any) {
        console.log(error);
    }
    return 0;
}

async function getBalance() {
    try {
        const balance = web3js.eth.getBalance(String(walletAddress));
        console.log(balance);
        return balance;
    } catch(error: any) {
        console.log(error);
    }
}

async function mintTokens(count: any, amount: any, gasFee: any) {
    try {
        const balance = await getBalance();
        console.log(`Your balance is ${balance}`);
        if (count <= 0) {
            console.log('You have to mint at lease one NFT.');
            return false;
        }
    
        const token = new web3js.eth.Contract(BABF_abi as AbiItem[], tokenAddress);
        web3js.eth.accounts.wallet.add(String(privateKey));
        const networkId = await web3js.eth.net.getId();
        const tx = token.methods.mintTokens(count);

        const data = tx.encodeABI();
        const signedTx = await web3js.eth.accounts.signTransaction({
            from: walletAddress,
            to: tokenAddress,
            value: toWei("0.1", "ether"),
            data,
            gasPrice: toWei("5", "gwei"),
            gas: 300000,
            chainId: networkId
        }, String(privateKey));
        console.log('sendSignedTransaction');
        console.log(String(signedTx.rawTransaction));
        // const receipt = await web3js.eth.sendSignedTransaction(String(signedTx.rawTransaction));
        web3js.eth.sendSignedTransaction(String(signedTx.rawTransaction))
        .once('transactionHash', function(hash){ 
            console.log(`hash is ${hash}`);
         })
        .once('receipt', function(receipt){
            console.log(`receipt is ${receipt}`);
         })
        .on('confirmation', function(confNumber, receipt){ 
            console.log(`confirmation is ${confNumber}`);
         })
        .on('error', function(error){ 
            console.log(`error occupied : ${error}`);
         })
        .then(function(receipt){
            // will be fired once the receipt is mined
            console.log(receipt);
        });
        
    } catch(error: any) {
        console.log(error);
        return false;
    }
    return true;
}

export default mintTokens;