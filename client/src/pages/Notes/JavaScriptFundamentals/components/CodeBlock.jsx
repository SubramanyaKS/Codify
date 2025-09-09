import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ code }) => {
    return (
        <div className="my-4 overflow-x-auto text-sm sm:text-base">
            <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1.25rem',
                    borderRadius: '0.5rem',
                    background: '#1e1e1e',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                }}
                wrapLines={true}
                wrapLongLines={true}
                codeTagProps={{
                    style: {
                        fontFamily: 'Fira Code, monospace',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                    },
                }}
                lineProps={{
                    style: {
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                    },
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}

export default CodeBlock
