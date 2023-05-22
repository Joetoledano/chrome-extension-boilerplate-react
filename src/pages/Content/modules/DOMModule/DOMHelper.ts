export class DOMHelper {
  public static hasChildElementWithClassName(
    className: string,
    element: HTMLElement
  ): boolean {
    const childElements = element.getElementsByClassName(className);
    return childElements.length > 0;
  }

  public static buildBoxHeader(title: string): HTMLElement {
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

  public static buildBox(className: string): HTMLElement {
    const boxEl = document.createElement('div');
    boxEl.classList.add(className);
    return boxEl;
  }

  public static setupTitleAndValueText(
    titleText: string,
    valueText: string
  ): HTMLDivElement {
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
  }

  public static createValuesContainer(fields: any[]): HTMLElement {
    const boxValuesContainer = document.createElement('div');
    boxValuesContainer.classList.add('values-container');
    fields.forEach((field: any) => {
      const valueContainerItem = this.setupTitleAndValueText(
        field.title,
        field.value
      );
      boxValuesContainer.appendChild(valueContainerItem);
    });
    return boxValuesContainer;
  }

  public static addToggleButton(
    parentContainer: HTMLElement
  ): HTMLButtonElement {
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

  public static addLoadingUI(parentContainer: HTMLElement) {
    const loadingSpinner = document.createElement('div');

    // add in loading spinner and then invoke the fetchBalance function on an interval until balancesData.loaded === true
    if (!parentContainer.querySelector('.loading-container')) {
      loadingSpinner.classList.add('loading-spinner');
      const loadingDiv = document.createElement('div');
      const textForLoadingDiv = document.createElement('p');
      textForLoadingDiv.textContent = 'Loading Wallet Balances...';
      loadingDiv.appendChild(textForLoadingDiv);
      loadingDiv.appendChild(loadingSpinner);
      loadingDiv.classList.add('loading-container');
      parentContainer.appendChild(loadingDiv);
    }
  }
}
