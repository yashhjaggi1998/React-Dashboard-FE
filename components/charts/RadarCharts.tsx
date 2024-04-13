"use client";

import React, { FC } from 'react';
import { Radar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
  } from 'chart.js';

ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend
);

interface RadarChartProps {
	chartLabel: string,
	labels: string[],
	currentRating: number[],
	pastRating: number[]
}

const RadarChart: FC<RadarChartProps> = (props): JSX.Element => {
  	const data = {
    	labels: props.labels,
		datasets: [
			{
				label: "Current",
				data: props.currentRating,
				backgroundColor: 'rgba(77, 182, 172, 0.4)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 2,
				pointHoverBackgroundColor: '#000',
				pointBackgroundColor: [
					'rgba(75, 192, 192, 1)', // Green
					'rgba(75, 192, 192, 1)', // Green
					'rgba(75, 192, 192, 1)', // Green
					'rgba(75, 192, 192, 1)', // Green
					'rgba(75, 192, 192, 1)', // Green
					'rgba(75, 192, 192, 1)', // Green
				],
			},
			{
				label: "Past",
				data: props.pastRating,
				backgroundColor: 'rgba(181, 192, 208, 0.5)',
				borderColor: 'rgba(0, 0, 0, 0.5)',
				borderWidth: 2,
				pointHoverBackgroundColor: '#fff',
				pointBackgroundColor: [
					'rgba(0, 0, 0, 1)', // Black
					'rgba(0, 0, 0, 1)', // Black
					'rgba(0, 0, 0, 1)', // Black
					'rgba(0, 0, 0, 1)', // Black
					'rgba(0, 0, 0, 1)', // Black
					'rgba(0, 0, 0, 1)', // Black
				],
			}
		],
  	};

  	return (
		<Radar 
			data={data} 
			options={{ 
				maintainAspectRatio: true,
				scales: {
					r: {
						suggestedMin: 0,
						suggestedMax: 5,
					},
				},
			}} 
			height="100%" 
			width="100%" 
		/>);
};

export default RadarChart;