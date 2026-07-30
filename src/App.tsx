import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useWalletStore } from './store/useWalletStore';
import { Layout } from './components/Layout';
import { Landing } from './views/Landing';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { Buy } from './views/Buy';
import { Send } from './views/Send';
import { Receive } from './views/Receive';
import { Swap } from './views/Swap';
import { Activity } from './views/Activity';
import { Learn } from './views/Learn';
import { News } from './views/News';
import { Settings } from './views/Settings';

function App() {
  const { simulationStarted, fetchLivePrices } = useWalletStore();
  const [view, setView] = useState<string>('landing');
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetchLivePrices();
  }, [fetchLivePrices]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || 'landing';

      if (!simulationStarted) {
        if (hash === 'onboarding') {
          setView('onboarding');
        } else {
          setView('landing');
          if (window.location.hash !== '#/') {
            window.location.hash = '#/';
          }
        }
      } else {
        if (hash === 'landing' || hash === 'onboarding' || hash === '') {
          setView('dashboard');
          window.location.hash = '#/dashboard';
        } else {
          setView(hash);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [simulationStarted]);

  const navigate = (newView: string) => {
    window.location.hash = `#/${newView}`;
  };

  const pageVariants = {
    initial: { opacity: 0, y: isMobile || prefersReducedMotion ? 0 : 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: isMobile || prefersReducedMotion ? 0 : -4 },
  };

  const pageTransition = {
    duration: isMobile || prefersReducedMotion ? 0 : 0.2,
    ease: 'easeInOut' as const,
  };

  const renderViewContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'buy':
        return <Buy onNavigate={navigate} />;
      case 'send':
        return <Send onNavigate={navigate} />;
      case 'receive':
        return <Receive />;
      case 'swap':
        return <Swap onNavigate={navigate} />;
      case 'activity':
        return <Activity onNavigate={navigate} />;
      case 'learn':
        return <Learn />;
      case 'news':
        return <News />;
      case 'settings':
        return <Settings onReset={() => navigate('landing')} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  if (!simulationStarted) {
    return (
      <Layout currentView={view} onNavigate={navigate}>
        <AnimatePresence mode="wait">
          {view === 'onboarding' ? (
            <motion.div
              key="onboarding"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full flex justify-center"
            >
              <Onboarding onComplete={() => navigate('dashboard')} />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="w-full flex justify-center"
            >
              <Landing onStartPracticing={() => navigate('onboarding')} />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    );
  }

  return (
    <Layout currentView={view} onNavigate={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="w-full flex justify-center"
        >
          {renderViewContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
