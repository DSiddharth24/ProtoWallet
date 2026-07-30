import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { GLOSSARY } from '../utils/glossary';
import { GlossaryTooltip } from '../components/GlossaryTooltip';
import {
  Search,
  Award,
  Lock,
  Book,
  Wallet,
  Key,
  ArrowLeftRight,
  Coins,
  Layers,
  CheckCircle2,
  ShieldAlert,
  Target,
  AlertTriangle,
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

interface LessonContent {
  id: string;
  track: 'Foundations' | 'Transfers & Fees' | 'DeFi & Security';
  title: string;
  badgeName: string;
  badgeLabel: string;
  readTime: string;
  icon: React.ReactNode;
  body: React.ReactNode;
  quiz: QuizQuestion[];
}

const LESSONS: LessonContent[] = [
  {
    id: 'lesson-01',
    track: 'Foundations',
    title: 'What is a wallet?',
    badgeName: 'badge-lesson-01',
    badgeLabel: 'Wallet Basics Badge',
    readTime: '2 min read',
    icon: <Wallet className="w-4 h-4" />,
    body: (
      <div className="space-y-4">
        <p>
          A <GlossaryTooltip termKey="wallet address">crypto wallet</GlossaryTooltip> doesn't store digital coins inside your phone.
        </p>
        <div className="bg-[#0E9C8C]/10 border border-[#0E9C8C]/20 p-3.5 rounded-card text-xs leading-relaxed">
          <strong>Key Insight:</strong> Think of a wallet as a digital keychain holding private keys to your accounts on the public blockchain ledger. The tokens live on the ledger; your keys prove ownership.
        </div>
        <p>
          The <GlossaryTooltip termKey="blockchain">blockchain</GlossaryTooltip> is a shared ledger recording ownership. Your wallet holds your <GlossaryTooltip termKey="private key">private key</GlossaryTooltip>, which authorizes transaction signatures.
        </p>
        <p>
          Deleting your wallet app never deletes your funds! You can restore access on any device using your <GlossaryTooltip termKey="recovery phrase">recovery phrase</GlossaryTooltip>.
        </p>
      </div>
    ),
    quiz: [
      {
        question: 'What does a crypto wallet store inside it?',
        options: [
          'Digital coins',
          'Your private keys that authorize transactions',
          'A copy of the entire internet'
        ],
        answerIndex: 1
      },
      {
        question: 'If you delete your wallet app from your phone, what happens to your crypto?',
        options: [
          'It is permanently deleted',
          'It stays safe on the blockchain, recoverable with your phrase',
          'It gets sent to the developer'
        ],
        answerIndex: 1
      },
      {
        question: 'What is your public wallet address similar to?',
        options: [
          'A mailbox number (public, so people can send you things)',
          'Your ATM PIN',
          'A credit card security code'
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: 'lesson-02',
    track: 'Foundations',
    title: 'Recovery Phrases & Why They\'re Secret',
    badgeName: 'badge-lesson-02',
    badgeLabel: 'Key Keeper Badge',
    readTime: '2 min read',
    icon: <Key className="w-4 h-4" />,
    body: (
      <div className="space-y-4">
        <p>
          When you set up a wallet, it generates a 12- or 24-word <GlossaryTooltip termKey="recovery phrase">recovery phrase</GlossaryTooltip>. This is the master key to all your accounts.
        </p>
        <div className="bg-loss-red/10 border border-loss-red/20 text-xs p-3.5 rounded-card leading-relaxed text-graphite dark:text-paper">
          <strong className="text-loss-red block mb-1">THE GOLDEN RULE</strong>
          Real wallets only ask for your recovery phrase offline during account backups. Real support staff and websites will <strong>NEVER</strong> ask for it online. Anyone asking for your phrase is a scammer.
        </div>
        <p>
          Write your phrase down on paper and keep it in a safe place offline. Avoid taking screenshots or storing it in unencrypted cloud notes.
        </p>
      </div>
    ),
    quiz: [
      {
        question: 'When should you type your recovery phrase into a website?',
        options: [
          'Whenever support asks for it',
          'Never. Real services will never ask for it online',
          'To speed up a pending transaction'
        ],
        answerIndex: 1
      },
      {
        question: 'Why is keeping a recovery phrase in a screenshot risky?',
        options: [
          'Screenshots degrade over time',
          'If your cloud storage is compromised, hackers can steal your keys',
          'Screenshots use too much storage space'
        ],
        answerIndex: 1
      },
      {
        question: 'What happens if someone gets your recovery phrase?',
        options: [
          'They can view your balance only',
          'They can take all your tokens immediately',
          'They get sent a warning email'
        ],
        answerIndex: 1
      }
    ]
  },
  {
    id: 'lesson-03',
    track: 'Transfers & Fees',
    title: 'Sending & Receiving',
    badgeName: 'badge-lesson-03',
    badgeLabel: 'Navigator Badge',
    readTime: '2 min read',
    icon: <ArrowLeftRight className="w-4 h-4" />,
    body: (
      <div className="space-y-4">
        <p>
          To send crypto, you need the recipient's public <GlossaryTooltip termKey="wallet address">wallet address</GlossaryTooltip> and amount.
        </p>
        <p>
          Addresses are 42-character hex strings starting with 0x. To avoid typos, people use <GlossaryTooltip termKey="ens">ENS handles</GlossaryTooltip> (like alex.proto) that map readable names to the hex code.
        </p>
        <div className="bg-gain-green/10 border border-gain-green/20 p-3.5 rounded-card text-xs leading-relaxed">
          <strong>Remember:</strong> Blockchain transactions are permanent. Always verify recipient details on your pre-send checklist before confirming.
        </div>
      </div>
    ),
    quiz: [
      {
        question: 'What happens if you send crypto to the wrong address?',
        options: [
          'Support will refund you',
          'The transaction is final and irreversible',
          'It bounces back automatically'
        ],
        answerIndex: 1
      },
      {
        question: 'What does an ENS handle (like alex.proto) do?',
        options: [
          'Maps a readable name to a 42-character hex address',
          'Hides your transactions',
          'Lowers your gas fees'
        ],
        answerIndex: 0
      },
      {
        question: 'Why should you check recipient handles before sending?',
        options: [
          'Because blockchain sends cannot be reversed once confirmed',
          'To get extra reward points',
          'Because network nodes require it'
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: 'lesson-04',
    track: 'Transfers & Fees',
    title: 'Gas & Network Fees',
    badgeName: 'badge-lesson-04',
    badgeLabel: 'Dispatcher Badge',
    readTime: '2 min read',
    icon: <Coins className="w-4 h-4" />,
    body: (
      <div className="space-y-4">
        <p>
          Every blockchain transaction requires computing power to process. The fee paid to network <GlossaryTooltip termKey="validator">validators</GlossaryTooltip> is called a <GlossaryTooltip termKey="gas fee">gas fee</GlossaryTooltip>.
        </p>
        <p>
          Gas fees are paid in the network's native token (like ETH for Ethereum or MATIC for Polygon). If you have no native gas token, you cannot send transactions!
        </p>
        <div className="bg-proto-teal/10 border border-proto-teal/20 p-3.5 rounded-card text-xs leading-relaxed">
          Gas prices rise when the network is busy. Higher gas fees prioritize your transaction in the validator queue.
        </div>
      </div>
    ),
    quiz: [
      {
        question: 'Who receives the gas fee you pay?',
        options: [
          'The wallet app developer',
          'Network validators who process and secure transactions',
          'The government'
        ],
        answerIndex: 1
      },
      {
        question: 'What happens if you hold USDC but zero ETH on Ethereum?',
        options: [
          'You cannot send transactions because you have no gas fuel',
          'USDC converts automatically',
          'Transactions are free'
        ],
        answerIndex: 0
      },
      {
        question: 'Why do gas fees fluctuate?',
        options: [
          'Real-world gas prices',
          'Network traffic and demand for block space',
          'App subscription rates'
        ],
        answerIndex: 1
      }
    ]
  },
  {
    id: 'lesson-05',
    track: 'DeFi & Security',
    title: 'Swaps & DeFi Basics',
    badgeName: 'badge-lesson-05',
    badgeLabel: 'DeFi Copilot Badge',
    readTime: '2 min read',
    icon: <Layers className="w-4 h-4" />,
    body: (
      <div className="space-y-4">
        <p>
          In decentralized finance (DeFi), you swap tokens directly using <GlossaryTooltip termKey="smart contract">Smart Contracts</GlossaryTooltip> — self-executing programs on the blockchain.
        </p>
        <p>
          Swaps use <GlossaryTooltip termKey="slippage">slippage tolerance</GlossaryTooltip> to set the maximum price change allowed before your trade executes. If the price moves too much, the smart contract automatically aborts the swap to protect you.
        </p>
      </div>
    ),
    quiz: [
      {
        question: 'What executes swaps on a decentralized exchange?',
        options: [
          'Automated Smart Contracts',
          'Human brokers',
          'Bank cashiers'
        ],
        answerIndex: 0
      },
      {
        question: 'What is slippage tolerance?',
        options: [
          'Maximum allowed price movement during a swap',
          'Transaction speed setting',
          'Wallet password length'
        ],
        answerIndex: 0
      },
      {
        question: 'If a swap aborts due to excessive slippage, what happens?',
        options: [
          'Your input tokens are returned safely',
          'Tokens are destroyed',
          'You get locked out of your wallet'
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: 'lesson-06',
    track: 'DeFi & Security',
    title: 'Spotting Scams & Phishing',
    badgeName: 'badge-lesson-06',
    badgeLabel: 'Safety Officer Badge',
    readTime: '3 min read',
    icon: <ShieldAlert className="w-4 h-4 text-loss-red" />,
    body: (
      <div className="space-y-4">
        <p>
          Because blockchain transactions are permanent, scammers target beginners with phishing tricks:
        </p>
        <ul className="list-disc pl-4 space-y-2 text-xs">
          <li><strong>Fake Support DMs:</strong> Scammers posing as support asking for your recovery phrase.</li>
          <li><strong>Fake Forms:</strong> Websites asking you to "sync" or "verify" your wallet by typing your phrase.</li>
          <li><strong>Approval Scams:</strong> Malicious signatures that grant permission to withdraw your tokens.</li>
        </ul>
        <div className="bg-loss-red/10 border border-loss-red/20 p-3.5 rounded-card text-xs leading-relaxed text-graphite dark:text-paper">
          <strong>Safety Rule:</strong> Never click unverified links, never enter your recovery phrase online, and bookmark official dApp URLs.
        </div>
      </div>
    ),
    quiz: [
      {
        question: 'Someone DMs you offering "support" or a "free airdrop" if you enter your phrase. What do you do?',
        options: [
          'Enter your phrase',
          'Block them — it is a phishing scam to steal your funds',
          'Ask for their ID'
        ],
        answerIndex: 1
      },
      {
        question: 'What is an approval scam?',
        options: [
          'Tricking you into signing permission for a scammer to spend your tokens',
          'Stealing your phone',
          'Sending you fake emails'
        ],
        answerIndex: 0
      },
      {
        question: 'How do you safely visit dApps?',
        options: [
          'Click links in DMs',
          'Use bookmarked official URLs and verify domain names',
          'Click Google ad links'
        ],
        answerIndex: 1
      }
    ]
  }
];

const SCENARIOS = [
  {
    id: 'scen-1',
    title: 'Telegram DM from "Customer Care"',
    description: 'An account named "Wallet Support #902" DMs you saying your wallet is un-synchronized and will be locked in 1 hour unless you verify your 12-word recovery phrase on sync-wallet-fix.com.',
    isScam: true,
    explanation: 'Scam! Real support will NEVER DM you first or ask for your recovery phrase online.',
  },
  {
    id: 'scen-2',
    title: 'Uniswap Swap Approval Prompt',
    description: 'You are swapping pETH for pUSDC on official uniswap.org. The app prompts for permission to spend pETH with gas fee of 0.0008 ETH.',
    isScam: false,
    explanation: 'Legitimate transaction. Standard ERC-20 token approval on a verified dApp domain.',
  },
  {
    id: 'scen-3',
    title: 'Google Search Ad for "Metamask Download"',
    description: 'The top Google sponsored result for "Metamask" leads to metamask-wallet-secure-app.net asking you to import your 12 words to download the update.',
    isScam: true,
    explanation: 'Phishing scam! Scammers buy search ads pointing to cloned domain names.',
  },
];

export const Learn: React.FC = () => {
  const { lessons, badges, completeLesson } = useWalletStore();

  const [activeTab, setActiveTab] = useState<'tracks' | 'scenarios' | 'glossary'>('tracks');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const [quizState, setQuizState] = useState<'reading' | 'quiz' | 'passed' | 'failed'>('reading');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioAnswered, setScenarioAnswered] = useState<boolean | null>(null);

  const [glossarySearch, setGlossarySearch] = useState('');

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId);

  const startLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setQuizState('reading');
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
  };

  const handleStartQuiz = () => {
    setQuizState('quiz');
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
  };

  const handleSelectOption = (optIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [currentQuestionIdx]: optIndex }));
  };

  const handleNextQuestion = () => {
    if (!activeLesson) return;
    if (currentQuestionIdx < activeLesson.quiz.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      const correctCount = activeLesson.quiz.filter(
        (q, idx) => quizAnswers[idx] === q.answerIndex
      ).length;

      if (correctCount === activeLesson.quiz.length) {
        completeLesson(activeLesson.id, correctCount);
        setQuizState('passed');
      } else {
        setQuizState('failed');
      }
    }
  };

  const filteredGlossary = Object.values(GLOSSARY).filter(
    (item) =>
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const tracks = ['Foundations', 'Transfers & Fees', 'DeFi & Security'] as const;

  return (
    <div className="max-w-4xl w-full flex flex-col items-center select-none bg-transparent">
      {/* Top Header & Navigation Tabs */}
      {activeLessonId === null && (
        <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm mb-6 text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-xs font-data font-bold uppercase tracking-wider mb-2">
                <Target className="w-3.5 h-3.5" />
                Crypto Academy Hub
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-graphite dark:text-paper">
                Interactive Learning Hub
              </h1>
            </div>

            {/* Hub Navigation Tabs */}
            <div className="flex gap-1.5 bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn p-1">
              <button
                onClick={() => setActiveTab('tracks')}
                className={`px-3 py-2 rounded-btn font-body text-xs font-bold uppercase transition-colors focus-ring ${
                  activeTab === 'tracks'
                    ? 'bg-[#A855F7] text-white shadow-sm'
                    : 'text-graphite/70 dark:text-paper/70 hover:text-graphite dark:hover:text-paper'
                }`}
              >
                Learning Tracks
              </button>
              <button
                onClick={() => setActiveTab('scenarios')}
                className={`px-3 py-2 rounded-btn font-body text-xs font-bold uppercase transition-colors focus-ring ${
                  activeTab === 'scenarios'
                    ? 'bg-[#A855F7] text-white shadow-sm'
                    : 'text-graphite/70 dark:text-paper/70 hover:text-graphite dark:hover:text-paper'
                }`}
              >
                Fraud Simulator
              </button>
              <button
                onClick={() => setActiveTab('glossary')}
                className={`px-3 py-2 rounded-btn font-body text-xs font-bold uppercase transition-colors focus-ring ${
                  activeTab === 'glossary'
                    ? 'bg-[#A855F7] text-white shadow-sm'
                    : 'text-graphite/70 dark:text-paper/70 hover:text-graphite dark:hover:text-paper'
                }`}
              >
                Glossary Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: LEARNING TRACKS HUB (Fully Transparent Glassmorphism) */}
      {activeLessonId === null && activeTab === 'tracks' && (
        <div className="w-full space-y-6">
          {tracks.map((trackName) => {
            const trackLessons = LESSONS.filter((l) => l.track === trackName);
            const completedCount = trackLessons.filter((l) =>
              lessons.find((ul) => ul.id === l.id && ul.completed)
            ).length;

            const progressPct = Math.round((completedCount / trackLessons.length) * 100);

            return (
              <div
                key={trackName}
                className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 backdrop-blur-sm shadow-sm space-y-4 text-left"
              >
                {/* Track Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-graphite/10 dark:border-paper/10 pb-3">
                  <div>
                    <span className="font-data text-[10px] text-[#A855F7] font-bold uppercase tracking-wider">
                      Core Curriculum Track
                    </span>
                    <h3 className="font-display text-lg font-bold text-graphite dark:text-paper mt-0.5">
                      {trackName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-data text-xs font-bold text-graphite dark:text-paper block">
                        {completedCount}/{trackLessons.length} Completed
                      </span>
                      <span className="font-body text-[10px] text-graphite/50 dark:text-paper/50">
                        {progressPct}% Progress
                      </span>
                    </div>
                    <div className="w-16 h-2 rounded-full bg-graphite/20 dark:bg-paper/20 overflow-hidden">
                      <div
                        className="h-full bg-[#A855F7] rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lesson Cards inside Track */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trackLessons.map((les) => {
                    const userLesson = lessons.find((l) => l.id === les.id);
                    const isCompleted = userLesson?.completed || false;
                    const isBadgeUnlocked = badges.includes(les.badgeName);

                    return (
                      <div
                        key={les.id}
                        onClick={() => startLesson(les.id)}
                        className={`group border rounded-card p-4 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-sm ${
                          isCompleted
                            ? 'bg-proto-teal/10 border-proto-teal/40 hover:border-proto-teal'
                            : les.id === 'lesson-06'
                            ? 'bg-loss-red/10 border-loss-red/40 hover:border-loss-red'
                            : 'bg-transparent border-graphite/15 dark:border-paper/15 hover:border-[#A855F7]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full border flex items-center justify-center font-data text-xs font-bold flex-shrink-0 transition-transform group-hover:scale-105 ${
                              isCompleted
                                ? 'bg-proto-teal border-proto-teal text-white'
                                : les.id === 'lesson-06'
                                ? 'bg-loss-red/15 border-loss-red/40 text-loss-red'
                                : 'bg-transparent border-graphite/20 dark:border-paper/20 text-graphite dark:text-paper'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : les.icon}
                          </div>

                          <div>
                            <h4 className="font-body text-xs font-bold text-graphite dark:text-paper group-hover:text-[#A855F7] transition-colors leading-snug">
                              {les.title}
                            </h4>
                            <span className="font-data text-[10px] text-graphite/60 dark:text-paper/50">
                              {les.readTime} • {isCompleted ? 'Passed' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        {isBadgeUnlocked ? (
                          <span className="p-1.5 rounded-full bg-[#A855F7]/20 text-[#A855F7]" title={les.badgeLabel}>
                            <Award className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="text-graphite/20 dark:text-paper/20">
                            <Lock className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: INTERACTIVE FRAUD SIMULATOR */}
      {activeLessonId === null && activeTab === 'scenarios' && (
        <div className="w-full space-y-6 text-left">
          <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-graphite/10 dark:border-paper/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-loss-red/15 text-loss-red">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <h3 className="font-display font-bold text-base text-graphite dark:text-paper">
                  Fraud & Scam Simulator
                </h3>
              </div>
              <span className="font-data text-xs font-bold text-[#A855F7]">
                Scenario {scenarioIndex + 1} of {SCENARIOS.length}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-graphite dark:text-paper">
                {SCENARIOS[scenarioIndex].title}
              </h4>
              <p className="font-body text-xs text-graphite/80 dark:text-paper/85 leading-relaxed bg-transparent p-4 rounded-card border border-graphite/15 dark:border-paper/15">
                "{SCENARIOS[scenarioIndex].description}"
              </p>
            </div>

            {scenarioAnswered === null ? (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setScenarioAnswered(true)}
                  className="flex-grow py-3 bg-loss-red text-white font-body font-bold text-xs uppercase tracking-wider rounded-btn hover:bg-opacity-90 transition-all focus-ring shadow"
                >
                  Flag as SCAM
                </button>
                <button
                  onClick={() => setScenarioAnswered(false)}
                  className="flex-grow py-3 bg-gain-green text-white font-body font-bold text-xs uppercase tracking-wider rounded-btn hover:bg-opacity-90 transition-all focus-ring shadow"
                >
                  Legitimate Tx
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div
                  className={`p-4 rounded-card border text-xs font-body leading-relaxed ${
                    scenarioAnswered === SCENARIOS[scenarioIndex].isScam
                      ? 'bg-gain-green/15 border-gain-green/30 text-gain-green font-bold'
                      : 'bg-loss-red/15 border-loss-red/30 text-loss-red font-bold'
                  }`}
                >
                  {scenarioAnswered === SCENARIOS[scenarioIndex].isScam ? '✔ Correct Call!' : '✖ Incorrect Call!'}
                  <p className="font-normal mt-1 text-graphite dark:text-paper">
                    {SCENARIOS[scenarioIndex].explanation}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setScenarioAnswered(null);
                    setScenarioIndex((scenarioIndex + 1) % SCENARIOS.length);
                  }}
                  className="w-full py-3 bg-[#A855F7] text-white font-body font-bold text-xs uppercase tracking-wider rounded-btn hover:bg-opacity-90 transition-all focus-ring"
                >
                  Next Scenario
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GLOSSARY HUB */}
      {activeLessonId === null && activeTab === 'glossary' && (
        <div className="w-full space-y-4 text-left">
          <div className="relative">
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Search crypto terms (e.g. gas, phrase, slippage...)"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn text-xs font-body text-graphite dark:text-paper focus-ring"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/40 dark:text-paper/40">
              <Search className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {filteredGlossary.map((item) => (
              <div
                key={item.term}
                className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-4 space-y-1.5 backdrop-blur-sm shadow-sm"
              >
                <h4 className="font-display text-xs font-bold text-[#A855F7] uppercase tracking-wider">
                  {item.term}
                </h4>
                <p className="font-body text-xs text-graphite/80 dark:text-paper/85 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE LESSON READER & QUIZ ENGINE */}
      {activeLessonId !== null && activeLesson && (
        <div className="max-w-2xl w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-xl text-left space-y-5">
          <div className="flex justify-between items-center border-b border-graphite/10 dark:border-paper/10 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${activeLesson.id === 'lesson-06' ? 'bg-loss-red/15 text-loss-red' : 'bg-[#A855F7]/15 text-[#A855F7]'}`}>
                {activeLesson.icon}
              </div>
              <div>
                <span className="font-data text-[9px] uppercase font-bold tracking-wider text-[#A855F7] block">
                  {activeLesson.track} • Lesson Guide
                </span>
                <h2 className="font-display text-xl font-bold text-graphite dark:text-paper mt-0.5">
                  {activeLesson.title}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setActiveLessonId(null)}
              className="font-body text-[10px] uppercase font-bold text-graphite/60 dark:text-paper/60 border border-graphite/10 dark:border-paper/10 rounded px-3 py-1.5 hover:bg-graphite/5 dark:hover:bg-paper/5"
            >
              Exit Lesson
            </button>
          </div>

          {quizState === 'reading' && (
            <div className="space-y-6">
              <div className="font-body text-xs text-graphite/85 dark:text-paper/85 leading-relaxed space-y-4">
                {activeLesson.body}
              </div>

              <div className="border-t border-graphite/10 dark:border-paper/10 pt-5">
                <button
                  onClick={handleStartQuiz}
                  className="w-full py-3.5 bg-ember-coral text-white font-body font-bold text-xs uppercase tracking-wider rounded-btn hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 shadow focus-ring"
                >
                  <Book className="w-4 h-4" />
                  Take 3-Question Quiz
                </button>
              </div>
            </div>
          )}

          {quizState === 'quiz' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-data text-[10px] text-[#A855F7] font-bold uppercase tracking-wider">
                  Question {currentQuestionIdx + 1} of {activeLesson.quiz.length}
                </span>
                <div className="flex gap-1">
                  {activeLesson.quiz.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-1.5 rounded-full ${
                        idx <= currentQuestionIdx ? 'bg-[#A855F7]' : 'bg-graphite/10 dark:bg-paper/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="font-body text-sm font-bold text-graphite dark:text-paper leading-normal">
                {activeLesson.quiz[currentQuestionIdx].question}
              </h4>

              <div className="space-y-2 mt-4">
                {activeLesson.quiz[currentQuestionIdx].options.map((opt, oIdx) => {
                  const isSelected = quizAnswers[currentQuestionIdx] === oIdx;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full py-3 px-3.5 text-left text-xs font-body border rounded-btn transition-all ${
                        isSelected
                          ? 'bg-[#A855F7] border-[#A855F7] text-white font-bold shadow'
                          : 'bg-transparent border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:bg-paper/5 dark:hover:bg-paper/5'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={quizAnswers[currentQuestionIdx] === undefined}
                className="w-full mt-6 py-3.5 bg-graphite text-paper dark:bg-paper dark:text-graphite font-body font-bold text-xs uppercase rounded-btn hover:bg-opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 focus-ring"
              >
                {currentQuestionIdx < activeLesson.quiz.length - 1 ? 'Next Question' : 'Submit Quiz'}
              </button>
            </div>
          )}

          {quizState === 'passed' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gain-green/15 text-gain-green border border-gain-green/30 flex items-center justify-center mx-auto">
                <Award className="w-9 h-9" />
              </div>
              <h3 className="font-display text-xl font-bold text-gain-green">
                Quiz Passed! Badge Unlocked!
              </h3>
              <p className="font-body text-xs text-graphite/70 dark:text-paper/70">
                You scored 3/3 and earned the <strong>{activeLesson.badgeLabel}</strong>.
              </p>
              <button
                onClick={() => setActiveLessonId(null)}
                className="px-6 py-3 bg-[#A855F7] text-white font-body font-bold text-xs uppercase rounded-btn hover:bg-opacity-90"
              >
                Return to Academy Tracks
              </button>
            </div>
          )}

          {quizState === 'failed' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-loss-red/15 text-loss-red border border-loss-red/30 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-9 h-9" />
              </div>
              <h3 className="font-display text-xl font-bold text-loss-red">
                Quiz Failed
              </h3>
              <p className="font-body text-xs text-graphite/70 dark:text-paper/70">
                You must answer all 3 questions correctly to earn your badge. Review the lesson and try again!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setQuizState('reading')}
                  className="px-5 py-2.5 border border-graphite/20 text-xs font-bold uppercase rounded-btn"
                >
                  Review Lesson
                </button>
                <button
                  onClick={handleStartQuiz}
                  className="px-5 py-2.5 bg-ember-coral text-white text-xs font-bold uppercase rounded-btn"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
