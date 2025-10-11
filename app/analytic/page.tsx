"use client";

import React from "react";
import { DashboardNav } from "@/components/analytics/DashboardNav";
import { KPIMetrics } from "@/components/analytics/KPIMetrics";
import { ChartContainer } from "@/components/analytics/ChartContainer";
import { ViewsChart } from "@/components/analytics/ViewsChart";
import { MonthlyViewsChart } from "@/components/analytics/MonthlyViewsChart";
import { ConversionChart } from "@/components/analytics/ConversionChart";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { UserGrowthChart } from "@/components/analytics/UserGrowthChart";
import { AreaChartStacked } from "@/components/charts/AreaChartStacked";
import { PieChartDonut } from "@/components/charts/PieChartDonut";
import { LineChartMultiple } from "@/components/charts/LineChartMultiple";

const AnalyticPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 p-8">
            {/* Dashboard Navigation */}
            <DashboardNav activeTab="dashboard" />
            
            {/* KPI Metrics */}
            <KPIMetrics />
            
            {/* Main Charts Section */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                <ViewsChart />
                <MonthlyViewsChart />
                <ConversionChart />
                <RevenueChart />
                <AreaChartStacked />
                <PieChartDonut />
            </div>
            
            {/* Additional Charts Section */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                <LineChartMultiple />
                <UserGrowthChart />
            </div>
        </div>
    );
};

export default AnalyticPage;
