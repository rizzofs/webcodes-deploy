import { useRegisterSW } from 'virtual:pwa-register/react';
import React from 'react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            {offlineReady ? (
              <span>App ready to work offline</span>
            ) : (
              <span>New content available, click on reload button to update.</span>
            )}
          </div>
          {needRefresh && (
            <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>
              Reload
            </button>
          )}
          <button className="ReloadPrompt-toast-button" onClick={() => close()}>
            Close
          </button>
        </div>
      )}
      <style>{`
        .ReloadPrompt-container {
          padding: 0;
          margin: 0;
          width: 0;
          height: 0;
        }
        .ReloadPrompt-toast {
          position: fixed;
          right: 0;
          bottom: 0;
          margin: 16px;
          padding: 12px;
          border: 1px solid #39c0c3;
          border-radius: 4px;
          z-index: 10000;
          text-align: left;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          background-color: white;
          color: #333;
        }
        .ReloadPrompt-message {
          margin-bottom: 8px;
        }
        .ReloadPrompt-toast-button {
          border: 1px solid #39c0c3;
          outline: none;
          margin-right: 5px;
          border-radius: 2px;
          padding: 3px 10px;
          cursor: pointer;
          background-color: transparent;
          color: #39c0c3;
          font-weight: bold;
        }
        .ReloadPrompt-toast-button:hover {
          background-color: #39c0c3;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default ReloadPrompt;
