import { normalize } from 'viem/ens';
import { publicClient } from '../../Client';
import { extractEthAddress, getTwitterNameFromTweet } from '../../lib/helpers';
import { fetchBalances } from '../../networkRequests';

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

const setupTitleAndValueText = (
  titleText: string,
  valueText: string
): HTMLDivElement => {
  const textContainerDiv: HTMLDivElement = document.createElement('div');
  textContainerDiv.classList.add('title-and-value-container');

  const boxTitleText: HTMLParagraphElement = document.createElement('p');
  boxTitleText.classList.add('title-content');
  boxTitleText.textContent = titleText;

  const boxText: HTMLParagraphElement = document.createElement('p');
  boxText.classList.add('text-content');
  boxText.textContent = valueText;

  textContainerDiv.appendChild(boxTitleText);
  textContainerDiv.appendChild(boxText);

  return textContainerDiv;
};

const buildBoxHeader = (title: string) => {
  const boxHeader = document.createElement('div');
  boxHeader.classList.add('box-header');

  const boxHeaderLeftIcon = document.createElement('p');
  boxHeaderLeftIcon.textContent = '🧳';

  const boxHeaderTitle = document.createElement('p');
  boxHeaderTitle.textContent = `${title}'s Wallet Stats`;

  boxHeader.appendChild(boxHeaderLeftIcon);
  boxHeader.appendChild(boxHeaderTitle);
  return boxHeader;
};

const addBoxToNameForProfile = async () => {
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

      if (ensAddress && filteredENSText) {
        const balancesData = await fetchBalances(ensAddress);

        if (
          balancesData &&
          balancesData.walletSummary &&
          balancesData.walletSummary.total_value !== undefined &&
          balancesData.walletSummary.total_unrealized_pnl !== undefined &&
          balancesData.walletSummary.total_realized !== undefined
        ) {
          const { total_realized, total_unrealized_pnl, total_value } =
            balancesData.walletSummary;

          const boxEl = buildBox();

          const boxHeader = buildBoxHeader(filteredENSText);

          const boxToggleButton = document.createElement('button');
          const boxToggleButtonText = document.createTextNode('Display');
          boxToggleButton.appendChild(boxToggleButtonText);
          boxToggleButton.classList.add('display-button');

          const boxValuesContainer = document.createElement('div');
          boxValuesContainer.classList.add('values-container');

          // add divs for each of the titles/vals to show
          const walletValueDiv = setupTitleAndValueText(
            '💰 Wallet Value:',
            `$${total_value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          );
          const walletUnrealizedPnLDiv = setupTitleAndValueText(
            '🤑 Current unrealized PnL:',
            `$${total_unrealized_pnl.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          );
          const walletRealizedPnLDiv = setupTitleAndValueText(
            '🪙 Current Realized PnL:',
            `$${total_realized.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          );

          boxToggleButton.addEventListener('click', () => {
            boxValuesContainer.classList.toggle('hidden');
            const buttonText = boxValuesContainer.classList.contains('hidden')
              ? 'Display'
              : 'Hide';
            boxToggleButtonText.nodeValue = buttonText;
          });

          boxValuesContainer.appendChild(walletValueDiv);
          boxValuesContainer.appendChild(walletUnrealizedPnLDiv);
          boxValuesContainer.appendChild(walletRealizedPnLDiv);

          boxEl.appendChild(boxHeader);
          boxEl.appendChild(boxToggleButton);
          boxEl.appendChild(boxValuesContainer);

          nameWithENS.appendChild(boxEl);
        }
      }
    }
  }
};

const addBoxToNameForTweet = async (tweet: HTMLElement): Promise<void> => {
  if (document) {
    console.log('inna document');
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
      console.log('ens address', ensAddress);
      if (ensAddress && filteredENSText) {
        const balancesData = await fetchBalances(ensAddress);
        console.log('balances', balancesData);

        if (
          balancesData &&
          balancesData.walletSummary &&
          balancesData.walletSummary.total_value !== undefined &&
          balancesData.walletSummary.total_unrealized_pnl !== undefined &&
          balancesData.walletSummary.total_realized !== undefined
        ) {
          const { total_realized, total_unrealized_pnl, total_value } =
            balancesData.walletSummary;

          const boxEl = buildBox();

          const boxHeader = buildBoxHeader(filteredENSText);

          const boxToggleButton = document.createElement('button');
          const boxToggleButtonText = document.createTextNode('Display');
          boxToggleButton.appendChild(boxToggleButtonText);
          boxToggleButton.classList.add('display-button');

          const boxValuesContainer = document.createElement('div');
          boxValuesContainer.classList.add('values-container');

          // add divs for each of the titles/vals to show
          const walletValueDiv = setupTitleAndValueText(
            '💰 Wallet Value:',
            `$${total_value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          );
          const walletUnrealizedPnLDiv = setupTitleAndValueText(
            '🤑 Current unrealized PnL:',
            `$${total_unrealized_pnl.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          );
          const walletRealizedPnLDiv = setupTitleAndValueText(
            '🪙 Current Realized PnL:',
            `$${total_realized.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          );

          boxToggleButton.addEventListener('click', () => {
            boxValuesContainer.classList.toggle('hidden');
            const buttonText = boxValuesContainer.classList.contains('hidden')
              ? 'Display'
              : 'Hide';
            boxToggleButtonText.nodeValue = buttonText;
          });

          boxValuesContainer.appendChild(walletValueDiv);
          boxValuesContainer.appendChild(walletUnrealizedPnLDiv);
          boxValuesContainer.appendChild(walletRealizedPnLDiv);

          boxEl.appendChild(boxHeader);
          boxEl.appendChild(boxToggleButton);
          boxEl.appendChild(boxValuesContainer);

          nameWithENS.appendChild(boxEl);
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

const addBoxNameToTweetsOnHomePage = async () => {
  const listOfTweets = getListOfTweetsOnHomePage();
  console.log('the list', listOfTweets);
  if (listOfTweets) {
    listOfTweets.forEach(async (tweet) => {
      await addBoxToNameForTweet(tweet);
    });
  }
};

// content.js

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (event) {
  // Call your functions here
  if (typeof window !== 'undefined') {
    if (window.location.href.includes('twitter.com/home')) {
      waitForHandleElement(100, addBoxNameToTweetsOnHomePage);
    } else {
      waitForHandleElement(100, addBoxToNameForProfile);
    }
  }
});

if (typeof window !== 'undefined') {
  if (window.location.href.includes('twitter.com/home')) {
    waitForHandleElement(100, addBoxNameToTweetsOnHomePage);
  } else {
    waitForHandleElement(100, addBoxToNameForProfile);
  }
}
window.addEventListener('popstate', function () {
  // URL has changed
  if (typeof window !== 'undefined') {
    if (window.location.href.includes('twitter.com/home')) {
      waitForHandleElement(100, addBoxNameToTweetsOnHomePage);
    } else {
      waitForHandleElement(100, addBoxToNameForProfile);
    }
  }
});

window.addEventListener('hashchange', function () {
  // URL has changed
  if (typeof window !== 'undefined') {
    if (window.location.href.includes('twitter.com/home')) {
      waitForHandleElement(100, addBoxNameToTweetsOnHomePage);
    } else {
      waitForHandleElement(100, addBoxToNameForProfile);
    }
  }
});
