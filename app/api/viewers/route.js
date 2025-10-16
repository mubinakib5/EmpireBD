import { NextResponse } from 'next/server';

// Viewer tracking has been removed. All endpoints return 410 Gone or a disabled response.

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId') || null;
  return NextResponse.json({
    productId,
    viewerCount: 0,
    message: 'Viewer tracking removed',
    timestamp: new Date().toISOString()
  }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({
    message: 'Viewer tracking removed',
  }, { status: 410 });
}

export async function PATCH() {
  return NextResponse.json({
    message: 'Viewer tracking removed',
  }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({
    message: 'Viewer tracking removed',
  }, { status: 410 });
}