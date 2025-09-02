export type TranslateEventTitleInput = {
  title: string;
  country: string;
};

export type TranslateEventTitleOutput = {
  translatedTitle: string;
};

export async function translateEventTitle(input: TranslateEventTitleInput): Promise<TranslateEventTitleOutput> {
  return {
    translatedTitle: input.title
  };
}
