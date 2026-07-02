"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Claim } from "@/lib/types";

export function ClaimForm({ onSubmit, isLoading }: { onSubmit: (claim: Partial<Claim>) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    attorneyName: "",
    medicalProvider: "",
    repairShop: "",
    incidentState: "",
    totalClaimAmount: "",
    injuryNarrative: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalClaimAmount: Number(formData.totalClaimAmount),
    });
  };

  const autofillDemo = () => {
    // Autofills Ring A from the spec to trigger the fraud ring match
    setFormData({
      attorneyName: "Kaplan & Associates",
      medicalProvider: "Summit Rehab Clinic",
      repairShop: "QuickFix Auto Body",
      incidentState: "SC",
      totalClaimAmount: "22500",
      injuryNarrative: "Patient reports severe whiplash and lower back pain following rear-end collision at stoplight. Requires 6 weeks physical therapy.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Claim Details</h2>
        <Button type="button" variant="outline" size="sm" onClick={autofillDemo} className="text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
          Autofill Demo Claim (Ring A)
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="attorneyName">Attorney Name</Label>
          <Input 
            id="attorneyName" 
            value={formData.attorneyName} 
            onChange={e => setFormData({...formData, attorneyName: e.target.value})} 
            required 
            className="bg-gray-900 border-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicalProvider">Medical Provider</Label>
          <Input 
            id="medicalProvider" 
            value={formData.medicalProvider} 
            onChange={e => setFormData({...formData, medicalProvider: e.target.value})} 
            required 
            className="bg-gray-900 border-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="repairShop">Repair Shop</Label>
          <Input 
            id="repairShop" 
            value={formData.repairShop} 
            onChange={e => setFormData({...formData, repairShop: e.target.value})} 
            className="bg-gray-900 border-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="incidentState">Incident State (e.g. SC, NY)</Label>
          <Input 
            id="incidentState" 
            value={formData.incidentState} 
            onChange={e => setFormData({...formData, incidentState: e.target.value})} 
            required 
            className="bg-gray-900 border-gray-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalClaimAmount">Total Claim Amount ($)</Label>
        <Input 
          id="totalClaimAmount" 
          type="number" 
          value={formData.totalClaimAmount} 
          onChange={e => setFormData({...formData, totalClaimAmount: e.target.value})} 
          required 
          className="bg-gray-900 border-gray-800"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="injuryNarrative">Injury Narrative</Label>
        <Textarea 
          id="injuryNarrative" 
          value={formData.injuryNarrative} 
          onChange={e => setFormData({...formData, injuryNarrative: e.target.value})} 
          required 
          className="bg-gray-900 border-gray-800 min-h-[120px]"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
        {isLoading ? "Analyzing Risk..." : "Submit for AI Analysis"}
      </Button>
    </form>
  );
}
