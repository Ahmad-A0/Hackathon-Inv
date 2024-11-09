import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: 'https://api.openai.com/v1'  // Explicitly set the base URL
});

// Default translations for all languages
export const defaultTranslations = {
    English: {
        // Problem content
        title: 'Quadratic Equations',
        description: 'Solve the following equation:',
        equation: 'x² + 5x + 6 = 0',
        explanation:
            'This is a quadratic equation in standard form (ax² + bx + c = 0). To solve it, you need to find the values of x that make this equation true. You can use factoring, completing the square, or the quadratic formula.',
        // AI Tutor UI
        holdToSpeak: 'Hold to speak',
        speaking: 'Listening...',
        // Solution marking
        markSolution: 'Mark Solution',
        marking: 'Marking...',
        feedback: 'Feedback',
    },
    Spanish: {
        title: 'Ecuaciones Cuadráticas',
        description: 'Resuelve la siguiente ecuación:',
        equation: 'x² + 5x + 6 = 0',
        explanation:
            'Esta es una ecuación cuadrática en forma estándar (ax² + bx + c = 0). Para resolverla, necesitas encontrar los valores de x que hacen que esta ecuación sea verdadera. Puedes usar factorización, completar el cuadrado o la fórmula cuadrática.',
        holdToSpeak: 'Mantén presionado para hablar',
        speaking: 'Escuchando...',
        markSolution: 'Calificar Solución',
        marking: 'Calificando...',
        feedback: 'Retroalimentación',
    },
    French: {
        title: 'Équations Quadratiques',
        description: "Résolvez l'équation suivante :",
        equation: 'x² + 5x + 6 = 0',
        explanation:
            "Il s'agit d'une équation quadratique sous forme standard (ax² + bx + c = 0). Pour la résoudre, vous devez trouver les valeurs de x qui rendent cette équation vraie. Vous pouvez utiliser la factorisation, la méthode de complétion du carré ou la formule quadratique.",
        holdToSpeak: 'Maintenir pour parler',
        speaking: 'Écoute...',
        markSolution: 'Évaluer la Solution',
        marking: 'Évaluation...',
        feedback: 'Commentaires',
    },
};

export async function generateTranslations(targetLanguage) {
    try {
        const systemPrompt = `You are a professional translator specializing in educational content. 
        You maintain mathematical accuracy while ensuring cultural appropriateness.
        Always respond with a valid JSON object containing exactly these keys: 
        title, description, equation, explanation, holdToSpeak, speaking, markSolution, marking, feedback`;

        const userPrompt = `Translate the following educational content and UI strings to ${targetLanguage}:
        
        Problem content:
        title: "Quadratic Equations"
        description: "Solve the following equation:"
        equation: "x² + 5x + 6 = 0"
        explanation: "This is a quadratic equation in standard form (ax² + bx + c = 0). To solve it, you need to find the values of x that make this equation true. You can use factoring, completing the square, or the quadratic formula."
        
        UI strings:
        holdToSpeak: "Hold to speak"
        speaking: "Listening..."
        markSolution: "Mark Solution"
        marking: "Marking..."
        feedback: "Feedback"`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',  // Changed to use standard GPT-4 model
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'translation_response',
                    schema: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            description: { type: 'string' },
                            equation: { type: 'string' },
                            explanation: { type: 'string' },
                            holdToSpeak: { type: 'string' },
                            speaking: { type: 'string' },
                            markSolution: { type: 'string' },
                            marking: { type: 'string' },
                            feedback: { type: 'string' },
                        },
                        required: [
                            'title',
                            'description',
                            'equation',
                            'explanation',
                            'holdToSpeak',
                            'speaking',
                            'markSolution',
                            'marking',
                            'feedback',
                        ],
                        additionalProperties: false,
                    },
                },
            },
        });

        console.log(JSON.parse(response.choices[0].message.content));
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Translation generation error:', error);
        throw new Error(error.message || 'Failed to generate translations');
    }
}

export async function markSolution(solution, language) {
    try {
        const systemPrompt = `You are a mathematics tutor. Analyze the student's solution to the quadratic equation x² + 5x + 6 = 0.
        Provide feedback in ${language}. Focus on:
        1. Mathematical accuracy
        2. Method used (factoring, completing square, or quadratic formula)
        3. Step-by-step clarity
        4. Areas for improvement

        Structure your response with:
        - Method identification
        - Step-by-step analysis
        - Correctness of solution
        - Suggestions for improvement`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',  // Changed to use standard GPT-4 model
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: solution },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Solution marking error:', error);
        throw new Error(error.message || 'Failed to mark solution');
    }
}
