import { formatText } from "./formatText";

export const renderCodeBlock = (code: string) => {
    return (
      <div className="relative my-2">
        <button 
          onClick={() => navigator.clipboard.writeText(code)}
          className="absolute right-2 top-2 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors"
        >
          Copy
        </button>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm border border-gray-200 dark:border-gray-700">
          <code className="text-gray-800 dark:text-gray-200">{code}</code>
        </pre>
      </div>
    );
  };

export  const renderMessageContent = (text: string, isUser: boolean) => {
    if (isUser) {
      return text;
    }

    const codeBlockMatch = text.match(/```[\s\S]*?```/);
    if (codeBlockMatch) {
      const codeContent = codeBlockMatch[0].replace(/```/g, '').trim();
      return (
        <>
          <div dangerouslySetInnerHTML={formatText(text.replace(/```[\s\S]*?```/, ''))} />
          {renderCodeBlock(codeContent)}
        </>
      );
    }

    return <div dangerouslySetInnerHTML={formatText(text)} />;
  };

