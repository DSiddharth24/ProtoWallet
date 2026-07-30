export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
  'recovery phrase': {
    term: 'Recovery Phrase',
    definition: 'A 12- or 24-word master backup for your wallet. Anyone who has it can access all your funds. Real services will never ask you to type it into a website.',
  },
  'seed phrase': {
    term: 'Seed Phrase',
    definition: 'Another name for your recovery phrase — the 12 or 24 words that back up your entire wallet.',
  },
  'private key': {
    term: 'Private Key',
    definition: 'A secret code that lets you authorize transactions. Your recovery phrase generates all your private keys. Never share it.',
  },
  'wallet address': {
    term: 'Wallet Address',
    definition: 'A public identifier (starts with 0x) you share so others can send you crypto. Think of it as a mailbox number — visible, but only you have the key to open it.',
  },
  'gas fee': {
    term: 'Gas Fee',
    definition: 'A fee paid to the people who process transactions on the network — not to the wallet app. Fees rise when the network is busy.',
  },
  'network fee': {
    term: 'Network Fee',
    definition: 'Same as a gas fee. It pays validators to verify and record your transaction on the blockchain.',
  },
  'slippage': {
    term: 'Slippage',
    definition: 'The difference between the price you expected for a swap and the price you actually get, caused by the market moving before your trade confirms.',
  },
  'smart contract': {
    term: 'Smart Contract',
    definition: 'A program on the blockchain that runs automatically when conditions are met — like a vending machine that executes a swap without needing a cashier.',
  },
  'blockchain': {
    term: 'Blockchain',
    definition: 'A shared public ledger that records every transaction. Once something is written to it, it can\'t be changed or deleted.',
  },
  'validator': {
    term: 'Validator',
    definition: 'A computer on the network that checks transactions are valid and adds them to the blockchain. Validators earn gas fees for this work.',
  },
  'ens': {
    term: 'ENS / Handle',
    definition: 'A human-readable name (like alex.proto) that maps to a long hex address, so you don\'t have to type 42 characters and risk a typo.',
  },
  'phishing': {
    term: 'Phishing',
    definition: 'A scam where someone pretends to be a real service to trick you into giving up your recovery phrase or signing a dangerous transaction.',
  },
  'approval scam': {
    term: 'Approval Scam',
    definition: 'A scam that tricks you into signing a transaction giving someone else permission to spend your tokens — often disguised as a "free airdrop" or "claim."',
  },
};
