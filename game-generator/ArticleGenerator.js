import { config } from 'dotenv';
import { OpenAI } from 'openai';

/**
 * This the ArticleGenerator tool, it is a separate utility from the main game. That is a prototype of how daily games could be generated from the FT's articles.
 * This 'library' would be used by the FT team to generate the daily games.
 */

// Load environment variables from.env file
config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

class ArticleGenerator {
    async fetchArticleText() {
        try {
            const response = await fetch('https://ft.com/backend/article');
            return await response.text();
        } catch (error) {
            console.error('Error fetching article text:', error);
            throw error;
        }
    }

    async generateModifiedArticleText(
        articleText,
        difficulty,
        modificationType
    ) {
        try {
            let numModifications;
            switch (difficulty) {
                case 'easy':
                    numModifications = 2;
                    break;
                case 'medium':
                    numModifications = 4;
                    break;
                case 'hard':
                    numModifications = 6;
                    break;
                default:
                    throw new Error('Invalid difficulty level');
            }

            let modificationPrompt;
            switch (modificationType) {
                case 'incorrect':
                    modificationPrompt = `Please modify this article excerpt by adding ${numModifications} incorrect facts/claims in [square brackets].`;
                    break;
                case 'surprising':
                    modificationPrompt = `Please modify this article excerpt by adding ${numModifications} surprising but true facts in (parentheses).`;
                    break;
                case 'both':
                    modificationPrompt = `Please modify this article excerpt by adding ${numModifications} incorrect facts/claims in [square brackets] and ${numModifications} surprising but true facts in (parentheses).`;
                    break;
                default:
                    throw new Error('Invalid modification type');
            }

            const response = await openai.chat.completions.create({
                model: 'gpt-4o', // Latest model supporting structured outputs
                messages: [
                    {
                        role: 'system',
                        content: `You are an article modifier that takes real article excerpts and modifies them to create a fact-checking game.
          You will identify key facts/claims and generate plausible but incorrect alternatives, as well as correct claims that players might think are incorrect.
          
          The output should follow this format:
          - Use [square brackets] to mark incorrect facts/claims
          - Use (parentheses) to mark correct claims that the player might think are incorrect
          - Leave regular text unchanged for confirmed true facts
          
          For example:
          Input: "Last month Apple released the iPhone 15 for $999. It was a huge success."
          Output: "[Last week] Apple released the [Android 15] for ($999). It was a [massive flop]."`,
                    },
                    {
                        role: 'user',
                        content: `${modificationPrompt}
          
          Original text: ${articleText}`,
                    },
                ],
                response_format: {
                    type: 'json_schema',
                    schema: {
                        type: 'object',
                        properties: {
                            modified_text: {
                                type: 'string',
                                description:
                                    'The modified article text with [] and () sections',
                            },
                            modifications: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        original: {
                                            type: 'string',
                                            description:
                                                'The original text that was modified',
                                        },
                                        modified: {
                                            type: 'string',
                                            description:
                                                'The modified version with [] or ()',
                                        },
                                        type: {
                                            type: 'string',
                                            enum: [
                                                'incorrect',
                                                'surprising_truth',
                                            ],
                                            description:
                                                'Whether this is an incorrect claim or a surprising truth',
                                        },
                                        reason: {
                                            type: 'string',
                                            description:
                                                'Explanation of why this modification was made',
                                        },
                                    },
                                    required: [
                                        'original',
                                        'modified',
                                        'type',
                                        'reason',
                                    ],
                                    additionalProperties: false,
                                },
                            },
                        },
                        required: ['modified_text', 'modifications'],
                        additionalProperties: false,
                    },
                },
                temperature: 0.7,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating modified article text:', error);
            throw error;
        }
    }

    async generateGameArticle(difficulty, modificationType) {
        try {
            const articleText = await this.fetchArticleText();
            return await this.generateModifiedArticleText(
                articleText,
                difficulty,
                modificationType
            );
        } catch (error) {
            console.error('Error generating game article:', error);
            throw error;
        }
    }
}

export { ArticleGenerator };
