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
  private tweetOrProfile: 'tweet' | 'profile';

  constructor(
    addressForProfile: string,
    balanceForProfile: number,
    elementToRenderOnto: HTMLElement,
    tweetOrProfile: 'tweet' | 'profile',
    tokens?: TokenType[]
  ) {
    this.addressForProfile = addressForProfile;
    this.balanceForProfile = balanceForProfile;
    this.elementToRenderOnto = elementToRenderOnto;
    this.loadingContainer = null;
    this.errorContainer = null;
    this.tweetOrProfile = tweetOrProfile;
    this.tokens = tokens || []; // if tokens is not provided, it defaults to an empty array
  }

  public async appendENSName(): Promise<void> {
    if (!this.elementToRenderOnto) return;
    if (
      this.elementToRenderOnto.getElementsByClassName('balances-box').length > 0
    )
      return;
    if (
      DOMHelper.hasChildElementWithClassName(
        'box-header',
        this.elementToRenderOnto
      )
    )
      return;

    const parentElement = this.elementToRenderOnto.parentElement;
    if (
      this.tweetOrProfile === 'tweet' &&
      parentElement &&
      parentElement.querySelector('.balances-box')
    )
      return;
    if (
      this.tweetOrProfile !== 'tweet' &&
      this.elementToRenderOnto.querySelector('.balances-box')
    )
      return;

    try {
      this.displayLoadingUI();
      const boxEl: HTMLElement = this.createBoxElement();
      const boxValuesContainer: HTMLElement = DOMHelper.createValuesContainer(
        this.createValueFields()
      );

      this.removeLoadingUI();
      boxEl.appendChild(boxValuesContainer);
      if (this.tweetOrProfile === 'tweet') {
        const engagmentBarSection = this.elementToRenderOnto.querySelector(
          '[data-testid="reply"]'
        )?.parentElement?.parentElement;
        const parentOfEngagmentBarSection = engagmentBarSection?.parentElement;
        if (engagmentBarSection && parentOfEngagmentBarSection) {
          parentOfEngagmentBarSection.insertBefore(boxEl, engagmentBarSection);
        }
      } else {
        this.elementToRenderOnto.appendChild(boxEl);
      }
    } catch (error: any) {
      this.displayErrorUI(error.message);
    }
  }

  private createValueFields(): Array<{ title: string; value: string }> {
    return [
      {
        title: 'Address',
        value: this.addressForProfile,
      },
      {
        title: 'Balance',
        value: `${this.balanceForProfile} Eth`,
      },
    ];
  }

  private createBoxElement(): HTMLElement {
    const boxEl: HTMLElement = DOMHelper.buildBox('balances-box');
    const boxHeader: HTMLElement = DOMHelper.buildBoxHeader(
      this.addressForProfile
    );
    const toggleButton: HTMLElement = DOMHelper.addToggleButton(boxEl);
    boxHeader.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
      const valuesContainer: Element | undefined =
        boxEl.getElementsByClassName('values-container')[0];
      valuesContainer?.classList.toggle('hidden');
    });

    boxEl.appendChild(boxHeader);

    return boxEl;
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
