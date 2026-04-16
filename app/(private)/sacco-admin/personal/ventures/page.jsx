"use client";

import React from "react";
import { useFetchVentures } from "@/hooks/ventures/actions";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import VentureCard from "@/components/members/dashboard/VentureCard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function VenturesPage() {
    const { data: ventures, isLoading, isError } = useFetchVentures();

    if (isLoading) return <MemberLoadingSpinner />;
    if (isError) return <div className="p-8 text-center text-red-500">Failed to load venture accounts.</div>;

    const ventureList = Array.isArray(ventures) ? ventures : (ventures?.results || []);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="w-full px-4 sm:px-6 py-6 space-y-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/member/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Ventures</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">My Ventures</h1>
                </div>

                {ventureList.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded border border-dashed">
                        <p className="text-muted-foreground">You have no venture accounts.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ventureList.map((venture) => (
                            <VentureCard key={venture.id || venture.reference} venture={venture} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VenturesPage;