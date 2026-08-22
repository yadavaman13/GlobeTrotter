import { useState, useEffect } from 'react';
import { useTableData, useTheme } from '@/hooks';
import { mockTableData } from './mockTableData'; // ⚠️ DELETE THIS IMPORT when your API is ready
import { useNavigate } from 'react-router';
import Calendar from '@/components/Shared/Form/Calendar/Calendar';
import DateTimePicker from '@/components/Shared/Form/DateTimePicker/DateTimePicker';
import DatePicker from '@/components/Shared/Form/DatePicker/DatePicker';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
import Checkbox from '@/components/Shared/Form/Checkbox/Checkbox';
import PrevButton from '@/components/Shared/Buttons/PrevButton/PrevButton';
import NextButton from '@/components/Shared/Buttons/NextButton/NextButton';
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';
import NotFoundPage from '@/components/Shared/ErrorPages/NotFoundPage/NotFoundPage';
import ForbiddenPage from '@/components/Shared/ErrorPages/ForbiddenPage/ForbiddenPage';
import ServerErrorPage from '@/components/Shared/ErrorPages/ServerErrorPage/ServerErrorPage';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import DeleteToast from '@/components/Shared/Feedback/DeleteToast/DeleteToast';
import Dialog from '@/components/Shared/Feedback/Dialog';
import TabSwitchModal from '@/components/Shared/Feedback/TabSwitchModal';
import { Drawer, NotificationFeed } from '@/components/Shared/Feedback/Drawer';
import CancelButton from '@/components/Shared/Buttons/CancelButton/CancelButton';
import SaveDetailsButton from '@/components/Shared/Buttons/SaveDetailsButton/SaveDetailsButton';
import TabPills from '@/components/Shared/Navigation/TabPills/TabPills';
import EditButton from '@/components/Shared/Buttons/EditButton/EditButton';
import DeleteButton from '@/components/Shared/Buttons/DeleteButton/DeleteButton';
import ClearAllButton from '@/components/Shared/Buttons/ClearAllButton';
import { useToast } from '@/components/Shared/Feedback/Toast';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Textarea from '@/components/Shared/Form/Textarea/Textarea';
import ButtonUpload from '@/components/Shared/Form/Upload/ButtonUpload/ButtonUpload';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import MetricCard, { MetricCardGrid } from '@/components/Shared/DataDisplay/MetricCard/MetricCard';

import ActivitiesFeedCard from '@/components/Shared/DataDisplay/ActivitiesFeed/ActivitiesFeedCard';
import KpiLineChartCard from '@/components/Shared/DataDisplay/KpiLineChartCard/KpiLineChartCard';
import KanbanBoard from '@/components/Shared/DataDisplay/KanbanBoard/KanbanBoard';
import Timeline from '@/components/Shared/DataDisplay/Timeline/Timeline';
import { Accordion, AccordionItem } from '@/components/Shared/DataDisplay/Accordion';
import ToggleButton from '@/components/Shared/Buttons/ToggleButton/ToggleButton';
import ViewToggle from '@/components/Shared/Buttons/ViewToggle/ViewToggle';
import {
    Calendar as CalendarIcon,
    Settings as GearIcon,
    List as ListIcon,
    CheckCircle2 as CheckCircleIcon,
    XCircle as XCircleIcon,
    Download as DownloadIcon,
    Sparkles as SparkleIcon,
    CalendarDays as CalendarDaysIcon,
    Clock as ClockIcon,
    IndianRupee as RupeeIcon,
    Star as StarIcon,
    Users as UsersIcon,
    Sun,
    Moon,
} from 'lucide-react';

import './ComponentsShowcase.scss';

const SHOWCASE_KPI_DATA = {
    'Last 6 Month': [
        { label: 'Jan', current: 0, previous: 0 },
        { label: 'Feb', current: 3.7, previous: 2.1 },
        { label: 'Mar', current: 3.2, previous: 3.9 },
        { label: 'Apr', current: 6.5, previous: 5.8 },
        { label: 'May', current: 5.4, previous: 6.7 },
        { label: 'Jun', current: 7.5, previous: 7.0 },
    ],
    'Last 12 Month': [
        { label: 'Jul', current: 2.1, previous: 1.5 },
        { label: 'Aug', current: 4.3, previous: 3.2 },
        { label: 'Sep', current: 5.0, previous: 4.1 },
        { label: 'Oct', current: 4.2, previous: 4.8 },
        { label: 'Nov', current: 6.8, previous: 5.5 },
        { label: 'Dec', current: 8.2, previous: 7.1 },
        { label: 'Jan', current: 4.0, previous: 3.5 },
        { label: 'Feb', current: 5.5, previous: 4.2 },
        { label: 'Mar', current: 6.2, previous: 5.0 },
        { label: 'Apr', current: 7.0, previous: 6.1 },
        { label: 'May', current: 6.4, previous: 6.8 },
        { label: 'Jun', current: 8.5, previous: 7.5 },
    ],
    'Year to Date': [
        { label: 'Jan', current: 1.8, previous: 1.2 },
        { label: 'Feb', current: 3.5, previous: 2.8 },
        { label: 'Mar', current: 4.9, previous: 3.7 },
        { label: 'Apr', current: 6.2, previous: 4.5 },
        { label: 'May', current: 7.1, previous: 5.8 },
        { label: 'Jun', current: 8.0, previous: 6.4 },
    ],
    'This Month': [
        { label: 'W1', current: 1.2, previous: 0.8 },
        { label: 'W2', current: 2.8, previous: 2.1 },
        { label: 'W3', current: 4.5, previous: 3.6 },
        { label: 'W4', current: 6.9, previous: 5.2 },
    ],
};

function ComponentsShowcase() {
    const navigate = useNavigate();
    const [errorPreviewCode, setErrorPreviewCode] = useState('404');
    const [standaloneSearchVal, setStandaloneSearchVal] = useState('');
    const [standaloneCheckVal, setStandaloneCheckVal] = useState(false);
    const [datePickerVal, setDatePickerVal] = useState('21-07-2026');

    const { success, error, warning, info } = useToast();
    const [val1, setVal1] = useState('');
    const [val2, setVal2] = useState('');
    const [val3, setVal3] = useState('');
    const [val4, setVal4] = useState('');
    const [val5, setVal5] = useState('gear');
    const [toastVisible, setToastVisible] = useState(false);
    const [toastCount, setToastCount] = useState(4);

    // Textarea demo states
    const [textareaBasic, setTextareaBasic] = useState('');
    const [textareaLimited, setTextareaLimited] = useState('');
    const [textareaAutoGrow, setTextareaAutoGrow] = useState('');
    const [textareaResize, setTextareaResize] = useState('');

    const [isDangerOpen, setIsDangerOpen] = useState(false);
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isCustomOpen, setIsCustomOpen] = useState(false);
    const [customName, setCustomName] = useState('');
    const [customEmail, setCustomEmail] = useState('');
    const [customRole, setCustomRole] = useState('');
    const [customBio, setCustomBio] = useState('');
    const [customDob, setCustomDob] = useState('');
    const [customSubscribe, setCustomSubscribe] = useState(true);

    // Drawer & TabPills demo states
    const [isFeedDrawerOpen, setIsFeedDrawerOpen] = useState(false);
    const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);
    const [demoDrawerPosition, setDemoDrawerPosition] = useState('right');
    const [demoDrawerSize, setDemoDrawerSize] = useState('md');
    const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
    const [demoTabPillVal, setDemoTabPillVal] = useState('all');
    const [isTabModalOpen, setIsTabModalOpen] = useState(false);

    const sampleTimelineItems = [
        {
            id: '1',
            title: 'Invoice Draft Created',
            subtitle: 'Created by Itesh Prajapati',
            time: 'July 18, 2026 - 09:30 AM',
            description: 'Invoice INV-2024-001 draft initialized for EdgeTech Solutions.',
            variant: 'primary',
            badge: 'Draft',
            badgeVariant: 'neutral',
        },
        {
            id: '2',
            title: 'Client Review & Approval',
            subtitle: 'Approved by Client Manager',
            time: 'July 19, 2026 - 02:15 PM',
            description: 'Invoice approved by client financial department.',
            variant: 'success',
            badge: 'Approved',
            badgeVariant: 'success',
        },
        {
            id: '3',
            title: 'Payment Pending',
            subtitle: 'Due date in 5 days',
            time: 'July 20, 2026 - 11:00 AM',
            description: 'Awaiting electronic bank transfer confirmation.',
            variant: 'warning',
            badge: 'Pending',
            badgeVariant: 'warning',
            active: true,
        },
    ];

    const stringOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

    const objectOptions = [
        {
            value: 'list',
            label: 'View List',
            icon: ListIcon,
            description: 'Manage task lists and details',
        },
        {
            value: 'calendar',
            label: 'Calendar Event',
            icon: CalendarIcon,
            description: 'Schedule appointments and events',
        },
        {
            value: 'gear',
            label: 'Settings Configuration',
            icon: GearIcon,
            description: 'Modify configuration options',
        },
        {
            value: 'check',
            label: 'Verify Success',
            icon: CheckCircleIcon,
            description: 'Mark items as verified and done',
        },
        {
            value: 'download',
            label: 'Download Report',
            icon: DownloadIcon,
            description: 'Export report data to CSV',
        },
        {
            value: 'delete',
            label: 'Remove Permanently',
            icon: XCircleIcon,
            description: 'Delete item from database',
            disabled: true,
        },
    ];

    const countries = [
        'Argentina',
        'Australia',
        'Brazil',
        'Canada',
        'Denmark',
        'Egypt',
        'France',
        'Germany',
        'India',
        'Japan',
        'Mexico',
        'Netherlands',
        'South Africa',
        'United Kingdom',
        'United States',
    ];

    // ── AdvancedTable: generic data via useTableData hook ─────────────────────
    // TODO: Replace '/api/records' with your real API route, then:
    //   1. Delete mockTableData.js
    //   2. Remove the mockTableData import above
    //   3. Change data={mockTableData} → data={tableData} in the JSX below
    const {
        data: tableData,
        loading: tableLoading,
        refetch: tableRefetch,
    } = useTableData({ endpoint: '/api/records' });

    // Trigger the initial fetch on mount
    useEffect(() => {
        tableRefetch();
    }, [tableRefetch]);

    // Define columns — or omit entirely to let AdvancedTable auto-infer from data shape.
    const displayColumns = [
        { key: 'name', label: 'Name', sortable: true, width: '200px' },
        { key: 'role', label: 'Role', sortable: true, width: '150px' },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            width: '130px',
            render: (val) => {
                const variantMap = { Active: 'success', Inactive: 'neutral', Pending: 'warning' };
                return (
                    <Badge variant={variantMap[val] || 'neutral'} type="light">
                        {val}
                    </Badge>
                );
            },
        },
        { key: 'joined', label: 'Joined', sortable: true, width: '140px' },
        { key: 'score', label: 'Score', sortable: true, width: '100px' },
    ];

    const applicantKanbanColumns = [
        { id: 'applicant', title: 'Applicant', count: 12, color: '#ea580c' },
        { id: 'shortlist', title: 'Shortlist', count: 2, color: '#eab308' },
        { id: 'interview', title: 'Interview', count: 5, color: '#3b82f6' },
        { id: 'hired', title: 'Hired', count: 8, color: '#10b981' },
    ];

    const applicantKanbanItems = [
        {
            id: 'app-1',
            columnId: 'applicant',
            title: 'Marley Lubin',
            badge: { label: '84% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            fields: [
                { label: 'Role', value: 'UI Designer' },
                { label: 'Location', value: 'NY, New York' },
            ],
        },
        {
            id: 'app-2',
            columnId: 'applicant',
            title: 'Cheyenne Siphron',
            badge: { label: '73% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            fields: [
                { label: 'Role', value: 'Product Designer' },
                { label: 'Location', value: 'NY, New York' },
            ],
        },
        {
            id: 'app-3',
            columnId: 'applicant',
            title: 'Ashlynn Calzoni',
            badge: { label: '64% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            fields: [
                { label: 'Role', value: 'Product Designer' },
                { label: 'Location', value: 'NY, New York' },
            ],
        },
        {
            id: 'app-4',
            columnId: 'applicant',
            title: 'Marcus Vance',
            badge: { label: '88% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            fields: [
                { label: 'Role', value: 'Backend Architect' },
                { label: 'Location', value: 'Seattle, WA' },
            ],
        },
        {
            id: 'app-5',
            columnId: 'applicant',
            title: 'Elena Rostova',
            badge: { label: '91% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            fields: [
                { label: 'Role', value: 'Design Lead' },
                { label: 'Location', value: 'Boston, MA' },
            ],
        },
        {
            id: 'app-6',
            columnId: 'applicant',
            title: 'David Kim',
            badge: { label: '79% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            fields: [
                { label: 'Role', value: 'Fullstack Dev' },
                { label: 'Location', value: 'San Jose, CA' },
            ],
        },
        {
            id: 'app-7',
            columnId: 'applicant',
            title: 'Sophia Martinez',
            badge: { label: '82% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            fields: [
                { label: 'Role', value: 'UX Researcher' },
                { label: 'Location', value: 'Chicago, IL' },
            ],
        },
        {
            id: 'app-8',
            columnId: 'applicant',
            title: 'Lucas Wright',
            badge: { label: '55% Match', bg: '#fff7ed', color: '#ea580c' },
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
            fields: [
                { label: 'Role', value: 'QA Engineer' },
                { label: 'Location', value: 'Denver, CO' },
            ],
        },
        {
            id: 'app-9',
            columnId: 'applicant',
            title: 'Hannah Abbott',
            badge: { label: '76% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            fields: [
                { label: 'Role', value: 'Motion Designer' },
                { label: 'Location', value: 'Austin, TX' },
            ],
        },
        {
            id: 'app-10',
            columnId: 'applicant',
            title: 'Gabriel Silva',
            badge: { label: '89% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
            fields: [
                { label: 'Role', value: 'Mobile Engineer' },
                { label: 'Location', value: 'Miami, FL' },
            ],
        },
        {
            id: 'app-11',
            columnId: 'applicant',
            title: 'Rachel Green',
            badge: { label: '68% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
            fields: [
                { label: 'Role', value: 'Brand Designer' },
                { label: 'Location', value: 'NY, New York' },
            ],
        },
        {
            id: 'app-12',
            columnId: 'applicant',
            title: 'Tariq Al-Mansoor',
            badge: { label: '94% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
            fields: [
                { label: 'Role', value: 'Product Manager' },
                { label: 'Location', value: 'SF, California' },
            ],
        },
        {
            id: 'app-13',
            columnId: 'shortlist',
            title: 'Ruben Stanton',
            badge: { label: '95% Match', bg: '#ecfdf5', color: '#059669' },
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            fields: [
                { label: 'Role', value: 'Senior UX Lead' },
                { label: 'Location', value: 'SF, California' },
            ],
        },
        {
            id: 'app-14',
            columnId: 'shortlist',
            title: 'Jordyn Dorwart',
            badge: { label: '58% Match', bg: '#fff7ed', color: '#ea580c' },
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            fields: [
                { label: 'Role', value: 'Frontend Developer' },
                { label: 'Location', value: 'Austin, Texas' },
            ],
        },
    ];

    const [demoDateTime, setDemoDateTime] = useState(new Date());

    // ToggleButton demo states
    const [togglePrimary, setTogglePrimary] = useState(true);
    const [toggleSuccess, setToggleSuccess] = useState(true);
    const [toggleDanger, setToggleDanger] = useState(false);
    const [toggleWarning, setToggleWarning] = useState(true);
    const [toggleDefault, setToggleDefault] = useState(false);
    const [toggleSmOn, setToggleSmOn] = useState(true);
    const [toggleMdOn, setToggleMdOn] = useState(true);
    const [toggleLgOn, setToggleLgOn] = useState(true);
    const [toggleLabelL, setToggleLabelL] = useState(false);
    const [toggleLabelR, setToggleLabelR] = useState(true);

    // ViewToggle demo state
    const [demoViewModeMd, setDemoViewModeMd] = useState('table');
    const [demoViewModeSm, setDemoViewModeSm] = useState('grid');

    // Theme state from shared context
    const { resolvedTheme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="showcase-page-container">
            <header className="showcase-page-header">
                <div className="header-text-group">
                    <h1 className="showcase-page-title">Components Showcase</h1>
                    <p className="showcase-page-subtitle">
                        A comprehensive catalogue of modular workspace elements and widgets.
                    </p>
                </div>
                <div className="header-actions-group">
                    <button
                        type="button"
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button
                        type="button"
                        className="back-dashboard-btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="components-showcase-wrapper">
                {/* Calendar & DateTimePicker Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Calendar & DateTimePicker Components</h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '24px',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Calendar />
                        <div
                            className="showcase-card"
                            style={{
                                flex: 1,
                                minWidth: '280px',
                                maxWidth: '360px',
                            }}
                        >
                            <DateTimePicker
                                label="Select Schedule Date & Time"
                                value={demoDateTime}
                                onChange={setDemoDateTime}
                                placeholder="Pick date & time..."
                                showTime={true}
                                clearable={true}
                            />
                        </div>
                    </div>
                </div>

                {/* StatCard Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">StatCard Component</h3>
                    <div className="showcase-statcards-row">
                        <StatCard
                            title="Finished Tasks"
                            value="18"
                            trend="+8 tasks"
                            isPositive={true}
                            icon={
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Tracked Hours"
                            value="31h"
                            trend="-6 hours"
                            isPositive={false}
                            icon={
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Efficiency Rate"
                            value="93%"
                            trend="+12%"
                            isPositive={true}
                            icon={
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                {/* MetricCard Showcase Section (Matching User Design) */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">
                        MetricCard Component (Universal Summary Cards)
                    </h3>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        {/* Screenshot exact design replica */}
                        <MetricCardGrid columns={4}>
                            <MetricCard
                                label="TOTAL SESSIONS"
                                value="55"
                                icon={CalendarDaysIcon}
                                iconColor="#f87171"
                            />
                            <MetricCard
                                label="UPCOMING"
                                value="0"
                                icon={ClockIcon}
                                iconColor="#f87171"
                            />
                            <MetricCard
                                label="EARNINGS"
                                value="Rs. 23,068"
                                icon={RupeeIcon}
                                iconColor="#f87171"
                            />
                            <MetricCard
                                label="AVERAGE RATING"
                                value="N/A"
                                icon={StarIcon}
                                iconColor="#f87171"
                            />
                        </MetricCardGrid>

                        {/* Demonstration with different arbitrary data & colors */}
                        <MetricCardGrid columns={4}>
                            <MetricCard
                                label="ACTIVE USERS"
                                value="1,420"
                                icon={UsersIcon}
                                iconColor="#3b82f6"
                                subValue="+12% this month"
                                onClick={() => alert('Clicked Active Users metric card!')}
                            />
                            <MetricCard
                                label="TOTAL ORDERS"
                                value="890"
                                icon={SparkleIcon}
                                iconColor="#10b981"
                                subValue="98.5% fulfilled"
                            />
                            <MetricCard
                                label="SYSTEM STATUS"
                                value="Operational"
                                icon={CheckCircleIcon}
                                iconColor="#10b981"
                                variant="white"
                            />
                            <MetricCard
                                label="CSAT SCORE"
                                value="4.9 / 5"
                                icon={StarIcon}
                                iconColor="#f59e0b"
                                subValue="Based on 320 reviews"
                            />
                        </MetricCardGrid>
                    </div>
                </div>

                {/* Badge Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Badge Component</h3>
                    <div className="showcase-badges-card">
                        <div className="badge-showcase-row">
                            <span className="row-label">Soft Fills (Light):</span>
                            <div className="badge-group">
                                <Badge variant="success" type="light" showDot={true}>
                                    Done
                                </Badge>
                                <Badge variant="warning" type="light" showDot={true}>
                                    In progress
                                </Badge>
                                <Badge variant="info" type="light" showDot={true}>
                                    On hold
                                </Badge>
                                <Badge variant="danger" type="light">
                                    High Priority
                                </Badge>
                                <Badge variant="neutral" type="light">
                                    Default
                                </Badge>
                            </div>
                        </div>

                        <div className="badge-showcase-row">
                            <span className="row-label">Solid Fills:</span>
                            <div className="badge-group">
                                <Badge variant="success" type="solid">
                                    Success
                                </Badge>
                                <Badge variant="warning" type="solid">
                                    Pending
                                </Badge>
                                <Badge variant="info" type="solid">
                                    Info
                                </Badge>
                                <Badge variant="danger" type="solid" showDot={true}>
                                    Critical
                                </Badge>
                                <Badge variant="neutral" type="solid">
                                    Muted
                                </Badge>
                            </div>
                        </div>

                        <div className="badge-showcase-row">
                            <span className="row-label">Outlined Borders:</span>
                            <div className="badge-group">
                                <Badge variant="success" type="outline" showDot={true}>
                                    Active
                                </Badge>
                                <Badge variant="warning" type="outline">
                                    Scheduled
                                </Badge>
                                <Badge variant="info" type="outline">
                                    Review
                                </Badge>
                                <Badge variant="danger" type="outline" showDot={true}>
                                    Blocked
                                </Badge>
                                <Badge variant="neutral" type="outline">
                                    Archived
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities Feed Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">
                        ActivitiesFeed Component (Backend API & Dynamic Payload Ready)
                    </h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '32px',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                        }}
                    >
                        {/* Example 1: Maintenance & Task Feed (Reference UI) */}
                        <div>
                            <h4
                                style={{
                                    fontSize: '0.86rem',
                                    fontWeight: 600,
                                    color: '#64748b',
                                    marginBottom: '12px',
                                }}
                            >
                                Maintenance & Task Feed
                            </h4>
                            <ActivitiesFeedCard
                                onMenuClick={() => alert('Activities feed menu clicked')}
                                onItemClick={(item) =>
                                    alert(`Selected activity: ${item.user?.name}`)
                                }
                            />
                        </div>

                        {/* Example 2: Dynamic Backend API Payload (Different Content: Payments, Comments, Member Joins) */}
                        <div>
                            <h4
                                style={{
                                    fontSize: '0.86rem',
                                    fontWeight: 600,
                                    color: '#64748b',
                                    marginBottom: '12px',
                                }}
                            >
                                Dynamic Backend API Response (Custom Content)
                            </h4>
                            <ActivitiesFeedCard
                                title="System Activity Log"
                                activities={[
                                    {
                                        _id: 'act_991',
                                        actor: {
                                            name: 'Elena Rostova',
                                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                                        },
                                        eventType: 'PAYMENT_RECEIVED',
                                        description: 'received payment for Invoice',
                                        reference: '#INV-4029',
                                        createdAt: '2026-07-21T19:30:00.000Z',
                                        detail: {
                                            title: 'Rent Payment Received',
                                            code: '₹45,000',
                                            badgeText: 'PAID',
                                            variant: 'success',
                                        },
                                    },
                                    {
                                        _id: 'act_992',
                                        actor: {
                                            name: 'Marcus Vance',
                                            avatar: null,
                                        },
                                        eventType: 'COMMENT_ADDED',
                                        description: 'added a note on property',
                                        reference: 'Penthouse #402',
                                        createdAt: '2026-07-21T17:15:00.000Z',
                                    },
                                    {
                                        _id: 'act_993',
                                        actor: {
                                            name: 'Sophia Chen',
                                            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
                                        },
                                        eventType: 'MEMBER_JOINED',
                                        description: 'joined team as',
                                        reference: 'Property Manager',
                                        createdAt: '2026-07-20T14:00:00.000Z',
                                    },
                                ]}
                                onItemClick={(item) =>
                                    alert(`Backend event: ${item.eventType || item.statusText}`)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* KPI Line Chart Card Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">
                        KpiLineChartCard Component (KPI Benchmark Line Chart)
                    </h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '32px',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                        }}
                    >
                        {/* Standard KPI Chart (Matching Reference UI) */}
                        <KpiLineChartCard
                            title="KPI"
                            selectedPeriod="Last 6 Month"
                            unit="h"
                            periodDataMap={SHOWCASE_KPI_DATA}
                            onPeriodChange={(period) => alert(`Period changed to: ${period}`)}
                            onExpand={() => alert('KPI Chart expand action clicked!')}
                        />

                        {/* Custom KPI Chart (e.g. Revenue Benchmark) */}
                        <KpiLineChartCard
                            title="Revenue vs Target"
                            unit="₹"
                            selectedPeriod="Year to Date"
                            currentLabel="2026 Revenue (₹)"
                            previousLabel="2025 Revenue (₹)"
                            currentColor="#10b981"
                            previousColor="#94a3b8"
                            data={[
                                {
                                    label: 'Jan',
                                    current: 12000,
                                    previous: 9500,
                                },
                                {
                                    label: 'Feb',
                                    current: 18500,
                                    previous: 14000,
                                },
                                {
                                    label: 'Mar',
                                    current: 15000,
                                    previous: 16200,
                                },
                                {
                                    label: 'Apr',
                                    current: 24000,
                                    previous: 19000,
                                },
                                {
                                    label: 'May',
                                    current: 28500,
                                    previous: 21000,
                                },
                                {
                                    label: 'Jun',
                                    current: 34000,
                                    previous: 26500,
                                },
                            ]}
                            onPeriodChange={(period) =>
                                alert(`Revenue period changed to: ${period}`)
                            }
                            onExpand={() => alert('Revenue Chart expand clicked!')}
                        />
                    </div>
                </div>

                {/* KanbanBoard Showcase Section (Applicants Board) */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">
                        KanbanBoard Component (Applicants Board)
                    </h3>
                    <div className="showcase-card">
                        <KanbanBoard
                            columns={applicantKanbanColumns}
                            items={applicantKanbanItems}
                            headerTitle="Applicants"
                            searchable={true}
                            searchPlaceholder="Search applicants by name or role..."
                            onItemClick={(card) => alert(`Selected applicant: "${card.title}"`)}
                            onAddItem={(colId) => alert(`Add applicant to stage: ${colId}`)}
                            onAddColumn={() => alert('Add new column action clicked!')}
                        />
                    </div>
                </div>

                {/* Checkbox Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Checkbox Component</h3>
                    <div className="showcase-checkbox-card">
                        <Checkbox
                            checked={standaloneCheckVal}
                            onChange={(e) => setStandaloneCheckVal(e.target.checked)}
                            label="Accept workspace terms and conditions"
                        />
                    </div>
                </div>

                {/* Tooltip Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Tooltip Component</h3>
                    <div className="showcase-tooltip-card">
                        <Tooltip content="Tooltip on top" position="top">
                            <button type="button" className="demo-tooltip-btn">
                                Hover Top
                            </button>
                        </Tooltip>
                        <Tooltip content="Tooltip on bottom" position="bottom">
                            <button type="button" className="demo-tooltip-btn">
                                Hover Bottom
                            </button>
                        </Tooltip>
                        <Tooltip content="Tooltip on left" position="left">
                            <button type="button" className="demo-tooltip-btn">
                                Hover Left
                            </button>
                        </Tooltip>
                        <Tooltip content="Tooltip on right" position="right">
                            <button type="button" className="demo-tooltip-btn">
                                Hover Right
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Pagination Buttons Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Pagination Buttons</h3>
                    <div className="showcase-pagination-card">
                        <PrevButton onClick={() => alert('Previous button clicked!')} />
                        <NextButton onClick={() => alert('Next button clicked!')} />
                    </div>
                </div>

                {/* SearchBar Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">SearchBar Component</h3>
                    <div className="showcase-searchbar-card">
                        <SearchBar
                            value={standaloneSearchVal}
                            onChange={(e) => setStandaloneSearchVal(e.target.value)}
                            placeholder="Type to search workspace..."
                            showFilter={true}
                            onFilterClick={() => alert('Standalone filter icon clicked!')}
                        />
                    </div>
                </div>

                {/* DatePicker Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">DatePicker Component</h3>
                    <div
                        className="showcase-card"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        <div>
                            <DatePicker
                                label="Select Date (Interactive)"
                                value={datePickerVal}
                                onChange={(val) => setDatePickerVal(val)}
                                placeholder="DD-MM-YYYY"
                            />
                        </div>
                        <div>
                            <DatePicker
                                label="Disabled DatePicker"
                                value="21-07-2026"
                                disabled={true}
                            />
                        </div>
                        <div>
                            <DatePicker
                                label="Error State DatePicker"
                                value=""
                                error="Date field cannot be empty."
                            />
                        </div>
                    </div>
                </div>

                {/* Textarea Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Textarea Component</h3>
                    <div
                        className="showcase-card"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {/* Default with hint */}
                        <Textarea
                            id="textarea-basic"
                            label="Description"
                            placeholder="Write a short description..."
                            value={textareaBasic}
                            onChange={(e) => setTextareaBasic(e.target.value)}
                            hint="Keep it clear and concise."
                            rows={4}
                        />

                        {/* With character limit */}
                        <Textarea
                            id="textarea-limited"
                            label="Short Bio"
                            placeholder="Tell us about yourself..."
                            value={textareaLimited}
                            onChange={(e) => setTextareaLimited(e.target.value)}
                            maxLength={200}
                            hint="Max 200 characters."
                            rows={4}
                        />

                        {/* Auto-resize */}
                        <Textarea
                            id="textarea-autogrow"
                            label="Notes (Auto-grow)"
                            placeholder="Start typing and the field grows..."
                            value={textareaAutoGrow}
                            onChange={(e) => setTextareaAutoGrow(e.target.value)}
                            autoResize={true}
                            hint="Height adjusts to fit your content."
                        />

                        {/* Resize handle visible */}
                        <Textarea
                            id="textarea-resize"
                            label="Custom Resize"
                            placeholder="Drag the corner to resize..."
                            value={textareaResize}
                            onChange={(e) => setTextareaResize(e.target.value)}
                            resize="both"
                            rows={3}
                            hint="resize: both — drag any corner."
                        />

                        {/* Error state */}
                        <Textarea
                            id="textarea-error"
                            label="Required Field"
                            placeholder="This field has an error..."
                            value=""
                            onChange={() => {}}
                            required
                            error="This field is required and cannot be left blank."
                            rows={4}
                        />

                        {/* Disabled */}
                        <Textarea
                            id="textarea-disabled"
                            label="Read-only Notes"
                            value="These notes are locked and cannot be edited by the user."
                            onChange={() => {}}
                            disabled
                            rows={4}
                        />
                    </div>
                </div>

                {/* ErrorPage Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Error Components</h3>
                    <div className="showcase-error-wrapper">
                        <div className="error-preview-tabs">
                            <button
                                type="button"
                                className={`preview-tab-btn ${errorPreviewCode === '404' ? 'active' : ''}`}
                                onClick={() => setErrorPreviewCode('404')}
                            >
                                404 (NotFound)
                            </button>
                            <button
                                type="button"
                                className={`preview-tab-btn ${errorPreviewCode === '403' ? 'active' : ''}`}
                                onClick={() => setErrorPreviewCode('403')}
                            >
                                403 (Forbidden)
                            </button>
                            <button
                                type="button"
                                className={`preview-tab-btn ${errorPreviewCode === '500' ? 'active' : ''}`}
                                onClick={() => setErrorPreviewCode('500')}
                            >
                                500 (ServerError)
                            </button>
                        </div>
                        <div className="error-preview-frame">
                            {errorPreviewCode === '404' && (
                                <NotFoundPage
                                    onActionClick={() => alert('404 Back Action clicked')}
                                />
                            )}
                            {errorPreviewCode === '403' && (
                                <ForbiddenPage
                                    onActionClick={() => alert('403 Back Action clicked')}
                                />
                            )}
                            {errorPreviewCode === '500' && (
                                <ServerErrorPage
                                    onActionClick={() => alert('500 Back Action clicked')}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* AdvancedTable — Minimal Default Mode */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">AdvancedTable — Minimal Default Mode</h3>
                    <AdvancedTable
                        columns={displayColumns}
                        data={tableData.length > 0 ? tableData : mockTableData}
                        loading={tableLoading}
                    />
                </div>

                {/* AdvancedTable — Full-Featured Power Mode */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">
                        AdvancedTable — Full-Featured Power Mode (Sort Dropdown, Serial #, Grid
                        Switcher)
                    </h3>
                    <AdvancedTable
                        columns={displayColumns}
                        data={tableData.length > 0 ? tableData : mockTableData}
                        loading={tableLoading}
                        tabFilterKey="status"
                        showSerialNumber={true}
                        showSortDropdown={true}
                        showColumnSorting={true}
                        showColumnToggle={true}
                        showFilter={true}
                        searchable={true}
                        searchPlaceholder="Search records..."
                        initialRowsPerPage={5}
                        selectable={true}
                        showRefresh={true}
                        showExport={true}
                        showRowsPerPage={true}
                        showResultsCount={true}
                        showViewToggle={true}
                        gridColumns={4}
                        cardTitleKey="name"
                        cardSubtitleKey="role"
                        cardStatusKey="status"
                        cardBodyKeys={['joined', 'score']}
                        statusVariantMap={{
                            Active: 'success',
                            Inactive: 'neutral',
                            Pending: 'warning',
                        }}
                        onRefresh={tableRefetch}
                    />
                </div>

                {/* Timeline Showcase Section */}

                <div className="showcase-section">
                    <h3 className="showcase-section-title">Timeline Component</h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: '32px',
                        }}
                    >
                        <div>
                            <h4
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#4b5563',
                                    marginBottom: '12px',
                                }}
                            >
                                1. Vertical Timeline (Activity Log)
                            </h4>
                            <Timeline items={sampleTimelineItems} />
                        </div>

                        <div>
                            <h4
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#4b5563',
                                    marginBottom: '12px',
                                }}
                            >
                                2. Horizontal Timeline (Progress Flow)
                            </h4>
                            <Timeline items={sampleTimelineItems} mode="horizontal" />
                        </div>
                    </div>
                </div>

                {/* Dropdown Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Dropdown Component</h3>
                    <div className="showcase-dropdown-grid">
                        <div>
                            <Dropdown
                                label="1. Standard Dropdown (Strings)"
                                placeholder="Choose a fruit..."
                                options={stringOptions}
                                value={val1}
                                onChange={(val) => setVal1(val)}
                            />
                            <div className="showcase-dropdown-value">
                                Selected: <strong>{val1 || 'None'}</strong>
                            </div>
                        </div>

                        <div>
                            <Dropdown
                                label="2. Custom Options (Icons & Descriptions)"
                                placeholder="Select action..."
                                options={objectOptions}
                                value={val2}
                                onChange={(val) => setVal2(val)}
                            />
                            <div className="showcase-dropdown-value">
                                Selected: <strong>{val2 || 'None'}</strong>
                            </div>
                        </div>

                        <div>
                            <Dropdown
                                label="3. Searchable Dropdown"
                                placeholder="Select a country..."
                                options={countries}
                                value={val3}
                                onChange={(val) => setVal3(val)}
                                searchable={true}
                            />
                            <div className="showcase-dropdown-value">
                                Selected: <strong>{val3 || 'None'}</strong>
                            </div>
                        </div>

                        <div>
                            <Dropdown
                                label="4. Clearable Dropdown"
                                placeholder="Select and clear..."
                                options={stringOptions}
                                value={val4}
                                onChange={(val) => setVal4(val)}
                                clearable={true}
                            />
                            <div className="showcase-dropdown-value">
                                Selected: <strong>{val4 || 'None'}</strong>
                            </div>
                        </div>

                        <div>
                            <Dropdown
                                label="5. Disabled Dropdown"
                                placeholder="You cannot select this..."
                                options={stringOptions}
                                value=""
                                disabled={true}
                                onChange={() => {}}
                            />
                        </div>

                        <div>
                            <Dropdown
                                label="6. Error State Dropdown"
                                placeholder="Fix this selection..."
                                options={stringOptions}
                                value={val5}
                                onChange={(val) => setVal5(val)}
                                error="Please select a valid option."
                            />
                        </div>
                    </div>
                </div>

                {/* DeleteToast Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">DeleteToast Component</h3>
                    <div className="showcase-card">
                        <p>
                            Toggle and control the floating delete toast component that pops up from
                            the bottom.
                        </p>
                        <div className="delete-toast-showcase-row">
                            <button
                                onClick={() => setToastVisible(!toastVisible)}
                                className="demo-tooltip-btn"
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: toastVisible ? '#ef4444' : '#10b981',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                }}
                            >
                                {toastVisible ? 'Hide Delete Toast' : 'Show Delete Toast'}
                            </button>

                            <div className="delete-toast-counter-row">
                                <span>Count:</span>
                                <button
                                    onClick={() => setToastCount((prev) => Math.max(1, prev - 1))}
                                >
                                    -
                                </button>
                                <strong className="delete-toast-counter-text">{toastCount}</strong>
                                <button onClick={() => setToastCount((prev) => prev + 1)}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toast Notification System Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Toast Notification System</h3>
                    <div className="showcase-card">
                        <p>
                            Interactive testbed for various system notifications in all states
                            (Success, Error, Warning, Info).
                        </p>

                        <div className="showcase-toast-grid">
                            {/* Column 1: Auth */}
                            <div className="showcase-toast-col">
                                <h4>Authentication</h4>
                                <div className="showcase-toast-buttons-list">
                                    <button
                                        onClick={() => success('Successful login! Welcome back.')}
                                        className="btn-success"
                                    >
                                        Successful Login
                                    </button>
                                    <button
                                        onClick={() => error('Login failed! Invalid credentials.')}
                                        className="btn-error"
                                    >
                                        Login Failed
                                    </button>
                                    <button
                                        onClick={() =>
                                            success(
                                                'Account created successfully! Welcome onboard.',
                                            )
                                        }
                                        className="btn-success"
                                    >
                                        Successful Signup
                                    </button>
                                    <button
                                        onClick={() =>
                                            error('Registration failed! Email already registered.')
                                        }
                                        className="btn-error"
                                    >
                                        Registration Failed
                                    </button>
                                    <button
                                        onClick={() =>
                                            success('Password reset link sent to your email.')
                                        }
                                        className="btn-success"
                                    >
                                        Reset Link Sent
                                    </button>
                                    <button
                                        onClick={() =>
                                            warning('Session expiring in 2 minutes. Refresh.')
                                        }
                                        className="btn-warning"
                                    >
                                        Session Expired
                                    </button>
                                </div>
                            </div>

                            {/* Column 2: Data Actions */}
                            <div className="showcase-toast-col">
                                <h4>Data Actions</h4>
                                <div className="showcase-toast-buttons-list">
                                    <span>Creation & Additions</span>
                                    <button
                                        onClick={() => success('New item added to workspace.')}
                                        className="btn-small-success"
                                    >
                                        Successfully Added
                                    </button>
                                    <button
                                        onClick={() =>
                                            error('Failed to create resource: Validation error.')
                                        }
                                        className="btn-small-error"
                                    >
                                        Failed to Add
                                    </button>
                                    <button
                                        onClick={() =>
                                            success('Draft copy saved to your workspace.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Draft Saved (Success)
                                    </button>
                                    <button
                                        onClick={() =>
                                            warning(
                                                'Warning: Record with same title already exists.',
                                            )
                                        }
                                        className="btn-small-warning"
                                    >
                                        Duplicate Warning
                                    </button>

                                    <span>Updates & Edits</span>
                                    <button
                                        onClick={() =>
                                            success('Database changes saved successfully.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Successfully Saved
                                    </button>
                                    <button
                                        onClick={() => error('Failed to update config options.')}
                                        className="btn-small-error"
                                    >
                                        Failed to Update
                                    </button>
                                    <button
                                        onClick={() => info('No edits detected. Save bypassed.')}
                                        className="btn-small-info"
                                    >
                                        No Changes (Info)
                                    </button>
                                    <button
                                        onClick={() =>
                                            warning(
                                                'Conflict: Data updated by another user. Reload.',
                                            )
                                        }
                                        className="btn-small-warning"
                                    >
                                        Conflict Warn (Warning)
                                    </button>

                                    <span>Removal & Delete</span>
                                    <button
                                        onClick={() =>
                                            success('Item permanently removed from catalog.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Successfully Deleted
                                    </button>
                                    <button
                                        onClick={() =>
                                            error('Failed to delete item: Access level restricted.')
                                        }
                                        className="btn-small-error"
                                    >
                                        Deletion Failed
                                    </button>
                                    <button
                                        onClick={() =>
                                            info('Item deleted. Undo is available for 10s.')
                                        }
                                        className="btn-small-info"
                                    >
                                        Undo Deletion (Info)
                                    </button>
                                    <button
                                        onClick={() =>
                                            warning('Cannot delete locked system dependencies.')
                                        }
                                        className="btn-small-warning"
                                    >
                                        Resource Locked
                                    </button>
                                </div>
                            </div>

                            {/* Column 3: System & Network */}
                            <div className="showcase-toast-col">
                                <h4>System & Network</h4>
                                <div className="showcase-toast-buttons-list">
                                    <button
                                        onClick={() =>
                                            success('Internet connection restored. You are online.')
                                        }
                                        className="btn-success"
                                    >
                                        Network Online
                                    </button>
                                    <button
                                        onClick={() =>
                                            error('No internet connection. You are offline.')
                                        }
                                        className="btn-error"
                                    >
                                        Network Offline
                                    </button>
                                    <button
                                        onClick={() =>
                                            info('Syncing local data with cloud store...')
                                        }
                                        className="btn-info"
                                    >
                                        Syncing Database
                                    </button>
                                    <button
                                        onClick={() =>
                                            warning(
                                                'Warning: Server response time is higher than normal.',
                                            )
                                        }
                                        className="btn-warning"
                                    >
                                        Slow Server Response
                                    </button>
                                </div>
                            </div>

                            {/* Column 4: Files / Actions */}
                            <div className="showcase-toast-col">
                                <h4>File Actions</h4>
                                <div className="showcase-toast-buttons-list">
                                    <span>PDF Documents</span>
                                    <button
                                        onClick={() =>
                                            success('PDF invoice generated successfully.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Generate PDF (Success)
                                    </button>
                                    <button
                                        onClick={() =>
                                            error('Failed to render PDF: Document is corrupted.')
                                        }
                                        className="btn-small-error"
                                    >
                                        PDF Corrupted (Error)
                                    </button>

                                    <span>CSV Data Sheets</span>
                                    <button
                                        onClick={() =>
                                            success('Successfully imported records from CSV.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Import CSV (Success)
                                    </button>
                                    <button
                                        onClick={() =>
                                            error('CSV upload failed: Missing required fields.')
                                        }
                                        className="btn-small-error"
                                    >
                                        CSV Format Error (Error)
                                    </button>

                                    <span>Images (JPG/PNG)</span>
                                    <button
                                        onClick={() =>
                                            success('Profile photo png uploaded successfully.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Upload JPG/PNG (Success)
                                    </button>
                                    <button
                                        onClick={() =>
                                            error('JPG/PNG too large. Maximum size allowed is 5MB.')
                                        }
                                        className="btn-small-error"
                                    >
                                        Image Too Large (Error)
                                    </button>

                                    <span>Video Files</span>
                                    <button
                                        onClick={() =>
                                            success('Video processing completed. Click to watch.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Process Video (Success)
                                    </button>
                                    <button
                                        onClick={() =>
                                            error(
                                                'Unsupported video codec. Please upload MP4/WebM.',
                                            )
                                        }
                                        className="btn-small-error"
                                    >
                                        Codec Unsupported (Error)
                                    </button>

                                    <span>Audio Tracks</span>
                                    <button
                                        onClick={() =>
                                            success('Audio voice note compressed & saved.')
                                        }
                                        className="btn-small-success"
                                    >
                                        Save Audio (Success)
                                    </button>
                                    <button
                                        onClick={() =>
                                            error(
                                                'Failed to capture audio: Microphone disconnected.',
                                            )
                                        }
                                        className="btn-small-error"
                                    >
                                        Mic Error (Error)
                                    </button>

                                    <span>General Actions</span>
                                    <button
                                        onClick={() =>
                                            info('Downloading resource pack (2.4 MB/s)...')
                                        }
                                        className="btn-small-info"
                                    >
                                        Download Started (Info)
                                    </button>
                                    <button
                                        onClick={() =>
                                            warning('Warning: Low local memory. Clean disk space.')
                                        }
                                        className="btn-small-warning"
                                    >
                                        Storage Low (Warning)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dialog Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Dialog Component</h3>
                    <div className="showcase-card">
                        <p>Trigger reusable confirmation and custom modals of various variants.</p>
                        <div className="showcase-dialog-buttons">
                            <button onClick={() => setIsDangerOpen(true)} className="btn-danger">
                                Danger Dialog
                            </button>
                            <button onClick={() => setIsWarningOpen(true)} className="btn-warning">
                                Warning Dialog
                            </button>
                            <button onClick={() => setIsSuccessOpen(true)} className="btn-success">
                                Success Dialog
                            </button>
                            <button onClick={() => setIsCustomOpen(true)} className="btn-primary">
                                Custom Form Dialog
                            </button>
                        </div>
                    </div>
                </div>

                {/* TabSwitchModal Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">
                        TabSwitchModal Component (Generic Tabbed Modal)
                    </h3>
                    <div className="showcase-card">
                        <p
                            style={{
                                margin: '0 0 16px 0',
                                color: '#64748b',
                                fontSize: '0.875rem',
                            }}
                        >
                            Clean, modular tab switch modal featuring generic tabs, form input
                            fields, #f7f7f7 callout banner, animated active underline indicator,
                            fixed dialog dimensions, 5-column option grid, and top-left close
                            button.
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => setIsTabModalOpen(true)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 18px',
                                    borderRadius: '10px',
                                    background: '#222222',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                }}
                            >
                                <SparkleIcon size={16} /> Open TabSwitchModal Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shared Modular Drawer & Notification Feed Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Drawer Component & Notification Feed</h3>
                    <div className="showcase-card">
                        <p
                            style={{
                                margin: '0 0 16px 0',
                                color: '#64748b',
                                fontSize: '0.875rem',
                            }}
                        >
                            Slide-over modular drawer with multi-directional slide animations
                            ('right', 'left', 'top', 'bottom') and flexible sizes ('sm', 'md', 'lg',
                            'xl', 'full'). Includes a production-ready Notification Feed component
                            based on Qatalog styling.
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                flexWrap: 'wrap',
                                marginBottom: '24px',
                            }}
                        >
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => setIsFeedDrawerOpen(true)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    background: '#0f172a',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.84rem',
                                }}
                            >
                                <SparkleIcon size={16} /> Open Notification Feed Drawer
                            </button>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setIsFormDrawerOpen(true)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    background: '#f1f5f9',
                                    color: '#1e293b',
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.84rem',
                                }}
                            >
                                Open Custom Form Drawer
                            </button>
                        </div>

                        {/* Interactive Controls for Position and Size */}
                        <div className="showcase-testbed-panel">
                            <h4 className="testbed-title">Interactive Position & Size Testbed:</h4>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: '24px',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <div className="testbed-label">Slide Direction:</div>
                                    {['right', 'left', 'top', 'bottom'].map((pos) => (
                                        <button
                                            key={pos}
                                            type="button"
                                            onClick={() => setDemoDrawerPosition(pos)}
                                            className={`testbed-btn ${demoDrawerPosition === pos ? 'active' : ''}`}
                                        >
                                            {pos}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <div className="testbed-label">Drawer Size:</div>
                                    {['sm', 'md', 'lg', 'xl', 'full'].map((sz) => (
                                        <button
                                            key={sz}
                                            type="button"
                                            onClick={() => setDemoDrawerSize(sz)}
                                            className={`testbed-btn ${demoDrawerSize === sz ? 'active' : ''}`}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        alignSelf: 'flex-end',
                                        marginBottom: '6px',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setIsDemoDrawerOpen(true)}
                                        className="testbed-launch-btn"
                                    >
                                        Launch Drawer ({demoDrawerPosition} /{' '}
                                        {demoDrawerSize.toUpperCase()})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons Showcase Section */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Row Action & Clear All Buttons</h3>
                    <div
                        className="showcase-card action-buttons-row"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            alignItems: 'center',
                        }}
                    >
                        <EditButton onClick={() => success('Edit action clicked')} />
                        <DeleteButton onClick={() => error('Delete action clicked')} />
                        <ClearAllButton
                            label="Clear All (Danger)"
                            variant="danger"
                            size="md"
                            onClick={() => error('Danger clear clicked')}
                        />
                        <ClearAllButton
                            label="Clear All (Warning)"
                            variant="warning"
                            size="md"
                            onClick={() => success('Warning clear clicked')}
                        />
                        <ClearAllButton
                            label="Clear Filters"
                            variant="neutral"
                            size="md"
                            count={5}
                            onClick={() => success('Neutral clear clicked')}
                        />
                        <ClearAllButton
                            label="Reset View"
                            variant="info"
                            size="md"
                            onClick={() => success('Info reset clicked')}
                        />
                    </div>
                </div>

                {/* Button-Only Variant Showcase */}
                <div className="showcase-section">
                    <h3 className="showcase-section-title">Upload (Button-Only Variant)</h3>
                    <div className="showcase-card">
                        <ButtonUpload
                            multiple={true}
                            accept="application/pdf,image/*,text/plain"
                            maxSize={5 * 1024 * 1024} // 5MB limit
                            label="Attachments"
                            helperText="Supported files: PDF, Images, TXT up to 5MB"
                            onChange={(files) => console.log('Uploaded files:', files)}
                        />
                    </div>
                </div>
            </div>

            <DeleteToast
                selectedCount={toastCount}
                isVisible={toastVisible}
                onClose={() => setToastVisible(false)}
                onDelete={() => {
                    success(`Successfully deleted ${toastCount} selected items!`);
                    setToastVisible(false);
                }}
            />

            <Dialog
                isOpen={isDangerOpen}
                onClose={() => setIsDangerOpen(false)}
                title="Confirm Deletion"
                variant="danger"
                size="sm"
                confirmText="Delete Permanently"
                onConfirm={() => {
                    success('System resources deleted successfully.');
                    setIsDangerOpen(false);
                }}
            >
                <p style={{ margin: 0 }}>
                    Are you sure you want to delete this resource? This action is permanent and
                    cannot be undone.
                </p>
            </Dialog>

            <Dialog
                isOpen={isWarningOpen}
                onClose={() => setIsWarningOpen(false)}
                title="Unsaved Changes"
                variant="warning"
                size="sm"
                confirmText="Discard Changes"
                onConfirm={() => {
                    setIsWarningOpen(false);
                }}
            >
                <p style={{ margin: 0 }}>
                    You have unsaved changes in your workspace draft. Discarding will lose all
                    modifications.
                </p>
            </Dialog>

            <Dialog
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                title="Account Verified"
                variant="success"
                size="sm"
                confirmText="Proceed"
                onConfirm={() => {
                    setIsSuccessOpen(false);
                }}
            >
                <p style={{ margin: 0 }}>
                    Congratulations! Your workspace account setup is completed and verified
                    successfully.
                </p>
            </Dialog>

            <Dialog
                isOpen={isCustomOpen}
                onClose={() => setIsCustomOpen(false)}
                title="Update Profile Information"
                variant="primary"
                size="lg"
                confirmText="Save Details"
                onConfirm={() => {
                    success(
                        `Successfully updated profile: ${customName || 'Alex Morgan'} (${customRole || 'Engineering'})`,
                    );
                    setIsCustomOpen(false);
                }}
            >
                <div className="custom-dialog-form">
                    <p className="dialog-form-subtitle">
                        Please fill out the form fields below to update your workspace profile
                        records:
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        <InputField
                            label="Full Name"
                            id="custom-dialog-name"
                            type="text"
                            placeholder="e.g. Alex Morgan"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                        />
                        <InputField
                            label="Email Address"
                            id="custom-dialog-email"
                            type="email"
                            placeholder="e.g. alex.morgan@example.com"
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        <Dropdown
                            label="Department / Role"
                            placeholder="Select department"
                            options={[
                                {
                                    value: 'engineering',
                                    label: 'Engineering & Architecture',
                                },
                                {
                                    value: 'design',
                                    label: 'Product & UI/UX Design',
                                },
                                {
                                    value: 'marketing',
                                    label: 'Growth & Digital Marketing',
                                },
                                {
                                    value: 'management',
                                    label: 'Project & Operations',
                                },
                            ]}
                            value={customRole}
                            onChange={(val) => setCustomRole(val)}
                        />
                        <DatePicker
                            label="Date of Birth"
                            placeholder="DD-MM-YYYY"
                            value={customDob}
                            onChange={(val) => setCustomDob(val)}
                            showSelectedValue={false}
                        />
                    </div>

                    <Textarea
                        label="Biography & Short Summary"
                        id="custom-dialog-bio"
                        placeholder="Write a brief summary of your background and primary responsibilities..."
                        value={customBio}
                        onChange={(e) => setCustomBio(e.target.value)}
                        rows={3}
                        maxLength={250}
                    />

                    <div style={{ paddingTop: '4px' }}>
                        <Checkbox
                            id="custom-dialog-subscribe"
                            checked={customSubscribe}
                            onChange={(e) => setCustomSubscribe(e.target.checked)}
                            label="Subscribe to weekly product digests and system security alerts"
                        />
                    </div>
                </div>
            </Dialog>

            {/* ToggleButton Showcase Section */}
            <div className="showcase-section">
                <h3 className="showcase-section-title">ToggleButton Component</h3>

                {/* Variants */}
                <div className="showcase-card" style={{ marginBottom: '20px' }}>
                    <p
                        className="showcase-card-label"
                        style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                        }}
                    >
                        Variants
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px 32px',
                            alignItems: 'center',
                        }}
                    >
                        <ToggleButton
                            id="toggle-demo-primary"
                            checked={togglePrimary}
                            onChange={setTogglePrimary}
                            variant="primary"
                            label="Primary"
                        />
                        <ToggleButton
                            id="toggle-demo-success"
                            checked={toggleSuccess}
                            onChange={setToggleSuccess}
                            variant="success"
                            label="Success"
                        />
                        <ToggleButton
                            id="toggle-demo-danger"
                            checked={toggleDanger}
                            onChange={setToggleDanger}
                            variant="danger"
                            label="Danger"
                        />
                        <ToggleButton
                            id="toggle-demo-warning"
                            checked={toggleWarning}
                            onChange={setToggleWarning}
                            variant="warning"
                            label="Warning"
                        />
                        <ToggleButton
                            id="toggle-demo-default"
                            checked={toggleDefault}
                            onChange={setToggleDefault}
                            variant="default"
                            label="Default"
                        />
                    </div>
                </div>

                {/* Sizes */}
                <div className="showcase-card" style={{ marginBottom: '20px' }}>
                    <p
                        className="showcase-card-label"
                        style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                        }}
                    >
                        Sizes
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px 32px',
                            alignItems: 'center',
                        }}
                    >
                        <ToggleButton
                            id="toggle-demo-sm"
                            checked={toggleSmOn}
                            onChange={setToggleSmOn}
                            size="sm"
                            variant="primary"
                            label="Small"
                        />
                        <ToggleButton
                            id="toggle-demo-md"
                            checked={toggleMdOn}
                            onChange={setToggleMdOn}
                            size="md"
                            variant="primary"
                            label="Medium (default)"
                        />
                        <ToggleButton
                            id="toggle-demo-lg"
                            checked={toggleLgOn}
                            onChange={setToggleLgOn}
                            size="lg"
                            variant="primary"
                            label="Large"
                        />
                    </div>
                </div>

                {/* Label Position */}
                <div className="showcase-card" style={{ marginBottom: '20px' }}>
                    <p
                        className="showcase-card-label"
                        style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                        }}
                    >
                        Label Position
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px 32px',
                            alignItems: 'center',
                        }}
                    >
                        <ToggleButton
                            id="toggle-demo-label-right"
                            checked={toggleLabelR}
                            onChange={setToggleLabelR}
                            variant="success"
                            label="Label on Right"
                            labelPos="right"
                        />
                        <ToggleButton
                            id="toggle-demo-label-left"
                            checked={toggleLabelL}
                            onChange={setToggleLabelL}
                            variant="success"
                            label="Label on Left"
                            labelPos="left"
                        />
                    </div>
                </div>

                {/* Disabled States */}
                <div className="showcase-card">
                    <p
                        className="showcase-card-label"
                        style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                        }}
                    >
                        Disabled State
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px 32px',
                            alignItems: 'center',
                        }}
                    >
                        <ToggleButton
                            id="toggle-demo-disabled-off"
                            checked={false}
                            disabled
                            label="Disabled (off)"
                        />
                        <ToggleButton
                            id="toggle-demo-disabled-on"
                            checked={true}
                            disabled
                            variant="primary"
                            label="Disabled (on)"
                        />
                    </div>
                </div>
            </div>

            {/* ViewToggle Showcase Section */}
            <div className="showcase-section">
                <h3 className="showcase-section-title">ViewToggle Component</h3>
                <div className="showcase-card">
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '32px',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    color: '#6b7280',
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    marginBottom: '8px',
                                }}
                            >
                                Medium (default)
                            </p>
                            <ViewToggle
                                view={demoViewModeMd}
                                onViewChange={setDemoViewModeMd}
                                size="md"
                            />
                        </div>
                        <div>
                            <p
                                style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    color: '#6b7280',
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    marginBottom: '8px',
                                }}
                            >
                                Small (sm)
                            </p>
                            <ViewToggle
                                view={demoViewModeSm}
                                onViewChange={setDemoViewModeSm}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Shared Clean Rounded Corner No-Border TabPills Showcase */}
            <div className="showcase-section">
                <h3 className="showcase-section-title">
                    TabPills Component (Clean Rounded Corner No-Border Pills)
                </h3>
                <div className="showcase-card">
                    <p
                        style={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            marginBottom: '20px',
                        }}
                    >
                        Zero-border navigation pills with clean rounded corners, smooth sliding
                        active states, counter badges, and size variants.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    marginBottom: '8px',
                                }}
                            >
                                1. Subtle Variant (sm):
                            </p>
                            <TabPills
                                tabs={[
                                    { id: 'all', label: 'All', count: 12 },
                                    {
                                        id: 'unread',
                                        label: 'Unread',
                                        count: 4,
                                        unread: true,
                                    },
                                    { id: 'mentions', label: 'Mentions' },
                                    {
                                        id: 'archived',
                                        label: 'Archived',
                                        disabled: true,
                                    },
                                ]}
                                activeTab={demoTabPillVal}
                                onTabChange={setDemoTabPillVal}
                                variant="subtle"
                                size="sm"
                            />
                        </div>

                        <div>
                            <p
                                style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    marginBottom: '8px',
                                }}
                            >
                                2. Solid Variant (md):
                            </p>
                            <TabPills
                                tabs={[
                                    { id: 'all', label: 'Overview' },
                                    { id: 'unread', label: 'Analytics' },
                                    { id: 'mentions', label: 'Activity Feed' },
                                ]}
                                activeTab={demoTabPillVal}
                                onTabChange={setDemoTabPillVal}
                                variant="solid"
                                size="md"
                            />
                        </div>

                        <div>
                            <p
                                style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    marginBottom: '8px',
                                }}
                            >
                                3. Ghost Variant (lg):
                            </p>
                            <TabPills
                                tabs={[
                                    { id: 'all', label: 'General' },
                                    { id: 'unread', label: 'Security' },
                                    { id: 'mentions', label: 'Notifications' },
                                ]}
                                activeTab={demoTabPillVal}
                                onTabChange={setDemoTabPillVal}
                                variant="ghost"
                                size="lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Accordion Component Suite Showcase Section */}
            <div className="showcase-section">
                <h3 className="showcase-section-title">Accordion Component Suite</h3>
                <div className="showcase-card">
                    <p
                        style={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            marginBottom: '24px',
                        }}
                    >
                        Modular, accessible accordion component matching the project design system.
                        Supports single or multiple expansion modes, 4 design variants ('default',
                        'bordered', 'filled', 'ghost'), leading icons, and shared badges.
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                            gap: '32px',
                        }}
                    >
                        {/* Column 1: Bordered Variant (Single Expand) */}
                        <div
                            style={{
                                background: '#f8fafc',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                            }}
                        >
                            <h4
                                style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '0.9rem',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                }}
                            >
                                1. Bordered Cards (Single Expand)
                            </h4>

                            <Accordion variant="bordered" size="md" defaultExpanded={['acc-1']}>
                                <AccordionItem
                                    id="acc-1"
                                    title="System Security Settings"
                                    subtitle="Configure 2FA & SSO authentication"
                                    icon={<GearIcon />}
                                    badge="Active"
                                    badgeVariant="success"
                                >
                                    <p
                                        style={{
                                            margin: 0,
                                            color: '#475569',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Two-factor authentication (2FA) is enforced across all admin
                                        workspaces. OAuth2 SSO login is synced with Google
                                        Workspace.
                                    </p>
                                </AccordionItem>

                                <AccordionItem
                                    id="acc-2"
                                    title="API Rate Limits & Tokens"
                                    subtitle="Manage production access credentials"
                                    icon={<SparkleIcon />}
                                    badge="5 Keys"
                                    badgeVariant="info"
                                >
                                    <p
                                        style={{
                                            margin: 0,
                                            color: '#475569',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Your workspace has 5 active production API tokens with a
                                        rate limit of 10,000 requests/minute.
                                    </p>
                                </AccordionItem>

                                <AccordionItem
                                    id="acc-3"
                                    title="Billing & Subscription Plan"
                                    subtitle="Enterprise Plan renewed on July 1"
                                    icon={<RupeeIcon />}
                                    badge="Renewal Due"
                                    badgeVariant="warning"
                                >
                                    <p
                                        style={{
                                            margin: 0,
                                            color: '#475569',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Next billing cycle starts on August 1, 2026. Auto-renewal is
                                        enabled for 15 seat licenses.
                                    </p>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Column 2: Filled Variant (Multiple Expand with Nested Components) */}
                        <div
                            style={{
                                background: '#ffffff',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            }}
                        >
                            <h4
                                style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '0.9rem',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                }}
                            >
                                2. Filled Variant (Multiple Expansion & Nested Widgets)
                            </h4>

                            <Accordion
                                variant="filled"
                                size="md"
                                allowMultiple={true}
                                defaultExpanded={['nest-1', 'nest-2']}
                            >
                                <AccordionItem
                                    id="nest-1"
                                    title="Project Migration Progress"
                                    subtitle="Frontend TypeScript conversion"
                                    badge="70% Done"
                                    badgeVariant="success"
                                >
                                    <div style={{ paddingTop: '8px' }}>
                                        <div
                                            style={{
                                                background: '#e2e8f0',
                                                borderRadius: '4px',
                                                height: '6px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '70%',
                                                    height: '100%',
                                                    background: '#0d9488',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </AccordionItem>

                                <AccordionItem
                                    id="nest-2"
                                    title="Performance Metrics"
                                    subtitle="System response times"
                                    badge="Operational"
                                    badgeVariant="success"
                                >
                                    <div style={{ paddingTop: '8px' }}>
                                        <StatCard
                                            title="Efficiency Rate"
                                            value="98.4%"
                                            trend="+14%"
                                            isPositive={true}
                                            icon={<CheckCircleIcon size={18} />}
                                        />
                                    </div>
                                </AccordionItem>

                                <AccordionItem
                                    id="nest-3"
                                    title="Legacy Module Archival"
                                    subtitle="Deprecated endpoint cleanup"
                                    disabled={true}
                                    badge="Disabled"
                                    badgeVariant="neutral"
                                >
                                    <p style={{ margin: 0, color: '#94a3b8' }}>
                                        This item is disabled.
                                    </p>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Notification Feed Drawer Showcase */}
            <Drawer
                isOpen={isFeedDrawerOpen}
                onClose={() => setIsFeedDrawerOpen(false)}
                title="Feed"
                position="right"
                size="md"
            >
                <NotificationFeed
                    onNotificationClick={(item) =>
                        alert(`Clicked notification: ${item.actor} ${item.action} ${item.target}`)
                    }
                />
            </Drawer>

            {/* 2. Interactive Position & Size Demo Drawer */}
            <Drawer
                isOpen={isDemoDrawerOpen}
                onClose={() => setIsDemoDrawerOpen(false)}
                title={`Demo Drawer (${demoDrawerPosition.toUpperCase()} - ${demoDrawerSize.toUpperCase()})`}
                subtitle="Testing modular drawer position & layout properties"
                position={demoDrawerPosition}
                size={demoDrawerSize}
                footer={
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <CancelButton onClick={() => setIsDemoDrawerOpen(false)} label="Close" />
                        <SaveDetailsButton
                            onClick={() => {
                                alert('Action confirmed!');
                                setIsDemoDrawerOpen(false);
                            }}
                            label="Confirm Action"
                        />
                    </div>
                }
            >
                <div style={{ padding: '24px' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-gray-900)' }}>
                        Modular Content Container
                    </h4>
                    <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                        This drawer is currently rendered with{' '}
                        <strong>Position = "{demoDrawerPosition}"</strong> and{' '}
                        <strong>Size = "{demoDrawerSize}"</strong>.
                    </p>
                    <div
                        style={{
                            padding: '16px',
                            background: 'var(--color-gray-100)',
                            borderRadius: '8px',
                            border: '1px dashed var(--color-gray-300)',
                            marginTop: '16px',
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: '0.875rem',
                                color: 'var(--color-gray-500)',
                            }}
                        >
                            You can put any React components inside the body, including data tables,
                            forms, charts, or detailed views.
                        </p>
                    </div>
                </div>
            </Drawer>

            {/* 3. Custom Form Drawer */}
            <Drawer
                isOpen={isFormDrawerOpen}
                onClose={() => setIsFormDrawerOpen(false)}
                title="Create New Task"
                subtitle="Add a task to your active sprint layout"
                position="right"
                size="md"
                footer={
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <CancelButton onClick={() => setIsFormDrawerOpen(false)} label="Cancel" />
                        <SaveDetailsButton
                            onClick={() => {
                                alert('Task created!');
                                setIsFormDrawerOpen(false);
                            }}
                            label="Create Task"
                        />
                    </div>
                }
            >
                <div
                    style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                    }}
                >
                    <InputField
                        label="Task Title"
                        placeholder="e.g. Implement Notifications Drawer"
                    />
                    <Textarea
                        label="Task Description"
                        placeholder="Detailed requirements and scope..."
                        rows={4}
                    />
                    <Dropdown
                        label="Assignee"
                        placeholder="Select team member..."
                        options={['Jane Doe', 'Itesh Prajapati', 'John Smith']}
                    />
                    <DatePicker
                        label="Due Date"
                        value={datePickerVal}
                        onChange={setDatePickerVal}
                    />
                </div>
            </Drawer>

            {/* TabSwitchModal Component Instance */}
            <TabSwitchModal isOpen={isTabModalOpen} onClose={() => setIsTabModalOpen(false)} />
        </div>
    );
}

export default ComponentsShowcase;
