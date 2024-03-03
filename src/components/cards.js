import styles from "../app/app.module.css"

export const DocsCard = () => {
  return (
    <a
      href="https://docs.near.org/develop/integrate/quickstart-frontend"
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2>
        Near Docs <span>-&gt;</span>
      </h2>
      <p>Learn how this application works, and what you can build on Near.</p>
    </a>
  )
}

export const TKN1Card = () => {
  return (
    <a href="/tkn1-wallet" className={styles.card} rel="noopener noreferrer">
      <h2>
        TKN1 Wallet <span>-&gt;</span>
      </h2>
      <p>Interact with TKN1</p>
    </a>
  )
}

export const HelloComponentsCard = () => {
  return (
    <a
      href="/hello-components"
      className={styles.card}
      rel="noopener noreferrer"
    >
      <h2>
        Web3 Components <span>-&gt;</span>
      </h2>
      <p>See how Web3 components can help you to create multi-chain apps.</p>
    </a>
  )
}
