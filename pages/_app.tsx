import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { formatEther } from '@ethersproject/units'

import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import Web3 from 'web3'
import '../styles.css'

function getLibrary(provider: any): Web3 {
  const library = new Web3(provider)
  return library
}

function ChainId() {
  const { chainId } = useWeb3React()

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{Number.isInteger(chainId) ? chainId : ''}</span>
    </>
  )
}

function BlockNumber() {
  const { chainId, library } = useWeb3React<Web3>()

  const [blockNumber, setBlockNumber] = React.useState()
  React.useEffect((): any => {
    if (!!library) {
      let stale = false

      library.eth
        .getBlockNumber()
        .then((blockNumber: number) => {
          if (!stale) {
            setBlockNumber(blockNumber)
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null)
          }
        })

      const updateBlockNumber = (blockNumber: number) => {
        setBlockNumber(blockNumber)
      }
      const subscription = library.eth
        .subscribe('newBlockHeaders')
        .on('data', ({ number }) => updateBlockNumber(number))

      return () => {
        stale = true
        subscription.unsubscribe(function(error, success) {
          if (success) console.log('Successfully unsubscribed!')
        })
        setBlockNumber(undefined)
      }
    }
  }, [library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>
        {Number.isInteger(blockNumber)
          ? blockNumber.toLocaleString()
          : blockNumber === null
          ? 'Error'
          : !!library
          ? '...'
          : ''}
      </span>
    </>
  )
}

function Account() {
  const { account } = useWeb3React()

  return (
    <>
      <span>Account</span>
      <span role="img" aria-label="robot">
        🤖
      </span>
      <span>
        {account === undefined
          ? ''
          : account === null
          ? '-'
          : `${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
      </span>
    </>
  )
}

function Balance() {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = React.useState()
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false

      library.eth
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>
        {!!balance
          ? `Ξ${parseFloat(formatEther(balance)).toPrecision(4)}`
          : balance === null
          ? 'Error'
          : account === null
          ? '-'
          : !!account && !!library
          ? '...'
          : ''}
      </span>
    </>
  )
}

function Header() {
  const { active, error } = useWeb3React()
  const router = useRouter()

  const goTo = route => () => {
    router.push(route)
  }

  return (
    <>
      <button onClick={goTo('/')}>Home</button>
      <button onClick={goTo('/nfc')}>NFC</button>
      <h1 style={{ margin: '1rem', textAlign: 'right' }}>{active ? '🟢' : error ? '🔴' : '🟠'}</h1>
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr min-content 1fr',
          maxWidth: '20rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
        <ChainId />
        <BlockNumber />
        <Account />
        <Balance />
      </h3>
    </>
  )
}

export default class Root extends App {
  render() {
    const { Component } = this.props

    return (
      <>
        <Head>
          <title>web3-react example</title>
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Header />
          <Component />
        </Web3ReactProvider>
      </>
    )
  }
}
