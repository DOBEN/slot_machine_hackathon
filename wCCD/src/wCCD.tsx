/* eslint-disable no-console */
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { toBuffer, AccountAddress } from '@concordium/web-sdk';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import * as leb from '@thi.ng/leb128';
import { wrap, reveal, unwrap, state, CONTRACT_NAME_PROXY, CONTRACT_NAME_IMPLEMENTATION, CONTRACT_NAME_STATE } from './utils';

import ArrowIcon from './assets/Arrow.svg';
import RefreshIcon from './assets/Refresh.svg';

/** If you want to test admin functions of the wCCD contract,
 * it will be necessary to instantiate your own wCCD contract using an account available in the browser wallet,
 * and change these constants to match the indexes of the instances.
 *
 * Should match the subindexes of the instances targeted.
 * V1 Module reference on testnet: 2975c0dded52f5f78118c42970785da9227e2bc8173af0b913599df8e3023818
 */
const WCCD_PROXY_INDEX = 866n;
const WCCD_IMPLEMENTATION_INDEX = 865n;
const WCCD_STATE_INDEX = 864n;

const CONTRACT_SUB_INDEX = 0n;

const blackCardStyle = {

    backgroundColor: 'transparent',
    color: 'white',
    width: '545px',
    borderRadius: 10,
    margin: '10px 0px 0px 0px',
    padding: '10px 18px 0px 18px',
    border: '0px solid #308274',
};

const ButtonStyle = {
    color: 'white',
    borderRadius: 10,
    margin: '7px 0px 7px 0px',
    padding: '10px',
    width: '100%',
    border: '1px solid #26685D',
    backgroundColor: '#308274',
    cursor: 'pointer',
    fontWeight: 300,
    fontSize: '14px',
};

const ButtonStyleDisabled = {
    color: 'white',
    borderRadius: 10,
    margin: '7px 0px 7px 0px',
    padding: '10px',
    width: '100%',
    border: '1px solid #308274',
    backgroundColor: '#979797',
    cursor: 'pointer',
    fontWeight: 300,
    fontSize: '14px',
};

const InputFieldStyle = {
    backgroundColor: '#181817',
    color: 'white',
    borderRadius: 10,
    width: '100%',
    border: '1px solid #308274',
    margin: '7px 0px 7px 0px',
    padding: '10px 20px',
};

async function updateStateWCCDBalanceAccount(account: string, setAmountAccount: (x: bigint) => void) {
    const accountAddressBytes = new AccountAddress(account).decodedAddress;

    let hexString = '';
    accountAddressBytes.forEach((byte) => {
        hexString += `0${(byte & 0xff).toString(16)}`.slice(-2); // eslint-disable-line no-bitwise
    });

    // Adding '00' because enum 0 (an `Account`) was selected instead of enum 1 (an `ContractAddress`).
    /*   const inputParams = toBuffer(`00${hexString}`, 'hex');
       const provider = await detectConcordiumProvider();
       const res = await provider.getJsonRpcClient().invokeContract({
           method: `${CONTRACT_NAME_STATE}.getBalance`,
           contract: { index: WCCD_STATE_INDEX, subindex: CONTRACT_SUB_INDEX },
           parameter: inputParams,
       });
       if (!res || res.tag === 'failure' || !res.returnValue) {
           throw new Error(`Expected succesful invocation`);
       }
   
       setAmountAccount(BigInt(leb.decodeULEB128(toBuffer(res.returnValue, 'hex'))[0]));*/
}

interface Props {
    handleGetAccount: (accountAddress: string | undefined) => void;
}

export default function wCCD({ handleGetAccount }: Props) {
    const { account, isConnected } = useContext(state);
    const [ownerProxy, setOwnerProxy] = useState<string>();
    const [ownerImplementation, setOwnerImplementation] = useState<string>();
    const [isActiveGame, setIsActiveGame] = useState<boolean>(false);
    const [hash, setHash] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [flipped, setflipped] = useState<boolean>(false);
    const [waitForUser, setWaitForUser] = useState<boolean>(false);
    const [amountAccount, setAmountAccount] = useState<bigint>(0n);
    const inputValue = useRef<HTMLInputElement>(null);

    useEffect(() => {
        /* if (isConnected) {
             // Get wCCD proxy contract owner.
             detectConcordiumProvider()
                 .then((provider) =>
                     provider
                         .getJsonRpcClient()
                         .getInstanceInfo({ index: WCCD_PROXY_INDEX, subindex: CONTRACT_SUB_INDEX })
                 )
                 .then((info) => {
                     if (info?.name !== `init_${CONTRACT_NAME_PROXY}`) {
                         // Check that we have the expected instance.
                         throw new Error(`Expected instance of proxy: ${info?.name}`);
                     }
 
                     setOwnerProxy(info.owner.address);
                 });
 
             // Get wCCD implementation contract owner.
             detectConcordiumProvider()
                 .then((provider) =>
                     provider
                         .getJsonRpcClient()
                         .getInstanceInfo({ index: WCCD_IMPLEMENTATION_INDEX, subindex: CONTRACT_SUB_INDEX })
                 )
                 .then((info) => {
                     if (info?.name !== `init_${CONTRACT_NAME_IMPLEMENTATION}`) {
                         // Check that we have the expected instance.
                         throw new Error(`Expected instance of implementation: ${info?.name}`);
                     }
 
                     setOwnerImplementation(info.owner.address);
                 });
         }
 
         if (isConnected) {
             if (account) {
                 updateStateWCCDBalanceAccount(account, setAmountAccount);
             }
         }*/
    }, [isConnected]);

    const handleOnClick = useCallback(() => {
        setWaitForUser(true);

        detectConcordiumProvider()
            .then((provider) => provider.connect())
            .then(handleGetAccount)
            .then(() => {
                setWaitForUser(false);
            })
            .catch(() => {
                setWaitForUser(false);
            });
    }, []);

    useEffect(() => {
        if (account) {
            updateStateWCCDBalanceAccount(account, setAmountAccount);
        }
    }, [account]);

    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div style={blackCardStyle}>
                <div>
                    {!isConnected && waitForUser && (
                        <button style={ButtonStyleDisabled} type="button" disabled>
                            Waiting for user
                        </button>
                    )}
                    {!isConnected && !waitForUser && (
                        <button style={ButtonStyle} type="button" onClick={handleOnClick}>
                            Connect Wallet
                        </button>
                    )}
                    {isConnected && (
                        <>
                            <div className="text">Connected to</div>
                            <button
                                className="link"
                                type="button"
                                onClick={() => {
                                    window.open(
                                        `https://testnet.ccdscan.io/?dcount=1&dentity=account&daddress=${account}`,
                                        '_blank',
                                        'noopener,noreferrer'
                                    );
                                }}
                            >
                                {account}{' '}
                            </button>
                        </>
                    )}
                </div>
                <div>Transaction status{hash === '' ? '' : ' (May take a moment to finalize)'}</div>
                {hash === '' && error !== '' && <div style={{ color: 'red' }}>Transaction rejected by wallet.</div>}
                {hash === '' && error === '' && <div className="loadingText">Waiting for transaction...</div>}
                {hash !== '' && (
                    <>
                        <button
                            className="link"
                            type="button"
                            onClick={() => {
                                window.open(
                                    `https://testnet.ccdscan.io/?dcount=1&dentity=transaction&dhash=${hash}`,
                                    '_blank',
                                    'noopener,noreferrer'
                                );
                            }}
                        >
                            {' '}
                            {hash}{' '}
                        </button>
                        <br />
                    </>
                )}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <label>
                    {waitForUser || !isConnected ? (
                        <button style={ButtonStyleDisabled} type="button" disabled>
                            Waiting for user
                        </button>
                    ) : (
                        <button
                            style={ButtonStyle}
                            type="button"
                            disabled={account === undefined}
                            onClick={() => {

                                // Amount needs to be in WEI
                                const amount = 1000000;

                                if (account) {
                                    if (!isActiveGame) {
                                        setIsActiveGame(!isActiveGame)
                                        setHash('');
                                        setError('');
                                        setWaitForUser(true);
                                        wrap(
                                            account,
                                            1081n, // slot machine contract
                                            setHash,
                                            setError,
                                            setWaitForUser,
                                            CONTRACT_SUB_INDEX,
                                            amount
                                        );
                                    }
                                    else {
                                        setHash('');
                                        setError('');
                                        setWaitForUser(true);
                                        reveal(
                                            account,
                                            1085n, // slot machine contract
                                            setHash,
                                            setError,
                                            setWaitForUser,
                                            CONTRACT_SUB_INDEX,
                                            amount
                                        );
                                    }
                                }
                            }}
                        >
                            {isActiveGame ? 'Reveal' : 'Play'}
                        </button>
                    )}
                </label>

            </div>

        </>
    );
}
