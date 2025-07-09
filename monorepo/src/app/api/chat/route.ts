import { INSTRUCTION } from '@/utils/constants/manual/instruction';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    const fullPrompt = `${INSTRUCTION}

Current user prompt: "${message}"

Please analyze the above user prompt and respond according to the instruction manual.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          // Consider adding safety_settings here if you're hitting content blocks
          // safety_settings: [
          //   {
          //     category: 'HARM_CATEGORY_HARASSMENT',
          //     threshold: 'BLOCK_NONE',
          //   },
          // ],
        }),
        // Add a timeout for the fetch call to prevent indefinite waiting
        // This is a browser-side fetch, so it might not directly apply a server-side timeout
        // But helpful for understanding if the Gemini API is just taking too long.
        // For serverless functions, the platform's timeout is more relevant.
        signal: AbortSignal.timeout(60000), // 60 seconds timeout
      }
    );

    // If response.ok is false, the Gemini API returned an error status (e.g., 400, 401, 429, 500, 503)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'No body from Gemini API' }));
      console.error('Gemini API returned an error:', response.status, errorData); // Log specific Gemini error
      return NextResponse.json({ 
        error: 'Gemini API call failed', 
        details: errorData, 
        statusCode: response.status 
      }, { status: response.status }); // Pass through Gemini's status code
    }

    const data = await response.json();
    // Check if data.candidates exists and is not empty before accessing data.candidates[0]
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
        console.error('Gemini API response missing expected data:', data);
        return NextResponse.json({ error: 'Gemini API response malformed or empty' }, { status: 500 });
    }
    const geminiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const jsonMatch = geminiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      let jsonString = jsonMatch ? jsonMatch[1] : geminiResponse;
      jsonString = jsonString.trim();

      const parsedResponse = JSON.parse(jsonString);
      // Ensure 'data' property exists before accessing 'data.response'
      if (parsedResponse.response_type === 'normal' && parsedResponse.data && parsedResponse.data.response !== undefined) {
        return NextResponse.json({
          ...parsedResponse,
          message: parsedResponse.data.response,
          data: {
            ...parsedResponse.data,
            message: parsedResponse.data.response
          }
        });
      }

      else if(parsedResponse.response_type === 'create-coin') {
        // You're currently using 'data.data' here, which refers to the raw Gemini API response.
        // It should probably be 'parsedResponse.data' from your JSON parsing.
        const transformedData = {
          name: parsedResponse.data?.name || '', // Use optional chaining for safety
          symbol: parsedResponse.data?.symbol || '',
          description: parsedResponse.data?.description || '',
          assetType: parsedResponse.data?.assetType || '',
          links: parsedResponse.data?.links || [],
          image: null,
          currency: parsedResponse.data?.currency || 'ETH',
          initialPurchaseAmount: parsedResponse.data?.initialPurchaseAmount || ''
        };
        return NextResponse.json({ ...parsedResponse, data: transformedData }); // Return transformed data
      }
      
      // If none of the specific response types match, return the parsed response directly
      return NextResponse.json(parsedResponse);
    } catch (e) {
      console.error('Error parsing Gemini response JSON:', e, 'Raw Gemini response:', geminiResponse);
      // This catch block handles cases where Gemini's response isn't valid JSON,
      // or doesn't match your expected JSON structure.
      try {
        const jsonObjectMatch = geminiResponse.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          const parsedResponse = JSON.parse(jsonObjectMatch[0]);
          if (parsedResponse.response_type === 'normal' && parsedResponse.data && parsedResponse.data.response !== undefined) {
            return NextResponse.json({
              ...parsedResponse,
              message: parsedResponse.data.response,
              data: {
                ...parsedResponse.data,
                message: parsedResponse.data.response
              }
            });
          }
          
          return NextResponse.json(parsedResponse);
        }
      } catch (e2) {
        console.error('Second attempt at parsing Gemini response JSON failed:', e2);
        // If all parsing attempts fail, return the raw Gemini response as a "response" field
        return NextResponse.json({ response: geminiResponse });
      }
      // This line is redundant if the inner try/catch always returns.
      return NextResponse.json({ response: geminiResponse });
    }
  } catch (error) {
    console.error('API Route Outer Error:', error); // Log the full error object
    // For a 503, this outer catch block is the most likely place the error would land
    // if your server is genuinely crashing/timing out.
    // Ensure you're logging 'error' directly, not just a string.
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}