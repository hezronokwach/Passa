'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating event titles into local languages,
 * prioritizing English and Swahili based on the event's target African country.
 *
 * @exports translateEventTitle - A function to translate an event title.
 * @exports TranslateEventTitleInput - The input type for the translateEventTitle function.
 * @exports TranslateEventTitleOutput - The output type for the translateEventTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateEventTitleInputSchema = z.object({
  title: z.string().describe('The title of the event to translate.'),
  country: z.string().describe('The target African country for translation.'),
});
export type TranslateEventTitleInput = z.infer<typeof TranslateEventTitleInputSchema>;

const TranslateEventTitleOutputSchema = z.object({
  translatedTitle: z
    .string()
    .describe(
      'The translated title of the event, translated into the most relevant local language (English or Swahili prioritized).'
    ),
});
export type TranslateEventTitleOutput = z.infer<typeof TranslateEventTitleOutputSchema>;

export async function translateEventTitle(input: TranslateEventTitleInput): Promise<TranslateEventTitleOutput> {
  return translateEventTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateEventTitlePrompt',
  input: {schema: TranslateEventTitleInputSchema},
  output: {schema: TranslateEventTitleOutputSchema},
  prompt: `You are a translation expert specializing in African languages.

  Translate the following event title into the most relevant local language for the given African country. Prioritize English or Swahili if they are widely spoken in that country.

  Event Title: {{{title}}}
  Country: {{{country}}}

  If the title is already in the most relevant language, return it without translation.

  Translation:`,
});

const translateEventTitleFlow = ai.defineFlow(
  {
    name: 'translateEventTitleFlow',
    inputSchema: TranslateEventTitleInputSchema,
    outputSchema: TranslateEventTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      translatedTitle: output?.translatedTitle ?? 'Translation failed',
    };
  }
);
