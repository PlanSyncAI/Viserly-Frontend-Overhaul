import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import ParticipantData from './pages/ParticipantData'
import ParticipantDetail from './pages/ParticipantDetail'
import PlanData from './pages/PlanData'
import Segmentations from './pages/Segmentations'
import NewSegmentation from './pages/NewSegmentation'
import SegmentationDetail from './pages/SegmentationDetail'
import Templates from './pages/Templates'
import TemplateDetail from './pages/TemplateDetail'
import NewTemplate from './pages/NewTemplate'
import ImportData from './pages/ImportData'
import Campaigns from './pages/Campaigns'
import CampaignDetail from './pages/CampaignDetail'
import CreateCampaign from './pages/CreateCampaign'
import CommunicationHistory from './pages/CommunicationHistory'
import UserProfile from './pages/UserProfile'
import LearningCenter from './pages/LearningCenter'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="participant-data" element={<ParticipantData />} />
        <Route path="participant-data/:id" element={<ParticipantDetail />} />
        <Route path="plan-data" element={<PlanData />} />
        <Route path="segmentations" element={<Segmentations />} />
        <Route path="segmentations/new" element={<NewSegmentation />} />
        <Route path="segmentations/:id" element={<SegmentationDetail />} />
        <Route path="templates" element={<Templates />} />
        <Route path="templates/new" element={<NewTemplate />} />
        <Route path="templates/:id" element={<TemplateDetail />} />
        <Route path="import-data" element={<ImportData />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="campaigns/new" element={<CreateCampaign />} />
        <Route path="campaigns/:id" element={<CampaignDetail />} />
        <Route path="communication-history" element={<CommunicationHistory />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="learning-center" element={<LearningCenter />} />
      </Route>
    </Routes>
  )
}
