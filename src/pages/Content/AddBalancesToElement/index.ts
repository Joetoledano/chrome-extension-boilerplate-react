import { hasChildElementWithClassName } from '../../../lib/helpers';
import { DOMHelper } from '../modules/DOMModule/DOMHelper';

type addressType = `0x${string}`;
type TokenType = {
  symbol?: string;
  name?: string;
};
export class AddBalancesToElement {
  private addressForProfile: string;
  private balanceForProfile: number;

  private elementToRenderOnto: HTMLElement | null;
  private loadingContainer: HTMLElement | null;
  private errorContainer: HTMLElement | null;
  private tokens: TokenType[];

  constructor(
    addressForProfile: string,
    balanceForProfile: number,
    elementToRenderOnto: HTMLElement,
    tokens?: TokenType[]
  ) {
    this.addressForProfile = addressForProfile;
    this.balanceForProfile = balanceForProfile;
    this.elementToRenderOnto = elementToRenderOnto;
    this.loadingContainer = null;
    this.errorContainer = null;
    this.tokens = tokens || []; // if tokens is not provided, it defaults to an empty array
  }

  public async appendENSName(): Promise<void> {
    if (!this.elementToRenderOnto) return;
    if (
      this.elementToRenderOnto.getElementsByClassName('balances-box').length > 0
    )
      return;

    const hasChild: boolean = this.elementToRenderOnto
      ? hasChildElementWithClassName('box-header', this.elementToRenderOnto)
      : true;

    if (hasChild) return;

    try {
      this.displayLoadingUI();
      const boxEl: HTMLElement = DOMHelper.buildBox('balances-box');
      const boxHeader: HTMLElement = DOMHelper.buildBoxHeader(
        this.addressForProfile
      );
      const toggleButton: HTMLElement = DOMHelper.addToggleButton(boxEl); // Creating toggle button
      boxHeader.appendChild(toggleButton); // Appending toggle button to the header

      toggleButton.addEventListener('click', () => {
        // Add event listener
        const valuesContainer: Element | undefined =
          boxEl.getElementsByClassName('values-container')[0];

        if (valuesContainer) {
          valuesContainer.classList.toggle('hidden');
        }
      });

      boxEl.appendChild(boxHeader);

      const balanceValue: number = this.balanceForProfile;
      const valueFields: Array<{ title: string; value: string }> = [
        {
          title: 'Address',
          value: this.addressForProfile,
        },
        {
          title: 'Balance',
          value: `${balanceValue} Eth`,
        },
      ];

      this.removeLoadingUI();

      const boxValuesContainer: HTMLElement =
        DOMHelper.createValuesContainer(valueFields);

      boxEl.appendChild(boxValuesContainer);
      this.elementToRenderOnto.appendChild(boxEl);
    } catch (error: any) {
      this.displayErrorUI(error.message);
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
