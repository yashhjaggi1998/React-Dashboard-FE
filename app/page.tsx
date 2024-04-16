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
import { ChartOptions} from 'chart.js/auto';
import "chart.js/auto";
import { Bar } from 'react-chartjs-2';
import 'react-circular-progressbar/dist/styles.css';
import { Rating } from "react-simple-star-rating";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { SkillRatingCard } from "@/components/ui/SkillRatingCard";
import { UserMetaData } from "@/components/ui/UserMetaData";
import { Progress } from "@/components/ui/progress";
import { Popover } from "@/components/ui/popover";
import { PopoverArrow, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";



export default function Home() {

    const [selectedTab, setSelectedTab] = useState<string>("Tab1");
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
            Transcript: any[];
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
    const [audioSrc, setAudioSrc] = useState<string>("");
    const [audioTitle, setAudioTitle] = useState<string>("");
    const [audioDate, setAudioDate] = useState<string>("");
    const [audioTranscript, setAudioTranscript] = useState<any[]>([]);
    const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
    const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
    const [audioSuggestion, setAudioSuggestion] = useState<string>("");

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

    const handleAudioDrawer = async(_audioTitle: string, _audioDate: string, _audioTranscript: any[], _audioSugesstion: string) => {

        setIsDrawerOpen(!isDrawerOpen);
        setIsAudioLoading(true);

        //Set all audio metadata whoch will be used in the audio drawer
        setAudioTitle(_audioTitle);
        setAudioDate(_audioDate);
        setAudioSuggestion(_audioSugesstion);
        if(_audioTranscript)
        {
            setAudioTranscript(_audioTranscript);
        }

        //Fetch audio file in wav fromat from the backend.
        const url = `/api/fetch_audio_file?segmentName=${_audioTitle}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Network response was not ok");
            setAudioSrc("");
        }
        else {
            const audio = await response.blob();
            const audioUrl = URL.createObjectURL(audio);
            setAudioSrc(audioUrl);
        }
        setIsAudioLoading(false);
    };

    const handleDrawerClose = () => {
        setAudioSrc("");
        setAudioTitle("");
        setAudioDate("");
        setAudioSuggestion("");
        setAudioTranscript([]);
        setAudioCurrentTime(0);
        setIsAudioPlaying(false);

        setIsDrawerOpen(false);
    };

    const handleAudioProgress = (e: any) => {
        setAudioCurrentTime(e.target.currentTime);
    }

    const handleSpeakerClick = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    }

    const getColorByTime = (Speaker: string, startTime: number) => {
        if (Speaker === "Interviewer") {
            if (audioCurrentTime < startTime) {
                return "rgba(34, 197, 94, 0.3)";
            }
            else
            {
                return "rgba(34, 197, 94, 1)";
            }
        }
        else
        {
            if (audioCurrentTime < startTime) {
                return "rgba(0, 0, 0, 0.3)";
            }
            else {
                return "rgba(0, 0, 0, 1)";
            }
        }
    }

    const switchToAISuggestsTab = () => {
        handleDrawerClose();
        setSelectedTab("Tab3");
    }
    
    return (

        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            
            {
                interviewData ? (

                    <div className="row z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                        
                        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value)}>
                                
                            {/* Define the 4 tabs for the review dashboard */}
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="Tab1">Overview</TabsTrigger>
                                <TabsTrigger value="Tab2">Past Performance</TabsTrigger>
                                <TabsTrigger value="Tab3">AI Suggests</TabsTrigger>
                                <TabsTrigger value="Tab4">Audio & Transcript</TabsTrigger>
                            </TabsList>


                            {/* Overview Tabe */}
                            <TabsContent value="Tab1" className="text-start min-h-64 font-mono">

                                {/* Display User Meta Data -> Overview Panel */}
                                <ResizablePanelGroup direction="horizontal" className="gap-2 mt-3 mb-2">
                                    
                                    {/* Display User Meta Data -> Left Part of Overview Panel */}
                                    <ResizablePanel className="border rounded-lg" defaultSize={35} minSize={25}>
                                        { interviewData ? (
                                            <UserMetaData data={interviewData} />
                                        ) : null }
                                    </ResizablePanel>

                                    <ResizableHandle withHandle className="bg-border-transparent"/>

                                    {/* Display Percentile Data -> Right Part of Overview Panel */}
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

                                {/* Display ratings for each segment of the interview */}
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {interviewData.Segments.map((segment, index) => {
                                        return (
                                            <SkillRatingCard 
                                                skill={segment.Skill} 
                                                rating={segment.Rating} 
                                                index={index}
                                            />
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

                                <div className="grid grid-cols-3 gap-4 mt-3">

                                    {
                                        interviewData.Segments.map((segment, index) => {
                                            return (
                                                <div
                                                    onClick={() => handleAudioDrawer(segment.Skill, interviewData.Date, segment.Transcript, segment.Suggestion)}
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

                                <Drawer open={isDrawerOpen} onClose={handleDrawerClose}>

                                    <DrawerContent>
                                        
                                        {/* Drawer Close Button */}
                                        <div className="pe-6 text-end">
                                            <button className="btn btn-light text-xl" onClick={handleDrawerClose}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* If audio is being fetched show the loading message, if unsuccessful , 
                                            show no audio available message
                                            and if successful show the audio player 
                                        */}
                                        { 
                                            ! isAudioLoading ? (
                                                audioTitle && audioDate ?
                                                    (
                                                        <div className="grid grid-cols-6 mt-1">
                                                            
                                                            <div className="col-span-1"></div>

                                                            <div className="col-span-4">

                                                                {/* Audio Drawer Header */}
                                                                <div className="grid grid-cols-12 items-center">
                                                                
                                                                    {  isAudioReady && audioSrc ? ( !isAudioPlaying ? 
                                                                            (
                                                                                <span
                                                                                    className="flex rounded-full bg-slate-600 hover:bg-black h-12 w-12 items-center justify-center border-4 border-muted cursor-pointer"
                                                                                    onClick={() => audioRef.current?.play()}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-play-fill text-light" viewBox="0 0 16 16">
                                                                                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                                                                                    </svg>
                                                                                </span>
                                                                            ) : 
                                                                            (
                                                                                <span 
                                                                                    className="flex rounded-full cursor-pointer bg-slate-600 hover:bg-black h-12 w-12 items-center justify-center border-4 border-muted"
                                                                                    onClick={() => audioRef.current?.pause()}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pause-fill text-light" viewBox="0 0 16 16">
                                                                                        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
                                                                                    </svg>
                                                                                </span>
                                                                            )
                                                                        ): null
                                                                    }

                                                                    {/* Title and Date of the audio Segment */}
                                                                    <div className="col-span-8 items-center">
                                                                        <DrawerTitle>{audioTitle}</DrawerTitle>
                                                                        <DrawerDescription className="mt-1">{audioDate}</DrawerDescription>
                                                                    </div>

                                                                    <div className="col-span-3 text-end">
                                                                        <Popover>
                                                                            <PopoverTrigger asChild>
                                                                                <span 
                                                                                    className="cursor-pointer font-semibold text-muted-foreground hover:underline hover:text-black"
                                                                                >
                                                                                    View AI Suggestion
                                                                                </span>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-96 z-50 text-start bg-white border rounded-lg overflow-auto px-3 pt-3">
                                                                                <PopoverArrow />
                                                                                <p className="text-lg font-semibold">
                                                                                    <span className="flex items-center">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                                                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                                                                                        </svg>
                                                                                        <span className="ms-2">
                                                                                            Suggestion
                                                                                        </span>
                                                                                    </span>
                                                                                </p>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {audioSuggestion}
                                                                                </p>
                                                                                
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    </div>

                                                                </div>

                                                                {/* Audio Progress Bar */}
                                                                { isAudioReady && audioDuration !== 0 && (
                                                                    <div className="row">
                                                                        <Progress 
                                                                            value={(audioCurrentTime / audioDuration) * 100}
                                                                            max={100}
                                                                            className="mt-2 w-full bg-slate-200 p-0"
                                                                        />
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Audio Drawer audio tag */}
                                                                {audioSrc ? (
                                                                        <div className="row text-center mt-2">
                                                                            <audio 
                                                                                controls
                                                                                ref={audioRef} 
                                                                                src={audioSrc} 
                                                                                preload="metadata"
                                                                                onTimeUpdate={handleAudioProgress}
                                                                                onDurationChange={(e) => setAudioDuration(e.currentTarget.duration)}
                                                                                onCanPlay={(e) => setIsAudioReady(true)}
                                                                                onPlaying={() => setIsAudioPlaying(true)}
                                                                                onPause={() => setIsAudioPlaying(false)}
                                                                                hidden
                                                                            >
                                                                            </audio>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center">
                                                                            <p className="text-lg font-semibold text-muted-foreground">
                                                                                No audio available
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                }
                                                                
                                                                {/* Audio Drawer Transcript */}
                                                                {
                                                                    audioTranscript.length > 0 ? (
                                                                        <div className="row mt-3 pb-5">
                                                                            <p className="text-lg font-bold">Transcript</p>
                                                                        
                                                                            <div className="transcript-section min-h-64 max-h-64 overflow-auto">
                                                                                
                                                                                {audioTranscript.map((transcript, index) => {
                                                                                    return (
                                                                                        <p key={index} className="mt-4">
                                                                                            {transcript.Speaker == "Interviewer" ? (
                                                                                                    
                                                                                                    <span 
                                                                                                        className="flex cursor-pointer text-muted-foreground hover:underline hover:text-black"    
                                                                                                        onClick={() => handleSpeakerClick(transcript.StartTime)}
                                                                                                    >
                                                                                                        <svg 
                                                                                                            xmlns="http://www.w3.org/2000/svg" 
                                                                                                            width="24" 
                                                                                                            height="24" 
                                                                                                            viewBox="0 0 16 16"
                                                                                                            fill={getColorByTime(transcript.Speaker, transcript.StartTime)} 
                                                                                                            className="bi bi-robot"
                                                                                                        >
                                                                                                            {transcript.StartTime <= audioCurrentTime && transcript.EndTime >= audioCurrentTime && (
                                                                                                                <animate
                                                                                                                    attributeName="fill"
                                                                                                                    values={`${getColorByTime(transcript.Speaker, transcript.StartTime)};transparent;${getColorByTime(transcript.Speaker, transcript.StartTime)}`}
                                                                                                                    dur="1s"
                                                                                                                    repeatCount="indefinite"
                                                                                                                />
                                                                                                            )}
                                                                                                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
                                                                                                            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
                                                                                                        </svg>

                                                                                                        <span className="ms-2 font-semibold">
                                                                                                            {transcript.Speaker}
                                                                                                            {transcript.StartTime <= audioCurrentTime && transcript.EndTime >= audioCurrentTime && (
                                                                                                                <span className="animate-pulse"> (Speaking) </span>
                                                                                                            )}
                                                                                                        </span>
                                                                                                        
                                                                                                    </span>

                                                                                                ) : (

                                                                                                    <span key={index} 
                                                                                                        className="flex cursor-pointer text-muted-foreground  hover:underline hover:text-black"    
                                                                                                        onClick={() => handleSpeakerClick(transcript.StartTime)}
                                                                                                    >
                                                                                                        <svg 
                                                                                                            xmlns="http://www.w3.org/2000/svg" 
                                                                                                            width="24" 
                                                                                                            height="24"
                                                                                                            viewBox="0 0 16 16"
                                                                                                            fill={getColorByTime(transcript.Speaker, transcript.StartTime)} 
                                                                                                            className="bi bi-person-circle"
                                                                                                        >
                                                                                                            {transcript.StartTime <= audioCurrentTime && transcript.EndTime >= audioCurrentTime && (
                                                                                                                <animate
                                                                                                                    attributeName="fill"
                                                                                                                    values={`${getColorByTime(transcript.Speaker, transcript.StartTime)};transparent;${getColorByTime(transcript.Speaker, transcript.StartTime)}`}
                                                                                                                    dur="1s"
                                                                                                                    repeatCount="indefinite"
                                                                                                                />
                                                                                                            )}
                                                                                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                                                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                                                                                        </svg>
                                                                                                    
                                                                                                        <span className="ms-2 font-semibold">
                                                                                                            {interviewData.User}
                                                                                                            {transcript.StartTime <= audioCurrentTime && transcript.EndTime >= audioCurrentTime && (
                                                                                                                <span className="animate-pulse"> (Speaking)</span>
                                                                                                            )}
                                                                                                        </span>
                                                                                                        
                                                                                                    </span>
                                                                                                )
                                                                                            }
                                                                                            {
                                                                                                audioCurrentTime < transcript.StartTime ? (
                                                                                                    <span className="text-muted-foreground">
                                                                                                        
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    audioCurrentTime > transcript.EndTime ? (
                                                                                                        <span className="text-muted-foreground">
                                                                                                            {transcript.Text}
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="text-muted-foreground">
                                                                                                            <AudioTranscript text={transcript.Text} speed={transcript.Text.length/(transcript.EndTime - transcript.StartTime)} />
                                                                                                        </span>
                                                                                                    )
                                                                                                )
                                                                                            }
                                                                                        </p>
                                                                                    )})
                                                                                }
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center">
                                                                            <p className="text-lg font-semibold text-muted-foreground">
                                                                                No transcript available
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                }
                                                                
                                                            </div>
                                                        
                                                            <div className="col-span-1"></div>

                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <p className="text-lg font-semibold text-muted-foreground">
                                                                No audio available
                                                            </p>
                                                        </div>
                                                    )
                                            ):(
                                                <div className="text-center">
                                                    <p className="text-lg font-semibold text-muted-foreground animate-pulse">
                                                        Loading Audio...
                                                    </p>
                                                </div>
                                            )
                                        }

                                    </DrawerContent>

                                </Drawer>
                
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
                        className="text-decoration-none text-sky-500"
                    >
                        Yashh Jaggi
                    </a>
                </span>
            </div>

        </main>
    );
}