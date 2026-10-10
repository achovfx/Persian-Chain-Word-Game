'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ModeSelector } from '@/components/ModeSelector';
import { LetterRoulette } from '@/components/LetterRoulette';
import { GameBoard } from '@/components/GameBoard';
import { VictoryModal } from '@/components/VictoryModal';
import { SettingsModal } from '@/components/SettingsModal';
import { DictionaryModal } from '@/components/DictionaryModal';
import { TutorialModal } from '@/components/TutorialModal';
import { StatsModal } from '@/components/StatsModal';
import { PassDeviceModal } from '@/components/PassDeviceModal';
import { OnlineRoomModal } from '@/components/OnlineRoomModal';
import { ProfileModal } from '@/components/ProfileModal';
import { OnlineRoom } from '@/lib/rooms/roomStore';
import { UserProfile, loadUserProfile } from '@/lib/profile/profileStore';
import {
  GameMode,
  AIDifficulty,
  Player,
  WordHistoryItem,
  MatchSettings,
  MatchStats,
  DEFAULT_SETTINGS,
  createInitialPlayers
} from '@/lib/game/gameEngine';
import { persianDictionary } from '@/lib/persian/dictionary';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function Home() {
  // Game lifecycle status
  const [status, setStatus] = useState<'MENU' | 'ROULETTE' | 'PLAYING' | 'PASS_DEVICE' | 'VICTORY'>('MENU');
  const [currentMode, setCurrentMode] = useState<GameMode>('SINGLE_PLAYER');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentLetter, setCurrentLetter] = useState('ا');
  const [roundNumber, setRoundNumber] = useState(1);
  const [usedNormalizedWords, setUsedNormalizedWords] = useState<Set<string>>(new Set());
  const [wordHistory, setWordHistory] = useState<WordHistoryItem[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [passDeviceNextPlayer, setPassDeviceNextPlayer] = useState<Player | null>(null);

  // Online Multiplayer Room State with lazy URL query initializer
  const [initialRoomCode, setInitialRoomCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const room = params.get('room');
      return room ? room.trim().toUpperCase() : '';
    }
    return '';
  });
  const [isOnlineRoomOpen, setIsOnlineRoomOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('room'));
    }
    return false;
  });
  const [onlineRoomPresetCount, setOnlineRoomPresetCount] = useState<number | undefined>(undefined);
  const [activeOnlineRoomId, setActiveOnlineRoomId] = useState<string | null>(null);
  const [myOnlinePlayerId, setMyOnlinePlayerId] = useState<string | null>(null);
  const [onlineRoomSnapshot, setOnlineRoomSnapshot] = useState<OnlineRoom | null>(null);

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      return loadUserProfile();
    }
    return {
      name: 'قهرمان واژه‌ها',
      avatarId: 'persian_lion',
      avatarEmoji: '🦁',
      avatarTitle: 'شیر ایرانی',
      badgeColor: 'border-amber-400 text-amber-300',
      gradient: 'from-amber-600 via-orange-600 to-amber-800'
    };
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [dictionarySearchWord, setDictionarySearchWord] = useState('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Sound & Settings with lazy initializer
  const [isSoundMuted, setIsSoundMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return soundEffects.getIsMuted();
    }
    return false;
  });

  const [settings, setSettings] = useState<MatchSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zanjireh_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [stats, setStats] = useState<MatchStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zanjireh_stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {
      totalMatches: 0,
      wins: 0,
      totalWords: 0,
      longestChain: 0,
      streak: 0
    };
  });

  // Game over -> Victory handler (declared before effects)
  const handleGameOver = React.useCallback((winningPlayer: Player) => {
    setWinner(winningPlayer);
    setStatus('VICTORY');

    // Update stats
    setStats((prev) => {
      const isHumanWin = !winningPlayer.isAI;
      const updated = {
        ...prev,
        totalMatches: prev.totalMatches + 1,
        wins: isHumanWin ? prev.wins + 1 : prev.wins,
        streak: isHumanWin ? prev.streak + 1 : 0
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('zanjireh_stats', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Sync state from server when active online room is playing
  useEffect(() => {
    if (status !== 'PLAYING' || !activeOnlineRoomId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${activeOnlineRoomId}`);
        const data = await res.json();
        if (data.success && data.room) {
          const r: OnlineRoom = data.room;
          setOnlineRoomSnapshot(r);
          setPlayers(r.players);
          setCurrentLetter(r.currentLetter);
          setRoundNumber(r.roundNumber);
          setWordHistory(r.wordHistory);
          setUsedNormalizedWords(new Set(r.usedNormalizedWords));

          if (r.status === 'VICTORY' && r.winner) {
            handleGameOver(r.winner);
          }
        }
      } catch {
        // Silently retry
      }
    }, 1300);

    return () => clearInterval(interval);
  }, [status, activeOnlineRoomId, handleGameOver]);

  // Update sound mute
  const handleToggleSound = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    soundEffects.setMuted(nextState);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: MatchSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zanjireh_settings', JSON.stringify(newSettings));
    }
  };

  // Reset Stats
  const handleResetStats = () => {
    const fresh: MatchStats = {
      totalMatches: 0,
      wins: 0,
      totalWords: 0,
      longestChain: 0,
      streak: 0
    };
    setStats(fresh);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zanjireh_stats', JSON.stringify(fresh));
    }
  };

  // Online Room Handlers
  const handleOpenOnlineRoom = (preset?: number) => {
    setOnlineRoomPresetCount(preset);
    setInitialRoomCode('');
    setIsOnlineRoomOpen(true);
  };

  const handleJoinOnlineRoom = () => {
    setOnlineRoomPresetCount(undefined);
    setInitialRoomCode('');
    setIsOnlineRoomOpen(true);
  };

  const handleRoomGameStarted = (room: OnlineRoom, currentPlayerId: string) => {
    setActiveOnlineRoomId(room.id);
    setOnlineRoomSnapshot(room);
    setMyOnlinePlayerId(currentPlayerId);
    setPlayers(room.players);
    setCurrentLetter(room.currentLetter);
    setRoundNumber(room.roundNumber);
    setUsedNormalizedWords(new Set(room.usedNormalizedWords));
    setWordHistory(room.wordHistory);
    setWinner(null);
    setIsOnlineRoomOpen(false);
    setStatus('PLAYING');
  };

  const handleShareOnlineRoom = () => {
    if (!activeOnlineRoomId) return;
    const url = `${window.location.origin}/?room=${activeOnlineRoomId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert(`لینک دعوت به اتاق با موفقیت کپی شد:\n${url}`);
    }
  };

  // Start Game sequence from local lobby
  const handleStartGame = (mode: GameMode, playerNames: string[], aiDifficulty: AIDifficulty) => {
    setCurrentMode(mode);
    setActiveOnlineRoomId(null);
    setOnlineRoomSnapshot(null);
    const effectiveNames = [
      userProfile.name?.trim() || playerNames[0] || 'شما',
      ...playerNames.slice(1)
    ];
    const initialPlayers = createInitialPlayers(mode, effectiveNames, userProfile.avatarEmoji);
    setPlayers(initialPlayers);
    setRoundNumber(1);
    setUsedNormalizedWords(new Set());
    setWordHistory([]);
    setWinner(null);

    // Pick random starter letter
    const startingLetter = persianDictionary.getRandomAvailableLetter(
      new Set(),
      mode !== 'CHALLENGE' && settings.replaceDifficultLetters
    );
    setCurrentLetter(startingLetter);

    // Trigger Roulette animation
    setStatus('ROULETTE');
  };

  // Once Roulette finishes, transition to active GameBoard
  const handleRouletteComplete = () => {
    setStatus('PLAYING');
  };

  // Player submitted accepted word
  const handleWordAccepted = (
    word: string,
    historyItem: WordHistoryItem,
    nextLetter: string
  ) => {
    setUsedNormalizedWords((prev) => new Set(prev).add(historyItem.normalized));
    setWordHistory((prev) => [...prev, historyItem]);
    setCurrentLetter(nextLetter);
    setRoundNumber((prev) => prev + 1);

    // Update player words list
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === historyItem.playerId
          ? {
              ...p,
              wordsSubmitted: [...p.wordsSubmitted, word],
              score: p.score + 10
            }
          : p
      )
    );

    // If in online room, broadcast submission to room endpoint
    if (activeOnlineRoomId && myOnlinePlayerId) {
      fetch(`/api/rooms/${activeOnlineRoomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submitWord',
          playerId: myOnlinePlayerId,
          word
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.room) {
            setPlayers(data.room.players);
            setCurrentLetter(data.room.currentLetter);
            setRoundNumber(data.room.roundNumber);
            setWordHistory(data.room.wordHistory);
            setUsedNormalizedWords(new Set(data.room.usedNormalizedWords));
            if (data.room.status === 'VICTORY' && data.room.winner) {
              handleGameOver(data.room.winner);
            }
          }
        })
        .catch(() => {});
    }

    // Update global stats
    setStats((prev) => {
      const updated = {
        ...prev,
        totalWords: prev.totalWords + 1,
        longestChain: Math.max(prev.longestChain, wordHistory.length + 1)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('zanjireh_stats', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Life lost
  const handleLifeLost = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, lives: Math.max(0, p.lives - 1) } : p))
    );
  };

  // Player eliminated
  const handlePlayerEliminated = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, lives: 0, isEliminated: true } : p
      )
    );
  };

  // Letter changed (e.g. rare letter reroll or depletion)
  const handleLetterChanged = (newLetter: string) => {
    setCurrentLetter(newLetter);
  };

  // Privacy shield trigger
  const handleRequirePassDevice = (nextPlayer: Player) => {
    setPassDeviceNextPlayer(nextPlayer);
    setStatus('PASS_DEVICE');
  };

  // Ready after pass device
  const handlePassDeviceReady = () => {
    setStatus('PLAYING');
    setPassDeviceNextPlayer(null);
  };

  // Manual End Game handler - determines champion early and opens Victory modal
  const handleManualEndGame = async () => {
    soundEffects.playClick();

    // If online match, trigger server end game
    if (activeOnlineRoomId) {
      try {
        const res = await fetch(`/api/rooms/${activeOnlineRoomId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'endGame',
            playerId: myOnlinePlayerId
          })
        });
        const data = await res.json();
        if (data.success && data.room && data.room.winner) {
          handleGameOver(data.room.winner);
          return;
        }
      } catch {
        // Fallback to local calculation
      }
    }

    // Local calculation: find surviving player with most lives, then highest score
    const surviving = players.filter((p) => !p.isEliminated);
    const pool = surviving.length > 0 ? surviving : players;
    const sorted = [...pool].sort((a, b) => {
      if (b.lives !== a.lives) return b.lives - a.lives;
      return b.score - a.score;
    });

    const champion = sorted[0] || players[0];
    handleGameOver(champion);
  };

  // Rematch / Restart
  const handleRestartMatch = () => {
    const refreshedPlayers = players.map((p) => ({
      ...p,
      lives: 3,
      wordsSubmitted: [],
      isEliminated: false,
      score: 0
    }));
    setPlayers(refreshedPlayers);
    setRoundNumber(1);
    setUsedNormalizedWords(new Set());
    setWordHistory([]);
    setWinner(null);

    const startingLetter = persianDictionary.getRandomAvailableLetter(new Set());
    setCurrentLetter(startingLetter);
    setStatus('ROULETTE');
  };

  // Return to Lobby
  const handleReturnHome = () => {
    setActiveOnlineRoomId(null);
    setMyOnlinePlayerId(null);
    setStatus('MENU');
    setWinner(null);
  };

  // Open Dictionary for specific word
  const handleOpenDictionaryForWord = (word: string) => {
    setDictionarySearchWord(word);
    setIsDictionaryOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Background Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Navigation */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDictionary={() => {
          setDictionarySearchWord('');
          setIsDictionaryOpen(true);
        }}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        userProfile={userProfile}
        onReturnHome={handleReturnHome}
        isSoundMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
        roundNumber={roundNumber}
        isInGame={status === 'PLAYING'}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {status === 'MENU' && (
          <ModeSelector
            onStartGame={handleStartGame}
            onOpenDictionary={() => setIsDictionaryOpen(true)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenOnlineRoom={handleOpenOnlineRoom}
            onJoinOnlineRoom={handleJoinOnlineRoom}
            onOpenProfile={() => setIsProfileOpen(true)}
            userProfile={userProfile}
          />
        )}

        {status === 'ROULETTE' && (
          <LetterRoulette
            targetLetter={currentLetter}
            onComplete={handleRouletteComplete}
          />
        )}

        {status === 'PLAYING' && (
          <GameBoard
            players={players}
            currentLetter={currentLetter}
            settings={settings}
            roundNumber={roundNumber}
            usedNormalizedWords={usedNormalizedWords}
            wordHistory={wordHistory}
            onWordAccepted={handleWordAccepted}
            onLifeLost={handleLifeLost}
            onLetterChanged={handleLetterChanged}
            onPlayerEliminated={handlePlayerEliminated}
            onGameOver={handleGameOver}
            onRequirePassDevice={handleRequirePassDevice}
            onRestartMatch={handleRestartMatch}
            onExitMatch={handleReturnHome}
            onManualEndGame={handleManualEndGame}
            onOpenDictionaryForWord={handleOpenDictionaryForWord}
            roomId={activeOnlineRoomId || undefined}
            onlineRoom={onlineRoomSnapshot || undefined}
            myOnlinePlayerId={myOnlinePlayerId || undefined}
            onOnlineDraftChange={(word) => {
              if (!activeOnlineRoomId || !myOnlinePlayerId) return;
              void fetch(`/api/rooms/${activeOnlineRoomId}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'draft', playerId: myOnlinePlayerId, word })
              }).then((res) => res.json()).then((data) => {
                if (data.success && data.room) setOnlineRoomSnapshot(data.room);
              }).catch(() => {});
            }}
            onShareRoom={handleShareOnlineRoom}
          />
        )}
      </main>

      {/* Modals */}
      {status === 'PASS_DEVICE' && passDeviceNextPlayer && (
        <PassDeviceModal
          nextPlayer={passDeviceNextPlayer}
          onReady={handlePassDeviceReady}
        />
      )}

      {status === 'VICTORY' && winner && (
        <VictoryModal
          winner={winner}
          history={wordHistory}
          onPlayAgain={handleRestartMatch}
          onReturnHome={handleReturnHome}
          onOpenDictionary={() => {
            setDictionarySearchWord('');
            setIsDictionaryOpen(true);
          }}
        />
      )}

      {/* Online Room Creation & Joining Modal */}
      <OnlineRoomModal
        isOpen={isOnlineRoomOpen}
        onClose={() => setIsOnlineRoomOpen(false)}
        initialRoomId={initialRoomCode}
        initialPlayerCount={onlineRoomPresetCount}
        onRoomGameStarted={handleRoomGameStarted}
      />

      {/* User Profile & Avatar Customization Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentProfile={userProfile}
        onProfileUpdated={(updated) => {
          setUserProfile(updated);
          // Sync active player 1 in live session
          setPlayers((prev) =>
            prev.map((p, idx) =>
              idx === 0
                ? { ...p, name: updated.name, avatar: updated.avatarEmoji }
                : p
            )
          );
        }}
      />

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
          isSoundMuted={isSoundMuted}
          onToggleSound={handleToggleSound}
        />
      )}

      {isDictionaryOpen && (
        <DictionaryModal
          onClose={() => setIsDictionaryOpen(false)}
          initialSearchWord={dictionarySearchWord}
        />
      )}

      {isTutorialOpen && (
        <TutorialModal onClose={() => setIsTutorialOpen(false)} />
      )}

      {isStatsOpen && (
        <StatsModal
          stats={stats}
          onResetStats={handleResetStats}
          onClose={() => setIsStatsOpen(false)}
        />
      )}
    </div>
  );
}
