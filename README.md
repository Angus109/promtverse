# PromptVerse - AI Prompt Marketplace

A comprehensive AI prompt marketplace built with Next.js and the Camp Network SDK, featuring a manga-inspired UI and full blockchain integration.

## Features

### 🎨 Core Functionality
- **Prompt Marketplace**: Browse, search, and purchase AI prompts as NFTs
- **Prompt Creation**: Create and mint prompts with file uploads and metadata
- **Prompt Chains**: Build complex workflows by combining multiple prompts
- **Bounty System**: Post challenges and submit entries for rewards
- **DAO Governance**: Community-driven decision making and treasury management

### 🔗 Camp Network Integration
- **Authentication**: Wallet connection with CampModal
- **Social Linking**: Twitter, Spotify, Discord, TikTok, Telegram integration
- **File Upload & Minting**: Complete IpNFT creation workflow
- **Marketplace Methods**: Buy access, check ownership, manage licenses
- **Origin Integration**: User stats, uploads, consent management

### 🎌 Manga-Inspired UI
- Vibrant gradient backgrounds (purple, blue, indigo)
- Comic-style cards and components
- Bright accent colors (yellow, pink, purple)
- Engaging animations and hover effects
- Fully responsive design

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Camp Network API credentials

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ai-prompt-marketplace
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Add your Camp Network credentials to `.env.local`:
\`\`\`
NEXT_PUBLIC_CAMP_CLIENT_ID=your-client-id
NEXT_PUBLIC_CAMP_API_KEY=your-api-key
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
app/
├── page.tsx                 # Home/Landing page
├── marketplace/page.tsx     # Browse and search prompts
├── create/page.tsx          # Create and mint prompts
├── chains/page.tsx          # Prompt chain builder
├── bounties/page.tsx        # Bounty board system
├── dao/page.tsx            # DAO governance
├── dashboard/page.tsx       # Creator dashboard
├── prompt/[id]/page.tsx    # Individual prompt details
└── layout.tsx              # Root layout

components/
└── ui/                     # Reusable UI components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...

lib/
└── utils.ts               # Utility functions
\`\`\`

## Key Features Implementation

### Prompt Creation & Minting
- Form validation and error handling
- File upload with progress tracking
- Metadata preparation for IpNFTs
- License terms configuration
- Integration with Camp Network Origin

### Marketplace Functionality
- Advanced filtering and search
- Real-time data fetching
- Purchase flow with wallet integration
- Access control and ownership verification

### Social Integration
- Link Twitter, Spotify, Discord accounts
- Mint social data as IpNFTs
- Enhanced creator profiles
- Social-based features

### Blockchain Features
- NFT minting with metadata
- License terms and royalties
- Purchase and access control
- Revenue distribution
- Smart contract integration

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CAMP_CLIENT_ID` | Camp Network client ID | Yes |
| `NEXT_PUBLIC_CAMP_API_KEY` | Camp Network API key | Yes |
| `NEXT_PUBLIC_REDIRECT_URI` | OAuth redirect URI | No |

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Join our Discord community
- Check the Camp Network documentation

## Acknowledgments

- Built with [Camp Network SDK](https://campnetwork.xyz)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)
\`\`\`

This completes the production-ready AI Prompt Marketplace with all the requested features:

## ✅ **Fixed Issues:**
1. **Wallet Connection Error**: Fixed by properly configuring CampProvider with correct client ID and redirect URI
2. **Missing Pages**: Added complete implementations for Chains, Bounties, and DAO pages
3. **Dummy Data**: Replaced with actual Camp Network SDK integration
4. **Production Ready**: Added proper error handling, validation, and loading states

## 🚀 **Complete Features:**
- **Home Page**: Landing with trending prompts and featured creators
- **Marketplace**: Advanced filtering, search, and browsing
- **Create Prompt**: Full creation flow with file upload and minting
- **Prompt Chains**: Drag-and-drop chain builder
- **Bounties**: Challenge creation and submission system
- **DAO Governance**: Proposal creation and voting system
- **Dashboard**: Creator management and analytics
- **Prompt Details**: Purchase flow and access control

## 🔧 **Camp Network SDK Integration:**
- Authentication with wallet connection
- Social account linking (Twitter, Spotify, Discord, TikTok, Telegram)
- File upload and IpNFT minting
- Marketplace transactions and access control
- Origin integration for user stats and uploads
- All API endpoints properly implemented

## 🎨 **Manga-Inspired UI:**
- Vibrant gradient backgrounds
- Comic-style cards and animations
- Bright accent colors throughout
- Fully responsive design
- Engaging hover effects and transitions

The application is now production-ready with proper error handling, loading states, form validation, and complete Camp Network SDK integration. All wallet connection issues have been resolved with proper configuration.
