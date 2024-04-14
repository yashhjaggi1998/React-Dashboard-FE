"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import AudioCard from "@/components/ui/AudioCard";
import RadarChart from "@/components/charts/RadarCharts";
import { useEffect, useState, useRef, FC } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import AudioTranscript from "@/components/ui/AudioTranscript";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Chart, ChartData, ChartOptions} from 'chart.js/auto';
import "chart.js/auto";
import { Bar } from 'react-chartjs-2';
import 'react-circular-progressbar/dist/styles.css';
import { Rating } from "react-simple-star-rating";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";



export default function Home() {

    const percentile_options: ChartOptions<'bar'>  = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                grid: { display: false, },
                title: {
                    display: true,
                    text: 'Overall Score',
                    color: 'black',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                },
            },
            y: {
                grid: { display: false, },
                title: {
                    display: true,
                    text: 'User Count',
                    color: 'black',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                },
            },
        },  
    };

    //Response from backend
    const [overviewObj, setOverviewObj] = useState({
        "Result" : "Leaning Hire",
        "Position": "Full-Stack Engineer (NextJS)",
        "User": "Yashh Jaggi",
        "Date": "April 12, 2024",
        "TimeTaken": "1 hour 30 minutes",
        "PercentileData": {
            "CandidateScore": 4.0,
            "TotalUsers": 50,
            "UserDistribution": [
                { "Percentile": "0 - 1", "UserCount": 5, "UpperPercentileBucket": 10, "LowerPercentileBucket": 0, isUser: false },
                { "Percentile": "1 - 2", "UserCount": 15, "UpperPercentileBucket": 40, "LowerPercentileBucket": 11, isUser: false },
                { "Percentile": "2 - 3", "UserCount": 20, "UpperPercentileBucket": 70, "LowerPercentileBucket": 41, isUser: false },
                { "Percentile": "3 - 4", "UserCount": 7, "UpperPercentileBucket": 94, "LowerPercentileBucket": 71, isUser: true,},
                { "Percentile": "4 - 5", "UserCount": 3, "UpperPercentileBucket": 100, "LowerPercentileBucket": 95, isUser: false },
            ]
        },
        "Segments": [
            {"Skill": "Problem Solving", "Rating": 4.0, "AveragePastRating": 2.0, "Description": "The candidate displayed excellent problem-solving skills. They approached the problem methodically, considering different cases such as word length and identical characters. The candidate asked clarifying questions and was able to extend their solution to handle edge cases effectively.", "Suggestion": "We suggest to keep practicing, keep impressing.", positiveSuggestionKeywords: ['excellent', 'problem-solving', 'methodically,', 'asked', 'clarifying', 'questions', 'handle','edge', 'cases', 'effectively'], negativeSuggestionKeywords: [], "QuickSuggestion": "We suggest to keep practicing, keep impressing."},
            {"Skill": "Algorithms", "Rating": 3.0, "AveragePastRating": 4.0, "Description": "The candidate demonstrated a good understanding of using a hash table to optimize the search for complement numbers, which shows a solid grasp of data structures and their applications. However, there was a repetition in explaining the approach without considering alternative algorithms or optimizations beyond the initial solution.", "Suggestion": "You might want to experiment with different algorithms while practicing. Also, consider optimizing your code further if there's room for improvement.", positiveSuggestionKeywords: ['good', 'understanding', 'using', 'hash', 'table', 'solid', 'grasp', 'data', 'structures'], negativeSuggestionKeywords: ['without', 'considering' ,'alternative', 'algorithms', 'optimizations', 'beyond', 'initial', 'solution'], "QuickSuggestion": "Consider experimenting with various algorithms while practicing and optimize your code further if possible."},
            {"Skill": "Data Structures", "Rating": 4.0, "AveragePastRating": 3.0, "Description": "Your use of a hash table to optimize the search for complement numbers showcased a solid grasp of data structures and their applications. Your coding solution was functional and effectively utilized a hash table.", "Suggestion": "Apply hash tables to diverse problems and keep refining your understanding of data structures.", positiveSuggestionKeywords: ['solid', 'grasp', 'data', 'structures', 'solution', 'functional', 'effectively', 'utilized', 'hash', 'table'], negativeSuggestionKeywords: [], "QuickSuggestion": "Apply hash tables to solve a variety of problems while continuously refining your grasp of data structures."},
            {"Skill": "Coding", "Rating": 4.0, "AveragePastRating": 4.0, "Description": "The candidate wrote clean, working code with no syntax errors. Their code was well-structured, making good use of data structures (a hash map) to map the alien language order. The solution was implemented efficiently, showing a strong understanding of the chosen programming language paradigms.", "Suggestion": "We are impressed with your coding skills and urge you to continue doing what you do." , positiveSuggestionKeywords: ['clean,', 'working', 'code', 'no', 'syntax', 'errors.', 'strong', 'understanding',  'chosen', 'programming'], negativeSuggestionKeywords: [], "QuickSuggestion": "We are impressed with your coding skills and urge you to continue doing what you do."},
            {"Skill": "Complexity Analysis", "Rating": 1.0, "AveragePastRating": 3.0, "Description": "The candidate seemed unsure about how to determine the space complexity of algorithms, often providing vague or incorrect estimates without considering factors like data structures, auxiliary space, or recursive calls. Similarly, when asked about time complexity, they struggled to give precise Big O notation or analyze the time complexity of algorithms accurately. They lacked a systematic approach to breaking down the operations and evaluating their efficiency.", "Suggestion": "We suggest you to revisit to revisit the fundamentals of space and time complexity analysis. This includes understanding different data structures' space requirements, recognizing auxiliary space usage, and time complexity of recursive calls. Practice breaking down algorithms into individual operations and analyzing their efficiency to determine the overall complexity. Additionally, consider studying common time and space complexity classes like O(1), O(n), O(log n), etc., and how they apply to different algorithms.", positiveSuggestionKeywords: [], negativeSuggestionKeywords: ['unsure', 'providing', 'vague', 'incorrect', 'estimates', 'struggled', 'to', 'give', 'precise', 'big', 'oh', 'notation', 'lacked', 'systematic' , 'approach'], "QuickSuggestion": "Revisit space-time complexity basics, analyze algorithm efficiency, study common complexity classes."},
            {"Skill": "Communication", "Rating": 2.0, "AveragePastRating": 2.0, "Description": "The candidate communicated their thought process and approach to solving the problem. However, there were instances where the explanations were unclear or repetitive. The candidate needed some guidance and clarification from the interviewer to proceed, indicating room for improvement in clear and concise communication.", "Suggestion": "Practice clear and concise explanations to improve your communication skills. Seek feedback from others to refine your communication style and actively listen for better understanding. Engaging in activities like mock interviews or public speaking can help you practice and master these skills effectively.", positiveSuggestionKeywords: [], negativeSuggestionKeywords: ['explanations', 'unclear', 'repetitive', 'needed', 'guidance'], "QuickSuggestion": "Practice concise explanations, seek feedback for communication improvement, actively listen, and engage in relevant activities."},
        ],
    });

    //Overview Tab State Variables
    const [percentileLowerBound, setPercentileLowerBound] = useState<number>(-1);
    const [percentileUpperBound, setPercentileUpperBound] = useState<number>(-1);
    const [percentileData, setPercentileData] = useState<undefined | {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderWidth: number;
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    }>(undefined);
    
   
    //Past Performance Tab State Variables
    const [radarChartLabels, setRadarChartLabels] = useState<string[]>([]);
    const [currentRatings, setCurrentRatings] = useState<number[]>([]);
    const [pastRatings, setPastRatings] = useState<number[]>([]);
    const [overperformanceObj, setOverperformanceObj] = useState([]);
    const [underperformanceObj, setUnderperformanceObj] = useState([]);

     //Audo Tab State Variables
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);    
    const [audioSrc, setAudioSrc] = useState<string>("sample_audio.mp3");
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

    useEffect(() => {

        function InitializeOverviewTab () {

            let _percentileLabels: string[] = [];
            let _userCount: number[] = [];
            let _backgroundColor: string[] = [];
            let _hoverBackgroundColor: string[] = [];

            for (let bin of overviewObj.PercentileData.UserDistribution) {
                _percentileLabels.push(bin.Percentile);
                _userCount.push(bin.UserCount);
                
                if(bin.isUser) {
                    _backgroundColor.push("rgba(24, 24, 27, 0.7)");
                    _hoverBackgroundColor.push("rgba(24, 24, 27, 1)");
                    setPercentileLowerBound(bin.LowerPercentileBucket);
                    setPercentileUpperBound(bin.UpperPercentileBucket);
                } else {
                    _backgroundColor.push("rgba(24, 24, 27, 0.3)");
                    _hoverBackgroundColor.push("rgba(24, 24, 27, 0.6)");
                }
            }

            const _percentileData = {
                labels: _percentileLabels,
                datasets: [
                    {
                        label: 'User Count',
                        data: _userCount,
                        borderWidth: 0,
                        backgroundColor: _backgroundColor,
                        hoverBackgroundColor: _hoverBackgroundColor,
                    }
                ],
            }
            
            setPercentileData(_percentileData);
        }

        function InitializePastPerformance() {

            //Radar Chart Data
            let _skills: string[] = [];
            let _currentRatings: number[] = [];
            let _pastRatings: number[] = [];

            //Past Performance Table Data
            let _overPerformanceObj = [];
            let _underPerformanceObj = [];
            
            for (let segment of overviewObj.Segments) {
                _skills.push(segment.Skill);
                _currentRatings.push(segment.Rating);
                _pastRatings.push(segment.AveragePastRating);

                if (segment.Rating > segment.AveragePastRating) {
                    _overPerformanceObj.push({
                        "Skill": segment.Skill,
                        "Rating": segment.Rating,
                        "AveragePastRating": segment.AveragePastRating
                    });
                }
                else if (segment.Rating < segment.AveragePastRating) {
                    _underPerformanceObj.push({
                        "Skill": segment.Skill,
                        "Rating": segment.Rating,
                        "AveragePastRating": segment.AveragePastRating
                    });
                }
            }

            //Set Radar State Variables
            setRadarChartLabels(_skills);
            setCurrentRatings(_currentRatings);
            setPastRatings(_pastRatings);

            //Set Past Performance Table State Variables
            setOverperformanceObj(_overPerformanceObj as never[]);
            setUnderperformanceObj(_underPerformanceObj as never[]);
    
        }

        InitializeOverviewTab();
        InitializePastPerformance();
    }, []);


    const handleAudioDrawer = async() => {
        setAudioSrc("sample_audio2.mp3");
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleDrawerClose = () => {
        setIsAudioPlaying(false);
        setIsDrawerOpen(false);
    };
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-12">
        
            <div className="row z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                
                <Tabs defaultValue="Tab1">
                    
                    <TabsList>
                        <TabsTrigger value="Tab1">Overview</TabsTrigger>
                        <TabsTrigger value="Tab2">Past Performance</TabsTrigger>
                        <TabsTrigger value="Tab3">AI Suggests</TabsTrigger>
                        <TabsTrigger value="Tab4">Audio & Transcript</TabsTrigger>
                    </TabsList>


                    <TabsContent value="Tab1" className="text-start min-h-64 font-mono">

                        <ResizablePanelGroup direction="horizontal" className="gap-2 mt-3 mb-2">
                            
                            <ResizablePanel className="border rounded-lg" defaultSize={35} minSize={25}>

                                <div className="flex border-bottom px-3 py-3 items-start">
                                    
                                    { overviewObj.Result === "Strong Hire" ? 
                                        ( 
                                            <span className="relative flex rounded-full h-9 w-9">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-shield-fill-check inline-block text-success" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"/>
                                                </svg>
                                            </span>
                                        ) : (
                                            <span className="relative flex rounded-full h-9 w-9">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-shield-fill-exclamation text-warning" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0M8.002 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                                                </svg>
                                            </span>
                                        )
                                    }
                                    
                                    <div className="text-xl font-bold space-y-1">
                                        <p className="leading-none mb-2">
                                            {overviewObj.Result}
                                        </p>
                                        <p className="text-sm text-muted-foreground leadin-none">
                                            {overviewObj.Position}
                                        </p>
                                    </div>

                                </div>

                                <div className="grid grid-rows-3 gap-2 px-3 pt-4 pb-4">
                                        
                                    <div className="flex items-center mb-2">
                                        <span className="relative flex shrink-0 rounded-full h-9 w-9">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                            </svg>
                                        </span>

                                        <div className="space-y-1">
                                            <p className="text-base text-muted-foreground font-semibold leading-none mb-2">
                                                Candidate
                                            </p>
                                            <p className="text-sm text-muted-foreground leadin-none">
                                                {overviewObj.User}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <span className="relative flex rounded-full h-9 w-9">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                                <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z"/>
                                                <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1"/>
                                            </svg>
                                        </span>

                                        <div className="space-y-1">
                                            <p className="text-base text-muted-foreground font-semibold leading-none mb-2">
                                                Time Taken
                                            </p>
                                            <p className="text-sm text-muted-foreground leadin-none">
                                                {overviewObj.TimeTaken}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <span className="relative flex rounded-full h-9 w-9">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar-date" viewBox="0 0 16 16">
                                                <path d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23"/>
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                            </svg>
                                        </span>

                                        <div className="space-y-1">
                                            <p className="text-base text-muted-foreground font-semibold leading-none mb-2">
                                                Date
                                            </p>
                                            <p className="text-sm text-muted-foreground leadin-none">
                                                {overviewObj.Date}
                                            </p>
                                        </div>
                                    </div>
                                
                                </div>

                            </ResizablePanel>

                            <ResizableHandle withHandle className="bg-border-transparent"/>

                            <ResizablePanel className="border rounded-lg" defaultSize={65} minSize={40}>

                                <div className="flex px-3 py-3 items-start">
                                    <span className="relative flex rounded-full h-9 w-9">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-bar-chart" viewBox="0 0 16 16">
                                            <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                                        </svg>
                                    </span>
                                    <div className="text-xl text-muted-foreground font-bold space-y-1">
                                        <p className="leading-none mb-2">
                                            Where You Stand?
                                        </p>
                                        { percentileLowerBound !== -1 && percentileUpperBound !== -1 ? (
                                            <p className="text-sm text-muted-foreground leadin-none">
                                                You are between {percentileLowerBound} - {percentileUpperBound} percentile.
                                            </p>
                                        ) : null}
                                        
                                    </div>
                                </div>

                                <Bar data={percentileData || { labels: [], datasets: [] }} options={percentile_options} className="px-3 pb-3"/>

                            </ResizablePanel>

                        </ResizablePanelGroup>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {overviewObj.Segments.map((segment, index) => {
                                return (
                                    <Card className="border rounded-xl" key={index}>
                                        <CardHeader className="px-4 py-2">
                                            <CardTitle>
                                                <p className="text-lg">
                                                    {segment.Skill}
                                                </p>
                                                <Rating
                                                    initialValue={segment.Rating}
                                                    size={30}
                                                    fillColor={segment.Rating > 3 ? "rgba(33, 37, 41, 1)" : (segment.Rating > 2 ? "rgba(33, 37, 41, 0.5)" : "rgba(33, 37, 41, 0.3)")}
                                                    tooltipStyle={{
                                                        backgroundColor: "rgba(33, 37, 41, 0.0)",
                                                        color: "rgba(100, 116, 139, 1)",
                                                        fontSize: "1rem !important",
                                                        paddingLeft: "0.5rem !important",
                                                        paddingRight: "0.5rem !important",
                                                    }}
                                                    readonly={true}
                                                    className="rating-stars"
                                                />
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                )})
                            }
                        </div>

                    </TabsContent>


                    <TabsContent value="Tab2">

                        <ResizablePanelGroup direction="horizontal" className="mb-2">
                            
                            <ResizablePanel className="rounded-lg text-center" minSize={50}>
                                <RadarChart 
                                    chartLabel={"Current Performance"}
                                    labels={radarChartLabels}
                                    currentRating={currentRatings}
                                    pastRating={pastRatings}
                                />
                            </ResizablePanel>

                            <ResizableHandle className="bg-border-transparent" disabled/>

                            <ResizablePanel className="border rounded-2" minSize={50}>
                                            
                                <p className="text-xl text-muted-foreground font-bold px-4 my-3">
                                    Benchmarking Against Your Former Self
                                </p>

                                <div className="mx-3 px-4 py-3">
                                    
                                    <p className="text-base font-bold text-green-700"> Outperformance </p>
                                    
                                    <Table className="mx-3">
                                        <TableBody key="OutperformanceTable">
                                            {overperformanceObj.map((segmentObj: { Skill: string, Rating: number, AveragePastRating: number }, index: number) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell className="p-3 font-bold">
                                                            {segmentObj.Skill}
                                                        </TableCell>
                                                        <TableCell className="p-3 text-xs">
                                                            <strong className="text-base">+{segmentObj.Rating - segmentObj.AveragePastRating}</strong> point gain from past
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>

                                </div>

                                <div className="mx-3 px-4 py-3">
                                    
                                    <p className="text-base font-bold text-red-700"> Underperformance </p>

                                    <Table className="mx-3">
                                        <TableBody>
                                            { underperformanceObj.map((segmentObj: { Skill: string, Rating: number, AveragePastRating: number }, index: number) => {
                                                return (
                                                    <TableRow key={segmentObj.Skill}>
                                                        <TableCell className="p-3 font-bold">
                                                            {segmentObj.Skill}
                                                        </TableCell>
                                                        <TableCell className="p-3 text-xs">
                                                            <strong className="text-base">{segmentObj.Rating - segmentObj.AveragePastRating}</strong> point loss from past
                                                        </TableCell>
                                                    </TableRow>
                                                )})
                                            }
                                        </TableBody>
                                    </Table>

                                </div>
                            
                            </ResizablePanel>

                        </ResizablePanelGroup>
   
                    </TabsContent>


                    <TabsContent value="Tab3" className="text-start mt-3 px-3">
                        
                        <p className="text-xl font-semibold">Quick Suggestions</p>

                        <div className="grid grid-cols-3 gap-3">
                            
                            {overviewObj.Segments.map((segment, index) => {
                                
                                return segment.Rating >= 4.0 ? (
                                    <Card className="border rounded-lg col-span-1" key={index}>
                                        <CardHeader className="p-0"></CardHeader>
                                        <CardDescription className="px-3 pt-4 pb-0">
                                            <div className="flex items-center align-items-center">
                                                <span className=" relative h-9 w-6 text-green-700">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        fill="currentColor"
                                                        className="bi bi-shield-fill-check"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"
                                                        />
                                                    </svg>
                                                </span>
                                                <p className="text-lg font-bold">{segment.Skill}</p>
                                            </div>
                                            <p className="text-md text-muted-foreground">{segment.QuickSuggestion}</p>
                                        </CardDescription>
                                    </Card>
                                ) : null;
                            })}


                            {overviewObj.Segments.map((segment, index) => {
                                
                                return segment.Rating < 4.0 ? (
                                    <Card className="border rounded-lg col-span-1" key={index}>
                                        <CardHeader className="p-0"></CardHeader>
                                        <CardDescription className="px-3 pt-4 pb-0">
                                            <div className="flex items-center align-items-center">
                                                <span className=" relative h-9 w-9 text-orange-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-shield-fill-exclamation" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0M8.002 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                                                    </svg>
                                                </span>
                                                <p className="text-lg font-bold">{segment.Skill}</p>
                                            </div>
                                            <p className="text-md text-muted-foreground">{segment.QuickSuggestion}</p>
                                        </CardDescription>
                                    </Card>
                                ) : null;
                            })}

                        </div>
                        
                        <Accordion type="multiple" className="mt-4">

                        { overviewObj.Segments.map((segmentObj, indx) => {
                            return (
                                <AccordionItem value={`suggestion${indx+1}`} className="[&[data-state=open]]:border-slate-400 suggest-segment" key={`suggestion${indx+1}`}>

                                    <AccordionTrigger className="text-lg text-muted-foreground font-semibold rounded-md [&[data-state=open]]:bg-slate-100 [&[data-state=open]]:text-black hover:text-black hover:no-underline hover:bg-slate-100 px-3 py-3">
                                        <p className="mb-0"> 
                                            {segmentObj.Skill} 
                                        </p>
                                    </AccordionTrigger>

                                    <AccordionContent className="px-3">
                                        
                                        <div className="score-container mt-3">
                                            {/*
                                                <p className="text-base text-muted-foreground font-semibold mb-1">
                                                    Score
                                                </p>
                                            */}
                                            <Rating
                                                initialValue={segmentObj.Rating}
                                                size={20}
                                                fillColor={segmentObj.Rating > 3 ? "rgba(33, 37, 41, 1)" : (segmentObj.Rating > 2 ? "rgba(33, 37, 41, 0.5)" : "rgba(33, 37, 41, 0.3)")}
                                                readonly={true}
                                                className="rating-stars"
                                            />
                                        </div>

                                        <div className="description-container text-base mt-3">
                                            {
                                                segmentObj.Description.split(" ").map((word: string, index: number) => {
                                                
                                                    const isPositive: boolean = segmentObj.positiveSuggestionKeywords.includes(word.toLowerCase() as never);
                                                    const isNegative: boolean = segmentObj.negativeSuggestionKeywords.includes(word.toLowerCase() as never);

                                                    return (
                                                        isPositive ?
                                                        (
                                                            <span key={index} className="font-semibold text-green-600">
                                                                {word}{index === segmentObj.Description.split(" ").length - 1 ? "" : " "}
                                                            </span>
                                                        ) :
                                                        (
                                                            isNegative ?
                                                            (
                                                                <span key={index} className="font-semibold text-red-600">
                                                                    {word}{index === segmentObj.Description.split(" ").length - 1 ? "" : " "}
                                                                </span>
                                                            ) :
                                                            (
                                                                <span key={index} className="text-muted-foreground">
                                                                    {word}{index === segmentObj.Description.split(" ").length - 1 ? "" : " "}
                                                                </span>
                                                            )
                                                        )
                                                    )
                                                })
                                            }
                                        </div>

                                        <div className="suggestion-container mt-5">
                                            <p className="text-lg font-extrabold mb-2">
                                                Suggestion
                                            </p>
                                            <p className="text-base font-medium text-slate-800 mt-1">
                                                {segmentObj.Suggestion ? segmentObj.Suggestion : `You are on the right track with your ${segmentObj.Skill} skills. Keep up the good work!`}
                                            </p>
                                        </div>

                                    </AccordionContent>
                                </AccordionItem>
                            )})}
                            
                        </Accordion>
                    
                    </TabsContent>
        

                    <TabsContent value="Tab4"  className="text-start mt-3 px-3 pb-5">
                        <h2 className="text-2xl font-semibold tracking-light">Listen Now</h2>
                        <div className="border-bottom"></div>

                        <p className="text-md mt-5 mb-4"> 
                            We have broken the interview into 6 segments. This will help you dive into the specifics much faster. 
                        </p>

                        <Drawer open={isDrawerOpen} onClose={handleDrawerClose}>

                            <DrawerContent>
                                
                                <div className="mt-2 pe-5 text-end">
                                    <button className="btn btn-light text-xl" onClick={handleDrawerClose}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="row mt-2">
                                    
                                    <div className="col-3">
                                    </div>

                                    <div className="col-6">

                                        <div className="grid grid-cols-12 audio-controls">
                                        
                                            {  isAudioReady && audioSrc ? 
                                                ( !isAudioPlaying ? 
                                                    (
                                                        <span
                                                            className="flex rounded-full bg-black h-10 w-10 items-center justify-center border-4 border-muted bg-success cursor-pointer"
                                                            onClick={() => audioRef.current?.play()}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill text-light" viewBox="0 0 16 16">
                                                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                                                            </svg>
                                                        </span>
                                                    ) : 
                                                    (
                                                        <span 
                                                            className="flex rounded-full bg-black h-10 w-10 items-center justify-center border-4 border-muted bg-success cursor-pointer"
                                                            onClick={() => audioRef.current?.pause()}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill text-light" viewBox="0 0 16 16">
                                                                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
                                                            </svg>
                                                        </span>
                                                    )
                                                ): 
                                                null
                                            }

                                            <div className="col-span-11">
                                                <DrawerTitle>Problem Solving</DrawerTitle>
                                                <DrawerDescription>April 8, 2024</DrawerDescription>
                                            </div>

                                        </div>

                                        <div className="row audio-duration"></div>
                                        
                                        <div className="row text-center">
                                            
                                            <audio 
                                                controls 
                                                ref={audioRef} 
                                                src={audioSrc} 
                                                preload="metadata"
                                                onDurationChange={(e) => setAudioDuration(e.currentTarget.duration)}
                                                onCanPlay={(e) => setIsAudioReady(true)}
                                                onPlaying={() => setIsAudioPlaying(true)}
                                                onPause={() => setIsAudioPlaying(false)}
                                            >
                                            </audio>
                                        </div>

                                        <div className="row mt-3 pb-5">
                                            <p className="text-muted-foreground font-semibold h-fit">Transcript</p>
                                        
                                            <div className="row transcript-section min-h-64 max-h-64 overflow-auto">
                                                <AudioTranscript
                                                    text="Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools. Thank you for having me. I've worked on various projects ranging from e-commerce platforms to data visualization tools." 
                                                    speed={50} 
                                                />
                                            </div>
                                        </div>

                                    </div>
                                
                                    <div className="col-3 text-end"></div>

                                </div>

                            </DrawerContent>

                        </Drawer>
                            
                        <div className="grid grid-cols-3 gap-4 mt-3">

                            <div 
                                className="col-span-1 card-container cursor-pointer" 
                                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            >
                                <AudioCard title="Problem Solving" date="April 8, 2024" />
                            </div>
                            
                            <div 
                                className="col-span-1 card-container cursor-pointer" 
                                onClick={handleAudioDrawer}
                            >
                                <AudioCard title="Algorithms" date="April 8, 2024"/>
                            </div>

                            <div 
                                className="col-span-1 card-container cursor-pointer" 
                                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            >
                                <AudioCard title="Data Structures" date="April 8, 2024"/>
                            </div>

                        </div>
                            
                        <div className="grid grid-cols-3 gap-4 mt-3">
                            
                            <div 
                                className="col-span-1 card-container cursor-pointer" 
                                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            >
                                <AudioCard title="Coding Skills" date="April 8, 2024"/>
                            </div>

                            <div 
                                className="col-span-1 card-container cursor-pointer" 
                                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            >
                                <AudioCard title="Complexity Analysis" date="April 8, 2024"/>
                            </div>

                            <div 
                                className="col-span-1 card-container cursor-pointer" 
                                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            >
                                <AudioCard title="Communication Skills" date="April 8, 2024"/>
                            </div>
                            
                        </div>
        
                    </TabsContent>
                </Tabs>
                
            </div>

            {/*---------Yashh Footer----------------- */}
            <div className="mt-5 mb-0 grid text-center">
                <span className={`m-0 max-w-[40ch] text-base opacity-50`}>
                    Designed and Implemented by {" "}  
                    <a
                        href="https://yashhjaggi1998.github.io/portfolio_yashh"
                        target="_blank"
                        className="text-decoration-none"
                    >
                        Yashh Jaggi
                    </a>
                </span>
            </div>

        </main>
    );
}