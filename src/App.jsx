import React, { useState } from 'react';
import { Download, Youtube, Loader2, AlertCircle, FileText, Subtitles } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch subtitles');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Youtube className="w-12 h-12 text-red-600" />
          <h1 className="text-4xl font-bold text-red-600 italic font-sans">
            Download Youtube Subtitles
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          获取任何 YouTube 视频的字幕
        </p>
      </div>

      {/* Search Form */}
      <div className="w-full max-w-3xl mb-12">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-lg shadow-lg">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="输入 YouTube 网址 (例如: https://www.youtube.com/watch?v=...)"
            className="flex-1 px-6 py-4 text-lg border-none focus:ring-0 rounded-md outline-none text-gray-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-md transition-colors flex items-center justify-center gap-2 min-w-[160px]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Download className="w-6 h-6" />
                获取字幕
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-3xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-green-100 text-green-600 p-2 rounded-lg">
                <Subtitles className="w-6 h-6" />
              </span>
              字幕已就绪
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video Info / Preview */}
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md">
                   <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${result.video_id}`} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">语言</p>
                  <p className="font-medium flex items-center gap-2">
                    {result.language} ({result.language_code})
                    {result.is_generated && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        自动生成
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Download Actions */}
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-gray-600 mb-2">选择下载格式：</p>
                
                <button
                  onClick={() => downloadFile(result.srt, `youtube_subs_${result.video_id}`, 'srt')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-100 hover:border-red-500 hover:bg-red-50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:bg-red-200">
                      <Subtitles className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">下载 .SRT</p>
                      <p className="text-sm text-gray-500">标准字幕格式，带时间轴</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                </button>

                <button
                  onClick={() => downloadFile(result.txt, `youtube_subs_${result.video_id}`, 'txt')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-200">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">下载 .TXT</p>
                      <p className="text-sm text-gray-500">纯文本格式，无时间轴</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                </button>
              </div>
            </div>
            
            {/* Preview Text */}
            <div className="mt-8 pt-8 border-t border-gray-100">
               <h3 className="font-semibold text-gray-700 mb-4">字幕预览 (前 5 行)</h3>
               <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                 <pre>{result.srt.split('\n').slice(0, 15).join('\n')}...</pre>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-20 max-w-4xl text-center text-gray-500 space-y-4">
        <h2 className="text-2xl font-bold text-purple-900">轻松免费下载 Youtube 字幕!</h2>
        <p>
          这是一个简单的工具，可以在几秒钟内下载 SRT、TXT 格式的任何 YouTube 视频字幕。
          它快速且易于使用。您可以将 YouTube 字幕保存到计算机或手机。
        </p>
      </div>
    </div>
  );
}

export default App;
