import { IContainer, IImage, ITextBlock } from "adaptivecards/lib/schema";

export type AdaptiveCardElement = ITextBlock | NonTextAdaptiveCardElement;
export type NonTextAdaptiveCardElement = IContainer | IImage;

export interface IToJSONOptions {
  version?: string;
}
