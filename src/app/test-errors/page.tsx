'use client';

import Link from 'next/link';
import { useState } from 'react';
import { reportError, addBreadcrumb, captureMessage } from '@/components/ErrorReporter';

export default function ErrorTestPage() {
  const [counter, setCounter] = useState(0);

  const triggerJavaScriptError = () => {
    addBreadcrumb('User triggered JavaScript error', 'test', 'info');
    throw new Error('Test JavaScript Error - This is intentional for testing error monitoring');
  };

  const triggerAsyncError = async () => {
    addBreadcrumb('User triggered async error', 'test', 'info');
    return Promise.reject(new Error('Test Async Error - This is intentional for testing error monitoring'));
  };

  const triggerManualError = () => {
    addBreadcrumb('User triggered manual error report', 'test', 'info');
    const error = new Error('Test Manual Error Report - This is intentional for testing error monitoring');
    reportError(error, {
      component: 'ErrorTestPage',
      action: 'triggerManualError',
      counter: counter,
      timestamp: new Date().toISOString(),
    });
  };

  const triggerMessage = () => {
    addBreadcrumb('User triggered test message', 'test', 'info');
    captureMessage('Test message captured for monitoring', 'info');
    alert('Message sent to Sentry!');
  };

  const triggerResourceError = () => {
    addBreadcrumb('User triggered resource error', 'test', 'info');
    const img = new Image();
    img.src = '/non-existent-image.png';
    document.body.appendChild(img);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Error Monitoring Test Page
          </h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="text-yellow-400 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-yellow-800 font-semibold">Warning</h3>
                <p className="text-yellow-700 text-sm">
                  This page is for testing error monitoring. The buttons below will intentionally trigger errors.
                  Only use this in development or testing environments.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Error Tests</h2>
              
              <button
                onClick={triggerJavaScriptError}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Trigger JavaScript Error
              </button>
              
              <button
                onClick={triggerAsyncError}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Trigger Async Error
              </button>
              
              <button
                onClick={triggerManualError}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Trigger Manual Error Report
              </button>
              
              <button
                onClick={triggerResourceError}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Trigger Resource Error
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Monitoring Tests</h2>
              
              <button
                onClick={triggerMessage}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Test Message
              </button>
              
              <button
                onClick={() => {
                  setCounter(counter + 1);
                  addBreadcrumb(`Counter incremented to ${counter + 1}`, 'interaction', 'info');
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Breadcrumb (Counter: {counter})
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Test</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Set up your Sentry project and add the DSN to your environment variables</li>
              <li>Click the buttons above to trigger different types of errors</li>
              <li>Check your Sentry dashboard to see if the errors are being captured</li>
              <li>Verify that stack traces, breadcrumbs, and context are being sent correctly</li>
              <li>Test the error boundary by triggering a JavaScript error</li>
            </ol>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="inline-block bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
