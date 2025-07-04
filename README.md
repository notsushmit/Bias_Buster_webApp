# Bias Buster - News Bias Analysis Web App

A comprehensive web application that analyzes news articles for bias, factuality, and provides comparative coverage from multiple sources with simulated social media sentiment analysis.

Demo Link:https://monumental-monstera-01223e.netlify.app/

# Screenshots
![image](https://github.com/user-attachments/assets/e54a5fe1-9f9e-4a9c-b4b2-392aa9bac762)
![image](https://github.com/user-attachments/assets/5eefae34-9f95-4711-b469-3184dbe652c3)
![image](https://github.com/user-attachments/assets/659a27a7-8bc1-4136-99f8-bd4bda72a534)
![image](https://github.com/user-attachments/assets/0fe17c63-e048-40c5-a077-fa69cd3ad9a2)






## Features

- **Real-time Bias Detection**: Analyzes political bias, emotional language, and factuality
- **Comparative Coverage**: Shows how different news sources cover the same story
- **Social Media Simulation**: Generates realistic social media reactions and discussions
- **Source Credibility**: Comprehensive database of news source bias ratings
- **Personal Analytics**: Track your reading habits and bias exposure
- **Modern UI**: Aurora backgrounds, click effects, and glassmorphism design

## API Integration

This application integrates with news APIs and uses local analysis for bias detection:

### News APIs
- **NewsAPI.org**: Primary news aggregation
- **GNews**: Alternative news source and search
- **Article Extraction**: Real-time content parsing

### Analysis Features
- **Custom NLP**: Local bias keyword detection and content analysis
- **Sentiment Analysis**: Keyword-based sentiment detection
- **Social Media Simulation**: Realistic mock social media reactions

## Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Get API Keys**
   - NewsAPI: Register at [newsapi.org](https://newsapi.org)
   - GNews: Get key from [gnews.io](https://gnews.io)

3. **Configure API Keys**
   - Go to the "API Settings" tab in the application
   - Enter your API keys (stored locally in browser)
   - Keys are required for full functionality

4. **Run the Application**
   ```bash
   npm run dev
   ```

## API Rate Limits

- **NewsAPI**: 100 requests/day (free tier)
- **GNews**: 100 requests/day (free tier)

## Usage

1. **Analyze Articles**: Paste any news article URL to get instant bias analysis
2. **Compare Coverage**: See how different sources frame the same story
3. **Check Social Sentiment**: View simulated social media reactions
4. **Track Reading Habits**: Monitor your news consumption patterns
5. **Explore Sources**: Browse comprehensive news source directory

## Technical Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios for API requests
- **Content Extraction**: Custom article parsing with fallbacks
- **Bias Detection**: Multi-layered analysis combining source ratings and content analysis
- **Social Simulation**: Realistic mock social media reactions based on article content

## Privacy & Security

- API keys stored locally in browser (localStorage)
- No server-side data storage
- CORS-compliant API requests
- Client-side content processing

