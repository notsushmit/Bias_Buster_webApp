export const ja = {
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    save: '保存',
    cancel: 'キャンセル',
    close: '閉じる',
    search: '検索',
    filter: 'フィルター',
    analyze: '分析',
    analyzing: '分析中...',
    analyzeNow: '今すぐ分析',
    viewOriginal: '元記事を見る',
    readMore: '続きを読む',
    showLess: '少なく表示',
    noResults: '結果が見つかりません',
    tryAgain: '再試行',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    settings: '設定',
    language: '言語',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード'
  },
  header: {
    title: 'バイアスバスター',
    articleAnalyzer: '記事分析器',
    dashboard: 'ダッシュボード',
    sourceDirectory: 'ソースディレクトリ',
    apiSettings: 'API設定'
  },
  analyzer: {
    hero: {
      badge: 'AI搭載バイアス検出',
      title: '隠れた',
      subtitle: 'メディアバイアスを発見',
      description: '高度なAIを使用して、あらゆるニュース記事を瞬時に分析し、政治的バイアス、感情的言語、事実性を検出します。異なる情報源が同じ話をどのように枠組み化するかを確認してください。',
      placeholder: 'ここにニュース記事のURLを貼り付けてください...',
      examples: 'これらのサンプル記事を試してください:'
    },
    analysis: {
      complete: '分析完了',
      aiResults: 'AI搭載バイアス検出結果',
      source: 'ソース',
      author: '著者',
      published: '公開日',
      politicalBias: '政治的バイアス',
      factuality: '事実性',
      emotionalLanguage: '感情的言語',
      politicalLeaning: 'コンテンツで検出された政治的傾向',
      reliabilityAssessment: '信頼性と正確性の評価',
      emotionalIntensity: '言語の感情的強度'
    },
    bias: {
      left: '左派',
      centerLeft: '中道左派',
      center: '中道',
      centerRight: '中道右派',
      right: '右派',
      high: '高',
      medium: '中',
      low: '低',
      highlyReliable: '非常に信頼できる',
      moderatelyReliable: 'ある程度信頼できる',
      lessReliable: 'あまり信頼できない'
    },
    coverage: {
      title: '比較報道',
      description: '異なる情報源がこの話をどのように枠組み化するか',
      factuality: '事実性',
      tone: 'トーン',
      positive: 'ポジティブ',
      negative: 'ネガティブ',
      neutral: 'ニュートラル',
      noResults: '比較報道が見つかりません',
      tryRecent: 'より最近の、または人気のある記事を分析してみてください'
    },
    highlights: {
      title: 'コンテンツ分析',
      emotionalLanguage: '感情的言語',
      potentialBias: '潜在的バイアス'
    },
    social: {
      title: 'ソーシャルメディアの反応',
      interactions: 'インタラクション',
      topComments: 'トップコメント:'
    },
    errors: {
      title: '分析エラー',
      extractionFailed: '提供されたURLから記事コンテンツを抽出できませんでした',
      analysisGeneral: '分析中にエラーが発生しました'
    }
  },
  dashboard: {
    hero: {
      badge: '個人分析',
      title: 'あなたの読書',
      subtitle: '分析',
      description: 'ニュース消費パターン、バイアス露出、読書習慣を時間の経過とともに追跡します。'
    },
    stats: {
      articlesAnalyzed: '分析された記事',
      biasAlerts: 'バイアスアラート',
      sourcesTracked: '追跡されたソース',
      readingStreak: '読書連続記録',
      days: '日'
    },
    charts: {
      biasHistory: 'バイアス露出履歴',
      lastDays: '過去5日間の読書パターン',
      topSources: 'トップソース',
      mostRead: '最も読まれたニュースソース',
      articles: '記事'
    },
    bias: {
      left: '左派',
      center: '中道',
      right: '右派'
    }
  },
  sources: {
    title: 'ニュースソースディレクトリ',
    description: '世界の主要ニュース組織のバイアス評価と事実性スコアを探索します。',
    search: 'ニュースソースを検索...',
    allBias: 'すべてのバイアスタイプ',
    politicalBias: '政治的バイアス',
    factuality: '事実性',
    category: 'カテゴリ',
    verifiedSource: '検証済みソース',
    country: '国',
    categories: {
      international: '国際',
      national: '国内',
      business: 'ビジネス',
      technology: 'テクノロジー',
      sports: 'スポーツ',
      entertainment: 'エンターテイメント'
    }
  },
  api: {
    title: 'API設定',
    configured: 'APIキーが設定されました！',
    ready: 'NewsAPIとGNewsのキーがすでに設定され、使用準備が整っています。',
    newsApiKey: 'NewsAPIキー',
    gnewsApiKey: 'GNewsAPIキー',
    newsApiPlaceholder: 'newsapi.orgから取得',
    gnewsPlaceholder: 'gnews.ioから取得',
    information: 'API情報:',
    newsApiInfo: '100リクエスト/日（無料プラン）',
    gnewsInfo: '100リクエスト/日（無料プラン）',
    localStorage: 'APIキーはブラウザにローカルに保存されます',
    updateKeys: 'キーを更新',
    saved: '保存されました！'
  }
};