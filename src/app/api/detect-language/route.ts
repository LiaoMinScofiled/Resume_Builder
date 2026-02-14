import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    if (ip === 'unknown') {
      return NextResponse.json({ language: 'en', country: 'unknown' });
    }

    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    if (data.status === 'fail') {
      return NextResponse.json({ language: 'en', country: 'unknown' });
    }

    const isChina = data.countryCode === 'CN';
    const language = isChina ? 'zh' : 'en';

    return NextResponse.json({
      language,
      country: data.countryCode,
      countryName: data.country,
      ip: data.query,
    });
  } catch (error) {
    console.error('Error detecting IP location:', error);
    return NextResponse.json({ language: 'en', country: 'unknown' }, { status: 500 });
  }
}