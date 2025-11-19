# ---------------------------------------------
# Project Manager Dashboard Setup Script (Clean)
# ---------------------------------------------

Write-Host "Starting dashboard setup with backups..."

# -------------------------------
# Backup old files
# -------------------------------
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "backup/dashboard-$timestamp"
New-Item -ItemType Directory -Path $backupPath | Out-Null
Write-Host "Backup folder created at: $backupPath"

# Backup Dashboard.jsx
$dashboardPath = "src/pages/Dashboard.jsx"
if (Test-Path $dashboardPath) {
    Copy-Item $dashboardPath "$backupPath/Dashboard.jsx"
    Write-Host "Backed up Dashboard.jsx"
} else {
    Write-Host "Dashboard.jsx not found. Skipping backup."
}

# Backup components folder
$componentsPath = "src/components"
if (Test-Path $componentsPath) {
    Copy-Item $componentsPath "$backupPath/components" -Recurse
    Write-Host "Backed up components folder"
} else {
    Write-Host "Components folder not found. Skipping backup."
}

# -------------------------------
# Ensure folders exist
# -------------------------------
$paths = @("src/components","src/pages")
foreach ($p in $paths) {
    if (-Not (Test-Path $p)) {
        New-Item -ItemType Directory -Path $p | Out-Null
        Write-Host "Created folder: $p"
    }
}

# -------------------------------
# Write TaskStatusChart.jsx
# -------------------------------
@"
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444'];

const TaskStatusChart = ({ data }) => {
  const chartData = [
    { name: 'To Do', value: data.filter(t => t.status==='todo').length },
    { name: 'In Progress', value: data.filter(t => t.status==='inprogress').length },
    { name: 'Review', value: data.filter(t => t.status==='review').length },
    { name: 'Completed', value: data.filter(t => t.status==='done').length }
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow w-full">
      <h2 className="text-xl font-semibold mb-2">Task Status Overview</h2>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} labelLine={false}>
              {chartData.map((entry,index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskStatusChart;
"@ | Set-Content "src/components/TaskStatusChart.jsx"

# -------------------------------
# Write PriorityChart.jsx
# -------------------------------
@"
import React from 'react';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

const PriorityChart = ({ data }) => {
  const chartData = [
    { name:'Low', value:data.filter(t=>t.priority==='low').length },
    { name:'Medium', value:data.filter(t=>t.priority==='medium').length },
    { name:'High', value:data.filter(t=>t.priority==='high').length }
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow w-full">
      <h2 className="text-xl font-semibold mb-2">Task Priority Levels</h2>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityChart;
"@ | Set-Content "src/components/PriorityChart.jsx"

# -------------------------------
# Write ProjectProgress.jsx
# -------------------------------
@"
import React from 'react';

const ProjectProgress = ({ boards }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Project Progress</h2>
      {boards.map(board=>{
        const done = board.tasks.filter(t=>t.status==='done').length;
        const total = board.tasks.length;
        const percent = total===0 ? 0 : Math.round((done/total)*100);
        return (
          <div key={board.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{board.title}</span>
              <span className="text-sm">{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-blue-600 transition-all duration-500" style={{width:`${percent}%`}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectProgress;
"@ | Set-Content "src/components/ProjectProgress.jsx"

# -------------------------------
# Write CalendarView.jsx
# -------------------------------
@"
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ tasks }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
      <Calendar />
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Upcoming Tasks</h3>
        {tasks?.slice(0,5).map(t=><div key={t.id} className='text-sm bg-gray-100 p-2 rounded mb-1'>{t.title}</div>)}
      </div>
    </div>
  );
};

export default CalendarView;
"@ | Set-Content "src/components/CalendarView.jsx"

# -------------------------------
# Write Dashboard.jsx (Dark/Light + Animations)
# -------------------------------
@"
import React, { useContext, useState, useEffect } from 'react';
import { BoardContext } from '../context/BoardContext';
import { motion } from 'framer-motion';
import TaskStatusChart from '../components/TaskStatusChart';
import PriorityChart from '../components/PriorityChart';
import ProjectProgress from '../components/ProjectProgress';
import CalendarView from '../components/CalendarView';
import Board from '../components/Board';

const Dashboard = () => {
  const { boards, addBoard } = useContext(BoardContext);
  const [newBoardTitle,setNewBoardTitle] = useState('');
  const [theme,setTheme] = useState(localStorage.getItem('theme')||'light');

  useEffect(()=>{
    if(theme==='dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme',theme);
  },[theme]);

  const toggleTheme=()=>{ setTheme(theme==='dark'?'light':'dark'); };

  const handleAddBoard=()=>{
    if(!newBoardTitle.trim()) return;
    addBoard(newBoardTitle);
    setNewBoardTitle('');
  };

  return (
    <div className='p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500'>
      <div className='flex justify-end mb-4'>
        <button onClick={toggleTheme} className='p-2 rounded-full bg-white dark:bg-gray-800 shadow-md'>Toggle Theme</button>
      </div>

      <motion.h1 className='text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300'
        initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        Dashboard Overview
      </motion.h1>

      <motion.div className='flex justify-center mb-6 gap-2' initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}>
        <input type='text' placeholder='Enter new board name' value={newBoardTitle} onChange={e=>setNewBoardTitle(e.target.value)} className='px-3 py-2 rounded border'/>
        <button onClick={handleAddBoard} className='px-4 py-2 bg-blue-600 text-white rounded'>Add Board</button>
      </motion.div>

      <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
        <TaskStatusChart data={boards.flatMap(b=>b.tasks)} />
        <PriorityChart data={boards.flatMap(b=>b.tasks)} />
        <ProjectProgress boards={boards} />
        <CalendarView tasks={boards.flatMap(b=>b.tasks)} />
      </motion.div>

      <motion.h2 className='text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200'
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
        Your Project Boards
      </motion.h2>

      <motion.div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.45}}>
        {boards.map(board=>(
          <motion.div key={board.id} initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.3}}>
            <Board board={board}/>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
"@ | Set-Content "src/pages/Dashboard.jsx"

# -------------------------------
# Install Recharts
# -------------------------------
Write-Host "Installing Recharts..."
npm install recharts --silent

Write-Host "Dashboard setup complete! Backups saved at $backupPath"
