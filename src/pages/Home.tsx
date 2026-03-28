import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, GraduationCap, CheckCircle, Activity, CalendarDays, ShieldCheck, ScanFace } from 'lucide-react';
import { getRegistrations, getAttendance } from '../utils/storage';
import { Link } from 'react-router-dom';

const Home = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        todayAttendance: 0,
        totalRecords: 0,
    });

    const [systemStatus, setSystemStatus] = useState('Checking...');
    const [time, setTime] = useState(new Date());
    const [titleIndex, setTitleIndex] = useState(0);

    const titles = [
        <span key="1">Face <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">Detective</span></span>,
        <span key="2"><span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">Welcome</span> Back</span>
    ];

    useEffect(() => {
        const titleTimer = setInterval(() => {
            setTitleIndex((prev) => (prev + 1) % titles.length);
        }, 3000);
        return () => clearInterval(titleTimer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadDashboardData = () => {
            const regs = getRegistrations();
            const att = getAttendance();

            const students = regs.filter(r => r.role === 'student').length;
            const faculty = regs.filter(r => r.role === 'faculty').length;

            const today = new Date().toISOString().split('T')[0];
            const todayAtt = att.filter(a => a.date === today);

            setStats({
                totalStudents: students,
                totalFaculty: faculty,
                todayAttendance: todayAtt.length,
                totalRecords: att.length,
            });

            setTimeout(() => setSystemStatus('Online & Ready'), 800);
        };

        loadDashboardData();
        const interval = setInterval(loadDashboardData, 5000); // Poll every 5s for live effect
        return () => clearInterval(interval);
    }, []);

    const cards = [
        { title: 'Total Present', value: stats.todayAttendance, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { title: 'Total Count', value: stats.totalRecords, icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
        { title: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        { title: 'Total Faculty', value: stats.totalFaculty, icon: Users, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800/50">
                <div className="space-y-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 mb-1 shadow-inner shadow-black/50"
                    >
                        <ShieldCheck size={14} className={systemStatus === 'Online & Ready' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'} />
                        System Status: <span className={systemStatus === 'Online & Ready' ? 'text-emerald-400' : 'text-amber-400'}>{systemStatus}</span>
                    </motion.div>
                    <div className="h-[40px] md:h-[52px] relative overflow-hidden my-1">
                        <AnimatePresence mode="popLayout">
                            <motion.h1
                                key={titleIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-5xl font-black tracking-tight"
                            >
                                {titles[titleIndex]}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-sm md:text-base max-w-xl"
                    >
                        Real-time biometric attendance monitoring overview.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-end bg-slate-900/60 backdrop-blur-xl px-6 py-4 rounded-3xl border border-slate-800/80 shadow-2xl"
                >
                    <div className="flex items-baseline gap-3">
                        <div className="text-4xl font-black text-slate-200 font-mono tracking-wider drop-shadow-[0_0_15px_rgba(226,232,240,0.15)]">
                            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ')[0]}
                        </div>
                        <div className="text-xl font-bold text-slate-500 tracking-widest uppercase">
                            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ')[1]}
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-400/80 uppercase flex items-center gap-1.5 mt-1.5 tracking-wider">
                        <CalendarDays size={14} className="opacity-80" />
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                </motion.div>
            </header>

            {/* Dashboard Content */}
            <div className="flex flex-col lg:flex-row gap-4 pt-2">

                {/* Left Side: Stacked Action Buttons */}
                <div className="flex flex-col gap-4 lg:w-5/12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="h-full"
                    >
                        <Link to="/attendance" className="group block h-full">
                            <div className="h-full glass-card p-4 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">Start Scanner</h3>
                                        <p className="text-xs text-slate-400 mt-1">Initialize biometric scanner</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all duration-300">
                                        <ScanFace size={24} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="h-full"
                    >
                        <Link to="/register" className="group block h-full">
                            <div className="h-full glass-card p-4 border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-violet-500/20 transition-all" />
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-violet-400 transition-colors">Enroll User</h3>
                                        <p className="text-xs text-slate-400 mt-1">Register new face biometrics</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-slate-900 transition-all duration-300">
                                        <Users size={24} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side: 2x2 Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-7/12">
                    {cards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`glass-card p-4 border-l-4 ${card.border} hover:shadow-xl hover:shadow-${card.color.split('-')[1]}-500/10 transition-all duration-300 group relative overflow-hidden`}
                        >
                            {/* Background structural glow */}
                            <div className={`absolute -right-8 -top-8 w-24 h-24 ${card.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div className={`p-3 rounded-lg ${card.bg} shadow-md`}>
                                    <card.icon size={22} className={card.color} />
                                </div>
                            </div>
                            <div className="relative z-10 mt-1">
                                <h3 className="text-4xl font-black text-slate-100 mb-1">{card.value}</h3>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Home;
