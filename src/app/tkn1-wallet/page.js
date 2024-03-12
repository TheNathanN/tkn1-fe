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
  const [amountMinted, setAmountMinted] = useState(0)

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

  const isRegistered = async (reciever) => {
    return await viewMethod(CONTRACT, "ft_balance_of", {
      account_id: reciever,
    })
  }

  const register = async (reciever) => {
    return await callMethod(
      CONTRACT,
      "storage_deposit",
      {
        account_id: reciever,
        registration_only: true,
      },
      "30000000000000",
      "250000000000000000000000"
    )
  }

  const sendTokens = async (e) => {
    e.preventDefault()
    setShowSpinner(true)
    try {
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
    } catch (e) {
      console.error("Failed to send tokens")
      console.error(e)
    }
    setShowSpinner(false)
  }

  const claimTokens = async (e) => {
    e.preventDefault()
    setShowSpinner(true)
    try {
      await callMethod(CONTRACT, "ft_mint", {})
    } catch (e) {
      console.error("Failed to mint tokens")
      console.error(e)
    }
    setShowSpinner(false)
  }

  const getLastMinted = async () => {
    return await viewMethod(CONTRACT, "ft_last_minted", {
      account_id: signedAccountId,
    })
  }

  const getCurrentTimeInNanos = () => {
    const date = new Date()
    const millisecondsSinceEpoch = date.getTime()
    return Math.floor(millisecondsSinceEpoch * 1_000_000)
  }

  const getMaxTime = async () => {
    return await viewMethod(CONTRACT, "ft_get_max_hours", {
      account_id: signedAccountId,
    })
  }

  useEffect(() => {
    if (loggedIn) {
      const interval = setInterval(() => {
        const baseMint = 10000
        const hourInNanos = 3_600_000_000_000
        getLastMinted().then((lastMinted) => {
          getMaxTime().then((maxTime) => {
            const currentTimeInNanos = getCurrentTimeInNanos()
            const timeSinceLastMint = currentTimeInNanos - lastMinted
            const amountToMint =
              (Math.min(timeSinceLastMint / hourInNanos, maxTime) * baseMint) /
              1_000_000
            setAmountMinted(amountToMint)
          })
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [loggedIn])

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

          <section>
            <h2>Claim</h2>
            <p>
              Claim {amountMinted.toFixed(6)}{" "}
              <span className={pageStyles.highlight}>TKN1 tokens!</span>
            </p>
            <button
              onClick={claimTokens}
              disabled={amountMinted < 0.001}
              className={""}
            >
              Claim Tokens
            </button>
          </section>
        </div>
      </div>

      <div className={styles.grid}>
        <DocsCard />
        <HelloComponentsCard />
      </div>
    </main>
  )
}
