"use client";

import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useState } from "react";
import { HDNodeWallet } from "ethers";
import * as bip from "bip39";

function createWallets(seed, n) {

    const wallets = [];

    for(let i = 0; i < n; i++) {

        const path = `m/44'/501'/${i}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        wallets.push(Keypair.fromSecretKey(secret).publicKey.toBase58());

    }

    return wallets;
}

export const GenerateMnemonics = () => {
    const [wallets, setWallet] = useState([]);
    const [mnemonic, setMnemonic] = useState("");
    const [seed, setSeed] = useState();
    const [isEmpty, setIsEmpty] = useState(false);

    function onClickAddress() {
        if (seed) {
            setWallet(createWallets(seed, 3));
        } else {
            setIsEmpty(true)
        }
    }

    function showAlert() {
        return <div className="max-w-2xl mx-auto"><div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">Alert!</span> Mnemonics have not been generated!
            </div>
        </div>
    }

    async function copyToClipboard(text) {
        try{
            await navigator.clipboard.writeText(text);
        } catch(err) {
            console.log("Failed to copy");
        }
    }

    function onClickMnemonics() {
        setMnemonic(generateMnemonic());
        setSeed(mnemonicToSeedSync(mnemonic));
        setIsEmpty(false);
    }

    return <div className="flex min-h-full flex-col justify-center px-12 py-24">
        <div className="max-w-2xl mx-auto">
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Generate Mnemonics</label>
                <button onClick={onClickMnemonics} className="bg-gray-50 border border-gray-300 text-gray-900 text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">{mnemonic ? mnemonic : "pave nature matter cat east basket firm dismiss silk final scissors enhance"}</button>
            </div>
            
        </div>
        {seed ? "": <div className="max-w-2xl mx-auto"><div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <span className="font-medium">Alert!</span> Generate the mnemonics before generating the addresses.
        </div></div>}
        <div className="max-w-2xl mx-auto">
            <button onClick={onClickAddress} className="mb-5 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <svg className="w-4 h-4 me-2 -ms-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                Generate addresses!
            </button>
        </div>
        {isEmpty ? showAlert() : ""}
        {wallets.map((wallet, i) => <button className="max-w-lg mx-auto mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" key={i}>0x{wallet}</button>)}
    </div>
}
