import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard analytics data
    const dashboardData = {
      activeAgents: 12,
      totalExecutions: 1847,
      avgResponseTime: 1.2,
      successRate: 98.5,
      newAgents: 3,
      recentExecutions: 127,
      responseTimeDelta: '0.3',
      successRateDelta: 2.1,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    );
  }
}
