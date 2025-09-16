import React, { useState } from 'react';
import './App.css';

const itemVariants = {
  Sneak: ['Invisibility Cloak', 'Stealth Ring', 'Sneaky Sneakers'],
  Charm: ['Silver Tongue Potion', 'Charmer’s Brooch', 'Glamour Gloves'],
  Break: ['Power Gauntlets', 'Titan Belt', 'Crusher Boots']
};

const storyNodes = [
  {
    headline: 'The Crossroads',
    text: 'Welcome to Eldoria! A land plagued by a fearsome dragon. Only a true hero can rid the realm of this menace. Your journey begins at a crossroads.',
    choices: [
      { label: 'Sneak through the shadows', stat: 'Sneak' },
      { label: 'Charm the guard', stat: 'Charm' },
      { label: 'Break down the door', stat: 'Break' }
    ]
  },
  {
    headline: 'The Whispering Forest',
    text: prev => {
      // Custom narrative for each choice
      if (prev === 'Sneak through the shadows') {
        return `You slip into the dark forest, where the trees whisper secrets. Using your stealth, you sneak past the whispering trees, their branches barely brushing your cloak.`;
      } else if (prev === 'Charm the guard') {
        return `You enter the forest, greeted by trees murmuring ancient riddles. With a charming smile, you convince the trees to let you through, and they part their branches in awe.`;
      } else if (prev === 'Break down the door') {
        return `You stomp into the forest, where the trees whisper warnings. With brute force, you fight every tree in your way, snapping twigs and scattering leaves as you go.`;
      }
      // Fallback
      return `After ${prev}, you enter a dark forest. The trees whisper secrets. What do you do?`;
    },
    choices: [
      { label: 'Sneak past the whispering trees', stat: 'Sneak' },
      { label: 'Convince the trees to let you through', stat: 'Charm' },
      { label: 'Fight every tree in your way', stat: 'Break' }
    ]
  },
  {
    headline: 'The Troll Bridge',
    text: prev => `Having ${prev}, you encounter a group of trolls guarding a rickety bridge. How will you proceed?`,
    choices: [
      { label: 'Sneak past the trolls', stat: 'Sneak' },
      { label: 'Negotiate for safe passage', stat: 'Charm' },
      { label: 'Challenge the troll chief', stat: 'Break' }
    ]
  },
  {
    headline: 'The Misty River',
    text: prev => `After ${prev}, you reach a misty river. The bridge is guarded. Your move?`,
    choices: [
      { label: 'Swim silently across', stat: 'Sneak' },
      { label: 'Persuade the guard', stat: 'Charm' },
      { label: 'Leap over the river', stat: 'Break' }
    ]
  },
  {
    headline: 'The Hidden Cave',
    text: prev => `With ${prev}, you find a hidden cave. Inside, danger lurks. What now?`,
    choices: [
      { label: 'Sneak by the sleeping beast', stat: 'Sneak' },
      { label: 'Calm the beast with words', stat: 'Charm' },
      { label: 'Defeat the beast', stat: 'Break' }
    ]
  },
  {
    headline: 'The Mountain Pass',
    text: prev => `After ${prev}, you climb the mountain pass. Bandits await. Your action?`,
    choices: [
      { label: 'Sneak past the bandits', stat: 'Sneak' },
      { label: 'Bribe the bandits', stat: 'Charm' },
      { label: 'Fight the bandit leader', stat: 'Break' }
    ]
  },
  {
    headline: 'The Dragon\'s Lair',
    text: prev => `Finally, you stand before the dragon’s lair. The final challenge awaits!`,
    choices: [
      { label: 'Sneak into the lair', stat: 'Sneak' },
      { label: 'Talk to the dragon', stat: 'Charm' },
      { label: 'Battle the dragon', stat: 'Break' }
    ]
  }
];

function getItem(stat, nodeIdx) {
  const variants = itemVariants[stat];
  return variants[nodeIdx % variants.length];
}

function App() {
  const [step, setStep] = useState('landing'); // Start with landing page
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [dead, setDead] = useState(false);
  const [currentNode, setCurrentNode] = useState(0);
  const [magicCoins, setMagicCoins] = useState(0);
  const [item, setItem] = useState(null);
  const [itemStat, setItemStat] = useState(null);
  const [freeItem, setFreeItem] = useState(true);
  const [showFairyIntro, setShowFairyIntro] = useState(false);
  const [playerStats, setPlayerStats] = useState({ Sneak: 0, Charm: 0, Break: 0 });
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [deathNode, setDeathNode] = useState(null);

  // Landing page
  if (step === 'landing') {
    return (
      <div className="app-container">
        <h2>Hej Thea!</h2>
        <p>Jeg har lavet et lille spil til din togtur 🚂</p>
        <div className="button-group">
          <button onClick={() => setStep('profile')}>Start spillet</button>
        </div>
      </div>
    );
  }

  // Handle profile creation
  const handleCreateProfile = () => {
    localStorage.setItem('profile', JSON.stringify({ name }));
    setStep('fairyIntro');
    setShowFairyIntro(true);
  };

  // Fairy intro before first shop
  if (step === 'fairyIntro') {
    return (
      <div className="app-container">
        <h2>The Shop Fairy Appears!</h2>
        <p>
          "Greetings, {name}! I am Lysandra, the shop fairy. I will help you on your quest to defeat the dragon.
          My shop is filled with magical items. You earn mana coins from your brave deeds, and I can teleport new items to you when you have enough coins.
          Choose wisely, for your actions shape your legend!"
        </p>
        <div className="button-group">
          <button onClick={() => { setStep('shop'); setShowFairyIntro(false); }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Handle story choices
  const handleStoryChoice = (choiceIdx) => {
    const node = storyNodes[currentNode];
    const choice = node.choices[choiceIdx];
    if (!item || itemStat !== choice.stat) {
      setDead(true);
      setMessage('You failed! The fairy offers you another chance if you have a mana coin.');
      setStep('shop');
      setItem(null);
      setItemStat(null);
      setFreeItem(false);
      setDeathNode(currentNode);
    } else {
      setPlayerStats(stats => ({
        ...stats,
        [choice.stat]: stats[choice.stat] + 1
      }));
      setChoiceHistory(history => [...history, choice.label]);
      setDead(false);
      setMessage('');
      setMagicCoins(magicCoins + 1);
      setItem(null);
      setItemStat(null);
      setDeathNode(null);
      if (currentNode < storyNodes.length - 1) {
        setStep('shop');
        setCurrentNode(currentNode + 1);
      } else {
        setStep('end');
      }
    }
  };

  // Handle shop selection
  const handleShopChoice = (stat) => {
    const nodeIdx = deathNode !== null ? deathNode : currentNode;
    setItem(getItem(stat, nodeIdx));
    setItemStat(stat);

    if (deathNode !== null) {
      setStep('story');
      setCurrentNode(deathNode);
      setDeathNode(null);
    } else if (currentNode < storyNodes.length - 1) {
      setStep('story');
      setCurrentNode(currentNode + 1);
    } else {
      setStep('end');
    }
    setFreeItem(false);
  };

  // Death screen
  if (dead) {
    return (
      <div className="app-container">
        <div className="death-message">
          You died! The fairy offers you another chance.<br />
          {message}
        </div>
        <div className="button-group">
          <button onClick={() => {
            setStep('profile');
            setCurrentNode(0);
            setMagicCoins(0);
            setItem(null);
            setItemStat(null);
            setFreeItem(true);
            setDead(false);
            setMessage('');
            setName('');
            setPlayerStats({ Sneak: 0, Charm: 0, Break: 0 });
            setChoiceHistory([]);
            setDeathNode(null);
          }}>
            Back to Start
          </button>
          <button onClick={() => {
            setStep('shop');
            setMagicCoins(magicCoins + 1);
            setDead(false);
            setMessage('');
          }}>
            Try Again (Shop)
          </button>
        </div>
      </div>
    );
  }

  // Progress bar
  const renderProgressBar = (fillAll = false) => (
    <div className="progress-bar">
      {[...Array(storyNodes.length)].map((_, idx) => (
        <div
          key={idx}
          className={`progress-box${fillAll ? ' filled' : idx < currentNode ? ' filled' : ''}`}
        />
      ))}
    </div>
  );

  // Render profile creation
  if (step === 'profile') {
    return (
      <div className="app-container">
        <h2>Create Your Character</h2>
        <p>
          In the magical realm of Eldoria, a dragon terrorizes the land. Only a hero with courage and wit can defeat it.
          Name your hero and begin your quest!
        </p>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button
            disabled={!name}
            onClick={handleCreateProfile}
          >
            Start Adventure
          </button>
        </div>
      </div>
    );
  }

  // Shop fairy reflection logic
  if (step === 'shop') {
    const nodeIdx = deathNode !== null ? deathNode : currentNode;
    const isLastNode = nodeIdx === storyNodes.length - 1;
    let lysandraComment = '';
    if (isLastNode) {
      lysandraComment = 'Lysandra: "This is it, hero! The dragon awaits. Choose your final tool wisely. May your legend echo through Eldoria!"';
    } else if (choiceHistory.length > 0) {
      const lastChoice = choiceHistory[nodeIdx - 1] || choiceHistory[choiceHistory.length - 1];
      switch (nodeIdx) {
        case 1:
          lysandraComment = `Lysandra: "You braved the whispering forest and chose to '${lastChoice}'. I hope you didn't get sap on your boots! What magical gadget will you pick for what's next?"`;
          break;
        case 2:
          lysandraComment = `Lysandra: "Trolls at the bridge, and you went with '${lastChoice}'. I bet the trolls are still gossiping about you. Ready for another surprise?"`;
          break;
        case 3:
          lysandraComment = `Lysandra: "A misty river and a guarded bridge? After '${lastChoice}', I hope your shoes are still dry. What will you do now?"`;
          break;
        case 4:
          lysandraComment = `Lysandra: "A cave with a beast! After '${lastChoice}', I hope you didn't lose your lunch. Time to choose your next trick!"`;
          break;
        case 5:
          lysandraComment = `Lysandra: "Bandits, huh? After '${lastChoice}', I hope you kept your wallet. What's your next move?"`;
          break;
        case 6:
          lysandraComment = `Lysandra: "The dragon's lair! After '${lastChoice}', I hope you're not out of breath. This is your moment—how will you face the dragon?"`;
          break;
        default:
          lysandraComment = `Lysandra: "After you chose to '${lastChoice}', I have just the thing for you next! How do you want to proceed?"`;
      }
    } else {
      lysandraComment = 'Lysandra: "I can teleport items from my shop. The first one is free, so I can see if you are made of the right stuff! After each challenge, you earn a mana coin and can buy more items. What will you choose?"';
    }
    return (
      <div className="app-container">
        {renderProgressBar()}
        <h2>The Shop Fairy Appears!</h2>
        <p>{lysandraComment}</p>
        <p>
          {freeItem
            ? 'Choose your free item:'
            : `You have ${magicCoins} mana coin(s). Choose an item to buy:`}
        </p>
        <div className="button-group shop-items">
          {['Sneak', 'Charm', 'Break'].map(stat => (
            <button
              key={stat}
              onClick={() => {
                if (freeItem || magicCoins > 0) {
                  if (!freeItem) setMagicCoins(magicCoins - 1);
                  handleShopChoice(stat);
                }
              }}
              disabled={!freeItem && magicCoins === 0}
            >
              {getItem(stat, nodeIdx)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render end node
  if (step === 'end') {
    const maxStat = Object.keys(playerStats).reduce((a, b) => playerStats[a] > playerStats[b] ? a : b);
    let endingText = '';
    if (maxStat === 'Sneak') {
      endingText = `With legendary stealth, you sneak into the dragon's lair and quietly tie its shoelaces together. The dragon tries to leap up, trips, and gets stuck in a loop of chasing its own tail. Eldoria is safe, and the dragon is now the kingdom's favorite circus act!`;
    } else if (maxStat === 'Charm') {
      endingText = `You charm the dragon with a dazzling smile and a flawless knock-knock joke. The dragon laughs so hard it forgets to be evil and opens a bakery. Eldoria is safe, and you get free pastries for life!`;
    } else {
      endingText = `With overwhelming strength, you wrestle the dragon, tie its tail in a knot, and launch it into the next kingdom. Eldoria celebrates your heroic muscles and you become a living legend!`;
    }
    return (
      <div className="app-container">
        {renderProgressBar(true)}
        <h2>Congratulations, Hero of Eldoria!</h2>
        <p>{endingText}</p>
        <div className="button-group">
          <button onClick={() => {
            setStep('profile');
            setCurrentNode(0);
            setMagicCoins(0);
            setItem(null);
            setItemStat(null);
            setFreeItem(true);
            setDead(false);
            setMessage('');
            setName('');
            setPlayerStats({ Sneak: 0, Charm: 0, Break: 0 });
            setChoiceHistory([]);
            setDeathNode(null);
          }}>Play Again</button>
        </div>
      </div>
    );
  }

  // Render story node
  if (step === 'story') {
    const node = storyNodes[currentNode];
    const prevChoice = choiceHistory[currentNode - 1] || '';
    const nodeText = typeof node.text === 'function' ? node.text(prevChoice) : node.text;
    return (
      <div className="app-container">
        {renderProgressBar()}
        <h2>{node.headline || `Story Node ${currentNode + 1}`}</h2>
        <p>{nodeText}</p>
        <p>
          {item
            ? `You have the ${item}.`
            : 'You have no item. The fairy will help you after this.'}
        </p>
        <div className="button-group">
          {node.choices.map((choice, idx) => (
            <button
              key={choice.label}
              onClick={() => handleStoryChoice(idx)}
            >
              {choice.label}
            </button>
          ))}
        </div>
        <p>Mana Coins: {magicCoins}</p>
      </div>
    );
  }

  return null;
}

export default App;
