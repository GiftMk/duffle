import { FileCard } from './file-card'
import type { File } from './types'
import { UploadCard } from './upload-card'

export const mockFiles: File[] = [
	{
		name: 'q4_financial_report.xlsx',
		uploadedAt: '2026-07-18T20:15:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'profile_picture.png',
		uploadedAt: '2026-07-18T19:42:11Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'project_proposal_v2.pdf',
		uploadedAt: '2026-07-18T15:30:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'deployment_script.sh',
		uploadedAt: '2026-07-17T23:11:45Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'README.md',
		uploadedAt: '2026-07-17T11:05:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'logo_transparent.svg',
		uploadedAt: '2026-07-16T14:22:19Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'backup_database_dump.sql',
		uploadedAt: '2026-07-15T04:00:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'vacation_itinerary.docx',
		uploadedAt: '2026-07-14T18:50:22Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'product_screenshot_01.jpg',
		uploadedAt: '2026-07-13T09:15:33Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'user_feedback_survey.csv',
		uploadedAt: '2026-07-12T16:40:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'archive_2025_assets.zip',
		uploadedAt: '2026-07-10T13:12:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'index.theme.css',
		uploadedAt: '2026-07-09T21:04:15Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'meeting_notes_marketing.txt',
		uploadedAt: '2026-07-08T10:00:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'hero_background_video.mp4',
		uploadedAt: '2026-07-05T17:55:40Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'invoice_INV-9923.pdf',
		uploadedAt: '2026-07-03T08:20:11Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'avatar_placeholder.gif',
		uploadedAt: '2026-07-01T12:00:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'webpack.config.js',
		uploadedAt: '2026-06-28T14:35:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'terms_of_service_draft.pdf',
		uploadedAt: '2026-06-25T11:18:22Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'analytics_dashboard_mockup.png',
		uploadedAt: '2026-06-22T16:05:59Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'employee_handbook.epub',
		uploadedAt: '2026-06-20T09:00:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'sales_pitch_deck.pptx',
		uploadedAt: '2026-06-18T15:45:30Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'audio_interview_clip.mp3',
		uploadedAt: '2026-06-15T13:22:10Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'docker-compose.yml',
		uploadedAt: '2026-06-12T07:11:04Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'receipt_uber_ride.pdf',
		uploadedAt: '2026-06-10T22:34:50Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'pricing_calculator.xlsx',
		uploadedAt: '2026-06-08T11:50:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'vector_icons_pack.ai',
		uploadedAt: '2026-06-05T14:15:25Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'release_notes_v1.0.md',
		uploadedAt: '2026-06-01T10:00:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'client_signoff_sheet.pdf',
		uploadedAt: '2026-05-28T16:44:12Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'tax_return_2025.pdf',
		uploadedAt: '2026-05-25T13:05:00Z',
		id: crypto.randomUUID(),
	},
	{
		name: 'legacy_codebase_migration.zip',
		uploadedAt: '2026-05-20T08:30:15Z',
		id: crypto.randomUUID(),
	},
]

export const FileGrid = () => {
	return (
		<div className='grid grid-cols-3 gap-4'>
			<UploadCard />
			{mockFiles.map((file) => (
				<FileCard key={file.id} file={file} />
			))}
		</div>
	)
}
