import { motion } from 'framer-motion'
import { BookOpen, Clock, FileText, PlayCircle } from 'lucide-react'
import { useToast } from '../components/ui/Toast'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.075, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075 } },
}

const sections = [
  {
    title: 'Data Import',
    articles: [
      { number: 1, time: '8m', title: 'How To: Importing Contact Data', description: 'A guide on how to best import contact data into your Viserly system', file: 'ContactImport.pdf' },
      { number: 2, time: '6m', title: 'How To: Importing Account Data', description: 'An overview of how to import Account information into your Viserly system.', file: 'AccountImport.pdf' },
    ],
  },
  {
    title: 'Getting Started',
    articles: [
      { number: 1, time: '11m', title: 'New User Guide', description: 'Start your Viserly journey here. This article goes over the basic steps to getting yourself up and running with the Viserly system!', file: 'newUserGuide.pdf' },
      { number: 2, time: '11m', title: 'How To: Create a Campaign', description: 'A guide to understanding how to effectively target your plan participants with campaigns', file: 'HowToCreateaCampaign.pdf' },
      { number: 3, time: '8m', title: 'How To: Create an Email Template', description: 'A guide to understanding how to build email templates using Viserly data to most effectively communicate with your plan participants.', file: 'HowToCreateanEmail.pdf' },
      { number: 4, time: '12m', title: 'How To: Create a Segmentation', description: 'A guide to understanding how to use Viserly data to create custom list of segmented participants', file: 'HowToCreateSegmentation.pdf' },
    ],
  },
  {
    title: 'Video Guides',
    articles: [
      { number: 1, time: '3m', title: 'How to Create a Targeted Communication Campaign for High Net Worth Individuals', description: 'Creating a Targeted Communication Campaign for High Net Worth Individuals', file: 'segmentationGuide.mp4', isVideo: true },
    ],
  },
]

function ArticleCard({ article, onClick }) {
  const isVideo = article.isVideo
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400">
          {isVideo ? <PlayCircle size={13} /> : <FileText size={13} />}
          Article {article.number}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Clock size={12} />
          {article.time}
        </span>
      </div>

      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">
        {article.title}
      </h4>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
        {article.description}
      </p>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <code className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
          {article.file}
        </code>
      </div>
    </motion.div>
  )
}

export default function LearningCenter() {
  const { showToast } = useToast()
  return (
    <motion.div
      className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center space-y-3 pb-2">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 text-sm font-medium">
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
      </motion.div>

      {/* Sections */}
      {sections.map((section) => (
        <motion.section key={section.title} variants={fadeUp}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pl-4 border-l-4 border-primary-500">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.articles.map((article) => (
              <ArticleCard key={article.file} article={article} onClick={() => showToast(`"${article.title}" will be available for download soon`, 'info')} />
            ))}
          </div>
        </motion.section>
      ))}
    </motion.div>
  )
}
