import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AboutCard() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>OpenFOAM AI Agent</CardTitle>
          <CardDescription>An automated web-based AI CFD tool</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground/90 leading-normal prose"> 
          <p className="mb-3 font-semibold">How to get started:</p>
          <ul className="flex flex-col mb-2">
            <li>→ Describe the simulation you would like to run</li>
            <li>→ Check the generated OpenFOAM input files</li>
            <li>→ Run the simulation on a remote server</li>
            <li>→ Analyse the results</li>
            <li></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
