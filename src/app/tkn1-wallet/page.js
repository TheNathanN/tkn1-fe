"use client"
import { DocsCard, HelloComponentsCard } from "@/components/cards"
import { useWallet } from "@/wallets/wallet-selector"
import { useState, useEffect } from "react"
import { TKN1Contract, NetworkId } from "../../config"
import styles from "../app.module.css"

// Contract that the app will interact with
const CONTRACT = TKN1Contract[NetworkId]

export default function HelloNear() {
  const { signedAccountId, viewMethod, callMethod } = useWallet()

  const [loggedIn, setLoggedIn] = useState(false)
  const [balance, setBalance] = useState("loading...")
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
        .then((balance) => setBalance(Number(balance)))
        .catch((e) => console.log(e))
  }, [viewMethod, loggedIn])

  const saveGreeting = async () => {
    setShowSpinner(true)
    await callMethod(CONTRACT, "set_greeting", { greeting })
    setShowSpinner(false)
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Interacting with the contract: &nbsp;
          <code className={styles.code}>{CONTRACT}</code>
        </p>
      </div>

      <div className={styles.center}>
        <h1 className="w-100">
          {" "}
          Your current balance of TKN1:{" "}
          <code className={styles.balance}>
            {balance.toLocaleString()}
          </code>{" "}
        </h1>
        <div className="w-100 text-end align-text-center" hidden={loggedIn}>
          <p className="m-0"> Please login</p>
        </div>
      </div>
      <div className={styles.grid}>
        <DocsCard />
        <HelloComponentsCard />
      </div>
    </main>
  )
}
