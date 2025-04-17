"use client";

type ChatHistoryProps = {
  history: {
    id: number;
    question: string;
    answer: string;
    created_at: string;
  }[];
  expandedId: number | null;
  onToggle: (id: number) => void;
};

const RightChatHistory = ({ history, expandedId, onToggle }: ChatHistoryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="chat-history">
      <h3>Chat History</h3>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div 
              className="history-question" 
              onClick={() => onToggle(item.id)}
            >
              {item.question}
              <span className="history-date">{formatDate(item.created_at)}</span>
            </div>
            {expandedId === item.id && (
              <div className="history-answer">
                {item.answer.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .chat-history {
          width: 400px;
          padding: 15px;
          background: #f5f5f5;
          border-left: 1px solid #ddd;
          height: 100vh;
          overflow-y: auto;
        }
        .history-list {
          margin-top: 15px;
        }
        .history-item {
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .history-question {
          cursor: pointer;
          padding: 8px;
          background: #fff;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          font-size: 0.09em;
        }
        .history-question:hover {
          background: #f0f0f0;
          font-size: 0.3em;
          font-size: 0.9em;
        }
        .history-date {
          color: #666;
          
        }
        .history-answer {
          padding: 8px;
          margin-top: 5px;
          background: #e9f7ef;
          border-radius: 4px;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default RightChatHistory;