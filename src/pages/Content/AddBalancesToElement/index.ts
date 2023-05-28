import { fetchAddressForENSName } from '../../../Client';
import {
  extractEthAddress,
  hasChildElementWithClassName,
} from '../../../lib/helpers';
import { balancesFetcherModule } from '../modules/BalancesModule';
import { DOMHelper } from '../modules/DOMModule/DOMHelper';

type addressType = `0x${string}`;
type TokenType = {
  symbol?: string;
  name?: string;
};
export class AddBalancesToElement {
  private elementToGetAddressFrom: HTMLElement | null;
  private elementToRenderOnto: HTMLElement | null;
  private loadingContainer: HTMLElement | null;
  private errorContainer: HTMLElement | null;
  private tokens: TokenType[];

  constructor(
    elementToGetAddressFrom: HTMLElement,
    elementToRenderOnto: HTMLElement,
    tokens?: TokenType[]
  ) {
    this.elementToGetAddressFrom = elementToGetAddressFrom;
    this.elementToRenderOnto = elementToRenderOnto;
    this.loadingContainer = null;
    this.errorContainer = null;
    this.tokens = tokens || []; // if tokens is not provided, it defaults to an empty array
  }

  public async appendENSName(): Promise<void> {
    if (!this.elementToGetAddressFrom || !this.elementToRenderOnto) return;
    if (
      this.elementToRenderOnto.getElementsByClassName('balances-box').length > 0
    )
      return;
    const nameWithENS = this.elementToGetAddressFrom;
    const hasChild = this.elementToRenderOnto
      ? hasChildElementWithClassName('box-header', this.elementToRenderOnto)
      : true;
    if (hasChild) return;

    const filteredENSText = nameWithENS?.innerText
      ? extractEthAddress(nameWithENS.innerText)
      : null;
    if (nameWithENS && filteredENSText) {
      try {
        const ensAddress: addressType | null = filteredENSText
          ? await fetchAddressForENSName(filteredENSText.trim())
          : null;
        if (ensAddress) {
          this.displayLoadingUI();
          const balancesFetcher = new balancesFetcherModule(ensAddress);
          const boxEl = DOMHelper.buildBox('balances-box');
          const boxHeader = DOMHelper.buildBoxHeader(ensAddress);
          const toggleButton = DOMHelper.addToggleButton(boxEl); // Creating toggle button
          boxHeader.appendChild(toggleButton); // Appending toggle button to the header
          toggleButton.addEventListener('click', () => {
            // Add event listener
            const valuesContainer =
              boxEl.getElementsByClassName('values-container')[0];
            if (valuesContainer) {
              valuesContainer.classList.toggle('hidden');
            }
          });
          boxEl.appendChild(boxHeader);
          const valueFields = [
            {
              title: 'Address',
              value: ensAddress,
            },
            {
              title: 'Balance',
              value: `${await balancesFetcher.getFormattedBalance()} Eth`,
            },
          ];
          this.removeLoadingUI();

          const boxValuesContainer =
            DOMHelper.createValuesContainer(valueFields);
          boxEl.appendChild(boxValuesContainer);
          this.elementToRenderOnto.appendChild(boxEl);
        } else {
          throw new Error('Failed to fetch ENS address');
        }
      } catch (error: any) {
        this.displayErrorUI(error.message);
      }
    }
  }

  private displayLoadingUI(): void {
    if (!this.elementToRenderOnto) return;
    DOMHelper.addLoadingUI(this.elementToRenderOnto);
  }

  private removeLoadingUI(): void {
    if (!this.elementToRenderOnto) return;

    let loadingContainerElements =
      this.elementToRenderOnto.getElementsByClassName('loading-container');
    const loadingContainer = loadingContainerElements
      ? loadingContainerElements[0]
      : null;

    if (loadingContainer) {
      this.elementToRenderOnto.removeChild(loadingContainer);
      this.loadingContainer = null;
    }
  }

  private displayErrorUI(errorMessage: string): void {
    if (!this.elementToRenderOnto) return;

    DOMHelper.addErrorUI(this.elementToRenderOnto, errorMessage);
  }

  private removeErrorUI(): void {
    if (this.errorContainer) {
      DOMHelper.removeElement(this.errorContainer);
      this.errorContainer = null;
    }
  }
}
