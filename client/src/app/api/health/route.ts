import { NextResponse } from "next/server";

// Health check endpoint for the frontend
export async function GET() {
  try {
    // Get memory usage
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    const memPercentage = (usedMem / totalMem) * 100;

    // Check if we can reach the backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let backendStatus = "unknown";

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          backendStatus = "connected";
        } else {
          backendStatus = "error";
        }
      } catch (error) {
        backendStatus = "unreachable";
      }
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "production",
      backend: backendStatus,
      memory: {
        used: Math.round(usedMem / 1024 / 1024), // MB
        total: Math.round(totalMem / 1024 / 1024), // MB
        percentage: Math.round(memPercentage),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
