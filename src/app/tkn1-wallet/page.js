"use client"
import { DocsCard, HelloComponentsCard } from "@/components/cards"
import { useWallet } from "@/wallets/wallet-selector"
import { useState, useEffect } from "react"
import { TKN1Contract, NetworkId } from "../../config"
import styles from "../app.module.css"
import pageStyles from "./tkn1-wallet.module.css"

// Contract that the app will interact with
const CONTRACT = TKN1Contract[NetworkId]

const formatBalance = (balance) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 6,
  }).format(balance / 1000000)
}

const formatAmount = (amount) => {
  return amount * 1000000
}

export default function TKN1Wallett() {
  const { signedAccountId, viewMethod, callMethod } = useWallet()

  const [loggedIn, setLoggedIn] = useState(false)
  const [balance, setBalance] = useState("loading...")
  const [sendTo, setSendTo] = useState("")
  const [amount, setAmount] = useState("")
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    setBalance(0)
    setLoggedIn(!!signedAccountId)
  }, [signedAccountId])

  useEffect(() => {
    loggedIn &&
      viewMethod &&
      viewMethod(CONTRACT, "ft_balance_of", {
        account_id: signedAccountId,
      })
        .then((balance) => setBalance(balance))
        .catch((e) => console.log(e))
  }, [viewMethod, loggedIn])

  const sendTokens = async (e) => {
    e.preventDefault()
    setShowSpinner(true)
    await callMethod(
      CONTRACT,
      "ft_transfer",
      {
        receiver_id: sendTo,
        amount: formatAmount(amount).toString(),
        memo: "Sent from TKN1 Wallet App",
      },
      "30000000000000",
      "1"
    )
    setShowSpinner(false)
  }

  return (
    <main className={pageStyles.main}>
      <div className={pageStyles.wrapper}>
        <div className={styles.description}>
          <p>
            Interacting with the contract: &nbsp;
            <code className={styles.code}>{CONTRACT}</code>
          </p>
        </div>

        <div className={pageStyles.center}>
          <h1>
            Your current balance of TKN1:
            <code className={styles.balance}>{formatBalance(balance)}</code>
          </h1>
          <div className="text-end align-text-center" hidden={loggedIn}>
            <p className="m-0"> Please login</p>
          </div>

          <form onSubmit={sendTokens} className={pageStyles.form}>
            {loggedIn && (
              <>
                <h2>Send</h2>
                <div className={pageStyles.inputs}>
                  <label htmlFor="address">Address to send to</label>
                  <input
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    type="text"
                    name="address"
                    id="address"
                    required
                  />
                </div>
                <div className={pageStyles.inputs}>
                  <label htmlFor="amount">Amount to send</label>
                  <input
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                    }}
                    type="number"
                    name="amount"
                    id="amount"
                    required
                  />
                </div>
                <button className={pageStyles.button} type="submit">
                  Send
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <div className={styles.grid}>
        <DocsCard />
        <HelloComponentsCard />
      </div>
    </main>
  )
}
