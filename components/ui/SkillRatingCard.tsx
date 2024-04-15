import React, { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle } from './card';
import { Rating } from "react-simple-star-rating";


interface SkillRatingCardProps {
    index: number;
    skill: string;
    rating: number;
}

export const SkillRatingCard: React.FC<SkillRatingCardProps> = ({ skill, rating, index }) => {
    
        return (
            <Card className="border rounded-xl p-2" key={index}>
                <CardHeader className="px-3 pt-2 pb-3">
                    <CardTitle>
                        <p className="text-lg">
                            {skill}
                        </p>
                        <Rating
                            initialValue={rating}
                            size={30}
                            fillColor={rating > 3 ? "rgba(33, 37, 41, 1)" : (rating > 2 ? "rgba(33, 37, 41, 0.5)" : "rgba(33, 37, 41, 0.3)")}
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
        );
    }