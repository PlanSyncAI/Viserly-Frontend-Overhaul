import { BookOpen, Clock, FileText, PlayCircle } from 'lucide-react'

const sections = [
  {
    title: 'Data Import',
    articles: [
      {
        number: 1,
        time: '8m',
        title: 'How To: Importing Contact Data',
        description:
          'A guide on how to best import contact data into your Viserly system',
        file: 'ContactImport.pdf',
      },
      {
        number: 2,
        time: '6m',
        title: 'How To: Importing Account Data',
        description:
          'An overview of how to import Account information into your Viserly system.',
        file: 'AccountImport.pdf',
      },
    ],
  },
  {
    title: 'Getting Started',
    articles: [
      {
        number: 1,
        time: '11m',
        title: 'New User Guide',
        description:
          'Start your Viserly journey here. This article goes over the basic steps to getting yourself up and running with the Viserly system!',
        file: 'newUserGuide.pdf',
      },
      {
        number: 2,
        time: '11m',
        title: 'How To: Create a Campaign',
        description:
          'A guide to understanding how to effectively target your plan participants with campaigns',
        file: 'HowToCreateaCampaign.pdf',
      },
      {
        number: 3,
        time: '8m',
        title: 'How To: Create an Email Template',
        description:
          'A guide to understanding how to build email templates using Viserly data to most effectively communicate with your plan participants.',
        file: 'HowToCreateanEmail.pdf',
      },
      {
        number: 4,
        time: '12m',
        title: 'How To: Create a Segmentation',
        description:
          'A guide to understanding how to use Viserly data to create custom list of segmented participants',
        file: 'HowToCreateSegmentation.pdf',
      },
    ],
  },
  {
    title: 'Video Guides',
    articles: [
      {
        number: 1,
        time: '3m',
        title:
          'How to Creat a Targeted Communication Campaign for High Net Worth Individuals',
        description:
          'Creating a Targeted Communication Campaign for High Net Worth Individuals',
        file: 'segmentationGuide.mp4',
        isVideo: true,
      },
    ],
  },
]

function ArticleCard({ article }) {
  const isVideo = article.isVideo
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all duration-200">
      {/* Top row: badge + time */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
          {isVideo ? (
            <PlayCircle size={13} />
          ) : (
            <FileText size={13} />
          )}
          Article {article.number}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Clock size={12} />
          {article.time}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">
        {article.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        {article.description}
      </p>

      {/* File reference */}
      <div className="border-t border-slate-100 pt-3">
        <code className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
          {article.file}
        </code>
      </div>
    </div>
  )
}

export default function LearningCenter() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 pb-2">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-medium">
          <BookOpen size={16} />
          Learning Center
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Become a Viserly Master
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Comprehensive guides and tutorials to help you get the most out of
          your experience. From basic setup to advanced integrations.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="text-xl font-bold text-slate-900 mb-4 pl-4 border-l-4 border-primary-500">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.articles.map((article) => (
              <ArticleCard key={article.file} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
