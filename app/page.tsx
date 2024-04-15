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
    CardFooter,
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
import LoadingSpinner from "@/components/loading/LoadingSpinner";



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

    //define a state varable to store the interview data and set the default value to undefined but handle type
    const [interviewData, setInterviewData] = useState<undefined | {
        Result: string;
        Position: string;
        User: string;
        Date: string;
        TimeTaken: string;
        PercentileData: {
            CandidateScore: number;
            TotalUsers: number;
            UserDistribution: {
                Percentile: string;
                UserCount: number;
                UpperPercentileBucket: number;
                LowerPercentileBucket: number;
                isUser: boolean;
            }[];
        };
        Segments: {
            audioSrc: string;
            Skill: string;
            Rating: number;
            AveragePastRating: number;
            Description: string;
            Suggestion: string;
            positiveSuggestionKeywords: string[];
            negativeSuggestionKeywords: string[];
            QuickSuggestion: string;
        }[];
    }>(undefined);
    
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
    const [audioTitle, setAudioTitle] = useState<string>("");
    const [audioDate, setAudioDate] = useState<string>("");
    
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

    useEffect(() => {

        async function InitializeInterviewData() {
            let url = "/api/fetch_interview_data";
            const response = await fetch(url);
            if (!response.ok) {
                console.error("Network response was not ok");
            }
            else {
                const data = await response.json();
                console.log(data);
                InitializeOverviewTab(data);
                InitializePastPerformance(data);
                setInterviewData(data);
            }
        }

        function InitializeOverviewTab (interviewData: any) {

            let _percentileLabels: string[] = [];
            let _userCount: number[] = [];
            let _backgroundColor: string[] = [];
            let _hoverBackgroundColor: string[] = [];

            for (let bin of interviewData.PercentileData.UserDistribution) {
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

        function InitializePastPerformance(interviewData: any) {

            //Radar Chart Data
            let _skills: string[] = [];
            let _currentRatings: number[] = [];
            let _pastRatings: number[] = [];

            //Past Performance Table Data
            let _overPerformanceObj = [];
            let _underPerformanceObj = [];
            
            for (let segment of interviewData.Segments) {
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

        //introduce timedelay to simulate API call
        setTimeout(() => {
            InitializeInterviewData();
        }, 500);

    }, []);


    const handleAudioDrawer = async(_audioTitle: string, _audioDate: string, _audioSrc: string) => {
        setAudioSrc(_audioSrc);
        setAudioTitle(_audioTitle);
        setAudioDate(_audioDate);
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleDrawerClose = () => {
        setIsAudioPlaying(false);
        setIsDrawerOpen(false);
    };
    
    return (

        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            
            {
                interviewData ? (

                    <div className="row z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                        
                        <Tabs defaultValue="Tab1">
                                
                            {/* Define the 4 tabs for the review dashboard */}
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="Tab1">Overview</TabsTrigger>
                                <TabsTrigger value="Tab2">Past Performance</TabsTrigger>
                                <TabsTrigger value="Tab3">AI Suggests</TabsTrigger>
                                <TabsTrigger value="Tab4">Audio & Transcript</TabsTrigger>
                            </TabsList>


                            {/* Overview Tabe */}
                            <TabsContent value="Tab1" className="text-start min-h-64 font-mono">

                                <ResizablePanelGroup direction="horizontal" className="gap-2 mt-3 mb-2">
                                    
                                    <ResizablePanel className="border rounded-lg" defaultSize={35} minSize={25}>

                                        <div className="flex border-bottom px-3 py-3 items-start">
                                            
                                            { interviewData.Result === "Strong Hire" ? 
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
                                                    {interviewData.Result}
                                                </p>
                                                <p className="text-sm text-muted-foreground leadin-none">
                                                    {interviewData.Position}
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
                                                        {interviewData.User}
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
                                                        {interviewData.TimeTaken}
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
                                                        {interviewData.Date}
                                                    </p>
                                                </div>
                                            </div>
                                        
                                        </div>

                                    </ResizablePanel>

                                    <ResizableHandle withHandle className="bg-border-transparent"/>

                                    <ResizablePanel className="rounded-lg" defaultSize={65} minSize={40}>

                                        <div className="flex px-3 py-3 items-start">
                                            <span className="relative flex rounded-full h-9 w-9">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-bar-chart" viewBox="0 0 16 16">
                                                    <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                                                </svg>
                                            </span>
                                            <div className="text-xl font-bold space-y-1">
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
                                    {interviewData.Segments.map((segment, index) => {
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


                            {/* Past Performance Tab */}
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


                            {/* AI Suggests Tab */}
                            <TabsContent value="Tab3" className="text-start mt-3 px-3">
                                
                                <p className="text-2xl font-semibold mt-2">Quick Suggestions</p>

                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    
                                    {interviewData.Segments.map((segment, index) => {
                                        
                                        return segment.Rating >= 4.0 ? (
                                            <Card className="border rounded-lg col-span-1" key={index}>
                                                <CardHeader className="p-0"></CardHeader>
                                                <CardDescription className="flex items-center align-items-center relative text-green-700 px-3 pt-3 pb-0">
                                                        
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

                                                    <span className="text-lg text-muted-foreground font-bold ms-2">{segment.Skill}</span>
                                                </CardDescription>
                                                <CardFooter className="text-md text-muted-foreground mt-2 px-4 pt-0 pb-3">
                                                    {segment.QuickSuggestion}
                                                </CardFooter>
                                            </Card>
                                        ) : null;
                                    })}


                                    {interviewData.Segments.map((segment, index) => {
                                        
                                        return segment.Rating < 4.0 ? (
                                            <Card className="border rounded-lg col-span-1" key={index}>
                                                <CardHeader className="p-0"></CardHeader>
                                                <CardDescription className="flex items-center align-items-center relative text-orange-400 px-3 pt-3 pb-0">
                                                        
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-shield-fill-exclamation" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0M8.002 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                                                    </svg>

                                                    <span className="text-lg text-muted-foreground font-bold ms-2">{segment.Skill}</span>
                                                </CardDescription>
                                                <CardFooter className="text-md text-muted-foreground mt-2 px-4 pt-0 pb-3">
                                                    {segment.QuickSuggestion}
                                                </CardFooter>
                                            </Card>
                                        ) : null;
                                    })}

                                </div>
                                
                                <Accordion type="multiple" className="mt-4">

                                { interviewData.Segments.map((segmentObj, indx) => {
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
                

                            {/* Audio & Transcript Tab */}
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
                                            
                                            <div className="col-3"></div>

                                            <div className="col-6">

                                                {/* Audio Drawer Header */}
                                                <div className="grid grid-cols-12">
                                                
                                                    {  isAudioReady && audioSrc ? ( !isAudioPlaying ? 
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
                                                        ): null
                                                    }

                                                    <div className="col-span-11">
                                                        <DrawerTitle>{audioTitle}</DrawerTitle>
                                                        <DrawerDescription>{audioDate}</DrawerDescription>
                                                    </div>

                                                </div>
                                                
                                                {/* Audio Drawer audio tag */}
                                                {audioSrc ? 
                                                    (
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
                                                    ) : (
                                                        <div className="row text-center">
                                                            <p className="text-muted-foreground">No audio available</p>
                                                        </div>
                                                    )
                                                }

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

                                    {
                                        interviewData.Segments.map((segment, index) => {
                                            return (
                                                <div
                                                    onClick={() => handleAudioDrawer(segment.Skill, interviewData.Date, segment.audioSrc)}
                                                    className="col-span-1 card-container cursor-pointer" 
                                                    key={index}
                                                >
                                                    <AudioCard 
                                                        title={segment.Skill} 
                                                        date={interviewData.Date}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                    
                                </div>
                
                            </TabsContent>
                        </Tabs>
                    
                    </div>
                ):
                (
                    <LoadingSpinner />
                )
            }

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