/** biome-ignore-all lint/style/noNonNullAssertion: sample data, dont care */
/** biome-ignore-all lint/suspicious/noNonNullAssertedOptionalChain: sample data, dont care */
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Board, Column, Task } from '@/models'
import {
	boardCollection,
	columnCollection,
	taskCollection,
} from './collections'

const generateTaskCode = (boardInitials: string, increment: number): string => {
	return `${boardInitials}-${increment}`
}

const ecommerceTasks: Task[] = [
	{
		id: uuidv4(),
		code: generateTaskCode('EP', 1),
		title: 'Implement user authentication',
		description:
			'Set up JWT-based authentication with email/password login and OAuth support for Google and GitHub',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('EP', 2),
		title: 'Design product catalog page',
		description:
			'Create responsive grid layout with filtering, sorting, and search functionality',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('EP', 3),
		title: 'Build shopping cart API',
		description:
			'Develop RESTful endpoints for add/remove/update cart items with session management',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('EP', 4),
		title: 'Integrate payment gateway',
		description:
			'Connect Stripe API for secure payment processing with webhook handlers',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('EP', 5),
		title: 'Set up order tracking system',
		description:
			'Implement order status updates and email notifications for customers',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('EP', 6),
		title: 'Optimize database queries',
		description:
			'Add indexes and refactor slow queries identified in performance testing',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('EP', 7),
		title: 'Create admin dashboard',
		description:
			'Build analytics dashboard with sales charts, inventory management, and user metrics',
	},
]

const mobileAppTasks: Task[] = [
	{
		id: uuidv4(),
		code: generateTaskCode('MAR', 1),
		title: 'Conduct user research',
		description:
			'Interview 20 users to gather feedback on current app experience and pain points',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MAR', 2),
		title: 'Create wireframes',
		description:
			'Design low-fidelity wireframes for all main screens following Material Design guidelines',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MAR', 3),
		title: 'Develop new onboarding flow',
		description:
			'Implement 3-step onboarding with interactive tutorials and permission requests',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MAR', 4),
		title: 'Redesign navigation menu',
		description:
			'Replace bottom tab bar with gesture-based navigation and floating action button',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MAR', 5),
		title: 'Update color scheme',
		description:
			'Apply new brand colors and ensure WCAG AA accessibility compliance',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MAR', 6),
		title: 'Test on multiple devices',
		description:
			'QA testing on iOS 16-18 and Android 12-15 across various screen sizes',
	},
]

const marketingTasks: Task[] = [
	{
		id: uuidv4(),
		code: generateTaskCode('MW', 1),
		title: 'Write homepage copy',
		description:
			'Draft compelling hero section, feature highlights, and call-to-action messaging',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MW', 2),
		title: 'Design hero section',
		description:
			'Create eye-catching hero with animated background and product showcase',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MW', 3),
		title: 'Set up contact form',
		description:
			'Implement form validation, spam protection, and email delivery integration',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MW', 4),
		title: 'Add testimonials section',
		description:
			'Design carousel component with customer quotes, photos, and ratings',
	},
	{
		id: uuidv4(),
		code: generateTaskCode('MW', 5),
		title: 'Optimize for SEO',
		description:
			'Add meta tags, schema markup, sitemap, and improve page load performance',
	},
]

const ecommerceColumns: Column[] = [
	{
		id: uuidv4(),
		title: 'Backlog',
		tasks: [ecommerceTasks[0]?.id!, ecommerceTasks[1]?.id!],
	},
	{
		id: uuidv4(),
		title: 'In Progress',
		tasks: [
			ecommerceTasks[2]?.id!,
			ecommerceTasks[3]?.id!,
			ecommerceTasks[4]?.id!,
		],
	},
	{
		id: uuidv4(),
		title: 'Review',
		tasks: [ecommerceTasks[5]?.id!],
	},
	{
		id: uuidv4(),
		title: 'Done',
		tasks: [ecommerceTasks[6]?.id!],
	},
]

const mobileAppColumns: Column[] = [
	{
		id: uuidv4(),
		title: 'To Do',
		tasks: [mobileAppTasks[0]?.id!],
	},
	{
		id: uuidv4(),
		title: 'In Progress',
		tasks: [mobileAppTasks[1]?.id!, mobileAppTasks[2]?.id!],
	},
	{
		id: uuidv4(),
		title: 'Testing',
		tasks: [mobileAppTasks[3]?.id!, mobileAppTasks[4]?.id!],
	},
	{
		id: uuidv4(),
		title: 'Complete',
		tasks: [mobileAppTasks[5]?.id!],
	},
]

const marketingColumns: Column[] = [
	{
		id: uuidv4(),
		title: 'Planning',
		tasks: [marketingTasks[0]?.id!],
	},
	{
		id: uuidv4(),
		title: 'Design',
		tasks: [marketingTasks[1]?.id!, marketingTasks[3]?.id!],
	},
	{
		id: uuidv4(),
		title: 'Development',
		tasks: [marketingTasks[2]?.id!],
	},
	{
		id: uuidv4(),
		title: 'Deployment',
		tasks: [marketingTasks[4]?.id!],
	},
]

export const boards: Board[] = [
	{
		id: uuidv4(),
		title: 'E-commerce Platform',
		columns: ecommerceColumns.map((col) => col.id),
	},
	{
		id: uuidv4(),
		title: 'Mobile App Redesign',
		columns: mobileAppColumns.map((col) => col.id),
	},
	{
		id: uuidv4(),
		title: 'Marketing Website',
		columns: marketingColumns.map((col) => col.id),
	},
]

export const columns: Column[] = [
	...ecommerceColumns,
	...mobileAppColumns,
	...marketingColumns,
]

export const tasks: Task[] = [
	...ecommerceTasks,
	...mobileAppTasks,
	...marketingTasks,
]

export const useSampleData = () => {
	useEffect(() => {
		for (const task of tasks) {
			taskCollection.insert(task)
		}

		for (const column of columns) {
			columnCollection.insert(column)
		}

		for (const board of boards) {
			boardCollection.insert(board)
		}

		return () => {
			boardCollection.delete(boards.map((board) => board.id))
			columnCollection.delete(columns.map((column) => column.id))
			taskCollection.delete(tasks.map((task) => task.id))
		}
	}, [])
}
