"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Activity, CheckCircle2 } from "lucide-react"
async function predictParkinson(features: number[]) {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  })

  return await response.json()
}


interface FeatureInputs {
  mdvpFo: string
  mdvpFhi: string
  mdvpFlo: string
  mdvpJitter: string
  mdvpJitterAbs: string
  mdvpRAP: string
  mdvpPPQ: string
  jitterDDP: string
  mdvpShimmer: string
  mdvpShimmerDb: string
  shimmerAPQ3: string
  shimmerAPQ5: string
  mdvpAPQ: string
  shimmerDDA: string
  nhr: string
  hnr: string
  rpde: string
  dfa: string
  spread1: string
  spread2: string
  d2: string
  ppe: string
}

interface PredictionResult {
  diagnosis: "Positive" | "Negative"
  confidence: number
}

export default function ParkinsonsDashboard() {
  const [inputs, setInputs] = useState<FeatureInputs>({
    mdvpFo: "",
    mdvpFhi: "",
    mdvpFlo: "",
    mdvpJitter: "",
    mdvpJitterAbs: "",
    mdvpRAP: "",
    mdvpPPQ: "",
    jitterDDP: "",
    mdvpShimmer: "",
    mdvpShimmerDb: "",
    shimmerAPQ3: "",
    shimmerAPQ5: "",
    mdvpAPQ: "",
    shimmerDDA: "",
    nhr: "",
    hnr: "",
    rpde: "",
    dfa: "",
    spread1: "",
    spread2: "",
    d2: "",
    ppe: "",
  })

  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof FeatureInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handlePredict = async () => {
  setIsLoading(true)

  const features = Object.values(inputs).map((val) =>
    parseFloat(val as string) || 0
  )

  try {
    const result = await predictParkinson(features)

    setResult({
      diagnosis: result.prediction === 1 ? "Positive" : "Negative",
      confidence: Number((result.confidence * 100).toFixed(2)),

    })
  } catch (error) {
    console.error("Prediction error:", error)
  }

  setIsLoading(false)
}


  const inputFields = [
    { key: "mdvpFo" as const, label: "MDVP:Fo(Hz)", description: "Average vocal fundamental frequency" },
    { key: "mdvpFhi" as const, label: "MDVP:Fhi(Hz)", description: "Maximum vocal fundamental frequency" },
    { key: "mdvpFlo" as const, label: "MDVP:Flo(Hz)", description: "Minimum vocal fundamental frequency" },
    { key: "mdvpJitter" as const, label: "MDVP:Jitter(%)", description: "Jitter percentage" },
    { key: "mdvpJitterAbs" as const, label: "MDVP:Jitter(Abs)", description: "Absolute jitter in microseconds" },
    { key: "mdvpRAP" as const, label: "MDVP:RAP", description: "Relative amplitude perturbation" },
    { key: "mdvpPPQ" as const, label: "MDVP:PPQ", description: "Five-point period perturbation quotient" },
    { key: "jitterDDP" as const, label: "Jitter:DDP", description: "Average absolute difference of differences" },
    { key: "mdvpShimmer" as const, label: "MDVP:Shimmer", description: "Local shimmer" },
    { key: "mdvpShimmerDb" as const, label: "MDVP:Shimmer(dB)", description: "Local shimmer in dB" },
    { key: "shimmerAPQ3" as const, label: "Shimmer:APQ3", description: "Three-point amplitude perturbation quotient" },
    { key: "shimmerAPQ5" as const, label: "Shimmer:APQ5", description: "Five-point amplitude perturbation quotient" },
    { key: "mdvpAPQ" as const, label: "MDVP:APQ", description: "Amplitude perturbation quotient" },
    { key: "shimmerDDA" as const, label: "Shimmer:DDA", description: "Average absolute difference of differences" },
    { key: "nhr" as const, label: "NHR", description: "Noise-to-harmonics ratio" },
    { key: "hnr" as const, label: "HNR", description: "Harmonics-to-noise ratio" },
    { key: "rpde" as const, label: "RPDE", description: "Recurrence period density entropy" },
    { key: "dfa" as const, label: "DFA", description: "Detrended fluctuation analysis" },
    { key: "spread1" as const, label: "Spread1", description: "Nonlinear measure of fundamental frequency variation" },
    { key: "spread2" as const, label: "Spread2", description: "Nonlinear measure of fundamental frequency variation" },
    { key: "d2" as const, label: "D2", description: "Correlation dimension" },
    { key: "ppe" as const, label: "PPE", description: "Pitch period entropy" },
  ]

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">
            Parkinson's Disease Diagnostic System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Advanced machine learning-powered diagnostic tool for early detection of Parkinson's disease using voice
            biomarkers and acoustic analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Patient Feature Analysis
                </CardTitle>
                <CardDescription>
                  Enter the 22 acoustic and voice measurement features for diagnostic prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {inputFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium">
                          {field.label}
                        </Label>
                        <Input
                          id={field.key}
                          type="number"
                          step="any"
                          placeholder="0.00"
                          value={inputs[field.key]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={handlePredict}
                    disabled={isLoading || Object.values(inputs).some((val) => val === "")}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Analyzing Data...
                      </>
                    ) : (
                      "Generate Diagnostic Prediction"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Result Card Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle>Diagnostic Result</CardTitle>
                  <CardDescription>AI-powered prediction analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {!result ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Complete all 22 feature inputs and click the predict button to generate diagnostic results
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Diagnosis Status */}
                      <div
                        className={`p-6 rounded-lg border-2 ${
                          result.diagnosis === "Positive"
                            ? "bg-destructive/5 border-destructive"
                            : "bg-primary/5 border-primary"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {result.diagnosis === "Positive" ? (
                            <AlertCircle className="w-6 h-6 text-destructive" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          )}
                          <h3 className="text-lg font-semibold">Diagnosis</h3>
                        </div>
                        <p
                          className={`text-3xl font-bold ${
                            result.diagnosis === "Positive" ? "text-destructive" : "text-primary"
                          }`}
                        >
                          {result.diagnosis}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {result.diagnosis === "Positive"
                            ? "Indicators suggest presence of Parkinson's Disease"
                            : "No significant indicators detected"}
                        </p>
                      </div>

                      {/* Confidence Score */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Confidence Level</span>
                          <span className="text-2xl font-bold text-primary">{result.confidence}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Model prediction confidence score based on acoustic feature analysis
                        </p>
                      </div>

                      {/* Medical Disclaimer */}
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">Medical Disclaimer:</strong> This diagnostic tool is for
                          research and educational purposes only. Results should be confirmed by qualified healthcare
                          professionals. Always consult with a neurologist for official diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
