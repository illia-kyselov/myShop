"use client";

import React from "react";
import { AreaChartStacked } from "@/components/charts/AreaChartStacked";
import { BarChartMultiple } from "@/components/charts/BarChartMultiple";
import { LineChartMultiple } from "@/components/charts/LineChartMultiple";
import { PieChartDonut } from "@/components/charts/PieChartDonut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-10 p-8">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                <AreaChartStacked />
                <BarChartMultiple />
                <PieChartDonut />
                <LineChartMultiple />
            </div>
        </div>
    );
};

export default AnalyticPage;
