"use client"

import * as React from "react"
import { Button } from "@danky/ui"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@danky/ui"
import { Icons } from "@danky/ui"

export default function Page() {
  return (
    <main className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Danky</CardTitle>
          <CardDescription>Your AI chatbot with a beautiful UI</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a test page to verify that shadcn components are working correctly.</p>
        </CardContent>
        <CardFooter>
          <Button>
            <Icons.rocket className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
