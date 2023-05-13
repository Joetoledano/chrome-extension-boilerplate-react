import { normalize } from 'viem/ens';
import { publicClient } from '../../Client';
import {
  OPBalancesEndpoint,
  OPRegisterWalletEndpoint,
} from '../../lib/constants';
import Transport from '../../lib/fetch';

const registerWallet = async (walletAddress: string) => {
  if (walletAddress) {
    try {
      const buildWalletBalanceQuery = () => {
        return `${OPRegisterWalletEndpoint}`;
      };

      const opts = {
        body: {
          wallets: walletAddress,
        },
      };
      const data = await Transport.sendJSON(buildWalletBalanceQuery(), opts);
      return data;
    } catch (e) {
      console.error('error registering a wallet', e);
    }
  }
};

const fetchBalances = async (walletAddress: string) => {
  if (walletAddress) {
    let errorFetchingBalance = false;
    try {
      const buildWalletBalanceQuery = () => {
        return `${OPBalancesEndpoint}?wallet=${walletAddress}&period=MAX`;
      };
      const dataFromRegisteringWallet = await registerWallet(walletAddress);
      const data = await Transport.fetch(buildWalletBalanceQuery());
      const walletBalance = data ? data.data : [];

      const balancesByChain =
        data && data.summary && data.summary.chain_breakdown
          ? data.summary.chain_breakdown
          : {};

      const walletSummary = data ? data.summary : {};

      const tokenAllocation =
        data && data.summary && data.summary.allocation
          ? data.summary.allocation
          : [];

      const devActivity =
        data && data.summary && data.summary.developer_activity
          ? data.summary.developer_activity
          : [];

      const currentWalletValue =
        data && data.summary && data.summary.total_value
          ? data.summary.total_value
          : [];

      const largestAllocation =
        data && data.summary && data.summary.allocation_largest
          ? data.summary.allocation_largest
          : [];

      const smallestAllocation =
        data && data.summary && data.summary.allocation_smallest
          ? data.summary.allocation_smallest
          : [];

      const priceWinner =
        data && data.summary && data.summary.price_winner
          ? data.summary.price_winner
          : [];

      const priceLoser =
        data && data.summary && data.summary.price_loser
          ? data.summary.price_loser
          : [];

      const protocolAllocation = walletSummary?.protocol_allocation
        ? walletSummary?.protocol_allocation
        : [].map((obj: any) => ({
            allocation: (100 * obj.notional).toFixed(2),
            value: (100 * obj.notional).toFixed(2),
            label: obj.protocol,
          }));

      return {
        walletBalance,
        walletSummary,
        tokenAllocation,
        currentWalletValue,
        protocolAllocation,
        devActivity,
        largestAllocation,
        smallestAllocation,
        priceWinner,
        priceLoser,
        balancesByChain,
      };
    } catch (e) {
      errorFetchingBalance = true;
      console.error('error fetching balances', e);
      return {
        errorFetchingBalance,
      };
    }
  }
  return [];
};

function extractEthAddress(inputString: string) {
  const regex = /(\S*\.eth)/g;
  const matches = inputString.match(regex);

  if (matches && matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    if (inputString === lastMatch) {
      return lastMatch;
    } else if (/\s/.test(inputString)) {
      return lastMatch;
    }
  }

  return null;
}

const getListOfTweetsOnHomePage = () => {
  if (typeof window !== 'undefined') {
    const currentURL = window.location.href;
    if (currentURL.includes('twitter.com/home')) {
      const listOfTweets = Array.from(document.querySelectorAll('article'));
      return listOfTweets;
    }
  }
};

const getTwitterName = () => {
  if (document) {
    const namesWithENS = Array.from(document.querySelectorAll('span')).filter(
      (el) => el?.innerText?.includes('.eth')
    );
    // using the second instance of the ens name to preserve the upper name(risky)
    if (namesWithENS && namesWithENS.length) {
      let nameWithENS;
      if (namesWithENS.length > 2) {
        nameWithENS = namesWithENS[3];
      } else {
        nameWithENS = namesWithENS[1];
      }
      if (nameWithENS) {
        return nameWithENS;
      }
    }
  }
};

const getTwitterNameFromTweet = (tweet: HTMLElement) => {
  if (document) {
    const namesWithENS = Array.from(tweet.querySelectorAll('span')).filter(
      (el) => el?.innerText?.includes('.eth')
    );
    // using the second instance of the ens name to preserve the upper name(risky)
    if (namesWithENS && namesWithENS.length) {
      let nameWithENS;
      if (namesWithENS.length > 2) {
        nameWithENS = namesWithENS[3];
      } else {
        nameWithENS = namesWithENS[1];
      }
      if (nameWithENS) {
        return nameWithENS;
      }
    }
  }
};

const fetchAddressForENSName = async (ensName: string) => {
  if (ensName) {
    try {
      const ensAddress = await publicClient.getEnsAddress({
        name: normalize(ensName),
      });
      return ensAddress;
    } catch (e) {
      console.error('error for fetching the ens address', e);
    }
  }
};

const buildBox = () => {
  const boxEl = document.createElement('div');
  boxEl.classList.add('balance-box');
  return boxEl;
};

const addElementsTogether = (parentEl, childEl) => {
  if (parentEl && childEl) {
    parentEl.appendChild(childEl);
  }
};

const addBoxToName = async () => {
  if (document) {
    const nameWithENS = getTwitterName();
    if (
      nameWithENS &&
      nameWithENS.innerText &&
      extractEthAddress(nameWithENS.innerText)
    ) {
      const filteredENSText = extractEthAddress(nameWithENS.innerText);

      const ensAddress = filteredENSText
        ? await fetchAddressForENSName(filteredENSText.trim())
        : null;
      if (ensAddress) {
        const balancesData = await fetchBalances(ensAddress);
        if (balancesData) {
          const boxEl = buildBox();

          const boxTitleText = document.createElement('p');
          boxTitleText.classList.add('title-content');

          const boxTitleTextContent = document.createTextNode('Eth Balance:');

          addElementsTogether(boxTitleText, boxTitleTextContent);
          const boxText = document.createElement('p');
          boxText.classList.add('text-content');
          const boxTextContent = document.createTextNode(ensAddress);
          addElementsTogether(boxText, boxTextContent);
          // Add title text to box
          addElementsTogether(boxEl, boxTitleText);
          // Add content text to box
          addElementsTogether(boxEl, boxTextContent);
          // Add box to ENS element
          addElementsTogether(nameWithENS, boxEl);
        }
      }
    }
  }
};

const addBoxToNameForTweet = async (tweet: HTMLElement) => {
  if (document) {
    const nameWithENS = getTwitterNameFromTweet(tweet);
    if (
      nameWithENS &&
      nameWithENS.innerText &&
      extractEthAddress(nameWithENS.innerText)
    ) {
      const filteredENSText = extractEthAddress(nameWithENS.innerText);

      const ensAddress = filteredENSText
        ? await fetchAddressForENSName(filteredENSText.trim())
        : null;
      if (ensAddress) {
        const balancesData = await fetchBalances(ensAddress);
        if (balancesData) {
          const boxEl = buildBox();

          const boxTitleText = document.createElement('p');
          boxTitleText.classList.add('title-content');

          const boxTitleTextContent = document.createTextNode('Eth Balance:');

          addElementsTogether(boxTitleText, boxTitleTextContent);
          const boxText = document.createElement('p');
          boxText.classList.add('text-content');
          const boxTextContent = document.createTextNode(ensAddress);
          addElementsTogether(boxText, boxTextContent);
          // Add title text to box
          addElementsTogether(boxEl, boxTitleText);
          // Add content text to box
          addElementsTogether(boxEl, boxTextContent);
          // Add box to ENS element
          addElementsTogether(nameWithENS, boxEl);
        }
      }
    }
  }
};

function waitForHandleElement(interval: number, callback: () => any) {
  const intervalId = setInterval(function () {
    const element = Array.from(document.querySelectorAll('span')).find((elly) =>
      elly.innerText.includes('@')
    );
    if (element) {
      clearInterval(intervalId);
      callback();
    }
  }, interval);
}

const addBoxToTweetOrTweets = async () => {
  if (typeof window !== 'undefined') {
    const currentURL = window.location.href;
    if (currentURL.includes('twitter.com')) {
      if (currentURL.includes('twitter.com/home')) {
        // we add to tweets
        const listOfTweets = getListOfTweetsOnHomePage();
        if (listOfTweets) {
          listOfTweets.forEach(async (tweet) => {
            await addBoxToNameForTweet(tweet);
          });
        }
      } else {
        await addBoxToName();
      }
    }
  }
};
// content.js

// Your functions to be executed after the page loads
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'on tweetah') {
    // Perform actions in response to the URL change event
    waitForHandleElement(100, addBoxToName);

    // ... other actions you want to perform
  }
});
// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (event) {
  // Call your functions here
  addBoxToName();
});

waitForHandleElement(100, addBoxToName);

window.addEventListener('popstate', function () {
  // URL has changed
  waitForHandleElement(100, addBoxToName);
});

window.addEventListener('hashchange', function () {
  // URL has changed
  waitForHandleElement(100, addBoxToName);
});
