import { tokensData } from '../../tokensData';

export function extractEthAddress(inputString: string) {
  const cleanedString = inputString.replace(/[^\w\s.]/g, ''); // Remove special characters except for word characters, spaces, and periods
  const regex = /(\S*\.eth)/g;
  const matches = cleanedString.match(regex);

  if (matches && matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    if (cleanedString === lastMatch) {
      return lastMatch;
    } else if (/\s/.test(cleanedString)) {
      return lastMatch;
    }
  }

  return null;
}

export function removeSpecialCharacters(str: string): string {
  // This regular expression matches any character that is not a letter (case insensitive), a number, an underscore, or a whitespace.
  let regex = /[^a-z0-9_ \n]/gi;
  // Replace matches with an empty string.
  return str.replace(regex, '');
}

export const getTwitterNameFromTweet = (tweet: HTMLElement) => {
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

export function hasChildElementWithClassName(
  className: string,
  element: HTMLElement
): boolean {
  const childElements = element.getElementsByClassName(className);
  return childElements.length > 0;
}

export function buildBoxHeader(title: string) {
  if (document) {
    const boxHeader = document.createElement('div');
    boxHeader.classList.add('box-header');

    const boxHeaderLeftIcon = document.createElement('p');
    boxHeaderLeftIcon.textContent = '🧳';

    const boxHeaderTitle = document.createElement('p');
    boxHeaderTitle.textContent = `${title}'s Wallet Stats`;

    boxHeader.appendChild(boxHeaderLeftIcon);
    boxHeader.appendChild(boxHeaderTitle);
    return boxHeader;
  }
}

export function buildBox(className: string): HTMLElement {
  const boxEl = document.createElement('div');
  boxEl.classList.add(className);
  return boxEl;
}

export function createValuesContainer(): HTMLElement {
  const boxValuesContainer = document.createElement('div');
  boxValuesContainer.classList.add('values-container');
  return boxValuesContainer;
}

export function addToggleButton(parentContainer: HTMLElement) {
  if (document) {
    const boxToggleButton = document.createElement('button');
    const boxToggleButtonText = document.createTextNode('Display');
    boxToggleButton.appendChild(boxToggleButtonText);
    boxToggleButton.classList.add('display-button');
    boxToggleButton.addEventListener('click', () => {
      parentContainer.classList.toggle('hidden');
      const buttonText = parentContainer.classList.contains('hidden')
        ? 'Display'
        : 'Hide';
      boxToggleButtonText.nodeValue = buttonText;
    });
    return boxToggleButton;
  }
}

type tokenDataObjType = {
  id: string;
  name: string;
  symbol: string;
};

export const getTokensDataObjectByName = () => {
  let dataObject = tokensData.reduce((obj: any, item: tokenDataObjType) => {
    obj[item.name] = item;
    return obj;
  }, {});
  return dataObject;
};

export const getTokensDataObjectBySymbol = () => {
  let dataObject = tokensData.reduce((obj: any, item: tokenDataObjType) => {
    obj[item.symbol] = item;
    return obj;
  }, {});
  return dataObject;
};

export function truncateString(
  input: string,
  startLength: number,
  endLength: number
): string {
  if (
    typeof input !== 'string' ||
    typeof startLength !== 'number' ||
    typeof endLength !== 'number'
  ) {
    throw new Error(
      'Invalid parameters: Input should be a string and lengths should be numbers.'
    );
  }

  if (startLength < 0 || endLength < 0) {
    throw new Error(
      'Invalid parameters: StartLength and endLength should be non-negative numbers.'
    );
  }

  if (startLength + endLength > input.length) {
    throw new Error(
      'Invalid parameters: The sum of startLength and endLength should be less than or equal to input length.'
    );
  }

  const start = input.substring(0, startLength);
  const end = input.substring(input.length - endLength);

  return `${start}...${end}`;
}

export const copyToClipboard = async (text: string): Promise<void> => {
  if (!navigator.clipboard) {
    throw new Error('Clipboard is not accessible');
  }

  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (error) {
    console.error('Failed to copy text: ', error);
    throw new Error('Failed to copy text');
  }
};
