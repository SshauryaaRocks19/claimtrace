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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Claim Details</h2>
        <Button type="button" variant="outline" onClick={autofillDemo} className="border-primary/30 text-primary hover:bg-primary/10">
          Autofill Demo Claim (Ring A)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="attorneyName" className="text-lg">Attorney Name</Label>
          <Input 
            id="attorneyName" 
            value={formData.attorneyName} 
            onChange={e => setFormData({...formData, attorneyName: e.target.value})} 
            required 
            className="text-lg py-6 bg-background border-input"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="medicalProvider" className="text-lg">Medical Provider</Label>
          <Input 
            id="medicalProvider" 
            value={formData.medicalProvider} 
            onChange={e => setFormData({...formData, medicalProvider: e.target.value})} 
            required 
            className="text-lg py-6 bg-background border-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="repairShop" className="text-lg">Repair Shop</Label>
          <Input 
            id="repairShop" 
            value={formData.repairShop} 
            onChange={e => setFormData({...formData, repairShop: e.target.value})} 
            className="text-lg py-6 bg-background border-input"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="incidentState" className="text-lg">Incident State (e.g. SC, NY)</Label>
          <Input 
            id="incidentState" 
            value={formData.incidentState} 
            onChange={e => setFormData({...formData, incidentState: e.target.value})} 
            required 
            className="text-lg py-6 bg-background border-input"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="totalClaimAmount" className="text-lg">Total Claim Amount ($)</Label>
        <Input 
          id="totalClaimAmount" 
          type="number" 
          value={formData.totalClaimAmount} 
          onChange={e => setFormData({...formData, totalClaimAmount: e.target.value})} 
          required 
          className="text-lg py-6 bg-background border-input"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="injuryNarrative" className="text-lg">Injury Narrative</Label>
        <Textarea 
          id="injuryNarrative" 
          value={formData.injuryNarrative} 
          onChange={e => setFormData({...formData, injuryNarrative: e.target.value})} 
          required 
          className="text-lg p-6 bg-background border-input min-h-[160px] resize-none"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full h-16 text-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full mt-4 transition-all">
        {isLoading ? "Initializing Investigation..." : "Investigate Claim"}
      </Button>
    </form>
  );
}
