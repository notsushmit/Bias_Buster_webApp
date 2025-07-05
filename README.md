# Bias Buster - AI-Powered News Bias Analysis

A comprehensive web application that analyzes news articles for bias, factuality, and provides comparative coverage from multiple sources with simulated social media sentiment analysis and advanced text-to-speech capabilities.

## 🌐 Live Demo

**[View Live Application](https://leafy-chimera-e2570b.netlify.app/)**

## 📸 Screenshots

![Main Interface](https://github.com/user-attachments/assets/4e9de2ff-1b99-4e49-9b27-05f277287336)
*Main article analysis interface with bias detection*

![Dashboard Analytics](https://github.com/user-attachments/assets/27834fe8-481c-4f23-a533-b707f8022f16)
*Personal reading analytics dashboard*

![Source Directory](https://github.com/user-attachments/assets/75083a4c-6cc7-425d-8cd6-e7261c40a436)
*Comprehensive news source directory with bias ratings*

![Comparative Coverage](https://github.com/user-attachments/assets/45577e2f-927e-44bb-941a-8aad496658a5)
*Side-by-side comparison of how different sources frame stories*

![Text-to-Speech Feature](https://github.com/user-attachments/assets/a2c86298-9b99-45c5-8384-0e43f18c4314)
*![Screenshot 2025-07-05 142207](https://github.com/user-attachments/assets/ddb35a98-c274-4258-a49f-313db0d24079)
Advanced text-to-speech controls with multiple voice options*
![Screenshot 2025-07-05 141700](https://github.com/user-attachments/assets/6b94e71f-8642-4e04-a7aa-aad46160ef22)

## ✨ Features

### 🔍 **Real-time Bias Detection**
- **Political Bias Analysis**: Detects left, center-left, center, center-right, and right-leaning content
- **Emotional Language Detection**: Identifies sensationalized and emotionally charged language
- **Factuality Assessment**: Rates content reliability on a 0-10 scale
- **Content Highlighting**: Visual indicators for biased or emotional language

### 📊 **Comparative Coverage**
- **Multi-Source Analysis**: Shows how different news outlets frame the same story
- **Bias Spectrum Visualization**: Visual representation of political leanings across sources
- **Sentiment Comparison**: Compares emotional tone across different publications
- **Source Credibility Ratings**: Displays factuality scores for each news source

### 🗣️ **Advanced Text-to-Speech**
- **High-Quality AI Voices**: Powered by ElevenLabs API with 8 premium voice options
- **Dual Reading Modes**: 
  - **Headers Mode**: Reads all page headings in a natural narrative flow
  - **Content Mode**: Reads main article content with intelligent text processing
- **Customizable Playback**: Adjustable speed (0.5x-2.0x), volume, and voice selection
- **Smart Content Processing**: Automatically handles long content with chunking
- **Fallback Support**: Browser speech synthesis as backup

### 📱 **Social Media Simulation**
- **Realistic Reactions**: Generates authentic social media responses based on article sentiment
- **Platform-Specific Comments**: Tailored reactions for Reddit, Twitter, and other platforms
- **Engagement Metrics**: Simulated interaction counts and sentiment analysis
- **Top Comments**: Curated selection of representative user responses

### 📈 **Personal Analytics Dashboard**
- **Reading Habits Tracking**: Monitor your news consumption patterns over time
- **Bias Exposure Analysis**: Visualize your exposure to different political perspectives
- **Source Diversity Metrics**: Track the variety of news sources you consume
- **Reading Streaks**: Gamified reading habit tracking

### 🌍 **Multilingual Support**
- **5 Languages**: English, Spanish, Japanese, German, and French
- **Automatic Detection**: Browser language detection with manual override
- **RTL Support**: Right-to-left text support for applicable languages
- **Localized Interface**: Fully translated UI elements and messages

### ♿ **Accessibility Features**
- **Colorblind Support**: 6 specialized color themes including protanopia, deuteranopia, tritanopia
- **High Contrast Mode**: Enhanced visibility for users with visual impairments
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Compatibility**: ARIA labels and semantic HTML structure
- **Focus Management**: Clear focus indicators and logical tab order

### 🎨 **Modern UI/UX**
- **Aurora Backgrounds**: Dynamic animated backgrounds with glassmorphism effects
- **Click Effects**: Interactive spark animations on user interactions
- **Dark/Light Themes**: Automatic system preference detection with manual toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Smooth Animations**: Micro-interactions and transition effects

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for utility-first styling and responsive design
- **Lucide React** for consistent iconography
- **Context API** for state management

### **APIs & Services**
- **NewsAPI.org**: Primary news aggregation (100 requests/day free tier)
- **GNews.io**: Alternative news source and search (100 requests/day free tier)
- **ElevenLabs**: High-quality text-to-speech synthesis
- **Custom NLP**: Local bias detection and sentiment analysis

### **Build Tools**
- **Vite**: Fast development server and build tool
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing with Autoprefixer

### **Deployment**
- **Netlify**: Continuous deployment and hosting
- **GitHub**: Version control and source code management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with ES2020 support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bias-buster.git
   cd bias-buster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### API Configuration

The application comes pre-configured with API keys, but you can update them:

1. Navigate to the **API Settings** tab in the application
2. Enter your API keys:
   - **NewsAPI**: Get from [newsapi.org](https://newsapi.org)
   - **GNews**: Get from [gnews.io](https://gnews.io)
3. Keys are stored locally in your browser

## 📖 Usage Guide

### Analyzing Articles

1. **Paste Article URL**: Copy any news article URL into the input field
2. **Click Analyze**: The AI will process the content and extract bias indicators
3. **Review Results**: Examine political bias, factuality scores, and highlighted content
4. **Compare Sources**: View how other outlets cover the same story
5. **Check Social Reactions**: See simulated social media responses

### Text-to-Speech

1. **Select Reading Mode**: Choose between "Headers" or "Content"
2. **Choose Voice**: Select from 8 high-quality AI voices
3. **Adjust Settings**: Customize speed, volume, and other preferences
4. **Start Reading**: Click play to begin audio narration
5. **Control Playback**: Use pause, resume, and stop controls as needed

### Dashboard Analytics

1. **View Reading Stats**: Monitor articles analyzed, bias alerts, and source diversity
2. **Track Bias Exposure**: See your consumption across the political spectrum
3. **Analyze Trends**: Review reading patterns over time
4. **Set Goals**: Use reading streaks to build consistent news consumption habits

## 🔧 Configuration

### Environment Variables
```env
# API Keys (stored in localStorage)
NEWS_API_KEY=your_newsapi_key
GNEWS_API_KEY=your_gnews_key
ELEVENLABS_API_KEY=ap2_65657be6-38e9-40a2-aa90-920efd4e51ba
```

### Customization Options

- **Theme Preferences**: Dark/light mode with system detection
- **Language Settings**: 5 supported languages with automatic detection
- **Accessibility**: Colorblind themes and high contrast options
- **TTS Preferences**: Voice, speed, and volume settings persist across sessions

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ArticleAnalyzer.tsx
│   ├── BiasVisualization.tsx
│   ├── ComparativeCoverage.tsx
│   ├── Dashboard.tsx
│   ├── TextToSpeechControls.tsx
│   └── ...
├── context/            # React Context providers
│   ├── BiasContext.tsx
│   └── LanguageContext.tsx
├── hooks/              # Custom React hooks
│   └── useTextToSpeech.ts
├── services/           # API and utility services
│   ├── articleExtractor.ts
│   ├── biasDetection.ts
│   ├── newsApi.ts
│   ├── socialMedia.ts
│   └── textToSpeech.ts
├── locales/           # Internationalization
│   ├── en.ts
│   ├── es.ts
│   ├── ja.ts
│   ├── de.ts
│   └── fr.ts
└── types/             # TypeScript definitions
    └── language.ts
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 API Rate Limits

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| NewsAPI | 100 requests/day | 500-50,000/day |
| GNews | 100 requests/day | 1,000-100,000/day |
| ElevenLabs | 10,000 characters/month | Unlimited |

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Maintain component modularity (max 300 lines per file)
- Include accessibility considerations
- Test across different browsers and devices



## 🙏 Acknowledgments

- **ElevenLabs** for high-quality text-to-speech API
- **NewsAPI** and **GNews** for news aggregation services
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon library
- **React** and **TypeScript** communities for excellent tooling



## 🔮 Roadmap

- [ ] **Real-time News Monitoring**: Live bias tracking across major news events
- [ ] **Browser Extension**: Analyze articles directly from any website
- [ ] **API Endpoints**: Public API for bias analysis integration
- [ ] **Machine Learning**: Enhanced bias detection with custom ML models
- [ ] **Social Features**: Share analyses and compare reading habits with friends


---

**Built by Hacksmiths for media literacy and informed citizenship**
