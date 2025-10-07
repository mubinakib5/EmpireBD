"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Authentication system has been removed</p>
          </div>
          <div className="p-6">
            <p className="text-gray-500">This dashboard is no longer available as the authentication system has been removed from the website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}